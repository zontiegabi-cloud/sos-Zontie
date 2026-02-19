import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DiscordWidgetProps {
  serverId?: string;
  channelId?: string;
  displayMode?: 'discord-widget' | 'discord-chat' | 'discord-lfg' | 'discord-recruitment' | 'discord-fan-art' | string;
  className?: string;
}

export function DiscordWidget({ serverId, channelId, displayMode, className }: DiscordWidgetProps) {
  if (!serverId) {
    return (
      <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground bg-muted/20">
        <p>Please configure a Discord Server ID in the section editor.</p>
      </div>
    );
  }

  // Handle WidgetBot / TitanWidget integration for enhanced features
  if (['discord-chat', 'discord-lfg', 'discord-recruitment', 'discord-fan-art'].includes(displayMode || '')) {
    const channelAttr = channelId ? `channel="${channelId}"` : '';
    
    // We'll use WidgetBot for interactive chat/lfg features
    // For recruitment/fan-art, we can also use WidgetBot but locked to specific channels
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn("w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-[#313338]", className)}
      >
        <iframe
          src={`https://e.widgetbot.io/channels/${serverId}${channelId ? `/${channelId}` : ''}`}
          width="100%"
          height="100%"
          allowTransparency={true}
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          title={`Discord ${displayMode}`}
        />
      </motion.div>
    );
  }

  // Fallback to standard Discord Widget
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
