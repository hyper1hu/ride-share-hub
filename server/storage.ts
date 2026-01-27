import { 
  type User, type InsertUser, 
  type Car, type InsertCar, 
  type Booking, type InsertBooking,
  type Customer, type InsertCustomer,
  type Driver, type InsertDriver,
  type Admin, type InsertAdmin,
  type Otp, type InsertOtp,
  type AuditLog, type InsertAuditLog,
  type RateLimit, type InsertRateLimit,
  type DriverVerificationStatus,
  customers, drivers, cars, bookings, users, admins, otps, auditLogs, rateLimits
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, lt, gte } from "drizzle-orm";

export interface OtpRecord {
  id: string;
  mobile: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  userType: "customer" | "driver";
  attempts: number;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByMobile(mobile: string): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  getDriver(id: string): Promise<Driver | undefined>;
  getDriverByMobile(mobile: string): Promise<Driver | undefined>;
  getDrivers(): Promise<Driver[]>;
  getDriversByStatus(status: DriverVerificationStatus): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: string, driver: Partial<Driver>): Promise<Driver | undefined>;
  
  getCars(): Promise<Car[]>;
  getCar(id: string): Promise<Car | undefined>;
  getCarsByDriverId(driverId: string): Promise<Car[]>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, car: Partial<Car>): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;
  
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByCarId(carId: string): Promise<Booking[]>;
  getBookingsByCustomerId(customerId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking, totalFare: number): Promise<Booking>;
  updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | undefined>;
  
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  createOtp(mobile: string, userType: "customer" | "driver"): Promise<OtpRecord>;
  getOtp(mobile: string, userType: "customer" | "driver"): Promise<OtpRecord | undefined>;
  verifyOtp(mobile: string, otp: string, userType: "customer" | "driver"): Promise<boolean>;
  clearOtp(mobile: string, userType: "customer" | "driver"): Promise<void>;
  
  // Rate limiting
  checkRateLimit(identifier: string, limitType: string, maxAttempts: number, windowMinutes: number): Promise<{ allowed: boolean; lockedUntil?: Date }>;
  recordAttempt(identifier: string, limitType: string): Promise<void>;
  lockIdentifier(identifier: string, limitType: string, lockMinutes: number): Promise<void>;
  
  // Audit logging
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Clean up expired OTPs periodically
    setInterval(() => this.cleanupExpiredOtps(), 5 * 60 * 1000); // Every 5 minutes
  }

  private async cleanupExpiredOtps(): Promise<void> {
    try {
      await db.delete(otps).where(lt(otps.expiresAt, new Date()));
    } catch (error) {
      console.error("[CLEANUP] Failed to clean expired OTPs:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [user] = await db.insert(users).values({ ...insertUser, id }).returning();
    return user;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomerByMobile(mobile: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.mobile, mobile));
    return customer || undefined;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const [customer] = await db.insert(customers).values({ 
      ...insertCustomer, 
      id 
    }).returning();
    return customer;
  }

  async getDriver(id: string): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver || undefined;
  }

  async getDriverByMobile(mobile: string): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.mobile, mobile));
    return driver || undefined;
  }

  async getDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers).orderBy(desc(drivers.createdAt));
  }

  async getDriversByStatus(status: DriverVerificationStatus): Promise<Driver[]> {
    return await db.select().from(drivers)
      .where(eq(drivers.verificationStatus, status))
      .orderBy(desc(drivers.createdAt));
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = randomUUID();
    const [driver] = await db.insert(drivers).values({ 
      ...insertDriver, 
      id,
      verificationStatus: "pending"
    }).returning();
    return driver;
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver | undefined> {
    const [driver] = await db.update(drivers)
      .set(updates)
      .where(eq(drivers.id, id))
      .returning();
    return driver || undefined;
  }

  async getCars(): Promise<Car[]> {
    return await db.select().from(cars).orderBy(desc(cars.createdAt));
  }

  async getCar(id: string): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car || undefined;
  }

  async getCarsByDriverId(driverId: string): Promise<Car[]> {
    return await db.select().from(cars)
      .where(eq(cars.driverId, driverId))
      .orderBy(desc(cars.createdAt));
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = randomUUID();
    const [car] = await db.insert(cars).values({
      ...insertCar,
      id,
      driverId: insertCar.driverId || "",
      waypoints: insertCar.waypoints || [],
      status: "available"
    }).returning();
    return car;
  }

  async updateCar(id: string, updates: Partial<Car>): Promise<Car | undefined> {
    const [car] = await db.update(cars)
      .set(updates)
      .where(eq(cars.id, id))
      .returning();
    return car || undefined;
  }

  async deleteCar(id: string): Promise<boolean> {
    const result = await db.delete(cars).where(eq(cars.id, id)).returning();
    return result.length > 0;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingsByCarId(carId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.carId, carId));
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.customerId, customerId))
      .orderBy(desc(bookings.createdAt));
  }

  async createBooking(insertBooking: InsertBooking, totalFare: number): Promise<Booking> {
    const id = randomUUID();
    const [booking] = await db.insert(bookings).values({
      ...insertBooking,
      id,
      customerId: insertBooking.customerId || "",
      totalFare,
      status: "confirmed"
    }).returning();
    return booking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const [booking] = await db.update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const [admin] = await db.insert(admins).values({
      ...insertAdmin,
      id
    }).returning();
    return admin;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(mobile: string, userType: "customer" | "driver"): Promise<OtpRecord> {
    // Clear any existing OTP for this mobile/userType
    await db.delete(otps).where(
      and(
        eq(otps.mobile, mobile),
        eq(otps.userType, userType)
      )
    );

    const id = randomUUID();
    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const [record] = await db.insert(otps).values({
      id,
      mobile,
      otp: otpCode,
      userType,
      verified: 0,
      attempts: 0,
      expiresAt,
    }).returning();

    return {
      id: record.id,
      mobile: record.mobile,
      otp: record.otp,
      userType: record.userType as "customer" | "driver",
      verified: record.verified === 1,
      attempts: record.attempts,
      expiresAt: record.expiresAt,
    };
  }

  async getOtp(mobile: string, userType: "customer" | "driver"): Promise<OtpRecord | undefined> {
    const [record] = await db.select().from(otps)
      .where(
        and(
          eq(otps.mobile, mobile),
          eq(otps.userType, userType),
          gte(otps.expiresAt, new Date())
        )
      )
      .orderBy(desc(otps.createdAt))
      .limit(1);

    if (!record) return undefined;

    return {
      id: record.id,
      mobile: record.mobile,
      otp: record.otp,
      userType: record.userType as "customer" | "driver",
      verified: record.verified === 1,
      attempts: record.attempts,
      expiresAt: record.expiresAt,
    };
  }

  async verifyOtp(mobile: string, otp: string, userType: "customer" | "driver"): Promise<boolean> {
    const record = await this.getOtp(mobile, userType);
    if (!record) return false;
    
    // Check if already locked due to too many attempts
    if (record.attempts >= 5) {
      return false;
    }

    // Increment attempts
    await db.update(otps)
      .set({ attempts: record.attempts + 1 })
      .where(eq(otps.id, record.id));

    if (record.otp !== otp) {
      return false;
    }

    // Mark as verified
    await db.update(otps)
      .set({ verified: 1 })
      .where(eq(otps.id, record.id));

    return true;
  }

  async clearOtp(mobile: string, userType: "customer" | "driver"): Promise<void> {
    await db.delete(otps).where(
      and(
        eq(otps.mobile, mobile),
        eq(otps.userType, userType)
      )
    );
  }

  async checkRateLimit(
    identifier: string, 
    limitType: string, 
    maxAttempts: number, 
    windowMinutes: number
  ): Promise<{ allowed: boolean; lockedUntil?: Date }> {
    const [record] = await db.select().from(rateLimits)
      .where(
        and(
          eq(rateLimits.identifier, identifier),
          eq(rateLimits.limitType, limitType)
        )
      )
      .limit(1);

    const now = new Date();

    // Check if locked
    if (record?.lockedUntil && record.lockedUntil > now) {
      return { allowed: false, lockedUntil: record.lockedUntil };
    }

    // Check if within window
    if (record) {
      const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
      
      if (record.lastAttempt > windowStart) {
        if (record.attempts >= maxAttempts) {
          return { allowed: false };
        }
      } else {
        // Reset counter if outside window
        await db.update(rateLimits)
          .set({ attempts: 0, lastAttempt: now })
          .where(eq(rateLimits.id, record.id));
      }
    }

    return { allowed: true };
  }

  async recordAttempt(identifier: string, limitType: string): Promise<void> {
    const [existing] = await db.select().from(rateLimits)
      .where(
        and(
          eq(rateLimits.identifier, identifier),
          eq(rateLimits.limitType, limitType)
        )
      )
      .limit(1);

    if (existing) {
      await db.update(rateLimits)
        .set({ 
          attempts: existing.attempts + 1,
          lastAttempt: new Date()
        })
        .where(eq(rateLimits.id, existing.id));
    } else {
      const id = randomUUID();
      await db.insert(rateLimits).values({
        id,
        identifier,
        limitType,
        attempts: 1,
        lastAttempt: new Date(),
      });
    }
  }

  async lockIdentifier(identifier: string, limitType: string, lockMinutes: number): Promise<void> {
    const lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
    
    const [existing] = await db.select().from(rateLimits)
      .where(
        and(
          eq(rateLimits.identifier, identifier),
          eq(rateLimits.limitType, limitType)
        )
      )
      .limit(1);

    if (existing) {
      await db.update(rateLimits)
        .set({ lockedUntil })
        .where(eq(rateLimits.id, existing.id));
    } else {
      const id = randomUUID();
      await db.insert(rateLimits).values({
        id,
        identifier,
        limitType,
        attempts: 0,
        lockedUntil,
        lastAttempt: new Date(),
      });
    }
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const [auditLog] = await db.insert(auditLogs).values({
      ...log,
      id,
    }).returning();
    return auditLog;
  }
}

export const storage = new DatabaseStorage();
