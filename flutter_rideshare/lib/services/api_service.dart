import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/car.dart';
import '../models/booking.dart';
import '../models/customer.dart';
import '../models/driver.dart';

class ApiService {
  static String baseUrl = 'http://localhost:5000';
  
  static void setBaseUrl(String url) {
    baseUrl = url;
  }

  static Future<List<Car>> getCars() async {
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
