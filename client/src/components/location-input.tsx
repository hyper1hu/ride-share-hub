import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Building2, Landmark, TreePine, Plane, Train, Ship, Clock, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "pickup" | "drop" | "default";
  "data-testid"?: string;
}

const popularLocations = [
  // Kolkata - Major Landmarks & Areas
  { name: "Howrah Station, Kolkata", icon: Train, category: "Railway Station" },
  { name: "Sealdah Station, Kolkata", icon: Train, category: "Railway Station" },
  { name: "Kolkata Station (Chitpur), Kolkata", icon: Train, category: "Railway Station" },
  { name: "Santragachi Station, Howrah", icon: Train, category: "Railway Station" },
  { name: "Netaji Subhas Airport, Kolkata", icon: Plane, category: "Airport" },
  { name: "Victoria Memorial, Kolkata", icon: Landmark, category: "Landmark" },
  { name: "Dakshineswar Temple, Kolkata", icon: Landmark, category: "Temple" },
  { name: "Kalighat Temple, Kolkata", icon: Landmark, category: "Temple" },
  { name: "Belur Math, Howrah", icon: Landmark, category: "Temple" },
  { name: "Indian Museum, Kolkata", icon: Landmark, category: "Landmark" },
  { name: "Science City, Kolkata", icon: Building2, category: "Landmark" },
  { name: "Eco Park, New Town", icon: TreePine, category: "Park" },
  { name: "Park Street, Kolkata", icon: Building2, category: "Area" },
  { name: "Salt Lake City, Kolkata", icon: Building2, category: "Area" },
  { name: "New Town, Kolkata", icon: Building2, category: "Area" },
  { name: "Rajarhat, Kolkata", icon: Building2, category: "Area" },
  { name: "Esplanade, Kolkata", icon: Building2, category: "Area" },
  { name: "Gariahat, Kolkata", icon: Building2, category: "Area" },
  { name: "Behala, Kolkata", icon: Building2, category: "Area" },
  { name: "Jadavpur, Kolkata", icon: Building2, category: "Area" },
  { name: "Dumdum, Kolkata", icon: Building2, category: "Area" },
  { name: "Barasat, North 24 Parganas", icon: Building2, category: "Area" },
  { name: "Barrackpore, North 24 Parganas", icon: Building2, category: "Area" },
  // North Bengal
  { name: "Darjeeling, West Bengal", icon: TreePine, category: "Hill Station" },
  { name: "Siliguri, West Bengal", icon: Building2, category: "City" },
  { name: "New Jalpaiguri Station (NJP)", icon: Train, category: "Railway Station" },
  { name: "Bagdogra Airport, Siliguri", icon: Plane, category: "Airport" },
  { name: "Kalimpong, West Bengal", icon: TreePine, category: "Hill Station" },
  { name: "Kurseong, West Bengal", icon: TreePine, category: "Hill Station" },
  { name: "Mirik, West Bengal", icon: TreePine, category: "Hill Station" },
  { name: "Jalpaiguri, West Bengal", icon: Building2, category: "City" },
  { name: "Cooch Behar, West Bengal", icon: Building2, category: "City" },
  { name: "Alipurduar, West Bengal", icon: Building2, category: "City" },
  { name: "Dooars, West Bengal", icon: TreePine, category: "Nature" },
  { name: "Jaldapara, West Bengal", icon: TreePine, category: "Nature" },
  // South Bengal - Districts & Cities
  { name: "Digha Beach, East Midnapore", icon: Ship, category: "Beach" },
  { name: "Mandarmani Beach, East Midnapore", icon: Ship, category: "Beach" },
  { name: "Tajpur Beach, East Midnapore", icon: Ship, category: "Beach" },
  { name: "Bakkhali Beach, South 24 Parganas", icon: Ship, category: "Beach" },
  { name: "Sundarbans, South 24 Parganas", icon: TreePine, category: "Nature" },
  { name: "Diamond Harbour, South 24 Parganas", icon: Ship, category: "Area" },
  { name: "Kakdwip, South 24 Parganas", icon: Building2, category: "Area" },
  { name: "Haldia, East Midnapore", icon: Building2, category: "City" },
  { name: "Contai, East Midnapore", icon: Building2, category: "City" },
  { name: "Tamluk, East Midnapore", icon: Building2, category: "City" },
  { name: "Midnapore, West Midnapore", icon: Building2, category: "City" },
  { name: "Kharagpur, West Midnapore", icon: Train, category: "City" },
  { name: "Jhargram, West Bengal", icon: Building2, category: "City" },
  // Central Bengal
  { name: "Durgapur, West Bengal", icon: Building2, category: "City" },
  { name: "Asansol, West Bengal", icon: Building2, category: "City" },
  { name: "Bardhaman (Burdwan), West Bengal", icon: Building2, category: "City" },
  { name: "Bankura, West Bengal", icon: Building2, category: "City" },
  { name: "Bishnupur, Bankura", icon: Landmark, category: "Landmark" },
  { name: "Purulia, West Bengal", icon: Building2, category: "City" },
  { name: "Hooghly, West Bengal", icon: Building2, category: "City" },
  { name: "Chandannagar, Hooghly", icon: Building2, category: "City" },
  { name: "Serampore, Hooghly", icon: Building2, category: "City" },
  { name: "Bandel, Hooghly", icon: Train, category: "City" },
  { name: "Nabadwip, Nadia", icon: Landmark, category: "Temple" },
  { name: "Mayapur, Nadia", icon: Landmark, category: "Temple" },
  { name: "Krishnanagar, Nadia", icon: Building2, category: "City" },
  { name: "Shantiniketan, Birbhum", icon: Landmark, category: "Landmark" },
  { name: "Bolpur, Birbhum", icon: Train, category: "City" },
  { name: "Suri, Birbhum", icon: Building2, category: "City" },
  // North Bengal - More Districts
  { name: "Malda, West Bengal", icon: Building2, category: "City" },
  { name: "English Bazar, Malda", icon: Building2, category: "City" },
  { name: "Raiganj, Uttar Dinajpur", icon: Building2, category: "City" },
  { name: "Balurghat, Dakshin Dinajpur", icon: Building2, category: "City" },
  { name: "Murshidabad, West Bengal", icon: Landmark, category: "Landmark" },
  { name: "Berhampore, Murshidabad", icon: Building2, category: "City" },
  // Major Bus Stands
  { name: "Esplanade Bus Stand, Kolkata", icon: Building2, category: "Bus Stand" },
  { name: "Babughat Bus Stand, Kolkata", icon: Building2, category: "Bus Stand" },
  { name: "Karunamoyee Bus Stand, Salt Lake", icon: Building2, category: "Bus Stand" },
  { name: "Tenon Bus Stand, Siliguri", icon: Building2, category: "Bus Stand" },
  // Other Major Indian Cities
  { name: "Connaught Place, Delhi", icon: Building2, category: "Landmark" },
  { name: "India Gate, Delhi", icon: Landmark, category: "Landmark" },
  { name: "IGI Airport, Delhi", icon: Plane, category: "Airport" },
  { name: "Gateway of India, Mumbai", icon: Landmark, category: "Landmark" },
  { name: "Chhatrapati Shivaji Terminus, Mumbai", icon: Train, category: "Railway Station" },
  { name: "MG Road, Bangalore", icon: Building2, category: "Landmark" },
  { name: "Marina Beach, Chennai", icon: Ship, category: "Beach" },
  { name: "Charminar, Hyderabad", icon: Landmark, category: "Landmark" },
  { name: "Hawa Mahal, Jaipur", icon: Landmark, category: "Landmark" },
  { name: "Taj Mahal, Agra", icon: Landmark, category: "Landmark" },
  { name: "Patna, Bihar", icon: Building2, category: "City" },
  { name: "Ranchi, Jharkhand", icon: Building2, category: "City" },
  { name: "Bhubaneswar, Odisha", icon: Building2, category: "City" },
  { name: "Guwahati, Assam", icon: Building2, category: "City" },
];

