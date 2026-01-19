import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await storage.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cars" });
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
      const validatedData = insertBookingSchema.parse(req.body);
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
