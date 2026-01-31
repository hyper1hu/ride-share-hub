import 'package:latlong2/latlong.dart';
import '../data/landmarks.dart';

class MapService {
  static final MapService _instance = MapService._internal();
  factory MapService() => _instance;
  MapService._internal();

  final Distance _distance = const Distance();

  // Calculate distance between two points in kilometers
  double calculateDistance(LatLng from, LatLng to) {
    return _distance.as(LengthUnit.Kilometer, from, to);
  }

  // Get nearby landmarks within radius (in kilometers)
  List<Landmark> getNearbyLandmarks(LatLng location, double radiusKm) {
    return LandmarksData.allLandmarks.where((landmark) {
      final distance = calculateDistance(location, landmark.location);
      return distance <= radiusKm;
    }).toList();
  }

  // Find nearest landmark
  Landmark? findNearestLandmark(LatLng location) {
    if (LandmarksData.allLandmarks.isEmpty) return null;

    Landmark? nearest;
    double minDistance = double.infinity;

    for (var landmark in LandmarksData.allLandmarks) {
      final distance = calculateDistance(location, landmark.location);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = landmark;
      }
    }

    return nearest;
  }

  // Calculate estimated fare based on distance and vehicle type
  double calculateFare(double distanceKm, String vehicleType) {
    // Base fare structure (in INR)
    const baseFares = {
      'car': 50.0,
      'bike': 30.0,
      'auto': 25.0,
      'sharing': 15.0,
      'tempo': 80.0,
      'mini-bus': 100.0,
      'bus': 120.0,
      'maxi-cab': 150.0,
    };

    // Per kilometer rates (in INR)
    const perKmRates = {
      'car': 12.0,
      'bike': 7.0,
      'auto': 10.0,
      'sharing': 5.0,
      'tempo': 15.0,
      'mini-bus': 18.0,
      'bus': 20.0,
      'maxi-cab': 22.0,
    };

    final baseFare = baseFares[vehicleType.toLowerCase()] ?? 50.0;
    final perKmRate = perKmRates[vehicleType.toLowerCase()] ?? 12.0;

    return baseFare + (distanceKm * perKmRate);
  }

  // Estimate trip duration in minutes (average speed: 30 km/h in city)
  int estimateDuration(double distanceKm) {
    const averageSpeedKmh = 30.0;
    final hours = distanceKm / averageSpeedKmh;
    return (hours * 60).round();
  }

  // Get bounding box for route
  List<LatLng> getBoundingBox(LatLng start, LatLng end) {
    final minLat = start.latitude < end.latitude ? start.latitude : end.latitude;
    final maxLat = start.latitude > end.latitude ? start.latitude : end.latitude;
    final minLng = start.longitude < end.longitude ? start.longitude : end.longitude;
    final maxLng = start.longitude > end.longitude ? start.longitude : end.longitude;

    return [
      LatLng(minLat, minLng),
      LatLng(maxLat, maxLng),
    ];
  }

  // Generate polyline points (simple straight line for now)
  List<LatLng> generateRoutePoints(LatLng start, LatLng end, {int points = 20}) {
    final routePoints = <LatLng>[];

    for (int i = 0; i <= points; i++) {
      final fraction = i / points;
      final lat = start.latitude + (end.latitude - start.latitude) * fraction;
      final lng = start.longitude + (end.longitude - start.longitude) * fraction;
      routePoints.add(LatLng(lat, lng));
    }

    return routePoints;
  }

  // Get landmarks along route
  List<Landmark> getLandmarksAlongRoute(LatLng start, LatLng end, {double thresholdKm = 2.0}) {
    final routePoints = generateRoutePoints(start, end, points: 50);
    final landmarksSet = <String, Landmark>{};

    for (var point in routePoints) {
      final nearby = getNearbyLandmarks(point, thresholdKm);
      for (var landmark in nearby) {
        landmarksSet[landmark.name] = landmark;
      }
    }

    return landmarksSet.values.toList();
  }

  // Format distance for display
  String formatDistance(double distanceKm) {
    if (distanceKm < 1) {
      return '${(distanceKm * 1000).round()} m';
    }
    return '${distanceKm.toStringAsFixed(1)} km';
  }

  // Format duration for display
  String formatDuration(int minutes) {
    if (minutes < 60) {
      return '$minutes min';
    }
    final hours = minutes ~/ 60;
    final mins = minutes % 60;
    return '${hours}h ${mins}min';
  }

  // Get map center based on two locations
  LatLng getMapCenter(LatLng start, LatLng end) {
    return LatLng(
      (start.latitude + end.latitude) / 2,
      (start.longitude + end.longitude) / 2,
    );
  }

  // Calculate zoom level based on distance
  double calculateZoomLevel(double distanceKm) {
    if (distanceKm < 1) return 15.0;
    if (distanceKm < 5) return 13.0;
    if (distanceKm < 10) return 12.0;
    if (distanceKm < 20) return 11.0;
    if (distanceKm < 50) return 10.0;
    if (distanceKm < 100) return 9.0;
    return 8.0;
  }

  // Validate coordinates are in West Bengal bounds
  bool isInWestBengal(LatLng location) {
    // West Bengal approximate bounds
    const minLat = 21.5;
    const maxLat = 27.5;
    const minLng = 85.8;
    const maxLng = 89.9;

    return location.latitude >= minLat &&
        location.latitude <= maxLat &&
        location.longitude >= minLng &&
        location.longitude <= maxLng;
  }

  // Get default center (Kolkata)
  LatLng getDefaultCenter() {
    return LandmarksData.kolkataCenter;
  }
}
