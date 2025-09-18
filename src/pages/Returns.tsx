import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Package } from "lucide-react";

export default function Returns() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-muted-foreground">
            We want you to love your Branded in Grace products. Here's our return policy.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Return Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have <strong>3 days</strong> from the date of delivery to return items for a full refund or exchange.
                Items must be in original condition and packaging.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What Can Be Returned</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Standard Products</h4>
                  <p className="text-sm text-muted-foreground">
                    All regular products in unused condition with original packaging
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Defective Items</h4>
                  <p className="text-sm text-muted-foreground">
                    Any item that arrives damaged or with manufacturing defects
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Custom/Personalized Items</h4>
                  <p className="text-sm text-muted-foreground">
                    Cannot be returned unless defective or damaged during shipping
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Used Items</h4>
                  <p className="text-sm text-muted-foreground">
                    Items showing signs of use cannot be returned for hygiene reasons
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Return Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Badge variant="outline" className="min-w-fit">1</Badge>
                  <div>
                    <h4 className="font-medium">Contact Us</h4>
                    <p className="text-sm text-muted-foreground">
                      Email us at brandedingrace@gmail.com with your order number and reason for return
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Badge variant="outline" className="min-w-fit">2</Badge>
                  <div>
                    <h4 className="font-medium">Get Return Authorization</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll provide you with a return authorization number and shipping instructions
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Badge variant="outline" className="min-w-fit">3</Badge>
                  <div>
                    <h4 className="font-medium">Ship Your Return</h4>
                    <p className="text-sm text-muted-foreground">
                      Package items securely and ship to our returns address 
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Badge variant="outline" className="min-w-fit">4</Badge>
                  <div>
                    <h4 className="font-medium">Receive Refund</h4>
                    <p className="text-sm text-muted-foreground">
                      Once we receive and inspect your return, we'll process your refund within 2-3 business days
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Want a different size or style? We're happy to help with exchanges!
              </p>
              <p className="text-sm text-muted-foreground">
                Follow the same return process and let us know what you'd like to exchange for. 
                We'll send your new item once we receive your return.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}