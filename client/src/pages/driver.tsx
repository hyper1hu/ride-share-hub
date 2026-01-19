import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Car, Plus, MapPin, Clock, Users, Phone, Trash2, Loader2, Bus, Bike, Truck, ArrowRight, IndianRupee, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddCarDialog } from "@/components/add-car-dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Car as CarType, Booking } from "@shared/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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

export default function Driver() {
  const [addCarOpen, setAddCarOpen] = useState(false);
  const [deleteCarId, setDeleteCarId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: cars = [], isLoading } = useQuery<CarType[]>({ queryKey: ["/api/cars"] });
  const { data: bookings = [] } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });

  const deleteMutation = useMutation({
    mutationFn: async (carId: string) => { await apiRequest("DELETE", `/api/cars/${carId}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Vehicle removed", description: "Your vehicle listing has been removed successfully." });
      setDeleteCarId(null);
    },
    onError: () => { toast({ title: "Error", description: "Failed to remove vehicle listing. Please try again.", variant: "destructive" }); },
  });

  const getCarBookings = (carId: string) => bookings.filter((b) => b.carId === carId && b.status !== "cancelled");

  const totalBookings = bookings.filter(b => b.status !== "cancelled").length;
  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + b.totalFare, 0);

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
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Driver Dashboard</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Manage your rides</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{cars.length}</p>
                  <p className="text-xs text-muted-foreground">Vehicles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalBookings}</p>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{totalRevenue}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookings.reduce((sum, b) => sum + b.seatsBooked, 0)}</p>
                  <p className="text-xs text-muted-foreground">Passengers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your Vehicles</h2>
            <p className="text-sm text-muted-foreground">Manage your vehicle listings</p>
          </div>
          <Button onClick={() => setAddCarOpen(true)} className="gap-2" data-testid="button-add-car">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Vehicle</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cars.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Car className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">No vehicles listed yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                Start earning by listing your vehicle. Set your route, timings, and fare to begin accepting bookings from passengers.
              </p>
              <Button onClick={() => setAddCarOpen(true)} size="lg" className="gap-2" data-testid="button-add-car-empty">
                <Plus className="h-5 w-5" />
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cars.map((car) => {
              const carBookings = getCarBookings(car.id);
              const totalSeatsBooked = carBookings.reduce((sum, b) => sum + b.seatsBooked, 0);
              const availableSeats = car.seatsAvailable - totalSeatsBooked;
              const VehicleIcon = getVehicleIcon(car.vehicleType);
              return (
                <Card key={car.id} className="overflow-hidden" data-testid={`card-car-${car.id}`}>
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-48 p-4 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center gap-3 border-b lg:border-b-0 lg:border-r border-border/50">
                      <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <VehicleIcon className="h-8 w-8 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">{vehicleTypeLabels[car.vehicleType]}</Badge>
                    </div>
                    <CardContent className="flex-1 p-4 lg:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{car.carModel}</h3>
                          <p className="text-sm text-muted-foreground">{car.carNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={availableSeats > 0 ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"}>
                            {availableSeats > 0 ? "Available" : "Fully Booked"}
                          </Badge>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleteCarId(car.id)} data-testid={`button-delete-car-${car.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{car.origin}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-sm">{car.destination}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Departs</p>
                            <p className="font-medium">{car.departureTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Returns</p>
                            <p className="font-medium">{car.returnTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Seats</p>
                            <p className="font-medium">{availableSeats}/{car.seatsAvailable}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Fare</p>
                            <p className="font-medium">₹{car.fare}</p>
                          </div>
                        </div>
                      </div>
                      
                      {carBookings.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                              <Calendar className="h-3 w-3" />
                              {carBookings.length} booking{carBookings.length !== 1 ? "s" : ""}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({totalSeatsBooked} seat{totalSeatsBooked !== 1 ? "s" : ""} booked)
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <AddCarDialog open={addCarOpen} onOpenChange={setAddCarOpen} />

      <AlertDialog open={!!deleteCarId} onOpenChange={() => setDeleteCarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove vehicle listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your vehicle listing and any pending bookings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCarId && deleteMutation.mutate(deleteCarId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-delete">
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
