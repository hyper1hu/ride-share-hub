import { type User, type InsertUser, type Car, type InsertCar, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCars(): Promise<Car[]>;
  getCar(id: string): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, car: Partial<Car>): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByCarId(carId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking, totalFare: number): Promise<Booking>;
  updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cars: Map<string, Car>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
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

  async getCars(): Promise<Car[]> {
    return Array.from(this.cars.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCar(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = randomUUID();
    const car: Car = {
      ...insertCar,
      id,
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

  async createBooking(insertBooking: InsertBooking, totalFare: number): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
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
