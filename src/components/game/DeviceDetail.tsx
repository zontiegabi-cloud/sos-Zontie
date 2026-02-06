import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { GameDeviceItem, MapMediaItem } from "@/lib/content-store";
import { MediaLightbox } from "./MediaLightbox";

export function DeviceDetail({ device, onClose }: { device: GameDeviceItem; onClose: () => void }) {
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
          className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img
              src={device.image}
              alt={device.name}
              className="w-full h-56 object-cover"
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
            {device.classRestriction && (
              <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded text-sm font-heading">
                {device.classRestriction} Only
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <h2 className="font-display text-2xl text-foreground">{device.name}</h2>
            <p className="text-muted-foreground">{device.description}</p>
            <div className="bg-muted/30 border border-border rounded p-4">
              <h4 className="font-heading text-sm text-primary uppercase mb-2">Details</h4>
              <p className="text-foreground">{device.details}</p>
            </div>

            {/* Media Gallery */}
            {device.media.length > 0 && (
              <div>
                <h3 className="font-heading text-lg text-foreground uppercase mb-4">
                  Media
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {device.media.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMedia(item)}
                      className="relative aspect-video rounded-lg overflow-hidden group"
                    >
                      <img
                        src={item.type === "video" ? device.image : item.url}
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
