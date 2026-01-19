import { z } from "zod";

// Car schema for drivers listing their vehicles
export const carSchema = z.object({
  id: z.string(),
  driverName: z.string(),
  driverPhone: z.string(),
  carModel: z.string(),
  carNumber: z.string(),
  origin: z.string(),
  destination: z.string(),
  fare: z.number(),
  returnFare: z.number(),
  departureTime: z.string(),
  returnTime: z.string(),
  seatsAvailable: z.number(),
  status: z.enum(["available", "on_trip", "returning"]),
  createdAt: z.string(),
});

export const insertCarSchema = z.object({
  driverName: z.string().min(2, "Driver name must be at least 2 characters"),
  driverPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  carModel: z.string().min(2, "Car model is required"),
  carNumber: z.string().min(2, "Car number is required"),
  origin: z.string().min(2, "Origin location is required"),
  destination: z.string().min(2, "Destination location is required"),
  fare: z.number().min(1, "Fare must be at least 1"),
  returnFare: z.number().min(1, "Return fare must be at least 1"),
  departureTime: z.string().min(1, "Departure time is required"),
  returnTime: z.string().min(1, "Return time is required"),
  seatsAvailable: z.number().min(1, "At least 1 seat must be available").max(10, "Maximum 10 seats"),
});

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = z.infer<typeof carSchema>;

// Booking schema for customer bookings
export const bookingSchema = z.object({
  id: z.string(),
  carId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  seatsBooked: z.number(),
  tripType: z.enum(["one_way", "round_trip"]),
  totalFare: z.number(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  createdAt: z.string(),
});

export const insertBookingSchema = z.object({
  carId: z.string(),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  seatsBooked: z.number().min(1, "At least 1 seat must be booked"),
  tripType: z.enum(["one_way", "round_trip"]),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = z.infer<typeof bookingSchema>;

// User schema for basic tracking
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;
