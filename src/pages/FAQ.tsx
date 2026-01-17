import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useContent } from "@/hooks/use-content";

export default function FAQ() {
  const { faq } = useContent();

  return (
    <Layout>
      <section className="py-20 lg:py-32 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl lg:text-7xl text-foreground mb-4">
              FREQUENTLY <span className="text-primary">ASKED</span> QUESTIONS
            </h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about Shadows of Soldiers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faq.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded px-6 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="font-heading text-lg uppercase text-foreground hover:text-primary py-6">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
