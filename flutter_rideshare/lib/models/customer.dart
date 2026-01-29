import '../utils/date_time_parser.dart';

class Customer {
  final String id;
  final String mobile;
  final String name;
  final int age;
  final DateTime createdAt;

  Customer({
    required this.id,
    required this.mobile,
    required this.name,
    required this.age,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id'] ?? '',
      mobile: json['mobile'] ?? '',
      name: json['name'] ?? '',
      age: json['age'] ?? 0,
      createdAt: parseDateTime(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'mobile': mobile,
      'name': name,
      'age': age,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
