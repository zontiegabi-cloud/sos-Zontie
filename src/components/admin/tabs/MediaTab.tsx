import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "@/hooks/use-content";
import { MediaItem } from "@/lib/content-store";
import { toast } from "sonner";
import { MediaEditModal } from "@/components/admin/modals/MediaEditModal";

export function MediaTab() {
  const { media, addMediaItem, updateMediaItem, deleteMediaItem, updateContent, content } = useContent();
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredMedia = media.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredMedia.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} media items?`)) {
      const newMedia = media.filter((item) => !selectedIds.has(item.id));
      updateContent({ ...content, media: newMedia });
      setSelectedIds(new Set());
      toast.success("Selected media items deleted!");
    }
  };

  const handleSaveMedia = (item: MediaItem) => {
    if (isCreating) {
      addMediaItem(item);
      toast.success("Media item created!");
    } else {
      updateMediaItem(item.id, item);
      toast.success("Media item updated!");
    }
    setEditingMedia(null);
    setIsCreating(false);
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm("Are you sure you want to delete this media item?")) {
      deleteMediaItem(id);
      toast.success("Media item deleted!");
    }
  };

  const createNewMedia = () => {
    setEditingMedia({
      id: "",
      type: "image",
      title: "",
      src: "",
      category: "Gameplay",
    });
    setIsCreating(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-heading text-xl text-foreground uppercase">
            Manage Media
          </h2>
          <p className="text-muted-foreground text-sm">
            {media.length} items total
          </p>
        </div>
        <Button onClick={createNewMedia}>
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        {selectedIds.size > 0 && (
          <Button variant="destructive" onClick={handleBatchDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedIds.size})
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filteredMedia.length > 0 && selectedIds.size === filteredMedia.length}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedia.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-card border rounded-lg overflow-hidden flex flex-col transition-colors ${
              selectedIds.has(item.id) ? "border-primary ring-1 ring-primary" : "border-border"
            }`}
          >
            <div className="relative aspect-video bg-muted group">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-12 h-12 opacity-20" />
                </div>
              )}
              
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                  className="bg-background/80 backdrop-blur-sm border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => {
                    setEditingMedia(item);
                    setIsCreating(false);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDeleteMedia(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-heading text-foreground truncate" title={item.title}>{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.type} • {item.category}</p>
            </div>
          </motion.div>
        ))}
        {filteredMedia.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No media found matching your search.</p>
          </div>
        )}
      </div>

      {editingMedia && (
        <MediaEditModal
          item={editingMedia}
          onSave={handleSaveMedia}
          onCancel={() => {
            setEditingMedia(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}
