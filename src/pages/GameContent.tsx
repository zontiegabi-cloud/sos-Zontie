import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crosshair, 
  Map, 
  Cpu, 
  Gamepad2, 
  ChevronRight,
  X,
  Play,
  Image as ImageIcon
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useContent } from "@/hooks/use-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeaponItem, MapItem, GameDeviceItem, GameModeItem, MapMediaItem } from "@/lib/content-store";

type GameTab = "weapons" | "maps" | "devices" | "gamemodes";

// Stat bar component
function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </div>
  );
}

// Media lightbox component
function MediaLightbox({ 
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
    </motion.div>
  );
}

// Weapon detail modal
function WeaponDetail({ weapon, onClose }: { weapon: WeaponItem; onClose: () => void }) {
  const categoryLabels: Record<string, string> = {
    assault: "Assault Rifle",
    smg: "SMG",
    lmg: "LMG",
    sniper: "Sniper Rifle",
    shotgun: "Shotgun",
    pistol: "Pistol",
    melee: "Melee",
  };

  const attachmentTypeLabels: Record<string, string> = {
    optic: "Optics",
    barrel: "Barrel",
    grip: "Grip",
    magazine: "Magazine",
    stock: "Stock",
    accessory: "Accessory",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
            src={weapon.image}
            alt={weapon.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-background/80 rounded-full text-foreground hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card to-transparent p-6">
            <span className="text-xs text-primary uppercase font-heading">
              {categoryLabels[weapon.category]}
            </span>
            <h2 className="font-display text-3xl text-foreground">{weapon.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-muted-foreground">{weapon.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBar label="Damage" value={weapon.stats.damage} />
            <StatBar label="Accuracy" value={weapon.stats.accuracy} />
            <StatBar label="Range" value={weapon.stats.range} />
            <StatBar label="Fire Rate" value={weapon.stats.fireRate} />
            <StatBar label="Mobility" value={weapon.stats.mobility} />
            <StatBar label="Control" value={weapon.stats.control} />
          </div>

          {/* Attachments */}
          {weapon.attachments.length > 0 && (
            <div>
              <h3 className="font-heading text-lg text-foreground uppercase mb-4">
                Available Attachments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weapon.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="bg-muted/50 border border-border rounded p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-primary uppercase">
                        {attachmentTypeLabels[attachment.type]}
                      </span>
                    </div>
                    <h4 className="font-heading text-foreground">{attachment.name}</h4>
                    <p className="text-sm text-muted-foreground">{attachment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Map detail modal
function MapDetail({ map, onClose }: { map: MapItem; onClose: () => void }) {
  const [selectedMedia, setSelectedMedia] = useState<MapMediaItem | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
    </>
  );
}

// Device detail modal
function DeviceDetail({ device, onClose }: { device: GameDeviceItem; onClose: () => void }) {
  const [selectedMedia, setSelectedMedia] = useState<MapMediaItem | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
    </>
  );
}

// Game mode detail modal
function GameModeDetail({ mode, onClose }: { mode: GameModeItem; onClose: () => void }) {
  const [selectedMedia, setSelectedMedia] = useState<MapMediaItem | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
    </>
  );
}

export default function GameContent() {
  const { weapons, maps, gameDevices, gameModes, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<GameTab>("weapons");
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponItem | null>(null);
  const [selectedMap, setSelectedMap] = useState<MapItem | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<GameDeviceItem | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<GameModeItem | null>(null);

  const tabs = [
    { id: "weapons" as GameTab, label: "Weapons", icon: Crosshair },
    { id: "maps" as GameTab, label: "Maps", icon: Map },
    { id: "devices" as GameTab, label: "Devices", icon: Cpu },
    { id: "gamemodes" as GameTab, label: "Game Modes", icon: Gamepad2 },
  ];

  const categoryLabels: Record<string, string> = {
    assault: "Assault Rifles",
    smg: "SMGs",
    lmg: "LMGs",
    sniper: "Sniper Rifles",
    shotgun: "Shotguns",
    pistol: "Pistols",
    melee: "Melee",
  };

  // Group weapons by category
  const weaponsByCategory = weapons.reduce((acc, weapon) => {
    if (!acc[weapon.category]) {
      acc[weapon.category] = [];
    }
    acc[weapon.category].push(weapon);
    return acc;
  }, {} as Record<string, WeaponItem[]>);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              GAME <span className="text-primary text-glow-primary">CONTENT</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the weapons, maps, devices, and game modes in Shadows of Soldiers.
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-heading uppercase tracking-wide transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Weapons Tab */}
            {activeTab === "weapons" && (
              <motion.div
                key="weapons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {Object.entries(weaponsByCategory).map(([category, categoryWeapons]) => (
                  <div key={category}>
                    <h2 className="font-heading text-xl text-foreground uppercase mb-6 flex items-center gap-3">
                      <Crosshair className="w-5 h-5 text-primary" />
                      {categoryLabels[category] || category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryWeapons.map((weapon) => (
                        <motion.button
                          key={weapon.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedWeapon(weapon)}
                          className="bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={weapon.image}
                              alt={weapon.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-heading text-lg text-foreground mb-1">
                              {weapon.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {weapon.description}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                              <span>{weapon.attachments.length} attachments</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Maps Tab */}
            {activeTab === "maps" && (
              <motion.div
                key="maps"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {maps.map((map) => (
                  <motion.button
                    key={map.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedMap(map)}
                    className="bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={map.image}
                        alt={map.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="text-xs bg-primary/90 text-primary-foreground px-2 py-1 rounded uppercase font-heading">
                          {map.size}
                        </span>
                        <span className="text-xs bg-background/80 text-foreground px-2 py-1 rounded">
                          {map.environment}
                        </span>
                      </div>
                      {map.media.length > 0 && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-background/80 px-2 py-1 rounded text-xs text-foreground">
                          <ImageIcon className="w-3 h-3" />
                          {map.media.length}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-2xl text-foreground mb-2">
                        {map.name}
                      </h3>
                      <p className="text-muted-foreground">{map.description}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Devices Tab */}
            {activeTab === "devices" && (
              <motion.div
                key="devices"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {gameDevices.map((device) => (
                  <motion.button
                    key={device.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDevice(device)}
                    className="bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={device.image}
                        alt={device.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {device.classRestriction && (
                        <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-heading">
                          {device.classRestriction}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-lg text-foreground mb-1">
                        {device.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {device.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Game Modes Tab */}
            {activeTab === "gamemodes" && (
              <motion.div
                key="gamemodes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {gameModes.map((mode) => (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedGameMode(mode)}
                    className="bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-colors group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={mode.image}
                        alt={mode.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-primary font-heading text-2xl">
                          {mode.shortName}
                        </span>
                      </div>
                      {mode.playerCount && (
                        <div className="absolute top-4 right-4 bg-background/80 px-3 py-1 rounded text-sm text-foreground">
                          {mode.playerCount}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-foreground mb-2">
                        {mode.name}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">{mode.description}</p>
                      <div className="mt-3 text-xs text-primary flex items-center gap-1">
                        View details <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedWeapon && (
          <WeaponDetail weapon={selectedWeapon} onClose={() => setSelectedWeapon(null)} />
        )}
        {selectedMap && (
          <MapDetail map={selectedMap} onClose={() => setSelectedMap(null)} />
        )}
        {selectedDevice && (
          <DeviceDetail device={selectedDevice} onClose={() => setSelectedDevice(null)} />
        )}
        {selectedGameMode && (
          <GameModeDetail mode={selectedGameMode} onClose={() => setSelectedGameMode(null)} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
