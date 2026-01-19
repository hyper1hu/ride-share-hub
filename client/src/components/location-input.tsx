import { useState, useRef, useEffect } from "react";
import { MapPin, Building2, Landmark, TreePine, Plane, Train, Ship } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

const popularLocations = [
  // West Bengal
  { name: "Howrah Station, Kolkata", icon: Train, category: "transport" },
  { name: "Sealdah Station, Kolkata", icon: Train, category: "transport" },
  { name: "Victoria Memorial, Kolkata", icon: Landmark, category: "landmark" },
  { name: "Dakshineswar Temple, Kolkata", icon: Landmark, category: "landmark" },
  { name: "Kalighat Temple, Kolkata", icon: Landmark, category: "landmark" },
  { name: "Science City, Kolkata", icon: Building2, category: "landmark" },
  { name: "Park Street, Kolkata", icon: Building2, category: "landmark" },
  { name: "Salt Lake City, Kolkata", icon: Building2, category: "area" },
  { name: "Esplanade, Kolkata", icon: Building2, category: "landmark" },
  { name: "Netaji Subhas Airport, Kolkata", icon: Plane, category: "transport" },
  { name: "New Town, Kolkata", icon: Building2, category: "area" },
  { name: "Digha Beach, West Bengal", icon: Ship, category: "beach" },
  { name: "Darjeeling, West Bengal", icon: TreePine, category: "hill" },
  { name: "Siliguri, West Bengal", icon: Building2, category: "city" },
  { name: "Durgapur, West Bengal", icon: Building2, category: "city" },
  { name: "Asansol, West Bengal", icon: Building2, category: "city" },
  { name: "Kharagpur, West Bengal", icon: Train, category: "city" },
  { name: "Sundarbans, West Bengal", icon: TreePine, category: "nature" },
  { name: "Shantiniketan, West Bengal", icon: Landmark, category: "landmark" },
  { name: "Malda, West Bengal", icon: Building2, category: "city" },
  // Other Major Indian Cities
  { name: "Connaught Place, Delhi", icon: Building2, category: "landmark" },
  { name: "India Gate, Delhi", icon: Landmark, category: "landmark" },
  { name: "IGI Airport, Delhi", icon: Plane, category: "transport" },
  { name: "Gateway of India, Mumbai", icon: Landmark, category: "landmark" },
  { name: "Chhatrapati Shivaji Terminus, Mumbai", icon: Train, category: "transport" },
  { name: "MG Road, Bangalore", icon: Building2, category: "landmark" },
  { name: "Marina Beach, Chennai", icon: Ship, category: "beach" },
  { name: "Charminar, Hyderabad", icon: Landmark, category: "landmark" },
  { name: "Hawa Mahal, Jaipur", icon: Landmark, category: "landmark" },
  { name: "Taj Mahal, Agra", icon: Landmark, category: "landmark" },
];

export function LocationInput({ value, onChange, placeholder, className, "data-testid": testId }: LocationInputProps) {
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
      const filtered = popularLocations.filter(loc => 
        loc.name.toLowerCase().includes(value.toLowerCase())
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

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={cn("pl-10", className)}
        data-testid={testId}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          <div className="p-2 border-b">
            <p className="text-xs text-muted-foreground font-medium">Popular Landmarks</p>
          </div>
          <div className="p-1">
            {filteredLocations.slice(0, 8).map((location, index) => {
              const Icon = location.icon;
              return (
                <button
                  key={index}
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md hover-elevate transition-colors"
                  onClick={() => handleSelect(location.name)}
                  data-testid={`location-option-${index}`}
                >
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">{location.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
