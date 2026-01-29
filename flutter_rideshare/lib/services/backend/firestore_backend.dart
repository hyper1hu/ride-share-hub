import 'dart:math';

import 'package:cloud_firestore/cloud_firestore.dart';

import '../../models/booking.dart';
import '../../models/car.dart';
import '../../models/customer.dart';
import '../../models/driver.dart';
import 'backend.dart';

class FirestoreBackend implements RideShareBackend {
  final FirebaseFirestore db;
  final Random _random;

  FirestoreBackend({required this.db, Random? random}) : _random = random ?? Random();

  DocumentReference<Map<String, dynamic>> _otpDoc(String mobile, String userType) {
    return db.collection('otps').doc('$userType-$mobile');
  }

  @override
  Future<OtpResult> sendOtp(String mobile, String userType) async {
    final otp = (_random.nextInt(900000) + 100000).toString();
    final expiresAt = DateTime.now().add(const Duration(minutes: 5));

    await _otpDoc(mobile, userType).set({
      'mobile': mobile,
      'userType': userType,
      'otp': otp,
      'expiresAt': Timestamp.fromDate(expiresAt),
      'createdAt': FieldValue.serverTimestamp(),
    });
    return OtpResult(success: true, otp: otp, expiresAt: expiresAt);
  }

  @override
  Future<Map<String, dynamic>> verifyOtp(String mobile, String otp, String userType) async {
    final snap = await _otpDoc(mobile, userType).get();
    if (!snap.exists) {
      return {'success': false, 'error': 'OTP not found'};
    }
    final data = snap.data() ?? <String, dynamic>{};
    final storedOtp = data['otp']?.toString();
    final expiresAt = (data['expiresAt'] as Timestamp?)?.toDate();
    if (expiresAt == null || DateTime.now().isAfter(expiresAt)) {
      return {'success': false, 'error': 'OTP expired'};
    }
    if (storedOtp != otp) {
      return {'success': false, 'error': 'Invalid OTP'};
    }
    return {'success': true};
  }

  @override
  Future<Customer?> loginCustomer(String mobile) async {
    final snap = await db.collection('customers').doc(mobile).get();
    if (!snap.exists) return null;
    return Customer.fromJson({'id': snap.id, ...(snap.data() ?? {})});
  }

  @override
  Future<Customer?> registerCustomer(String mobile, String name, int age) async {
    final payload = {
      'mobile': mobile,
      'name': name,
      'age': age,
      'createdAt': FieldValue.serverTimestamp(),
    };
    await db.collection('customers').doc(mobile).set(payload, SetOptions(merge: true));
    final snap = await db.collection('customers').doc(mobile).get();
    final data = snap.data() ?? payload;
    return Customer.fromJson({'id': mobile, ...data, 'createdAt': DateTime.now().toIso8601String()});
  }

  @override
  Future<Driver?> loginDriver(String mobile) async {
    final snap = await db.collection('drivers').doc(mobile).get();
    if (!snap.exists) return null;
    return Driver.fromJson({'id': snap.id, ...(snap.data() ?? {})});
  }

  @override
  Future<Driver?> registerDriver({
    required String mobile,
    required String name,
    required int age,
    required String aadhaarNumber,
    required String licenseNumber,
  }) async {
    final payload = {
      'mobile': mobile,
      'name': name,
      'age': age,
      'aadhaarNumber': aadhaarNumber,
      'licenseNumber': licenseNumber,
      'verificationStatus': 'pending',
      'createdAt': FieldValue.serverTimestamp(),
    };
    await db.collection('drivers').doc(mobile).set(payload, SetOptions(merge: true));
    final snap = await db.collection('drivers').doc(mobile).get();
    final data = snap.data() ?? payload;
    return Driver.fromJson({'id': mobile, ...data, 'createdAt': DateTime.now().toIso8601String()});
  }

  @override
  Future<List<Car>> getCars() async {
    final snap = await db.collection('cars').orderBy('createdAt', descending: true).get();
    return snap.docs.map((d) => Car.fromJson({'id': d.id, ...(d.data())})).toList();
  }

  @override
  Future<List<Car>> searchCars({required String origin, required String destination}) async {
    final all = await getCars();
    final originQuery = origin.trim().toLowerCase();
    final destinationQuery = destination.trim().toLowerCase();
    return all.where((car) {
      final matchesOrigin = originQuery.isEmpty || car.origin.toLowerCase().contains(originQuery);
      final matchesDestination =
          destinationQuery.isEmpty || car.destination.toLowerCase().contains(destinationQuery);
      return matchesOrigin && matchesDestination && car.status == 'available';
    }).toList();
  }

  @override
  Future<Car?> createCar(Car car) async {
    final ref = db.collection('cars').doc(car.id);
    await ref.set({
      ...car.toJson(),
      'createdAt': FieldValue.serverTimestamp(),
    });
    return car;
  }

  @override
  Future<bool> deleteCar(String carId) async {
    await db.collection('cars').doc(carId).delete();
    return true;
  }

  @override
  Future<Booking?> createBooking(Booking booking) async {
    final ref = db.collection('bookings').doc(booking.id);
    await ref.set({
      ...booking.toJson(),
      'createdAt': FieldValue.serverTimestamp(),
    });
    return booking;
  }

  @override
  Future<List<Booking>> getBookings() async {
    final snap = await db.collection('bookings').orderBy('createdAt', descending: true).get();
    return snap.docs.map((d) => Booking.fromJson({'id': d.id, ...(d.data())})).toList();
  }
}
