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
  const hasServiceAccountKey = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  const hasApplicationDefaultCreds =
    Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
    Boolean(process.env.FIRESTORE_EMULATOR_HOST);
  const isProduction = process.env.NODE_ENV === "production";

  if (hasServiceAccountKey) {
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
  } else if (isProduction && !hasApplicationDefaultCreds) {
    // Production should fail fast when Firebase isn't configured.
    throw new Error(
      "Firebase credentials are required in production. Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS, " +
        "or configure FIRESTORE_EMULATOR_HOST for local development.",
    );
  } else {
    // Development mode: allow server to boot without Firebase credentials.
    console.log("[FIREBASE] Running in development mode without credentials");
    console.log("[FIREBASE] Set FIREBASE_SERVICE_ACCOUNT_KEY for production");

    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "chaloo-ride-dev",
    });
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
