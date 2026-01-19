import { Link } from "wouter";
import { Car, Users, ArrowRight, MapPin, Clock, Shield, Star, Banknote, Route, Phone, CheckCircle2, TrendingUp, Zap, Bus, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "400+", label: "Locations", icon: MapPin },
  { value: "8", label: "Vehicle Types", icon: Car },
  { value: "23", label: "Districts Covered", icon: Route },
  { value: "24/7", label: "Availability", icon: Clock },
];

const vehicleTypes = [
  { name: "Car", icon: Car },
  { name: "SUV", icon: Car },
  { name: "Bus", icon: Bus },
  { name: "Minibus", icon: Bus },
  { name: "Van", icon: Car },
  { name: "Motorcycle", icon: Bike },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Kolkata to Darjeeling",
    text: "Excellent service! Found a comfortable SUV for our family trip to Darjeeling. The driver was punctual and professional.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Howrah to Digha",
    text: "Booking was so easy. Transparent pricing with no hidden charges. Will definitely use again for our beach trips.",
    rating: 5,
  },
  {
    name: "Amit Das",
    location: "Siliguri to NJP",
    text: "As a driver, this platform helped me find regular passengers on my daily route. Great way to earn extra income.",
    rating: 5,
  },
];

const popularRoutes = [
  { from: "Kolkata", to: "Darjeeling", duration: "10-12 hrs" },
  { from: "Howrah", to: "Digha", duration: "4-5 hrs" },
  { from: "Kolkata", to: "Siliguri", duration: "8-10 hrs" },
  { from: "Sealdah", to: "Shantiniketan", duration: "3-4 hrs" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">RideShare</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/customer">
              <Button variant="ghost" size="sm" data-testid="nav-customer">Find Rides</Button>
            </Link>
            <Link href="/driver">
              <Button variant="ghost" size="sm" data-testid="nav-driver">For Drivers</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <Zap className="h-3 w-3" />
                West Bengal's Trusted Transport Network
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Your Journey,<br />
                <span className="text-primary">Simplified</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Connect with verified drivers across West Bengal. Book comfortable rides at transparent fares covering all 23 districts with 400+ pickup points.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/customer">
                  <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="link-customer">
                    <Users className="h-5 w-5" />
                    Find a Ride
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/driver">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" data-testid="link-driver">
                    <Car className="h-5 w-5" />
                    Register as Driver
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Verified Drivers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>No Hidden Charges</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <Card className="p-6 bg-card/80 backdrop-blur">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Popular Routes
                </h3>
                <div className="space-y-3">
                  {popularRoutes.map((route, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="font-medium">{route.from}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="font-medium">{route.to}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{route.duration}</Badge>
                    </div>
                  ))}
                </div>
                <Link href="/customer">
                  <Button variant="ghost" className="w-full mt-4 gap-2" data-testid="link-view-all-routes">
                    View All Routes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">How It Works</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Book Your Ride in 3 Simple Steps</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A seamless experience designed for convenience and reliability</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="relative overflow-visible">
            <div className="absolute -top-4 left-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
            </div>
            <CardContent className="pt-8 pb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Select Your Route</h3>
              <p className="text-muted-foreground text-sm">Search from 400+ locations across West Bengal including major stations, airports, and landmarks.</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-visible">
            <div className="absolute -top-4 left-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
            </div>
            <CardContent className="pt-8 pb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Choose Your Vehicle</h3>
              <p className="text-muted-foreground text-sm">Select from cars, SUVs, buses, minibuses, vans, motorcycles and more based on your needs.</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-visible">
            <div className="absolute -top-4 left-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
            </div>
            <CardContent className="pt-8 pb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Confirm & Travel</h3>
              <p className="text-muted-foreground text-sm">Book your seats instantly with upfront pricing. Get driver details and enjoy your journey.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Vehicle Options</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Multiple Vehicle Types Available</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From solo trips to group travel, we have the right vehicle for every journey</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {vehicleTypes.map((vehicle, i) => (
              <Card key={i} className="hover-elevate cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <vehicle.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{vehicle.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Built for West Bengal Travelers</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Features designed specifically for local travel needs</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Banknote className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground text-sm">All fares displayed upfront in Indian Rupees. No surge pricing or hidden charges.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Local Expertise</h3>
              <p className="text-muted-foreground text-sm">400+ landmark locations from Kolkata to Darjeeling, Digha to Siliguri.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Drivers</h3>
              <p className="text-muted-foreground text-sm">All drivers are verified with proper documentation and vehicle papers.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Contact</h3>
              <p className="text-muted-foreground text-sm">Direct communication with drivers. Get updates and coordinate pickup easily.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Real experiences from passengers and drivers across West Bengal</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Route className="h-3 w-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">For Passengers</h3>
                  <p className="text-muted-foreground mb-4">Discover available rides across West Bengal. Compare vehicles, timings, and fares to find the perfect match for your journey.</p>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Search by landmarks and locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Compare fares from multiple drivers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Book one-way or round trips</span>
                    </li>
                  </ul>
                  <Link href="/customer">
                    <Button className="gap-2" data-testid="link-customer-section">
                      Search Rides
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-500/50" />
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                  <Car className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">For Vehicle Owners</h3>
                  <p className="text-muted-foreground mb-4">Monetize your vehicle by offering rides on your regular routes. Set your own schedule, pricing, and grow your transport business.</p>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>List any vehicle type</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Set your own fares</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Manage bookings easily</span>
                    </li>
                  </ul>
                  <Link href="/driver">
                    <Button variant="outline" className="gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950" data-testid="link-driver-section">
                      Start Earning
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold text-lg">RideShare</div>
                <div className="text-sm text-muted-foreground">West Bengal's Transport Network</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Kolkata</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>Darjeeling</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>Siliguri</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>Digha</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Made with care for West Bengal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
