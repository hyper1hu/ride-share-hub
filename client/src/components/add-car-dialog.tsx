import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MapPin, Building2, Landmark, TreePine, Plane, Train, Ship } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCarSchema, vehicleTypes, type InsertCar } from "@shared/schema";

interface AddCarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const vehicleTypeLabels: Record<string, string> = {
  car: "Car",
  suv: "SUV",
  van: "Van",
  bus: "Bus",
  minibus: "Minibus",
  motorcycle: "Motorcycle",
  auto_rickshaw: "Auto Rickshaw",
  truck: "Truck",
};

const popularLocations = [
  // Kolkata & Howrah
  { name: "Howrah Station, Kolkata", icon: Train },
  { name: "Sealdah Station, Kolkata", icon: Train },
  { name: "Netaji Subhas Airport, Kolkata", icon: Plane },
  { name: "Victoria Memorial, Kolkata", icon: Landmark },
  { name: "Dakshineswar Temple, Kolkata", icon: Landmark },
  { name: "Kalighat Temple, Kolkata", icon: Landmark },
  { name: "Belur Math, Howrah", icon: Landmark },
  { name: "Science City, Kolkata", icon: Building2 },
  { name: "Eco Park, New Town", icon: TreePine },
  { name: "Park Street, Kolkata", icon: Building2 },
  { name: "Salt Lake City, Kolkata", icon: Building2 },
  { name: "New Town, Kolkata", icon: Building2 },
  { name: "Esplanade, Kolkata", icon: Building2 },
  { name: "Gariahat, Kolkata", icon: Building2 },
  { name: "Behala, Kolkata", icon: Building2 },
  { name: "Jadavpur, Kolkata", icon: Building2 },
  { name: "Dumdum, Kolkata", icon: Building2 },
  { name: "Barasat, North 24 Parganas", icon: Building2 },
  // North Bengal
  { name: "Darjeeling, West Bengal", icon: TreePine },
  { name: "Siliguri, West Bengal", icon: Building2 },
  { name: "New Jalpaiguri Station (NJP)", icon: Train },
  { name: "Bagdogra Airport, Siliguri", icon: Plane },
  { name: "Kalimpong, West Bengal", icon: TreePine },
  { name: "Kurseong, West Bengal", icon: TreePine },
  { name: "Mirik, West Bengal", icon: TreePine },
  { name: "Jalpaiguri, West Bengal", icon: Building2 },
  { name: "Cooch Behar, West Bengal", icon: Building2 },
  { name: "Alipurduar, West Bengal", icon: Building2 },
  { name: "Dooars, West Bengal", icon: TreePine },
  // South Bengal - Beaches
  { name: "Digha Beach, East Midnapore", icon: Ship },
  { name: "Mandarmani Beach, East Midnapore", icon: Ship },
  { name: "Tajpur Beach, East Midnapore", icon: Ship },
  { name: "Bakkhali Beach, South 24 Parganas", icon: Ship },
  { name: "Sundarbans, South 24 Parganas", icon: TreePine },
  { name: "Diamond Harbour, South 24 Parganas", icon: Ship },
  { name: "Haldia, East Midnapore", icon: Building2 },
  { name: "Kharagpur, West Midnapore", icon: Train },
  // Central Bengal
  { name: "Durgapur, West Bengal", icon: Building2 },
  { name: "Asansol, West Bengal", icon: Building2 },
  { name: "Bardhaman (Burdwan), West Bengal", icon: Building2 },
  { name: "Bankura, West Bengal", icon: Building2 },
  { name: "Bishnupur, Bankura", icon: Landmark },
  { name: "Purulia, West Bengal", icon: Building2 },
  { name: "Shantiniketan, Birbhum", icon: Landmark },
  { name: "Bolpur, Birbhum", icon: Train },
  { name: "Nabadwip, Nadia", icon: Landmark },
  { name: "Mayapur, Nadia", icon: Landmark },
  { name: "Krishnanagar, Nadia", icon: Building2 },
  // More Districts
  { name: "Malda, West Bengal", icon: Building2 },
  { name: "Murshidabad, West Bengal", icon: Landmark },
  { name: "Berhampore, Murshidabad", icon: Building2 },
  { name: "Raiganj, Uttar Dinajpur", icon: Building2 },
  // Major Bus Stands
  { name: "Esplanade Bus Stand, Kolkata", icon: Building2 },
  { name: "Babughat Bus Stand, Kolkata", icon: Building2 },
  // Other Indian Cities
  { name: "India Gate, Delhi", icon: Landmark },
  { name: "Gateway of India, Mumbai", icon: Landmark },
  { name: "Patna, Bihar", icon: Building2 },
  { name: "Ranchi, Jharkhand", icon: Building2 },
  { name: "Bhubaneswar, Odisha", icon: Building2 },
  { name: "Guwahati, Assam", icon: Building2 },
];

