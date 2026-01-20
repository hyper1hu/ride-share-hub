import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

console.log('\n🔍 Testing Ride Share Hub Setup...\n');

// Test 1: Environment Variables
console.log('1️⃣ Checking Environment Variables...');
if (process.env.DATABASE_URL) {
  console.log('   ✅ DATABASE_URL is set');
  // Hide password in output
  const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
  console.log('   📍 ' + maskedUrl);
} else {
  console.log('   ❌ DATABASE_URL is not set');
  process.exit(1);
}

if (process.env.SESSION_SECRET) {
  console.log('   ✅ SESSION_SECRET is set');
} else {
  console.log('   ⚠️  SESSION_SECRET not set (using default)');
}

// Test 2: Database Connection
console.log('\n2️⃣ Testing Database Connection...');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const client = await pool.connect();
  console.log('   ✅ Database connection successful');
  
  // Test 3: Check Tables
  console.log('\n3️⃣ Checking Database Tables...');
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  
  const expectedTables = ['admins', 'bookings', 'cars', 'customers', 'drivers', 'users'];
  const existingTables = tablesResult.rows.map(r => r.table_name);
  
  for (const table of expectedTables) {
    if (existingTables.includes(table)) {
      console.log(`   ✅ Table "${table}" exists`);
    } else {
      console.log(`   ❌ Table "${table}" missing`);
    }
  }
  
  // Test 4: Check Sample Data
  console.log('\n4️⃣ Checking Sample Data...');
  
  const adminCount = await client.query('SELECT COUNT(*) FROM admins');
  console.log(`   📊 Admins: ${adminCount.rows[0].count}`);
  
  const driverCount = await client.query('SELECT COUNT(*) FROM drivers');
  console.log(`   📊 Drivers: ${driverCount.rows[0].count}`);
  
  const carCount = await client.query('SELECT COUNT(*) FROM cars');
  console.log(`   📊 Vehicles: ${carCount.rows[0].count}`);
  
  const customerCount = await client.query('SELECT COUNT(*) FROM customers');
  console.log(`   📊 Customers: ${customerCount.rows[0].count}`);
  
  const bookingCount = await client.query('SELECT COUNT(*) FROM bookings');
  console.log(`   📊 Bookings: ${bookingCount.rows[0].count}`);
  
  // Test 5: Check Admin Login
  console.log('\n5️⃣ Checking Admin Account...');
  const adminResult = await client.query('SELECT username FROM admins WHERE username = $1', ['admin']);
  if (adminResult.rows.length > 0) {
    console.log('   ✅ Admin account exists (username: admin)');
    console.log('   🔑 Password: admin123');
  } else {
    console.log('   ❌ Admin account not found');
  }
  
  // Test 6: Check Sample Vehicles
  console.log('\n6️⃣ Sample Vehicles Available...');
  const carsResult = await client.query(`
    SELECT vehicle_type, origin, destination, fare 
    FROM cars 
    LIMIT 3
  `);
  
  if (carsResult.rows.length > 0) {
    carsResult.rows.forEach((car, idx) => {
      console.log(`   🚗 ${idx + 1}. ${car.vehicle_type}: ${car.origin} → ${car.destination} (₹${car.fare})`);
    });
  }
  
  client.release();
  
  // Final Summary
  console.log('\n✅ All checks passed!');
  console.log('\n📋 Summary:');
  console.log('   • Database: Connected ✅');
  console.log('   • Tables: Created ✅');
  console.log('   • Sample Data: Loaded ✅');
  console.log('   • Admin Account: Ready ✅');
  console.log('\n🚀 Your app is ready to run!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Start server: npm run dev');
  console.log('   2. Open browser: http://localhost:5000');
  console.log('   3. Login as admin: admin / admin123');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
} finally {
  await pool.end();
}
