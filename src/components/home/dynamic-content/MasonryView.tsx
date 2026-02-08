import React from 'react';
import { DynamicContentSource } from '@/lib/content-store';
import { cn } from "@/lib/utils";
import { ContentItem } from './types';
import { ContentCard } from './ContentCard';

export function MasonryView({ items, source, onView }: { items: ContentItem[], source: DynamicContentSource, onView: (item: ContentItem) => void }) {
  // Determine column count class based on configuration
  const columnClass = {
    1: 'columns-1',
    2: 'columns-1 md:columns-2',
    3: 'columns-1 md:columns-2 lg:columns-3',
    4: 'columns-1 md:columns-2 lg:columns-4',
  }[source.gridColumns || 3];

  return (
    <div className={cn("w-full space-y-6", columnClass)}>
      {items.map((item, index) => (
        <div key={item.id} className="break-inside-avoid mb-6">
          <ContentCard 
            item={item} 
            type={source.type} 
            displayMode={source.displayMode}
            cardStyle={source.cardStyle}
            index={index}
            onView={onView}
          />
        </div>
      ))}
    </div>
  );
}
