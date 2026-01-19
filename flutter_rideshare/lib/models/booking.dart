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
    required this.id,
    required this.carId,
    required this.customerName,
    required this.customerPhone,
    required this.seatsBooked,
    required this.tripType,
    required this.totalFare,
    this.status = 'confirmed',
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] ?? '',
      carId: json['carId'] ?? '',
      customerName: json['customerName'] ?? '',
      customerPhone: json['customerPhone'] ?? '',
      seatsBooked: json['seatsBooked'] ?? 0,
      tripType: json['tripType'] ?? 'one_way',
      totalFare: (json['totalFare'] ?? 0).toDouble(),
      status: json['status'] ?? 'confirmed',
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'carId': carId,
      'customerName': customerName,
      'customerPhone': customerPhone,
      'seatsBooked': seatsBooked,
      'tripType': tripType,
      'totalFare': totalFare,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
