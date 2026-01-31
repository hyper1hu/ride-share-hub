import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'backend.dart';
import 'firestore_backend.dart';

class BackendBootstrap {
  static Future<RideShareBackend> initialize() async {
    try {
      // Initialize Firebase
      // Note: Firebase will automatically use google-services.json (Android)
      // or firebase_options.dart if configured via FlutterFire CLI
      await Firebase.initializeApp();

      // Initialize Firestore
      final firestore = FirebaseFirestore.instance;

      // Return Firestore backend
      return FirestoreBackend(db: firestore);
    } catch (e) {
      // If Firebase initialization fails, show helpful error message
      throw Exception(
        'Firebase initialization failed!\n\n'
        'Please ensure you have:\n'
        '1. Downloaded google-services.json from Firebase Console\n'
        '2. Placed it in android/app/google-services.json\n'
        '3. Or run: flutterfire configure\n\n'
        'Error: $e',
      );
    }
  }
}
