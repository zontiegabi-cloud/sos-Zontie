import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem, PatchNoteItem } from '@/lib/content-store';
import { formatDate } from '@/lib/utils';
import { Bell, ArrowRight } from 'lucide-react';

interface NewsTickerProps {
  items: (NewsItem | PatchNoteItem)[];
  onView: (item: NewsItem | PatchNoteItem) => void;
}

export function NewsTicker({ items, onView }: NewsTickerProps) {
  if (!items.length) return null;

  return (
    <div className="w-full bg-black/80 border-y border-white/10 overflow-hidden relative h-12 flex items-center backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 bg-primary px-4 flex items-center z-10 shadow-lg shadow-black/50">
        <Bell className="w-4 h-4 text-primary-foreground mr-2 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground hidden md:inline-block">Latest News</span>
      </div>
      
      <div className="flex overflow-hidden w-full mask-linear-fade">
        <motion.div 
          className="flex items-center gap-12 pl-40 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: Math.max(20, items.length * 5) // Dynamic speed based on content length
          }}
        >
          {[...items, ...items, ...items].map((item, i) => ( // Triple content for seamless loop
            <div 
              key={`${item.id}-${i}`} 
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => onView(item)}
            >
              <span className="text-primary/70 text-[10px] font-mono border border-primary/30 px-1.5 rounded">
                {formatDate(item.date)}
              </span>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {item.title}
              </span>
              <ArrowRight className="w-3 h-3 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/10 ml-8" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
