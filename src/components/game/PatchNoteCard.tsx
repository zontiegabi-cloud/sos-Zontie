import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, FileText } from 'lucide-react';
import { PatchNoteItem } from '@/lib/content-store';
import { cn } from '@/lib/utils';
import { formatDate } from '@/components/home/dynamic-content/utils';

interface PatchNoteCardProps {
  item: PatchNoteItem;
  onClick: () => void;
  index?: number;
}

export function PatchNoteCard({ item, onClick, index = 0 }: PatchNoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative bg-card/50 hover:bg-card border border-border/50 hover:border-primary/50 rounded-lg p-6 cursor-pointer transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <FileText className="w-24 h-24 text-primary" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Version Badge */}
        <div className="shrink-0 flex flex-col items-center justify-center bg-background/50 border border-border rounded-lg p-4 min-w-[100px] text-center group-hover:border-primary/50 transition-colors">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Version</span>
          <span className="text-2xl font-display font-bold text-primary">{item.version}</span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(item.date)}
            </span>
            {item.category && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="uppercase tracking-wider text-primary/80">{item.category}</span>
              </>
            )}
          </div>

          <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {item.subtitle && (
            <p className="text-muted-foreground text-sm line-clamp-2 max-w-3xl">
              {item.subtitle}
            </p>
          )}
        </div>

        <div className="shrink-0 mt-4 md:mt-0">
          <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
            Read Notes <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}
