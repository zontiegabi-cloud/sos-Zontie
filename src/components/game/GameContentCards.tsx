import { motion } from "framer-motion";
import { ChevronRight, ImageIcon, Play } from "lucide-react";
import { WeaponItem, MapItem, GameDeviceItem, GameModeItem } from "@/lib/content-store";
import { forwardRef } from "react";

// Helper for generic card props
interface GameCardProps<T> {
  item: T;
  index: number;
  onClick: () => void;
}

export const WeaponCard = forwardRef<HTMLButtonElement, GameCardProps<WeaponItem>>(
  ({ item, index, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className="w-full bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group flex flex-col h-full"
      >
        <div className="relative h-40 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading text-lg text-foreground mb-1">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {item.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-primary mt-auto">
            <span>{item.attachments.length} attachments</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </motion.button>
    );
  }
);
WeaponCard.displayName = "WeaponCard";

export const MapCard = forwardRef<HTMLButtonElement, GameCardProps<MapItem>>(
  ({ item, index, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className="w-full bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group flex flex-col h-full"
      >
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs bg-primary/90 text-primary-foreground px-2 py-1 rounded uppercase font-heading">
              {item.size}
            </span>
            <span className="text-xs bg-background/80 text-foreground px-2 py-1 rounded">
              {item.environment}
            </span>
          </div>
          {item.media.length > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-background/80 px-2 py-1 rounded text-xs text-foreground">
              <ImageIcon className="w-3 h-3" />
              {item.media.length}
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-2xl text-foreground mb-2">
            {item.name}
          </h3>
          <p className="text-muted-foreground line-clamp-3 flex-1">{item.description}</p>
        </div>
      </motion.button>
    );
  }
);
MapCard.displayName = "MapCard";

export const DeviceCard = forwardRef<HTMLButtonElement, GameCardProps<GameDeviceItem>>(
  ({ item, index, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className="w-full bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group flex flex-col h-full"
      >
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {item.classRestriction && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-white text-xs px-2 py-1 rounded border border-white/10">
              {item.classRestriction}
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-xl text-foreground mb-2">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {item.description}
          </p>
          <div className="flex items-center gap-2 text-primary text-sm mt-auto">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.button>
    );
  }
);
DeviceCard.displayName = "DeviceCard";

export const GameModeCard = forwardRef<HTMLButtonElement, GameCardProps<GameModeItem>>(
  ({ item, index, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className="w-full bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group flex flex-col h-full"
      >
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display text-2xl text-white mb-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              {item.playerCount && <span>{item.playerCount}</span>}
              {item.roundTime && (
                <>
                  <span className="w-1 h-1 bg-gray-500 rounded-full" />
                  <span>{item.roundTime}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
            {item.description}
          </p>
          <div className="flex items-center gap-2 text-primary text-sm font-heading uppercase mt-auto">
            <Play className="w-4 h-4 fill-current" />
            <span>View Rules</span>
          </div>
        </div>
      </motion.button>
    );
  }
);
GameModeCard.displayName = "GameModeCard";
