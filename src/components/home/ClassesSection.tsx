import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, Eye, Target, Crosshair, Heart, Zap, Wrench } from "lucide-react";
import { useState } from "react";
import { useContent } from "@/hooks/use-content";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Crosshair,
  Shield,
  Eye,
  Target,
  Users,
  Heart,
  Zap,
  Wrench,
};

export function ClassesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { classes: classesData } = useContent();
  
  // Convert classes data to component format with icon components
  const classes = classesData.map((classItem) => {
    const IconComponent = iconMap[classItem.icon] || Shield;
    return {
      ...classItem,
      icon: IconComponent,
    };
  });

  return (
    <section className="py-20 lg:py-32 bg-surface-dark overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
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
          {classes.map((classItem, index) => {
            const IconComponent = classItem.icon;
            return (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative z-10"
                style={{ zIndex: hoveredIndex === index ? 50 : 10 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
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
                  </div>
                </div>

                {/* Hover Details Card - Overlay */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 z-50 bg-card/95 backdrop-blur-sm border border-primary/50 rounded p-6 flex flex-col justify-center"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-display text-2xl lg:text-3xl text-foreground">{classItem.name}</h4>
                          <span className="text-sm text-primary uppercase tracking-wide font-heading">{classItem.role}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-muted-foreground text-sm lg:text-base mb-6 leading-relaxed">
                        {classItem.description}
                      </p>
                      
                      {/* Details List */}
                      <ul className="space-y-3 mb-6">
                        {classItem.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm lg:text-base">
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-foreground/90">{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Devices/Equipment */}
                      {classItem.devices && classItem.devices.length > 0 && (
                        <div className="mt-auto pt-6 border-t border-primary/20">
                          <h5 className="text-xs text-muted-foreground uppercase tracking-wide font-heading mb-3">
                          <span>{classItem.devicesUsedTitle || "Devices & Equipment"}</span>
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            {classItem.devices.map((device, i) => {
                              const DeviceIcon = iconMap[device.icon] || Shield;
                              return (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 bg-surface-dark border border-border rounded p-3 hover:border-primary/50 transition-all"
                                >
                                  <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                    <DeviceIcon className="w-4 h-4 text-primary" />
                                  </div>
                                  <span className="text-xs font-heading uppercase text-foreground truncate">
                                    {device.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
