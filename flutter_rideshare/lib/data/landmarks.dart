import 'package:latlong2/latlong.dart';

class Landmark {
  final String name;
  final LatLng location;
  final String type; // 'city', 'station', 'airport', 'tourist', 'monument'
  final String? description;

  Landmark({
    required this.name,
    required this.location,
    required this.type,
    this.description,
  });
}

class LandmarksData {
  static final List<Landmark> allLandmarks = [
    // Kolkata - Major Locations
    Landmark(
      name: 'Victoria Memorial',
      location: LatLng(22.5448, 88.3426),
      type: 'monument',
      description: 'Iconic white marble building',
    ),
    Landmark(
      name: 'Howrah Bridge',
      location: LatLng(22.5851, 88.3469),
      type: 'monument',
      description: 'Famous cantilever bridge',
    ),
    Landmark(
      name: 'Eden Gardens',
      location: LatLng(22.5648, 88.3433),
      type: 'monument',
      description: 'Historic cricket stadium',
    ),
    Landmark(
      name: 'Howrah Station',
      location: LatLng(22.5833, 88.3417),
      type: 'station',
      description: 'Major railway station',
    ),
    Landmark(
      name: 'Sealdah Station',
      location: LatLng(22.5694, 88.3704),
      type: 'station',
    ),
    Landmark(
      name: 'Netaji Subhas Chandra Bose International Airport',
      location: LatLng(22.6547, 88.4467),
      type: 'airport',
    ),
    Landmark(
      name: 'Park Street',
      location: LatLng(22.5536, 88.3515),
      type: 'city',
      description: 'Famous shopping and food street',
    ),
    Landmark(
      name: 'New Town',
      location: LatLng(22.5844, 88.4795),
      type: 'city',
    ),
    Landmark(
      name: 'Salt Lake',
      location: LatLng(22.5760, 88.4233),
      type: 'city',
    ),
    Landmark(
      name: 'Jadavpur',
      location: LatLng(22.4982, 88.3678),
      type: 'city',
    ),
    
    // District Headquarters
    Landmark(
      name: 'Siliguri',
      location: LatLng(26.7271, 88.3953),
      type: 'city',
      description: 'Gateway to North Bengal',
    ),
    Landmark(
      name: 'Darjeeling',
      location: LatLng(27.0360, 88.2627),
      type: 'tourist',
      description: 'Famous hill station',
    ),
    Landmark(
      name: 'Durgapur',
      location: LatLng(23.5204, 87.3119),
      type: 'city',
      description: 'Steel city',
    ),
    Landmark(
      name: 'Asansol',
      location: LatLng(23.6839, 86.9525),
      type: 'city',
    ),
    Landmark(
      name: 'Malda',
      location: LatLng(25.0000, 88.1333),
      type: 'city',
    ),
    Landmark(
      name: 'Kharagpur',
      location: LatLng(22.3460, 87.2320),
      type: 'city',
    ),
    Landmark(
      name: 'Haldia',
      location: LatLng(22.0255, 88.0584),
      type: 'city',
      description: 'Port city',
    ),
    Landmark(
      name: 'Krishnanagar',
      location: LatLng(23.4000, 88.5000),
      type: 'city',
    ),
    Landmark(
      name: 'Bankura',
      location: LatLng(23.2324, 87.0715),
      type: 'city',
    ),
    Landmark(
      name: 'Purulia',
      location: LatLng(23.3318, 86.3640),
      type: 'city',
    ),
    Landmark(
      name: 'Midnapore',
      location: LatLng(22.4224, 87.3198),
      type: 'city',
    ),
    Landmark(
      name: 'Murshidabad',
      location: LatLng(24.1833, 88.2833),
      type: 'city',
      description: 'Historic capital',
    ),
    Landmark(
      name: 'Cooch Behar',
      location: LatLng(26.3240, 89.4380),
      type: 'city',
    ),
    Landmark(
      name: 'Jalpaiguri',
      location: LatLng(26.5167, 88.7167),
      type: 'city',
    ),
    Landmark(
      name: 'Alipurduar',
      location: LatLng(26.4876, 89.5285),
      type: 'city',
    ),
    
    // Tourist Destinations
    Landmark(
      name: 'Digha',
      location: LatLng(21.6286, 87.5068),
      type: 'tourist',
      description: 'Popular beach destination',
    ),
    Landmark(
      name: 'Mandarmani',
      location: LatLng(21.6554, 87.7768),
      type: 'tourist',
      description: 'Beach resort',
    ),
    Landmark(
      name: 'Shantiniketan',
      location: LatLng(23.6820, 87.6810),
      type: 'tourist',
      description: 'Tagore\'s university town',
    ),
    Landmark(
      name: 'Sundarbans',
      location: LatLng(21.9497, 88.8868),
      type: 'tourist',
      description: 'Mangrove forest & tiger reserve',
    ),
    Landmark(
      name: 'Kalimpong',
      location: LatLng(27.0594, 88.4708),
      type: 'tourist',
      description: 'Hill station',
    ),
    Landmark(
      name: 'Dooars',
      location: LatLng(26.5450, 89.4700),
      type: 'tourist',
      description: 'Tea gardens region',
    ),
    Landmark(
      name: 'Bishnupur',
      location: LatLng(23.0796, 87.3185),
      type: 'tourist',
      description: 'Terracotta temples',
    ),
    Landmark(
      name: 'Bakkhali',
      location: LatLng(21.5622, 88.2433),
      type: 'tourist',
      description: 'Beach destination',
    ),
    Landmark(
      name: 'Diamond Harbour',
      location: LatLng(22.1886, 88.1887),
      type: 'tourist',
    ),
    Landmark(
      name: 'Kalighat',
      location: LatLng(22.5186, 88.3474),
      type: 'monument',
      description: 'Famous temple',
    ),
    
    // Transport Hubs
    Landmark(
      name: 'Kolkata Port',
      location: LatLng(22.5568, 88.3089),
      type: 'city',
    ),
    Landmark(
      name: 'Esplanade',
      location: LatLng(22.5645, 88.3495),
      type: 'city',
      description: 'Central bus terminus',
    ),
  ];

  // Get landmarks by type
  static List<Landmark> getByType(String type) {
    return allLandmarks.where((l) => l.type == type).toList();
  }

  // Get city center (Kolkata)
  static LatLng get kolkataCenter => LatLng(22.5726, 88.3639);
  
  // Get West Bengal center
  static LatLng get westBengalCenter => LatLng(23.8103, 87.7615);
  
  // Search landmarks by name
  static List<Landmark> search(String query) {
    if (query.isEmpty) return [];
    final lowerQuery = query.toLowerCase();
    return allLandmarks
        .where((l) => l.name.toLowerCase().contains(lowerQuery))
        .toList();
  }
}
