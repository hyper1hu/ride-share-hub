import 'package:uuid/uuid.dart';

class Booking {
  final String id;
  final String carId;
  final String customerName;
  final String customerPhone;
  final int seatsBooked;
  final String tripType;
  final double totalFare;
  final String status;
  final DateTime createdAt;

  Booking({
    String? id,
    required this.carId,
    required this.customerName,
    required this.customerPhone,
    required this.seatsBooked,
    required this.tripType,
    required this.totalFare,
    this.status = 'confirmed',
    DateTime? createdAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  Booking copyWith({
    String? customerName,
    String? customerPhone,
    int? seatsBooked,
    String? tripType,
    double? totalFare,
    String? status,
  }) {
    return Booking(
      id: id,
      carId: carId,
      customerName: customerName ?? this.customerName,
      customerPhone: customerPhone ?? this.customerPhone,
      seatsBooked: seatsBooked ?? this.seatsBooked,
      tripType: tripType ?? this.tripType,
      totalFare: totalFare ?? this.totalFare,
      status: status ?? this.status,
      createdAt: createdAt,
    );
  }
}
