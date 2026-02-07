import React, { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Crosshair, 
  Shield, 
  Wrench, 
  Target, 
  Users, 
  Eye, 
  Heart, 
  ThumbsUp,
  ThumbsDown,
  Zap,
  ArrowRight,
  Play,
  Calendar
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  DynamicContentSource, 
  NewsItem, 
  ClassItem, 
  MediaItem, 
  FeatureItem, 
  WeaponItem, 
  MapItem, 
  GameDeviceItem,
  GameModeItem,
  SiteContent,
  Device,
  FAQItem,
  PageContent,
  RoadmapItem
} from '@/lib/content-store';
import { useContent } from '@/hooks/use-content';
import { iconMap } from '@/lib/icon-map';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { cn } from "@/lib/utils";
import { NewsDetailDialog } from '@/components/news/NewsDetailDialog';
import { MediaDetailDialog } from '@/components/home/MediaDetailDialog';
import { 
  WeaponCard, 
  MapCard, 
  DeviceCard, 
  GameModeCard, 
  WeaponDetail, 
  MapDetail, 
  DeviceDetail, 
  GameModeDetail,
  InteractiveClassList
} from '@/components/game';
import { RoadmapCard } from '@/components/game/RoadmapCard';
import { RoadmapTimeline } from '@/components/game/RoadmapTimeline';
import { RoadmapShowcase } from '@/components/game/RoadmapShowcase';
import { ClassesContentCard } from '@/components/game/ClassesContentCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// Define a union type for all content items
type ContentItem = NewsItem | ClassItem | MediaItem | FeatureItem | WeaponItem | MapItem | GameDeviceItem | FAQItem | GameModeItem | RoadmapItem;

// Helper to format date strings that might be non-standard (e.g. "Coming Soon")
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Check if date is valid
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return dateString;
};

// Helper to convert YouTube/Vimeo URLs to embed format
const getEmbedUrl = (url: string) => {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
};

