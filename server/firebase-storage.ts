import { 
  type Customer, type InsertCustomer,
  type Driver, type InsertDriver,
  type Car, type InsertCar, 
  type Booking, type InsertBooking,
  type Admin, type InsertAdmin,
  type AuditLog, type InsertAuditLog,
  type DriverVerificationStatus,
  type DriverVehicle, type InsertDriverVehicle,
  type Inquiry, type InsertInquiry,
  type Message, type InsertMessage,
  type SupportTicket, type InsertSupportTicket,
  type DriverSchedule, type InsertDriverSchedule,
} from "@shared/schema";
import { firestore, COLLECTIONS, generateId, toDate, toTimestamp } from "./firebase-db";
import type { IStorage, OtpRecord } from "./storage";

export class FirebaseStorage implements IStorage {
  constructor() {
    // Clean up expired OTPs periodically
    setInterval(() => this.cleanupExpiredOtps(), 5 * 60 * 1000); // Every 5 minutes
  }

  private async cleanupExpiredOtps(): Promise<void> {
    try {
      const now = new Date();
      const snapshot = await firestore
        .collection(COLLECTIONS.OTPS)
        .where("expiresAt", "<", now)
        .get();

      const batch = firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      if (snapshot.size > 0) {
        console.log(`[CLEANUP] Deleted ${snapshot.size} expired OTPs`);
      }
    } catch (error) {
      console.error("[CLEANUP] Failed to clean expired OTPs:", error);
    }
  }

