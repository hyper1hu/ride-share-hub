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
  { name: "Times Square, New York", icon: Building2 },
  { name: "Central Park, New York", icon: TreePine },
  { name: "Empire State Building, NYC", icon: Building2 },
  { name: "Statue of Liberty, NYC", icon: Landmark },
  { name: "Hollywood Sign, Los Angeles", icon: Landmark },
  { name: "Golden Gate Bridge, San Francisco", icon: Landmark },
  { name: "Space Needle, Seattle", icon: Building2 },
  { name: "Willis Tower, Chicago", icon: Building2 },
  { name: "Miami Beach, Florida", icon: Ship },
  { name: "Las Vegas Strip, Nevada", icon: Building2 },
  { name: "Grand Canyon, Arizona", icon: TreePine },
  { name: "JFK Airport, New York", icon: Plane },
  { name: "LAX Airport, Los Angeles", icon: Plane },
  { name: "Penn Station, New York", icon: Train },
  { name: "Boston Common, Boston", icon: TreePine },
  { name: "Lincoln Memorial, Washington DC", icon: Landmark },
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
              <FormField control={form.control} name="fare" render={({ field }) => (<FormItem><FormLabel>One Way Fare ($)</FormLabel><FormControl><Input type="number" min={1} placeholder="50" {...field} onChange={(e) => field.onChange(Number(e.target.value))} data-testid="input-fare" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="returnFare" render={({ field }) => (<FormItem><FormLabel>Return Fare ($)</FormLabel><FormControl><Input type="number" min={1} placeholder="45" {...field} onChange={(e) => field.onChange(Number(e.target.value))} data-testid="input-return-fare" /></FormControl><FormMessage /></FormItem>)} />
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
