import React from 'react';
import { Link } from 'react-router-dom';
import { DynamicContentSource } from '@/lib/content-store';
import { cn } from "@/lib/utils";
import { ContentItem } from './types';
import { ContentCard } from './ContentCard';

export function SpotlightView({ items, source, onView }: { items: ContentItem[], source: DynamicContentSource, onView: (item: ContentItem) => void }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Featured Item (First one) */}
      <div className="lg:col-span-2 h-full min-h-[400px]">
        <ContentCard 
          item={items[0]} 
          type={source.type} 
          displayMode="featured"
          cardStyle="featured" // Force featured style for the spotlight item
          index={0}
          onView={onView}
        />
      </div>
      
      {/* List Items (Rest) */}
      <div className="flex flex-col gap-4 h-full">
        {items.slice(1, 5).map((item, index) => (
          <div key={item.id} className="h-28 lg:h-auto flex-shrink-0">
             <ContentCard 
               item={item} 
               type={source.type} 
               displayMode="list"
               cardStyle="compact" // Force compact style for side items
               index={index + 1}
               onView={onView}
             />
          </div>
        ))}
        
        {items.length > 5 && (
          <div className="mt-auto pt-2 text-center">
            <Link to="/news" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
              View All News
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
