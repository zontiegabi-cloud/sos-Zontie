import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { MapMediaItem } from "@/lib/content-store";
import { useState, useEffect, useCallback } from "react";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

interface EnhancedMediaLightboxProps {
  media: MapMediaItem[];
  initialIndex?: number;
  onClose: () => void;
}

export function EnhancedMediaLightbox({ media, initialIndex = 0, onClose }: EnhancedMediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  useLockBodyScroll();

  const current = media[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  const goNext = useCallback(() => {
    if (hasNext) { setCurrentIndex(i => i + 1); setZoom(1); }
  }, [hasNext]);

  const goPrev = useCallback(() => {
    if (hasPrev) { setCurrentIndex(i => i - 1); setZoom(1); }
  }, [hasPrev]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev]);

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex flex-col"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 shrink-0" onClick={e => e.stopPropagation()}>
        <span className="text-sm text-muted-foreground font-mono">
          {currentIndex + 1} / {media.length}
        </span>
        <div className="flex items-center gap-2">
          {current?.type !== "video" && (
            <>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ZoomIn className="w-5 h-5" />
              </button>
            </>
          )}
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-16" onClick={e => e.stopPropagation()}>
        {hasPrev && (
          <button onClick={goPrev} className="absolute left-4 z-10 p-3 bg-card/80 backdrop-blur border border-border rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl w-full flex items-center justify-center"
          >
            {current?.type === "video" ? (
              <div className="aspect-video w-full">
                <iframe
                  src={getEmbedUrl(current.url)}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>
            ) : (
              <img
                src={current?.url}
                alt={current?.title || "Media"}
                className="max-h-[70vh] w-auto object-contain rounded-lg transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {hasNext && (
          <button onClick={goNext} className="absolute right-4 z-10 p-3 bg-card/80 backdrop-blur border border-border rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Title */}
      {current?.title && (
        <div className="text-center py-2 shrink-0">
          <p className="text-foreground font-heading text-lg">{current.title}</p>
        </div>
      )}

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="shrink-0 p-4 flex justify-center gap-2 overflow-x-auto" onClick={e => e.stopPropagation()}>
          {media.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentIndex(idx); setZoom(1); }}
              className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                idx === currentIndex ? "border-primary scale-110 shadow-lg" : "border-border/50 opacity-60 hover:opacity-100"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">▶</div>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>,
    document.body
  );
}
