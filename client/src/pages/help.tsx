import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, HelpCircle, MessageSquare, Phone, Mail, Send, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SupportTicket } from "@shared/schema";

const faqs = [
  {
    question: "How do I book a ride?",
    answer: "To book a ride, go to the Customer portal, search for available rides by entering your origin and destination, select a ride that suits your needs, and click 'Book Now'. Fill in your details and confirm the booking."
  },
  {
    question: "How do I become a driver?",
    answer: "Click on 'Register as Driver' from the home page. You'll need to provide your personal details, Aadhaar number, driving license, and vehicle documents. After verification by our admin team, you can start listing your rides."
  },
  {
    question: "How do I add multiple vehicles?",
    answer: "Once you're logged in as a driver, go to your dashboard and click on 'Manage Vehicles'. You can add, edit, or remove vehicles from there. Each vehicle can be used to create separate ride listings."
  },
  {
    question: "How do I contact a driver?",
    answer: "After booking a ride, you can see the driver's contact number in your booking details. You can call them directly or send them a message through our platform."
  },
  {
    question: "What payment methods are accepted?",
    answer: "Currently, we support cash payments directly to the driver. Digital payment options will be available soon."
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, you can cancel a booking from your booking history. Please note that cancellation policies may apply depending on how close to the departure time you cancel."
  },
  {
    question: "How do I set my availability as a driver?",
    answer: "In your driver dashboard, you can manage your schedule and set your availability for different days and times. This helps customers know when you're available for rides."
  },
  {
    question: "What documents do I need for driver verification?",
    answer: "You need a valid Aadhaar card, driving license, and vehicle RC (Registration Certificate). Make sure all documents are clear and valid."
  },
  {
    question: "How long does driver verification take?",
    answer: "Driver verification typically takes 24-48 hours. Our admin team will review your documents and approve or request additional information if needed."
  },
  {
    question: "Can I list rides for different routes?",
    answer: "Yes! You can create multiple ride listings for different routes. Each listing can have its own schedule, pricing, and availability."
  }
];

export default function Help() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [userType, setUserType] = useState<"customer" | "driver">("customer");
  const { toast } = useToast();

  const { data: tickets = [] } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/support/tickets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      toast({
        title: "Ticket submitted",
        description: "We'll get back to you within 24 hours.",
      });
      setName("");
      setPhone("");
      setEmail("");
      setSubject("");
      setCategory("");
      setDescription("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit ticket",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !subject || !category || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({
      userName: name,
      userPhone: phone,
      userEmail: email || undefined,
      subject,
      category,
      description,
      userType,
      priority: "medium",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "in_progress":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Help & Support</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">We're here to help</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-3">Mon-Sat, 9 AM - 6 PM</p>
              <a href="tel:+911234567890" className="text-primary font-medium">
                +91 123 456 7890
              </a>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-3">We'll respond within 24 hours</p>
              <a href="mailto:support@chalooride.com" className="text-green-600 dark:text-green-400 font-medium">
                support@chalooride.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
              <Button variant="outline" size="sm" className="border-purple-500/20">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Submit a Support Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userType">I am a *</Label>
                  <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                    <SelectTrigger id="userType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking Issue</SelectItem>
                      <SelectItem value="payment">Payment Issue</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about your issue..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" disabled={submitMutation.isPending} className="w-full gap-2">
                {submitMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Tickets */}
        {tickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="border-l-4" style={{
                    borderLeftColor: ticket.status === "resolved" ? "rgb(34 197 94)" : 
                                    ticket.status === "in_progress" ? "rgb(245 158 11)" : "rgb(59 130 246)"
                  }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{ticket.subject}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(ticket.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace("_", " ")}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Category: {ticket.category}</span>
                        <span>•</span>
                        <span>Priority: {ticket.priority}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      {ticket.adminResponse && (
                        <div className="mt-3 p-3 rounded-lg bg-muted">
                          <p className="text-sm font-medium mb-1">Admin Response:</p>
                          <p className="text-sm text-muted-foreground">{ticket.adminResponse}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
