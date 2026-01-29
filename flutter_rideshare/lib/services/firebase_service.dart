import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/car.dart';
import '../models/booking.dart';
import '../models/customer.dart';
import '../models/driver.dart';

class FirebaseService {
  static FirebaseDatabase? _database;
  static FirebaseAuth? _auth;
  static FirebaseFirestore? _firestore;
  static bool _initialized = false;

  static Future<void> initialize() async {
    if (_initialized) return;

    try {
      await Firebase.initializeApp();
      _database = FirebaseDatabase.instance;
      _auth = FirebaseAuth.instance;
      _firestore = FirebaseFirestore.instance;
      _initialized = true;
      print('✅ Firebase initialized successfully');
    } catch (e) {
      print('⚠️ Firebase initialization error: $e');
      print('💡 Running in offline mode - using REST API instead');
    }
  }

  static bool get isInitialized => _initialized;

  // Cars - Firestore Collection
  static Future<List<Car>> getCars() async {
    if (!_initialized) return [];

    try {
      final snapshot = await _firestore!.collection('cars').get();
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return Car.fromJson(data);
      }).toList();
    } catch (e) {
      print('Error fetching cars from Firebase: $e');
      return [];
    }
  }

  static Future<Car?> createCar(Map<String, dynamic> carData) async {
    if (!_initialized) return null;

    try {
      final docRef = await _firestore!.collection('cars').add(carData);
      carData['id'] = docRef.id;
      await docRef.update({'id': docRef.id});
      return Car.fromJson(carData);
    } catch (e) {
      print('Error creating car in Firebase: $e');
      return null;
    }
  }

  static Future<bool> deleteCar(String carId) async {
    if (!_initialized) return false;

    try {
      await _firestore!.collection('cars').doc(carId).delete();
      return true;
    } catch (e) {
      print('Error deleting car from Firebase: $e');
      return false;
    }
  }

  static Future<List<Car>> searchCars(String origin, String destination) async {
    if (!_initialized) return [];

    try {
      Query query = _firestore!.collection('cars');

      if (origin.isNotEmpty) {
        query = query.where('origin', isEqualTo: origin);
      }
      if (destination.isNotEmpty) {
        query = query.where('destination', isEqualTo: destination);
      }

      final snapshot = await query.get();
      return snapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        data['id'] = doc.id;
        return Car.fromJson(data);
      }).toList();
    } catch (e) {
      print('Error searching cars in Firebase: $e');
      return [];
    }
  }

  // Bookings - Firestore Collection
  static Future<Booking?> createBooking(Map<String, dynamic> bookingData) async {
    if (!_initialized) return null;

    try {
      final docRef = await _firestore!.collection('bookings').add(bookingData);
      bookingData['id'] = docRef.id;
      await docRef.update({'id': docRef.id});
      return Booking.fromJson(bookingData);
    } catch (e) {
      print('Error creating booking in Firebase: $e');
      return null;
    }
  }

  static Future<List<Booking>> getBookings() async {
    if (!_initialized) return [];

    try {
      final snapshot = await _firestore!.collection('bookings').get();
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return Booking.fromJson(data);
      }).toList();
    } catch (e) {
      print('Error fetching bookings from Firebase: $e');
      return [];
    }
  }

  static Future<List<Booking>> getBookingsByCustomer(String customerId) async {
    if (!_initialized) return [];

    try {
      final snapshot = await _firestore!
          .collection('bookings')
          .where('customerId', isEqualTo: customerId)
          .get();
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return Booking.fromJson(data);
      }).toList();
    } catch (e) {
      print('Error fetching customer bookings from Firebase: $e');
      return [];
    }
  }

  static Future<List<Booking>> getBookingsByCar(String carId) async {
    if (!_initialized) return [];

    try {
      final snapshot = await _firestore!
          .collection('bookings')
          .where('carId', isEqualTo: carId)
          .get();
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return Booking.fromJson(data);
      }).toList();
    } catch (e) {
      print('Error fetching car bookings from Firebase: $e');
      return [];
    }
  }

  // Customers - Firestore Collection
  static Future<Customer?> registerCustomer(String mobile, String name, int age) async {
    if (!_initialized) return null;

    try {
      final customerData = {
        'mobile': mobile,
        'name': name,
        'age': age,
        'createdAt': FieldValue.serverTimestamp(),
      };

      final docRef = await _firestore!.collection('customers').add(customerData);
      customerData['id'] = docRef.id;
      customerData['createdAt'] = DateTime.now().toIso8601String();
      await docRef.update({'id': docRef.id});

      return Customer.fromJson(customerData);
    } catch (e) {
      print('Error registering customer in Firebase: $e');
      return null;
    }
  }

  static Future<Customer?> getCustomerByMobile(String mobile) async {
    if (!_initialized) return null;

    try {
      final snapshot = await _firestore!
          .collection('customers')
          .where('mobile', isEqualTo: mobile)
          .limit(1)
          .get();

      if (snapshot.docs.isEmpty) return null;

      final data = snapshot.docs.first.data();
      data['id'] = snapshot.docs.first.id;
      return Customer.fromJson(data);
    } catch (e) {
      print('Error fetching customer from Firebase: $e');
      return null;
    }
  }

  // Drivers - Firestore Collection
  static Future<Driver?> registerDriver({
    required String mobile,
    required String name,
    required int age,
    required String aadhaarNumber,
    required String licenseNumber,
  }) async {
    if (!_initialized) return null;

    try {
      final driverData = {
        'mobile': mobile,
        'name': name,
        'age': age,
        'aadhaarNumber': aadhaarNumber,
        'licenseNumber': licenseNumber,
        'verificationStatus': 'pending',
        'createdAt': FieldValue.serverTimestamp(),
      };

      final docRef = await _firestore!.collection('drivers').add(driverData);
      driverData['id'] = docRef.id;
      driverData['createdAt'] = DateTime.now().toIso8601String();
      await docRef.update({'id': docRef.id});

      return Driver.fromJson(driverData);
    } catch (e) {
      print('Error registering driver in Firebase: $e');
      return null;
    }
  }

  static Future<Driver?> getDriverByMobile(String mobile) async {
    if (!_initialized) return null;

    try {
      final snapshot = await _firestore!
          .collection('drivers')
          .where('mobile', isEqualTo: mobile)
          .limit(1)
          .get();

      if (snapshot.docs.isEmpty) return null;

      final data = snapshot.docs.first.data();
      data['id'] = snapshot.docs.first.id;
      return Driver.fromJson(data);
    } catch (e) {
      print('Error fetching driver from Firebase: $e');
      return null;
    }
  }

  static Future<bool> updateDriverVerificationStatus(String driverId, String status) async {
    if (!_initialized) return false;

    try {
      await _firestore!.collection('drivers').doc(driverId).update({
        'verificationStatus': status,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      return true;
    } catch (e) {
      print('Error updating driver verification status in Firebase: $e');
      return false;
    }
  }

  // OTP Storage - Realtime Database
  static Future<String> storeOtp(String mobile, String userType) async {
    if (!_initialized) return '';

    try {
      final otp = _generateOtp();
      final expiresAt = DateTime.now().add(const Duration(minutes: 5)).millisecondsSinceEpoch;

      await _database!.ref('otps/$mobile').set({
        'otp': otp,
        'userType': userType,
        'expiresAt': expiresAt,
        'createdAt': ServerValue.timestamp,
      });

      return otp;
    } catch (e) {
      print('Error storing OTP in Firebase: $e');
      return '';
    }
  }

  static Future<bool> verifyOtp(String mobile, String otp) async {
    if (!_initialized) return false;

    try {
      final snapshot = await _database!.ref('otps/$mobile').get();

      if (!snapshot.exists) return false;

      final data = snapshot.value as Map<dynamic, dynamic>;
      final storedOtp = data['otp'] as String;
      final expiresAt = data['expiresAt'] as int;

      if (DateTime.now().millisecondsSinceEpoch > expiresAt) {
        await _database!.ref('otps/$mobile').remove();
        return false;
      }

      if (storedOtp == otp) {
        await _database!.ref('otps/$mobile').remove();
        return true;
      }

      return false;
    } catch (e) {
      print('Error verifying OTP in Firebase: $e');
      return false;
    }
  }

  static String _generateOtp() {
    return (100000 + (DateTime.now().millisecondsSinceEpoch % 900000)).toString();
  }

  // Statistics
  static Future<Map<String, int>> getStatistics() async {
    if (!_initialized) {
      return {
        'totalCars': 0,
        'totalBookings': 0,
        'totalCustomers': 0,
        'totalDrivers': 0,
      };
    }

    try {
      final carsCount = (await _firestore!.collection('cars').count().get()).count ?? 0;
      final bookingsCount = (await _firestore!.collection('bookings').count().get()).count ?? 0;
      final customersCount = (await _firestore!.collection('customers').count().get()).count ?? 0;
      final driversCount = (await _firestore!.collection('drivers').count().get()).count ?? 0;

      return {
        'totalCars': carsCount,
        'totalBookings': bookingsCount,
        'totalCustomers': customersCount,
        'totalDrivers': driversCount,
      };
    } catch (e) {
      print('Error fetching statistics from Firebase: $e');
      return {
        'totalCars': 0,
        'totalBookings': 0,
        'totalCustomers': 0,
        'totalDrivers': 0,
      };
    }
  }

  // Real-time listeners
  static Stream<List<Car>> carsStream() {
    if (!_initialized) return Stream.value([]);

    return _firestore!.collection('cars').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return Car.fromJson(data);
      }).toList();
    });
  }

  static Stream<List<Booking>> bookingsStream() {
    if (!_initialized) return Stream.value([]);

    return _firestore!.collection('bookings').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return Booking.fromJson(data);
      }).toList();
    });
  }
}
