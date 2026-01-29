import 'dart:convert';
import 'dart:math';

import 'package:shared_preferences/shared_preferences.dart';

import '../../models/booking.dart';
import '../../models/car.dart';
import '../../models/customer.dart';
import '../../models/driver.dart';
import '../api_service.dart';
import 'backend.dart';

class LocalBackend implements RideShareBackend {
  static const _customersKey = 'local.customers';
  static const _driversKey = 'local.drivers';
  static const _carsKey = 'local.cars';
  static const _bookingsKey = 'local.bookings';
  static const _otpKeyPrefix = 'local.otp.';

  final SharedPreferences prefs;
  final Random _random;

  LocalBackend({required this.prefs, Random? random}) : _random = random ?? Random();

  @override
  bool get supportsFirebase => false;

  @override
  Future<OtpResult> sendOtp(String mobile, String userType) async {
    final otp = (_random.nextInt(900000) + 100000).toString();
    final expiresAt = DateTime.now().add(const Duration(minutes: 5));
    await prefs.setString(
      '$_otpKeyPrefix$userType.$mobile',
      jsonEncode({'otp': otp, 'expiresAt': expiresAt.toIso8601String()}),
    );
    return OtpResult(success: true, otp: otp, expiresAt: expiresAt);
  }

  @override
  Future<Map<String, dynamic>> verifyOtp(String mobile, String otp, String userType) async {
    final raw = prefs.getString('$_otpKeyPrefix$userType.$mobile');
    if (raw == null) {
      return {'success': false, 'error': 'OTP not found'};
    }
    final data = jsonDecode(raw) as Map<String, dynamic>;
    final storedOtp = data['otp']?.toString();
    final expiresAt = DateTime.tryParse(data['expiresAt']?.toString() ?? '');
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
    final customers = _readList(_customersKey);
    final match = customers.cast<Map<String, dynamic>>().firstWhere(
          (c) => c['mobile']?.toString() == mobile,
          orElse: () => <String, dynamic>{},
        );
    if (match.isEmpty) return null;
    return Customer.fromJson(match);
  }

  @override
  Future<Customer?> registerCustomer(String mobile, String name, int age) async {
    final customers = _readList(_customersKey).cast<Map<String, dynamic>>();
    final now = DateTime.now();
    final id = mobile;

    final payload = Customer(id: id, mobile: mobile, name: name, age: age, createdAt: now).toJson();
    customers.removeWhere((c) => c['mobile']?.toString() == mobile);
    customers.add(payload);
    await _writeList(_customersKey, customers);
    return Customer.fromJson(payload);
  }

  @override
  Future<Driver?> loginDriver(String mobile) async {
    final drivers = _readList(_driversKey);
    final match = drivers.cast<Map<String, dynamic>>().firstWhere(
          (d) => d['mobile']?.toString() == mobile,
          orElse: () => <String, dynamic>{},
        );
    if (match.isEmpty) return null;
    return Driver.fromJson(match);
  }

  @override
  Future<Driver?> registerDriver({
    required String mobile,
    required String name,
    required int age,
    required String aadhaarNumber,
    required String licenseNumber,
  }) async {
    final drivers = _readList(_driversKey).cast<Map<String, dynamic>>();
    final now = DateTime.now();
    final payload = Driver(
      id: mobile,
      mobile: mobile,
      name: name,
      age: age,
      aadhaarNumber: aadhaarNumber,
      licenseNumber: licenseNumber,
      verificationStatus: 'pending',
      createdAt: now,
    ).toJson();
    drivers.removeWhere((d) => d['mobile']?.toString() == mobile);
    drivers.add(payload);
    await _writeList(_driversKey, drivers);
    return Driver.fromJson(payload);
  }

  @override
  Future<List<Car>> getCars() async {
    return _readList(_carsKey).cast<Map<String, dynamic>>().map(Car.fromJson).toList();
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
    final cars = _readList(_carsKey).cast<Map<String, dynamic>>();
    cars.removeWhere((c) => c['id']?.toString() == car.id);
    cars.add(car.toJson());
    await _writeList(_carsKey, cars);
    return car;
  }

  @override
  Future<bool> deleteCar(String carId) async {
    final cars = _readList(_carsKey).cast<Map<String, dynamic>>();
    cars.removeWhere((c) => c['id']?.toString() == carId);
    await _writeList(_carsKey, cars);
    return true;
  }

  @override
  Future<Booking?> createBooking(Booking booking) async {
    final bookings = _readList(_bookingsKey).cast<Map<String, dynamic>>();
    bookings.add(booking.toJson());
    await _writeList(_bookingsKey, bookings);
    return booking;
  }

  @override
  Future<List<Booking>> getBookings() async {
    return _readList(_bookingsKey).cast<Map<String, dynamic>>().map(Booking.fromJson).toList();
  }

  List<dynamic> _readList(String key) {
    final raw = prefs.getString(key);
    if (raw == null || raw.isEmpty) return [];
    final decoded = jsonDecode(raw);
    if (decoded is List) return decoded;
    return [];
  }

  Future<void> _writeList(String key, List<Map<String, dynamic>> value) async {
    await prefs.setString(key, jsonEncode(value));
  }
}
