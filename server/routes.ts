import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema, insertBookingSchema, insertCustomerSchema, insertDriverSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";

declare module "express-session" {
  interface SessionData {
    customerId?: string;
    driverId?: string;
    userType?: "customer" | "driver";
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/auth/customer/register", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const existingCustomer = await storage.getCustomerByMobile(validatedData.mobile);
      if (existingCustomer) {
        req.session.customerId = existingCustomer.id;
        req.session.userType = "customer";
        return res.json({ customer: existingCustomer, message: "Welcome back!" });
      }
      const customer = await storage.createCustomer(validatedData);
      req.session.customerId = customer.id;
      req.session.userType = "customer";
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
      const customer = await storage.getCustomerByMobile(mobile);
      if (!customer) {
        return res.status(404).json({ error: "No account found with this mobile number", needsRegistration: true });
      }
      req.session.customerId = customer.id;
      req.session.userType = "customer";
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
      const existingDriver = await storage.getDriverByMobile(validatedData.mobile);
      if (existingDriver) {
        return res.status(400).json({ error: "A driver account already exists with this mobile number" });
      }
      const driver = await storage.createDriver(validatedData);
      req.session.driverId = driver.id;
      req.session.userType = "driver";
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
      const driver = await storage.getDriverByMobile(mobile);
      if (!driver) {
        return res.status(404).json({ error: "No driver account found with this mobile number", needsRegistration: true });
      }
      req.session.driverId = driver.id;
      req.session.userType = "driver";
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

  app.patch("/api/drivers/:id/verify", async (req, res) => {
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
