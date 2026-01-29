import admin from "firebase-admin";

// Use the centralized Firebase initialization from firebase-db
export function initializeFirebase() {
  try {
    // Treat "no credentials" like development mode even if the app got initialized
    // with only a projectId.
    const hasFirestoreAuth =
      Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) ||
      Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
      Boolean(process.env.FIRESTORE_EMULATOR_HOST);

    if (!hasFirestoreAuth) {
      console.log("[Firebase] Credentials not configured - using mock OTP for development");
      return null;
    }

    // Check if Firebase is already initialized by firebase-db.ts
    return admin.app();
  } catch (error) {
    // If not initialized, return null for development mode
    console.log("[Firebase] Not initialized - using mock OTP for development");
    return null;
  }
}

export async function sendOtpViaSms(mobile: string, otp: string): Promise<boolean> {
  try {
    const firebaseAdmin = initializeFirebase();
    
    if (!firebaseAdmin) {
      // Development mode - just log the OTP
      console.log(`[OTP] Development mode - OTP for ${mobile}: ${otp}`);
      return true;
    }

    // In production with Firebase, you would typically:
    // 1. Use Firebase Authentication's phone auth
    // 2. Or integrate with a third-party SMS service via Firebase Functions
    // 
    // Note: Firebase Admin SDK doesn't directly send SMS.
    // You need to use Firebase Authentication on the client side
    // or integrate with SMS providers like Twilio, AWS SNS, etc.
    
    console.log(`[Firebase] OTP for ${mobile}: ${otp}`);
    console.log("[Firebase] Note: Firebase Admin SDK requires client-side phone auth or SMS provider integration");
    
    return true;
  } catch (error) {
    console.error("[Firebase] Error sending OTP:", error);
    return false;
  }
}

export function getFirebaseAdmin() {
  return initializeFirebase();
}
