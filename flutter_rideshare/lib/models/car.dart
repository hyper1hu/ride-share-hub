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
    required this.id,
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
  }) : createdAt = createdAt ?? DateTime.now();

  factory Car.fromJson(Map<String, dynamic> json) {
    return Car(
      id: json['id'] ?? '',
      driverName: json['driverName'] ?? '',
      driverPhone: json['driverPhone'] ?? '',
      carModel: json['carModel'] ?? '',
      carNumber: json['carNumber'] ?? '',
      origin: json['origin'] ?? '',
      destination: json['destination'] ?? '',
      fare: (json['fare'] ?? 0).toDouble(),
      returnFare: (json['returnFare'] ?? 0).toDouble(),
      departureTime: json['departureTime'] ?? '',
      returnTime: json['returnTime'] ?? '',
      seatsAvailable: json['seatsAvailable'] ?? 0,
      status: json['status'] ?? 'available',
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'driverName': driverName,
      'driverPhone': driverPhone,
      'carModel': carModel,
      'carNumber': carNumber,
      'origin': origin,
      'destination': destination,
      'fare': fare,
      'returnFare': returnFare,
      'departureTime': departureTime,
      'returnTime': returnTime,
      'seatsAvailable': seatsAvailable,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
