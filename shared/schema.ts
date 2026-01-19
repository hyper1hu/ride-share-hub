import { z } from "zod";

export const vehicleTypes = ["car", "suv", "van", "bus", "minibus", "motorcycle", "auto_rickshaw", "truck"] as const;
export type VehicleType = typeof vehicleTypes[number];

export const driverVerificationStatus = ["pending", "approved", "rejected"] as const;
export type DriverVerificationStatus = typeof driverVerificationStatus[number];

export const customerSchema = z.object({
  id: z.string(),
  mobile: z.string(),
  name: z.string(),
  age: z.number(),
  createdAt: z.string(),
});

export const insertCustomerSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Invalid age"),
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = z.infer<typeof customerSchema>;

export const driverSchema = z.object({
  id: z.string(),
  mobile: z.string(),
  name: z.string(),
  age: z.number(),
  aadhaarNumber: z.string(),
  licenseNumber: z.string(),
  aadhaarImage: z.string().optional(),
  licenseImage: z.string().optional(),
  rcImage: z.string().optional(),
  verificationStatus: z.enum(driverVerificationStatus),
  rejectionReason: z.string().optional(),
  createdAt: z.string(),
});

export const insertDriverSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "Must be at least 18 years old").max(70, "Maximum age is 70"),
  aadhaarNumber: z.string().min(12, "Aadhaar number must be 12 digits").max(12, "Aadhaar number must be 12 digits"),
  licenseNumber: z.string().min(5, "License number is required"),
  aadhaarImage: z.string().optional(),
  licenseImage: z.string().optional(),
  rcImage: z.string().optional(),
});

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = z.infer<typeof driverSchema>;

export const carSchema = z.object({
  id: z.string(),
  driverId: z.string(),
  vehicleType: z.enum(vehicleTypes),
  driverName: z.string(),
  driverPhone: z.string(),
  carModel: z.string(),
  carNumber: z.string(),
  origin: z.string(),
  destination: z.string(),
  waypoints: z.array(z.string()).optional(),
  fare: z.number(),
  returnFare: z.number(),
  departureTime: z.string(),
  returnTime: z.string(),
  seatsAvailable: z.number(),
  status: z.enum(["available", "on_trip", "returning"]),
  createdAt: z.string(),
});

export const insertCarSchema = z.object({
  driverId: z.string().optional(),
  vehicleType: z.enum(vehicleTypes),
  driverName: z.string().min(2, "Driver name must be at least 2 characters"),
  driverPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  carModel: z.string().min(2, "Vehicle model is required"),
  carNumber: z.string().min(2, "Vehicle number is required"),
  origin: z.string().min(2, "Origin location is required"),
  destination: z.string().min(2, "Destination location is required"),
  waypoints: z.array(z.string()).optional(),
  fare: z.number().min(1, "Fare must be at least 1"),
  returnFare: z.number().min(1, "Return fare must be at least 1"),
  departureTime: z.string().min(1, "Departure time is required"),
  returnTime: z.string().min(1, "Return time is required"),
  seatsAvailable: z.number().min(1, "At least 1 seat must be available").max(60, "Maximum 60 seats"),
});

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = z.infer<typeof carSchema>;

export const bookingSchema = z.object({
  id: z.string(),
  carId: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  pickupLocation: z.string().optional(),
  dropLocation: z.string().optional(),
  seatsBooked: z.number(),
  tripType: z.enum(["one_way", "round_trip"]),
  totalFare: z.number(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  createdAt: z.string(),
});

export const insertBookingSchema = z.object({
  carId: z.string(),
  customerId: z.string().optional(),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  pickupLocation: z.string().optional(),
  dropLocation: z.string().optional(),
  seatsBooked: z.number().min(1, "At least 1 seat must be booked"),
  tripType: z.enum(["one_way", "round_trip"]),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = z.infer<typeof bookingSchema>;

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

export const loginSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
});

export const otpVerifySchema = z.object({
  mobile: z.string().min(10),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