// Get YouTube thumbnail
function getYouTubeThumbnail(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

// Get display thumbnail for media item
const getDisplayThumbnail = (item: MediaItem): string => {
  if (item.thumbnail) return item.thumbnail;
  if (item.type === "video" || getEmbedUrl(item.src)) {
    const ytThumb = getYouTubeThumbnail(item.src);
    if (ytThumb) return ytThumb;
  }
  return item.src;
};


const FeaturesContentCard = forwardRef<HTMLDivElement, { item: FeatureItem, index: number, onView: (item: ContentItem) => void }>(
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



const NewsContentCard = forwardRef<HTMLDivElement, { 
  item: NewsItem, 
  index: number, 
  onView: (item: ContentItem) => void,
  cardStyle?: string
}>(
  ({ item, index, onView, cardStyle = 'default' }, ref) => {
  
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

  // Overlay Style (Full Image Background)
  if (cardStyle === 'overlay') {
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

  // Tech / Cyberpunk Style
  if (cardStyle === 'tech') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative bg-black/40 border border-primary/20 hover:border-primary/60 transition-colors h-full flex flex-col cursor-pointer"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)' }}
        onClick={() => onView(item)}
      >
        <div className="flex flex-col h-full">
           {/* Tech decorations */}
           <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/50" />
           <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/50" />
           
           <div className="aspect-video relative overflow-hidden border-b border-primary/10">
             <img 
               src={item.thumbnail || item.image || '/placeholder.jpg'} 
               alt={item.title}
               className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
             />
             <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
             <div className="absolute bottom-2 right-2 px-1 bg-black/80 border border-primary/30 text-[10px] font-mono text-primary">
               ID: {item.id.substring(0, 4).toUpperCase()}
             </div>
           </div>
           
           <div className="p-5 flex-1 flex flex-col">
             <div className="flex justify-between items-center mb-2 font-mono text-xs text-primary/70">
               <span>[{formatDate(item.date)}]</span>
               <span>{item.tag}</span>
             </div>
             <h3 className="font-display text-xl text-foreground uppercase tracking-wider mb-3 group-hover:text-primary group-hover:glow-primary transition-all">
               {item.title}
             </h3>
             <p className="text-muted-foreground text-sm font-mono leading-relaxed line-clamp-3 mb-4">
               {item.description}
             </p>
             <div className="mt-auto pt-3 border-t border-primary/10 flex justify-end">
               <span className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-primary text-primary text-xs font-mono uppercase tracking-wider hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary),0.3)] hover:shadow-[0_0_15px_rgba(var(--primary),0.6)]">
                 Access Data <ArrowRight className="w-3 h-3" />
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

  // Glass Style (Modern, Blur, Sleek)
  if (cardStyle === 'glass') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative rounded-xl overflow-hidden h-full cursor-pointer"
        onClick={() => onView(item)}
      >
        <div className="absolute inset-0">
          <img 
            src={item.image || item.thumbnail || '/placeholder.jpg'} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
        </div>

        <div className="relative h-full flex flex-col justify-end p-6">
          <div className="bg-background/10 backdrop-blur-md border border-white/10 rounded-xl p-5 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-background/20 hover:border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground text-[10px] font-bold uppercase">
                {item.tag}
              </span>
              <span className="text-xs text-white/80 font-medium">
                {formatDate(item.date)}
              </span>
            </div>
            
            <h3 className="font-display text-lg text-white mb-2 leading-tight text-shadow-sm">
              {item.title}
            </h3>
            
            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
               <p className="text-white/80 text-xs line-clamp-2 mb-3">
                 {item.description}
               </p>
               <span className="inline-flex items-center text-primary-foreground text-xs font-bold uppercase tracking-wide">
                 Read Article <ArrowRight className="w-3 h-3 ml-1" />
               </span>
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

  // Default Style
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      exit={{ opacity: 0 }}
      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col cursor-pointer"
      onClick={() => onView(item)}
    >
      <div className="flex flex-col h-full w-full">
        <div className="aspect-video overflow-hidden relative">
          <img 
            src={item.thumbnail || item.image || '/placeholder.jpg'} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          {item.tag && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-heading uppercase tracking-wide rounded">
              {item.tag}
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(item.date)}</span>
          </div>
          
          <h3 className="font-heading text-xl uppercase text-foreground mb-3 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
            {item.description}
          </p>
          
          <div className="mt-auto pt-4 flex justify-end">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide rounded hover:bg-primary/90 transition-colors shadow-sm">
              Read More <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
NewsContentCard.displayName = "NewsContentCard";

const MediaContentCard = forwardRef<HTMLDivElement, { item: MediaItem, onView?: (item: ContentItem) => void }>(
  ({ item, onView }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getEmbedUrl(item.src);
  const isVideo = item.type === 'video' || !!embedUrl;

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
            src={item.src} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100">
             <div className="p-2 rounded-full bg-black/50 text-white backdrop-blur-sm">
                <Eye className="w-6 h-6" />
             </div>
          </div>
        </div>
      )}
      
      {!isPlaying && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <p className="text-white font-medium truncate">{item.title}</p>
          </div>
      )}
    </motion.div>
  );
});
MediaContentCard.displayName = "MediaContentCard";

