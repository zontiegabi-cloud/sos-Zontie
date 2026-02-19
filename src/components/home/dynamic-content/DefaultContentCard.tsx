import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ContentItem } from './types';
import { formatDate, getItemImage, getItemTitle, getItemDescription, getItemTag } from './utils';

export const DefaultContentCard = forwardRef<HTMLDivElement, { item: ContentItem }>(
  ({ item }, ref) => {
  const title = getItemTitle(item) || undefined;
  const image = getItemImage(item);
  const description = getItemDescription(item);
  const date = 'date' in item ? (item as { date: string }).date : undefined;
  const tag = getItemTag(item) || undefined;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      exit={{ opacity: 0 }}
      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col"
    >
      {image && (
        <div className="aspect-video overflow-hidden relative">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {tag && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur text-xs font-bold rounded uppercase">
              {tag}
            </div>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {description}
          </p>
        )}
        {date && (
          <div className="text-xs text-muted-foreground mt-auto">
            {formatDate(date)}
          </div>
        )}
      </div>
    </motion.div>
  );
});
DefaultContentCard.displayName = "DefaultContentCard";
