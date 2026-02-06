import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ChevronRight } from "lucide-react";
import { GameModeItem, MapMediaItem } from "@/lib/content-store";
import { MediaLightbox } from "./MediaLightbox";

export function GameModeDetail({ mode, onClose }: { mode: GameModeItem; onClose: () => void }) {
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
              src={mode.image}
              alt={mode.name}
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
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent p-6">
              <span className="text-primary font-heading text-lg">{mode.shortName}</span>
              <h2 className="font-display text-3xl text-foreground">{mode.name}</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-muted-foreground text-lg">{mode.description}</p>

            <div className="flex gap-4">
              {mode.playerCount && (
                <div className="bg-primary/10 border border-primary/20 rounded px-4 py-2">
                  <span className="text-xs text-muted-foreground">Players</span>
                  <p className="text-foreground font-heading">{mode.playerCount}</p>
                </div>
              )}
              {mode.roundTime && (
                <div className="bg-muted/50 border border-border rounded px-4 py-2">
                  <span className="text-xs text-muted-foreground">Round Time</span>
                  <p className="text-foreground font-heading">{mode.roundTime}</p>
                </div>
              )}
            </div>

            {/* Rules */}
            {mode.rules.length > 0 && (
              <div>
                <h3 className="font-heading text-lg text-foreground uppercase mb-4">Rules</h3>
                <ul className="space-y-2">
                  {mode.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Media Gallery */}
            {mode.media.length > 0 && (
              <div>
                <h3 className="font-heading text-lg text-foreground uppercase mb-4">
                  Media
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {mode.media.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMedia(item)}
                      className="relative aspect-video rounded-lg overflow-hidden group"
                    >
                      <img
                        src={item.type === "video" ? mode.image : item.url}
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
