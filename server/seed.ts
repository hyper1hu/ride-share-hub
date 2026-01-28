import { db } from "./db";
import { users } from "../shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Check if admin already exists
    const { eq } = await import("drizzle-orm");
    const existingAdmin = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log("⚠️  Admin user already exists. Skipping seed.");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      id: crypto.randomUUID(),
      username: "admin",
      password: hashedPassword,
    });
    console.log("✅ Created admin user (username: admin, password: admin123)");

    console.log("✅ Skipping driver creation (simplified seed)");

    console.log("✅ Skipping vehicle creation (simplified seed)");

    console.log("✅ Skipping location creation (simplified seed)");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Default Credentials:");
    console.log("   Admin: username=admin, password=admin123");
    
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
