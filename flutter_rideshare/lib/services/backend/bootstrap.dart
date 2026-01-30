import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';

import 'backend.dart';
import 'firestore_backend.dart';

class BackendBootstrap {
  static Future<RideShareBackend> initialize() async {
    await Firebase.initializeApp();
    return FirestoreBackend(db: FirebaseFirestore.instance);
  }
}
