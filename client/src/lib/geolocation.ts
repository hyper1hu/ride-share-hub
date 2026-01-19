export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NearbyLocation {
  name: string;
  distance: number;
  category: string;
  district: string;
}

const locationCoordinates: Record<string, Coordinates> = {
  "Howrah Station, Kolkata": { lat: 22.5839, lng: 88.3428 },
  "Sealdah Station, Kolkata": { lat: 22.5654, lng: 88.3697 },
  "Kolkata Station (Chitpur)": { lat: 22.5959, lng: 88.3744 },
  "Netaji Subhas Chandra Bose Airport, Kolkata": { lat: 22.6547, lng: 88.4467 },
  "Victoria Memorial, Kolkata": { lat: 22.5448, lng: 88.3426 },
  "Dakshineswar Kali Temple, Kolkata": { lat: 22.6547, lng: 88.3574 },
  "Kalighat Temple, Kolkata": { lat: 22.5196, lng: 88.3436 },
  "Belur Math, Howrah": { lat: 22.6319, lng: 88.3557 },
  "Science City, Kolkata": { lat: 22.5402, lng: 88.3969 },
  "Eco Park, New Town": { lat: 22.6023, lng: 88.4672 },
  "Park Street, Kolkata": { lat: 22.5516, lng: 88.3593 },
  "Esplanade, Kolkata": { lat: 22.5636, lng: 88.3512 },
  "Salt Lake City (Sector V), Kolkata": { lat: 22.5741, lng: 88.4336 },
  "New Town (Action Area I), Kolkata": { lat: 22.5929, lng: 88.4681 },
  "Gariahat, Kolkata": { lat: 22.5186, lng: 88.3686 },
  "Behala, Kolkata": { lat: 22.4977, lng: 88.3100 },
  "Jadavpur, Kolkata": { lat: 22.4989, lng: 88.3698 },
  "Garia, Kolkata": { lat: 22.4627, lng: 88.3841 },
  "Tollygunge, Kolkata": { lat: 22.4980, lng: 88.3477 },
  "Dum Dum, Kolkata": { lat: 22.6227, lng: 88.4205 },
  "Ruby, Kolkata": { lat: 22.5167, lng: 88.3982 },
  "Esplanade Bus Stand, Kolkata": { lat: 22.5636, lng: 88.3512 },
  "Karunamoyee Bus Stand, Salt Lake": { lat: 22.5723, lng: 88.4058 },
  "SSKM Hospital, Kolkata": { lat: 22.5355, lng: 88.3436 },
  "South City Mall, Kolkata": { lat: 22.5013, lng: 88.3631 },
  "Quest Mall, Kolkata": { lat: 22.5371, lng: 88.3632 },
  "Jadavpur University, Kolkata": { lat: 22.4966, lng: 88.3716 },
  "IIM Calcutta, Joka": { lat: 22.4297, lng: 88.3252 },
  "Barasat, North 24 Parganas": { lat: 22.7228, lng: 88.4807 },
  "Barrackpore, North 24 Parganas": { lat: 22.7648, lng: 88.3779 },
  "Diamond Harbour, South 24 Parganas": { lat: 22.1914, lng: 88.1868 },
  "Sundarbans, South 24 Parganas": { lat: 21.9497, lng: 88.8976 },
  "Gangasagar, South 24 Parganas": { lat: 21.6510, lng: 88.0638 },
  "Bakkhali Beach, South 24 Parganas": { lat: 21.5650, lng: 88.2502 },
  "Chinsurah, Hooghly": { lat: 22.9007, lng: 88.3870 },
  "Chandannagar, Hooghly": { lat: 22.8671, lng: 88.3653 },
  "Bandel, Hooghly": { lat: 22.9316, lng: 88.3785 },
  "Tarakeswar, Hooghly": { lat: 22.8855, lng: 88.0243 },
  "Krishnanagar, Nadia": { lat: 23.4013, lng: 88.4884 },
  "Nabadwip, Nadia": { lat: 23.4069, lng: 88.3677 },
  "Mayapur (ISKCON), Nadia": { lat: 23.4231, lng: 88.3888 },
  "Berhampore, Murshidabad": { lat: 24.1008, lng: 88.2519 },
  "Murshidabad (Hazarduari), Murshidabad": { lat: 24.1861, lng: 88.2740 },
  "Suri, Birbhum": { lat: 23.9133, lng: 87.5285 },
  "Shantiniketan, Birbhum": { lat: 23.6783, lng: 87.6856 },
  "Bolpur, Birbhum": { lat: 23.6677, lng: 87.7220 },
  "Tarapith, Birbhum": { lat: 24.0024, lng: 87.4803 },
  "Bardhaman City (Burdwan)": { lat: 23.2324, lng: 87.8615 },
  "Durgapur, Paschim Bardhaman": { lat: 23.5204, lng: 87.3119 },
  "Asansol, Paschim Bardhaman": { lat: 23.6889, lng: 86.9661 },
  "Bankura City, Bankura": { lat: 23.2324, lng: 87.0666 },
  "Bishnupur, Bankura": { lat: 23.0726, lng: 87.3137 },
  "Mukutmanipur, Bankura": { lat: 23.0502, lng: 86.7648 },
  "Purulia City, Purulia": { lat: 23.3320, lng: 86.3650 },
  "Ayodhya Hills, Purulia": { lat: 23.2019, lng: 86.1183 },
  "Tamluk, East Midnapore": { lat: 22.2992, lng: 87.9199 },
  "Haldia, East Midnapore": { lat: 22.0257, lng: 88.0583 },
  "Digha Beach, East Midnapore": { lat: 21.6277, lng: 87.5095 },
  "Mandarmani Beach, East Midnapore": { lat: 21.6692, lng: 87.7041 },
  "Tajpur Beach, East Midnapore": { lat: 21.6518, lng: 87.6276 },
  "Midnapore City, West Midnapore": { lat: 22.4260, lng: 87.3199 },
  "Kharagpur, West Midnapore": { lat: 22.3460, lng: 87.2320 },
  "IIT Kharagpur": { lat: 22.3149, lng: 87.3105 },
  "Jhargram, Jhargram": { lat: 22.4536, lng: 86.9932 },
  "Malda City (English Bazar)": { lat: 25.0108, lng: 88.1411 },
  "Gaur, Malda": { lat: 24.8584, lng: 88.1389 },
  "Raiganj, Uttar Dinajpur": { lat: 25.6152, lng: 88.1267 },
  "Balurghat, Dakshin Dinajpur": { lat: 25.2267, lng: 88.7757 },
  "Darjeeling Town, Darjeeling": { lat: 27.0410, lng: 88.2663 },
  "Tiger Hill, Darjeeling": { lat: 26.9927, lng: 88.2651 },
  "Ghum, Darjeeling": { lat: 26.9961, lng: 88.2553 },
  "Mirik, Darjeeling": { lat: 26.8880, lng: 88.1847 },
  "Kurseong, Darjeeling": { lat: 26.8817, lng: 88.2783 },
  "Kalimpong Town, Kalimpong": { lat: 27.0660, lng: 88.4698 },
  "Lava, Kalimpong": { lat: 27.0853, lng: 88.6641 },
  "Lolegaon, Kalimpong": { lat: 27.0175, lng: 88.6725 },
  "Jalpaiguri City, Jalpaiguri": { lat: 26.5161, lng: 88.7299 },
  "Gorumara National Park": { lat: 26.7181, lng: 88.7903 },
  "Jaldapara National Park": { lat: 26.6861, lng: 89.3558 },
  "Alipurduar City, Alipurduar": { lat: 26.4887, lng: 89.5319 },
  "Cooch Behar City, Cooch Behar": { lat: 26.3452, lng: 89.4482 },
  "Cooch Behar Palace (Rajbari)": { lat: 26.3292, lng: 89.4437 },
  "Siliguri City, Darjeeling": { lat: 26.7271, lng: 88.3953 },
  "New Jalpaiguri Station (NJP)": { lat: 26.6831, lng: 88.4305 },
  "Bagdogra Airport, Siliguri": { lat: 26.6812, lng: 88.3286 },
  "Tenzing Norgay Bus Stand, Siliguri": { lat: 26.7172, lng: 88.4278 },
  "Dooars, West Bengal": { lat: 26.7000, lng: 88.8500 },
  "Lataguri, Dooars": { lat: 26.7355, lng: 88.7881 },
};

