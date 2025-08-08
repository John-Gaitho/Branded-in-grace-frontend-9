import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SizeGuide() {
  const cupSizes = [
    {
      size: "Small",
      capacity: "200ml",
      dimensions: "7cm H × 8cm W",
      bestFor: "Espresso, cortado, small coffee"
    },
    {
      size: "Medium",
      capacity: "350ml",
      dimensions: "9cm H × 9cm W",
      bestFor: "Regular coffee, tea, hot chocolate"
    },
    {
      size: "Large",
      capacity: "500ml",
      dimensions: "11cm H × 10cm W",
      bestFor: "Large coffee, latte, chai"
    },
    {
      size: "Extra Large",
      capacity: "650ml",
      dimensions: "13cm H × 11cm W",
      bestFor: "Travel mug, large beverages"
    }
  ];

  const handleSizes = [
    {
      type: "No Handle",
      description: "Smooth, minimalist design perfect for mindful drinking"
    },
    {
      type: "Standard Handle",
      description: "Traditional comfortable grip, 3cm wide opening"
    },
    {
      type: "Large Handle",
      description: "Extra comfortable grip, 4cm wide opening"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Size Guide</h1>
          <p className="text-muted-foreground">
            Find the perfect cup size for your favorite beverages
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Cup Sizes & Capacities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Best For</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cupSizes.map((cup, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{cup.size}</TableCell>
                      <TableCell>{cup.capacity}</TableCell>
                      <TableCell>{cup.dimensions}</TableCell>
                      <TableCell className="text-muted-foreground">{cup.bestFor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Handle Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {handleSizes.map((handle, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium">{handle.type}</h3>
                    <p className="text-sm text-muted-foreground">{handle.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choosing the Right Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">For Coffee Lovers</h3>
                <p className="text-sm text-muted-foreground">
                  Small (200ml) for espresso and strong coffee, Medium (350ml) for regular coffee, 
                  Large (500ml) for lattes and cappuccinos.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">For Tea Enthusiasts</h3>
                <p className="text-sm text-muted-foreground">
                  Medium (350ml) for most teas, Large (500ml) for herbal teas and chai that you want to savor slowly.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">For Hot Chocolate & Specialty Drinks</h3>
                <p className="text-sm text-muted-foreground">
                  Large (500ml) or Extra Large (650ml) for indulgent hot chocolates, smoothies, and specialty beverages.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Still Unsure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Not sure which size is right for you? Here are some tips:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Consider your typical beverage volume</li>
                <li>Think about how long you like your drink to stay warm</li>
                <li>Medium (350ml) is our most popular size - great for most drinks</li>
                <li>When in doubt, larger sizes work well for smaller portions too</li>
              </ul>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Need personal advice?</strong> Contact us at hello@blandedingrace.com 
                  and we'll help you choose the perfect size for your needs!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}