import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FeatureItem } from "@/lib/content-store";
import { createPortal } from "react-dom";
import { iconMap } from "@/lib/icon-map";

export function FeatureDetail({ feature, onClose }: { feature: FeatureItem; onClose: () => void }) {
  
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-background/80 rounded-full text-foreground hover:text-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClose();
              }
            }}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent p-6">
            <h2 className="font-display text-3xl text-foreground">{feature.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-muted-foreground text-lg">{feature.description}</p>

          {/* Devices / Sub-features List */}
          {feature.devices && feature.devices.length > 0 && (
            <div>
              <h3 className="font-heading text-xl text-primary uppercase mb-6">
                {feature.devicesSectionTitle || "Key Features"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feature.devices.map((device, index) => {
                  const Icon = device.icon && iconMap[device.icon] ? iconMap[device.icon] : null;
                  
                  return (
                    <div
                      key={index}
                      className="bg-muted/30 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {Icon && (
                          <div className="p-2 bg-primary/10 rounded-md text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-heading text-foreground text-lg mb-2">{device.name}</h4>
                          <p className="text-sm text-muted-foreground">{device.details}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
