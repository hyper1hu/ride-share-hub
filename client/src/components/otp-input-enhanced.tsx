import { useState, useEffect, useRef } from "react";
import { Timer, RefreshCw, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface OtpInputEnhancedProps {
  mobile: string;
  userType: "customer" | "driver";
  expiresAt?: Date;
  displayOtp?: string | null;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeNumber: () => void;
  isLoading?: boolean;
  error?: string | null;
  remainingAttempts?: number;
}

export function OtpInputEnhanced({
  mobile,
  userType,
  expiresAt,
  displayOtp,
  onVerify,
  onResend,
  onChangeNumber,
  isLoading = false,
  error = null,
  remainingAttempts,
}: OtpInputEnhancedProps) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Calculate time left based on expiresAt
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeLeft(diff);
      setIsExpired(diff === 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !isExpired) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    await onVerify(otp);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp("");
    setIsExpired(false);
    await onResend();
    setResendCooldown(60); // 60 seconds cooldown
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (timeLeft / 300) * 100;

  return (
    <Card className="border-2">
      <CardContent className="pt-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-xl">Verify Your Number</h3>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to <span className="font-semibold text-foreground">{mobile}</span>
          </p>
        </div>

        {/* Development Mode OTP Display */}
        {displayOtp && (
          <Alert className="bg-amber-500/10 border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-center">
              <p className="text-xs text-amber-600 mb-1">Development Mode - Your OTP:</p>
              <p className="font-mono text-2xl font-bold text-amber-700 tracking-wider">{displayOtp}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Timer Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Timer className={`h-4 w-4 ${isExpired ? "text-red-500" : timeLeft < 60 ? "text-amber-500" : "text-muted-foreground"}`} />
              <span className={`font-mono ${isExpired ? "text-red-500" : timeLeft < 60 ? "text-amber-500" : "text-muted-foreground"}`}>
                {isExpired ? "Expired" : formatTime(timeLeft)}
              </span>
            </div>
            {remainingAttempts !== undefined && (
              <span className="text-xs text-muted-foreground">
                {remainingAttempts} attempts left
              </span>
            )}
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-1 ${isExpired ? "bg-red-100" : timeLeft < 60 ? "bg-amber-100" : ""}`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="animate-shake">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OTP Input */}
        <div className="flex flex-col items-center space-y-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading || isExpired}
            autoFocus
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-14 text-lg font-bold border-2 rounded-lg transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {isExpired && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                OTP has expired. Please request a new code.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading || isExpired}
            className="w-full h-11 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onChangeNumber}
              disabled={isLoading}
              className="h-10"
            >
              Change Number
            </Button>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className="h-10"
            >
              {resendCooldown > 0 ? (
                `Resend (${resendCooldown}s)`
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend OTP
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
          <Shield className="h-3 w-3 inline-block mr-1" />
          Your information is secure and encrypted
        </div>
      </CardContent>
    </Card>
  );
}
