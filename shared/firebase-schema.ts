import { z } from "zod";

// Vehicle types remain the same
export const vehicleTypes = ["car", "suv", "van", "bus", "minibus", "motorcycle", "auto_rickshaw", "truck"] as const;
export type VehicleType = typeof vehicleTypes[number];

// Driver verification status
export const driverVerificationStatus = ["pending", "approved", "rejected"] as const;
export type DriverVerificationStatus = typeof driverVerificationStatus[number];

// Customer type (Firestore compatible)
export interface Customer {
  id: string;
  mobile: string;
  name: string;
  age: number;
  createdAt: Date;
}

export const insertCustomerSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Invalid age"),
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// Driver type (Firestore compatible)
export interface Driver {
  id: string;
  mobile: string;
  name: string;
  age: number;
  aadhaarNumber: string;
  licenseNumber: string;
  aadhaarImage: string | null;
  licenseImage: string | null;
  rcImage: string | null;
  verificationStatus: string;
  rejectionReason: string | null;
  createdAt: Date;
}

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

// Car type (Firestore compatible)
export interface Car {
  id: string;
  driverId: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  carModel: string;
  carNumber: string;
  origin: string;
  destination: string;
  waypoints: string[];
  fare: number;
  returnFare: number;
  departureTime: string;
  returnTime: string;
  seatsAvailable: number;
  status: string;
  createdAt: Date;
}

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

// Booking type (Firestore compatible)
export interface Booking {
  id: string;
  carId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string | null;
  dropLocation: string | null;
  seatsBooked: number;
  tripType: string;
  totalFare: number;
  status: string;
  createdAt: Date;
}

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

// Admin type (Firestore compatible)
export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export const insertAdminSchema = z.object({
  username: z.string().min(2),
  passwordHash: z.string(),
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;

// User type (deprecated - keeping for compatibility)
export interface User {
  id: string;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Authentication schemas
export const loginSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
});

export const otpVerifySchema = z.object({
  mobile: z.string().min(10),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const adminLoginSchema = z.object({
  username: z.string().min(2, "Username is required"),
  password: z.string().min(4, "Password is required"),
});

// OTP type (Firestore compatible)
export interface Otp {
  id: string;
  mobile: string;
  otp: string;
  userType: string;
  verified: number;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

export const insertOtpSchema = z.object({
  mobile: z.string(),
  otp: z.string(),
  userType: z.string(),
  verified: z.number(),
  attempts: z.number(),
  expiresAt: z.date(),
});

export type InsertOtp = z.infer<typeof insertOtpSchema>;

// Audit log type (Firestore compatible)
export interface AuditLog {
  id: string;
  mobile: string;
  userType: string;
  action: string;
  ipAddress: string | null;
  userAgent: string | null;
  success: number;
  errorMessage: string | null;
  createdAt: Date;
}

export const insertAuditLogSchema = z.object({
  mobile: z.string(),
  userType: z.string(),
  action: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  success: z.number(),
  errorMessage: z.string().optional(),
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// Rate limit type (Firestore compatible)
export interface RateLimit {
  id: string;
  identifier: string;
  limitType: string;
  attempts: number;
  lockedUntil: Date | null;
  lastAttempt: Date;
  createdAt: Date;
}

export const insertRateLimitSchema = z.object({
  identifier: z.string(),
  limitType: z.string(),
  attempts: z.number(),
  lockedUntil: z.date().optional(),
  lastAttempt: z.date(),
});

export type InsertRateLimit = z.infer<typeof insertRateLimitSchema>;

// Re-export for compatibility
export {
  vehicleTypes as vehicleTypes,
  driverVerificationStatus as driverVerificationStatus,
};