const goodPickupCategories = [
  "Railway Station",
  "Bus Stand", 
  "Airport",
  "Mall",
  "Hospital",
  "Area",
  "City",
  "Town"
];

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Please allow location access to find nearby pickup points"));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information unavailable"));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out"));
            break;
          default:
            reject(new Error("Unable to get your location"));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

export function findNearbyPickupPoints(userCoords: Coordinates, limit: number = 5): NearbyLocation[] {
  const nearbyLocations: NearbyLocation[] = [];
  
  for (const [name, coords] of Object.entries(locationCoordinates)) {
    const distance = calculateDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
    
    const categoryMatch = Object.entries(locationCoordinates).find(([n]) => n === name);
    if (categoryMatch) {
      nearbyLocations.push({
        name,
        distance,
        category: getCategoryForLocation(name),
        district: getDistrictForLocation(name)
      });
    }
  }
  
  nearbyLocations.sort((a, b) => {
    const aIsGoodPickup = goodPickupCategories.includes(a.category) ? 0 : 1;
    const bIsGoodPickup = goodPickupCategories.includes(b.category) ? 0 : 1;
    if (aIsGoodPickup !== bIsGoodPickup) return aIsGoodPickup - bIsGoodPickup;
    return a.distance - b.distance;
  });
  
  return nearbyLocations.slice(0, limit);
}

