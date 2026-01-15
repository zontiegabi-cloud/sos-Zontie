import { motion } from "framer-motion";
import { Crosshair, Shield, Wrench, Target } from "lucide-react";

const features = [
  {
    icon: Crosshair,
    title: "Abilities",
    description: "Each class has unique abilities that can turn the tide of battle when used strategically.",
    image: "https://www.shadowsofsoldiers.com/assets/webp/abilities.webp",
  },
  {
    icon: Shield,
    title: "Cover System",
    description: "Advanced cover mechanics reward tactical positioning and smart movement.",
    image: "https://www.shadowsofsoldiers.com/assets/cover.gif",
  },
  {
    icon: Wrench,
    title: "Weapon Customization",
    description: "Deep weapon customization with realistic attachments and modifications.",
    image: "https://www.shadowsofsoldiers.com/assets/weaponcustomise.gif",
  },
  {
    icon: Target,
    title: "Tactical Gameplay",
    description: "Every move matters. Every shot counts. Every victory is earned.",
    image: "https://www.shadowsofsoldiers.com/assets/shelter.gif",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl lg:text-6xl text-foreground mb-4">
            CORE <span className="text-primary">FEATURES</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience tactical gameplay like never before
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 lg:p-10 flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl uppercase text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 lg:mt-24 text-center"
        >
          <blockquote className="font-display text-2xl lg:text-4xl text-muted-foreground italic">
            "Every move matters. Every shot counts.{" "}
            <span className="text-primary text-glow-primary">Every victory is earned.</span>"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
