import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Truck, ShoppingBag, Package, Clock, CreditCard, RefreshCcw, PhoneCall } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4 flex justify-center items-center gap-2">
          <Truck className="h-6 w-6 text-primary animate-pulse" />
          Shipping Information
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          From our hands to your home—Branded In Grace delivers beauty with care.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-primary underline">
          <a href="/shop">Shop Now</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="local-delivery">
          <AccordionTrigger className="text-lg font-medium">
            🛍 Local Delivery – Kenya <ShoppingBag className="ml-2 h-4 w-4 text-green-500" />
          </AccordionTrigger>
          <AccordionContent>
            We proudly use <strong>Pick-Up Mtaani</strong> for secure and efficient nationwide delivery.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery-options">
          <AccordionTrigger className="text-lg font-medium">
            📦 Delivery Options <Package className="ml-2 h-4 w-4 text-green-500" />
          </AccordionTrigger>
          <AccordionContent>
            <p><strong>Pick-Up Mtaani Branch Collection:</strong> Select your location at checkout. You'll get an SMS with pick-up instructions.</p>
            <p><strong>Doorstep Delivery:</strong> Available in select areas at an extra cost. Contact us to confirm availability.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery-time">
          <AccordionTrigger className="text-lg font-medium">
            🕒 Delivery Timeframe <Clock className="ml-2 h-4 w-4 text-green-500" />
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside">
              <li>Processing Time: 1–3 business days</li>
              <li>Delivery Time: 1–3 business days after dispatch</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">Note: Non-customized items may ship faster depending on stock.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fees">
          <AccordionTrigger className="text-lg font-medium">
            💰 Delivery Fees <CreditCard className="ml-2 h-4 w-4 text-green-500" />
          </AccordionTrigger>
          <AccordionContent>
            Rates vary depending on your location and order size. Estimated shipping costs are calculated at checkout.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tracking">
          <AccordionTrigger className="text-lg font-medium">
            🔄 Order Tracking <RefreshCcw className="ml-2 h-4 w-4 text-green-500" />
          </AccordionTrigger>
          <AccordionContent>
            You'll receive a confirmation message and tracking number after shipment. Track your parcel via Pick-Up Mtaani's portal or SMS.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionTrigger className="text-lg font-medium">
            📞 Questions About Delivery? <PhoneCall className="ml-2 h-4 w-4 text-green-500" />
          </AccordionTrigger>
          <AccordionContent>
            Email us at <a href="mailto:brandedingrace@gmail.com" className="underline text-primary">brandedingrace@gmail.com</a> or message us on <a href="https://wa.me/254720602028" className="underline text-primary">WhatsApp</a> for any questions.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
