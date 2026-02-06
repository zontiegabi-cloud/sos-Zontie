import { RoadmapItem } from "@/lib/content-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RoadmapTimelineProps {
  items: RoadmapItem[];
}

export function RoadmapTimeline({ items }: RoadmapTimelineProps) {
  // Sort by order
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-16 py-8">
      {sortedItems.map((item, index) => {
         // calculate progress based on tasks
         const totalTasks = item.tasks.length;
         const completedTasks = item.tasks.filter(t => t.status === 'completed').length;
         const progress = totalTasks === 0 ? (item.status === 'completed' ? 100 : 0) : (completedTasks / totalTasks) * 100;
         
         const isCompleted = item.status === 'completed';
         const isInProgress = item.status === 'in-progress';
         
         return (
            <div key={item.id} className="relative">
               {/* Header */}
               <div className="mb-6">
                  <h3 className="text-4xl font-black uppercase tracking-wider mb-4 font-display">{item.phase}</h3>
                  <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm max-w-3xl mb-4">
                     <div>
                        <span className="block text-muted-foreground text-xs uppercase tracking-widest mb-1 font-bold">ETA</span>
                        <span className="font-mono font-medium text-lg">{item.date}</span>
                     </div>
                     <div>
                         <span className="block text-muted-foreground text-xs uppercase tracking-widest mb-1 font-bold">Status</span>
                         <span className={cn(
                            "font-bold uppercase text-lg",
                            isCompleted ? "text-green-500" : isInProgress ? "text-yellow-500" : "text-muted-foreground"
                         )}>
                            {item.status.replace('-', ' ')}
                            {isInProgress && "..."}
                            {isCompleted && "!"}
                         </span>
                     </div>
                  </div>
               </div>

               {/* Progress Bar */}
               <div className="h-6 bg-secondary/20 w-full relative overflow-hidden">
                  <motion.div 
                     className={cn("h-full", isCompleted ? "bg-green-500" : isInProgress ? "bg-yellow-500" : "bg-muted-foreground")}
                     initial={{ width: 0 }}
                     whileInView={{ width: `${progress}%` }}
                     viewport={{ once: true }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Grid lines for decoration */}
                  <div className="absolute inset-0 flex justify-between px-[20%] pointer-events-none opacity-20">
                     <div className="w-px h-full bg-foreground" />
                     <div className="w-px h-full bg-foreground" />
                     <div className="w-px h-full bg-foreground" />
                     <div className="w-px h-full bg-foreground" />
                  </div>
               </div>
               
               {/* Stats below bar */}
               <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
               </div>

               {item.description && (
                  <p className="mt-6 text-muted-foreground max-w-3xl text-lg leading-relaxed">{item.description}</p>
               )}
            </div>
         );
      })}
    </div>
  );
}
