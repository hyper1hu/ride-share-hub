import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/car.dart';
import '../models/booking.dart';
import '../models/customer.dart';
import '../models/driver.dart';
import '../services/api_service.dart';
import '../services/backend/backend.dart';

class BackendError implements Exception {
  final String message;
  BackendError(this.message);

  @override
  String toString() => message;
}

class AppProvider with ChangeNotifier {
  final RideShareBackend backend;
  final SharedPreferences prefs;

  bool _isDarkMode = false;
  List<Car> _cars = [];
  List<Booking> _bookings = [];
  bool _isLoading = false;
  Customer? _customer;
  Driver? _driver;
  String? _error;

  String? _pendingOtpMobile;
  String? _pendingOtpUserType;
  String? _displayOtp;
  bool _otpVerified = false;

  bool get isDarkMode => _isDarkMode;
  List<Car> get cars => _cars;
  List<Booking> get bookings => _bookings;
  bool get isLoading => _isLoading;
  Customer? get customer => _customer;
  Driver? get driver => _driver;
  String? get error => _error;
  bool get isCustomerLoggedIn => _customer != null;
  bool get isDriverLoggedIn => _driver != null;
  String? get pendingOtpMobile => _pendingOtpMobile;
  String? get displayOtp => _displayOtp;
  bool get otpVerified => _otpVerified;

  @Deprecated('Internal; use backend directly if needed')
  String? get pendingOtpUserType => _pendingOtpUserType;

  List<Car> get availableCars => _cars.where((c) => c.status == 'available').toList();

  AppProvider({required this.backend, required this.prefs}) {
    _isDarkMode = prefs.getBool('isDarkMode') ?? false;
    _loadSavedAuth();
  }

  Future<void> _loadSavedAuth() async {
    final customerMobile = prefs.getString('customerMobile');
    final driverMobile = prefs.getString('driverMobile');
    
    if (customerMobile != null) {
      _customer = await backend.loginCustomer(customerMobile);
    }
    if (driverMobile != null) {
      _driver = await backend.loginDriver(driverMobile);
    }
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    await prefs.setBool('isDarkMode', _isDarkMode);
    notifyListeners();
  }

  Future<OtpResult> sendOtp(String mobile, String userType) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await backend.sendOtp(mobile, userType);
    
    if (result.success) {
      _pendingOtpMobile = mobile;
      _pendingOtpUserType = userType;
      _displayOtp = result.otp;
      _otpVerified = false;
    } else {
      _error = result.error ?? 'Failed to send OTP';
    }

    _isLoading = false;
    notifyListeners();
    return result;
  }

  Future<Map<String, dynamic>> verifyOtp(String mobile, String otp, String userType) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await backend.verifyOtp(mobile, otp, userType);
    
    if (result['success'] == true) {
      _otpVerified = true;
      _displayOtp = null;
    } else {
      _error = result['error'] ?? 'Invalid OTP';
    }

    _isLoading = false;
    notifyListeners();
    return result;
  }

  void clearOtpState() {
    _pendingOtpMobile = null;
    _pendingOtpUserType = null;
    _displayOtp = null;
    _otpVerified = false;
    notifyListeners();
  }

  Future<bool> loginCustomer(String mobile) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    _customer = await backend.loginCustomer(mobile);
    
    if (_customer != null) {
      await prefs.setString('customerMobile', mobile);
    } else {
      _error = 'Customer not found. Please register first.';
    }

    _isLoading = false;
    notifyListeners();
    return _customer != null;
  }

  Future<bool> registerCustomer(String mobile, String name, int age) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    _customer = await backend.registerCustomer(mobile, name, age);
    
    if (_customer != null) {
      await prefs.setString('customerMobile', mobile);
    } else {
      _error = 'Registration failed. Please try again.';
    }

    _isLoading = false;
    notifyListeners();
    return _customer != null;
  }

  Future<bool> loginDriver(String mobile) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    _driver = await backend.loginDriver(mobile);
    
    if (_driver != null) {
      await prefs.setString('driverMobile', mobile);
    } else {
      _error = 'Driver not found. Please register first.';
    }

    _isLoading = false;
    notifyListeners();
    return _driver != null;
  }

  Future<bool> registerDriver({
    required String mobile,
    required String name,
    required int age,
    required String aadhaarNumber,
    required String licenseNumber,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    _driver = await backend.registerDriver(
      mobile: mobile,
      name: name,
      age: age,
      aadhaarNumber: aadhaarNumber,
      licenseNumber: licenseNumber,
    );
    
    if (_driver != null) {
      await prefs.setString('driverMobile', mobile);
    } else {
      _error = 'Registration failed. Please try again.';
    }

    _isLoading = false;
    notifyListeners();
    return _driver != null;
  }

  Future<void> logout() async {
    await prefs.remove('customerMobile');
    await prefs.remove('driverMobile');
    _customer = null;
    _driver = null;
    notifyListeners();
  }

  Future<void> logoutCustomer() async {
    await prefs.remove('customerMobile');
    _customer = null;
    notifyListeners();
  }

  Future<void> logoutDriver() async {
    await prefs.remove('driverMobile');
    _driver = null;
    notifyListeners();
  }

  Future<void> fetchCars() async {
    _isLoading = true;
    notifyListeners();

    _cars = await backend.getCars();
    _bookings = await backend.getBookings();

    _isLoading = false;
    notifyListeners();
  }

  Future<List<Car>> searchCars({String? origin, String? destination}) async {
    if (origin == null && destination == null) {
      return availableCars;
    }
    return await backend.searchCars(origin: origin ?? '', destination: destination ?? '');
  }

  Future<bool> addCar(Car car) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final saved = await backend.createCar(car);
    if (saved == null) {
      _error = 'Failed to list vehicle.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
    _cars.insert(0, saved);
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<void> removeCar(String carId) async {
    await backend.deleteCar(carId);
    _cars.removeWhere((c) => c.id == carId);
    notifyListeners();
  }

  Future<Booking?> createBooking(Booking booking) async {
    final saved = await backend.createBooking(booking);
    if (saved == null) {
      _error = 'Failed to create booking.';
      notifyListeners();
      return null;
    }
    _bookings.insert(0, saved);
    notifyListeners();
    return saved;
  }

  List<Booking> getBookingsForCar(String carId) {
    return _bookings.where((b) => b.carId == carId && b.status != 'cancelled').toList();
  }

  int getAvailableSeats(Car car) {
    final carBookings = getBookingsForCar(car.id);
    final bookedSeats = carBookings.fold(0, (sum, b) => sum + b.seatsBooked);
    return car.seatsAvailable - bookedSeats;
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
