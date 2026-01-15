import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is Shadows of Soldiers?",
    answer: "Shadows of Soldiers is a tactical 5v5 shooter built on Unreal Engine 5. It features class-based gameplay with unique abilities, an advanced cover system, and deep weapon customization. Every move matters, every shot counts, and every victory is earned.",
  },
  {
    question: "What platforms will the game be available on?",
    answer: "Shadows of Soldiers will initially launch on PC via Steam. Console versions may be considered after the PC release based on community demand.",
  },
  {
    question: "When will the game be released?",
    answer: "We're currently in active development. Sign up for playtests and join our Discord to stay updated on release dates and early access opportunities.",
  },
  {
    question: "How can I participate in playtests?",
    answer: "Join our Discord community to be notified about upcoming playtest opportunities. Playtest participants help shape the game's development and get exclusive early access.",
  },
  {
    question: "What are the different classes?",
    answer: "There are three classes: Juggernaut (Tank) - heavy armor and suppressive firepower, Shadow (Recon) - speed and stealth specialist, and Commander (Support) - tactical leadership and team support. Each class has unique abilities and playstyles.",
  },
  {
    question: "Will there be weapon customization?",
    answer: "Yes! Shadows of Soldiers features deep weapon customization with realistic attachments and modifications. Customize your loadout to match your playstyle and tactical needs.",
  },
  {
    question: "Is there a cover system?",
    answer: "Absolutely. Our advanced cover system rewards tactical positioning and smart movement. Use cover strategically to gain advantages and outmaneuver your opponents.",
  },
  {
    question: "How can I support the game?",
    answer: "The best way to support us is to wishlist Shadows of Soldiers on Steam, join our Discord community, and follow us on social media. Spreading the word helps us grow the community!",
  },
];

export default function FAQ() {
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
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
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
