class LocationData {
  static const List<Map<String, dynamic>> locations = [
    {"name": "Howrah Station", "region": "Kolkata", "aliases": ["howrah", "station"]},
    {"name": "Sealdah Station", "region": "Kolkata", "aliases": ["sealdah"]},
    {"name": "Kolkata Airport", "region": "Kolkata", "aliases": ["airport", "ccu", "dum dum airport"]},
    {"name": "Victoria Memorial", "region": "Kolkata", "aliases": ["victoria"]},
    {"name": "Dakshineswar", "region": "Kolkata", "aliases": ["dakshineswar kali"]},
    {"name": "Kalighat", "region": "Kolkata", "aliases": ["kali temple"]},
    {"name": "Science City", "region": "Kolkata", "aliases": []},
    {"name": "Park Street", "region": "Kolkata", "aliases": ["park st"]},
    {"name": "Salt Lake", "region": "Kolkata", "aliases": ["sector v", "bidhannagar"]},
    {"name": "New Town", "region": "Kolkata", "aliases": ["rajarhat"]},
    {"name": "Gariahat", "region": "Kolkata", "aliases": []},
    {"name": "Behala", "region": "Kolkata", "aliases": []},
    {"name": "Jadavpur", "region": "Kolkata", "aliases": ["jadavpur university"]},
    {"name": "Dum Dum", "region": "Kolkata", "aliases": ["dumdum"]},
    {"name": "Barasat", "region": "Kolkata", "aliases": []},
    {"name": "Barrackpore", "region": "Kolkata", "aliases": []},
    {"name": "Esplanade", "region": "Kolkata", "aliases": []},
    {"name": "BBD Bagh", "region": "Kolkata", "aliases": ["dalhousie"]},
    {"name": "Ultadanga", "region": "Kolkata", "aliases": []},
    {"name": "Garia", "region": "Kolkata", "aliases": []},
    {"name": "Tollygunge", "region": "Kolkata", "aliases": ["tolly"]},
    {"name": "Ballygunge", "region": "Kolkata", "aliases": []},
    {"name": "Shyambazar", "region": "Kolkata", "aliases": []},
    {"name": "College Street", "region": "Kolkata", "aliases": ["boi para"]},
    {"name": "Darjeeling", "region": "North Bengal", "aliases": ["queen of hills"]},
    {"name": "Siliguri", "region": "North Bengal", "aliases": []},
    {"name": "NJP Station", "region": "North Bengal", "aliases": ["new jalpaiguri"]},
    {"name": "Bagdogra Airport", "region": "North Bengal", "aliases": ["bagdogra", "ixb"]},
    {"name": "Kalimpong", "region": "North Bengal", "aliases": []},
    {"name": "Kurseong", "region": "North Bengal", "aliases": []},
    {"name": "Mirik", "region": "North Bengal", "aliases": ["mirik lake"]},
    {"name": "Jalpaiguri", "region": "North Bengal", "aliases": []},
    {"name": "Cooch Behar", "region": "North Bengal", "aliases": ["koch bihar"]},
    {"name": "Alipurduar", "region": "North Bengal", "aliases": []},
    {"name": "Dooars", "region": "North Bengal", "aliases": ["doors"]},
    {"name": "Jaldapara", "region": "North Bengal", "aliases": ["jaldapara national park"]},
    {"name": "Gangtok", "region": "North Bengal", "aliases": ["sikkim"]},
    {"name": "Lachung", "region": "North Bengal", "aliases": []},
    {"name": "Digha", "region": "Beaches", "aliases": ["beach", "sea beach"]},
    {"name": "Mandarmani", "region": "Beaches", "aliases": ["beach"]},
    {"name": "Tajpur", "region": "Beaches", "aliases": ["beach"]},
    {"name": "Bakkhali", "region": "Beaches", "aliases": ["beach"]},
    {"name": "Diamond Harbour", "region": "Beaches", "aliases": []},
    {"name": "Shankarpur", "region": "Beaches", "aliases": ["beach"]},
    {"name": "Frazerganj", "region": "Beaches", "aliases": ["beach"]},
    {"name": "Durgapur", "region": "Central Bengal", "aliases": []},
    {"name": "Asansol", "region": "Central Bengal", "aliases": []},
    {"name": "Bardhaman", "region": "Central Bengal", "aliases": ["burdwan"]},
    {"name": "Bankura", "region": "Central Bengal", "aliases": []},
    {"name": "Bishnupur", "region": "Central Bengal", "aliases": ["terracotta temples"]},
    {"name": "Purulia", "region": "Central Bengal", "aliases": []},
    {"name": "Hooghly", "region": "Central Bengal", "aliases": []},
    {"name": "Chandannagar", "region": "Central Bengal", "aliases": []},
    {"name": "Shantiniketan", "region": "Religious/Cultural", "aliases": ["visva bharati", "tagore"]},
    {"name": "Nabadwip", "region": "Religious/Cultural", "aliases": ["nabadwip dham"]},
    {"name": "Mayapur", "region": "Religious/Cultural", "aliases": ["iskcon"]},
    {"name": "Murshidabad", "region": "Religious/Cultural", "aliases": ["hazarduari"]},
    {"name": "Belur Math", "region": "Religious/Cultural", "aliases": ["ramakrishna"]},
    {"name": "Tarakeshwar", "region": "Religious/Cultural", "aliases": ["tarakeswar temple"]},
    {"name": "Malda", "region": "Other Districts", "aliases": ["english bazar"]},
    {"name": "Kharagpur", "region": "Other Districts", "aliases": ["iit"]},
    {"name": "Haldia", "region": "Other Districts", "aliases": ["port"]},
    {"name": "Krishnanagar", "region": "Other Districts", "aliases": ["nadia"]},
    {"name": "Berhampore", "region": "Other Districts", "aliases": []},
    {"name": "Bolpur", "region": "Other Districts", "aliases": []},
    {"name": "Suri", "region": "Other Districts", "aliases": ["birbhum"]},
    {"name": "Raiganj", "region": "Other Districts", "aliases": []},
    {"name": "Balurghat", "region": "Other Districts", "aliases": []},
    {"name": "Patna", "region": "Nearby States", "aliases": ["bihar"]},
    {"name": "Ranchi", "region": "Nearby States", "aliases": ["jharkhand"]},
    {"name": "Jamshedpur", "region": "Nearby States", "aliases": ["tata nagar"]},
    {"name": "Bhubaneswar", "region": "Nearby States", "aliases": ["odisha"]},
    {"name": "Puri", "region": "Nearby States", "aliases": ["jagannath"]},
    {"name": "Guwahati", "region": "Nearby States", "aliases": ["assam"]},
    {"name": "Dhaka", "region": "Nearby States", "aliases": ["bangladesh"]},
  ];

  static List<String> get allLocationNames {
    return locations.map((l) => l['name'] as String).toList();
  }

  static List<String> searchLocations(String query) {
    if (query.isEmpty) return allLocationNames;
    
    final lowerQuery = query.toLowerCase();
    return locations.where((loc) {
      final name = (loc['name'] as String).toLowerCase();
      final aliases = (loc['aliases'] as List).cast<String>();
      return name.contains(lowerQuery) ||
          aliases.any((alias) => alias.toLowerCase().contains(lowerQuery));
    }).map((l) => l['name'] as String).toList();
  }

  static List<String> getLocationsByRegion(String region) {
    return locations
        .where((l) => l['region'] == region)
        .map((l) => l['name'] as String)
        .toList();
  }

  static List<String> get regions {
    return locations.map((l) => l['region'] as String).toSet().toList();
  }
}
