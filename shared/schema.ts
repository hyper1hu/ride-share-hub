import { pgTable, text, integer, timestamp, varchar, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Comprehensive vehicle types for all India
export const vehicleTypes = [
  "sedan", 
  "hatchback",
  "suv", 
  "muv",
  "luxury_sedan",
  "van", 
  "mini_van",
  "bus", 
  "minibus",
  "sleeper_bus",
  "ac_bus",
  "non_ac_bus",
  "motorcycle", 
  "scooter",
  "auto_rickshaw", 
  "tempo",
  "mini_truck",
  "truck",
  "heavy_truck",
  "container_truck",
  "pickup_truck",
  "tata_ace",
  "ambulance",
  "school_bus"
] as const;
export type VehicleType = typeof vehicleTypes[number];

// Vehicle type display names
export const vehicleTypeLabels: Record<VehicleType, string> = {
  sedan: "Sedan",
  hatchback: "Hatchback",
  suv: "SUV",
  muv: "MUV",
  luxury_sedan: "Luxury Sedan",
  van: "Van",
  mini_van: "Mini Van",
  bus: "Bus",
  minibus: "Mini Bus",
  sleeper_bus: "Sleeper Bus",
  ac_bus: "AC Bus",
  non_ac_bus: "Non-AC Bus",
  motorcycle: "Motorcycle",
  scooter: "Scooter",
  auto_rickshaw: "Auto Rickshaw",
  tempo: "Tempo",
  mini_truck: "Mini Truck",
  truck: "Truck",
  heavy_truck: "Heavy Truck",
  container_truck: "Container Truck",
  pickup_truck: "Pickup Truck",
  tata_ace: "Tata Ace",
  ambulance: "Ambulance",
  school_bus: "School Bus"
};

export const driverVerificationStatus = ["pending", "approved", "rejected"] as const;
export type DriverVerificationStatus = typeof driverVerificationStatus[number];

export const customers = pgTable("customers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  mobile: varchar("mobile", { length: 15 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true }).extend({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Invalid age"),
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export const drivers = pgTable("drivers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  mobile: varchar("mobile", { length: 15 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  aadhaarNumber: varchar("aadhaar_number", { length: 12 }).notNull(),
  licenseNumber: varchar("license_number", { length: 50 }).notNull(),
  aadhaarImage: text("aadhaar_image"),
  licenseImage: text("license_image"),
  rcImage: text("rc_image"),
  verificationStatus: varchar("verification_status", { length: 20 }).notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDriverSchema = createInsertSchema(drivers).omit({ id: true, createdAt: true, verificationStatus: true, rejectionReason: true }).extend({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "Must be at least 18 years old").max(70, "Maximum age is 70"),
  aadhaarNumber: z.string().min(12, "Aadhaar number must be 12 digits").max(12, "Aadhaar number must be 12 digits"),
  licenseNumber: z.string().min(5, "License number is required"),
});

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

export const cars = pgTable("cars", {
  id: varchar("id", { length: 36 }).primaryKey(),
  driverId: varchar("driver_id", { length: 36 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 20 }).notNull(),
  driverName: varchar("driver_name", { length: 100 }).notNull(),
  driverPhone: varchar("driver_phone", { length: 15 }).notNull(),
  carModel: varchar("car_model", { length: 100 }).notNull(),
  carNumber: varchar("car_number", { length: 20 }).notNull(),
  origin: varchar("origin", { length: 200 }).notNull(),
  destination: varchar("destination", { length: 200 }).notNull(),
  waypoints: text("waypoints").array(),
  fare: integer("fare").notNull(),
  returnFare: integer("return_fare").notNull(),
  departureTime: varchar("departure_time", { length: 10 }).notNull(),
  returnTime: varchar("return_time", { length: 10 }).notNull(),
  seatsAvailable: integer("seats_available").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarSchema = createInsertSchema(cars).omit({ id: true, createdAt: true, status: true }).extend({
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
export type Car = typeof cars.$inferSelect;

export const bookings = pgTable("bookings", {
  id: varchar("id", { length: 36 }).primaryKey(),
  carId: varchar("car_id", { length: 36 }).notNull(),
  customerId: varchar("customer_id", { length: 36 }).notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 15 }).notNull(),
  pickupLocation: varchar("pickup_location", { length: 200 }),
  dropLocation: varchar("drop_location", { length: 200 }),
  seatsBooked: integer("seats_booked").notNull(),
  tripType: varchar("trip_type", { length: 20 }).notNull(),
  totalFare: integer("total_fare").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, status: true, totalFare: true }).extend({
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
export type Booking = typeof bookings.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true }).extend({
  username: z.string().min(2),
  password: z.string().min(4),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const admins = pgTable("admins", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

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

// OTP table for persistent storage
export const otps = pgTable("otps", {
  id: varchar("id", { length: 36 }).primaryKey(),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  userType: varchar("user_type", { length: 10 }).notNull(), // 'customer' or 'driver'
  verified: integer("verified").notNull().default(0), // 0 = false, 1 = true
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOtpSchema = createInsertSchema(otps).omit({ id: true, createdAt: true });
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type Otp = typeof otps.$inferSelect;

// Audit log table for security tracking
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  userType: varchar("user_type", { length: 10 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(), // 'otp_sent', 'otp_verified', 'otp_failed', 'login_success', 'login_failed'
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  success: integer("success").notNull(), // 0 = false, 1 = true
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// Rate limit tracking table
export const rateLimits = pgTable("rate_limits", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: varchar("identifier", { length: 100 }).notNull().unique(), // mobile or IP
  limitType: varchar("limit_type", { length: 20 }).notNull(), // 'otp_send', 'otp_verify'
  attempts: integer("attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  lastAttempt: timestamp("last_attempt").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRateLimitSchema = createInsertSchema(rateLimits).omit({ id: true, createdAt: true });
export type InsertRateLimit = z.infer<typeof insertRateLimitSchema>;
export type RateLimit = typeof rateLimits.$inferSelect;
