import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/car.dart';
import '../models/booking.dart';

class AppProvider with ChangeNotifier {
  bool _isDarkMode = false;
  List<Car> _cars = [];
  List<Booking> _bookings = [];
  bool _isLoading = false;

  bool get isDarkMode => _isDarkMode;
  List<Car> get cars => _cars;
  List<Booking> get bookings => _bookings;
  bool get isLoading => _isLoading;

  List<Car> get availableCars => _cars.where((c) => c.status == 'available').toList();

  AppProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool('isDarkMode') ?? false;
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    notifyListeners();
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

  List<Car> searchCars({String? origin, String? destination}) {
    return availableCars.where((car) {
      final matchOrigin = origin == null || origin.isEmpty || 
          car.origin.toLowerCase().contains(origin.toLowerCase());
      final matchDestination = destination == null || destination.isEmpty || 
          car.destination.toLowerCase().contains(destination.toLowerCase());
      return matchOrigin && matchDestination;
    }).toList();
  }
}
