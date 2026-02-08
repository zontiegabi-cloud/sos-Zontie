import { useState, useEffect } from "react";
import { ClassItem, SpecializationNode, WeaponItem } from "@/lib/content-store";
import { useContent } from "@/hooks/use-content";
import { iconMap } from "@/lib/icon-map";
import { motion, AnimatePresence } from "framer-motion";
import { ClassesContentCard } from "./ClassesContentCard";
import { ChevronDown, Hexagon, Square, Zap, ChevronRight, Crosshair, Shield, Activity, Radio, Cpu, Terminal, Target, Swords, Skull, Grid, Lock, BarChart, Database, Network, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type InteractiveClassListVariant = 'default' | 'hex-tech' | 'operator' | 'vanguard' | 'command';

const WeaponPreviewPanel = ({ weapon, mousePos, previewMode }: { weapon: WeaponItem | null, mousePos: { x: number, y: number }, previewMode: 'follow' | 'fixed' }) => {
   if (!weapon) return null;
   
   // Dynamic positioning based on mode
   const style = previewMode === 'fixed' 
      ? { bottom: '40px', right: '40px' } 
      : { 
          left: Math.min(mousePos.x + 20, window.innerWidth - 820), 
          top: Math.min(mousePos.y + 20, window.innerHeight - 850) 
        };

   return (
      <motion.div 
         initial={{ opacity: 0, scale: 0.95, pointerEvents: 'none' }}
         animate={{ opacity: 1, scale: 1, pointerEvents: 'auto' }}
         exit={{ opacity: 0, scale: 0.95, pointerEvents: 'none' }}
         transition={{ duration: 0.2, ease: "circOut" }}
         className="fixed z-[100] w-[400px] bg-background/95 border border-primary/20 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden pointer-events-none"
         style={style}
      >
            <div className="grid grid-cols-1 gap-0">
               {/* Top: Image */}
               <div className="relative h-[210px] bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-12 border-b border-border/50">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                  <img 
                     src={weapon.image} 
                     alt={weapon.name} 
                     className="relative z-10 max-w-full max-h-[210px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  />
                  <div className="absolute bottom-6 left-6">
                     <Badge variant="outline" className="bg-background/50 backdrop-blur border-primary/30 text-primary px-3 py-1 text-sm">
                        {weapon.category}
                     </Badge>
                  </div>
               </div>
               
               {/* Bottom: Info */}
               <div className="p-8 space-y-8">
                  <div>
                     <h2 className="text-7xl font-black uppercase tracking-tighter mb-4 leading-none">{weapon.name}</h2>
                     <p className="text-2xl text-muted-foreground leading-relaxed line-clamp-3">{weapon.description}</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <BarChart className="w-4 h-4" /> Performance
                     </h3>
                     <div className="grid gap-3">
                        {[
                           { label: 'Damage', value: weapon.stats.damage },
                           { label: 'Fire Rate', value: weapon.stats.fireRate },
                           { label: 'Range', value: weapon.stats.range },
                           { label: 'Accuracy', value: weapon.stats.accuracy },
                           { label: 'Mobility', value: weapon.stats.mobility },
                           { label: 'Control', value: weapon.stats.control },
                        ].map((stat, i) => (
                           <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                 <span>{stat.label}</span>
                                 <span>{stat.value}%</span>
                              </div>
                              <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.value}%` }}
                                    transition={{ duration: 0.5, delay: 0.1 * i }}
                                    className="h-full bg-primary"
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  {/* Features / Attachments */}
                  {weapon.attachments && weapon.attachments.length > 0 && (
                     <div className="pt-4 border-t border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                           <Zap className="w-4 h-4" /> Attachments
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {weapon.attachments.map((attachment, i) => (
                              <Badge key={i} variant="secondary" className="text-xs px-2 py-1 h-auto">
                                 {attachment.name}
                              </Badge>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
      </motion.div>
   );
};

// Weapon Detail Modal Component
const WeaponDetailDialog = ({ weapon, open, onOpenChange }: { weapon: WeaponItem, open: boolean, onOpenChange: (open: boolean) => void }) => {
   if (!weapon) return null;
   
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 border-primary/20 backdrop-blur-xl">
            <div className="grid md:grid-cols-2 gap-0">
               {/* Left: Image */}
               <div className="relative h-[300px] md:h-auto bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-border/50">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                  <img 
                     src={weapon.image} 
                     alt={weapon.name} 
                     className="relative z-10 max-w-full max-h-[300px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  />
                  <div className="absolute bottom-4 left-4">
                     <Badge variant="outline" className="bg-background/50 backdrop-blur border-primary/30 text-primary">
                        {weapon.category}
                     </Badge>
                  </div>
               </div>
               
               {/* Right: Info */}
               <div className="p-8 space-y-6">
                  <div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{weapon.name}</h2>
                     <p className="text-muted-foreground leading-relaxed">{weapon.description}</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <BarChart className="w-4 h-4" /> Performance
                     </h3>
                     <div className="grid gap-4">
                        {[
                           { label: 'Damage', value: weapon.stats.damage },
                           { label: 'Fire Rate', value: weapon.stats.fireRate },
                           { label: 'Range', value: weapon.stats.range },
                           { label: 'Accuracy', value: weapon.stats.accuracy },
                           { label: 'Mobility', value: weapon.stats.mobility },
                           { label: 'Control', value: weapon.stats.control },
                        ].map((stat, i) => (
                           <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                 <span>{stat.label}</span>
                                 <span>{stat.value}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.value}%` }}
                                    transition={{ duration: 0.5, delay: 0.1 * i }}
                                    className="h-full bg-primary"
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  {/* Features / Attachments */}
                  {weapon.attachments && weapon.attachments.length > 0 && (
                     <div className="pt-4 border-t border-border/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                           <Zap className="w-4 h-4" /> Attachments
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {weapon.attachments.map((attachment, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                 {attachment.name}
                              </Badge>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
};

const TreeView = ({ nodes, isRoot = true, variant = 'default', onHoverWeapon }: { nodes: SpecializationNode[], isRoot?: boolean, variant?: InteractiveClassListVariant, onHoverWeapon?: (w: WeaponItem | null) => void }) => {
  const isHex = variant === 'hex-tech'; // Elite
  const isOperator = variant === 'operator';
  const isVanguard = variant === 'vanguard';
  const isCommand = variant === 'command';
  
  const { weapons } = useContent();
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponItem | null>(null);

  return (
    <>
      <div className={`space-y-2 ${!isRoot ? 'ml-2 pl-4 border-l mt-2' : 'mt-2'} ${
         isVanguard ? 'border-primary/40' : 
         isCommand ? 'border-primary/40' :
         'border-primary/20'
      }`}>
        {nodes.map(node => {
          const hasChildren = node.children && node.children.length > 0;
          const isLinked = node.linkedContentId && node.linkedContentType === 'weapon';
          
          return (
            <div key={node.id} className="relative">
               {/* Connector line for nested items */}
               {!isRoot && (
                  <div className={`absolute -left-4 top-3 w-3 h-px ${
                     isVanguard ? 'bg-primary/40' : 
                     isCommand ? 'bg-primary/40' :
                     'bg-primary/20'
                  }`} />
               )}

              <div className="group">
                <div 
                   className={`flex items-start gap-3 py-1 ${isLinked ? 'cursor-pointer' : ''}`}
                   onClick={() => {
                      if (isLinked) {
                         const weapon = weapons.find(w => w.id === node.linkedContentId);
                         if (weapon) setSelectedWeapon(weapon);
                      }
                   }}
                   onMouseEnter={() => {
                      if (isLinked && onHoverWeapon) {
                         const weapon = weapons.find(w => w.id === node.linkedContentId);
                         if (weapon) onHoverWeapon(weapon);
                      }
                   }}
                   onMouseLeave={() => {
                      if (isLinked && onHoverWeapon) {
                         onHoverWeapon(null);
                      }
                   }}
                >
                  {/* Tech Icon Marker */}
                  <div className={`mt-1 flex-shrink-0 transition-colors duration-300 ${
                     hasChildren 
                        ? (isVanguard ? 'text-primary' : isCommand ? 'text-primary' : 'text-primary') 
                        : (isLinked ? 'text-primary animate-pulse' : 'text-muted-foreground group-hover:text-foreground')
                  }`}>
                     {hasChildren ? (
                        isVanguard ? <Swords className="w-4 h-4" /> :
                        isCommand ? <Radio className="w-4 h-4" /> :
                        isHex ? <Target className="w-4 h-4" /> :
                        isOperator ? <Crosshair className="w-4 h-4" /> :
                        <Hexagon className="w-4 h-4 fill-primary/10" />
                     ) : (
                        <Square className={`w-2 h-2 ${isVanguard ? 'rotate-45' : 'rotate-45'} mt-1`} />
                     )}
                  </div>
                  
                  <div className="flex-1">
                     <span className={`text-sm tracking-wide transition-colors duration-300 flex items-center gap-2 ${
                        hasChildren 
                           ? `font-bold uppercase text-xs ${
                              isVanguard ? 'text-foreground' : 
                              isCommand ? 'text-foreground' : 
                              'text-foreground'}`
                           : (isLinked ? 'text-primary font-bold group-hover:text-primary/80 underline decoration-dashed underline-offset-4' : 'text-muted-foreground group-hover:text-foreground font-medium')
                     } ${isOperator || isHex || isVanguard || isCommand ? 'font-mono' : ''}`}>
                        {(() => {
                           if (isLinked) {
                              const linkedWeapon = weapons.find(w => w.id === node.linkedContentId);
                              if (linkedWeapon) return linkedWeapon.name;
                           }
                           return node.label;
                        })()}
                        {isLinked && <Info className="w-3 h-3 opacity-50" />}
                     </span>
                     
                     {hasChildren && (
                       <TreeView nodes={node.children!} isRoot={false} variant={variant} onHoverWeapon={onHoverWeapon} />
                     )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedWeapon && (
         <WeaponDetailDialog 
            weapon={selectedWeapon} 
            open={!!selectedWeapon} 
            onOpenChange={(open) => !open && setSelectedWeapon(null)} 
         />
      )}
    </>
  );
};

// --- Standard Layout ---
const StandardLayout = ({ selectedClass, expandedSlotId, setExpandedSlotId, onHoverWeapon }: any) => {
   const { weapons } = useContent();

   return (
      <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden p-6 md:p-12 relative mt-8">
         {/* Role Badge */}
         <div className="absolute top-6 right-6 z-20">
            <div className="px-3 py-1 bg-accent/90 text-accent-foreground text-xs font-heading uppercase tracking-wide rounded shadow-lg">
               {selectedClass.role}
            </div>
         </div>

         <div className="grid md:grid-cols-2 gap-12 items-start relative z-10">
            {/* Left: Character Image */}
            <div className="relative h-[600px] flex items-center justify-center">
               {selectedClass.detailedImage || selectedClass.image ? (
                  <img 
                     src={selectedClass.detailedImage || selectedClass.image} 
                     alt={selectedClass.name} 
                     className="max-h-full w-auto object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                     <span className="text-muted-foreground">No Image Available</span>
                  </div>
               )}
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
               {/* Title */}
               <div>
                  <h2 className="text-5xl md:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-primary/50 mb-2 filter drop-shadow-lg"
                      style={{ WebkitTextStroke: "1px hsl(var(--primary))" }}>
                     {selectedClass.name}
                  </h2>
                  <div className="h-1 w-24 bg-primary rounded-full" />
               </div>

               {/* Description */}
               <div>
                  <h3 className="text-xl font-bold text-foreground uppercase mb-3 flex items-center gap-2">
                     Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                     {selectedClass.description}
                  </p>
               </div>

               {/* Detailed Info */}
               {(selectedClass.details?.length > 0 || selectedClass.devices?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-black/20 rounded-xl border border-white/5">
                     {selectedClass.details?.length > 0 && (
                        <div>
                           <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Activity className="w-4 h-4" /> Tactical Intel
                           </h3>
                           <ul className="space-y-3">
                              {selectedClass.details.map((detail: string, i: number) => (
                                 <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <span className="leading-relaxed">{detail}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}
                     
                     {selectedClass.devices?.length > 0 && (
                        <div>
                           <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Cpu className="w-4 h-4" /> Class Devices
                           </h3>
                           <div className="grid grid-cols-1 gap-3">
                              {selectedClass.devices.map((device: any, i: number) => {
                                 const Icon = iconMap[device.icon] || Zap;
                                 return (
                                    <div key={i} className="bg-card/50 border border-white/5 rounded-lg p-3 flex items-center gap-3">
                                       <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                          <Icon className="w-4 h-4" />
                                       </div>
                                       <span className="text-sm font-medium text-foreground">{device.name}</span>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     )}
                  </div>
               )}

               {/* Specializations Table */}
               <div>
                  <h3 className="text-xl font-bold text-foreground uppercase mb-4 flex items-center gap-2">
                     Specializations
                  </h3>
                  
                  {/* Table Header */}
                  <div className="flex w-full border-b border-primary/20 pb-2 mb-2 px-2">
                     <div className="w-1/3 text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-70">Slot</div>
                     <div className="w-2/3 text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-70">Item</div>
                  </div>

                  <div className="space-y-1">
                     {(selectedClass.specializations || []).length > 0 ? (
                        selectedClass.specializations!.map((spec: any, idx: number) => {
                           const uniqueId = spec.id || `spec-${idx}`;
                        const treeNodes = spec.tree || (spec.item ? [{ id: 'legacy', label: spec.item, children: [] }] : []);
                        
                        let firstItemLabel = treeNodes.length > 0 ? treeNodes[0].label : null;
                        let slotLabel = spec.slot;

                        // Overwrite label if linked to a weapon
                        if (treeNodes.length > 0 && treeNodes[0].linkedContentId && treeNodes[0].linkedContentType === 'weapon') {
                           const linkedWeapon = weapons.find(w => w.id === treeNodes[0].linkedContentId);
                           if (linkedWeapon) {
                              firstItemLabel = linkedWeapon.name;
                              slotLabel = slotLabel;
                           }
                        }

                        const hasMultipleItems = treeNodes.length > 1 || (treeNodes.length === 1 && (treeNodes[0].children?.length || 0) > 0);
                        
                        return (
                              <div key={uniqueId} className="border-b border-white/5 last:border-0">
                                 <button 
                                    onClick={() => hasMultipleItems && setExpandedSlotId(expandedSlotId === uniqueId ? null : uniqueId)}
                                    className={`w-full flex items-start py-3 px-2 transition-colors text-left group ${
                                       hasMultipleItems ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'
                                    }`}
                                 >
                                    <div className="w-1/3 pr-4">
                                       <span className={`font-bold uppercase text-primary/90 text-sm tracking-wide transition-colors block ${
                                          hasMultipleItems ? 'group-hover:text-primary' : ''
                                       }`}>
                                          {slotLabel}
                                       </span>
                                    </div>
                                    <div className="w-2/3 flex items-start justify-between gap-4">
                                       <span className={`text-sm transition-all duration-300 ${
                                          expandedSlotId === uniqueId 
                                             ? 'opacity-0 h-0 overflow-hidden' 
                                             : `text-muted-foreground opacity-100 ${hasMultipleItems ? 'group-hover:text-foreground/90' : ''}`
                                       }`}>
                                          {firstItemLabel || <span className="italic opacity-50">Empty</span>}
                                       </span>
                                       {hasMultipleItems && (
                                          <ChevronDown className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-300 flex-shrink-0 mt-0.5 ml-auto ${
                                             expandedSlotId === uniqueId ? 'rotate-180 text-primary' : ''
                                          }`} />
                                       )}
                                    </div>
                                 </button>
                                 <AnimatePresence>
                                    {expandedSlotId === uniqueId && treeNodes.length > 0 && (
                                       <motion.div 
                                          initial={{ height: 0, opacity: 0 }} 
                                          animate={{ height: 'auto', opacity: 1 }} 
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.3, ease: "easeInOut" }}
                                          className="overflow-hidden relative"
                                       >
                                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50" />
                                          <div className="pl-[33.33%] pr-4 pb-4 pt-0 relative z-10">
                                             <div className="pl-0">
                                                <TreeView nodes={treeNodes} onHoverWeapon={onHoverWeapon} />
                                             </div>
                                          </div>
                                       </motion.div>
                                    )}
                                 </AnimatePresence>
                              </div>
                           );
                        })
                     ) : (
                        <div className="p-6 text-center text-muted-foreground text-sm italic border border-white/5 rounded-lg bg-black/20">
                           No specializations configured for this class.
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// --- Elite Layout (Replaces Hex-Tech) ---
const EliteLayout = ({ selectedClass, expandedSlotId, setExpandedSlotId, onHoverWeapon }: any) => {
   const { weapons } = useContent();

   return (
      <div className="relative mt-8 group overflow-hidden rounded-xl border border-white/10 bg-black/80 shadow-2xl">
         {/* Background Elements */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-black/0 to-black/0 opacity-50" />
         <div className="absolute -left-32 -top-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="grid lg:grid-cols-12 min-h-[600px] relative z-10">
            {/* Left Column: Visuals */}
            <div className="lg:col-span-5 relative flex flex-col justify-end p-8 lg:p-12 overflow-hidden">
               {/* Character Image */}
               <div className="absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-12 opacity-80 lg:opacity-100 transition-opacity duration-500">
                   {selectedClass.detailedImage || selectedClass.image ? (
                     <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        src={selectedClass.detailedImage || selectedClass.image} 
                        alt={selectedClass.name} 
                        className="h-full w-auto object-cover lg:object-contain object-top mask-image-gradient"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg">
                        <span className="text-white/20 font-mono">NO VISUAL ASSET</span>
                     </div>
                   )}
               </div>
               
               {/* Gradient Overlay for Text Readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/80" />
            </div>

            {/* Right Column: Data */}
            <div className="lg:col-span-7 p-6 md:p-12 flex flex-col justify-center space-y-8 bg-black/40 backdrop-blur-sm lg:bg-transparent">
               {/* Header */}
               <div className="space-y-2 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                     <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Class Classified
                     </span>
                     <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        // {selectedClass.role}
                     </span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                     {selectedClass.name}
                  </h2>
               </div>

               {/* Stats / Info */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                           <Activity className="w-3 h-3" /> Profile
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                           {selectedClass.description}
                        </p>
                     </div>
                     
                     {selectedClass.details?.length > 0 && (
                        <div>
                           <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                              <Target className="w-3 h-3" /> Intel
                           </h3>
                           <ul className="space-y-1">
                              {selectedClass.details.map((detail: string, i: number) => (
                                 <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 font-mono">
                                    <span className="text-primary">&gt;</span>
                                    {detail}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}
                  </div>

                  {selectedClass.devices?.length > 0 && (
                     <div className="space-y-2">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                           <Cpu className="w-3 h-3" /> Equipment
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                           {selectedClass.devices.map((device: any, i: number) => {
                              const Icon = iconMap[device.icon] || Zap;
                              return (
                                 <div key={i} className="bg-white/5 border border-white/10 rounded p-2 flex items-center gap-3 group hover:bg-white/10 transition-colors">
                                    <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-primary group-hover:text-white transition-colors">
                                       <Icon className="w-3 h-3" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-white transition-colors">{device.name}</span>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>

               {/* Loadout Accordion */}
               <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                     <Swords className="w-3 h-3" /> Tactical Loadout
                  </h3>
                  
                  <div className="space-y-2">
                     {(selectedClass.specializations || []).map((spec: any, idx: number) => {
                        const uniqueId = spec.id || `spec-${idx}`;
                        const treeNodes = spec.tree || (spec.item ? [{ id: 'legacy', label: spec.item, children: [] }] : []);
                        
                        let firstItemLabel = treeNodes.length > 0 ? treeNodes[0].label : null;
                        let slotLabel = spec.slot;

                        // Overwrite label if linked to a weapon
                        if (treeNodes.length > 0 && treeNodes[0].linkedContentId && treeNodes[0].linkedContentType === 'weapon') {
                           const linkedWeapon = weapons.find(w => w.id === treeNodes[0].linkedContentId);
                           if (linkedWeapon) {
                              firstItemLabel = linkedWeapon.name;
                              slotLabel = slotLabel;
                           }
                        }

                        const hasMultipleItems = treeNodes.length > 1 || (treeNodes.length === 1 && (treeNodes[0].children?.length || 0) > 0);

                        return (
                           <div key={uniqueId} className={`group border transition-all duration-300 ${expandedSlotId === uniqueId ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                              <button 
                                 onClick={() => hasMultipleItems && setExpandedSlotId(expandedSlotId === uniqueId ? null : uniqueId)}
                                 className={`w-full p-4 flex items-center justify-between text-left ${hasMultipleItems ? 'cursor-pointer' : 'cursor-default'}`}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded bg-black border ${expandedSlotId === uniqueId ? 'border-primary text-primary' : 'border-white/10 text-muted-foreground'}`}>
                                       <span className="text-xs font-bold">{idx + 1}</span>
                                    </div>
                                    <div>
                                       <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{slotLabel}</div>
                                       <div className={`text-sm font-medium font-mono ${expandedSlotId === uniqueId ? 'text-primary' : 'text-white'}`}>
                                          {firstItemLabel || "EMPTY"}
                                       </div>
                                    </div>
                                 </div>
                                 {hasMultipleItems && (
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedSlotId === uniqueId ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                                 )}
                              </button>

                              <AnimatePresence>
                                 {expandedSlotId === uniqueId && treeNodes.length > 0 && (
                                    <motion.div 
                                       initial={{ height: 0, opacity: 0 }} 
                                       animate={{ height: 'auto', opacity: 1 }} 
                                       exit={{ height: 0, opacity: 0 }}
                                       className="overflow-hidden"
                                    >
                                       <div className="p-4 pt-0 pl-[4.5rem]">
                                          <div className="border-l border-primary/20 pl-4 py-2">
                                             <TreeView nodes={treeNodes} variant="hex-tech" onHoverWeapon={onHoverWeapon} />
                                          </div>
                                       </div>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// --- Operator Layout ---
const OperatorLayout = ({ selectedClass, expandedSlotId, setExpandedSlotId, onHoverWeapon }: any) => {
   const { weapons } = useContent();

   return (
      <div className="relative mt-8 bg-card border-2 border-border p-1">
         <div className="border border-primary/20 p-6 md:p-8 relative overflow-hidden bg-background">
            {/* Background Grid */}
            <div className="absolute inset-0 text-foreground" 
                 style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.05 }} />
            
            {/* Stamps */}
            <div className="absolute top-4 right-8 border-4 border-destructive/20 text-destructive/20 font-black text-6xl uppercase -rotate-12 pointer-events-none select-none z-0">
               CONFIDENTIAL
            </div>

            <div className="grid md:grid-cols-12 gap-8 relative z-10">
               {/* Header (Full Width) */}
               <div className="col-span-12 flex items-end justify-between border-b-2 border-primary/50 pb-4 mb-4">
                  <div>
                     <div className="flex items-center gap-2 text-primary/80 mb-1">
                        <Shield className="w-4 h-4" />
                        <span className="font-mono text-xs">PERSONNEL FILE // {selectedClass.id.substring(0, 8).toUpperCase()}</span>
                     </div>
                     <h2 className="text-5xl font-black text-foreground uppercase tracking-tighter font-mono">{selectedClass.name}</h2>
                  </div>
                  <div className="text-right hidden md:block">
                     <div className="text-xs text-muted-foreground font-mono">CLEARANCE LEVEL</div>
                     <div className="text-2xl font-bold text-foreground">CLASS A</div>
                  </div>
               </div>

               {/* Left: Image (Col 5) */}
               <div className="md:col-span-5 relative min-h-[400px] bg-muted/20 border border-border flex items-center justify-center overflow-hidden group">
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50" />
                  
                  {selectedClass.detailedImage || selectedClass.image ? (
                     <img 
                        src={selectedClass.detailedImage || selectedClass.image} 
                        alt={selectedClass.name} 
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                     />
                  ) : (
                     <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Crosshair className="w-12 h-12" />
                        <span className="font-mono text-xs">NO VISUAL DATA</span>
                     </div>
                  )}
               </div>

               {/* Right: Data (Col 7) */}
               <div className="md:col-span-7 space-y-8">
                  <div className="flex gap-4">
                     <div className="flex-1 bg-muted/20 p-4 border-l-2 border-primary">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Role Designation</div>
                        <div className="text-lg font-bold text-foreground uppercase">{selectedClass.role}</div>
                     </div>
                     <div className="flex-1 bg-muted/20 p-4 border-l-2 border-muted-foreground/50">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Status</div>
                        <div className="text-lg font-bold text-emerald-500 uppercase flex items-center gap-2">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active
                        </div>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-sm font-bold text-primary uppercase mb-2 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" /> Mission Profile
                     </h3>
                     <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                        {selectedClass.description}
                     </p>
                  </div>

                  <div>
                     <h3 className="text-sm font-bold text-primary uppercase mb-4 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" /> Equipment Manifest
                     </h3>
                     
                     <div className="border border-border bg-card/30">
                        {(selectedClass.specializations || []).map((spec: any, idx: number) => {
                           const uniqueId = spec.id || `spec-${idx}`;
                           const treeNodes = spec.tree || (spec.item ? [{ id: 'legacy', label: spec.item, children: [] }] : []);
                           
                           let firstItemLabel = treeNodes.length > 0 ? treeNodes[0].label : null;
                           let slotLabel = spec.slot;

                           // Overwrite label if linked to a weapon
                           if (treeNodes.length > 0 && treeNodes[0].linkedContentId && treeNodes[0].linkedContentType === 'weapon') {
                              const linkedWeapon = weapons.find(w => w.id === treeNodes[0].linkedContentId);
                              if (linkedWeapon) {
                                 firstItemLabel = linkedWeapon.name;
                                 slotLabel = slotLabel;
                              }
                           }

                           const hasMultipleItems = treeNodes.length > 1 || (treeNodes.length === 1 && (treeNodes[0].children?.length || 0) > 0);

                           return (
                              <div key={uniqueId} className="border-b border-border last:border-0">
                                 <button 
                                    onClick={() => hasMultipleItems && setExpandedSlotId(expandedSlotId === uniqueId ? null : uniqueId)}
                                    className={`w-full flex items-center p-3 hover:bg-primary/5 transition-colors text-left font-mono ${hasMultipleItems ? 'cursor-pointer' : 'cursor-default'}`}
                                 >
                                    <div className="w-32 text-xs font-bold text-muted-foreground uppercase shrink-0">{slotLabel}</div>
                                    <div className={`flex-1 text-sm ${expandedSlotId === uniqueId ? 'text-transparent' : 'text-foreground/80'}`}>
                                       {firstItemLabel || "N/A"}
                                    </div>
                                    {hasMultipleItems && (
                                       <div className="w-6 h-6 flex items-center justify-center border border-border bg-background text-primary text-xs">
                                          {expandedSlotId === uniqueId ? '-' : '+'}
                                       </div>
                                    )}
                                 </button>
                                 
                                 <AnimatePresence>
                                    {expandedSlotId === uniqueId && treeNodes.length > 0 && (
                                       <motion.div 
                                          initial={{ height: 0 }} 
                                          animate={{ height: 'auto' }} 
                                          exit={{ height: 0 }}
                                          className="overflow-hidden bg-background/50"
                                       >
                                          <div className="p-4 border-t border-dashed border-border ml-32 border-l">
                                             <TreeView nodes={treeNodes} variant="operator" onHoverWeapon={onHoverWeapon} />
                                          </div>
                                       </motion.div>
                                    )}
                                 </AnimatePresence>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// --- Vanguard Layout (New Action) ---
const VanguardLayout = ({ selectedClass, expandedSlotId, setExpandedSlotId, onHoverWeapon }: any) => {
  const { weapons } = useContent();

  return (
    <div className="relative mt-8 overflow-hidden rounded-xl border-none">
       {/* Dynamic Background */}
       <div className="absolute inset-0 bg-background/80" />
       <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(var(--primary),0.1)_20%,rgba(var(--primary),0.1)_40%,transparent_40%)]" />
       <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 origin-top-right" />
       
       <div className="grid lg:grid-cols-12 gap-0 relative z-10 min-h-[600px]">
          {/* Left: Character & Visuals (Slanted) */}
          <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden">
             {/* Slanted Container for Image */}
             <div className="absolute inset-0 lg:-skew-x-12 bg-black/20 lg:translate-x-10 border-r border-white/10 z-0" />
             
             {/* Role Text (Top) */}
             <div className="relative z-10 pt-12 pl-8 lg:pl-12 pointer-events-none">
                <h2 className="text-6xl lg:text-8xl font-black text-white/10 -skew-x-12 uppercase select-none whitespace-nowrap">
                   {selectedClass.role}
                </h2>
             </div>

             {/* Image (Bottom) */}
             <div className="relative z-20 flex-1 flex items-end justify-center lg:justify-end lg:pr-8">
                {selectedClass.detailedImage || selectedClass.image ? (
                   <motion.img 
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      src={selectedClass.detailedImage || selectedClass.image} 
                      alt={selectedClass.name} 
                      className="max-h-[500px] w-auto object-contain drop-shadow-[10px_10px_0_rgba(0,0,0,0.5)]"
                   />
                ) : (
                   <div className="flex items-center justify-center w-full h-full min-h-[300px]">
                      <span className="text-4xl font-black text-white/10 -skew-x-12 uppercase">No Visual</span>
                   </div>
                )}
             </div>
          </div>

          {/* Right: Info Panel */}
          <div className="lg:col-span-7 flex flex-col justify-center p-8 lg:p-16 space-y-8">
             {/* Header */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-1 w-12 bg-primary -skew-x-12" />
                   <span className="text-sm font-bold uppercase tracking-widest text-primary">{selectedClass.role}</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black uppercase italic tracking-tighter text-foreground transform -skew-x-6">
                   {selectedClass.name}
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-xl border-l-4 border-primary/50 pl-6 py-2">
                   {selectedClass.description}
                </p>
                
                {/* Details List */}
                {selectedClass.details?.length > 0 && (
                   <ul className="grid grid-cols-1 gap-2 pt-2 pl-6">
                      {selectedClass.details.map((detail: string, i: number) => (
                         <li key={i} className="text-sm font-mono text-primary/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary skew-x-12" /> {detail}
                         </li>
                      ))}
                   </ul>
                )}
             </div>

             {/* Stats Grid (Slanted) */}
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 max-w-md">
                   <div className="bg-card/50 p-4 -skew-x-12 border-l-2 border-primary hover:bg-primary/10 transition-colors group">
                      <div className="skew-x-12">
                         <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Status</div>
                         <div className="text-xl font-black uppercase text-foreground group-hover:text-primary transition-colors">Active</div>
                      </div>
                   </div>
                   <div className="bg-card/50 p-4 -skew-x-12 border-l-2 border-primary hover:bg-primary/10 transition-colors group">
                      <div className="skew-x-12">
                         <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Tier</div>
                         <div className="text-xl font-black uppercase text-foreground group-hover:text-primary transition-colors">Elite</div>
                      </div>
                   </div>
                </div>

                {selectedClass.devices?.length > 0 && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                      {selectedClass.devices.map((device: any, i: number) => {
                         const Icon = iconMap[device.icon] || Zap;
                         return (
                            <div key={i} className="bg-card/30 p-3 -skew-x-12 border-l-2 border-muted hover:border-primary transition-colors flex items-center gap-3">
                               <div className="skew-x-12 flex items-center gap-3">
                                  <Icon className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs font-bold uppercase tracking-wider">{device.name}</span>
                               </div>
                            </div>
                         );
                      })}
                   </div>
                )}
             </div>

             {/* Loadout (Slanted List) */}
             <div className="space-y-3 pt-4">
                <h3 className="text-xl font-black uppercase italic flex items-center gap-2 mb-4">
                   <Swords className="w-6 h-6 text-primary" /> Combat Loadout
                </h3>
                
                <div className="space-y-2">
                   {(selectedClass.specializations || []).map((spec: any, idx: number) => {
                      const uniqueId = spec.id || `spec-${idx}`;
                      const treeNodes = spec.tree || (spec.item ? [{ id: 'legacy', label: spec.item, children: [] }] : []);
                      
                      let firstItemLabel = treeNodes.length > 0 ? treeNodes[0].label : null;
                      let slotLabel = spec.slot;

                      // Overwrite label if linked to a weapon
                      if (treeNodes.length > 0 && treeNodes[0].linkedContentId && treeNodes[0].linkedContentType === 'weapon') {
                         const linkedWeapon = weapons.find(w => w.id === treeNodes[0].linkedContentId);
                         if (linkedWeapon) {
                            firstItemLabel = linkedWeapon.name;
                            slotLabel = slotLabel;
                         }
                      }

                      const hasMultipleItems = treeNodes.length > 1 || (treeNodes.length === 1 && (treeNodes[0].children?.length || 0) > 0);

                      return (
                         <div key={uniqueId} className="relative group">
                            <div className={`absolute inset-0 bg-card border border-border/50 -skew-x-12 transition-all duration-300 ${expandedSlotId === uniqueId ? 'bg-primary/10 border-primary' : 'group-hover:border-primary/50'}`} />
                            
                            <div className="relative z-10">
                               <button 
                                  onClick={() => hasMultipleItems && setExpandedSlotId(expandedSlotId === uniqueId ? null : uniqueId)}
                                  className={`w-full flex items-center justify-between p-4 text-left ${hasMultipleItems ? 'cursor-pointer' : 'cursor-default'}`}
                               >
                                  <div className="flex items-center gap-6">
                                     <span className="text-2xl font-black text-muted-foreground/30 italic group-hover:text-primary/50 transition-colors">0{idx + 1}</span>
                                     <div>
                                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">{slotLabel}</div>
                                        <div className={`text-lg font-bold uppercase ${expandedSlotId === uniqueId ? 'text-primary' : 'text-foreground'}`}>
                                           {firstItemLabel || "N/A"}
                                        </div>
                                     </div>
                                  </div>
                                  {hasMultipleItems && (
                                     <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${expandedSlotId === uniqueId ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                                  )}
                               </button>

                               <AnimatePresence>
                                  {expandedSlotId === uniqueId && treeNodes.length > 0 && (
                                     <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                     >
                                        <div className="p-4 pl-16 pb-6">
                                           <TreeView nodes={treeNodes} variant="vanguard" onHoverWeapon={onHoverWeapon} />
                                        </div>
                                     </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Command Layout (New Pro) ---
const CommandLayout = ({ selectedClass, expandedSlotId, setExpandedSlotId, onHoverWeapon }: any) => {
   const { weapons } = useContent();

   return (
      <div className="relative mt-8 p-1 bg-gradient-to-b from-border/50 to-border/10 rounded-2xl">
         <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Top Bar HUD */}
            <div className="h-12 bg-muted/30 border-b border-border flex items-center justify-between px-6">
               <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" />
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-xs font-mono text-muted-foreground">CMD_INTERFACE_V4.2</span>
               </div>
               <div className="flex items-center gap-4 text-xs font-mono text-primary">
                  <span className="animate-pulse">● LIVE FEED</span>
                  <span>{new Date().toLocaleTimeString()}</span>
               </div>
            </div>

            <div className="p-8 grid lg:grid-cols-3 gap-8 relative">
               {/* Left Panel: Stats */}
               <div className="space-y-6">
                  <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded text-primary">
                           <Target className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="text-xs text-muted-foreground font-bold uppercase">Target ID</div>
                           <div className="text-xl font-black uppercase">{selectedClass.name}</div>
                        </div>
                     </div>
                     <div className="h-px bg-border w-full my-4" />
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <div className="text-xs text-muted-foreground mb-1">Role</div>
                           <div className="font-bold">{selectedClass.role}</div>
                        </div>
                        <div>
                           <div className="text-xs text-muted-foreground mb-1">Threat Level</div>
                           <div className="font-bold text-destructive">EXTREME</div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                     <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
                        <Database className="w-4 h-4" /> Intel Brief
                     </h3>
                     <p className="text-sm leading-relaxed text-foreground/80 mb-4">
                        {selectedClass.description}
                     </p>
                     
                     {selectedClass.details?.length > 0 && (
                        <ul className="space-y-2 border-t border-border pt-4">
                           {selectedClass.details.map((detail: string, i: number) => (
                              <li key={i} className="text-xs font-mono text-primary flex items-start gap-2">
                                 <span>[DAT]</span> {detail}
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>

                  {selectedClass.devices?.length > 0 && (
                     <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center gap-2">
                           <Cpu className="w-4 h-4" /> Assets
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {selectedClass.devices.map((device: any, i: number) => {
                              const Icon = iconMap[device.icon] || Zap;
                              return (
                                 <div key={i} className="bg-muted/50 border border-border rounded px-2 py-1 flex items-center gap-2">
                                    <Icon className="w-3 h-3 text-primary" />
                                    <span className="text-xs font-bold uppercase">{device.name}</span>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>

               {/* Center: Hero Image */}
               <div className="relative h-[500px] lg:h-auto flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent rounded-lg border border-primary/10">
                  {selectedClass.detailedImage || selectedClass.image ? (
                     <motion.img 
                        key={selectedClass.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        src={selectedClass.detailedImage || selectedClass.image} 
                        alt={selectedClass.name} 
                        className="max-h-full max-w-full object-contain drop-shadow-2xl z-10"
                     />
                  ) : (
                     <div className="text-muted-foreground/30 font-black text-6xl uppercase rotate-45 select-none">
                        No Signal
                     </div>
                  )}
                  
                  {/* HUD Elements around image */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />
               </div>

               {/* Right: Loadout */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase mb-2">
                     <span className="flex items-center gap-2"><Swords className="w-4 h-4" /> Loadout Config</span>
                     <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">READY</span>
                  </div>

                  <div className="space-y-3">
                     {(selectedClass.specializations || []).map((spec: any, idx: number) => {
                        const uniqueId = spec.id || `spec-${idx}`;
                        const treeNodes = spec.tree || (spec.item ? [{ id: 'legacy', label: spec.item, children: [] }] : []);
                        
                        let firstItemLabel = treeNodes.length > 0 ? treeNodes[0].label : null;
                        let slotLabel = spec.slot;

                        // Overwrite label if linked to a weapon
                        if (treeNodes.length > 0 && treeNodes[0].linkedContentId && treeNodes[0].linkedContentType === 'weapon') {
                           const linkedWeapon = weapons.find(w => w.id === treeNodes[0].linkedContentId);
                           if (linkedWeapon) {
                              firstItemLabel = linkedWeapon.name;
                              slotLabel = slotLabel;
                           }
                        }

                        const hasMultipleItems = treeNodes.length > 1 || (treeNodes.length === 1 && (treeNodes[0].children?.length || 0) > 0);

                        return (
                           <div key={uniqueId} className={`bg-card border transition-all duration-200 ${expandedSlotId === uniqueId ? 'border-primary shadow-[0_0_15px_rgba(0,0,0,0.1)]' : 'border-border'}`}>
                              <button 
                                 onClick={() => hasMultipleItems && setExpandedSlotId(expandedSlotId === uniqueId ? null : uniqueId)}
                                 className={`w-full p-3 flex items-center gap-3 text-left ${hasMultipleItems ? 'cursor-pointer' : 'cursor-default'}`}
                              >
                                 <div className={`w-10 h-10 rounded flex items-center justify-center bg-muted/50 ${expandedSlotId === uniqueId ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <Target className="w-5 h-5" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase truncate">{slotLabel}</div>
                                    <div className="font-bold text-sm truncate">{firstItemLabel || "Empty"}</div>
                                 </div>
                                 {hasMultipleItems && (
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSlotId === uniqueId ? 'rotate-180 text-primary' : ''}`} />
                                 )}
                              </button>

                              <AnimatePresence>
                                 {expandedSlotId === uniqueId && treeNodes.length > 0 && (
                                    <motion.div 
                                       initial={{ height: 0, opacity: 0 }} 
                                       animate={{ height: 'auto', opacity: 1 }} 
                                       exit={{ height: 0, opacity: 0 }}
                                       className="overflow-hidden"
                                    >
                                       <div className="p-3 pt-0 pl-[3.5rem] pb-4">
                                          <div className="border-l-2 border-primary/20 pl-4">
                                             <TreeView nodes={treeNodes} variant="command" onHoverWeapon={onHoverWeapon} />
                                          </div>
                                       </div>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export function InteractiveClassList({ classes, variant = 'default', showHoverInfo = true, previewMode = 'follow' }: { classes: ClassItem[], variant?: InteractiveClassListVariant, showHoverInfo?: boolean, previewMode?: 'follow' | 'fixed' }) {
  const [selectedId, setSelectedId] = useState<string | null>(classes[0]?.id || null);
  const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null);
  const [hoveredWeapon, setHoveredWeapon] = useState<WeaponItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const selectedClass = classes.find(c => c.id === selectedId);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getGridConfig = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1 max-w-md mx-auto";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
  };

  return (
    <div className="space-y-12 w-full relative">
      {/* Class Selector Grid */}
      <div className={`grid ${getGridConfig(classes.length)} gap-4 md:gap-6 w-full`}>
        {classes.map((item, index) => (
          <div key={item.id} className="h-full relative">
            <ClassesContentCard 
              item={item} 
              index={index}
              onClick={() => setSelectedId(item.id)}
              isSelected={item.id === selectedId}
              showHoverInfo={showHoverInfo}
            />
            {/* Active Indicator */}
            {item.id === selectedId && (
               <motion.div 
                  layoutId="activeClassIndicator"
                  className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 z-50 shadow-[0_0_10px_currentColor] transition-colors duration-300 ${
                     variant === 'hex-tech' ? 'bg-primary text-primary' : 
                     variant === 'operator' ? 'bg-primary text-primary' : 
                     variant === 'vanguard' ? 'bg-primary text-primary' :
                     variant === 'command' ? 'bg-primary text-primary' :
                     'bg-primary text-primary'
                  }`}
                  transition={{ duration: 0.3 }}
               />
            )}
          </div>
        ))}
      </div>

      {/* Detailed View */}
      <AnimatePresence mode="wait">
        {selectedClass && (
          <motion.div
            key={selectedClass.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
             {variant === 'hex-tech' ? (
                <EliteLayout 
                   selectedClass={selectedClass} 
                   expandedSlotId={expandedSlotId} 
                   setExpandedSlotId={setExpandedSlotId} 
                   onHoverWeapon={setHoveredWeapon}
                />
             ) : variant === 'operator' ? (
                <OperatorLayout 
                   selectedClass={selectedClass} 
                   expandedSlotId={expandedSlotId} 
                   setExpandedSlotId={setExpandedSlotId} 
                   onHoverWeapon={setHoveredWeapon}
                />
             ) : variant === 'vanguard' ? (
                <VanguardLayout 
                   selectedClass={selectedClass} 
                   expandedSlotId={expandedSlotId} 
                   setExpandedSlotId={setExpandedSlotId} 
                   onHoverWeapon={setHoveredWeapon}
                />
             ) : variant === 'command' ? (
                <CommandLayout 
                   selectedClass={selectedClass} 
                   expandedSlotId={expandedSlotId} 
                   setExpandedSlotId={setExpandedSlotId} 
                   onHoverWeapon={setHoveredWeapon}
                />
             ) : (
                <StandardLayout 
                   selectedClass={selectedClass} 
                   expandedSlotId={expandedSlotId} 
                   setExpandedSlotId={setExpandedSlotId} 
                   onHoverWeapon={setHoveredWeapon}
                />
             )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Weapon Preview Panel (Hover) */}
      <AnimatePresence>
         {hoveredWeapon && <WeaponPreviewPanel weapon={hoveredWeapon} mousePos={mousePos} previewMode={previewMode} />}
      </AnimatePresence>
    </div>
  );
}
