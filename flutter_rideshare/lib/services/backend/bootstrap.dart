import 'package:firebase_core/firebase_core.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'backend.dart';
import 'firestore_backend.dart';
import 'local_backend.dart';

class BackendBootstrap {
  static Future<RideShareBackend> initialize(SharedPreferences prefs) async {
    try {
      await Firebase.initializeApp();
      return FirestoreBackend(db: FirebaseFirestore.instance);
    } catch (_) {
      return LocalBackend(prefs: prefs);
    }
  }

  static RideShareBackend forTests(SharedPreferences prefs) {
    return LocalBackend(prefs: prefs);
  }
}

