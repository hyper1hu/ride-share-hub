import 'package:uuid/uuid.dart';

class Car {
  final String id;
  final String driverName;
  final String driverPhone;
  final String carModel;
  final String carNumber;
  final String origin;
  final String destination;
  final double fare;
  final double returnFare;
  final String departureTime;
  final String returnTime;
  final int seatsAvailable;
  final String status;
  final DateTime createdAt;

  Car({
    String? id,
    required this.driverName,
    required this.driverPhone,
    required this.carModel,
    required this.carNumber,
    required this.origin,
    required this.destination,
    required this.fare,
    required this.returnFare,
    required this.departureTime,
    required this.returnTime,
    required this.seatsAvailable,
    this.status = 'available',
    DateTime? createdAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  Car copyWith({
    String? driverName,
    String? driverPhone,
    String? carModel,
    String? carNumber,
    String? origin,
    String? destination,
    double? fare,
    double? returnFare,
    String? departureTime,
    String? returnTime,
    int? seatsAvailable,
    String? status,
  }) {
    return Car(
      id: id,
      driverName: driverName ?? this.driverName,
      driverPhone: driverPhone ?? this.driverPhone,
      carModel: carModel ?? this.carModel,
      carNumber: carNumber ?? this.carNumber,
      origin: origin ?? this.origin,
      destination: destination ?? this.destination,
      fare: fare ?? this.fare,
      returnFare: returnFare ?? this.returnFare,
      departureTime: departureTime ?? this.departureTime,
      returnTime: returnTime ?? this.returnTime,
      seatsAvailable: seatsAvailable ?? this.seatsAvailable,
      status: status ?? this.status,
      createdAt: createdAt,
    );
  }
}
