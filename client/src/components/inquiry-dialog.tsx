import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Car } from "@shared/schema";

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car?: Car | null;
}

export function InquiryDialog({ open, onOpenChange, car }: InquiryDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const inquiryMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/inquiries"] });
      toast({
        title: "Inquiry sent",
        description: "The driver will respond to your inquiry soon.",
      });
      onOpenChange(false);
      setName("");
      setPhone("");
      setPassengers("");
      setTravelDate("");
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send inquiry",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      toast({
        title: "Missing information",
        description: "Please provide your name and phone number",
        variant: "destructive",
      });
      return;
    }

    inquiryMutation.mutate({
      customerName: name,
      customerPhone: phone,
      origin: car?.origin || "",
      destination: car?.destination || "",
      vehicleType: car?.vehicleType,
      driverId: car?.driverId,
      vehicleId: car?.id,
      passengers: passengers ? parseInt(passengers) : undefined,
      travelDate: travelDate || undefined,
      message: message || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Inquiry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {car && (
            <div className="p-3 rounded-lg bg-muted text-sm">
              <p className="font-medium mb-1">{car.carModel}</p>
              <p className="text-muted-foreground">
                {car.origin} → {car.destination}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <Input
                id="passengers"
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                placeholder="Number"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelDate">Travel Date</Label>
              <Input
                id="travelDate"
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any specific requirements or questions..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={inquiryMutation.isPending}
            className="w-full gap-2"
          >
            {inquiryMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Inquiry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
