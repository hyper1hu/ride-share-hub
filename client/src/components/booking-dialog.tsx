import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MapPin, ArrowRight, Car, Clock, CheckCircle2, Users, IndianRupee, LogIn, User, Phone } from "lucide-react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { insertBookingSchema, type InsertBooking, type Car as CarType } from "@shared/schema";
import { useState, useEffect } from "react";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: CarType | null;
}

const bookingFormSchema = insertBookingSchema.extend({ seatsBooked: z.number().min(1, "Select at least 1 seat") });

const loginSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
});

const registerSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(18, "Must be at least 18 years old").max(100, "Invalid age"),
});

export function BookingDialog({ open, onOpenChange, car }: BookingDialogProps) {
  const { toast } = useToast();
  const { customer, isCustomerLoggedIn, loginCustomer, registerCustomer } = useAuth();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { mobile: "", name: "", age: 25 },
  });

  const form = useForm<InsertBooking>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { carId: car?.id || "", customerName: "", customerPhone: "", seatsBooked: 1, tripType: "one_way" },
  });

  useEffect(() => {
    if (customer && open) {
      form.setValue("customerName", customer.name);
      form.setValue("customerPhone", customer.mobile);
    }
    if (car && open) {
      form.setValue("carId", car.id);
    }
  }, [customer, car, open, form]);

  const tripType = form.watch("tripType");
  const seatsBooked = form.watch("seatsBooked");

  const calculateFare = () => {
    if (!car) return 0;
    const baseFare = car.fare * seatsBooked;
    if (tripType === "round_trip") return baseFare + (car.returnFare * seatsBooked);
    return baseFare;
  };

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsAuthLoading(true);
    const result = await loginCustomer(data.mobile);
    setIsAuthLoading(false);
    
    if (result.success) {
      toast({ title: "Welcome back!", description: "You can now book your ride." });
    } else if (result.needsRegistration) {
      registerForm.setValue("mobile", data.mobile);
      setAuthMode("register");
      toast({ title: "New user", description: "Please complete your registration." });
    } else {
      toast({ title: "Login failed", description: result.error, variant: "destructive" });
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    setIsAuthLoading(true);
    const result = await registerCustomer(data);
    setIsAuthLoading(false);
    
    if (result.success) {
      toast({ title: "Welcome to RideShare!", description: "You can now book your ride." });
    } else {
      toast({ title: "Registration failed", description: result.error, variant: "destructive" });
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: InsertBooking) => { 
      const bookingData = {
        ...data,
        carId: car?.id,
        customerId: customer?.id,
        customerName: customer?.name || data.customerName,
        customerPhone: customer?.mobile || data.customerPhone,
      };
      const res = await apiRequest("POST", "/api/bookings", bookingData); 
      return res.json(); 
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] }); 
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] }); 
      setBookingSuccess(true); 
    },
    onError: () => { 
      toast({ title: "Booking failed", description: "Unable to complete booking. Please try again.", variant: "destructive" }); 
    },
  });

  const onSubmit = (data: InsertBooking) => { mutation.mutate(data); };

  const handleClose = () => { 
    setBookingSuccess(false); 
    setAuthMode("login");
    form.reset(); 
    loginForm.reset();
    registerForm.reset();
    onOpenChange(false); 
  };

  if (!car) return null;

  if (bookingSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="py-6 text-center">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="font-bold text-2xl mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground text-sm mb-6">Your ride has been booked successfully. The driver will contact you soon.</p>
            
            <div className="bg-muted/30 rounded-xl p-4 text-left mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{car.origin}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{car.destination}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Car className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm">{car.carModel} - {car.driverName}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm">Departure: {car.departureTime}</span>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="font-bold text-3xl text-primary">₹{calculateFare()}</p>
            </div>
            
            <Button onClick={handleClose} className="w-full" size="lg" data-testid="button-close-booking-success">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isCustomerLoggedIn) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              {authMode === "login" ? "Login to Book" : "Create Account"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 mt-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-sm">{car.origin}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-sm">{car.destination}</span>
                </div>
                <p className="text-sm">
                  {authMode === "login" 
                    ? "Enter your mobile number to login and book this ride"
                    : "Complete your profile to start booking rides"
                  }
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          {authMode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    {...loginForm.register("mobile")}
                    placeholder="Enter your mobile number" 
                    className="pl-10"
                    data-testid="input-booking-login-mobile"
                  />
                </div>
                {loginForm.formState.errors.mobile && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.mobile.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isAuthLoading} className="w-full" data-testid="button-booking-login">
                  {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setAuthMode("register")}
                >
                  New user? Create account
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    {...registerForm.register("mobile")}
                    placeholder="Enter your mobile number" 
                    className="pl-10"
                    data-testid="input-booking-register-mobile"
                  />
                </div>
                {registerForm.formState.errors.mobile && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.mobile.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    {...registerForm.register("name")}
                    placeholder="Enter your full name" 
                    className="pl-10"
                    data-testid="input-booking-register-name"
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  {...registerForm.register("age")}
                  type="number"
                  placeholder="Enter your age" 
                  data-testid="input-booking-register-age"
                />
                {registerForm.formState.errors.age && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.age.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isAuthLoading} className="w-full" data-testid="button-booking-register">
                  {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setAuthMode("login")}
                >
                  Already have an account? Login
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Book Your Ride</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 mt-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium">{car.origin}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{car.destination}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Logged in as {customer?.name}
                </span>
                <Badge variant="secondary" className="ml-auto text-xs">{customer?.mobile}</Badge>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField 
              control={form.control} 
              name="seatsBooked" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Seats</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={car.seatsAvailable} 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))} 
                      data-testid="input-seats-booked" 
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{car.seatsAvailable} seats available</span>
                  </div>
                </FormItem>
              )} 
            />
            
            <FormField 
              control={form.control} 
              name="tripType" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Type</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-4">
                      <div>
                        <RadioGroupItem value="one_way" id="one_way" className="peer sr-only" />
                        <Label 
                          htmlFor="one_way" 
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all" 
                          data-testid="radio-one-way"
                        >
                          <span className="text-sm font-medium mb-2">One Way</span>
                          <span className="text-2xl font-bold text-primary">₹{car.fare * seatsBooked}</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="round_trip" id="round_trip" className="peer sr-only" />
                        <Label 
                          htmlFor="round_trip" 
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all" 
                          data-testid="radio-round-trip"
                        >
                          <span className="text-sm font-medium mb-2">Round Trip</span>
                          <span className="text-2xl font-bold text-primary">₹{(car.fare + car.returnFare) * seatsBooked}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="font-medium">Total Fare</span>
                </div>
                <span className="text-3xl font-bold text-primary">₹{calculateFare()}</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} data-testid="button-cancel-booking">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={mutation.isPending} data-testid="button-confirm-booking">
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
