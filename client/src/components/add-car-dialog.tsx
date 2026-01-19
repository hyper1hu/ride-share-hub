import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
              <FormField control={form.control} name="origin" render={({ field }) => (<FormItem><FormLabel>From (Origin)</FormLabel><FormControl><Input placeholder="City A" {...field} data-testid="input-origin" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="destination" render={({ field }) => (<FormItem><FormLabel>To (Destination)</FormLabel><FormControl><Input placeholder="City B" {...field} data-testid="input-destination" /></FormControl><FormMessage /></FormItem>)} />
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
