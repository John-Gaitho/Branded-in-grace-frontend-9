import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export default function Shipping() {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      timeframe: "3-5 Business Days",
      cost: "Free on orders over KSH 2,000",
      description: "Our most popular option with reliable delivery"
    },
    {
      name: "Express Shipping",
      timeframe: "1-2 Business Days",
      cost: "KSH 500",
      description: "Fast delivery for urgent orders"
    },
    {
      name: "Same Day Delivery",
      timeframe: "Within 6 Hours",
      cost: "KSH 800",
      description: "Available in Nairobi CBD only (orders before 2 PM)"
    }
  ];

  const locations = [
    {
      area: "Nairobi",
      zones: ["CBD", "Westlands", "Karen", "Kilimani", "Lavington"],
      delivery: "1-2 days"
    },
    {
      area: "Mombasa",
      zones: ["Island", "Mainland", "Nyali", "Bamburi"],
      delivery: "2-3 days"
    },
    {
      area: "Kisumu",
      zones: ["City Center", "Milimani", "Nyalenda"],
      delivery: "3-4 days"
    },
    {
      area: "Other Major Towns",
      zones: ["Nakuru", "Eldoret", "Thika", "Machakos"],
      delivery: "3-5 days"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Shipping Information</h1>
          <p className="text-muted-foreground">
            Fast, reliable delivery across Kenya for your beautiful cups
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shippingOptions.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{option.name}</h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <Badge variant="outline">{option.timeframe}</Badge>
                    </div>
                    <p className="text-sm font-medium text-primary">{option.cost}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {locations.map((location, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{location.area}</h3>
                      <Badge variant="secondary">{location.delivery}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {location.zones.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Packaging & Handling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Secure Packaging</h3>
                <p className="text-sm text-muted-foreground">
                  Every cup is carefully wrapped in protective material and placed in a sturdy box. 
                  We use eco-friendly packaging materials whenever possible to minimize environmental impact.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Processing Time</h3>
                <p className="text-sm text-muted-foreground">
                  Orders are typically processed within 1-2 business days. You'll receive a confirmation 
                  email once your order ships with tracking information.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Special Handling</h3>
                <p className="text-sm text-muted-foreground">
                  Fragile items like our ceramic cups receive extra padding and are marked as "Handle with Care" 
                  to ensure they arrive in perfect condition.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Track Your Order</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once your order ships, you'll receive an email with:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Tracking number</li>
                  <li>Estimated delivery date</li>
                  <li>Courier company details</li>
                  <li>Direct link to track your package</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Delivery Attempts</h3>
                <p className="text-sm text-muted-foreground">
                  Our delivery partners will attempt delivery up to 3 times. If delivery fails, 
                  the package will be held at the nearest pickup point for 7 days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Delivery Address</h3>
                <p className="text-sm text-muted-foreground">
                  Please ensure your delivery address is complete and accurate. We cannot be responsible 
                  for delays or lost packages due to incorrect addresses.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Signature Required</h3>
                <p className="text-sm text-muted-foreground">
                  For security, orders over KSH 5,000 require a signature upon delivery. 
                  Make sure someone is available to receive the package.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Weather Delays</h3>
                <p className="text-sm text-muted-foreground">
                  Severe weather conditions may cause delivery delays. We'll notify you of any 
                  significant delays and provide updated delivery estimates.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium mb-2">Questions About Your Shipment?</h3>
            <p className="text-sm text-muted-foreground">
              Contact our customer service team at hello@blandedingrace.com or call +1 (555) 123-4567. 
              We're here to help ensure your order arrives safely and on time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}