const recentLocations = [
  { name: "Howrah Station, Kolkata", icon: Clock },
  { name: "Salt Lake City, Kolkata", icon: Clock },
  { name: "Park Street, Kolkata", icon: Clock },
];

export function LocationInput({ value, onChange, placeholder, className, variant = "default", "data-testid": testId }: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(popularLocations);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const searchTerm = value.toLowerCase();
      const filtered = popularLocations.filter(loc => 
        loc.name.toLowerCase().includes(searchTerm) ||
        loc.category.toLowerCase().includes(searchTerm)
      );
      setFilteredLocations(filtered.length > 0 ? filtered : popularLocations);
    } else {
      setFilteredLocations(popularLocations);
    }
  }, [value]);

  const handleSelect = (location: string) => {
    onChange(location);
    setIsOpen(false);
  };

  const getDotColor = () => {
    if (variant === "pickup") return "bg-green-500";
    if (variant === "drop") return "bg-red-500";
    return "bg-primary";
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
        <div className={cn("w-2.5 h-2.5 rounded-full", getDotColor())} />
      </div>
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={cn("pl-9 pr-10 h-12 text-base", className)}
        data-testid={testId}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-xl shadow-xl z-50 max-h-80 overflow-hidden"
        >
          {!value && (
            <>
              <div className="p-3 border-b bg-muted/30">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <Clock className="h-3.5 w-3.5" />
                  Recent
                </div>
              </div>
              <div className="p-1">
                {recentLocations.map((location, index) => (
                  <button
                    key={`recent-${index}`}
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm text-left rounded-lg hover:bg-accent/50 transition-colors"
                    onClick={() => handleSelect(location.name)}
                    data-testid={`recent-location-${index}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{location.name.split(',')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{location.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          
          <div className="p-3 border-b bg-muted/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Navigation className="h-3.5 w-3.5" />
              {value ? "Search Results" : "Popular Destinations"}
            </div>
          </div>
          
          <div className="p-1 overflow-y-auto max-h-56">
            {filteredLocations.slice(0, 10).map((location, index) => {
              const Icon = location.icon;
              return (
                <button
                  key={index}
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-3 text-sm text-left rounded-lg hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelect(location.name)}
                  data-testid={`location-option-${index}`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{location.name.split(',')[0]}</p>
                    <p className="text-xs text-muted-foreground truncate">{location.name}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium flex-shrink-0">
                    {location.category}
                  </span>
                </button>
              );
            })}
            {filteredLocations.length === 0 && (
              <div className="px-3 py-6 text-center text-muted-foreground text-sm">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