  // User methods (deprecated - keeping for compatibility)
  async getUser(id: string): Promise<any | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return undefined;
  }

  async createUser(user: any): Promise<any> {
    throw new Error("User creation not supported");
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    const doc = await firestore.collection(COLLECTIONS.CUSTOMERS).doc(id).get();
    if (!doc.exists) return undefined;
    
    const data = doc.data()!;
    return {
      id: doc.id,
      mobile: data.mobile,
      name: data.name,
      age: data.age,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async getCustomerByMobile(mobile: string): Promise<Customer | undefined> {
    const snapshot = await firestore
      .collection(COLLECTIONS.CUSTOMERS)
      .where("mobile", "==", mobile)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      mobile: data.mobile,
      name: data.name,
      age: data.age,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async getCustomers(): Promise<Customer[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.CUSTOMERS)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        mobile: data.mobile,
        name: data.name,
        age: data.age,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = generateId();
    const customer = {
      mobile: insertCustomer.mobile,
      name: insertCustomer.name,
      age: insertCustomer.age,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.CUSTOMERS).doc(id).set(customer);

    return {
      id,
      ...customer,
    };
  }

  // Driver methods
  async getDriver(id: string): Promise<Driver | undefined> {
    const doc = await firestore.collection(COLLECTIONS.DRIVERS).doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data()!;
    return {
      id: doc.id,
      mobile: data.mobile,
      name: data.name,
      age: data.age,
      aadhaarNumber: data.aadhaarNumber,
      licenseNumber: data.licenseNumber,
      aadhaarImage: data.aadhaarImage || null,
      licenseImage: data.licenseImage || null,
      rcImage: data.rcImage || null,
      verificationStatus: data.verificationStatus,
      rejectionReason: data.rejectionReason || null,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async getDriverByMobile(mobile: string): Promise<Driver | undefined> {
    const snapshot = await firestore
      .collection(COLLECTIONS.DRIVERS)
      .where("mobile", "==", mobile)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      mobile: data.mobile,
      name: data.name,
      age: data.age,
      aadhaarNumber: data.aadhaarNumber,
      licenseNumber: data.licenseNumber,
      aadhaarImage: data.aadhaarImage || null,
      licenseImage: data.licenseImage || null,
      rcImage: data.rcImage || null,
      verificationStatus: data.verificationStatus,
      rejectionReason: data.rejectionReason || null,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async getDrivers(): Promise<Driver[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.DRIVERS)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        mobile: data.mobile,
        name: data.name,
        age: data.age,
        aadhaarNumber: data.aadhaarNumber,
        licenseNumber: data.licenseNumber,
        aadhaarImage: data.aadhaarImage || null,
        licenseImage: data.licenseImage || null,
        rcImage: data.rcImage || null,
        verificationStatus: data.verificationStatus,
        rejectionReason: data.rejectionReason || null,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async getDriversByStatus(status: DriverVerificationStatus): Promise<Driver[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.DRIVERS)
      .where("verificationStatus", "==", status)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        mobile: data.mobile,
        name: data.name,
        age: data.age,
        aadhaarNumber: data.aadhaarNumber,
        licenseNumber: data.licenseNumber,
        aadhaarImage: data.aadhaarImage || null,
        licenseImage: data.licenseImage || null,
        rcImage: data.rcImage || null,
        verificationStatus: data.verificationStatus,
        rejectionReason: data.rejectionReason || null,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = generateId();
    const driver = {
      mobile: insertDriver.mobile,
      name: insertDriver.name,
      age: insertDriver.age,
      aadhaarNumber: insertDriver.aadhaarNumber,
      licenseNumber: insertDriver.licenseNumber,
      aadhaarImage: insertDriver.aadhaarImage || null,
      licenseImage: insertDriver.licenseImage || null,
      rcImage: insertDriver.rcImage || null,
      verificationStatus: "pending" as const,
      rejectionReason: null,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.DRIVERS).doc(id).set(driver);

    return {
      id,
      ...driver,
    };
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver | undefined> {
    const docRef = firestore.collection(COLLECTIONS.DRIVERS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return undefined;

    await docRef.update(updates);

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      mobile: data.mobile,
      name: data.name,
      age: data.age,
      aadhaarNumber: data.aadhaarNumber,
      licenseNumber: data.licenseNumber,
      aadhaarImage: data.aadhaarImage || null,
      licenseImage: data.licenseImage || null,
      rcImage: data.rcImage || null,
      verificationStatus: data.verificationStatus,
      rejectionReason: data.rejectionReason || null,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  // Car methods
  async getCars(): Promise<Car[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.CARS)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        driverId: data.driverId,
        vehicleType: data.vehicleType,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        carModel: data.carModel,
        carNumber: data.carNumber,
        origin: data.origin,
        destination: data.destination,
        waypoints: data.waypoints || [],
        fare: data.fare,
        returnFare: data.returnFare,
        departureTime: data.departureTime,
        returnTime: data.returnTime,
        seatsAvailable: data.seatsAvailable,
        status: data.status,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async getCar(id: string): Promise<Car | undefined> {
    const doc = await firestore.collection(COLLECTIONS.CARS).doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data()!;
    return {
      id: doc.id,
      driverId: data.driverId,
      vehicleType: data.vehicleType,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      carModel: data.carModel,
      carNumber: data.carNumber,
      origin: data.origin,
      destination: data.destination,
      waypoints: data.waypoints || [],
      fare: data.fare,
      returnFare: data.returnFare,
      departureTime: data.departureTime,
      returnTime: data.returnTime,
      seatsAvailable: data.seatsAvailable,
      status: data.status,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async getCarsByDriverId(driverId: string): Promise<Car[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.CARS)
      .where("driverId", "==", driverId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        driverId: data.driverId,
        vehicleType: data.vehicleType,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        carModel: data.carModel,
        carNumber: data.carNumber,
        origin: data.origin,
        destination: data.destination,
        waypoints: data.waypoints || [],
        fare: data.fare,
        returnFare: data.returnFare,
        departureTime: data.departureTime,
        returnTime: data.returnTime,
        seatsAvailable: data.seatsAvailable,
        status: data.status,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = generateId();
    const car = {
      driverId: insertCar.driverId || "",
      vehicleType: insertCar.vehicleType,
      driverName: insertCar.driverName,
      driverPhone: insertCar.driverPhone,
      carModel: insertCar.carModel,
      carNumber: insertCar.carNumber,
      origin: insertCar.origin,
      destination: insertCar.destination,
      waypoints: insertCar.waypoints || [],
      fare: insertCar.fare,
      returnFare: insertCar.returnFare,
      departureTime: insertCar.departureTime,
      returnTime: insertCar.returnTime,
      seatsAvailable: insertCar.seatsAvailable,
      status: "available",
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.CARS).doc(id).set(car);

    return {
      id,
      ...car,
    };
  }

  async updateCar(id: string, updates: Partial<Car>): Promise<Car | undefined> {
    const docRef = firestore.collection(COLLECTIONS.CARS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return undefined;

    await docRef.update(updates);

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      driverId: data.driverId,
      vehicleType: data.vehicleType,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      carModel: data.carModel,
      carNumber: data.carNumber,
      origin: data.origin,
      destination: data.destination,
      waypoints: data.waypoints || [],
      fare: data.fare,
      returnFare: data.returnFare,
      departureTime: data.departureTime,
      returnTime: data.returnTime,
      seatsAvailable: data.seatsAvailable,
      status: data.status,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async deleteCar(id: string): Promise<boolean> {
    try {
      await firestore.collection(COLLECTIONS.CARS).doc(id).delete();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.BOOKINGS)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        carId: data.carId,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        pickupLocation: data.pickupLocation || null,
        dropLocation: data.dropLocation || null,
        seatsBooked: data.seatsBooked,
        tripType: data.tripType,
        totalFare: data.totalFare,
        status: data.status,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const doc = await firestore.collection(COLLECTIONS.BOOKINGS).doc(id).get();
    if (!doc.exists) return undefined;

    const data = doc.data()!;
    return {
      id: doc.id,
      carId: data.carId,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      pickupLocation: data.pickupLocation || null,
      dropLocation: data.dropLocation || null,
      seatsBooked: data.seatsBooked,
      tripType: data.tripType,
      totalFare: data.totalFare,
      status: data.status,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async getBookingsByCarId(carId: string): Promise<Booking[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.BOOKINGS)
      .where("carId", "==", carId)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        carId: data.carId,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        pickupLocation: data.pickupLocation || null,
        dropLocation: data.dropLocation || null,
        seatsBooked: data.seatsBooked,
        tripType: data.tripType,
        totalFare: data.totalFare,
        status: data.status,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.BOOKINGS)
      .where("customerId", "==", customerId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        carId: data.carId,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        pickupLocation: data.pickupLocation || null,
        dropLocation: data.dropLocation || null,
        seatsBooked: data.seatsBooked,
        tripType: data.tripType,
        totalFare: data.totalFare,
        status: data.status,
        createdAt: toDate(data.createdAt) || new Date(),
      };
    });
  }

  async createBooking(insertBooking: InsertBooking, totalFare: number): Promise<Booking> {
    const id = generateId();
    const booking = {
      carId: insertBooking.carId,
      customerId: insertBooking.customerId || "",
      customerName: insertBooking.customerName,
      customerPhone: insertBooking.customerPhone,
      pickupLocation: insertBooking.pickupLocation || null,
      dropLocation: insertBooking.dropLocation || null,
      seatsBooked: insertBooking.seatsBooked,
      tripType: insertBooking.tripType,
      totalFare,
      status: "confirmed",
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.BOOKINGS).doc(id).set(booking);

    return {
      id,
      ...booking,
    };
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const docRef = firestore.collection(COLLECTIONS.BOOKINGS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return undefined;

    await docRef.update(updates);

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data()!;

    return {
      id: updatedDoc.id,
      carId: data.carId,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      pickupLocation: data.pickupLocation || null,
      dropLocation: data.dropLocation || null,
      seatsBooked: data.seatsBooked,
      tripType: data.tripType,
      totalFare: data.totalFare,
      status: data.status,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  // Admin methods
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const snapshot = await firestore
      .collection(COLLECTIONS.ADMINS)
      .where("username", "==", username)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      username: data.username,
      passwordHash: data.passwordHash,
      createdAt: toDate(data.createdAt) || new Date(),
    };
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = generateId();
    const admin = {
      username: insertAdmin.username,
      passwordHash: insertAdmin.passwordHash,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.ADMINS).doc(id).set(admin);

    return {
      id,
      ...admin,
    };
  }

  // OTP methods
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(mobile: string, userType: "customer" | "driver"): Promise<OtpRecord> {
    // Clear any existing OTP for this mobile/userType
    const existingSnapshot = await firestore
      .collection(COLLECTIONS.OTPS)
      .where("mobile", "==", mobile)
      .where("userType", "==", userType)
      .get();

    const batch = firestore.batch();
    existingSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    const id = generateId();
    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const otpData = {
      mobile,
      otp: otpCode,
      userType,
      verified: false,
      attempts: 0,
      expiresAt,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.OTPS).doc(id).set(otpData);

    return {
      id,
      mobile,
      otp: otpCode,
      userType,
      verified: false,
      attempts: 0,
      expiresAt,
    };
  }

  async getOtp(mobile: string, userType: "customer" | "driver"): Promise<OtpRecord | undefined> {
    const now = new Date();
    const snapshot = await firestore
      .collection(COLLECTIONS.OTPS)
      .where("mobile", "==", mobile)
      .where("userType", "==", userType)
      .where("expiresAt", ">=", now)
      .orderBy("expiresAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      mobile: data.mobile,
      otp: data.otp,
      userType: data.userType,
      verified: data.verified,
      attempts: data.attempts,
      expiresAt: toDate(data.expiresAt) || new Date(),
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
    await firestore
      .collection(COLLECTIONS.OTPS)
      .doc(record.id)
      .update({ attempts: record.attempts + 1 });

    if (record.otp !== otp) {
      return false;
    }

    // Mark as verified
    await firestore
      .collection(COLLECTIONS.OTPS)
      .doc(record.id)
      .update({ verified: true });

    return true;
  }

  async clearOtp(mobile: string, userType: "customer" | "driver"): Promise<void> {
    const snapshot = await firestore
      .collection(COLLECTIONS.OTPS)
      .where("mobile", "==", mobile)
      .where("userType", "==", userType)
      .get();

    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  // Rate limiting methods
  async checkRateLimit(
    identifier: string,
    limitType: string,
    maxAttempts: number,
    windowMinutes: number
  ): Promise<{ allowed: boolean; lockedUntil?: Date }> {
    const snapshot = await firestore
      .collection(COLLECTIONS.RATE_LIMITS)
      .where("identifier", "==", identifier)
      .where("limitType", "==", limitType)
      .limit(1)
      .get();

    const now = new Date();

    if (snapshot.empty) {
      return { allowed: true };
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Check if locked
    if (data.lockedUntil && toDate(data.lockedUntil)! > now) {
      return { allowed: false, lockedUntil: toDate(data.lockedUntil) };
    }

    // Check if within window
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
    const lastAttempt = toDate(data.lastAttempt) || new Date(0);

    if (lastAttempt > windowStart) {
      if (data.attempts >= maxAttempts) {
        return { allowed: false };
      }
    } else {
      // Reset counter if outside window
      await firestore
        .collection(COLLECTIONS.RATE_LIMITS)
        .doc(doc.id)
        .update({ attempts: 0, lastAttempt: now });
    }

    return { allowed: true };
  }

  async recordAttempt(identifier: string, limitType: string): Promise<void> {
    const snapshot = await firestore
      .collection(COLLECTIONS.RATE_LIMITS)
      .where("identifier", "==", identifier)
      .where("limitType", "==", limitType)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      await firestore
        .collection(COLLECTIONS.RATE_LIMITS)
        .doc(doc.id)
        .update({
          attempts: data.attempts + 1,
          lastAttempt: new Date(),
        });
    } else {
      const id = generateId();
      await firestore
        .collection(COLLECTIONS.RATE_LIMITS)
        .doc(id)
        .set({
          identifier,
          limitType,
          attempts: 1,
          lastAttempt: new Date(),
          createdAt: new Date(),
        });
    }
  }

  async lockIdentifier(identifier: string, limitType: string, lockMinutes: number): Promise<void> {
    const lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);

    const snapshot = await firestore
      .collection(COLLECTIONS.RATE_LIMITS)
      .where("identifier", "==", identifier)
      .where("limitType", "==", limitType)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await firestore
        .collection(COLLECTIONS.RATE_LIMITS)
        .doc(doc.id)
        .update({ lockedUntil });
    } else {
      const id = generateId();
      await firestore
        .collection(COLLECTIONS.RATE_LIMITS)
        .doc(id)
        .set({
          identifier,
          limitType,
          attempts: 0,
          lockedUntil,
          lastAttempt: new Date(),
          createdAt: new Date(),
        });
    }
  }

  // Audit logging
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = generateId();
    const auditLog = {
      mobile: log.mobile,
      userType: log.userType,
      action: log.action,
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
      success: log.success,
      errorMessage: log.errorMessage || null,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.AUDIT_LOGS).doc(id).set(auditLog);

    return {
      id,
      ...auditLog,
    };
  }

  // Driver Vehicles methods
  async createDriverVehicle(vehicle: InsertDriverVehicle & { driverId: string }): Promise<DriverVehicle> {
    const id = generateId();
    const vehicleData = {
      id,
      driverId: vehicle.driverId,
      vehicleType: vehicle.vehicleType,
      vehicleModel: vehicle.vehicleModel,
      vehicleNumber: vehicle.vehicleNumber,
      rcImage: vehicle.rcImage || null,
      insuranceImage: vehicle.insuranceImage || null,
      seatingCapacity: vehicle.seatingCapacity,
      isActive: 1,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.DRIVER_VEHICLES).doc(id).set(vehicleData);
    return vehicleData;
  }

  async getDriverVehicles(driverId: string): Promise<DriverVehicle[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.DRIVER_VEHICLES)
      .where("driverId", "==", driverId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: toDate(data.createdAt),
      } as DriverVehicle;
    });
  }

  async getDriverVehicle(id: string): Promise<DriverVehicle | undefined> {
    const doc = await firestore.collection(COLLECTIONS.DRIVER_VEHICLES).doc(id).get();
    if (!doc.exists) return undefined;
    const data = doc.data()!;
    return {
      ...data,
      createdAt: toDate(data.createdAt),
    } as DriverVehicle;
  }

  async updateDriverVehicle(id: string, updates: Partial<DriverVehicle>): Promise<void> {
    await firestore.collection(COLLECTIONS.DRIVER_VEHICLES).doc(id).update(updates);
  }

  async deleteDriverVehicle(id: string): Promise<void> {
    await firestore.collection(COLLECTIONS.DRIVER_VEHICLES).doc(id).delete();
  }

  // Inquiry methods
  async createInquiry(inquiry: InsertInquiry & { customerId?: string }): Promise<Inquiry> {
    const id = generateId();
    const inquiryData = {
      id,
      customerId: inquiry.customerId || "",
      customerName: inquiry.customerName,
      customerPhone: inquiry.customerPhone,
      vehicleId: inquiry.vehicleId || null,
      driverId: inquiry.driverId || null,
      origin: inquiry.origin,
      destination: inquiry.destination,
      vehicleType: inquiry.vehicleType || null,
      travelDate: inquiry.travelDate || null,
      passengers: inquiry.passengers || null,
      message: inquiry.message || null,
      status: "pending",
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.INQUIRIES).doc(id).set(inquiryData);
    return inquiryData;
  }

  async getInquiries(): Promise<Inquiry[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.INQUIRIES)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: toDate(data.createdAt),
      } as Inquiry;
    });
  }

  async getDriverInquiries(driverId: string): Promise<Inquiry[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.INQUIRIES)
      .where("driverId", "==", driverId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: toDate(data.createdAt),
      } as Inquiry;
    });
  }

  async getCustomerInquiries(customerId: string): Promise<Inquiry[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.INQUIRIES)
      .where("customerId", "==", customerId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: toDate(data.createdAt),
      } as Inquiry;
    });
  }

  async updateInquiry(id: string, updates: Partial<Inquiry>): Promise<void> {
    await firestore.collection(COLLECTIONS.INQUIRIES).doc(id).update(updates);
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = generateId();
    const messageData = {
      id,
      senderId: message.senderId,
      senderType: message.senderType,
      receiverId: message.receiverId,
      receiverType: message.receiverType,
      bookingId: message.bookingId || null,
      message: message.message,
      isRead: 0,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.MESSAGES).doc(id).set(messageData);
    return messageData;
  }

  async getMessages(userId: string, userType: string): Promise<Message[]> {
    const sentSnapshot = await firestore
      .collection(COLLECTIONS.MESSAGES)
      .where("senderId", "==", userId)
      .where("senderType", "==", userType)
      .get();

    const receivedSnapshot = await firestore
      .collection(COLLECTIONS.MESSAGES)
      .where("receiverId", "==", userId)
      .where("receiverType", "==", userType)
      .get();

    const allMessages = [
      ...sentSnapshot.docs.map((doc) => doc.data()),
      ...receivedSnapshot.docs.map((doc) => doc.data()),
    ];

    return allMessages
      .map((data) => ({
        ...data,
        createdAt: toDate(data.createdAt),
      } as Message))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getConversation(user1Id: string, user2Id: string): Promise<Message[]> {
    const snapshot1 = await firestore
      .collection(COLLECTIONS.MESSAGES)
      .where("senderId", "==", user1Id)
      .where("receiverId", "==", user2Id)
      .get();

    const snapshot2 = await firestore
      .collection(COLLECTIONS.MESSAGES)
      .where("senderId", "==", user2Id)
      .where("receiverId", "==", user1Id)
      .get();

    const allMessages = [
      ...snapshot1.docs.map((doc) => doc.data()),
      ...snapshot2.docs.map((doc) => doc.data()),
    ];

    return allMessages
      .map((data) => ({
        ...data,
        createdAt: toDate(data.createdAt),
      } as Message))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async markMessageAsRead(id: string): Promise<void> {
    await firestore.collection(COLLECTIONS.MESSAGES).doc(id).update({ isRead: 1 });
  }

  // Support Ticket methods
  async createSupportTicket(ticket: InsertSupportTicket & { userId?: string }): Promise<SupportTicket> {
    const id = generateId();
    const now = new Date();
    const ticketData = {
      id,
      userId: ticket.userId || "",
      userType: ticket.userType,
      userName: ticket.userName,
      userPhone: ticket.userPhone,
      userEmail: ticket.userEmail || null,
      subject: ticket.subject,
      category: ticket.category,
      description: ticket.description,
      priority: ticket.priority || "medium",
      status: "open",
      adminResponse: null,
      createdAt: now,
      updatedAt: now,
    };

    await firestore.collection(COLLECTIONS.SUPPORT_TICKETS).doc(id).set(ticketData);
    return ticketData;
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.SUPPORT_TICKETS)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as SupportTicket;
    });
  }

  async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.SUPPORT_TICKETS)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as SupportTicket;
    });
  }

  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<void> {
    await firestore.collection(COLLECTIONS.SUPPORT_TICKETS).doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  // Driver Schedule methods
  async createDriverSchedule(schedule: InsertDriverSchedule): Promise<DriverSchedule> {
    const id = generateId();
    const scheduleData = {
      id,
      driverId: schedule.driverId,
      vehicleId: schedule.vehicleId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: 1,
      createdAt: new Date(),
    };

    await firestore.collection(COLLECTIONS.DRIVER_SCHEDULES).doc(id).set(scheduleData);
    return scheduleData;
  }

  async getDriverSchedules(driverId: string): Promise<DriverSchedule[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.DRIVER_SCHEDULES)
      .where("driverId", "==", driverId)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: toDate(data.createdAt),
      } as DriverSchedule;
    });
  }

  async updateDriverSchedule(id: string, updates: Partial<DriverSchedule>): Promise<void> {
    await firestore.collection(COLLECTIONS.DRIVER_SCHEDULES).doc(id).update(updates);
  }

  async deleteDriverSchedule(id: string): Promise<void> {
    await firestore.collection(COLLECTIONS.DRIVER_SCHEDULES).doc(id).delete();
  }
}

export const firebaseStorage = new FirebaseStorage();
