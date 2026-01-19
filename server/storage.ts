import { 
  type User, type InsertUser, 
  type Car, type InsertCar, 
  type Booking, type InsertBooking,
  type Customer, type InsertCustomer,
  type Driver, type InsertDriver,
  type DriverVerificationStatus
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private customers: Map<string, Customer>;
  private drivers: Map<string, Driver>;
  private cars: Map<string, Car>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.drivers = new Map();
    this.cars = new Map();
    this.bookings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByMobile(mobile: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.mobile === mobile
    );
  }

  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      ...insertCustomer,
      id,
      createdAt: new Date().toISOString(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  async getDriver(id: string): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }

  async getDriverByMobile(mobile: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(
      (driver) => driver.mobile === mobile
    );
  }

  async getDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getDriversByStatus(status: DriverVerificationStatus): Promise<Driver[]> {
    return Array.from(this.drivers.values())
      .filter((driver) => driver.verificationStatus === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = randomUUID();
    const driver: Driver = {
      ...insertDriver,
      id,
      verificationStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    this.drivers.set(id, driver);
    return driver;
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (!driver) return undefined;
    const updatedDriver = { ...driver, ...updates };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }

  async getCars(): Promise<Car[]> {
    return Array.from(this.cars.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCar(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async getCarsByDriverId(driverId: string): Promise<Car[]> {
    return Array.from(this.cars.values())
      .filter((car) => car.driverId === driverId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = randomUUID();
    const car: Car = {
      ...insertCar,
      id,
      driverId: insertCar.driverId || "",
      waypoints: insertCar.waypoints || [],
      status: "available",
      createdAt: new Date().toISOString(),
    };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: string, updates: Partial<Car>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;
    const updatedCar = { ...car, ...updates };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: string): Promise<boolean> {
    return this.cars.delete(id);
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByCarId(carId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.carId === carId
    );
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter((booking) => booking.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBooking(insertBooking: InsertBooking, totalFare: number): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      customerId: insertBooking.customerId || "",
      totalFare,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new MemStorage();