function LocationField({ value, onChange, label, placeholder, testId }: { 
  value: string; 
  onChange: (v: string) => void; 
  label: string;
  placeholder: string;
  testId: string;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = value 
    ? popularLocations.filter(l => l.name.toLowerCase().includes(value.toLowerCase()))
    : popularLocations;

  return (
    <FormItem className="relative">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input 
            placeholder={placeholder} 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10"
            data-testid={testId}
          />
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
              <div className="p-2 border-b">
                <p className="text-xs text-muted-foreground font-medium">Popular Landmarks</p>
              </div>
              <div className="p-1">
                {filtered.slice(0, 6).map((location, index) => {
                  const Icon = location.icon;
                  return (
                    <button
                      key={index}
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md hover-elevate"
                      onMouseDown={(e) => { e.preventDefault(); onChange(location.name); setShowSuggestions(false); }}
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
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export function AddCarDialog({ open, onOpenChange }: AddCarDialogProps) {
  const { toast } = useToast();

  const form = useForm<InsertCar>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: { vehicleType: "car", driverName: "", driverPhone: "", carModel: "", carNumber: "", origin: "", destination: "", fare: 0, returnFare: 0, departureTime: "", returnTime: "", seatsAvailable: 4 },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCar) => { const res = await apiRequest("POST", "/api/cars", data); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/cars"] }); toast({ title: "Vehicle listed successfully", description: "Your vehicle is now available for bookings." }); form.reset(); onOpenChange(false); },
    onError: () => { toast({ title: "Error", description: "Failed to add vehicle. Please try again.", variant: "destructive" }); },
  });

  const onSubmit = (data: InsertCar) => { mutation.mutate(data); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>List Your Vehicle</DialogTitle><DialogDescription>Add your vehicle details to start accepting ride bookings</DialogDescription></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="vehicleType" render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <FormControl>
                  <Select {...field} data-testid="select-vehicle-type">
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>{vehicleTypeLabels[type]}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} data-testid="input-driver-name" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="driverPhone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1234567890" {...field} data-testid="input-driver-phone" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="carModel" render={({ field }) => (<FormItem><FormLabel>Vehicle Model</FormLabel><FormControl><Input placeholder="Toyota Camry" {...field} data-testid="input-car-model" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="carNumber" render={({ field }) => (<FormItem><FormLabel>Vehicle Number</FormLabel><FormControl><Input placeholder="ABC 1234" {...field} data-testid="input-car-number" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="origin" render={({ field }) => (
                <LocationField 
                  value={field.value} 
                  onChange={field.onChange} 
                  label="From (Origin)" 
                  placeholder="Select landmark or type location"
                  testId="input-origin"
                />
              )} />
              <FormField control={form.control} name="destination" render={({ field }) => (
                <LocationField 
                  value={field.value} 
                  onChange={field.onChange} 
                  label="To (Destination)" 
                  placeholder="Select landmark or type location"
                  testId="input-destination"
                />
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="fare" render={({ field }) => (<FormItem><FormLabel>One Way Fare (₹)</FormLabel><FormControl><Input type="number" min={1} placeholder="500" {...field} onChange={(e) => field.onChange(Number(e.target.value))} data-testid="input-fare" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="returnFare" render={({ field }) => (<FormItem><FormLabel>Return Fare (₹)</FormLabel><FormControl><Input type="number" min={1} placeholder="450" {...field} onChange={(e) => field.onChange(Number(e.target.value))} data-testid="input-return-fare" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="departureTime" render={({ field }) => (<FormItem><FormLabel>Departure Time</FormLabel><FormControl><Input type="time" {...field} data-testid="input-departure-time" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="returnTime" render={({ field }) => (<FormItem><FormLabel>Return Time</FormLabel><FormControl><Input type="time" {...field} data-testid="input-return-time" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="seatsAvailable" render={({ field }) => (<FormItem><FormLabel>Available Seats</FormLabel><FormControl><Input type="number" min={1} max={60} placeholder="4" {...field} onChange={(e) => field.onChange(Number(e.target.value))} data-testid="input-seats" /></FormControl><FormMessage /></FormItem>)} />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)} data-testid="button-cancel-add-car">Cancel</Button>
              <Button type="submit" className="flex-1" disabled={mutation.isPending} data-testid="button-submit-car">{mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "List Vehicle"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
