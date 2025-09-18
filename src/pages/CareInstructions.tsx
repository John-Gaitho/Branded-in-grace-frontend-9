import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Droplets, Sun, Thermometer, XCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CareInstructions() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Care Instructions</h1>
          <p className="text-muted-foreground">
            Keep your Branded In Grace products beautiful and lasting for years to come — whether it’s cups, t-shirts, hoodies, or more!
          </p>
        </div>

        <div className="space-y-6">
          <Alert>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-1 text-yellow-500" />
              <AlertDescription>
                Proper care will help preserve the beauty and functionality of your items. Following these guidelines also helps maintain your warranty coverage.
              </AlertDescription>
            </div>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Daily Cleaning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Recommended Method - Hand Washing</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Rinse with warm water immediately after use</li>
                  <li>Use mild dish soap and a soft sponge or cloth</li>
                  <li>Gently clean inside and outside surfaces</li>
                  <li>Rinse thoroughly with warm water</li>
                  <li>Dry immediately with a soft towel</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Dishwasher Safe Options</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Most of our cups are dishwasher safe, but hand washing is preferred:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Place on top rack only</li>
                  <li>Use gentle cycle with mild detergent</li>
                  <li>Avoid high-heat drying cycles</li>
                  <li>Remove and hand dry for best results</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                Temperature Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Hot Beverages</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Safe for beverages up to 100°C (212°F)</li>
                  <li>Allow gradual temperature changes</li>
                  <li>Don't pour boiling liquid into a cold item suddenly</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Cold Beverages</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Perfect for iced drinks and cold beverages</li>
                  <li>Refrigerator safe</li>
                  <li>Not recommended for freezer use</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                What to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium text-red-600">Don't Use:</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Abrasive cleaners or steel wool</li>
                    <li>Bleach or harsh chemicals</li>
                    <li>Microwave (unless labeled microwave-safe)</li>
                    <li>Sudden extreme temperature changes</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-red-600">Avoid:</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Dropping or banging against hard surfaces</li>
                    <li>Soaking for extended periods</li>
                    <li>Using as storage containers</li>
                    <li>Placing directly on stovetop or open flame</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-400" />
                Storage & Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Proper Storage</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Store in a dry place away from direct sunlight</li>
                  <li>Stack carefully with protective padding if needed</li>
                  <li>Ensure completely dry before storing</li>
                  <li>Avoid storing in humid environments</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Maintaining the Finish</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Regular gentle cleaning preserves finishes</li>
                  <li>Polish with a soft cloth to enhance shine</li>
                  <li>Address stains immediately</li>
                  <li>Use specialty cleaners for tough spots</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Removing Stains
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Coffee & Tea Stains</h3>
                <p className="text-sm text-muted-foreground">
                  Mix baking soda with water to create a paste. Gently rub with a soft cloth, then rinse thoroughly. Let the paste sit for 15 minutes for stubborn stains.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Lipstick & Oil Stains</h3>
                <p className="text-sm text-muted-foreground">
                  Use a small amount of dish soap on a soft cloth. Work gently into the stain, then rinse with warm water.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you have questions about caring for your specific product or need stain removal advice, feel free to contact us at <strong>brandedingrace@gmail.com</strong>. We're here to help!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
