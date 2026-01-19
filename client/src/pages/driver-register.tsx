import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Phone, User, Calendar, CreditCard, FileText, Car, Shield, CheckCircle, Clock, XCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const loginSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
});

const registerSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(18, "Must be at least 18 years old").max(70, "Maximum age is 70"),
  aadhaarNumber: z.string().length(12, "Aadhaar number must be exactly 12 digits").regex(/^\d+$/, "Only digits allowed"),
  licenseNumber: z.string().min(5, "License number is required"),
});

export default function DriverRegister() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { driver, isDriverLoggedIn, loginDriver, registerDriver, logout } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { mobile: "", name: "", age: 25, aadhaarNumber: "", licenseNumber: "" },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const result = await loginDriver(data.mobile);
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: "Welcome back!", description: "You are now logged in." });
    } else if (result.needsRegistration) {
      registerForm.setValue("mobile", data.mobile);
      setMode("register");
      toast({ title: "New driver", description: "Please complete your registration." });
    } else {
      toast({ title: "Login failed", description: result.error, variant: "destructive" });
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const result = await registerDriver(data);
    setIsLoading(false);
    
    if (result.success) {
      toast({ 
        title: "Registration submitted!", 
        description: "Please wait for admin verification before listing vehicles." 
      });
    } else {
      toast({ title: "Registration failed", description: result.error, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged out", description: "You have been logged out." });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Pending Verification</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return null;
    }
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
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Driver Portal</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Register and manage your rides</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        {isDriverLoggedIn && driver ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">{driver.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2 mt-2">
                  <Phone className="h-4 w-4" />
                  {driver.mobile}
                </CardDescription>
                <div className="mt-3">
                  {getStatusBadge(driver.verificationStatus)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {driver.verificationStatus === "pending" && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
                    <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-amber-700 dark:text-amber-400">Verification Pending</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your documents are being reviewed by our admin team. You'll be able to list vehicles once approved.
                    </p>
                  </div>
                )}
                
                {driver.verificationStatus === "rejected" && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-red-700 dark:text-red-400">Verification Rejected</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {driver.rejectionReason || "Your application was rejected. Please contact support for more information."}
                    </p>
                  </div>
                )}

                {driver.verificationStatus === "approved" && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-700 dark:text-green-400">Verified Driver</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You can now list your vehicles and accept ride requests.
                    </p>
                    <Button className="mt-4" onClick={() => navigate("/driver")} data-testid="button-go-to-driver">
                      <Car className="mr-2 h-4 w-4" />
                      Go to Driver Dashboard
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Aadhaar</p>
                    <p className="font-mono text-sm">{driver.aadhaarNumber}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">License</p>
                    <p className="font-mono text-sm">{driver.licenseNumber}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleLogout} data-testid="button-logout">
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : mode === "login" ? (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Driver Login</CardTitle>
              <CardDescription>Enter your mobile number to login</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Enter your mobile number" className="pl-10" data-testid="input-driver-login-mobile" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-driver-login">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setMode("register")} data-testid="button-switch-register">
                    New driver? Register here
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Driver Registration</CardTitle>
              <CardDescription>Provide your details and documents for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Enter your mobile number" className="pl-10" data-testid="input-driver-mobile" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Enter your full name" className="pl-10" data-testid="input-driver-name" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} type="number" placeholder="Enter your age" className="pl-10" data-testid="input-driver-age" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="aadhaarNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="12-digit Aadhaar number" className="pl-10" maxLength={12} data-testid="input-driver-aadhaar" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">Your Aadhaar is stored securely and only visible to admins</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driving License Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Enter your license number" className="pl-10" data-testid="input-driver-license" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 inline-block mr-2" />
                    Your documents will be verified by our admin team. You'll receive approval before you can start listing vehicles.
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-driver-register">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit for Verification
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setMode("login")} data-testid="button-switch-login">
                    Already registered? Login
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
