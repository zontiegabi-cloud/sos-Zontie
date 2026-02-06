import React from 'react';
import { motion } from "framer-motion";
import { Calendar, Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RoadmapItem } from "@/lib/content-store";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
  item: RoadmapItem;
  className?: string;
}

export function RoadmapCard({ item, className }: RoadmapCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delayed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-3 h-3" />;
      case 'in-progress': return <Circle className="w-3 h-3 fill-current" />;
      case 'delayed': return <Circle className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  return (
    <Card className={cn("group relative overflow-hidden hover:border-primary transition-colors h-full", className)}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{item.phase}</span>
            <h3 className="text-xl font-bold font-heading">{item.title}</h3>
          </div>
          <Badge variant="outline" className={cn("shrink-0", getStatusColor(item.status))}>
            {item.status.replace('-', ' ')}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="w-4 h-4" />
          {item.date}
        </div>

        <p className="text-sm text-muted-foreground mb-6 flex-1">{item.description}</p>
        
        <div className="space-y-2">
          {item.tasks.map(task => (
            <div key={task.id} className="flex items-start gap-2 text-sm">
              <div className={cn(
                "mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0 border",
                task.status === 'completed' 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-muted/50 border-muted-foreground/30 text-muted-foreground"
              )}>
                {task.status === 'completed' && <Check className="w-2.5 h-2.5" />}
              </div>
              <span className={cn(
                task.status === 'completed' ? "text-foreground" : "text-muted-foreground",
                task.status === 'pending' && "opacity-70"
              )}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
