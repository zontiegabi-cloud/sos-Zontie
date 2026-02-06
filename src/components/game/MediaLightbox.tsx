import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MapMediaItem } from "@/lib/content-store";

export function MediaLightbox({ 
  media, 
  onClose 
}: { 
  media: MapMediaItem; 
  onClose: () => void;
}) {
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-foreground hover:text-primary z-50"
      >
        <X className="w-8 h-8" />
      </button>
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        {media.type === "video" ? (
          <div className="aspect-video">
            <iframe
              src={getEmbedUrl(media.url)}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <img
            src={media.url}
            alt={media.title || "Media"}
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />
        )}
        {media.title && (
          <p className="text-center text-foreground mt-4 font-heading">{media.title}</p>
        )}
      </div>
    </motion.div>,
    document.body
  );
}
