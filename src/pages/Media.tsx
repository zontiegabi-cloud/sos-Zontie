import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Image as ImageIcon, Film, Play, X } from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { MediaItem } from "@/lib/content-store";

// Helper to convert YouTube/Vimeo URLs to embed format
function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  
  return null;
}

// Check if URL is a direct video file
function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

// Get YouTube thumbnail
function getYouTubeThumbnail(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

export default function Media() {
  const { media } = useContent();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(media.map(item => item.category));
    return ["All", ...Array.from(cats)];
  }, [media]);

  const filteredMedia = activeCategory === "All" 
    ? media 
    : media.filter(item => item.category === activeCategory);

  // Get display thumbnail for media item
  const getDisplayThumbnail = (item: MediaItem): string => {
    if (item.thumbnail) return item.thumbnail;
    if (item.type === "video") {
      const ytThumb = getYouTubeThumbnail(item.src);
      if (ytThumb) return ytThumb;
    }
    return item.src;
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 lg:py-32 bg-surface-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl lg:text-7xl text-foreground mb-4">
              <span className="text-primary">MEDIA</span> GALLERY
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Screenshots, gameplay footage, and development updates
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 font-heading uppercase tracking-wide text-sm rounded transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-card border border-border rounded overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={getDisplayThumbnail(item)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    {item.type === "video" ? <Film className="w-4 h-4" /> : item.type === "gif" ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    <span className="text-xs uppercase">{item.type}</span>
                  </div>
                  <h3 className="font-heading text-lg text-foreground">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10"
            onClick={() => setSelectedMedia(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === "video" ? (
              <>
                {getEmbedUrl(selectedMedia.src) ? (
                  <div className="aspect-video w-full">
                    <iframe
                      src={getEmbedUrl(selectedMedia.src)!}
                      className="w-full h-full rounded border border-border"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : isDirectVideo(selectedMedia.src) ? (
                  <video
                    src={selectedMedia.src}
                    controls
                    autoPlay
                    className="w-full h-auto rounded border border-border max-h-[70vh]"
                  />
                ) : (
                  <div className="aspect-video w-full bg-card rounded border border-border flex items-center justify-center">
                    <p className="text-muted-foreground">Unable to play video. Invalid URL format.</p>
                  </div>
                )}
              </>
            ) : (
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="w-full h-auto rounded border border-border max-h-[70vh] object-contain"
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="font-heading text-2xl text-foreground">{selectedMedia.title}</h3>
              <p className="text-primary text-sm mb-2">{selectedMedia.category}</p>
              {selectedMedia.description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">{selectedMedia.description}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