function getCategoryForLocation(name: string): string {
  if (name.includes("Station")) return "Railway Station";
  if (name.includes("Airport")) return "Airport";
  if (name.includes("Bus Stand")) return "Bus Stand";
  if (name.includes("Mall")) return "Mall";
  if (name.includes("Hospital")) return "Hospital";
  if (name.includes("University") || name.includes("IIT") || name.includes("IIM")) return "University";
  if (name.includes("Temple") || name.includes("Math") || name.includes("Mosque")) return "Temple";
  if (name.includes("Beach")) return "Beach";
  if (name.includes("Park") || name.includes("Hills") || name.includes("Forest")) return "Nature";
  if (name.includes("Town,") || name.includes("City,")) return "Town";
  return "Area";
}

function getDistrictForLocation(name: string): string {
  if (name.includes("Kolkata") || name.includes("Park Street")) return "Kolkata";
  if (name.includes("Howrah")) return "Howrah";
  if (name.includes("Salt Lake") || name.includes("New Town") || name.includes("Dum Dum") || name.includes("Barasat") || name.includes("Barrackpore")) return "North 24 Parganas";
  if (name.includes("Garia") || name.includes("Joka") || name.includes("Diamond") || name.includes("Sundarban") || name.includes("Gangasagar") || name.includes("Bakkhali")) return "South 24 Parganas";
  if (name.includes("Darjeeling") || name.includes("Tiger Hill") || name.includes("Ghum") || name.includes("Mirik") || name.includes("Kurseong") || name.includes("Siliguri")) return "Darjeeling";
  if (name.includes("Kalimpong") || name.includes("Lava") || name.includes("Lolegaon")) return "Kalimpong";
  if (name.includes("Jalpaiguri") || name.includes("Gorumara") || name.includes("Lataguri") || name.includes("Dooars")) return "Jalpaiguri";
  if (name.includes("Alipurduar") || name.includes("Jaldapara")) return "Alipurduar";
  if (name.includes("Cooch Behar")) return "Cooch Behar";
  if (name.includes("NJP") || name.includes("Bagdogra")) return "Jalpaiguri";
  if (name.includes("Hooghly") || name.includes("Chinsurah") || name.includes("Chandannagar") || name.includes("Bandel") || name.includes("Tarakeswar")) return "Hooghly";
  if (name.includes("Nadia") || name.includes("Krishnanagar") || name.includes("Nabadwip") || name.includes("Mayapur")) return "Nadia";
  if (name.includes("Murshidabad") || name.includes("Berhampore")) return "Murshidabad";
  if (name.includes("Birbhum") || name.includes("Suri") || name.includes("Shantiniketan") || name.includes("Bolpur") || name.includes("Tarapith")) return "Birbhum";
  if (name.includes("Bardhaman") || name.includes("Burdwan")) return "Purba Bardhaman";
  if (name.includes("Durgapur") || name.includes("Asansol")) return "Paschim Bardhaman";
  if (name.includes("Bankura") || name.includes("Bishnupur") || name.includes("Mukutmanipur")) return "Bankura";
  if (name.includes("Purulia") || name.includes("Ayodhya")) return "Purulia";
  if (name.includes("Digha") || name.includes("Mandarmani") || name.includes("Tajpur") || name.includes("Haldia") || name.includes("Tamluk")) return "East Midnapore";
  if (name.includes("Midnapore") || name.includes("Kharagpur") || name.includes("IIT Kharagpur")) return "West Midnapore";
  if (name.includes("Jhargram")) return "Jhargram";
  if (name.includes("Malda") || name.includes("Gaur")) return "Malda";
  if (name.includes("Raiganj")) return "Uttar Dinajpur";
  if (name.includes("Balurghat")) return "Dakshin Dinajpur";
  return "West Bengal";
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
