import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { firebaseStorage } from "./firebase-storage";

// Use Firebase storage instead of PostgreSQL
const db = firebaseStorage;
import { insertCarSchema, insertBookingSchema, insertCustomerSchema, insertDriverSchema, loginSchema, adminLoginSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import { sendOtpViaSms } from "./firebase";

declare module "express-session" {
  interface SessionData {
    customerId?: string;
    driverId?: string;
    adminId?: string;
    userType?: "customer" | "driver" | "admin";
  }
}

const requireCustomerAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.customerId) {
    return res.status(401).json({ error: "Authentication required", needsAuth: true });
  }
  next();
};

const requireDriverAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.driverId) {
    return res.status(401).json({ error: "Driver authentication required", needsAuth: true });
  }
  next();
};

const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Admin authentication required", needsAuth: true });
  }
  next();
};

const otpSchema = z.object({
  mobile: z.string().min(10).max(10),
  userType: z.enum(["customer", "driver"]),
});

const verifyOtpSchema = z.object({
  mobile: z.string().min(10).max(10),
  otp: z.string().length(6),
  userType: z.enum(["customer", "driver"]),
});

const BCRYPT_SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function initializeSampleData(): Promise<void> {
  // In development, avoid touching Firestore unless credentials (or emulator)
  // are configured. This keeps `npm run dev` usable out-of-the-box.
  const hasFirestoreAuth =
    Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) ||
    Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
    Boolean(process.env.FIRESTORE_EMULATOR_HOST);

  if (!hasFirestoreAuth) {
    console.warn(
      "[INIT] Skipping sample data initialization (Firestore credentials not configured)",
    );
    return;
  }

  try {
    const existingAdmin = await db.getAdminByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123");
      await db.createAdmin({
        username: "admin",
        passwordHash: hashedPassword,
      });
      console.log("[INIT] Default admin created (username: admin, password: admin123)");
    }

    const existingDrivers = await db.getDrivers();
    if (existingDrivers.length === 0) {
      const sampleDrivers = [
        { name: "Rajesh Kumar", mobile: "9876543210", age: 35, aadhaarNumber: "123456789012", licenseNumber: "WB2019123456" },
        { name: "Sunil Das", mobile: "9876543211", age: 42, aadhaarNumber: "234567890123", licenseNumber: "WB2018234567" },
        { name: "Amit Sharma", mobile: "9876543212", age: 28, aadhaarNumber: "345678901234", licenseNumber: "WB2020345678" },
        { name: "Bikash Ghosh", mobile: "9876543213", age: 38, aadhaarNumber: "456789012345", licenseNumber: "WB2017456789" },
        { name: "Pradeep Mukherjee", mobile: "9876543214", age: 45, aadhaarNumber: "567890123456", licenseNumber: "WB2016567890" },
      ];

      const createdDrivers: any[] = [];
      for (const driverData of sampleDrivers) {
        const driver = await db.createDriver(driverData);
        await db.updateDriver(driver.id, { verificationStatus: "approved" });
        createdDrivers.push({ ...driver, verificationStatus: "approved" });
      }
      console.log("[INIT] 5 sample approved drivers created");

      const sampleVehicles = [
        {
          driverId: createdDrivers[0].id,
          vehicleType: "sedan" as const,
          driverName: "Rajesh Kumar",
          driverPhone: "9876543210",
          carModel: "Maruti Suzuki Swift Dzire",
          carNumber: "WB02AB1234",
          origin: "Kolkata",
          destination: "Siliguri",
          waypoints: ["Durgapur"],
          fare: 2500,
          returnFare: 2200,
          departureTime: "06:00",
          returnTime: "18:00",
          seatsAvailable: 4,
        },
        {
          driverId: createdDrivers[0].id,
          vehicleType: "suv" as const,
          driverName: "Rajesh Kumar",
          driverPhone: "9876543210",
          carModel: "Mahindra Scorpio",
          carNumber: "WB02CD5678",
          origin: "Howrah Station",
          destination: "Darjeeling",
          waypoints: [],
          fare: 4500,
          returnFare: 4000,
          departureTime: "05:00",
          returnTime: "19:00",
          seatsAvailable: 6,
        },
        {
          driverId: createdDrivers[1].id,
          vehicleType: "bus" as const,
          driverName: "Sunil Das",
          driverPhone: "9876543211",
          carModel: "Ashok Leyland Viking",
          carNumber: "WB03EF9012",
          origin: "Sealdah Station",
          destination: "Digha",
          waypoints: [],
          fare: 800,
          returnFare: 750,
          departureTime: "07:00",
          returnTime: "16:00",
          seatsAvailable: 45,
        },
        {
          driverId: createdDrivers[2].id,
          vehicleType: "van" as const,
          driverName: "Amit Sharma",
          driverPhone: "9876543212",
          carModel: "Maruti Suzuki Eeco",
          carNumber: "WB04GH3456",
          origin: "Salt Lake",
          destination: "Shantiniketan",
          waypoints: [],
          fare: 1800,
          returnFare: 1600,
          departureTime: "08:00",
          returnTime: "17:00",
          seatsAvailable: 7,
        },
        {
          driverId: createdDrivers[3].id,
          vehicleType: "minibus" as const,
          driverName: "Bikash Ghosh",
          driverPhone: "9876543213",
          carModel: "Force Traveller",
          carNumber: "WB05IJ7890",
          origin: "New Town",
          destination: "Murshidabad",
          waypoints: [],
          fare: 1200,
          returnFare: 1100,
          departureTime: "06:30",
          returnTime: "18:30",
          seatsAvailable: 26,
        },
        {
          driverId: createdDrivers[4].id,
          vehicleType: "hatchback" as const,
          driverName: "Pradeep Mukherjee",
          driverPhone: "9876543214",
          carModel: "Maruti Alto",
          carNumber: "WB06KL1234",
          origin: "Jadavpur",
          destination: "Diamond Harbour",
          waypoints: [],
          fare: 500,
          returnFare: 450,
          departureTime: "09:00",
          returnTime: "15:00",
          seatsAvailable: 4,
        },
        {
          driverId: createdDrivers[4].id,
          vehicleType: "auto_rickshaw" as const,
          driverName: "Pradeep Mukherjee",
          driverPhone: "9876543214",
          carModel: "Bajaj RE",
          carNumber: "WB07MN5678",
          origin: "Park Street",
          destination: "Kalighat",
          waypoints: [],
          fare: 150,
          returnFare: 150,
          departureTime: "08:00",
          returnTime: "20:00",
          seatsAvailable: 3,
        },
        {
          driverId: createdDrivers[1].id,
          vehicleType: "truck" as const,
          driverName: "Sunil Das",
          driverPhone: "9876543211",
          carModel: "Tata 407",
          carNumber: "WB08OP9012",
          origin: "Kolkata Port",
          destination: "Haldia",
          waypoints: [],
          fare: 3500,
          returnFare: 3200,
          departureTime: "04:00",
          returnTime: "22:00",
          seatsAvailable: 2,
        },
      ];

      for (const vehicleData of sampleVehicles) {
        await db.createCar(vehicleData);
      }
      console.log("[INIT] 8 sample vehicles created with West Bengal routes");
    }
  } catch (error) {
    console.error("[INIT] Error initializing sample data:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await initializeSampleData();

  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      const admin = await db.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const passwordMatch = await comparePassword(password, admin.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        req.session.adminId = admin.id;
        req.session.userType = "admin";
        res.json({ 
          admin: { id: admin.id, username: admin.username }, 
          message: "Admin login successful!" 
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/admin/me", async (req, res) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const admin = await db.getAdminByUsername("admin");
    if (!admin || admin.id !== req.session.adminId) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session expired" });
    }
    res.json({ admin: { id: admin.id, username: admin.username } });
  });

  app.post("/api/auth/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Admin logged out successfully" });
    });
  });

  app.post("/api/auth/otp/send", async (req, res) => {
    try {
      const { mobile, userType } = otpSchema.parse(req.body);
      const ipAddress = (Array.isArray(req.ip) ? req.ip[0] : req.ip) || req.socket.remoteAddress || "unknown";
      const userAgent = req.get("user-agent") || "unknown";

      // Check rate limit for OTP sending (max 3 per 15 minutes per mobile)
      const rateCheck = await db.checkRateLimit(mobile, "otp_send", 3, 15);
      if (!rateCheck.allowed) {
        await db.createAuditLog({
          mobile,
          userType,
          action: "otp_send_blocked",
          ipAddress,
          userAgent,
          success: 0,
          errorMessage: rateCheck.lockedUntil 
            ? `Rate limit exceeded. Locked until ${rateCheck.lockedUntil.toISOString()}`
            : "Too many OTP requests",
        });

        return res.status(429).json({ 
          error: rateCheck.lockedUntil 
            ? `Too many attempts. Please try again after ${rateCheck.lockedUntil.toLocaleTimeString()}`
            : "Too many OTP requests. Please wait before trying again.",
          lockedUntil: rateCheck.lockedUntil,
        });
      }

      // Record attempt
      await db.recordAttempt(mobile, "otp_send");

      // Create OTP
      const otpRecord = await db.createOtp(mobile, userType);
      
      // Send OTP via Firebase/SMS (or log in development)
      const smsSent = await sendOtpViaSms(mobile, otpRecord.otp);
      
      if (!smsSent) {
        console.warn(`[OTP] Failed to send SMS to ${mobile}, but OTP is available for verification`);
      }
      
      // Log success
      await db.createAuditLog({
        mobile,
        userType,
        action: "otp_sent",
        ipAddress,
        userAgent,
        success: 1,
      });

      console.log(`[OTP] ${userType} ${mobile}: ${otpRecord.otp}`);
      
      res.json({ 
        success: true, 
        message: "OTP sent successfully",
        expiresAt: otpRecord.expiresAt,
        otp: process.env.NODE_ENV === "development" ? otpRecord.otp : undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("[OTP] Send error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/otp/verify", async (req, res) => {
    try {
      const { mobile, otp, userType } = verifyOtpSchema.parse(req.body);
      const ipAddress = (Array.isArray(req.ip) ? req.ip[0] : req.ip) || req.socket.remoteAddress || "unknown";
      const userAgent = req.get("user-agent") || "unknown";

      // Check rate limit for OTP verification (max 5 attempts per 30 minutes)
      const rateCheck = await db.checkRateLimit(mobile, "otp_verify", 5, 30);
      if (!rateCheck.allowed) {
        await db.createAuditLog({
          mobile,
          userType,
          action: "otp_verify_blocked",
          ipAddress,
          userAgent,
          success: 0,
          errorMessage: rateCheck.lockedUntil 
            ? `Too many failed attempts. Locked until ${rateCheck.lockedUntil.toISOString()}`
            : "Too many verification attempts",
        });

        return res.status(429).json({ 
          error: rateCheck.lockedUntil 
            ? `Account temporarily locked. Please try again after ${rateCheck.lockedUntil.toLocaleTimeString()}`
            : "Too many failed attempts. Please wait before trying again.",
          lockedUntil: rateCheck.lockedUntil,
        });
      }

      // Get OTP record to check attempts
      const otpRecord = await db.getOtp(mobile, userType);
      if (otpRecord && otpRecord.attempts >= 5) {
        await db.lockIdentifier(mobile, "otp_verify", 30);
        await db.createAuditLog({
          mobile,
          userType,
          action: "otp_verify_locked",
          ipAddress,
          userAgent,
          success: 0,
          errorMessage: "Too many failed OTP attempts",
        });

        return res.status(429).json({ 
          error: "Too many failed attempts. Your account has been temporarily locked for 30 minutes.",
        });
      }

      // Verify OTP
      const verified = await db.verifyOtp(mobile, otp, userType);
      
      if (!verified) {
        // Record failed attempt
        await db.recordAttempt(mobile, "otp_verify");
        await db.createAuditLog({
          mobile,
          userType,
          action: "otp_verify_failed",
          ipAddress,
          userAgent,
          success: 0,
          errorMessage: "Invalid OTP provided",
        });

        const remainingAttempts = otpRecord ? Math.max(0, 5 - (otpRecord.attempts + 1)) : 4;
        return res.status(400).json({ 
          error: `Invalid or expired OTP. ${remainingAttempts} attempts remaining.`,
          remainingAttempts,
        });
      }

      // Log success
      await db.createAuditLog({
        mobile,
        userType,
        action: "otp_verified",
        ipAddress,
        userAgent,
        success: 1,
      });

      res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("[OTP] Verify error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  app.post("/api/auth/customer/register", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const otpRecord = await db.getOtp(validatedData.mobile, "customer");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const existingCustomer = await db.getCustomerByMobile(validatedData.mobile);
      if (existingCustomer) {
        req.session.customerId = existingCustomer.id;
        req.session.userType = "customer";
        await db.clearOtp(validatedData.mobile, "customer");
        return res.json({ customer: existingCustomer, message: "Welcome back!" });
      }
      const customer = await db.createCustomer(validatedData);
      req.session.customerId = customer.id;
      req.session.userType = "customer";
      await db.clearOtp(validatedData.mobile, "customer");
      res.status(201).json({ customer, message: "Registration successful!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/customer/login", async (req, res) => {
    try {
      const { mobile } = loginSchema.parse(req.body);
      const otpRecord = await db.getOtp(mobile, "customer");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const customer = await db.getCustomerByMobile(mobile);
      if (!customer) {
        return res.status(404).json({ error: "No account found with this mobile number", needsRegistration: true });
      }
      req.session.customerId = customer.id;
      req.session.userType = "customer";
      await db.clearOtp(mobile, "customer");
      res.json({ customer, message: "Login successful!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/customer/me", async (req, res) => {
    if (!req.session.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const customer = await db.getCustomer(req.session.customerId);
    if (!customer) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session expired" });
    }
    res.json({ customer });
  });

  app.post("/api/auth/driver/register", async (req, res) => {
    try {
      const validatedData = insertDriverSchema.parse(req.body);
      const otpRecord = await db.getOtp(validatedData.mobile, "driver");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const existingDriver = await db.getDriverByMobile(validatedData.mobile);
      if (existingDriver) {
        await db.clearOtp(validatedData.mobile, "driver");
        return res.status(400).json({ error: "A driver account already exists with this mobile number" });
      }
      const driver = await db.createDriver(validatedData);
      req.session.driverId = driver.id;
      req.session.userType = "driver";
      await db.clearOtp(validatedData.mobile, "driver");
      res.status(201).json({ 
        driver, 
        message: "Registration submitted! Please wait for admin verification before you can list vehicles." 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/driver/login", async (req, res) => {
    try {
      const { mobile } = loginSchema.parse(req.body);
      const otpRecord = await db.getOtp(mobile, "driver");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const driver = await db.getDriverByMobile(mobile);
      if (!driver) {
        return res.status(404).json({ error: "No driver account found with this mobile number", needsRegistration: true });
      }
      req.session.driverId = driver.id;
      req.session.userType = "driver";
      await db.clearOtp(mobile, "driver");
      res.json({ driver, message: "Login successful!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/driver/me", async (req, res) => {
    if (!req.session.driverId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const driver = await db.getDriver(req.session.driverId);
    if (!driver) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session expired" });
    }
    const sanitizedDriver = {
      ...driver,
      aadhaarNumber: driver.aadhaarNumber.slice(0, 4) + "********",
    };
    res.json({ driver: sanitizedDriver });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await db.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/drivers", async (req, res) => {
    try {
      const status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
      let drivers;
      if (status && typeof status === 'string' && ["pending", "approved", "rejected"].includes(status)) {
        drivers = await db.getDriversByStatus(status as any);
      } else {
        drivers = await db.getDrivers();
      }
      const sanitizedDrivers = drivers.map(d => ({
        ...d,
        aadhaarNumber: d.aadhaarNumber.slice(0, 4) + "********",
      }));
      res.json(sanitizedDrivers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  });

  app.get("/api/drivers/:id", async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const driver = await db.getDriver(id);
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch driver" });
    }
  });

  app.patch("/api/drivers/:id/verify", requireAdminAuth, async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status, rejectionReason } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const driver = await db.updateDriver(id, {
        verificationStatus: status,
        rejectionReason: status === "rejected" ? rejectionReason : undefined,
      });
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }
      res.json({ driver, message: `Driver ${status === "approved" ? "approved" : "rejected"} successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify driver" });
    }
  });

  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await db.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/search", async (req, res) => {
    try {
      const { origin, destination } = req.query;
      const cars = await db.getCars();
      const availableCars = cars.filter(car => car.status === "available");
      
      if (!origin && !destination) {
        return res.json(availableCars);
      }
      
      const matchedCars = availableCars.filter(car => {
        const carOrigin = car.origin.toLowerCase();
        const carDest = car.destination.toLowerCase();
        const waypoints = (car.waypoints || []).map(w => w.toLowerCase());
        const allStops = [carOrigin, ...waypoints, carDest];
        
        const searchOrigin = (origin as string || "").toLowerCase();
        const searchDest = (destination as string || "").toLowerCase();
        
        let originIndex = -1;
        let destIndex = -1;
        
        for (let i = 0; i < allStops.length; i++) {
          if (searchOrigin && allStops[i].includes(searchOrigin)) {
            originIndex = i;
            break;
          }
        }
        
        for (let i = allStops.length - 1; i >= 0; i--) {
          if (searchDest && allStops[i].includes(searchDest)) {
            destIndex = i;
            break;
          }
        }
        
        if (searchOrigin && searchDest) {
          return originIndex !== -1 && destIndex !== -1 && originIndex < destIndex;
        } else if (searchOrigin) {
          return originIndex !== -1;
        } else if (searchDest) {
          return destIndex !== -1;
        }
        return true;
      });
      
      res.json(matchedCars);
    } catch (error) {
      res.status(500).json({ error: "Failed to search cars" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const car = await db.getCar(id);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car" });
    }
  });

  app.post("/api/cars", async (req, res) => {
    try {
      if (req.session.driverId) {
        const driver = await db.getDriver(req.session.driverId);
        if (!driver) {
          return res.status(401).json({ error: "Driver not found" });
        }
        if (driver.verificationStatus !== "approved") {
          return res.status(403).json({ 
            error: "Your account is not yet verified. Please wait for admin approval before listing vehicles.",
            verificationStatus: driver.verificationStatus
          });
        }
        req.body.driverId = driver.id;
        req.body.driverName = driver.name;
        req.body.driverPhone = driver.mobile;
      }
      
      const validatedData = insertCarSchema.parse(req.body);
      const car = await db.createCar(validatedData);
      res.status(201).json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create car" });
    }
  });

  app.patch("/api/cars/:id", async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const car = await db.updateCar(id, req.body);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Failed to update car" });
    }
  });

  app.delete("/api/cars/:id", async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const success = await db.deleteCar(id);
      if (!success) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete car" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await db.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/my", requireCustomerAuth, async (req, res) => {
    try {
      const bookings = await db.getBookingsByCustomerId(req.session.customerId!);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await db.getBooking(id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = { ...req.body };
      if (req.session.customerId) {
        bookingData.customerId = req.session.customerId;
        const customer = await db.getCustomer(req.session.customerId);
        if (customer) {
          bookingData.customerName = customer.name;
          bookingData.customerPhone = customer.mobile;
        }
      }
      
      const validatedData = insertBookingSchema.parse(bookingData);
      const car = await db.getCar(validatedData.carId);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      const existingBookings = await db.getBookingsByCarId(car.id);
      const bookedSeats = existingBookings
        .filter(b => b.status !== "cancelled")
        .reduce((sum, b) => sum + b.seatsBooked, 0);
      if (bookedSeats + validatedData.seatsBooked > car.seatsAvailable) {
        return res.status(400).json({ error: "Not enough seats available" });
      }
      let totalFare = car.fare * validatedData.seatsBooked;
      if (validatedData.tripType === "round_trip") {
        totalFare += car.returnFare * validatedData.seatsBooked;
      }
      const booking = await db.createBooking(validatedData, totalFare);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await db.updateBooking(id, req.body);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const [cars, bookings, customers, drivers] = await Promise.all([
        db.getCars(),
        db.getBookings(),
        db.getCustomers(),
        db.getDrivers(),
      ]);
      
      const pendingDrivers = drivers.filter(d => d.verificationStatus === "pending").length;
      const approvedDrivers = drivers.filter(d => d.verificationStatus === "approved").length;
      const totalRevenue = bookings
        .filter(b => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, b) => sum + b.totalFare, 0);
      
      res.json({
        totalCars: cars.length,
        availableCars: cars.filter(c => c.status === "available").length,
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === "confirmed").length,
        totalCustomers: customers.length,
        totalDrivers: drivers.length,
        pendingDrivers,
        approvedDrivers,
        totalRevenue,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/download/project", (req, res) => {
    const zipPath = path.join(process.cwd(), "rideshare-project.zip");
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, "rideshare-project.zip");
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  // Location search endpoints
  app.get("/api/locations/search", async (req, res) => {
    try {
      const { searchLocations } = await import("./data/indian-locations");
      const queryParam = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
      const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
      const query = typeof queryParam === 'string' ? queryParam : "";
      const limit = parseInt(limitParam as string) || 20;
      const results = searchLocations(query, limit);
      res.json(results);
    } catch (error) {
      console.error("Location search error:", error);
      res.status(500).json({ error: "Failed to search locations" });
    }
  });

  app.get("/api/locations/popular", async (req, res) => {
    try {
      const { getPopularLocations } = await import("./data/indian-locations");
      const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
      const limit = parseInt(limitParam as string) || 50;
      const results = getPopularLocations(limit);
      res.json(results);
    } catch (error) {
      console.error("Popular locations error:", error);
      res.status(500).json({ error: "Failed to fetch popular locations" });
    }
  });

  app.get("/api/locations/state/:state", async (req, res) => {
    try {
      const { getLocationsByState } = await import("./data/indian-locations");
      const state = Array.isArray(req.params.state) ? req.params.state[0] : req.params.state;
      const results = getLocationsByState(state);
      res.json(results);
    } catch (error) {
      console.error("State locations error:", error);
      res.status(500).json({ error: "Failed to fetch state locations" });
    }
  });

  app.get("/api/locations/all", async (req, res) => {
    try {
      const { indianLocations } = await import("./data/indian-locations");
      res.json(indianLocations);
    } catch (error) {
      console.error("All locations error:", error);
      res.status(500).json({ error: "Failed to fetch all locations" });
    }
  });

  // Vehicle types endpoint
  app.get("/api/vehicle-types", async (req, res) => {
    try {
      const { vehicleTypes, vehicleTypeLabels } = await import("@shared/schema");
      const types = vehicleTypes.map(type => ({
        value: type,
        label: vehicleTypeLabels[type]
      }));
      res.json(types);
    } catch (error) {
      console.error("Vehicle types error:", error);
      res.status(500).json({ error: "Failed to fetch vehicle types" });
    }
  });

  // ===== DRIVER VEHICLES ENDPOINTS =====
  
  // Get driver's vehicles
  app.get("/api/driver/vehicles", requireDriverAuth, async (req, res) => {
    try {
      const driverId = req.session.driverId!;
      const vehicles = await db.getDriverVehicles(driverId);
      res.json(vehicles);
    } catch (error) {
      console.error("Get driver vehicles error:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  // Add new vehicle
  app.post("/api/driver/vehicles", requireDriverAuth, async (req, res) => {
    try {
      const driverId = req.session.driverId!;
      const { insertDriverVehicleSchema } = await import("@shared/schema");
      const vehicleData = insertDriverVehicleSchema.parse(req.body);
      
      const vehicle = await db.createDriverVehicle({
        ...vehicleData,
        driverId,
      });
      
      res.json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Add vehicle error:", error);
      res.status(500).json({ error: "Failed to add vehicle" });
    }
  });

  // Update vehicle
  app.patch("/api/driver/vehicles/:id", requireDriverAuth, async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const driverId = req.session.driverId!;

      const vehicle = await db.getDriverVehicle(id);
      if (!vehicle || vehicle.driverId !== driverId) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      await db.updateDriverVehicle(id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Update vehicle error:", error);
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  // Delete vehicle
  app.delete("/api/driver/vehicles/:id", requireDriverAuth, async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const driverId = req.session.driverId!;

      const vehicle = await db.getDriverVehicle(id);
      if (!vehicle || vehicle.driverId !== driverId) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      await db.deleteDriverVehicle(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete vehicle error:", error);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // ===== INQUIRY ENDPOINTS =====
  
  // Create inquiry (customer)
  app.post("/api/inquiries", requireCustomerAuth, async (req, res) => {
    try {
      const customerId = req.session.customerId!;
      const { insertInquirySchema } = await import("@shared/schema");
      const inquiryData = insertInquirySchema.parse(req.body);
      
      const inquiry = await db.createInquiry({
        ...inquiryData,
        customerId,
      });
      
      res.json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create inquiry error:", error);
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  // Get customer's inquiries
  app.get("/api/customer/inquiries", requireCustomerAuth, async (req, res) => {
    try {
      const customerId = req.session.customerId!;
      const inquiries = await db.getCustomerInquiries(customerId);
      res.json(inquiries);
    } catch (error) {
      console.error("Get customer inquiries error:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Get driver's inquiries
  app.get("/api/driver/inquiries", requireDriverAuth, async (req, res) => {
    try {
      const driverId = req.session.driverId!;
      const inquiries = await db.getDriverInquiries(driverId);
      res.json(inquiries);
    } catch (error) {
      console.error("Get driver inquiries error:", error);
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Update inquiry status
  app.patch("/api/inquiries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.updateInquiry(id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Update inquiry error:", error);
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  // ===== MESSAGING ENDPOINTS =====
  
  // Send message
  app.post("/api/messages", async (req, res) => {
    try {
      const { insertMessageSchema } = await import("@shared/schema");
      const messageData = insertMessageSchema.parse(req.body);
      
      const message = await db.createMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Send message error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Get user's messages
  app.get("/api/messages", async (req, res) => {
    try {
      const userId = req.session.customerId || req.session.driverId;
      const userType = req.session.customerId ? "customer" : "driver";
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const messages = await db.getMessages(userId, userType);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Get conversation between two users
  app.get("/api/messages/conversation/:userId", async (req, res) => {
    try {
      const currentUserId = req.session.customerId || req.session.driverId;
      const { userId } = req.params;
      
      if (!currentUserId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const messages = await db.getConversation(currentUserId, userId);
      res.json(messages);
    } catch (error) {
      console.error("Get conversation error:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Mark message as read
  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      await db.markMessageAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark message read error:", error);
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // ===== SUPPORT TICKET ENDPOINTS =====
  
  // Create support ticket
  app.post("/api/support/tickets", async (req, res) => {
    try {
      const userId = req.session.customerId || req.session.driverId;
      const { insertSupportTicketSchema } = await import("@shared/schema");
      const ticketData = insertSupportTicketSchema.parse(req.body);
      
      const ticket = await db.createSupportTicket({
        ...ticketData,
        userId: userId || "",
      });
      
      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create support ticket error:", error);
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });

  // Get user's support tickets
  app.get("/api/support/tickets", async (req, res) => {
    try {
      const userId = req.session.customerId || req.session.driverId;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const tickets = await db.getUserSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Get support tickets error:", error);
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  // Get all support tickets (admin)
  app.get("/api/admin/support/tickets", requireAdminAuth, async (req, res) => {
    try {
      const tickets = await db.getSupportTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Get all support tickets error:", error);
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  // Update support ticket (admin)
  app.patch("/api/admin/support/tickets/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await db.updateSupportTicket(id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Update support ticket error:", error);
      res.status(500).json({ error: "Failed to update support ticket" });
    }
  });

  // ===== DRIVER SCHEDULE ENDPOINTS =====
  
  // Get driver's schedules
  app.get("/api/driver/schedules", requireDriverAuth, async (req, res) => {
    try {
      const driverId = req.session.driverId!;
      const schedules = await db.getDriverSchedules(driverId);
      res.json(schedules);
    } catch (error) {
      console.error("Get driver schedules error:", error);
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  // Create driver schedule
  app.post("/api/driver/schedules", requireDriverAuth, async (req, res) => {
    try {
      const driverId = req.session.driverId!;
      const { insertDriverScheduleSchema } = await import("@shared/schema");
      const scheduleData = insertDriverScheduleSchema.parse(req.body);
      
      const schedule = await db.createDriverSchedule({
        ...scheduleData,
        driverId,
      });
      
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create schedule error:", error);
      res.status(500).json({ error: "Failed to create schedule" });
    }
  });

  // Update driver schedule
  app.patch("/api/driver/schedules/:id", requireDriverAuth, async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await db.updateDriverSchedule(id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Update schedule error:", error);
      res.status(500).json({ error: "Failed to update schedule" });
    }
  });

  // Delete driver schedule
  app.delete("/api/driver/schedules/:id", requireDriverAuth, async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await db.deleteDriverSchedule(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete schedule error:", error);
      res.status(500).json({ error: "Failed to delete schedule" });
    }
  });

  return httpServer;
}
