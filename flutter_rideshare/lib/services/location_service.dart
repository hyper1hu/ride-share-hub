import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class LocationService {
  static Future<bool> checkPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return false;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return false;
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      return false;
    }

    return true;
  }

  static Future<Position?> getCurrentPosition() async {
    try {
      final hasPermission = await checkPermission();
      if (!hasPermission) return null;

      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
    } catch (e) {
      print('Error getting location: $e');
      return null;
    }
  }

  static Future<String?> getAddressFromPosition(Position position) async {
    try {
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        String address = '';
        
        if (place.subLocality?.isNotEmpty ?? false) {
          address += '${place.subLocality}, ';
        }
        if (place.locality?.isNotEmpty ?? false) {
          address += '${place.locality}';
        }
        
        return address.isNotEmpty ? address : place.name;
      }
      return null;
    } catch (e) {
      print('Error getting address: $e');
      return null;
    }
  }

  static Future<String?> getNearestLandmark(Position position) async {
    final landmarks = {
      'Howrah Station': [22.5839, 88.3427],
      'Sealdah Station': [22.5656, 88.3700],
      'Kolkata Airport': [22.6547, 88.4467],
      'Victoria Memorial': [22.5448, 88.3426],
      'Park Street': [22.5513, 88.3527],
      'Salt Lake': [22.5800, 88.4180],
      'New Town': [22.5922, 88.4847],
      'Esplanade': [22.5623, 88.3516],
      'Howrah Bridge': [22.5851, 88.3468],
      'Dakshineswar': [22.6550, 88.3575],
      'Belur Math': [22.6320, 88.3550],
      'Science City': [22.5400, 88.3962],
      'Ruby': [22.5177, 88.3960],
      'Gariahat': [22.5195, 88.3690],
      'Tollygunge': [22.4983, 88.3476],
      'Jadavpur': [22.4992, 88.3716],
      'Dum Dum': [22.6199, 88.4262],
      'Barasat': [22.7235, 88.4805],
      'Siliguri': [26.7271, 88.3953],
      'Darjeeling': [27.0360, 88.2627],
      'Digha': [21.6281, 87.5145],
    };

    String? nearest;
    double minDistance = double.infinity;

    landmarks.forEach((name, coords) {
      double distance = Geolocator.distanceBetween(
        position.latitude,
        position.longitude,
        coords[0],
        coords[1],
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = name;
      }
    });

    if (minDistance < 50000) {
      return nearest;
    }
    return null;
  }
}
