import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Phone, User, Calendar, LogIn, UserPlus, KeyRound } from "lucide-react";
import { OtpInputEnhanced } from "@/components/otp-input-enhanced";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const loginSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
});

const registerSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(18, "Must be at least 18 years old").max(100, "Invalid age"),
});

interface CustomerAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CustomerAuthDialog({ open, onOpenChange, onSuccess }: CustomerAuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register" | "otp">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [displayOtp, setDisplayOtp] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<Date | undefined>();
  const [otpError, setOtpError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | undefined>();
  const [pendingAction, setPendingAction] = useState<"login" | "register">("login");
  const { toast } = useToast();
  const { loginCustomer, registerCustomer, sendOtp, verifyOtp } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { mobile: "", name: "", age: 25 },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setOtpError(null);
    
    // Send OTP first
    const otpResult = await sendOtp(data.mobile, "customer");
    setIsLoading(false);
    
    if (otpResult.success) {
      setMobileNumber(data.mobile);
      setPendingAction("login");
      if (otpResult.otp) {
        setDisplayOtp(otpResult.otp);
      }
      if (otpResult.expiresAt) {
        setOtpExpiresAt(new Date(otpResult.expiresAt));
      }
      setMode("otp");
      toast({ title: "OTP Sent", description: "Please check your mobile for the 6-digit code." });
    } else {
      toast({ title: "Failed to send OTP", description: otpResult.error, variant: "destructive" });
    }
  };

  const handleVerifyOtpForLogin = async (otpValue: string) => {
    setIsLoading(true);
    setOtpError(null);
    
    const verifyResult = await verifyOtp(mobileNumber, otpValue, "customer");
    
    if (verifyResult.success) {
      const result = await loginCustomer(mobileNumber);
      setIsLoading(false);
      
      if (result.success) {
        toast({ title: "Welcome back!", description: "You are now logged in." });
        onOpenChange(false);
        onSuccess?.();
      } else if (result.needsRegistration) {
        registerForm.setValue("mobile", mobileNumber);
        setMode("register");
        toast({ 
          title: "New user", 
          description: "Please complete your registration.",
        });
      } else {
        setOtpError(result.error || "Login failed");
        toast({ title: "Login failed", description: result.error, variant: "destructive" });
      }
    } else {
      setIsLoading(false);
      setOtpError(verifyResult.error || "Invalid OTP");
      if (verifyResult.remainingAttempts !== undefined) {
        setRemainingAttempts(verifyResult.remainingAttempts);
      }
    }
  };

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setOtpError(null);
    
    // Send OTP first
    const otpResult = await sendOtp(data.mobile, "customer");
    setIsLoading(false);
    
    if (otpResult.success) {
      setMobileNumber(data.mobile);
      setPendingAction("register");
      registerForm.setValue("mobile", data.mobile);
      if (otpResult.otp) {
        setDisplayOtp(otpResult.otp);
      }
      if (otpResult.expiresAt) {
        setOtpExpiresAt(new Date(otpResult.expiresAt));
      }
      setMode("otp");
      toast({ title: "OTP Sent", description: "Please verify your mobile number." });
    } else {
      toast({ title: "Failed to send OTP", description: otpResult.error, variant: "destructive" });
    }
  };

  const handleVerifyOtpForRegister = async (otpValue: string) => {
    setIsLoading(true);
    setOtpError(null);
    
    const verifyResult = await verifyOtp(mobileNumber, otpValue, "customer");
    
    if (verifyResult.success) {
      const registerData = registerForm.getValues();
      const result = await registerCustomer(registerData);
      setIsLoading(false);
      
      if (result.success) {
        toast({ title: "Registration successful!", description: "Welcome to RideShare!" });
        onOpenChange(false);
        onSuccess?.();
      } else {
        setOtpError(result.error || "Registration failed");
        toast({ title: "Registration failed", description: result.error, variant: "destructive" });
      }
    } else {
      setIsLoading(false);
      setOtpError(verifyResult.error || "Invalid OTP");
      if (verifyResult.remainingAttempts !== undefined) {
        setRemainingAttempts(verifyResult.remainingAttempts);
      }
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtpError(null);
    const result = await sendOtp(mobileNumber, "customer");
    setIsLoading(false);
    
    if (result.success) {
      if (result.otp) {
        setDisplayOtp(result.otp);
      }
      if (result.expiresAt) {
        setOtpExpiresAt(new Date(result.expiresAt));
      }
      setRemainingAttempts(undefined);
      toast({ title: "OTP Resent", description: "A new code has been sent to your mobile." });
    } else {
      setOtpError(result.error || "Failed to resend OTP");
      toast({ title: "Failed to resend OTP", description: result.error, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "otp" ? (
              <>
                <KeyRound className="h-5 w-5 text-primary" />
                Verify OTP
              </>
            ) : mode === "login" ? (
              <>
                <LogIn className="h-5 w-5 text-primary" />
                Login to Book
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-primary" />
                Create Account
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "otp"
              ? "Enter the verification code sent to your mobile"
              : mode === "login" 
                ? "Enter your mobile number to login or create an account"
                : "Complete your profile to start booking rides"
            }
          </DialogDescription>
        </DialogHeader>

        {mode === "otp" ? (
          <div className="animate-slide-up">
            <OtpInputEnhanced
              mobile={mobileNumber}
              userType="customer"
              expiresAt={otpExpiresAt}
              displayOtp={displayOtp}
              onVerify={pendingAction === "login" ? handleVerifyOtpForLogin : handleVerifyOtpForRegister}
              onResend={handleResendOtp}
              onChangeNumber={() => setMode(pendingAction === "login" ? "login" : "register")}
              isLoading={isLoading}
              error={otpError}
              remainingAttempts={remainingAttempts}
            />
          </div>
        ) : mode === "login" ? (
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
                        <Input 
                          {...field} 
                          placeholder="Enter your mobile number" 
                          className="pl-10"
                          data-testid="input-login-mobile"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-login-submit">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setMode("register")}
                  data-testid="button-switch-to-register"
                >
                  New user? Create account
                </Button>
              </div>
            </form>
          </Form>
        ) : (
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
                        <Input 
                          {...field} 
                          placeholder="Enter your mobile number" 
                          className="pl-10"
                          data-testid="input-register-mobile"
                        />
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
                        <Input 
                          {...field} 
                          placeholder="Enter your full name" 
                          className="pl-10"
                          data-testid="input-register-name"
                        />
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
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="Enter your age" 
                          className="pl-10"
                          data-testid="input-register-age"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-register-submit">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setMode("login")}
                  data-testid="button-switch-to-login"
                >
                  Already have an account? Login
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
