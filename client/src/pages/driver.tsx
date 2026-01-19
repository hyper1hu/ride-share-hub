import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Car, Plus, MapPin, Clock, Users, Phone, Trash2, Loader2, Bus, Bike, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddCarDialog } from "@/components/add-car-dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Car as CarType, Booking } from "@shared/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/"><Button variant="ghost" size="icon" data-testid="button-back-home"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" /><h1 className="font-semibold text-lg">Driver Dashboard</h1></div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold">Your Listings</h2><p className="text-muted-foreground text-sm">Manage your vehicle listings and view bookings</p></div>
          <Button onClick={() => setAddCarOpen(true)} className="gap-2" data-testid="button-add-car"><Plus className="h-4 w-4" />Add Vehicle</Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : cars.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"><Car className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="font-semibold text-lg mb-2">No vehicles listed yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">Start earning by listing your vehicle. Set your route, timings, and fare.</p>
              <Button onClick={() => setAddCarOpen(true)} className="gap-2" data-testid="button-add-car-empty"><Plus className="h-4 w-4" />Add Your First Vehicle</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {cars.map((car) => {
              const carBookings = getCarBookings(car.id);
              const totalSeatsBooked = carBookings.reduce((sum, b) => sum + b.seatsBooked, 0);
              const VehicleIcon = getVehicleIcon(car.vehicleType);
              return (
                <Card key={car.id} data-testid={`card-car-${car.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><VehicleIcon className="h-5 w-5 text-primary" /></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{car.carModel}</CardTitle>
                            <Badge variant="outline" className="text-xs">{vehicleTypeLabels[car.vehicleType] || "Vehicle"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{car.carNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">Available</Badge>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteCarId(car.id)} data-testid={`button-delete-car-${car.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /><span className="text-sm"><span className="font-medium">{car.origin}</span><span className="text-muted-foreground mx-2">to</span><span className="font-medium">{car.destination}</span></span></div>
                        <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Departs <span className="font-medium">{car.departureTime}</span>, Returns <span className="font-medium">{car.returnTime}</span></span></div>
                        <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{car.driverPhone}</span></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm"><span className="font-medium">{car.seatsAvailable - totalSeatsBooked}</span> of {car.seatsAvailable} seats available</span></div>
                        <div className="flex items-center gap-4 text-sm"><div><span className="text-muted-foreground">One Way:</span> <span className="font-semibold">${car.fare}</span></div><div><span className="text-muted-foreground">Round Trip:</span> <span className="font-semibold">${car.fare + car.returnFare}</span></div></div>
                        {carBookings.length > 0 && <div><Badge variant="secondary">{carBookings.length} booking{carBookings.length !== 1 ? "s" : ""}</Badge></div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <AddCarDialog open={addCarOpen} onOpenChange={setAddCarOpen} />

      <AlertDialog open={!!deleteCarId} onOpenChange={() => setDeleteCarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remove vehicle listing?</AlertDialogTitle><AlertDialogDescription>This will remove your vehicle listing and any pending bookings. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCarId && deleteMutation.mutate(deleteCarId)} className="bg-destructive text-destructive-foreground" data-testid="button-confirm-delete">{deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
