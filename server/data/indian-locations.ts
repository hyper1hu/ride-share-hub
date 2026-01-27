// Comprehensive Indian locations database
// Organized by state with major cities, towns, and tourist destinations

export interface Location {
  name: string;
  state: string;
  district?: string;
  type: "city" | "town" | "village" | "tourist" | "airport" | "railway";
  popular: boolean;
}

export const indianLocations: Location[] = [
  // West Bengal
  { name: "Kolkata", state: "West Bengal", district: "Kolkata", type: "city", popular: true },
  { name: "Howrah", state: "West Bengal", district: "Howrah", type: "city", popular: true },
  { name: "Durgapur", state: "West Bengal", district: "Paschim Bardhaman", type: "city", popular: true },
  { name: "Asansol", state: "West Bengal", district: "Paschim Bardhaman", type: "city", popular: true },
  { name: "Siliguri", state: "West Bengal", district: "Darjeeling", type: "city", popular: true },
  { name: "Darjeeling", state: "West Bengal", district: "Darjeeling", type: "tourist", popular: true },
  { name: "Kalimpong", state: "West Bengal", district: "Kalimpong", type: "tourist", popular: true },
  { name: "Digha", state: "West Bengal", district: "Purba Medinipur", type: "tourist", popular: true },
  { name: "Mandarmani", state: "West Bengal", district: "Purba Medinipur", type: "tourist", popular: true },
  { name: "Shantiniketan", state: "West Bengal", district: "Birbhum", type: "tourist", popular: true },
  { name: "Murshidabad", state: "West Bengal", district: "Murshidabad", type: "city", popular: false },
  { name: "Malda", state: "West Bengal", district: "Malda", type: "city", popular: false },
  { name: "Jalpaiguri", state: "West Bengal", district: "Jalpaiguri", type: "city", popular: false },
  { name: "Bardhaman", state: "West Bengal", district: "Purba Bardhaman", type: "city", popular: false },
  { name: "Haldia", state: "West Bengal", district: "Purba Medinipur", type: "city", popular: false },
  { name: "Kharagpur", state: "West Bengal", district: "Paschim Medinipur", type: "city", popular: false },
  { name: "Bankura", state: "West Bengal", district: "Bankura", type: "city", popular: false },
  { name: "Purulia", state: "West Bengal", district: "Purulia", type: "city", popular: false },
  { name: "Cooch Behar", state: "West Bengal", district: "Cooch Behar", type: "city", popular: false },
  { name: "Raiganj", state: "West Bengal", district: "Uttar Dinajpur", type: "city", popular: false },

  // Delhi NCR
  { name: "New Delhi", state: "Delhi", type: "city", popular: true },
  { name: "Delhi Airport", state: "Delhi", type: "airport", popular: true },
  { name: "Connaught Place", state: "Delhi", type: "city", popular: true },
  { name: "Dwarka", state: "Delhi", type: "city", popular: false },
  { name: "Rohini", state: "Delhi", type: "city", popular: false },
  { name: "Noida", state: "Uttar Pradesh", district: "Gautam Buddha Nagar", type: "city", popular: true },
  { name: "Greater Noida", state: "Uttar Pradesh", district: "Gautam Buddha Nagar", type: "city", popular: true },
  { name: "Gurgaon", state: "Haryana", district: "Gurgaon", type: "city", popular: true },
  { name: "Faridabad", state: "Haryana", district: "Faridabad", type: "city", popular: true },
  { name: "Ghaziabad", state: "Uttar Pradesh", district: "Ghaziabad", type: "city", popular: true },

  // Maharashtra
  { name: "Mumbai", state: "Maharashtra", district: "Mumbai", type: "city", popular: true },
  { name: "Mumbai Airport", state: "Maharashtra", type: "airport", popular: true },
  { name: "Pune", state: "Maharashtra", district: "Pune", type: "city", popular: true },
  { name: "Nagpur", state: "Maharashtra", district: "Nagpur", type: "city", popular: true },
  { name: "Nashik", state: "Maharashtra", district: "Nashik", type: "city", popular: true },
  { name: "Aurangabad", state: "Maharashtra", district: "Aurangabad", type: "city", popular: true },
  { name: "Thane", state: "Maharashtra", district: "Thane", type: "city", popular: true },
  { name: "Navi Mumbai", state: "Maharashtra", district: "Raigad", type: "city", popular: true },
  { name: "Kolhapur", state: "Maharashtra", district: "Kolhapur", type: "city", popular: false },
  { name: "Solapur", state: "Maharashtra", district: "Solapur", type: "city", popular: false },
  { name: "Lonavala", state: "Maharashtra", district: "Pune", type: "tourist", popular: true },
  { name: "Mahabaleshwar", state: "Maharashtra", district: "Satara", type: "tourist", popular: true },
  { name: "Shirdi", state: "Maharashtra", district: "Ahmednagar", type: "tourist", popular: true },

  // Karnataka
  { name: "Bangalore", state: "Karnataka", district: "Bangalore Urban", type: "city", popular: true },
  { name: "Bengaluru Airport", state: "Karnataka", type: "airport", popular: true },
  { name: "Mysore", state: "Karnataka", district: "Mysore", type: "city", popular: true },
  { name: "Mangalore", state: "Karnataka", district: "Dakshina Kannada", type: "city", popular: true },
  { name: "Hubli", state: "Karnataka", district: "Dharwad", type: "city", popular: true },
  { name: "Belgaum", state: "Karnataka", district: "Belgaum", type: "city", popular: false },
  { name: "Coorg", state: "Karnataka", district: "Kodagu", type: "tourist", popular: true },
  { name: "Hampi", state: "Karnataka", district: "Ballari", type: "tourist", popular: true },
  { name: "Udupi", state: "Karnataka", district: "Udupi", type: "city", popular: false },

  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu", district: "Chennai", type: "city", popular: true },
  { name: "Chennai Airport", state: "Tamil Nadu", type: "airport", popular: true },
  { name: "Coimbatore", state: "Tamil Nadu", district: "Coimbatore", type: "city", popular: true },
  { name: "Madurai", state: "Tamil Nadu", district: "Madurai", type: "city", popular: true },
  { name: "Tiruchirappalli", state: "Tamil Nadu", district: "Tiruchirappalli", type: "city", popular: true },
  { name: "Salem", state: "Tamil Nadu", district: "Salem", type: "city", popular: false },
  { name: "Tirunelveli", state: "Tamil Nadu", district: "Tirunelveli", type: "city", popular: false },
  { name: "Ooty", state: "Tamil Nadu", district: "Nilgiris", type: "tourist", popular: true },
  { name: "Kodaikanal", state: "Tamil Nadu", district: "Dindigul", type: "tourist", popular: true },
  { name: "Kanyakumari", state: "Tamil Nadu", district: "Kanyakumari", type: "tourist", popular: true },
  { name: "Rameswaram", state: "Tamil Nadu", district: "Ramanathapuram", type: "tourist", popular: true },
  { name: "Pondicherry", state: "Puducherry", type: "city", popular: true },

  // Telangana & Andhra Pradesh
  { name: "Hyderabad", state: "Telangana", district: "Hyderabad", type: "city", popular: true },
  { name: "Hyderabad Airport", state: "Telangana", type: "airport", popular: true },
  { name: "Secunderabad", state: "Telangana", district: "Hyderabad", type: "city", popular: true },
  { name: "Warangal", state: "Telangana", district: "Warangal", type: "city", popular: false },
  { name: "Vijayawada", state: "Andhra Pradesh", district: "Krishna", type: "city", popular: true },
  { name: "Visakhapatnam", state: "Andhra Pradesh", district: "Visakhapatnam", type: "city", popular: true },
  { name: "Tirupati", state: "Andhra Pradesh", district: "Chittoor", type: "tourist", popular: true },
  { name: "Guntur", state: "Andhra Pradesh", district: "Guntur", type: "city", popular: false },
  { name: "Nellore", state: "Andhra Pradesh", district: "Nellore", type: "city", popular: false },

  // Kerala
  { name: "Thiruvananthapuram", state: "Kerala", district: "Thiruvananthapuram", type: "city", popular: true },
  { name: "Kochi", state: "Kerala", district: "Ernakulam", type: "city", popular: true },
  { name: "Kochi Airport", state: "Kerala", type: "airport", popular: true },
  { name: "Kozhikode", state: "Kerala", district: "Kozhikode", type: "city", popular: true },
  { name: "Thrissur", state: "Kerala", district: "Thrissur", type: "city", popular: false },
  { name: "Alappuzha", state: "Kerala", district: "Alappuzha", type: "tourist", popular: true },
  { name: "Munnar", state: "Kerala", district: "Idukki", type: "tourist", popular: true },
  { name: "Wayanad", state: "Kerala", district: "Wayanad", type: "tourist", popular: true },
  { name: "Kovalam", state: "Kerala", district: "Thiruvananthapuram", type: "tourist", popular: true },

  // Gujarat
  { name: "Ahmedabad", state: "Gujarat", district: "Ahmedabad", type: "city", popular: true },
  { name: "Ahmedabad Airport", state: "Gujarat", type: "airport", popular: true },
  { name: "Surat", state: "Gujarat", district: "Surat", type: "city", popular: true },
  { name: "Vadodara", state: "Gujarat", district: "Vadodara", type: "city", popular: true },
  { name: "Rajkot", state: "Gujarat", district: "Rajkot", type: "city", popular: true },
  { name: "Gandhinagar", state: "Gujarat", district: "Gandhinagar", type: "city", popular: false },
  { name: "Dwarka", state: "Gujarat", district: "Devbhoomi Dwarka", type: "tourist", popular: true },
  { name: "Somnath", state: "Gujarat", district: "Gir Somnath", type: "tourist", popular: true },
  { name: "Gir National Park", state: "Gujarat", district: "Junagadh", type: "tourist", popular: true },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan", district: "Jaipur", type: "city", popular: true },
  { name: "Jaipur Airport", state: "Rajasthan", type: "airport", popular: true },
  { name: "Jodhpur", state: "Rajasthan", district: "Jodhpur", type: "city", popular: true },
  { name: "Udaipur", state: "Rajasthan", district: "Udaipur", type: "city", popular: true },
  { name: "Jaisalmer", state: "Rajasthan", district: "Jaisalmer", type: "tourist", popular: true },
  { name: "Bikaner", state: "Rajasthan", district: "Bikaner", type: "city", popular: true },
  { name: "Ajmer", state: "Rajasthan", district: "Ajmer", type: "city", popular: true },
  { name: "Pushkar", state: "Rajasthan", district: "Ajmer", type: "tourist", popular: true },
  { name: "Mount Abu", state: "Rajasthan", district: "Sirohi", type: "tourist", popular: true },
  { name: "Kota", state: "Rajasthan", district: "Kota", type: "city", popular: false },

  // Uttar Pradesh
  { name: "Lucknow", state: "Uttar Pradesh", district: "Lucknow", type: "city", popular: true },
  { name: "Lucknow Airport", state: "Uttar Pradesh", type: "airport", popular: true },
  { name: "Kanpur", state: "Uttar Pradesh", district: "Kanpur", type: "city", popular: true },
  { name: "Agra", state: "Uttar Pradesh", district: "Agra", type: "city", popular: true },
  { name: "Varanasi", state: "Uttar Pradesh", district: "Varanasi", type: "city", popular: true },
  { name: "Varanasi Airport", state: "Uttar Pradesh", type: "airport", popular: true },
  { name: "Allahabad", state: "Uttar Pradesh", district: "Prayagraj", type: "city", popular: true },
  { name: "Mathura", state: "Uttar Pradesh", district: "Mathura", type: "tourist", popular: true },
  { name: "Vrindavan", state: "Uttar Pradesh", district: "Mathura", type: "tourist", popular: true },
  { name: "Ayodhya", state: "Uttar Pradesh", district: "Ayodhya", type: "tourist", popular: true },
  { name: "Meerut", state: "Uttar Pradesh", district: "Meerut", type: "city", popular: false },
  { name: "Bareilly", state: "Uttar Pradesh", district: "Bareilly", type: "city", popular: false },
  { name: "Aligarh", state: "Uttar Pradesh", district: "Aligarh", type: "city", popular: false },

  // Madhya Pradesh
  { name: "Bhopal", state: "Madhya Pradesh", district: "Bhopal", type: "city", popular: true },
  { name: "Indore", state: "Madhya Pradesh", district: "Indore", type: "city", popular: true },
  { name: "Indore Airport", state: "Madhya Pradesh", type: "airport", popular: true },
  { name: "Gwalior", state: "Madhya Pradesh", district: "Gwalior", type: "city", popular: true },
  { name: "Jabalpur", state: "Madhya Pradesh", district: "Jabalpur", type: "city", popular: false },
  { name: "Ujjain", state: "Madhya Pradesh", district: "Ujjain", type: "tourist", popular: true },
  { name: "Khajuraho", state: "Madhya Pradesh", district: "Chhatarpur", type: "tourist", popular: true },
  { name: "Pachmarhi", state: "Madhya Pradesh", district: "Hoshangabad", type: "tourist", popular: true },

  // Punjab & Haryana
  { name: "Chandigarh", state: "Chandigarh", type: "city", popular: true },
  { name: "Chandigarh Airport", state: "Chandigarh", type: "airport", popular: true },
  { name: "Amritsar", state: "Punjab", district: "Amritsar", type: "city", popular: true },
  { name: "Amritsar Airport", state: "Punjab", type: "airport", popular: true },
  { name: "Ludhiana", state: "Punjab", district: "Ludhiana", type: "city", popular: true },
  { name: "Jalandhar", state: "Punjab", district: "Jalandhar", type: "city", popular: false },
  { name: "Patiala", state: "Punjab", district: "Patiala", type: "city", popular: false },
  { name: "Ambala", state: "Haryana", district: "Ambala", type: "city", popular: false },
  { name: "Karnal", state: "Haryana", district: "Karnal", type: "city", popular: false },
  { name: "Panipat", state: "Haryana", district: "Panipat", type: "city", popular: false },

  // Himachal Pradesh & Uttarakhand
  { name: "Shimla", state: "Himachal Pradesh", district: "Shimla", type: "tourist", popular: true },
  { name: "Manali", state: "Himachal Pradesh", district: "Kullu", type: "tourist", popular: true },
  { name: "Dharamshala", state: "Himachal Pradesh", district: "Kangra", type: "tourist", popular: true },
  { name: "Kullu", state: "Himachal Pradesh", district: "Kullu", type: "tourist", popular: true },
  { name: "Dehradun", state: "Uttarakhand", district: "Dehradun", type: "city", popular: true },
  { name: "Mussoorie", state: "Uttarakhand", district: "Dehradun", type: "tourist", popular: true },
  { name: "Nainital", state: "Uttarakhand", district: "Nainital", type: "tourist", popular: true },
  { name: "Haridwar", state: "Uttarakhand", district: "Haridwar", type: "tourist", popular: true },
  { name: "Rishikesh", state: "Uttarakhand", district: "Dehradun", type: "tourist", popular: true },

  // Goa
  { name: "Panaji", state: "Goa", district: "North Goa", type: "city", popular: true },
  { name: "Goa Airport", state: "Goa", type: "airport", popular: true },
  { name: "Margao", state: "Goa", district: "South Goa", type: "city", popular: true },
  { name: "Calangute", state: "Goa", district: "North Goa", type: "tourist", popular: true },
  { name: "Baga", state: "Goa", district: "North Goa", type: "tourist", popular: true },
  { name: "Anjuna", state: "Goa", district: "North Goa", type: "tourist", popular: true },
  { name: "Palolem", state: "Goa", district: "South Goa", type: "tourist", popular: true },

  // Bihar & Jharkhand
  { name: "Patna", state: "Bihar", district: "Patna", type: "city", popular: true },
  { name: "Patna Airport", state: "Bihar", type: "airport", popular: true },
  { name: "Gaya", state: "Bihar", district: "Gaya", type: "city", popular: true },
  { name: "Bodh Gaya", state: "Bihar", district: "Gaya", type: "tourist", popular: true },
  { name: "Ranchi", state: "Jharkhand", district: "Ranchi", type: "city", popular: true },
  { name: "Ranchi Airport", state: "Jharkhand", type: "airport", popular: true },
  { name: "Jamshedpur", state: "Jharkhand", district: "East Singhbhum", type: "city", popular: true },
  { name: "Dhanbad", state: "Jharkhand", district: "Dhanbad", type: "city", popular: false },

  // Odisha
  { name: "Bhubaneswar", state: "Odisha", district: "Khordha", type: "city", popular: true },
  { name: "Bhubaneswar Airport", state: "Odisha", type: "airport", popular: true },
  { name: "Cuttack", state: "Odisha", district: "Cuttack", type: "city", popular: false },
  { name: "Puri", state: "Odisha", district: "Puri", type: "tourist", popular: true },
  { name: "Konark", state: "Odisha", district: "Puri", type: "tourist", popular: true },

  // Assam & Northeast
  { name: "Guwahati", state: "Assam", district: "Kamrup", type: "city", popular: true },
  { name: "Guwahati Airport", state: "Assam", type: "airport", popular: true },
  { name: "Shillong", state: "Meghalaya", district: "East Khasi Hills", type: "tourist", popular: true },
  { name: "Imphal", state: "Manipur", district: "Imphal West", type: "city", popular: false },
  { name: "Agartala", state: "Tripura", district: "West Tripura", type: "city", popular: false },
  { name: "Gangtok", state: "Sikkim", district: "East Sikkim", type: "tourist", popular: true },

  // Jammu & Kashmir
  { name: "Srinagar", state: "Jammu and Kashmir", district: "Srinagar", type: "city", popular: true },
  { name: "Srinagar Airport", state: "Jammu and Kashmir", type: "airport", popular: true },
  { name: "Jammu", state: "Jammu and Kashmir", district: "Jammu", type: "city", popular: true },
  { name: "Gulmarg", state: "Jammu and Kashmir", district: "Baramulla", type: "tourist", popular: true },
  { name: "Pahalgam", state: "Jammu and Kashmir", district: "Anantnag", type: "tourist", popular: true },
  { name: "Leh", state: "Ladakh", district: "Leh", type: "tourist", popular: true },
  { name: "Ladakh", state: "Ladakh", type: "tourist", popular: true },
];

// Helper functions for location search
export function searchLocations(query: string, limit: number = 20): Location[] {
  const lowerQuery = query.toLowerCase();
  return indianLocations
    .filter(loc => 
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.state.toLowerCase().includes(lowerQuery) ||
      (loc.district && loc.district.toLowerCase().includes(lowerQuery))
    )
    .sort((a, b) => {
      // Prioritize popular locations
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      // Then sort by exact match
      if (a.name.toLowerCase().startsWith(lowerQuery)) return -1;
      if (b.name.toLowerCase().startsWith(lowerQuery)) return 1;
      return 0;
    })
    .slice(0, limit);
}

export function getPopularLocations(limit: number = 50): Location[] {
  return indianLocations
    .filter(loc => loc.popular)
    .slice(0, limit);
}

export function getLocationsByState(state: string): Location[] {
  return indianLocations.filter(loc => 
    loc.state.toLowerCase() === state.toLowerCase()
  );
}

export function getLocationsByType(type: Location["type"]): Location[] {
  return indianLocations.filter(loc => loc.type === type);
}
