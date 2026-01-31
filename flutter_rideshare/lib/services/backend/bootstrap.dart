import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'backend.dart';
import 'firestore_backend.dart';

class BackendBootstrap {
  static Future<RideShareBackend> initialize() async {
    // Initialize Firebase
    await Firebase.initializeApp();

    // Initialize Firestore
    final firestore = FirebaseFirestore.instance;

    // Return Firestore backend
    return FirestoreBackend(db: firestore);
  }
}
