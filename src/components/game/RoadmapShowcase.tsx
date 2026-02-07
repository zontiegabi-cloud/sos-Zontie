import { RoadmapItem } from "@/lib/content-store";
import { cn } from "@/lib/utils";
import { Check, Clock, Square, Play, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RoadmapShowcaseProps {
  items: RoadmapItem[];
}

export function RoadmapShowcase({ items }: RoadmapShowcaseProps) {
  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; title: string } | null>(null);

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  return (
    <>
      <div className="relative py-12 space-y-24">
         {sortedItems.map((item, index) => {
            const isPhaseComplete = item.tasks.length > 0 
               ? item.tasks.every(t => t.status === 'completed')
               : item.status === 'completed';
  
            // Determine if this step is "active" (reached in the sequence)
            const isReached = index === 0 
               ? true 
               : (sortedItems[index-1].tasks.length > 0 
                   ? sortedItems[index-1].tasks.every(t => t.status === 'completed')
                   : sortedItems[index-1].status === 'completed');

            const isClickable = item.status === 'completed' || item.status === 'in-progress';
  
            return (
               <div key={item.id} className="relative grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-start">
                  
                  {/* Left Side: Image */}
                  <div className="w-full">
                     {item.image ? (
                        <div 
                           className={cn(
                              "relative aspect-video rounded overflow-hidden border shadow-2xl bg-black/40 group transition-colors duration-500",
                              isClickable ? "cursor-pointer" : "cursor-default",
                              item.status === 'in-progress' ? "animate-pulsate-shadow" : "",
                              isReached ? "border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.4)]" : "border-border/50"
                           )}
                           onClick={() => isClickable && setSelectedMedia({ url: item.image!, title: item.title })}
                        >
                           <img 
                              src={item.image} 
                              alt={item.title} 
                              className={cn(
                                 "w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
                                 !isReached && "grayscale opacity-50"
                              )} 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                           
                           {/* Hover Overlay with Icon */}
                           {isClickable && (
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                 <div className="bg-black/60 p-3 rounded-full border border-primary/50 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <Maximize2 className="w-6 h-6 text-primary" />
                                 </div>
                              </div>
                           )}

                           <div className="absolute bottom-4 left-4">
                              <h4 className={cn("font-bold uppercase tracking-wider text-sm", isReached ? "text-primary" : "text-white")}>{item.phase}</h4>
                              <p className="text-white/70 text-xs">{item.title}</p>
                           </div>
                        </div>
                     ) : (
                        <div className={cn(
                           "aspect-video rounded border border-dashed flex items-center justify-center transition-colors duration-500",
                           isReached ? "border-primary/30 bg-primary/5" : "border-muted-foreground/30 bg-muted/5"
                        )}>
                           <div className="text-center p-4">
                              <div className="text-muted-foreground font-mono text-sm uppercase mb-2">No Image</div>
                              <div className="text-xs text-muted-foreground/50">{item.phase}</div>
                           </div>
                        </div>
                     )}
                  </div>
  
                  {/* Center: Timeline Line */}
                  <div className="hidden md:flex flex-col items-center h-full relative">
                     {/* Vertical Line */}
                     <div className={cn(
                        "absolute top-0 bottom-[-6rem] w-1 last:bottom-0 transition-colors duration-500",
                        isPhaseComplete ? "bg-primary/70 shadow-[0_0_20px_hsl(var(--primary)/0.6)]" : "bg-black/70"
                     )} />
                     
                     {/* Number Box */}
                     <div className={cn(
                        "w-10 h-10 bg-black border-2 font-black font-mono flex items-center justify-center z-10 text-lg transition-all duration-500",
                        isReached 
                          ? "border-primary/40 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.6)] scale-100" 
                          : "border-muted-foreground/30 text-muted-foreground scale-90"
                     )}>
                        {index + 1}
                     </div>
                  </div>
  
                  {/* Right Side: Content */}
                  <div className="w-full pt-1">
                     <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-2xl font-black uppercase tracking-wider text-foreground">{item.title}</h3>
                           {item.status === 'completed'&& <span className="w-2 h-2 bg-primary rounded-full"> </span>}
                           {item.status === 'completed' && <span className="text-xs bg-primary text-black px-1.5 py-0.5 font-bold uppercase">Completed</span>}
                           {item.status === 'in-progress'&& <span className="w-2 h-2 bg-accent rounded-full"> </span>}
                           {item.status === 'in-progress' && <span className="text-xs bg-accent text-black px-1.5 py-0.5 font-bold uppercase animate-pulse">Work in Progress</span>}
                           {item.status === 'planned'&&<span className="w-2 h-2 bg-gray-700 rounded-full"> </span>}
                           {item.status === 'planned'&&<span className="text-xs bg-gray-700 text-white px-1.5 py-0.5 font-bold uppercase">PLANNED</span>}
                           {item.status === 'delayed'&& <span className="w-2 h-2 bg-yellow-300 rounded-full"> </span>}
                           {item.status === 'delayed' && <span className="text-xs bg-yellow-300 text-black px-1.5 py-0.5 font-bold uppercase">DELAYED</span> }
                        </div>
                        
                        <div className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-4">
                           <span>{item.date}</span>
                           
                        </div>
  
                        {item.description && (
                           <p className="text-muted-foreground leading-relaxed text-lg border-l-2 border-accent/50 pl-4 mb-6">
                              {item.description}
                           </p>
                        )}
                     </div>
  
                     {/* Tasks List */}
                     <div className="space-y-4">
                        {item.tasks.map(task => (
                           <div key={task.id} className="flex gap-3 items-start group">
                              <div className="mt-1 shrink-0">
                                 {task.status === 'completed' ? (
                                    <div className="w-6 h-6 bg-primary flex items-center justify-center text-black shadow-[0_0_10px_hsl(var(--primary)/0.6)]">
                                       <Check className="w-4 h-4 stroke-[3.5]" />
                                    </div>
                                 ) : task.status === 'in-progress' ? (
                                    <div className="w-6 h-6 border border-accent flex items-center justify-center">
                                       <div className="w-2 h-2 bg-accent animate-pulse" />
                                    </div>
                                 ) : (
                                    <div className="w-6 h-6 border border-muted-foreground/30 bg-muted/10" />
                                 )}
                              </div>
                              <span className={cn(
                                 "text-2xl font-medium transition-colors",
                                 task.status === 'completed' ? "text-muted-foreground/90 line-through decoration-primary/100" : "text-foreground group-hover:text-primary"
                              )}>
                                 {task.text}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            );
         })}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl bg-black/95 border-primary/20 p-1 overflow-hidden sm:rounded-xl">
          <DialogTitle className="sr-only">{selectedMedia?.title}</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center min-h-[300px] bg-black/50 rounded-lg overflow-hidden">
             {selectedMedia && (isVideo(selectedMedia.url) ? (
               <video 
                 src={selectedMedia.url} 
                 controls 
                 autoPlay 
                 className="max-h-[85vh] w-full object-contain"
               />
             ) : (
               <img 
                 src={selectedMedia.url} 
                 alt={selectedMedia.title} 
                 className="max-h-[85vh] w-full object-contain" 
               />
             ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
