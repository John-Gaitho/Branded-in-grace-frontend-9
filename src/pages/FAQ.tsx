import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "What materials are your cups made from?",
      answer: "Our cups are crafted from high-quality ceramics and food-safe materials. Each piece is carefully selected for durability and beauty, ensuring your beverages taste their best."
    },
    {
      question: "How long does shipping take?",
      answer: "We typically process and ship orders within 1-2 business days. Standard shipping takes 3-5 business days within Kenya, while express shipping takes 1-2 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within Kenya only. We're working to expand our shipping options to serve customers internationally in the future."
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can use this to monitor your package's progress."
    },
    {
      question: "What if my cup arrives damaged?",
      answer: "We take great care in packaging, but if your item arrives damaged, please contact us within 48 hours with photos. We'll arrange a replacement or full refund immediately."
    },
    {
      question: "Are your cups dishwasher safe?",
      answer: "Yes, most of our cups are dishwasher safe. However, we recommend hand washing to preserve the beautiful finishes and extend the life of your cups."
    },
    {
      question: "Do you offer custom designs?",
      answer: "We occasionally offer limited custom design services. Please contact us with your specific requirements, and we'll let you know what's possible."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 30-day return policy for unused items in original packaging. Custom or personalized items cannot be returned unless defective."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about our products and services
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
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

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Didn't find what you're looking for?
          </p>
          <a 
            href="/contact" 
            className="text-primary hover:underline font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}