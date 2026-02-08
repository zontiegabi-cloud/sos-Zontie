import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { DynamicContentSource } from '@/lib/content-store';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ContentItem } from './types';

export function HeroCarouselView({ items, source, onView }: { items: ContentItem[], source: DynamicContentSource, onView: (item: ContentItem) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, items.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + items.length) % items.length);
  };

  const getVisibleItems = () => {
    if (items.length === 0) return [];
    
    const count = items.length;
    const result = [];
    
    // Always show Center
    result.push({ item: items[currentIndex], position: 'center', index: currentIndex });

    // Show Left/Right if available (and distinct)
    if (count > 1) {
      const rightIndex = (currentIndex + 1) % count;
      result.push({ item: items[rightIndex], position: 'right', index: rightIndex });
      
      const leftIndex = (currentIndex - 1 + count) % count;
      // Only add left if it's not the same as right (i.e., count > 2)
      if (leftIndex !== rightIndex) {
        result.push({ item: items[leftIndex], position: 'left', index: leftIndex });
      }
    }

    // Show FarLeft/FarRight if count >= 5
    if (count >= 5) {
       const farRightIndex = (currentIndex + 2) % count;
       result.push({ item: items[farRightIndex], position: 'far-right', index: farRightIndex });
       
       const farLeftIndex = (currentIndex - 2 + count) % count;
       result.push({ item: items[farLeftIndex], position: 'far-left', index: farLeftIndex });
    }

    return result;
  };

  if (items.length === 0) return null;

  return (
    <div 
      className="w-screen relative left-[calc(-50vw+50%)] h-[700px] lg:h-[40vw] min-h-[700px] overflow-hidden bg-background group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Blur */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={
              'image' in items[currentIndex] ? (items[currentIndex] as any).image : 
              'src' in items[currentIndex] ? (items[currentIndex] as any).src : 
              '/placeholder.jpg'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover blur-3xl scale-110 grayscale"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center perspective-[2000px]">
          {items.length > 0 && getVisibleItems().map(({ item, position, index }) => {
            const isCenter = position === 'center';
            const isLeft = position === 'left';
            const isRight = position === 'right';
            const isFarLeft = position === 'far-left';
            const isFarRight = position === 'far-right';
            
            // Calculate styles based on position
            let leftPos = 50; // Center default
            let scale = 1;
            let opacity = 1;
            let zIndex = 0;
            let rotateY = 0;
            let xOffset = "-50%";

            if (isCenter) {
              leftPos = 50;
              scale = 1.0; 
              opacity = 1;
              zIndex = 50;
              rotateY = 0;
            } else if (isLeft) {
              leftPos = 25; 
              scale = 0.7;
              opacity = 0.5;
              zIndex = 40;
              rotateY = 15;
            } else if (isRight) {
              leftPos = 75;
              scale = 0.7;
              opacity = 0.5;
              zIndex = 40;
              rotateY = -15;
            } else if (isFarLeft) {
              leftPos = 10; 
              scale = 0.5;
              opacity = 0.2;
              zIndex = 30;
              rotateY = 25;
            } else if (isFarRight) {
              leftPos = 90;
              scale = 0.5;
              opacity = 0.2;
              zIndex = 30;
              rotateY = -25;
            }


            const style = source.cardStyle || 'default';
            
            let containerClasses = "absolute top -translate-y-1/2 w-[60%] md:w-[45%] lg:w-[40%] aspect-video overflow-hidden shadow-2xl cursor-pointer bg-black transition-all duration-40";
            
            if (style === 'tech') {
              containerClasses = cn(containerClasses, 
                "rounded-none border-2 border-primary/60",
                isCenter ? "shadow-[0_0_30px_rgba(var(--primary),0.2)]" : "grayscale opacity-60"
              );
            } else if (style === 'glass') {
              containerClasses = cn(containerClasses,
                "rounded-2xl border border-white/20",
                isCenter ? "shadow-[0_8px_32px_rgba(0,0,0,0.4)]" : "grayscale opacity-60"
              );
            } else if (style === 'overlay') {
               containerClasses = cn(containerClasses,
                "rounded-none border-0",
                isCenter ? "shadow-2xl" : "grayscale opacity-60"
              );
            } else {
              // Default
              containerClasses = cn(containerClasses,
                "rounded-xl border border-white/10",
                isCenter ? "border-primary/50 shadow-primary/20 ring-1 ring-primary/20" : "grayscale hover:grayscale-0"
              );
            }

            return (
              <motion.div
                key={item.id}
                initial={{ 
                  left: `${leftPos}%`,
                  x: xOffset,
                  scale,
                  opacity,
                  zIndex,
                  rotateY
                }}
                animate={{ 
                  left: `${leftPos}%`,
                  x: xOffset,
                  scale,
                  opacity,
                  zIndex,
                  rotateY
                }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className={containerClasses}
                onClick={() => {
                   if (isCenter) onView(item);
                   else if (isLeft) paginate(-1);
                   else if (isRight) paginate(1);
                   else if (isFarLeft) paginate(-2);
                   else if (isFarRight) paginate(2);
                }}
              >
                {/* Image */}
                <img 
                  src={
                    'image' in item ? (item as any).image : 
                    'src' in item ? (item as any).src : 
                    '/placeholder.jpg'
                  } 
                  alt={(item as any).title || ''}
                  className="w-full h-full object-cover"
                />
                
                {/* Tech Style Decorations (Background) */}
                {style === 'tech' && isCenter && (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-20" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary z-20" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary z-20" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-20" />
                  </>
                )}

                {/* Gradient Overlays for side items */}
                {!isCenter && (
                   <div className="absolute inset-0 bg-black/60 transition-opacity duration-300" />
                )}

                {/* Content Overlay - TECH STYLE */}
                {style === 'tech' && (
                  <div className={cn(
                    "absolute inset-0 p-6 flex flex-col justify-between transition-all duration-300 font-mono z-20",
                    isCenter ? "opacity-100" : "opacity-0"
                  )}>
                    <div className="flex justify-between items-start">
                      <div className="bg-black/80 border border-primary/40 px-2 py-1 text-[10px] text-primary uppercase tracking-widest">
                         SYS.ACTIVE
                      </div>
                      <div className="text-[10px] text-primary/70">
                        {item.id.substring(0, 8).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="bg-black/90 border border-primary/30 p-4 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                       </div>
                       <h2 className="text-xl md:text-2xl lg:text-[2vw] font-display text-primary mb-2 leading-none uppercase tracking-wider">
                          {(item as any).title}
                       </h2>
                       <p className="text-primary/60 line-clamp-2 text-xs md:text-sm font-mono mb-3">
                          {(item as any).description}
                       </p>
                       <Button size="sm" variant="outline" className="h-8 lg:h-[2.5vw] lg:text-[0.8vw] w-full border-primary text-primary hover:bg-primary hover:text-black uppercase tracking-widest text-xs rounded-none" onClick={(e) => { e.stopPropagation(); onView(item); }}>
                          Initialize <ChevronRight className="w-3 h-3 ml-2" />
                       </Button>
                    </div>
                  </div>
                )}

                {/* Content Overlay - GLASS STYLE */}
                {style === 'glass' && (
                  <div className={cn(
                    "absolute inset-0 p-4 lg:p-6 flex flex-col justify-end transition-all duration-300 z-20",
                    isCenter ? "opacity-100" : "opacity-0"
                  )}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 lg:p-[1.5vw] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] lg:text-[0.7vw] font-medium text-white uppercase tracking-wide">
                            {'tag' in item ? (item as any).tag : source.type}
                          </span>
                       </div>
                       <h2 className="text-xl md:text-2xl lg:text-[2.2vw] font-bold text-white mb-2 leading-tight">
                          {(item as any).title}
                       </h2>
                       <p className="text-white/80 line-clamp-2 text-xs md:text-sm lg:text-[0.9vw] mb-4">
                          {(item as any).description}
                       </p>
                       <Button size="sm" className="h-8 lg:h-[2.5vw] lg:text-[0.8vw] bg-white text-black hover:bg-white/90 rounded-lg w-full font-bold" onClick={(e) => { e.stopPropagation(); onView(item); }}>
                          Explore
                       </Button>
                    </div>
                  </div>
                )}

                {/* Content Overlay - OVERLAY STYLE */}
                {style === 'overlay' && (
                  <div className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-300 z-20",
                    isCenter ? "opacity-100" : "opacity-0"
                  )}>
                    <div className="absolute inset-0 bg-black/60 z-[-1]" />
                    <span className="inline-block px-3 py-1 mb-4 text-xs lg:text-[0.8vw] font-bold uppercase tracking-[0.2em] text-primary border-y border-primary/50">
                        {'tag' in item ? (item as any).tag : source.type}
                     </span>
                     <h2 className="text-3xl md:text-4xl lg:text-[3.5vw] font-display text-white mb-4 drop-shadow-2xl uppercase tracking-tighter">
                        {(item as any).title}
                     </h2>
                     <Button size="lg" className="rounded-full px-8 lg:px-[2vw] lg:h-[3vw] lg:text-[1vw] bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest" onClick={(e) => { e.stopPropagation(); onView(item); }}>
                        Discover
                     </Button>
                  </div>
                )}

                {/* Content Overlay - DEFAULT STYLE */}
                {(style === 'default' || !['tech', 'glass', 'overlay'].includes(style)) && (
                  <div className={cn(
                    "absolute inset-0 p-6 md:p-8 flex flex-col justify-end transition-all duration-300",
                    isCenter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <div className="bg-gradient-to-t from-black/95 via-black/60 to-transparent absolute inset-0" />
                    <div className="relative z-10">
                       <span className="inline-block px-2 py-0.5 mb-2 text-[10px] lg:text-[0.7vw] lg:px-[0.5vw] lg:py-[0.1vw] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded backdrop-blur-md">
                          {'tag' in item ? (item as any).tag : source.type}
                       </span>
                       <h2 className="text-2xl md:text-3xl lg:text-[2.5vw] font-display text-white mb-2 drop-shadow-xl leading-none">
                          {(item as any).title}
                       </h2>
                       <p className="text-white/70 line-clamp-2 text-xs md:text-sm lg:text-[0.9vw] font-light mb-4 lg:mb-[1vw] max-w-lg lg:max-w-[80%]">
                          {(item as any).description}
                       </p>
                       <Button size="sm" className="h-8 lg:h-[2.5vw] text-xs lg:text-[0.8vw] lg:px-[1.5vw] uppercase tracking-wider" onClick={(e) => { e.stopPropagation(); onView(item); }}>
                          View Details <ArrowRight className="w-3 h-3 lg:w-[0.8vw] lg:h-[0.8vw] ml-2" />
                       </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 z-30 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/10 pointer-events-auto transition-transform hover:scale-110"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/10 pointer-events-auto transition-transform hover:scale-110"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
               setDirection(idx > currentIndex ? 1 : -1);
               setCurrentIndex(idx);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              idx === currentIndex ? "w-8 bg-primary" : "bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
