import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, ArrowRight } from 'lucide-react';
import { FeatureItem } from '@/lib/content-store';
import { iconMap } from '@/lib/icon-map';
import { ContentItem } from './types';

export const FeaturesContentCard = forwardRef<HTMLDivElement, { item: FeatureItem, index: number, onView: (item: ContentItem) => void }>(
  ({ item, index, onView }, ref) => {
  const IconComponent = iconMap[item.icon] || Crosshair;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-500 h-full min-h-[280px] lg:min-h-[320px] cursor-pointer flex flex-col"
      onClick={() => onView(item)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover opacity-100 group-hover:opacity-30 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-10 lg:p-14 flex flex-col h-full">
        <div className="flex items-start gap-8 flex-1">
          <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
            <IconComponent className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-2xl lg:text-3xl uppercase text-foreground mb-4 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
              {item.description}
            </p>
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all duration-300 font-heading uppercase text-sm">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
FeaturesContentCard.displayName = "FeaturesContentCard";
