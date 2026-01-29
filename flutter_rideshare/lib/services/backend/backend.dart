import '../../models/booking.dart';
import '../../models/car.dart';
import '../../models/customer.dart';
import '../../models/driver.dart';
import '../api_service.dart';

abstract class RideShareBackend {
  bool get supportsFirebase;

  Future<OtpResult> sendOtp(String mobile, String userType);
  Future<Map<String, dynamic>> verifyOtp(String mobile, String otp, String userType);

  Future<Customer?> loginCustomer(String mobile);
  Future<Customer?> registerCustomer(String mobile, String name, int age);

  Future<Driver?> loginDriver(String mobile);
  Future<Driver?> registerDriver({
    required String mobile,
    required String name,
    required int age,
    required String aadhaarNumber,
    required String licenseNumber,
  });

  Future<List<Car>> getCars();
  Future<List<Car>> searchCars({required String origin, required String destination});
  Future<Car?> createCar(Car car);
  Future<bool> deleteCar(String carId);

  Future<Booking?> createBooking(Booking booking);
  Future<List<Booking>> getBookings();
}
