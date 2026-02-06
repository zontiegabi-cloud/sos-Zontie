import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { MapItem, MapMediaItem } from "@/lib/content-store";
import { MediaLightbox } from "./MediaLightbox";

export function MapDetail({ map, onClose }: { map: MapItem; onClose: () => void }) {
  const [selectedMedia, setSelectedMedia] = useState<MapMediaItem | null>(null);

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img
              src={map.image}
              alt={map.name}
              className="w-full h-64 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-background/80 rounded-full text-foreground hover:text-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onClose();
                }
              }}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent p-6">
              <div className="flex gap-2 mb-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded uppercase">
                  {map.size}
                </span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                  {map.environment}
                </span>
              </div>
              <h2 className="font-display text-3xl text-foreground">{map.name}</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-muted-foreground">{map.description}</p>

            {/* Media Gallery */}
            {map.media.length > 0 && (
              <div>
                <h3 className="font-heading text-lg text-foreground uppercase mb-4">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {map.media.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMedia(item)}
                      className="relative aspect-video rounded-lg overflow-hidden group"
                    >
                      <img
                        src={item.type === "video" ? map.image : item.url}
                        alt={item.title || `Media ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                          <Play className="w-10 h-10 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedMedia && (
          <MediaLightbox media={selectedMedia} onClose={() => setSelectedMedia(null)} />
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
