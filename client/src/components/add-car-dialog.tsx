import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Search, Navigation } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCarSchema, vehicleTypes, type InsertCar } from "@shared/schema";
import { cn } from "@/lib/utils";
import { westBengalLocations } from "@/lib/locations";

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

function LocationField({ value, onChange, label, placeholder, testId, variant = "default" }: { 
  value: string; 
  onChange: (v: string) => void; 
  label: string;
  placeholder: string;
  testId: string;
  variant?: "pickup" | "drop" | "default";
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = value 
    ? westBengalLocations.filter(l => 
        l.name.toLowerCase().includes(value.toLowerCase()) ||
        l.category.toLowerCase().includes(value.toLowerCase()) ||
        l.district.toLowerCase().includes(value.toLowerCase())
      )
    : westBengalLocations;

  const getDotColor = () => {
    if (variant === "pickup") return "bg-green-500";
    if (variant === "drop") return "bg-red-500";
    return "bg-primary";
  };

  return (
    <FormItem className="relative">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-10", getDotColor())} />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input 
            placeholder={placeholder} 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-9 pr-10 h-11"
            data-testid={testId}
          />
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-xl shadow-xl z-50 max-h-56 overflow-hidden">
              <div className="p-2 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Navigation className="h-3 w-3" />
                    {value ? `Results (${filtered.length})` : "All Locations"}
                  </div>
                </div>
              </div>
              <div className="p-1 overflow-y-auto max-h-44">
                {filtered.slice(0, 10).map((location, index) => {
                  const Icon = location.icon;
                  return (
                    <button
                      key={index}
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left rounded-lg hover:bg-accent/50 transition-colors"
                      onMouseDown={(e) => { e.preventDefault(); onChange(location.name); setShowSuggestions(false); }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{location.name.split(',')[0]}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{location.district} - {location.category}</p>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                    No locations found
                  </div>
                )}
                {filtered.length > 10 && (
                  <div className="px-3 py-2 text-center text-xs text-muted-foreground border-t">
                    +{filtered.length - 10} more results
                  </div>
                )}
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
              <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="Your name" {...field} data-testid="input-driver-name" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="driverPhone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+91 9876543210" {...field} data-testid="input-driver-phone" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="carModel" render={({ field }) => (<FormItem><FormLabel>Vehicle Model</FormLabel><FormControl><Input placeholder="Tata Indica, Maruti Swift" {...field} data-testid="input-car-model" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="carNumber" render={({ field }) => (<FormItem><FormLabel>Vehicle Number</FormLabel><FormControl><Input placeholder="WB 06 1234" {...field} data-testid="input-car-number" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="origin" render={({ field }) => (
                <LocationField 
                  value={field.value} 
                  onChange={field.onChange} 
                  label="From (Origin)" 
                  placeholder="Search pickup location"
                  testId="input-origin"
                  variant="pickup"
                />
              )} />
              <FormField control={form.control} name="destination" render={({ field }) => (
                <LocationField 
                  value={field.value} 
                  onChange={field.onChange} 
                  label="To (Destination)" 
                  placeholder="Search drop location"
                  testId="input-destination"
                  variant="drop"
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
