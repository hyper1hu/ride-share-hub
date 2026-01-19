import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Clock, Car, Users, Phone, Search, ArrowRight, Loader2, Bus, Bike, Truck, IndianRupee, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookingDialog } from "@/components/booking-dialog";
import { LocationInput } from "@/components/location-input";
import type { Car as CarType } from "@shared/schema";

const vehicleTypeLabels: Record<string, string> = {
  car: "Car", suv: "SUV", van: "Van", bus: "Bus", minibus: "Minibus",
  motorcycle: "Motorcycle", auto_rickshaw: "Auto", truck: "Truck",
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
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Find Your Ride</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Book a comfortable journey</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Search className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Search Rides</h2>
            </div>
            <p className="text-sm text-muted-foreground">Find rides by popular landmarks or type your location</p>
          </div>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <LocationInput 
                  value={searchOrigin} 
                  onChange={setSearchOrigin} 
                  placeholder="From (landmark or city)"
                  variant="pickup"
                  data-testid="input-search-origin"
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <LocationInput 
                  value={searchDestination} 
                  onChange={setSearchDestination} 
                  placeholder="To (landmark or city)"
                  variant="drop"
                  data-testid="input-search-destination"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-xs font-medium">Safe Rides</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <IndianRupee className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <p className="text-xs font-medium">Best Prices</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-xs font-medium">Top Drivers</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCars.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">No rides available</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {searchOrigin || searchDestination 
                  ? "No rides match your search criteria. Try adjusting your filters or check back later." 
                  : "There are no available rides at the moment. New rides are added frequently, so check back soon!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg" data-testid="text-available-rides-count">
                  {filteredCars.length} ride{filteredCars.length !== 1 ? "s" : ""} available
                </h2>
                <p className="text-sm text-muted-foreground">Book your seat now</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredCars.map((car) => {
                const VehicleIcon = getVehicleIcon(car.vehicleType);
                return (
                  <Card key={car.id} className="overflow-hidden hover:border-primary/50 transition-colors" data-testid={`card-ride-${car.id}`}>
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-40 p-4 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center gap-2 border-b lg:border-b-0 lg:border-r border-border/50">
                        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                          <VehicleIcon className="h-7 w-7 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-xs">{vehicleTypeLabels[car.vehicleType]}</Badge>
                      </div>
                      
                      <CardContent className="flex-1 p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="font-medium">{car.origin}</span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-destructive" />
                                <span className="font-medium">{car.destination}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground truncate">{car.carModel}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground truncate">{car.driverName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{car.departureTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{car.seatsAvailable} seat{car.seatsAvailable !== 1 ? "s" : ""}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50 lg:pl-4">
                            <div className="flex-1 lg:text-right">
                              <div className="flex items-center gap-2 lg:justify-end">
                                <Badge variant="outline" className="text-xs">One Way</Badge>
                                <span className="font-bold text-xl text-primary">₹{car.fare}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 lg:justify-end">
                                <Badge variant="outline" className="text-xs bg-muted/50">Round</Badge>
                                <span className="font-medium text-muted-foreground">₹{car.fare + car.returnFare}</span>
                              </div>
                            </div>
                            <Button onClick={() => handleBookClick(car)} className="whitespace-nowrap" data-testid={`button-book-${car.id}`}>
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
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
