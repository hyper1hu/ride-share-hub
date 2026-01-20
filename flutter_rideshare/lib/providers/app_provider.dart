import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/car.dart';
import '../models/booking.dart';
import '../models/customer.dart';
import '../models/driver.dart';
import '../services/api_service.dart';

class AppProvider with ChangeNotifier {
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

  List<Car> get availableCars => _cars.where((c) => c.status == 'available').toList();

  AppProvider() {
    _loadTheme();
    _loadSavedAuth();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool('isDarkMode') ?? false;
    notifyListeners();
  }

  Future<void> _loadSavedAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final customerMobile = prefs.getString('customerMobile');
    final driverMobile = prefs.getString('driverMobile');
    
    if (customerMobile != null) {
      _customer = await ApiService.loginCustomer(customerMobile);
    }
    if (driverMobile != null) {
      _driver = await ApiService.loginDriver(driverMobile);
    }
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    notifyListeners();
  }

  Future<OtpResult> sendOtp(String mobile, String userType) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await ApiService.sendOtp(mobile, userType);
    
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

    final result = await ApiService.verifyOtp(mobile, otp, userType);
    
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

    _customer = await ApiService.loginCustomer(mobile);
    
    if (_customer != null) {
      final prefs = await SharedPreferences.getInstance();
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

    _customer = await ApiService.registerCustomer(mobile, name, age);
    
    if (_customer != null) {
      final prefs = await SharedPreferences.getInstance();
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

    _driver = await ApiService.loginDriver(mobile);
    
    if (_driver != null) {
      final prefs = await SharedPreferences.getInstance();
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

    _driver = await ApiService.registerDriver(
      mobile: mobile,
      name: name,
      age: age,
      aadhaarNumber: aadhaarNumber,
      licenseNumber: licenseNumber,
    );
    
    if (_driver != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('driverMobile', mobile);
    } else {
      _error = 'Registration failed. Please try again.';
    }

    _isLoading = false;
    notifyListeners();
    return _driver != null;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('customerMobile');
    await prefs.remove('driverMobile');
    _customer = null;
    _driver = null;
    notifyListeners();
  }

  Future<void> logoutCustomer() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('customerMobile');
    _customer = null;
    notifyListeners();
  }

  Future<void> logoutDriver() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('driverMobile');
    _driver = null;
    notifyListeners();
  }

  Future<void> fetchCars() async {
    _isLoading = true;
    notifyListeners();

    _cars = await ApiService.getCars();

    _isLoading = false;
    notifyListeners();
  }

  Future<List<Car>> searchCars({String? origin, String? destination}) async {
    if (origin == null && destination == null) {
      return availableCars;
    }
    return await ApiService.searchCars(origin ?? '', destination ?? '');
  }

  void addCar(Car car) {
    _cars.insert(0, car);
    notifyListeners();
  }

  void removeCar(String carId) {
    _cars.removeWhere((c) => c.id == carId);
    notifyListeners();
  }

  void addBooking(Booking booking) {
    _bookings.insert(0, booking);
    notifyListeners();
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
