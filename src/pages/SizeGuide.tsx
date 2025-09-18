import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

export default function SizeGuide() {
  const apparelSizes = [
    { type: "T-Shirts", sizes: "S – 3XL", fit: "Unisex, true to size" },
    { type: "Hoodies", sizes: "S – 3XL", fit: "Relaxed fit, cozy fleece-lined" }
  ];

  const accessorySizes = [
    { type: "Keyholders", description: "Compact leather or acrylic designs, approx. 5cm × 3cm" },
    { type: "Bracelets", description: "Adjustable band, fits most wrists comfortably" }
  ];

  const drinkwareSizes = [
    { size: "Small", capacity: "200ml", bestFor: "Espresso, cortado" },
    { size: "Medium", capacity: "350ml", bestFor: "Coffee, tea" },
    { size: "Large", capacity: "500ml", bestFor: "Latte, chai" },
    { size: "XL", capacity: "650ml", bestFor: "Smoothies, travel drinks" }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 }
    })
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">📏 Product Size & Fit Guide</h1>
          <p className="text-muted-foreground">
            Helping you choose the perfect size for apparel, accessories, and custom gifts
          </p>
        </div>

        <div className="space-y-8">
          {/* Apparel */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <Card>
              <CardHeader>
                <CardTitle>👕 Apparel (T-Shirts & Hoodies)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Available Sizes</TableHead>
                      <TableHead>Fit Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apparelSizes.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.type}</TableCell>
                        <TableCell>{item.sizes}</TableCell>
                        <TableCell className="text-muted-foreground">{item.fit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accessories */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <Card>
              <CardHeader>
                <CardTitle>🔑 Accessories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {accessorySizes.map((item, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium">{item.type}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Drinkware */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            <Card>
              <CardHeader>
                <CardTitle>☕ Drinkware Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Size</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drinkwareSizes.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.size}</TableCell>
                        <TableCell>{item.capacity}</TableCell>
                        <TableCell className="text-muted-foreground">{item.bestFor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* General Tips */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
            <Card>
              <CardHeader>
                <CardTitle>💡 Choosing the Right Size</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Check product descriptions for size and material details</li>
                  <li>Use our size guide to compare with items you already own</li>
                  <li>Contact us if you're unsure — we’re happy to help!</li>
                </ul>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Need help choosing?</strong> Email us at <a href="mailto:brandedingrace@gmail.com" className="underline">brandedingrace@gmail.com</a> or message us on WhatsApp.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
