import { motion } from "framer-motion";
import { X } from "lucide-react";
import { WeaponItem } from "@/lib/content-store";
import { StatBar } from "./StatBar";
import { createPortal } from "react-dom";

export function WeaponDetail({ weapon, onClose }: { weapon: WeaponItem; onClose: () => void }) {
  const categoryLabels: Record<string, string> = {
    assault: "Assault Rifle",
    smg: "SMG",
    lmg: "LMG",
    sniper: "Sniper Rifle",
    shotgun: "Shotgun",
    pistol: "Pistol",
    melee: "Melee",
  };

  const attachmentTypeLabels: Record<string, string> = {
    optic: "Optics",
    barrel: "Barrel",
    grip: "Grip",
    magazine: "Magazine",
    stock: "Stock",
    accessory: "Accessory",
  };

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
            src={weapon.image}
            alt={weapon.name}
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
            <span className="text-xs text-primary uppercase font-heading">
              {categoryLabels[weapon.category]}
            </span>
            <h2 className="font-display text-3xl text-foreground">{weapon.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-muted-foreground">{weapon.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBar label="Damage" value={weapon.stats.damage} />
            <StatBar label="Accuracy" value={weapon.stats.accuracy} />
            <StatBar label="Range" value={weapon.stats.range} />
            <StatBar label="Fire Rate" value={weapon.stats.fireRate} />
            <StatBar label="Mobility" value={weapon.stats.mobility} />
            <StatBar label="Control" value={weapon.stats.control} />
          </div>

          {/* Attachments */}
          {weapon.attachments.length > 0 && (
            <div>
              <h3 className="font-heading text-lg text-foreground uppercase mb-4">
                Available Attachments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weapon.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="bg-muted/50 border border-border rounded p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-primary uppercase">
                        {attachmentTypeLabels[attachment.type]}
                      </span>
                    </div>
                    <h4 className="font-heading text-foreground">{attachment.name}</h4>
                    <p className="text-sm text-muted-foreground">{attachment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
