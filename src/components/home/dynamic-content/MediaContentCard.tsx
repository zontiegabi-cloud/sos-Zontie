import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MediaItem } from '@/lib/content-store';
import { ContentItem } from './types';
import { getEmbedUrl, getDisplayThumbnail } from './utils';

export const MediaContentCard = forwardRef<HTMLDivElement, { item: MediaItem, onView?: (item: ContentItem) => void, cardStyle?: string }>(
  ({ item, onView, cardStyle = 'default' }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getEmbedUrl(item.src);
  const isVideo = item.type === 'video' || !!embedUrl;

  // Minimal Style
  if (cardStyle === 'minimal') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative h-full min-h-[200px] overflow-hidden rounded-lg border border-border/50 bg-card hover:border-primary/50 cursor-pointer"
        onClick={() => onView?.(item)}
      >
        <div className="absolute inset-0">
          <img 
            src={getDisplayThumbnail(item)} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-heading text-sm text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider">
            {isVideo ? <Play className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            <span>{item.type}</span>
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
        onClick={() => onView?.(item)}
      >
        <div className="absolute inset-0">
          <img 
            src={getDisplayThumbnail(item)} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-primary/20 text-primary border border-primary/20 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                {item.type === 'video' ? 'Video' : 'Image'}
              </span>
            </div>
            <h3 className="font-display text-2xl text-white mb-2 leading-tight drop-shadow-md">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-white/60 text-xs font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Click to view
            </div>
          </div>
        </div>
        
        {isVideo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        )}
      </motion.div>
    );
  }

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
        onClick={() => onView?.(item)}
      >
        <div className="relative aspect-video overflow-hidden border-b border-primary/30 shrink-0">
          <img 
            src={getDisplayThumbnail(item)} 
            alt={item.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
              <div className="w-12 h-12 flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-black transition-colors">
                <Play className="w-5 h-5 ml-1" fill="currentColor" />
              </div>
            </div>
          )}
          
          {/* Tech decorations */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-primary/70 uppercase">
              {item.type === 'video' ? 'REC_001' : 'IMG_002'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <h3 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
        </div>
      </motion.div>
    );
  }

  // Overlay Style
  if (cardStyle === 'overlay') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
        onClick={() => onView?.(item)}
      >
        <img 
          src={getDisplayThumbnail(item)} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        {isVideo && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
            <Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-heading text-xl text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {item.title}
          </h3>
          <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out" />
        </div>
      </motion.div>
    );
  }

  // Hero Carousel Style (matches HeroCarouselView default style)
  if (cardStyle === 'hero-carousel') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 cursor-pointer"
        onClick={() => onView?.(item)}
      >
        <img 
          src={getDisplayThumbnail(item)} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Play Button for Video */}
        {isVideo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg z-30 pointer-events-none">
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </div>
        )}

        <div className="bg-gradient-to-t from-black/95 via-black/60 to-transparent absolute inset-0" />
        
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end transition-all duration-300">
           <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded backdrop-blur-md">
                 {item.type}
              </span>
              <h2 className="text-2xl md:text-3xl font-display text-white mb-2 drop-shadow-xl leading-none">
                  {item.title}
              </h2>
              {item.description && (
                <p className="text-white/70 line-clamp-2 text-xs md:text-sm font-light mb-4 max-w-lg">
                  {item.description}
                </p>
              )}
              
              <Button size="sm" className="h-8 text-xs uppercase tracking-wider mt-4" onClick={(e) => { e.stopPropagation(); onView?.(item); }}>
                 View Details <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
           </div>
        </div>
      </motion.div>
    );
  }

  // Default / Standard Fallback
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative aspect-video bg-muted rounded-lg overflow-hidden border border-border hover:border-primary/50"
    >
      {isVideo ? (
        isPlaying ? (
           embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
           ) : (
            <video 
              src={item.src} 
              controls 
              autoPlay
              className="w-full h-full"
              poster={item.thumbnail}
            />
           )
        ) : (
          <div 
              className="w-full h-full relative cursor-pointer"
              onClick={() => setIsPlaying(true)}
          >
            <img 
              src={getDisplayThumbnail(item)} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center pl-1 shadow-lg transform group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
          </div>
        )
      ) : (
        <div 
          className="w-full h-full relative cursor-pointer"
          onClick={() => onView?.(item)}
        >
          <img 
            src={getDisplayThumbnail(item)} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
      )}
    </motion.div>
  );
});

MediaContentCard.displayName = "MediaContentCard";
