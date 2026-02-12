import { motion } from "framer-motion";
import { X, ChevronRight, ChevronDown, Check, Circle, List, Heading, Image as ImageIcon, Type, Minus } from "lucide-react";
import { PatchNoteItem, PatchNoteBlock } from "@/lib/content-store";
import { createPortal } from "react-dom";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

// Recursive component to render content blocks
const ContentBlockRenderer = ({ block }: { block: PatchNoteBlock }) => {
  const [isExpanded, setIsExpanded] = useState(block.expanded ?? true);

  switch (block.type) {
    case 'header':
      return <h2 className="text-2xl font-bold text-primary mt-6 mb-4 font-heading uppercase">{block.content}</h2>;
    
    case 'subheader':
      return <h3 className="text-xl font-semibold text-foreground mt-4 mb-2 font-heading">{block.content}</h3>;
    
    case 'text':
      return (
        <div className="mb-3">
          <p className="text-muted-foreground leading-relaxed">{block.content}</p>
          {block.items && block.items.length > 0 && (
            <ul className="list-disc list-inside space-y-1 mt-2 pl-4 border-l border-border/50">
              {block.items.map((item, idx) => (
                <li key={item.id || idx} className="text-muted-foreground">
                   {item.type === 'text' ? (
                     <>
                       <span>{item.content}</span>
                       {item.items && item.items.length > 0 && (
                          <ContentBlockRenderer block={{...item, type: 'list', items: item.items}} />
                       )}
                     </>
                   ) : (
                     <ContentBlockRenderer block={item} />
                   )}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    
    case 'divider':
      return <hr className="border-border my-6" />;
      
    case 'image':
      return (
        <div className="my-4 rounded-lg overflow-hidden border border-border bg-muted/20">
          <img src={block.content} alt="Patch Note" className="w-full h-auto max-h-[500px] object-contain" />
        </div>
      );

    case 'list':
      return (
        <ul className="list-disc list-inside space-y-1 mb-4 pl-2">
          {block.items?.map((item, idx) => (
            <li key={item.id || idx} className="text-muted-foreground">
              {item.type === 'text' ? (
                <>
                  <span>{item.content}</span>
                  {item.items && item.items.length > 0 && (
                    <ContentBlockRenderer block={{...item, type: 'list', items: item.items}} />
                  )}
                </>
              ) : <ContentBlockRenderer block={item} />}
            </li>
          ))}
        </ul>
      );

    case 'checkbox':
      return (
        <div className="flex items-start gap-3 mb-2 group">
          <div className={cn(
            "mt-1 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
            block.checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/50 bg-transparent"
          )}>
            {block.checked && <Check className="w-3.5 h-3.5" />}
          </div>
          <div className="text-muted-foreground">
            {block.label && <span className="font-medium text-foreground block">{block.label}</span>}
            {block.content && <span>{block.content}</span>}
          </div>
        </div>
      );

    case 'tree':
      return (
        <div className="mb-2">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 p-1.5 rounded-md transition-colors select-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <span className="font-medium text-foreground">{block.label || block.content}</span>
          </div>
          
          {isExpanded && block.items && (
            <div className="pl-6 mt-1 border-l border-border/50 ml-2 space-y-1">
              {block.items.map((item, idx) => (
                <ContentBlockRenderer key={item.id || idx} block={item} />
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export function PatchNoteDetail({ 
  item, 
  onClose, 
  variant = 'default' 
}: { 
  item: PatchNoteItem; 
  onClose: () => void;
  variant?: 'default' | 'side-panel' | 'full-screen' | 'minimal';
}) {
  useLockBodyScroll();
  
  if (!item) return null;

  // Animation variants based on style
  const containerVariants = {
    default: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    'side-panel': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    'full-screen': {
      initial: { opacity: 0, y: "100%" },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: "100%" }
    },
    minimal: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    }
  };

  const contentVariants = {
    default: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 }
    },
    'side-panel': {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      transition: { type: "spring", damping: 25, stiffness: 200 }
    },
    'full-screen': {
      initial: {},
      animate: {},
      exit: {}
    },
    minimal: {
      initial: { scale: 0.95, opacity: 0, y: 20 },
      animate: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.95, opacity: 0, y: 20 }
    }
  };

  const wrapperClasses = {
    default: "fixed inset-0 bg-background/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4",
    'side-panel': "fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] flex justify-end",
    'full-screen': "fixed inset-0 bg-background z-[100]",
    minimal: "fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
  };

  const contentClasses = {
    default: "bg-card border border-border rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",
    'side-panel': "bg-card border-l border-border w-full max-w-2xl h-full shadow-2xl flex flex-col",
    'full-screen': "bg-background w-full h-full flex flex-col overflow-hidden",
    minimal: "bg-card border border-border rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-xl"
  };

  return createPortal(
    <motion.div
      variants={containerVariants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      className={wrapperClasses[variant]}
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants[variant]}
        className={contentClasses[variant]}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          "relative shrink-0",
          variant === 'minimal' ? "h-32 md:h-40" : "h-48 md:h-64",
          variant === 'full-screen' && "h-64 md:h-80"
        )}>
          {item.image ? (
            <>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-muted/20 bg-gradient-to-br from-primary/5 to-secondary/5 relative">
               <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-md rounded-full text-foreground hover:text-primary transition-colors border border-border/50 shadow-sm z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={cn(
            "absolute bottom-0 left-0 right-0",
            variant === 'minimal' ? "p-4 md:p-6" : "p-6 md:p-8"
          )}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-sm">
                  v{item.version}
                </span>
                {item.category && (
                  <span className="px-3 py-1 bg-muted/80 backdrop-blur-sm border border-border text-muted-foreground text-sm rounded-full">
                    {item.category}
                  </span>
                )}
                {variant !== 'minimal' && (
                  <span className="text-muted-foreground text-sm ml-auto font-mono">
                    {item.date}
                  </span>
                )}
              </div>
              <h1 className={cn(
                "font-display text-foreground drop-shadow-sm leading-none",
                variant === 'minimal' ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl"
              )}>
                {item.title}
              </h1>
              {item.subtitle && variant !== 'minimal' && (
                <p className="text-xl text-muted-foreground font-light max-w-3xl">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={cn(
          "flex-1 overflow-y-auto custom-scrollbar",
          variant === 'minimal' ? "p-4 md:p-6" : "p-6 md:p-8"
        )}>
          <div className={cn(
            "mx-auto space-y-2",
            variant === 'full-screen' ? "max-w-5xl" : "max-w-4xl"
          )}>
            {item.content && item.content.length > 0 ? (
              item.content.map((block, idx) => (
                <ContentBlockRenderer key={block.id || idx} block={block} />
              ))
            ) : (
              <p className="text-muted-foreground italic text-center py-10">No detailed content available for this patch note.</p>
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex justify-between text-sm text-muted-foreground">
            <span>Patch ID: {item.id}</span>
            <span>Released: {item.date}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
