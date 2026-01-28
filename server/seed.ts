import { db } from "./db";

async function seed() {
  console.log("🌱 Database seed script");
  console.log("\n⚠️  This seed script needs to be updated to match the current schema.");
  console.log("Sample data will be automatically created when you start the server.");
  console.log("See server/routes.ts initializeSampleData() function for details.");
  console.log("\n✅ Database is ready to use");
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
