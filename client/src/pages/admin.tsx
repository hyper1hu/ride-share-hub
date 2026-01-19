import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ArrowLeft, Car, Users, Calendar, IndianRupee, MapPin, Clock, Phone, 
  Trash2, Loader2, Bus, Bike, Truck, ArrowRight, Shield, TrendingUp,
  LayoutDashboard, List, BookOpen, Settings, ChevronDown, ChevronUp,
  CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
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

type TabType = "dashboard" | "vehicles" | "bookings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [deleteCarId, setDeleteCarId] = useState<string | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: cars = [], isLoading: carsLoading } = useQuery<CarType[]>({ queryKey: ["/api/cars"] });
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });

  const deleteMutation = useMutation({
    mutationFn: async (carId: string) => { await apiRequest("DELETE", `/api/cars/${carId}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Vehicle removed", description: "Vehicle listing has been removed." });
      setDeleteCarId(null);
    },
    onError: () => { toast({ title: "Error", description: "Failed to remove vehicle.", variant: "destructive" }); },
  });

  const totalVehicles = cars.length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const cancelledBookings = bookings.filter(b => b.status === "cancelled").length;
  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + b.totalFare, 0);
  const totalPassengers = bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + b.seatsBooked, 0);
  const availableSeats = cars.reduce((sum, c) => sum + c.seatsAvailable, 0);

  const vehicleTypeStats = cars.reduce((acc, car) => {
    acc[car.vehicleType] = (acc[car.vehicleType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const routeStats = cars.reduce((acc, car) => {
    const route = `${car.origin} → ${car.destination}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topRoutes = Object.entries(routeStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const isLoading = carsLoading || bookingsLoading;

  const tabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "vehicles" as TabType, label: "Vehicles", icon: Car, count: totalVehicles },
    { id: "bookings" as TabType, label: "Bookings", icon: BookOpen, count: totalBookings },
  ];

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
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Admin Panel</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Manage your platform</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-muted/50 rounded-lg w-fit">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge variant={activeTab === tab.id ? "secondary" : "outline"} className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Car className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{totalVehicles}</p>
                          <p className="text-sm text-muted-foreground">Total Vehicles</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{confirmedBookings}</p>
                          <p className="text-sm text-muted-foreground">Confirmed Bookings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <IndianRupee className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{totalPassengers}</p>
                          <p className="text-sm text-muted-foreground">Total Passengers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Vehicle Types
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(vehicleTypeStats).length === 0 ? (
                        <p className="text-muted-foreground text-sm">No vehicles registered yet</p>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(vehicleTypeStats).map(([type, count]) => {
                            const VehicleIcon = getVehicleIcon(type);
                            const percentage = (count / totalVehicles) * 100;
                            return (
                              <div key={type} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <VehicleIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{vehicleTypeLabels[type] || type}</span>
                                    <span className="text-sm text-muted-foreground">{count}</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Popular Routes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {topRoutes.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No routes available yet</p>
                      ) : (
                        <div className="space-y-3">
                          {topRoutes.map(([route, count], index) => (
                            <div key={route} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{route}</p>
                              </div>
                              <Badge variant="secondary">{count} vehicle{count !== 1 ? "s" : ""}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Booking Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{totalBookings}</p>
                        <p className="text-xs text-muted-foreground">Total Bookings</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-500/10 text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{confirmedBookings}</p>
                        <p className="text-xs text-muted-foreground">Confirmed</p>
                      </div>
                      <div className="p-4 rounded-lg bg-red-500/10 text-center">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{cancelledBookings}</p>
                        <p className="text-xs text-muted-foreground">Cancelled</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10 text-center">
                        <p className="text-2xl font-bold text-primary">{availableSeats}</p>
                        <p className="text-xs text-muted-foreground">Available Seats</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "vehicles" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">All Vehicles</h2>
                    <p className="text-sm text-muted-foreground">Manage all registered vehicles</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">{totalVehicles} total</Badge>
                </div>

                {cars.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-16 text-center">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No vehicles registered</h3>
                      <p className="text-muted-foreground text-sm">Vehicles will appear here once drivers register them.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {cars.map((car) => {
                      const VehicleIcon = getVehicleIcon(car.vehicleType);
                      const carBookings = bookings.filter(b => b.carId === car.id && b.status !== "cancelled");
                      const bookedSeats = carBookings.reduce((sum, b) => sum + b.seatsBooked, 0);
                      return (
                        <Card key={car.id} data-testid={`admin-car-${car.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <VehicleIcon className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className="font-semibold">{car.carModel}</h3>
                                    <p className="text-sm text-muted-foreground">{car.carNumber}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{vehicleTypeLabels[car.vehicleType]}</Badge>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteCarId(car.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{car.origin} → {car.destination}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4" />
                                    <span>{car.driverName} ({car.driverPhone})</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Users className="h-4 w-4" />
                                    <span>{car.seatsAvailable - bookedSeats}/{car.seatsAvailable} seats</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>₹{car.fare}</span>
                                  </div>
                                  {carBookings.length > 0 && (
                                    <Badge variant="secondary">{carBookings.length} booking{carBookings.length !== 1 ? "s" : ""}</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">All Bookings</h2>
                    <p className="text-sm text-muted-foreground">View and manage all customer bookings</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">{totalBookings} total</Badge>
                </div>

                {bookings.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-16 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground text-sm">Bookings will appear here once customers make them.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => {
                      const car = cars.find(c => c.id === booking.carId);
                      const isExpanded = expandedBooking === booking.id;
                      return (
                        <Card key={booking.id} data-testid={`admin-booking-${booking.id}`}>
                          <CardContent className="p-4">
                            <div 
                              className="flex items-center gap-4 cursor-pointer"
                              onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                            >
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                booking.status === "confirmed" 
                                  ? "bg-green-500/10" 
                                  : booking.status === "cancelled" 
                                    ? "bg-red-500/10" 
                                    : "bg-amber-500/10"
                              }`}>
                                {booking.status === "confirmed" ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                ) : booking.status === "cancelled" ? (
                                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{booking.customerName}</h3>
                                  <Badge 
                                    variant={booking.status === "confirmed" ? "default" : booking.status === "cancelled" ? "destructive" : "secondary"}
                                    className="text-xs"
                                  >
                                    {booking.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {booking.seatsBooked} seat{booking.seatsBooked !== 1 ? "s" : ""} • {booking.tripType === "round_trip" ? "Round Trip" : "One Way"} • ₹{booking.totalFare}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">₹{booking.totalFare}</span>
                                {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground mb-1">Customer Details</p>
                                    <p className="font-medium">{booking.customerName}</p>
                                    <p className="text-muted-foreground">{booking.customerPhone}</p>
                                  </div>
                                  {car && (
                                    <div>
                                      <p className="text-muted-foreground mb-1">Vehicle Details</p>
                                      <p className="font-medium">{car.carModel} ({car.carNumber})</p>
                                      <p className="text-muted-foreground">{car.driverName} - {car.driverPhone}</p>
                                    </div>
                                  )}
                                </div>
                                {car && (
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{car.origin}</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{car.destination}</span>
                                    <span className="text-muted-foreground ml-auto">{car.departureTime}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={!!deleteCarId} onOpenChange={() => setDeleteCarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove vehicle?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this vehicle and all its bookings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCarId && deleteMutation.mutate(deleteCarId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
