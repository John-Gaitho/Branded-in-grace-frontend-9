import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white via-green-50 to-green-100 text-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-200 transition-colors duration-500">
      {/* Hero Section */}
      <section className="text-center px-6 py-12 md:py-20">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-green-700 dark:text-green-400"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Branded In Grace 🌿
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          We design, print & brand all your needs to create personalized
          products with elegance and care.
        </motion.p>
      </section>

      {/* Why Us */}
      <section className="bg-white dark:bg-gray-800 py-10 px-6 transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-700 dark:text-green-400">
            Why Branded In Grace?
          </h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300 list-disc list-inside">
            <li>We aspire to develop brands that stand out and leave a lasting impression.</li>
            <li>We uphold professionalism and quality in all our branding efforts.</li>
            <li>We embrace elegance and infuse style into every project.</li>
            <li>We ensure a smooth and effortless branding journey for you.</li>
            <li>We operate with strong values, ethics, and integrity.</li>
          </ul>
        </div>
      </section>

      {/* Launch Promo */}
      <section className="py-10 px-6 text-center bg-green-50 dark:bg-gray-700 transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-green-700 dark:text-green-400 mb-3">
            🥤 New Collection. Same Grace. Launching Soon.
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Exclusive Designs. Limited Stock. Stay Ready.
          </p>
        </motion.div>
      </section>

      {/* Social Media */}
      <section className="py-10 px-6 bg-white dark:bg-gray-800 text-center transition-colors duration-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
          Follow Us for Updates 💚
        </h3>
        <div className="flex justify-center space-x-6 text-2xl text-green-600 dark:text-green-300">
          <a
            href="https://www.facebook.com/profile.php?id=61559840783163&mibextid=ZbWKwL"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 dark:hover:text-green-400 transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/branded_in_grace"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 dark:hover:text-green-400 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@branded.in.grace"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-800 dark:hover:text-green-400 transition"
          >
            <FaTiktok />
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-6 bg-green-50 dark:bg-gray-700 transition-colors duration-500">
        <h3 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400 text-center">
          Frequently Asked Questions (FAQs)
        </h3>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger>❓ What types of products do you sell?</AccordionTrigger>
              <AccordionContent>
                We offer a wide range of personalized products including glass tumblers, thermal flasks, water bottles, mugs, t-shirts, hoodies, sweatshirts, keychains, and more. All items can be customized with logos, names, or your own designs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>❓ Can I personalize my order?</AccordionTrigger>
              <AccordionContent>
                Certainly! Most of our products are customizable. Whether it’s your name, design, or logo, we’ll design it just for you. Contact us with your details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>❓ Do you offer bulk or corporate orders?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer discounts and custom packages for bulk orders including events, corporate gifts, bridal parties, schools, and church groups. Reach out for a personalized quote.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>❓ How long does it take to process and ship?</AccordionTrigger>
              <AccordionContent>
                Processing time is 1–3 business days. Standard shipping within Kenya takes 1–3 business days. International shipping varies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>❓ Can I return or exchange an item?</AccordionTrigger>
              <AccordionContent>
                Returns/exchanges accepted within 3 days for non-custom items. Customized products are non-refundable unless damaged or there's a mistake on our end.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>❓ What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept M-Pesa, bank transfers, and major mobile payment platforms. Payment instructions will be provided at checkout.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>❓ Do you ship internationally?</AccordionTrigger>
              <AccordionContent>
                Yes, international shipping is available. Delivery fees and times vary. Customs duties may apply based on your country.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section className="py-10 px-6 bg-white dark:bg-gray-800 text-center transition-colors duration-500">
        <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
          Got a Question or Custom Idea?
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          WhatsApp us at{" "}
          <a
            href="https://wa.me/254720602028"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            +254 720 602 028
          </a>{" "}
          and let’s make it happen!
        </p>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
