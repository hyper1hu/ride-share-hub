import 'dart:math';
import '../../models/booking.dart';
import '../../models/car.dart';
import '../../models/customer.dart';
import '../../models/driver.dart';
import 'backend.dart';

class SimpleBackend implements RideShareBackend {
  final Random _random = Random();

  // In-memory storage
  final Map<String, Customer> _customers = {};
  final Map<String, Driver> _drivers = {};
  final Map<String, Car> _cars = {};
  final Map<String, Booking> _bookings = {};
  final Map<String, Map<String, dynamic>> _otps = {};

  SimpleBackend() {
    _initializeSampleData();
  }

  void _initializeSampleData() {
    // Add some sample drivers
    _drivers['9876543210'] = Driver(
      id: '9876543210',
      mobile: '9876543210',
      name: 'Rajesh Kumar',
      age: 35,
      aadhaarNumber: '1234-5678-9012',
      licenseNumber: 'WB01-20230001',
      verificationStatus: 'approved',
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
    );

    _drivers['9876543211'] = Driver(
      id: '9876543211',
      mobile: '9876543211',
      name: 'Amit Das',
      age: 40,
      aadhaarNumber: '2234-5678-9012',
      licenseNumber: 'WB01-20230002',
      verificationStatus: 'approved',
      createdAt: DateTime.now().subtract(const Duration(days: 25)),
    );

    // Add sample cars
    _cars['car1'] = Car(
      id: 'car1',
      driverId: '9876543210',
      driverName: 'Rajesh Kumar',
      carModel: 'Maruti Swift',
      carNumber: 'WB 01 AB 1234',
      vehicleType: 'car',
      origin: 'Howrah Station',
      destination: 'Siliguri',
      seatsAvailable: 4,
      fare: 450.0,
      returnFare: 400.0,
      departureTime: '06:00 AM',
      returnTime: '08:00 PM',
      status: 'available',
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
    );

    _cars['car2'] = Car(
      id: 'car2',
      driverId: '9876543211',
      driverName: 'Amit Das',
      carModel: 'Toyota Innova',
      carNumber: 'WB 02 CD 5678',
      vehicleType: 'suv',
      origin: 'Kolkata Airport',
      destination: 'Digha',
      seatsAvailable: 6,
      fare: 380.0,
      returnFare: 350.0,
      departureTime: '07:30 AM',
      returnTime: '06:00 PM',
      status: 'available',
      createdAt: DateTime.now().subtract(const Duration(days: 8)),
    );

    _cars['car3'] = Car(
      id: 'car3',
      driverId: '9876543210',
      driverName: 'Rajesh Kumar',
      carModel: 'Mahindra Bolero',
      carNumber: 'WB 03 EF 9012',
      vehicleType: 'suv',
      origin: 'Sealdah Station',
      destination: 'Darjeeling',
      seatsAvailable: 7,
      fare: 650.0,
      returnFare: 600.0,
      departureTime: '05:00 AM',
      returnTime: '10:00 PM',
      status: 'available',
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    );
  }

  @override
  Future<OtpResult> sendOtp(String mobile, String userType) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final otp = (_random.nextInt(900000) + 100000).toString();
    final expiresAt = DateTime.now().add(const Duration(minutes: 5));

    _otps['$userType-$mobile'] = {
      'mobile': mobile,
      'userType': userType,
      'otp': otp,
      'expiresAt': expiresAt,
    };

    return OtpResult(success: true, otp: otp, expiresAt: expiresAt);
  }

  @override
  Future<Map<String, dynamic>> verifyOtp(String mobile, String otp, String userType) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final key = '$userType-$mobile';
    final storedData = _otps[key];

    if (storedData == null) {
      return {'success': false, 'error': 'OTP not found'};
    }

    final expiresAt = storedData['expiresAt'] as DateTime;
    if (DateTime.now().isAfter(expiresAt)) {
      return {'success': false, 'error': 'OTP expired'};
    }

    if (storedData['otp'] != otp) {
      return {'success': false, 'error': 'Invalid OTP'};
    }

    return {'success': true};
  }

  @override
  Future<Customer?> loginCustomer(String mobile) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _customers[mobile];
  }

  @override
  Future<Customer?> registerCustomer(String mobile, String name, int age) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final customer = Customer(
      id: mobile,
      mobile: mobile,
      name: name,
      age: age,
      createdAt: DateTime.now(),
    );
    _customers[mobile] = customer;
    return customer;
  }

  @override
  Future<Driver?> loginDriver(String mobile) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _drivers[mobile];
  }

  @override
  Future<Driver?> registerDriver({
    required String mobile,
    required String name,
    required int age,
    required String aadhaarNumber,
    required String licenseNumber,
  }) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final driver = Driver(
      id: mobile,
      mobile: mobile,
      name: name,
      age: age,
      aadhaarNumber: aadhaarNumber,
      licenseNumber: licenseNumber,
      verificationStatus: 'pending',
      createdAt: DateTime.now(),
    );
    _drivers[mobile] = driver;
    return driver;
  }

  @override
  Future<List<Car>> getCars() async {
    await Future.delayed(const Duration(milliseconds: 200));
    final cars = _cars.values.toList();
    cars.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return cars;
  }

  @override
  Future<List<Car>> searchCars({required String origin, required String destination}) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final all = await getCars();
    final originQuery = origin.trim().toLowerCase();
    final destinationQuery = destination.trim().toLowerCase();

    return all.where((car) {
      final matchesOrigin = originQuery.isEmpty || car.origin.toLowerCase().contains(originQuery);
      final matchesDestination = destinationQuery.isEmpty || car.destination.toLowerCase().contains(destinationQuery);
      return matchesOrigin && matchesDestination && car.status == 'available';
    }).toList();
  }

  @override
  Future<Car?> createCar(Car car) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _cars[car.id] = car;
    return car;
  }

  @override
  Future<bool> deleteCar(String carId) async {
    await Future.delayed(const Duration(milliseconds: 200));
    _cars.remove(carId);
    return true;
  }

  @override
  Future<Booking?> createBooking(Booking booking) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _bookings[booking.id] = booking;
    return booking;
  }

  @override
  Future<List<Booking>> getBookings() async {
    await Future.delayed(const Duration(milliseconds: 200));
    final bookings = _bookings.values.toList();
    bookings.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return bookings;
  }
}
