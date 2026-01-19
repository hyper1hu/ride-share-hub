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
  { name: "Times Square, New York", icon: Building2, category: "landmark" },
  { name: "Central Park, New York", icon: TreePine, category: "park" },
  { name: "Empire State Building, NYC", icon: Building2, category: "landmark" },
  { name: "Statue of Liberty, NYC", icon: Landmark, category: "landmark" },
  { name: "Hollywood Sign, Los Angeles", icon: Landmark, category: "landmark" },
  { name: "Golden Gate Bridge, San Francisco", icon: Landmark, category: "landmark" },
  { name: "Space Needle, Seattle", icon: Building2, category: "landmark" },
  { name: "Willis Tower, Chicago", icon: Building2, category: "landmark" },
  { name: "Miami Beach, Florida", icon: Ship, category: "beach" },
  { name: "Las Vegas Strip, Nevada", icon: Building2, category: "entertainment" },
  { name: "Grand Canyon, Arizona", icon: TreePine, category: "nature" },
  { name: "JFK Airport, New York", icon: Plane, category: "transport" },
  { name: "LAX Airport, Los Angeles", icon: Plane, category: "transport" },
  { name: "Penn Station, New York", icon: Train, category: "transport" },
  { name: "Union Station, Chicago", icon: Train, category: "transport" },
  { name: "Boston Common, Boston", icon: TreePine, category: "park" },
  { name: "Freedom Trail, Boston", icon: Landmark, category: "landmark" },
  { name: "Lincoln Memorial, Washington DC", icon: Landmark, category: "landmark" },
  { name: "White House, Washington DC", icon: Landmark, category: "landmark" },
  { name: "French Quarter, New Orleans", icon: Building2, category: "landmark" },
  { name: "Niagara Falls, New York", icon: TreePine, category: "nature" },
  { name: "Yellowstone, Wyoming", icon: TreePine, category: "nature" },
  { name: "Disney World, Orlando", icon: Landmark, category: "entertainment" },
  { name: "Navy Pier, Chicago", icon: Ship, category: "landmark" },
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
