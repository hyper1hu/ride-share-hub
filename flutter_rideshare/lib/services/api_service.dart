import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/car.dart';
import '../models/booking.dart';
import '../models/customer.dart';
import '../models/driver.dart';
import '../config/api_config.dart';
import 'firebase_service.dart';

class OtpResult {
  final bool success;
  final String? otp;
  final String? error;
  final DateTime? expiresAt;

  OtpResult({required this.success, this.otp, this.error, this.expiresAt});
}

class ApiService {
  static String baseUrl = ApiConfig.baseUrl;
  static bool _useFirebase = false;

  static void setBaseUrl(String url) {
    baseUrl = url;
    print('API Base URL set to: $baseUrl');
  }

  static void setUseFirebase(bool useFirebase) {
    _useFirebase = useFirebase;
    print('Using Firebase: $_useFirebase');
  }

  // Initialize with default config
  static void initialize() {
    ApiConfig.printConfig();
    _useFirebase = FirebaseService.isInitialized;
  }

  static Future<OtpResult> sendOtp(String mobile, String userType) async {
    // Try Firebase first if available
    if (_useFirebase) {
      try {
        final otp = await FirebaseService.storeOtp(mobile, userType);
        if (otp.isNotEmpty) {
          return OtpResult(
            success: true,
            otp: otp,
            expiresAt: DateTime.now().add(const Duration(minutes: 5)),
          );
        }
      } catch (e) {
        print('Firebase OTP failed, trying REST API: $e');
      }
    }

    // Fallback to REST API
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/otp/send'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'mobile': mobile, 'userType': userType}),
      );
      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        return OtpResult(
          success: true,
          otp: data['otp'],
          expiresAt: data['expiresAt'] != null ? DateTime.parse(data['expiresAt']) : null,
        );
      }
      return OtpResult(success: false, error: data['error']?.toString() ?? 'Failed to send OTP');
    } catch (e) {
      print('Error sending OTP: $e');
      return OtpResult(success: false, error: 'Network error');
    }
  }

  static Future<Map<String, dynamic>> verifyOtp(String mobile, String otp, String userType) async {
    // Try Firebase first if available
    if (_useFirebase) {
      try {
        final isValid = await FirebaseService.verifyOtp(mobile, otp);
        if (isValid) {
          return {'success': true};
        }
      } catch (e) {
        print('Firebase OTP verification failed, trying REST API: $e');
      }
    }

    // Fallback to REST API
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/otp/verify'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'mobile': mobile, 'otp': otp, 'userType': userType}),
      );
      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        return {'success': true};
      }
      return {'success': false, 'error': data['error']?.toString() ?? 'Invalid OTP'};
    } catch (e) {
      print('Error verifying OTP: $e');
      return {'success': false, 'error': 'Network error'};
    }
  }

  static Future<List<Car>> getCars() async {
    // Try Firebase first if available
    if (_useFirebase) {
      try {
        return await FirebaseService.getCars();
      } catch (e) {
        print('Firebase getCars failed, trying REST API: $e');
      }
    }

    // Fallback to REST API
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/cars'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Car.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Error fetching cars: $e');
      return [];
    }
  }

  static Future<List<Car>> searchCars(String origin, String destination) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/cars/search?origin=$origin&destination=$destination'),
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Car.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Error searching cars: $e');
      return [];
    }
  }

  static Future<Car?> createCar(Map<String, dynamic> carData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/cars'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(carData),
      );
      if (response.statusCode == 201) {
        return Car.fromJson(json.decode(response.body));
      }
      return null;
    } catch (e) {
      print('Error creating car: $e');
      return null;
    }
  }

  static Future<bool> deleteCar(String carId) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/api/cars/$carId'));
      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting car: $e');
      return false;
    }
  }

  static Future<Customer?> registerCustomer(String mobile, String name, int age) async {
    // Try Firebase first if available
    if (_useFirebase) {
      try {
        return await FirebaseService.registerCustomer(mobile, name, age);
      } catch (e) {
        print('Firebase registerCustomer failed, trying REST API: $e');
      }
    }

    // Fallback to REST API
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/customer/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'mobile': mobile, 'name': name, 'age': age}),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return Customer.fromJson(data['customer']);
      }
      return null;
    } catch (e) {
      print('Error registering customer: $e');
      return null;
    }
  }

  static Future<Customer?> loginCustomer(String mobile) async {
    // Try Firebase first if available
    if (_useFirebase) {
      try {
        return await FirebaseService.getCustomerByMobile(mobile);
      } catch (e) {
        print('Firebase loginCustomer failed, trying REST API: $e');
      }
    }

    // Fallback to REST API
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/customer/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'mobile': mobile}),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Customer.fromJson(data['customer']);
      }
      return null;
    } catch (e) {
      print('Error logging in customer: $e');
      return null;
    }
  }

  static Future<Driver?> registerDriver({
    required String mobile,
    required String name,
    required int age,
    required String aadhaarNumber,
    required String licenseNumber,
  }) async {
    // Try Firebase first if available
    if (_useFirebase) {
      try {
        return await FirebaseService.registerDriver(
          mobile: mobile,
          name: name,
          age: age,
          aadhaarNumber: aadhaarNumber,
          licenseNumber: licenseNumber,
        );
      } catch (e) {
        print('Firebase registerDriver failed, trying REST API: $e');
      }
    }

    // Fallback to REST API
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/driver/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'mobile': mobile,
          'name': name,
          'age': age,
          'aadhaarNumber': aadhaarNumber,
          'licenseNumber': licenseNumber,
        }),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return Driver.fromJson(data['driver']);
      }
      return null;
    } catch (e) {
      print('Error registering driver: $e');
      return null;
    }
  }

  static Future<Driver?> loginDriver(String mobile) async {
    // Try Firebase first if available
    if (_useFirebase) {
      try {
        return await FirebaseService.getDriverByMobile(mobile);
      } catch (e) {
        print('Firebase loginDriver failed, trying REST API: $e');
      }
    }

    // Fallback to REST API
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/driver/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'mobile': mobile}),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Driver.fromJson(data['driver']);
      }
      return null;
    } catch (e) {
      print('Error logging in driver: $e');
      return null;
    }
  }

  static Future<Booking?> createBooking(Map<String, dynamic> bookingData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/bookings'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(bookingData),
      );
      if (response.statusCode == 201) {
        return Booking.fromJson(json.decode(response.body));
      }
      return null;
    } catch (e) {
      print('Error creating booking: $e');
      return null;
    }
  }

  static Future<List<Booking>> getBookings() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/bookings'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Booking.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print('Error fetching bookings: $e');
      return [];
    }
  }
}