const DefaultContentCard = forwardRef<HTMLDivElement, { item: ContentItem }>(
  ({ item }, ref) => {
  // Use type assertion for optional properties that might not exist on all types
  const title = 'title' in item ? (item as { title: string }).title : 'name' in item ? (item as { name: string }).name : undefined;
  const image = 'image' in item ? (item as { image: string }).image : ('src' in item ? (item as MediaItem).src : '/placeholder.jpg');
  const description = 'description' in item ? (item as { description: string }).description : '';
  const date = 'date' in item ? (item as { date: string }).date : undefined;
  const tag = 'tag' in item ? (item as { tag: string }).tag : undefined;

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

const ContentCard = forwardRef<HTMLDivElement, { 
  item: ContentItem, 
  type: DynamicContentSource['type'], 
  displayMode: string, 
  cardStyle?: string,
  index: number,
  onView: (item: ContentItem) => void
}>(({ item, type, displayMode, cardStyle, index, onView }, ref) => {
  if (type === 'features') {
    return <FeaturesContentCard ref={ref} item={item as FeatureItem} index={index} onView={onView} />;
  }

  if (type === 'news') {
    return <NewsContentCard ref={ref} item={item as NewsItem} index={index} onView={onView} cardStyle={cardStyle} />;
  }

  if (type === 'classes') {
    return <ClassesContentCard ref={ref} item={item as ClassItem} index={index} />;
  }

  if (type === 'media') {
    return <MediaContentCard ref={ref} item={item as MediaItem} onView={onView} />;
  }

  if (type === 'weapons') {
    return (
      <div ref={ref} className="h-full w-full">
        <WeaponCard item={item as unknown as WeaponItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }

  if (type === 'maps') {
    return (
      <div ref={ref} className="h-full w-full">
        <MapCard item={item as unknown as MapItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }

  if (type === 'roadmap') {
    return (
      <div ref={ref} className="h-full w-full">
        <RoadmapCard item={item as unknown as RoadmapItem} className="h-full" />
      </div>
    );
  }

  if (type === 'gameDevices') {
    return (
      <div ref={ref} className="h-full w-full">
        <DeviceCard item={item as unknown as GameDeviceItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }

  if (type === 'gameModes' || type === 'gamemodetab') {
    return (
      <div ref={ref} className="h-full w-full">
        <GameModeCard item={item as unknown as GameModeItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }

  return <DefaultContentCard ref={ref} item={item} />;
});
ContentCard.displayName = "ContentCard";

function CarouselView({ items, source, onView }: { items: ContentItem[], source: DynamicContentSource, onView: (item: ContentItem) => void }) {
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
  const isStandardCard = source.type === 'news' && 
    ['minimal', 'default', 'compact', 'tech'].includes(source.cardStyle || 'default');
  
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

function AccordionView({ items, source }: { items: ContentItem[], source: DynamicContentSource }) {
  return (
    <Accordion type="single" collapsible className="space-y-4 w-full">
      {items.map((item, index) => {
        // Safe access for FAQ items or fallback properties
        const question = 'question' in item ? (item as FAQItem).question : 'title' in item ? (item as { title: string }).title : 'name' in item ? (item as { name: string }).name : 'Item';
        const answer = 'answer' in item ? (item as FAQItem).answer : 'description' in item ? (item as { description: string }).description : '';

        return (
          <AccordionItem
            key={item.id}
            value={`item-${index}`}
            className="bg-card border border-border rounded px-6 data-[state=open]:border-primary/50 transition-colors"
          >
            <AccordionTrigger className="font-heading text-lg uppercase text-foreground hover:text-primary py-6 text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
              <div className="prose prose-sm prose-invert max-w-none whitespace-pre-line">
                {answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export function DynamicContentBlock({ source, alignment = 'left' }: { source: DynamicContentSource, alignment?: 'left' | 'center' | 'right' }) {
  const { content } = useContent();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");

  // Get items based on type
  const baseItems = useMemo(() => {
    if (!content) return [];
    
    // Handle gamemodetab content mapping
    if (source.type === 'gamemodetab') {
      return content.gameModes || [];
    }

    const key = source.type as keyof SiteContent;
    let allItems = (content[key] as ContentItem[]) || [];
    
    // Sort by createdAt descending for news and media
    if (['news', 'media'].includes(source.type)) {
      allItems = [...allItems].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    
    return allItems;
  }, [content, source.type]);

  // Extract Categories (for Media & News)
  const categories = useMemo(() => {
    if (source.type !== 'media' && source.type !== 'news') return [];
    const cats = new Set<string>();
    baseItems.forEach((item) => {
      if (source.type === 'media' && 'category' in item) cats.add((item as MediaItem).category);
      if (source.type === 'news' && 'tag' in item) cats.add((item as NewsItem).tag);
    });
    return Array.from(cats).sort();
  }, [baseItems, source.type]);

  // Filter & Slice
  const items = useMemo(() => {
    let result = baseItems;
    
    // Filter by Category/Tag (Client-side interactive filter)
    if (activeCategory !== 'All') {
      if (source.type === 'media') {
        result = result.filter((item) => 'category' in item && (item as MediaItem).category === activeCategory);
      } else if (source.type === 'news') {
        result = result.filter((item) => 'tag' in item && (item as NewsItem).tag === activeCategory);
      }
    }

    // Filter by Configured Category (e.g. for Roadmap sections)
    if (source.type === 'roadmap' && source.category && source.category !== 'all') {
      result = result.filter((item) => 'category' in item && (item as RoadmapItem).category === source.category);
    }

    // Filter by specific IDs if provided
    if (source.ids && source.ids.length > 0) {
      result = result.filter((item) => source.ids?.includes(item.id));
    }
    
    if (source.fetchAll) {
      return result;
    }
    
    return result.slice(0, source.count);
  }, [baseItems, activeCategory, source.ids, source.fetchAll, source.count, source.type, source.category]);

  // Handle deep linking for news
  useEffect(() => {
    if (source.type === 'news') {
      const articleId = searchParams.get("articleId");
      if (articleId && items.length > 0) {
        const item = items.find(i => i.id === articleId);
        if (item) setSelectedItem(item);
      }
    }
  }, [searchParams, items, source.type]);

  if (!items.length && !source.title) return null;

  const getGridCols = (cols?: number) => {
    switch(cols) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 md:grid-cols-2";
      case 4: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div className="w-full">
      {source.title && (
        <h3 className={cn("text-2xl font-display mb-6", {
          "text-left": alignment === 'left',
          "text-center": alignment === 'center',
          "text-right": alignment === 'right',
        })}>{source.title}</h3>
      )}

      {/* Media & News Category Filter */}
      {(source.type === 'media' || source.type === 'news') && categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <Button
            variant={activeCategory === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('All')}
            className="uppercase tracking-wide"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="uppercase tracking-wide"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {items.length > 0 && (
        source.displayMode === 'timeline' && source.type === 'roadmap' ? (
          <RoadmapTimeline items={items as unknown as RoadmapItem[]} />
        ) : source.displayMode === 'showcase' && source.type === 'roadmap' ? (
          <RoadmapShowcase items={items as unknown as RoadmapItem[]} />
        ) : (source.displayMode === 'detailed-interactive' || source.displayMode === 'classes-hex' || source.displayMode === 'classes-operator' || source.displayMode === 'classes-vanguard' || source.displayMode === 'classes-command') && source.type === 'classes' ? (
          <InteractiveClassList 
            classes={items as unknown as ClassItem[]} 
            variant={
              source.displayMode === 'classes-hex' ? 'hex-tech' : 
              source.displayMode === 'classes-operator' ? 'operator' : 
              source.displayMode === 'classes-vanguard' ? 'vanguard' : 
              source.displayMode === 'classes-command' ? 'command' : 
              'default'
            }
            showHoverInfo={source.showHoverInfo}
            previewMode={source.interactivePreviewMode || 'follow'}
          />
        ) : source.displayMode === 'carousel' ? (
          <CarouselView items={items} source={source} onView={setSelectedItem} />
        ) : source.displayMode === 'accordion' ? (
          <AccordionView items={items} source={source} />
        ) : source.displayMode === 'featured' || source.displayMode === 'spotlight' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Featured Item (First one) */}
            <div className="lg:col-span-2 h-full min-h-[400px]">
              <ContentCard 
                item={items[0]} 
                type={source.type} 
                displayMode="featured"
                cardStyle="featured" // Force featured style for the spotlight item
                index={0}
                onView={setSelectedItem}
              />
            </div>
            {/* List Items (Rest) */}
            <div className="flex flex-col gap-4 h-full">
              {items.slice(1, 5).map((item, idx) => (
                <div key={item.id} className="h-28 lg:h-auto flex-shrink-0">
                   <ContentCard 
                     item={item} 
                     type={source.type} 
                     displayMode="list"
                     cardStyle="compact" // Force compact style for side items
                     index={idx + 1}
                     onView={setSelectedItem}
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
        ) : source.displayMode === 'masonry' ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
             {items.map((item, idx) => (
               <div key={item.id} className="break-inside-avoid">
                  <ContentCard 
                    item={item} 
                    type={source.type} 
                    displayMode="grid"
                    cardStyle={source.cardStyle}
                    index={idx}
                    onView={setSelectedItem}
                  />
               </div>
             ))}
          </div>
        ) : (
          <div className={`grid ${source.displayMode === 'list' ? 'grid-cols-1' : getGridCols(source.gridColumns)} gap-6`}>
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  type={source.type} 
                  displayMode={source.displayMode} 
                  cardStyle={source.cardStyle}
                  index={idx}
                  onView={setSelectedItem}
                />
              ))}
            </AnimatePresence>
          </div>
        )
      )}

      {/* News Dialog */}
      {source.type === 'news' && (
        <NewsDetailDialog 
          item={selectedItem as NewsItem} 
          open={!!selectedItem} 
          onOpenChange={(open) => {
            if (!open) {
              setSelectedItem(null);
              setSearchParams(params => {
                params.delete("articleId");
                return params;
              });
            }
          }} 
        />
      )}

      {/* Game Content Detail Modals */}
      {selectedItem && source.type === 'weapons' && (
        <AnimatePresence>
          <WeaponDetail 
            weapon={selectedItem as unknown as WeaponItem} 
            onClose={() => setSelectedItem(null)} 
          />
        </AnimatePresence>
      )}

      {selectedItem && source.type === 'maps' && (
        <AnimatePresence>
          <MapDetail 
            map={selectedItem as unknown as MapItem} 
            onClose={() => setSelectedItem(null)} 
          />
        </AnimatePresence>
      )}

      {selectedItem && source.type === 'gameDevices' && (
        <AnimatePresence>
          <DeviceDetail 
            device={selectedItem as unknown as GameDeviceItem} 
            onClose={() => setSelectedItem(null)} 
          />
        </AnimatePresence>
      )}

      {selectedItem && (source.type === 'gameModes' || source.type === 'gamemodetab') && (
        <AnimatePresence>
          <GameModeDetail 
            mode={selectedItem as unknown as GameModeItem} 
            onClose={() => setSelectedItem(null)} 
          />
        </AnimatePresence>
      )}

      {/* Media Detail Dialog */}
      {source.type === 'media' && (
        <MediaDetailDialog
          item={selectedItem as MediaItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        />
      )}

      {/* Detail Dialog for Features/Classes */}
      {source.type !== 'news' && 
       source.type !== 'weapons' && 
       source.type !== 'maps' && 
       source.type !== 'gameDevices' && 
       source.type !== 'gameModes' && 
       source.type !== 'gamemodetab' && 
       source.type !== 'media' && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className={cn(
            "max-h-[90vh] overflow-y-auto border-primary/20",
            "max-w-3xl bg-card"
          )}>
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                 {/* Icon logic for dialog header */}
                 {selectedItem && 'icon' in selectedItem && iconMap[(selectedItem as { icon: string }).icon] && (
                   <div className="w-16 h-16 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                     {React.createElement(iconMap[(selectedItem as { icon: string }).icon], { className: "w-8 h-8 text-primary" })}
                   </div>
                 )}
                <div>
                  <DialogTitle className="font-display text-3xl lg:text-4xl uppercase text-foreground">
                    {selectedItem && ('title' in selectedItem ? (selectedItem as { title: string }).title : 'name' in selectedItem ? (selectedItem as { name: string }).name : '')}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2 text-base">
                    {selectedItem && 'description' in selectedItem ? (selectedItem as { description: string }).description : ''}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedItem && (
               <div className="mt-6 space-y-6">
                  {/* Features Specific: Devices Grid in Dialog */}
                  {source.type === 'features' && (selectedItem as FeatureItem).devices && (
                    <div>
                      <h3 className="font-heading text-xl uppercase text-foreground mb-4 flex items-center gap-2">
                        <span className="text-primary">{(selectedItem as FeatureItem).devices.length}</span>
                        <span>{(selectedItem as FeatureItem).devicesSectionTitle || "Devices & Features"}</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(selectedItem as FeatureItem).devices.map((device: Device, index: number) => {
                           const DeviceIcon = device.icon && iconMap[device.icon] ? iconMap[device.icon] : Shield;
                           return (
                              <div key={index} className="flex items-start gap-3 p-3 rounded bg-muted/50 border border-border">
                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                  <DeviceIcon className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-heading text-sm uppercase text-foreground">{device.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{device.details}</p>
                                </div>
                              </div>
                           );
                        })}
                      </div>
                    </div>
                  )}
               </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
