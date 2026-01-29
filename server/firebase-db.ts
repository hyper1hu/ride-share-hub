import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin
let firebaseApp: admin.app.App;

try {
  // Check if Firebase is already initialized
  firebaseApp = admin.app();
} catch (error) {
  // Initialize Firebase with service account or default credentials
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("[FIREBASE] Initialized with service account credentials");
    } catch (parseError) {
      console.error("[FIREBASE] Failed to parse service account key:", parseError);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format");
    }
  } else {
    // Throw error if no credentials provided
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is required. Please add your Firebase credentials to .env file. " +
      "Visit https://console.firebase.google.com to get your service account key."
    );
  }
}

// Get Firestore instance
export const firestore = admin.firestore();

// Configure Firestore settings
firestore.settings({
  ignoreUndefinedProperties: true,
});

// Collection names
export const COLLECTIONS = {
  CUSTOMERS: "customers",
  DRIVERS: "drivers",
  CARS: "cars",
  BOOKINGS: "bookings",
  ADMINS: "admins",
  OTPS: "otps",
  AUDIT_LOGS: "auditLogs",
  RATE_LIMITS: "rateLimits",
  DRIVER_VEHICLES: "driverVehicles",
  INQUIRIES: "inquiries",
  MESSAGES: "messages",
  SUPPORT_TICKETS: "supportTickets",
  DRIVER_SCHEDULES: "driverSchedules",
} as const;

// Helper function to generate ID
export function generateId(): string {
  return firestore.collection("_temp").doc().id;
}

// Helper function to convert Firestore timestamp to Date
export function toDate(timestamp: admin.firestore.Timestamp | Date | undefined): Date | undefined {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
}

// Helper function to convert Date to Firestore timestamp
export function toTimestamp(date: Date | undefined): admin.firestore.Timestamp | undefined {
  if (!date) return undefined;
  return admin.firestore.Timestamp.fromDate(date);
}

export { admin };
