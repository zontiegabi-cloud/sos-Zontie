import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { NewsItem } from '@/lib/content-store';
import { ContentItem } from './types';
import { formatDate } from './utils';

export const NewsContentCard = forwardRef<HTMLDivElement, { 
  item: NewsItem, 
  index: number, 
  onView: (item: ContentItem) => void,
  cardStyle?: string
}>(
  ({ item, index, onView, cardStyle = 'default' }, ref) => {
  
  // Tech Style
  if (cardStyle === 'tech') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative h-full bg-black/80 border border-primary/30 hover:border-primary transition-colors cursor-pointer min-h-[250px] flex flex-col"
        onClick={() => onView(item)}
      >
        <div className="relative aspect-video overflow-hidden border-b border-primary/30 shrink-0">
          <img 
            src={item.thumbnail || item.image || '/placeholder.jpg'} 
            alt={item.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
          
          {/* Tech decorations */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-primary/70 uppercase">
              NEWS_FEED_{index.toString().padStart(3, '0')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
          <h3 className="font-mono text-lg text-primary group-hover:text-white transition-colors line-clamp-2 uppercase tracking-tight mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-primary/60 font-mono line-clamp-3 mb-4">
            {item.description}
          </p>
          <div className="mt-auto flex justify-between items-center border-t border-primary/20 pt-2">
            <span className="text-[10px] font-mono text-primary/50">{formatDate(item.date)}</span>
            <span className="text-[10px] font-bold text-black bg-primary px-2 py-0.5">READ</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Minimal Style (Image + Title + Date)
  if (cardStyle === 'minimal') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all h-full cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="flex flex-col h-full">
          <div className="aspect-[4/3] overflow-hidden relative">
            <img 
              src={item.thumbnail || item.image || '/placeholder.jpg'} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            {item.tag && (
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary/90 text-primary-foreground text-[10px] font-heading uppercase tracking-wider rounded-sm">
                {item.tag}
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col flex-1">
             <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(item.date)}</span>
            </div>
            <h3 className="font-heading text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            <div className="mt-auto pt-3 flex justify-end">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded transition-colors">
                Read More <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Glass Style
  if (cardStyle === 'glass') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative h-full min-h-[300px] overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="absolute inset-0">
          <img 
            src={item.image || item.thumbnail || '/placeholder.jpg'} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-primary/20 text-primary border border-primary/20 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                News
              </span>
              <span className="text-white/60 text-xs">{formatDate(item.date)}</span>
            </div>
            <h3 className="font-display text-2xl text-white mb-2 leading-tight drop-shadow-md">
              {item.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {item.description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Overlay Style (Full Image Background)
  if (cardStyle === 'overlay' || cardStyle === 'hero-carousel') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative h-full min-h-[300px] rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="block w-full h-full relative">
          <img 
            src={item.image || item.thumbnail || '/placeholder.jpg'} 
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {item.tag && (
                <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs font-heading uppercase tracking-wider rounded mb-3">
                  {item.tag}
                </span>
              )}
              <h3 className="font-display text-2xl text-white mb-2 leading-tight">
                {item.title}
              </h3>
              <div className="flex justify-between items-end mt-2">
                <span className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {formatDate(item.date)}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 delay-75">
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Featured Style (Big Impact)
  if (cardStyle === 'featured') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="block w-full h-full">
          <img 
            src={item.image || item.thumbnail || '/placeholder.jpg'} 
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest rounded mb-4 shadow-lg shadow-primary/20">
                {item.tag || 'Featured'}
              </span>
              
              <h3 className="font-display text-4xl md:text-5xl text-white mb-4 leading-none uppercase drop-shadow-lg">
                {item.title}
              </h3>
              
              <p className="text-gray-200 text-lg md:text-xl max-w-2xl line-clamp-3 mb-6 font-light leading-relaxed drop-shadow-md">
                {item.description}
              </p>
              
              <div className="flex items-center gap-4">
                <span className="px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition-colors flex items-center gap-2 group-hover:gap-3">
                  Read Story <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-white/60 text-sm font-mono">
                  {formatDate(item.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Magazine Style (Big typography, bold)
  if (cardStyle === 'magazine') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group h-full flex flex-col border-b border-border/50 pb-6 last:border-0 cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="grid grid-cols-1 gap-4 h-full">
          <div className="aspect-video overflow-hidden rounded-md relative">
            <img 
              src={item.thumbnail || item.image || '/placeholder.jpg'} 
              alt={item.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
             {item.tag && (
              <div className="absolute top-0 left-0 bg-foreground text-background px-3 py-1 text-xs font-bold uppercase tracking-widest">
                {item.tag}
              </div>
            )}
          </div>
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground mb-3 font-heading">
              <span>{formatDate(item.date)}</span>
              <div className="h-px w-8 bg-primary/50" />
            </div>
            <h3 className="font-display text-3xl uppercase leading-none mb-3 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4">
              {item.description}
            </p>
            <div className="mt-auto flex justify-end">
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary font-bold uppercase text-xs tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Read More <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Corporate Style (Clean, Structured, Professional)
  if (cardStyle === 'corporate') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group bg-card border-l-4 border-l-primary/70 border-y border-r border-border hover:border-l-primary hover:shadow-md transition-all h-full cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {item.tag || 'News'}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {formatDate(item.date)}
              </span>
            </div>
            
            <h3 className="font-heading text-xl text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
              {item.title}
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
              {item.description}
            </p>
            
            <div className="flex items-center text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-auto">
              Read Full Story <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact Style (Horizontal)
  if (cardStyle === 'compact') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 rounded-lg p-3 transition-all h-full cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="flex gap-4 h-full">
          <div className="w-1/3 aspect-square max-w-[120px] rounded overflow-hidden flex-shrink-0">
            <img 
              src={item.thumbnail || item.image || '/placeholder.jpg'} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center py-1">
            {item.tag && (
              <span className="text-[10px] text-primary font-heading uppercase tracking-wide mb-1">
                {item.tag}
              </span>
            )}
            <h3 className="font-heading text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDate(item.date)}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-colors">
                Read <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default / Standard / Tech / Glass Fallback
  // Handles 'default', 'tech', 'glass', 'magazine', 'compact' etc.
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-md cursor-pointer"
      onClick={() => onView(item)}
    >
      <div className="aspect-video overflow-hidden relative">
        <img 
          src={item.image || item.thumbnail || '/placeholder.jpg'} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <span className="px-4 py-2 bg-background/90 text-foreground text-xs font-bold uppercase tracking-wider rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             Read Article
           </span>
        </div>
        {item.tag && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold uppercase tracking-wider rounded-md border border-border/50">
            {item.tag}
          </span>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3 font-medium">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{formatDate(item.date)}</span>
        </div>
        
        <h3 className="font-display text-xl leading-tight text-foreground mb-3 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-primary group-hover:underline decoration-2 underline-offset-4">
            Read Full Story
          </span>
          <ArrowRight className="w-4 h-4 text-primary transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
      </div>
    </motion.div>
  );
});

NewsContentCard.displayName = "NewsContentCard";
