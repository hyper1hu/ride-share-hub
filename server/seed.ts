import { db } from "./db";
import { users, vehicles, locations } from "../shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(users.username.eq("admin")).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log("⚠️  Admin user already exists. Skipping seed.");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      role: "admin",
      fullName: "System Administrator",
      email: "admin@rideshare.com",
      mobile: "9999999999",
      isVerified: true,
    });
    console.log("✅ Created admin user (username: admin, password: admin123)");

    // Create sample drivers (auto-approved)
    const drivers = [
      {
        username: "driver1",
        password: await bcrypt.hash("driver123", 10),
        role: "driver" as const,
        fullName: "Rajesh Kumar",
        email: "rajesh@rideshare.com",
        mobile: "9876543210",
        isVerified: true,
        isApproved: true,
        licenseNumber: "WB1234567890",
        vehicleType: "Car",
        vehicleNumber: "WB 01 AB 1234",
      },
      {
        username: "driver2",
        password: await bcrypt.hash("driver123", 10),
        role: "driver" as const,
        fullName: "Amit Sharma",
        email: "amit@rideshare.com",
        mobile: "9876543211",
        isVerified: true,
        isApproved: true,
        licenseNumber: "WB1234567891",
        vehicleType: "SUV",
        vehicleNumber: "WB 02 CD 5678",
      },
      {
        username: "driver3",
        password: await bcrypt.hash("driver123", 10),
        role: "driver" as const,
        fullName: "Suresh Mondal",
        email: "suresh@rideshare.com",
        mobile: "9876543212",
        isVerified: true,
        isApproved: true,
        licenseNumber: "WB1234567892",
        vehicleType: "Bus",
        vehicleNumber: "WB 03 EF 9012",
      },
      {
        username: "driver4",
        password: await bcrypt.hash("driver123", 10),
        role: "driver" as const,
        fullName: "Kamal Das",
        email: "kamal@rideshare.com",
        mobile: "9876543213",
        isVerified: true,
        isApproved: true,
        licenseNumber: "WB1234567893",
        vehicleType: "Auto",
        vehicleNumber: "WB 04 GH 3456",
      },
      {
        username: "driver5",
        password: await bcrypt.hash("driver123", 10),
        role: "driver" as const,
        fullName: "Ravi Ghosh",
        email: "ravi@rideshare.com",
        mobile: "9876543214",
        isVerified: true,
        isApproved: true,
        licenseNumber: "WB1234567894",
        vehicleType: "Van",
        vehicleNumber: "WB 05 IJ 7890",
      },
    ];

    for (const driver of drivers) {
      await db.insert(users).values(driver);
    }
    console.log("✅ Created 5 sample drivers (all auto-approved)");

    // Create sample vehicles with popular West Bengal routes
    const sampleVehicles = [
      {
        driverName: "Rajesh Kumar",
        driverMobile: "9876543210",
        vehicleType: "Car",
        vehicleNumber: "WB 01 AB 1234",
        from: "Kolkata",
        to: "Siliguri",
        departureTime: "06:00 AM",
        availableSeats: 4,
        pricePerSeat: 2500,
        amenities: ["AC", "Music", "Charging Port"],
      },
      {
        driverName: "Amit Sharma",
        driverMobile: "9876543211",
        vehicleType: "SUV",
        vehicleNumber: "WB 02 CD 5678",
        from: "Howrah",
        to: "Darjeeling",
        departureTime: "05:00 AM",
        availableSeats: 6,
        pricePerSeat: 4500,
        amenities: ["AC", "Music", "WiFi", "Charging Port"],
      },
      {
        driverName: "Suresh Mondal",
        driverMobile: "9876543212",
        vehicleType: "Bus",
        vehicleNumber: "WB 03 EF 9012",
        from: "Sealdah",
        to: "Digha",
        departureTime: "07:00 AM",
        availableSeats: 40,
        pricePerSeat: 800,
        amenities: ["AC", "Music", "Washroom"],
      },
      {
        driverName: "Kamal Das",
        driverMobile: "9876543213",
        vehicleType: "Auto",
        vehicleNumber: "WB 04 GH 3456",
        from: "Durgapur",
        to: "Asansol",
        departureTime: "08:00 AM",
        availableSeats: 3,
        pricePerSeat: 150,
        amenities: [],
      },
      {
        driverName: "Ravi Ghosh",
        driverMobile: "9876543214",
        vehicleType: "Van",
        vehicleNumber: "WB 05 IJ 7890",
        from: "Kharagpur",
        to: "Haldia",
        departureTime: "09:00 AM",
        availableSeats: 12,
        pricePerSeat: 500,
        amenities: ["AC", "Music"],
      },
      {
        driverName: "Rajesh Kumar",
        driverMobile: "9876543210",
        vehicleType: "Car",
        vehicleNumber: "WB 01 AB 1234",
        from: "Kolkata",
        to: "Durgapur",
        departureTime: "10:00 AM",
        availableSeats: 4,
        pricePerSeat: 1200,
        amenities: ["AC", "Music"],
      },
      {
        driverName: "Amit Sharma",
        driverMobile: "9876543211",
        vehicleType: "SUV",
        vehicleNumber: "WB 02 CD 5678",
        from: "Siliguri",
        to: "Gangtok",
        departureTime: "06:30 AM",
        availableSeats: 6,
        pricePerSeat: 3000,
        amenities: ["AC", "Music", "WiFi"],
      },
      {
        driverName: "Suresh Mondal",
        driverMobile: "9876543212",
        vehicleType: "Bus",
        vehicleNumber: "WB 03 EF 9012",
        from: "Kolkata",
        to: "Puri",
        departureTime: "11:00 PM",
        availableSeats: 40,
        pricePerSeat: 1500,
        amenities: ["AC", "Music", "Sleeper", "Washroom"],
      },
    ];

    for (const vehicle of sampleVehicles) {
      await db.insert(vehicles).values(vehicle);
    }
    console.log("✅ Created 8 sample vehicles with popular routes");

    // Create West Bengal locations (23 districts + major cities)
    const wbLocations = [
      // Major Cities
      { name: "Kolkata", district: "Kolkata", type: "city" as const },
      { name: "Howrah", district: "Howrah", type: "city" as const },
      { name: "Sealdah", district: "Kolkata", type: "city" as const },
      { name: "Salt Lake", district: "Kolkata", type: "city" as const },
      { name: "New Town", district: "Kolkata", type: "city" as const },
      
      // North Bengal
      { name: "Siliguri", district: "Darjeeling", type: "city" as const },
      { name: "Darjeeling", district: "Darjeeling", type: "city" as const },
      { name: "Kalimpong", district: "Kalimpong", type: "city" as const },
      { name: "Jalpaiguri", district: "Jalpaiguri", type: "city" as const },
      { name: "Cooch Behar", district: "Cooch Behar", type: "city" as const },
      { name: "Alipurduar", district: "Alipurduar", type: "city" as const },
      { name: "Malda", district: "Malda", type: "city" as const },
      
      // South Bengal
      { name: "Durgapur", district: "Paschim Bardhaman", type: "city" as const },
      { name: "Asansol", district: "Paschim Bardhaman", type: "city" as const },
      { name: "Bardhaman", district: "Purba Bardhaman", type: "city" as const },
      { name: "Kharagpur", district: "Paschim Medinipur", type: "city" as const },
      { name: "Haldia", district: "Purba Medinipur", type: "city" as const },
      { name: "Digha", district: "Purba Medinipur", type: "city" as const },
      { name: "Mandarmani", district: "Purba Medinipur", type: "city" as const },
      
      // Other Districts
      { name: "Bankura", district: "Bankura", type: "city" as const },
      { name: "Purulia", district: "Purulia", type: "city" as const },
      { name: "Birbhum", district: "Birbhum", type: "city" as const },
      { name: "Murshidabad", district: "Murshidabad", type: "city" as const },
      { name: "Nadia", district: "Nadia", type: "city" as const },
      { name: "North 24 Parganas", district: "North 24 Parganas", type: "city" as const },
      { name: "South 24 Parganas", district: "South 24 Parganas", type: "city" as const },
      { name: "Hooghly", district: "Hooghly", type: "city" as const },
      
      // Tourist Destinations
      { name: "Shantiniketan", district: "Birbhum", type: "tourist" as const },
      { name: "Sundarbans", district: "South 24 Parganas", type: "tourist" as const },
      { name: "Bakkhali", district: "South 24 Parganas", type: "tourist" as const },
      { name: "Bishnupur", district: "Bankura", type: "tourist" as const },
      
      // Neighboring States (popular routes)
      { name: "Gangtok", district: "Sikkim", type: "city" as const },
      { name: "Puri", district: "Odisha", type: "city" as const },
      { name: "Bhubaneswar", district: "Odisha", type: "city" as const },
      { name: "Patna", district: "Bihar", type: "city" as const },
      { name: "Guwahati", district: "Assam", type: "city" as const },
    ];

    for (const location of wbLocations) {
      await db.insert(locations).values(location);
    }
    console.log("✅ Created 35+ West Bengal locations");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Default Credentials:");
    console.log("   Admin: username=admin, password=admin123");
    console.log("   Drivers: username=driver1-5, password=driver123");
    console.log("\n🚗 Sample vehicles and routes have been created.");
    console.log("📍 West Bengal locations are ready for search.");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("\n✅ Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seed failed:", error);
      process.exit(1);
    });
}

export { seed };
