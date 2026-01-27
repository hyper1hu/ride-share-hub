import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Car, Edit } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DriverVehicle } from "@shared/schema";

interface ManageVehiclesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageVehiclesDialog({ open, onOpenChange }: ManageVehiclesDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const { toast } = useToast();

  const { data: vehicles = [], isLoading } = useQuery<DriverVehicle[]>({
    queryKey: ["/api/driver/vehicles"],
    enabled: open,
  });

  const { data: vehicleTypes = [] } = useQuery<{ value: string; label: string }[]>({
    queryKey: ["/api/vehicle-types"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/driver/vehicles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver/vehicles"] });
      toast({ title: "Vehicle added", description: "Your vehicle has been added successfully." });
      setIsAdding(false);
      setVehicleType("");
      setVehicleModel("");
      setVehicleNumber("");
      setSeatingCapacity("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add vehicle",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/driver/vehicles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/driver/vehicles"] });
      toast({ title: "Vehicle removed", description: "Your vehicle has been removed successfully." });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove vehicle",
        variant: "destructive",
      });
    },
  });

  const handleAddVehicle = () => {
    if (!vehicleType || !vehicleModel || !vehicleNumber || !seatingCapacity) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addMutation.mutate({
      vehicleType,
      vehicleModel,
      vehicleNumber: vehicleNumber.toUpperCase(),
      seatingCapacity: parseInt(seatingCapacity),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Manage Your Vehicles
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Vehicle Section */}
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add New Vehicle
            </Button>
          ) : (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Add New Vehicle</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Model</Label>
                    <Input
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="e.g., Maruti Swift"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Number</Label>
                    <Input
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="e.g., WB 01 AB 1234"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Seating Capacity</Label>
                    <Input
                      type="number"
                      value={seatingCapacity}
                      onChange={(e) => setSeatingCapacity(e.target.value)}
                      placeholder="e.g., 4"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddVehicle}
                  disabled={addMutation.isPending}
                  className="w-full"
                >
                  {addMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Vehicle"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Existing Vehicles List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Your Vehicles ({vehicles.length})
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : vehicles.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Car className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No vehicles added yet. Add your first vehicle to start listing rides.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{vehicle.vehicleModel}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {vehicleTypes.find((t) => t.value === vehicle.vehicleType)?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {vehicle.vehicleNumber}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Seats: {vehicle.seatingCapacity}</span>
                            <Badge
                              variant={vehicle.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {vehicle.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(vehicle.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
