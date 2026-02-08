import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DynamicContentSource } from '@/lib/content-store';
import { cn } from '@/lib/utils';
import { ContentItem } from './types';
import { ContentCard } from './ContentCard';

export function CarouselView({ items, source, onView }: { items: ContentItem[], source: DynamicContentSource, onView: (item: ContentItem) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [progress, setProgress] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setProgress((scrollLeft / maxScroll) * 100);
      } else {
        setProgress(100);
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  // Determine card sizing based on type and style
  // We use fixed widths for standard card styles to prevent them from becoming too large/tall
  const isStandardCard = (source.type === 'news' || source.type === 'media') && 
    ['minimal', 'default', 'compact', 'tech', 'corporate'].includes(source.cardStyle || 'default');
  
  // Tech cards need a bit more width to breathe
  const isTechCard = source.cardStyle === 'tech';

  const isClassCard = source.type === 'classes';

  return (
    <div className="relative group/carousel py-4">
      {/* Professional Navigation Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 -translate-x-2 group-hover/carousel:translate-x-0 pointer-events-none group-hover/carousel:pointer-events-auto">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('left')}
              className="w-10 h-20 bg-background/80 backdrop-blur-md border-y border-r border-primary/20 rounded-r-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:shadow-primary/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 translate-x-2 group-hover/carousel:translate-x-0 pointer-events-none group-hover/carousel:pointer-events-auto">
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('right')}
              className="w-10 h-20 bg-background/80 backdrop-blur-md border-y border-l border-primary/20 rounded-l-xl flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:shadow-primary/20"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-hide px-4 md:px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => (
          <div 
            key={item.id} 
            className={cn(
              "snap-center shrink-0 h-auto flex",
              isClassCard 
                ? "w-[280px] md:w-[340px] lg:w-[380px]" 
                : isTechCard
                  ? "w-[300px] md:w-[350px] lg:w-[400px]" // Tech cards get more width
                  : isStandardCard
                    ? "w-[280px] md:w-[320px] lg:w-[360px]" // Optimized width for minimal/default cards
                    : "min-w-[85vw] md:min-w-[60vw] lg:min-w-[40vw]" // Wide format for others
            )}
          >
             <div className="w-full h-full">
               <ContentCard 
                 item={item} 
                 type={source.type} 
                 displayMode="carousel"
                 cardStyle={source.cardStyle}
                 index={idx}
                 onView={onView}
               />
             </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-primary/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary/50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />
      </div>
    </div>
  );
}
