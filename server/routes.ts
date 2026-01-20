import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema, insertBookingSchema, insertCustomerSchema, insertDriverSchema, loginSchema, adminLoginSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";

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
  try {
    const existingAdmin = await storage.getAdminByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123");
      await storage.createAdmin({
        username: "admin",
        passwordHash: hashedPassword,
      });
      console.log("[INIT] Default admin created (username: admin, password: admin123)");
    }

    const existingDrivers = await storage.getDrivers();
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
        const driver = await storage.createDriver(driverData);
        await storage.updateDriver(driver.id, { verificationStatus: "approved" });
        createdDrivers.push({ ...driver, verificationStatus: "approved" });
      }
      console.log("[INIT] 5 sample approved drivers created");

      const sampleVehicles = [
        {
          driverId: createdDrivers[0].id,
          vehicleType: "car" as const,
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
          vehicleType: "motorcycle" as const,
          driverName: "Pradeep Mukherjee",
          driverPhone: "9876543214",
          carModel: "Royal Enfield Classic 350",
          carNumber: "WB06KL1234",
          origin: "Jadavpur",
          destination: "Diamond Harbour",
          waypoints: [],
          fare: 500,
          returnFare: 450,
          departureTime: "09:00",
          returnTime: "15:00",
          seatsAvailable: 1,
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
        await storage.createCar(vehicleData);
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
      const admin = await storage.getAdminByUsername(username);
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
    const admin = await storage.getAdminByUsername("admin");
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
      const otpRecord = await storage.createOtp(mobile, userType);
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
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/otp/verify", async (req, res) => {
    try {
      const { mobile, otp, userType } = verifyOtpSchema.parse(req.body);
      const verified = await storage.verifyOtp(mobile, otp, userType);
      if (!verified) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
      res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  app.post("/api/auth/customer/register", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const otpRecord = await storage.getOtp(validatedData.mobile, "customer");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const existingCustomer = await storage.getCustomerByMobile(validatedData.mobile);
      if (existingCustomer) {
        req.session.customerId = existingCustomer.id;
        req.session.userType = "customer";
        await storage.clearOtp(validatedData.mobile, "customer");
        return res.json({ customer: existingCustomer, message: "Welcome back!" });
      }
      const customer = await storage.createCustomer(validatedData);
      req.session.customerId = customer.id;
      req.session.userType = "customer";
      await storage.clearOtp(validatedData.mobile, "customer");
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
      const otpRecord = await storage.getOtp(mobile, "customer");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const customer = await storage.getCustomerByMobile(mobile);
      if (!customer) {
        return res.status(404).json({ error: "No account found with this mobile number", needsRegistration: true });
      }
      req.session.customerId = customer.id;
      req.session.userType = "customer";
      await storage.clearOtp(mobile, "customer");
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
    const customer = await storage.getCustomer(req.session.customerId);
    if (!customer) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session expired" });
    }
    res.json({ customer });
  });

  app.post("/api/auth/driver/register", async (req, res) => {
    try {
      const validatedData = insertDriverSchema.parse(req.body);
      const otpRecord = await storage.getOtp(validatedData.mobile, "driver");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const existingDriver = await storage.getDriverByMobile(validatedData.mobile);
      if (existingDriver) {
        await storage.clearOtp(validatedData.mobile, "driver");
        return res.status(400).json({ error: "A driver account already exists with this mobile number" });
      }
      const driver = await storage.createDriver(validatedData);
      req.session.driverId = driver.id;
      req.session.userType = "driver";
      await storage.clearOtp(validatedData.mobile, "driver");
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
      const otpRecord = await storage.getOtp(mobile, "driver");
      if (!otpRecord || !otpRecord.verified) {
        return res.status(400).json({ error: "Please verify your mobile number with OTP first", needsOtp: true });
      }
      const driver = await storage.getDriverByMobile(mobile);
      if (!driver) {
        return res.status(404).json({ error: "No driver account found with this mobile number", needsRegistration: true });
      }
      req.session.driverId = driver.id;
      req.session.userType = "driver";
      await storage.clearOtp(mobile, "driver");
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
    const driver = await storage.getDriver(req.session.driverId);
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
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/drivers", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      let drivers;
      if (status && ["pending", "approved", "rejected"].includes(status)) {
        drivers = await storage.getDriversByStatus(status as any);
      } else {
        drivers = await storage.getDrivers();
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
      const driver = await storage.getDriver(req.params.id);
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
      const { status, rejectionReason } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const driver = await storage.updateDriver(req.params.id, {
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
      const cars = await storage.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/search", async (req, res) => {
    try {
      const { origin, destination } = req.query;
      const cars = await storage.getCars();
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
      const car = await storage.getCar(req.params.id);
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
        const driver = await storage.getDriver(req.session.driverId);
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
      const car = await storage.createCar(validatedData);
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
      const car = await storage.updateCar(req.params.id, req.body);
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
      const success = await storage.deleteCar(req.params.id);
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
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/my", requireCustomerAuth, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByCustomerId(req.session.customerId!);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
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
        const customer = await storage.getCustomer(req.session.customerId);
        if (customer) {
          bookingData.customerName = customer.name;
          bookingData.customerPhone = customer.mobile;
        }
      }
      
      const validatedData = insertBookingSchema.parse(bookingData);
      const car = await storage.getCar(validatedData.carId);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      const existingBookings = await storage.getBookingsByCarId(car.id);
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
      const booking = await storage.createBooking(validatedData, totalFare);
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
      const booking = await storage.updateBooking(req.params.id, req.body);
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
        storage.getCars(),
        storage.getBookings(),
        storage.getCustomers(),
        storage.getDrivers(),
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

  return httpServer;
}
