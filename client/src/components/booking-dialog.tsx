import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MapPin, ArrowRight, Car, Clock, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBookingSchema, type InsertBooking, type Car as CarType } from "@shared/schema";
import { useState } from "react";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: CarType | null;
}

const bookingFormSchema = insertBookingSchema.extend({ seatsBooked: z.number().min(1, "Select at least 1 seat") });

export function BookingDialog({ open, onOpenChange, car }: BookingDialogProps) {
  const { toast } = useToast();
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const form = useForm<InsertBooking>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { carId: car?.id || "", customerName: "", customerPhone: "", seatsBooked: 1, tripType: "one_way" },
  });

  const tripType = form.watch("tripType");
  const seatsBooked = form.watch("seatsBooked");

  const calculateFare = () => {
    if (!car) return 0;
    const baseFare = car.fare * seatsBooked;
    if (tripType === "round_trip") return baseFare + (car.returnFare * seatsBooked);
    return baseFare;
  };

  const mutation = useMutation({
    mutationFn: async (data: InsertBooking) => { const res = await apiRequest("POST", "/api/bookings", { ...data, carId: car?.id }); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/cars"] }); queryClient.invalidateQueries({ queryKey: ["/api/bookings"] }); setBookingSuccess(true); },
    onError: () => { toast({ title: "Booking failed", description: "Unable to complete booking. Please try again.", variant: "destructive" }); },
  });

  const onSubmit = (data: InsertBooking) => { mutation.mutate(data); };

  const handleClose = () => { setBookingSuccess(false); form.reset(); onOpenChange(false); };

  if (!car) return null;

  if (bookingSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="py-6 text-center">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-8 w-8 text-green-500" /></div>
            <h3 className="font-semibold text-xl mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground text-sm mb-4">Your ride has been booked successfully. The driver will contact you soon.</p>
            <div className="bg-muted/50 rounded-lg p-4 text-left mb-4">
              <div className="flex items-center gap-2 text-sm mb-2"><MapPin className="h-4 w-4 text-primary" /><span>{car.origin}</span><ArrowRight className="h-4 w-4 text-muted-foreground" /><span>{car.destination}</span></div>
              <div className="flex items-center gap-2 text-sm mb-2"><Car className="h-4 w-4 text-muted-foreground" /><span>{car.carModel} - {car.driverName}</span></div>
              <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /><span>Departure: {car.departureTime}</span></div>
            </div>
            <p className="font-semibold text-lg mb-4">Total: ₹{calculateFare()}</p>
            <Button onClick={handleClose} className="w-full" data-testid="button-close-booking-success">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Your Ride</DialogTitle>
          <DialogDescription><span className="flex items-center gap-2 mt-2"><MapPin className="h-4 w-4 text-primary" /><span>{car.origin}</span><ArrowRight className="h-4 w-4" /><span>{car.destination}</span></span></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="customerName" render={({ field }) => (<FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="Enter your name" {...field} data-testid="input-customer-name" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="customerPhone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1234567890" {...field} data-testid="input-customer-phone" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="seatsBooked" render={({ field }) => (<FormItem><FormLabel>Number of Seats</FormLabel><FormControl><Input type="number" min={1} max={car.seatsAvailable} {...field} onChange={(e) => field.onChange(Number(e.target.value))} data-testid="input-seats-booked" /></FormControl><FormMessage /><p className="text-xs text-muted-foreground">{car.seatsAvailable} seats available</p></FormItem>)} />
            <FormField control={form.control} name="tripType" render={({ field }) => (
              <FormItem><FormLabel>Trip Type</FormLabel><FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-4">
                  <div><RadioGroupItem value="one_way" id="one_way" className="peer sr-only" /><Label htmlFor="one_way" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer" data-testid="radio-one-way"><span className="text-sm font-medium">One Way</span><span className="text-lg font-bold">₹{car.fare * seatsBooked}</span></Label></div>
                  <div><RadioGroupItem value="round_trip" id="round_trip" className="peer sr-only" /><Label htmlFor="round_trip" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer" data-testid="radio-round-trip"><span className="text-sm font-medium">Round Trip</span><span className="text-lg font-bold">₹{(car.fare + car.returnFare) * seatsBooked}</span></Label></div>
                </RadioGroup>
              </FormControl><FormMessage /></FormItem>
            )} />
            <div className="bg-muted/50 rounded-lg p-4"><div className="flex justify-between items-center"><span className="text-muted-foreground">Total Fare</span><span className="text-2xl font-bold">₹{calculateFare()}</span></div></div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} data-testid="button-cancel-booking">Cancel</Button>
              <Button type="submit" className="flex-1" disabled={mutation.isPending} data-testid="button-confirm-booking">{mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
