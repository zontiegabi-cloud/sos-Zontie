import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem, PatchNoteItem, DynamicContentSource } from '@/lib/content-store';
import { ContentItem } from './types';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getItemTitle, getItemDescription } from './utils';

interface ListViewProps {
  items: ContentItem[];
  onView: (item: ContentItem) => void;
  source?: DynamicContentSource;
}

export function ListView({ items, onView, source }: ListViewProps) {
  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      {items.map((item, index) => {
        const typedItem = item as NewsItem | PatchNoteItem;
        const isPatch =
          '_isPatchNote' in item ||
          (('tag' in item ? typedItem.tag : undefined)?.toLowerCase().includes('patch') ?? false);

        const title = getItemTitle(item) || '';
        const description =
          getItemDescription(item) ||
          (('_isPatchNote' in item && 'subtitle' in (typedItem as PatchNoteItem) && typeof (typedItem as PatchNoteItem).subtitle === 'string')
            ? ((typedItem as PatchNoteItem).subtitle ?? '')
            : '');

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "w-full relative overflow-hidden rounded-md border transition-colors hover:bg-opacity-50",
              isPatch 
                ? "bg-blue-950/30 border-blue-500/30 hover:bg-blue-900/40" 
                : "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20"
            )}
            onClick={() => onView(item)}
          >
            <div className="px-4 py-3 flex items-center justify-between gap-4 cursor-pointer">
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shrink-0",
                  isPatch ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                )}>
                  {isPatch ? 'Update' : 'New'}
                </span>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 overflow-hidden">
                  <span className="font-medium text-sm truncate text-foreground">
                    {title}
                  </span>
                  {description && (
                    <>
                      <span className="mx-2 opacity-30 hidden sm:inline">|</span>
                      <span className="text-muted-foreground text-xs hidden sm:inline font-normal truncate">
                        {description}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn(
                  "hidden sm:flex text-xs font-bold uppercase tracking-wider items-center gap-1",
                  isPatch ? "text-blue-400" : "text-orange-500"
                )}>
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
