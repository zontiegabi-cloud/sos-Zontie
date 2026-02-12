import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DiscordWidgetProps {
  serverId?: string;
  className?: string;
}

export function DiscordWidget({ serverId, className }: DiscordWidgetProps) {
  if (!serverId) {
    return (
      <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground bg-muted/20">
        <p>Please configure a Discord Server ID in the section editor.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("w-full h-[500px] rounded-xl overflow-hidden shadow-2xl border border-border/50", className)}
    >
      <iframe 
        src={`https://discord.com/widget?id=${serverId}&theme=dark`} 
        width="100%" 
        height="100%" 
        allowTransparency={true} 
        frameBorder="0" 
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        title="Discord Widget"
      />
    </motion.div>
  );
}
