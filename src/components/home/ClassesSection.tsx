import { motion } from "framer-motion";
import { Users } from "lucide-react";

const classes = [
  {
    name: "JUGGERNAUT",
    role: "Tank",
    description: "Heavy armor and suppressive firepower. Lead the charge and absorb enemy fire while your team advances.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2023/07/Juggernaut-1024x576.png",
    color: "accent",
  },
  {
    name: "SHADOW",
    role: "Recon",
    description: "Speed and stealth. Flank enemies, gather intel, and strike from unexpected angles.",
    image: "https://www.shadowsofsoldiers.com/assets/webp/shadow.webp",
    color: "primary",
  },
  {
    name: "COMMANDER",
    role: "Support",
    description: "Tactical leadership and team support. Coordinate strikes and provide crucial battlefield advantages.",
    image: "https://www.shadowsofsoldiers.com/assets/webp/commander.webp",
    color: "primary",
  },
];

export function ClassesSection() {
  return (
    <section className="py-20 lg:py-32 bg-surface-dark overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl text-foreground mb-4">
            CHOOSE YOUR <span className="text-primary">CLASS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Three distinct playstyles. Endless tactical possibilities.
          </p>
        </motion.div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {classes.map((classItem, index) => (
            <motion.div
              key={classItem.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-500 h-full">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={classItem.image}
                    alt={classItem.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  
                  {/* Role Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 text-accent-foreground text-xs font-heading uppercase tracking-wide rounded">
                    {classItem.role}
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-3xl lg:text-4xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {classItem.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {classItem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
