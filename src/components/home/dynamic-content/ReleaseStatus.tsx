import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoadmapItem } from '@/lib/content-store';
import { cn } from '@/lib/utils';
import { Clock, Calendar, CheckCircle2, AlertTriangle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReleaseStatusProps {
  items: RoadmapItem[];
  source?: {
    forceFullWidth?: boolean;
    primaryButtonLink?: string;
    secondaryButtonLink?: string;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
  } | null;
  onView?: (item: RoadmapItem) => void;
}

export function ReleaseStatus({ items, source, onView }: ReleaseStatusProps) {
  // Find the most relevant item (e.g., "In Progress" or "Released" or specifically flagged)
  // For now, let's take the first item that is NOT "Planned" or the first item generally.
  // Ideally, this component would filter for a specific "Release" category or status.
  
  const targetItem = items.find(i => i.status === 'in-progress' || i.status === 'released') || items[0];

  if (!targetItem) return null;

  const isReleased = targetItem.status === 'released';
  const statusColor = isReleased ? 'text-green-500' : 'text-amber-500';
  const statusBg = isReleased ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20';
  const statusIcon = isReleased ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />;

  const isFullWidth = source?.forceFullWidth;

  const handlePrimaryClick = () => {
    if (source?.primaryButtonLink) {
      window.open(source.primaryButtonLink, '_blank');
    } else {
      onView?.(targetItem);
    }
  };

  const handleSecondaryClick = () => {
    if (source?.secondaryButtonLink) {
      window.open(source.secondaryButtonLink, '_blank');
    } else {
      onView?.(targetItem);
    }
  };

  return (
    <div className={cn("w-full", isFullWidth && "w-screen ml-[calc(-50vw+50%)]")}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "relative overflow-hidden border p-6 md:p-10",
          isFullWidth ? "rounded-none border-x-0" : "rounded-xl",
          statusBg
        )}
      >
        {/* Background Image with Overlay */}
        {targetItem.image && (
          <div className="absolute inset-0 z-0 opacity-20">
             <img src={targetItem.image} alt="" className="w-full h-full object-cover grayscale" />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>
        )}

        <div className={cn(
            "relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
            isFullWidth && "container mx-auto"
        )}>
          <div className="flex-1 space-y-4">
            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background/50 backdrop-blur-sm text-sm font-bold uppercase tracking-widest", statusColor, isReleased ? "border-green-500/30" : "border-amber-500/30")}>
              {statusIcon}
              {targetItem.status.replace('-', ' ')}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display uppercase leading-none">
              {targetItem.title}
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {targetItem.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-lg border border-border/50">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-mono">{targetItem.date}</span>
              </div>
              {targetItem.category && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-lg border border-border/50">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="uppercase tracking-wider text-xs font-bold">{targetItem.category}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
             {(isReleased || source?.primaryButtonLabel) && (
               <Button 
                 size="lg" 
                 className={cn(
                    "w-full md:w-auto text-lg font-bold uppercase tracking-widest h-14 px-8 shadow-lg transition-all border-none z-20 relative",
                    isReleased ? "shadow-green-500/20 hover:shadow-green-500/40 bg-green-600 hover:bg-green-700" : "shadow-primary/20 hover:shadow-primary/40 bg-primary hover:bg-primary/90"
                 )}
                 onClick={handlePrimaryClick}
               >
                 <PlayCircle className="w-6 h-6 mr-2" />
                 {source?.primaryButtonLabel || (isReleased ? "Play Now" : "View Details")}
               </Button>
             )}
             
             {(!isReleased || source?.secondaryButtonLabel) && (
               <Button 
                 size="lg" 
                 variant="outline" 
                 className="w-full md:w-auto text-lg font-bold uppercase tracking-widest h-14 px-8 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 z-20 relative"
                 onClick={handleSecondaryClick}
               >
                 <AlertTriangle className="w-5 h-5 mr-2" />
                 {source?.secondaryButtonLabel || (isReleased ? "Release Notes" : "View Details")}
               </Button>
             )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Countdown Component
export function CountdownTimer({ targetDate, title }: { targetDate: string, title?: string }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center mx-2 md:mx-4">
        <span className="text-3xl md:text-5xl font-mono font-bold text-primary tabular-nums">
          {timeLeft[interval as keyof typeof timeLeft]}
        </span>
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mt-1">
          {interval}
        </span>
      </div>
    );
  });

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center bg-black/40 border-y border-white/5 backdrop-blur-sm">
      {title && (
        <h3 className="text-xl md:text-2xl font-display uppercase tracking-widest mb-8 text-center px-4">
          {title}
        </h3>
      )}
      <div className="flex flex-wrap justify-center items-center">
        {timerComponents.length ? timerComponents : <span className="text-2xl font-bold text-primary">AVAILABLE NOW</span>}
      </div>
    </div>
  );
}
