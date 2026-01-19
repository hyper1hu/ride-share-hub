import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Clock, Car, Users, Phone, Search, ArrowRight, Loader2, Bus, Bike, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookingDialog } from "@/components/booking-dialog";
import { LocationInput } from "@/components/location-input";
import type { Car as CarType } from "@shared/schema";

const vehicleTypeLabels: Record<string, string> = {
  car: "Car", suv: "SUV", van: "Van", bus: "Bus", minibus: "Minibus",
  motorcycle: "Motorcycle", auto_rickshaw: "Auto Rickshaw", truck: "Truck",
};

const getVehicleIcon = (type: string) => {
  switch (type) {
    case "bus": case "minibus": return Bus;
    case "motorcycle": return Bike;
    case "truck": return Truck;
    default: return Car;
  }
};

export default function Customer() {
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: cars = [], isLoading } = useQuery<CarType[]>({ queryKey: ["/api/cars"] });

  const availableCars = cars.filter((car) => car.status === "available");
  const filteredCars = availableCars.filter((car) => {
    const matchOrigin = searchOrigin ? car.origin.toLowerCase().includes(searchOrigin.toLowerCase()) : true;
    const matchDestination = searchDestination ? car.destination.toLowerCase().includes(searchDestination.toLowerCase()) : true;
    return matchOrigin && matchDestination;
  });

  const handleBookClick = (car: CarType) => {
    setSelectedCar(car);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/"><Button variant="ghost" size="icon" data-testid="button-back-home"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg">Find Your Ride</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Search by popular landmarks or type your location</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <LocationInput 
                  value={searchOrigin} 
                  onChange={setSearchOrigin} 
                  placeholder="From (landmark or city)"
                  data-testid="input-search-origin"
                />
              </div>
              <div className="flex items-center justify-center"><ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" /></div>
              <div className="flex-1">
                <LocationInput 
                  value={searchDestination} 
                  onChange={setSearchDestination} 
                  placeholder="To (landmark or city)"
                  data-testid="input-search-destination"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filteredCars.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><Search className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="font-semibold text-lg mb-2">No rides available</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {searchOrigin || searchDestination ? "No rides match your search criteria. Try adjusting your filters." : "There are no available rides at the moment. Check back later!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg" data-testid="text-available-rides-count">{filteredCars.length} ride{filteredCars.length !== 1 ? "s" : ""} available</h2>
            </div>
            <div className="grid gap-4">
              {filteredCars.map((car) => {
                const VehicleIcon = getVehicleIcon(car.vehicleType);
                return (
                  <Card key={car.id} data-testid={`card-ride-${car.id}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className="gap-1">
                              <VehicleIcon className="h-3 w-3" />
                              {vehicleTypeLabels[car.vehicleType] || "Vehicle"}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" /><span className="font-medium">{car.origin}</span></div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-destructive" /><span className="font-medium">{car.destination}</span></div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1.5"><VehicleIcon className="h-4 w-4" /><span>{car.carModel} ({car.carNumber})</span></div>
                            <div className="flex items-center gap-1.5"><Phone className="h-4 w-4" /><span>{car.driverName}</span></div>
                            <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /><span>{car.seatsAvailable} seat{car.seatsAvailable !== 1 ? "s" : ""}</span></div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-muted-foreground" /><span>Departs: <span className="font-medium">{car.departureTime}</span></span></div>
                            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-muted-foreground" /><span>Returns: <span className="font-medium">{car.returnTime}</span></span></div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-2"><Badge variant="secondary">One Way</Badge><span className="font-bold text-lg">₹{car.fare}</span></div>
                            <div className="flex items-center gap-2 mt-1"><Badge variant="outline">Round Trip</Badge><span className="font-semibold text-muted-foreground">₹{car.fare + car.returnFare}</span></div>
                          </div>
                          <Button onClick={() => handleBookClick(car)} data-testid={`button-book-${car.id}`}>Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} car={selectedCar} />
    </div>
  );
}
