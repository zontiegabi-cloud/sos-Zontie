import React from 'react';
import { DynamicContentSource } from '@/lib/content-store';
import { cn } from "@/lib/utils";
import { ContentItem } from './types';
import { ContentCard } from './ContentCard';

export function FeaturedView({ items, source, onView }: { items: ContentItem[], source: DynamicContentSource, onView: (item: ContentItem) => void }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(250px,auto)] gap-4">
      {items.map((item, index) => {
        // First item is huge (2x2)
        const isFirst = index === 0;
        // Second and third items are wide (2x1) or tall? Let's make them standard 1x1 or 2x1.
        // Let's go with a specific pattern:
        // [ 0 (2x2) ] [ 1 (1x1) ] [ 2 (1x1) ]
        //             [ 3 (2x1) ]
        
        // Simple logic: First item spans 2x2 on large screens
        const spanClass = isFirst 
          ? "md:col-span-2 md:row-span-2 min-h-[500px]" 
          : "col-span-1 row-span-1 min-h-[250px]";

        return (
          <div key={item.id} className={cn("relative", spanClass)}>
             <div className="w-full h-full">
               <ContentCard 
                 item={item} 
                 type={source.type} 
                 displayMode={source.displayMode}
                 cardStyle={isFirst ? 'overlay' : (source.cardStyle || 'default')}
                 index={index}
                 onView={onView}
               />
             </div>
          </div>
        );
      })}
    </div>
  );
}
