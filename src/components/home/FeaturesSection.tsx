import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Shield, Wrench, Target, ArrowRight, X, Users, Eye, Heart, Zap } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContent } from "@/hooks/use-content";

interface Device {
  name: string;
  details: string;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Crosshair,
  Shield,
  Wrench,
  Target,
  Users,
  Eye,
  Heart,
  Zap,
};

export function FeaturesSection() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const { features: featuresData } = useContent();
  
  // Convert features data to component format with icon components
  const features = featuresData.map((feature) => {
    const IconComponent = iconMap[feature.icon] || Crosshair;
    return {
      ...feature,
      icon: IconComponent,
    };
  });

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-500 min-h-[280px] lg:min-h-[320px] cursor-pointer"
              onClick={() => setOpenDialog(feature.id)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-100 group-hover:opacity-30 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-10 lg:p-14 flex flex-col h-full">
                <div className="flex items-start gap-8 flex-1">
                  <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
                    <feature.icon className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl lg:text-3xl uppercase text-foreground mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base lg:text-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Read More Button */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all duration-300 font-heading uppercase text-sm">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 lg:mt-24 text-center"
        >
          <blockquote className="font-display text-2xl lg:text-4xl text-muted-foreground italic">
            "Every move matters. Every shot counts.{" "}
            <span className="text-primary text-glow-primary">Every victory is earned.</span>"
          </blockquote>
        </motion.div>
      </div>

      {/* Feature Details Dialog */}
      {features.map((feature) => (
        <Dialog
          key={feature.id}
          open={openDialog === feature.id}
          onOpenChange={(open) => setOpenDialog(open ? feature.id : null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-primary/20">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <DialogTitle className="font-display text-3xl lg:text-4xl uppercase text-foreground">
                    {feature.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2 text-base">
                    {feature.description}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-heading text-xl uppercase text-foreground mb-4 flex items-center gap-2">
                  <span className="text-primary">{feature.devices.length}</span>
                  <span>{feature.devicesSectionTitle || "Devices & Features"}</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feature.devices.map((device, index) => {
                    const DeviceIcon = device.icon ? iconMap[device.icon] : null;
                    return (
                      <motion.div
                        key={device.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-surface-dark border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {DeviceIcon && (
                            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                              <DeviceIcon className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <h4 className="font-heading text-lg uppercase text-primary">
                            {device.name}
                          </h4>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {device.details}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Feature Image - Editable */}
              <div className="mt-8 space-y-2">
                <label className="text-sm text-muted-foreground block">Feature Image</label>
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Note: To change this image, edit the feature in the Admin panel
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </section>
  );
}
