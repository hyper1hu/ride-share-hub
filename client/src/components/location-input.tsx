import { useState, useRef, useEffect } from "react";
import { Search, Clock, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { westBengalLocations, searchLocations } from "@/lib/locations";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "pickup" | "drop" | "default";
  "data-testid"?: string;
}

const recentLocations = [
  { name: "Howrah Station, Kolkata" },
  { name: "Salt Lake City (Sector V), Kolkata" },
  { name: "Park Street, Kolkata" },
  { name: "Sealdah Station, Kolkata" },
];

export function LocationInput({ value, onChange, placeholder, className, variant = "default", "data-testid": testId }: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(westBengalLocations);
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
    const results = searchLocations(value);
    setFilteredLocations(results.length > 0 ? results : westBengalLocations);
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Navigation className="h-3.5 w-3.5" />
                {value ? `Results (${filteredLocations.length})` : "All Locations"}
              </div>
              {!value && (
                <span className="text-[10px] text-muted-foreground">
                  {westBengalLocations.length}+ places
                </span>
              )}
            </div>
          </div>
          
          <div className="p-1 overflow-y-auto max-h-56">
            {filteredLocations.slice(0, 15).map((location, index) => {
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
                    <p className="text-xs text-muted-foreground truncate">{location.district}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium flex-shrink-0">
                    {location.category}
                  </span>
                </button>
              );
            })}
            {filteredLocations.length === 0 && (
              <div className="px-3 py-6 text-center text-muted-foreground text-sm">
                No locations found. Try searching by city, district, or category.
              </div>
            )}
            {filteredLocations.length > 15 && (
              <div className="px-3 py-2 text-center text-xs text-muted-foreground border-t">
                Showing 15 of {filteredLocations.length} results. Type to refine search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
