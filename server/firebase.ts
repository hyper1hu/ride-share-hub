import admin from "firebase-admin";

let firebaseInitialized = false;

export function initializeFirebase() {
  if (firebaseInitialized) {
    return admin;
  }

  try {
    // Check if Firebase credentials are provided
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // Production: Use service account key from environment variable
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("[Firebase] Initialized with service account credentials");
    } else {
      // Development: Firebase is optional, will use mock OTP
      console.log("[Firebase] No credentials found - using mock OTP for development");
      console.log("[Firebase] To enable real SMS OTP, set FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
      return null;
    }

    firebaseInitialized = true;
    return admin;
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
    console.log("[Firebase] Falling back to mock OTP for development");
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
