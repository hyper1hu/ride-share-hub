import '../utils/date_time_parser.dart';

class Driver {
  final String id;
  final String mobile;
  final String name;
  final int age;
  final String aadhaarNumber;
  final String licenseNumber;
  final String verificationStatus;
  final DateTime createdAt;

  Driver({
    required this.id,
    required this.mobile,
    required this.name,
    required this.age,
    required this.aadhaarNumber,
    required this.licenseNumber,
    this.verificationStatus = 'pending',
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  bool get isApproved => verificationStatus == 'approved';
  bool get isPending => verificationStatus == 'pending';
  bool get isRejected => verificationStatus == 'rejected';

  String get maskedAadhaar {
    if (aadhaarNumber.length >= 4) {
      return '${aadhaarNumber.substring(0, 4)}********';
    }
    return aadhaarNumber;
  }

  factory Driver.fromJson(Map<String, dynamic> json) {
    return Driver(
      id: json['id'] ?? '',
      mobile: json['mobile'] ?? '',
      name: json['name'] ?? '',
      age: json['age'] ?? 0,
      aadhaarNumber: json['aadhaarNumber'] ?? '',
      licenseNumber: json['licenseNumber'] ?? '',
      verificationStatus: json['verificationStatus'] ?? 'pending',
      createdAt: parseDateTime(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'mobile': mobile,
      'name': name,
      'age': age,
      'aadhaarNumber': aadhaarNumber,
      'licenseNumber': licenseNumber,
      'verificationStatus': verificationStatus,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
