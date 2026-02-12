import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem, PatchNoteItem } from '@/lib/content-store';
import { X, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlertBarProps {
  items: (NewsItem | PatchNoteItem)[];
  onView: (item: NewsItem | PatchNoteItem) => void;
  variant?: 'top-bar' | 'floating' | 'popup';
}

export function AlertBar({ items, onView, variant = 'top-bar' }: AlertBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const item = items[0]; // Show the most recent item

  if (!item || !isVisible) return null;

  const isPatch = '_isPatchNote' in item || (item.tag && item.tag.toLowerCase().includes('patch'));

  if (variant === 'popup') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
          >
            <div className={cn(
              "bg-card border rounded-lg shadow-2xl overflow-hidden",
              isPatch ? "border-blue-500/50" : "border-primary/50"
            )}>
              <div className={cn(
                "px-4 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white",
                isPatch ? "bg-blue-600" : "bg-primary"
              )}>
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  {isPatch ? 'New Update' : 'Announcement'}
                </span>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="hover:bg-white/20 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="p-4 relative">
                 {/* Background Glow */}
                 <div className={cn(
                   "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -z-10",
                   isPatch ? "bg-blue-500" : "bg-primary"
                 )} />
                 
                <h4 className="font-heading text-lg leading-tight mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {'description' in item ? item.description : item.subtitle}
                </p>
                <Button 
                  size="sm" 
                  variant={isPatch ? "default" : "outline"}
                  className={cn(
                    "w-full text-xs font-bold uppercase",
                    isPatch && "bg-blue-600 hover:bg-blue-700"
                  )}
                  onClick={() => onView(item)}
                >
                  Read More <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Default: Top Bar or Floating Bar
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: 'auto', 
            opacity: 1,
            scale: [1, 1.005, 1],
            backgroundColor: isPatch ? undefined : ["rgba(249, 115, 22, 0.15)", "rgba(249, 115, 22, 0.25)", "rgba(249, 115, 22, 0.15)"]
          }}
          transition={{ 
            backgroundColor: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            default: { duration: 0.3 }
          }}
          exit={{ height: 0, opacity: 0 }}
          className={cn(
            "relative overflow-hidden px-4 py-3 cursor-pointer group",
            variant === 'floating' 
              ? "w-full my-4 rounded-md border" 
              : "w-screen ml-[calc(-50vw+50%)] border-y shadow-lg", // Full page width hack
            isPatch 
              ? "bg-blue-950/30 border-blue-500/30 hover:bg-blue-900/40" 
              : "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20"
          )}
          onClick={() => onView(item)}
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shrink-0 animate-pulse",
                isPatch ? "bg-blue-600 text-white" : "bg-orange-500 text-white"
              )}>
                {isPatch ? 'Update' : 'Alert'}
              </span>
              <span className="font-medium text-sm truncate">
                {item.title}
                <span className="mx-2 opacity-50 hidden sm:inline">|</span>
                <span className="text-muted-foreground text-xs hidden sm:inline font-normal">
                  {'description' in item ? item.description : item.subtitle}
                </span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-7 text-xs font-bold uppercase tracking-wider hover:bg-transparent",
                  isPatch ? "text-blue-400 hover:text-blue-300" : "text-orange-500 hover:text-orange-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(item);
                }}
              >
                Details <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
