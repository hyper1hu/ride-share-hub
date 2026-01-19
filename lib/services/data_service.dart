import 'package:flutter/foundation.dart';
import '../models/car.dart';
import '../models/booking.dart';

class DataService extends ChangeNotifier {
  final List<Car> _cars = [];
  final List<Booking> _bookings = [];

  List<Car> get cars => List.unmodifiable(_cars);
  List<Car> get availableCars => _cars.where((c) => c.status == 'available').toList();
  List<Booking> get bookings => List.unmodifiable(_bookings);

  void addCar(Car car) {
    _cars.insert(0, car);
    notifyListeners();
  }

  void removeCar(String carId) {
    _cars.removeWhere((car) => car.id == carId);
    _bookings.removeWhere((booking) => booking.carId == carId);
    notifyListeners();
  }

  void updateCar(Car updatedCar) {
    final index = _cars.indexWhere((car) => car.id == updatedCar.id);
    if (index != -1) {
      _cars[index] = updatedCar;
      notifyListeners();
    }
  }

  Car? getCarById(String id) {
    try {
      return _cars.firstWhere((car) => car.id == id);
    } catch (e) {
      return null;
    }
  }

  List<Booking> getBookingsForCar(String carId) {
    return _bookings.where((b) => b.carId == carId && b.status != 'cancelled').toList();
  }

  int getBookedSeatsForCar(String carId) {
    return getBookingsForCar(carId).fold(0, (sum, b) => sum + b.seatsBooked);
  }

  int getAvailableSeatsForCar(String carId) {
    final car = getCarById(carId);
    if (car == null) return 0;
    return car.seatsAvailable - getBookedSeatsForCar(carId);
  }

  bool addBooking(Booking booking) {
    final availableSeats = getAvailableSeatsForCar(booking.carId);
    if (booking.seatsBooked > availableSeats) {
      return false;
    }
    _bookings.insert(0, booking);
    notifyListeners();
    return true;
  }

  void cancelBooking(String bookingId) {
    final index = _bookings.indexWhere((b) => b.id == bookingId);
    if (index != -1) {
      _bookings[index] = _bookings[index].copyWith(status: 'cancelled');
      notifyListeners();
    }
  }

  List<Car> searchCars({String? origin, String? destination}) {
    return availableCars.where((car) {
      final matchOrigin = origin == null || origin.isEmpty || 
          car.origin.toLowerCase().contains(origin.toLowerCase());
      final matchDest = destination == null || destination.isEmpty || 
          car.destination.toLowerCase().contains(destination.toLowerCase());
      return matchOrigin && matchDest;
    }).toList();
  }
}
