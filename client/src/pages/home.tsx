import { Link } from "wouter";
import { Car, Users, ArrowRight, MapPin, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">RideShare</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Car className="h-4 w-4" />
              <span className="text-sm font-medium">Reliable Car Hire Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Travel Between Cities <span className="text-primary">With Ease</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book rides from point A to B, and enjoy the convenience of return trips. Drivers list their routes, customers book their seats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/customer">
                <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="link-customer">
                  <Users className="h-5 w-5" />
                  Book a Ride
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/driver">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" data-testid="link-driver">
                  <Car className="h-5 w-5" />
                  List Your Car
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Simple process for both drivers and customers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Choose Your Route</h3>
              <p className="text-muted-foreground text-sm">Browse available routes from your origin to destination.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pick Departure Time</h3>
              <p className="text-muted-foreground text-sm">Select from available departure and return times.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe & Reliable</h3>
              <p className="text-muted-foreground text-sm">Travel with verified drivers. No hidden charges.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 border-t">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">For Customers</h3>
                  <p className="text-muted-foreground mb-4">Find available rides, compare fares, and book your seats instantly.</p>
                  <Link href="/customer">
                    <Button variant="outline" size="sm" className="gap-2" data-testid="link-customer-section">
                      Browse Rides
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Car className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">For Drivers</h3>
                  <p className="text-muted-foreground mb-4">List your car, set your routes and fares. Earn by providing transport.</p>
                  <Link href="/driver">
                    <Button variant="outline" size="sm" className="gap-2" data-testid="link-driver-section">
                      List Your Car
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
