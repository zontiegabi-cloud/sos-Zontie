import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassItem } from '@/lib/content-store';
import { iconMap } from '@/lib/icon-map';
import { Shield } from 'lucide-react';

export const ClassesContentCard = forwardRef<HTMLDivElement, { item: ClassItem, index: number, onClick?: () => void, isSelected?: boolean, showHoverInfo?: boolean }>(
  ({ item, index, onClick, isSelected, showHoverInfo = true }, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[item.icon] || Shield;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative z-10 h-full cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{ zIndex: isHovered && showHoverInfo ? 50 : 10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-500 h-full flex flex-col aspect-[3/4]">
        {/* Image */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          <div className="absolute top-4 right-4 px-4 py-2 bg-accent/90 text-accent-foreground text-sm font-bold font-heading uppercase tracking-wide rounded shadow-lg backdrop-blur-md border border-white/10">
            {item.role}
          </div>
        </div>
        
        {/* Base Content (Title) */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-end pb-10">
           <h3 className="font-display text-4xl lg:text-5xl text-foreground mb-2 group-hover:text-primary transition-colors text-center drop-shadow-lg">
            {item.name}
          </h3>
        </div>
      </div>

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && showHoverInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 z-50 bg-card/95 backdrop-blur-sm border border-primary/50 rounded p-6 flex flex-col justify-center text-left"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display text-2xl lg:text-3xl text-foreground">{item.name}</h4>
                <span className="text-sm text-primary uppercase tracking-wide font-heading">{item.role}</span>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm lg:text-base mb-6 leading-relaxed line-clamp-3">
              {item.description}
            </p>
            
            {/* Details List */}
            <ul className="space-y-3 mb-6">
              {(item.details || []).map((detail: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm lg:text-base">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground/90">{detail}</span>
                </li>
              ))}
            </ul>

            {/* Devices/Equipment */}
            {item.devices && item.devices.length > 0 && (
              <div className="mt-auto pt-6 border-t border-primary/20">
                <h5 className="text-xs text-muted-foreground uppercase tracking-wide font-heading mb-3">
                  <span>{item.devicesUsedTitle || "Devices & Equipment"}</span>
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {item.devices.map((device, i) => {
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
});
ClassesContentCard.displayName = "ClassesContentCard";
