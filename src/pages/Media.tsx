import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Play, Image as ImageIcon, Film } from "lucide-react";

const mediaItems = [
  {
    type: "gif",
    title: "Shelter Environment",
    src: "https://www.shadowsofsoldiers.com/assets/shelter.gif",
    category: "Gameplay",
  },
  {
    type: "gif",
    title: "Cover System",
    src: "https://www.shadowsofsoldiers.com/assets/cover.gif",
    category: "Gameplay",
  },
  {
    type: "gif",
    title: "Weapon Customization",
    src: "https://www.shadowsofsoldiers.com/assets/weaponcustomise.gif",
    category: "Features",
  },
  {
    type: "image",
    title: "Juggernaut Class",
    src: "https://www.shadowsofsoldiers.com/assets/webp/juggernaut.webp",
    category: "Classes",
  },
  {
    type: "image",
    title: "Shadow Class",
    src: "https://www.shadowsofsoldiers.com/assets/webp/shadow.webp",
    category: "Classes",
  },
  {
    type: "image",
    title: "Commander Class",
    src: "https://www.shadowsofsoldiers.com/assets/webp/commander.webp",
    category: "Classes",
  },
  {
    type: "image",
    title: "Unreal Engine 5",
    src: "https://www.shadowsofsoldiers.com/assets/webp/new-ue5-image.webp",
    category: "Development",
  },
  {
    type: "image",
    title: "Abilities System",
    src: "https://www.shadowsofsoldiers.com/assets/webp/abilities.webp",
    category: "Features",
  },
];

const categories = ["All", "Gameplay", "Features", "Classes", "Development"];

export default function Media() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMedia, setSelectedMedia] = useState<typeof mediaItems[0] | null>(null);

  const filteredMedia = activeCategory === "All" 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeCategory);

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
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-card border border-border rounded overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    {item.type === "gif" ? <Film className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
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
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedMedia.src}
              alt={selectedMedia.title}
              className="w-full h-auto rounded border border-border"
            />
            <div className="mt-4 text-center">
              <h3 className="font-heading text-2xl text-foreground">{selectedMedia.title}</h3>
              <p className="text-muted-foreground">{selectedMedia.category}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
