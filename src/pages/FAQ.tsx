import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
  {
    question: "What types of products do you sell?",
    answer:
      "We offer a wide range of personalized products including glass tumblers, thermal flasks, water bottles, mugs, t-shirts, hoodies, sweatshirts, keychains, and more. All items can be customized with logos, names, or your own designs.",
  },
  {
    question: "Can I personalize my order?",
    answer:
      "Certainly! Most of our products are customizable. Whether it’s your name, design, or logo, we’ll design it just for you. Simply contact us with your details.",
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer:
      "Yes, we do! We offer discounts and custom packages for bulk orders including events, corporate gifts, bridal parties, schools, and church groups. Reach out to us for a personalized quote.",
  },
  {
    question: "How long does it take to process and ship my order?",
    answer:
      "Processing time for customized orders is 1–3 business days. Standard shipping within Kenya takes 1–3 business days. International shipping times may vary depending on the destination.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Returns and exchanges are accepted within 3 days for non-custom items that are unused and in their original condition. Customized products are non-refundable unless they arrive damaged or with an error on our part.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept M-Pesa, bank transfers, and major mobile payment platforms. Payment instructions will be provided at checkout.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we do! Please note that international delivery fees and timelines vary. Customs duties may apply depending on your country’s import regulations.",
  },
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