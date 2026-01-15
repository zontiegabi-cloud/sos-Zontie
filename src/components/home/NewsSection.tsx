import { motion } from "framer-motion";
import { Calendar, Zap } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Shadows of Soldiers on Unreal Engine 5",
    date: "August 2024",
    description: "We are building on Unreal Engine 5, allowing us to create stunning visuals and realistic gameplay mechanics.",
    image: "https://www.shadowsofsoldiers.com/assets/webp/new-ue5-image.webp",
    tag: "Development",
  },
  {
    id: 2,
    title: "Playtest Sign-ups Open",
    date: "Coming Soon",
    description: "Sign up to be part of our exclusive playtests and help shape the future of Shadows of Soldiers.",
    image: "https://www.shadowsofsoldiers.com/assets/weaponcustomise.gif",
    tag: "Community",
  },
  {
    id: 3,
    title: "Advanced Cover System",
    date: "In Development",
    description: "Our cover system rewards tactical positioning and smart movement throughout the battlefield.",
    image: "https://www.shadowsofsoldiers.com/assets/cover.gif",
    tag: "Features",
  },
];

export function NewsSection() {
  return (
    <section className="py-20 lg:py-32 bg-surface-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <Zap className="w-5 h-5 text-primary" />
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl text-foreground mb-4">
            LATEST <span className="text-primary">NEWS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest developments and announcements
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-heading uppercase tracking-wide rounded">
                  {item.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-heading text-xl uppercase text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
