import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Video, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContent } from "@/hooks/use-content";
import { MediaItem } from "@/lib/content-store";
import { toast } from "sonner";
import { MediaEditModal } from "@/components/admin/modals/MediaEditModal";
import { API_BASE_URL } from "@/config";

export function MediaTab() {
  const { media, addMediaItem, updateMediaItem, deleteMediaItem, deleteMediaItems, updateContent, content } = useContent();
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

  const handleSelectDuplicates = () => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    
    // Iterate through filtered media to find duplicates based on src
    filteredMedia.forEach(item => {
      // Use src as key. If src is missing (shouldn't be), use title.
      const key = item.src || item.title;
      if (seen.has(key)) {
        duplicates.add(item.id);
      } else {
        seen.add(key);
      }
    });
    
    setSelectedIds(duplicates);
    if (duplicates.size > 0) {
      toast.info(`Selected ${duplicates.size} duplicate items.`);
    } else {
      toast.info("No duplicates found.");
    }
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} media items?`)) {
      deleteMediaItems(selectedIds);
      setSelectedIds(new Set());
      toast.success("Selected media items deleted!");
    }
  };

  const handleSaveMedia = (item: MediaItem) => {
    // Check for duplicates (src or title)
    const duplicate = media.find(m => 
      m.id !== item.id && ( // Ignore self
        (m.src && item.src && m.src === item.src) || 
        (m.title.trim().toLowerCase() === item.title.trim().toLowerCase())
      )
    );

    if (duplicate) {
       const reason = duplicate.src === item.src ? 'source link' : 'title';
       if (!confirm(`Warning: A media item with the same ${reason} already exists. Do you want to add it anyway?`)) {
         return;
       }
    }

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
        <Button variant="outline" onClick={handleSelectDuplicates} title="Auto-select duplicate items">
          <Copy className="w-4 h-4 mr-2" />
          Select Duplicates
        </Button>
        {selectedIds.size > 0 && (
          <Button variant="destructive" onClick={handleBatchDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedIds.size})
          </Button>
        )}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredMedia.length > 0 && selectedIds.size === filteredMedia.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedia.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No media found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMedia.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    {item.type === 'video' ? (
                       item.thumbnail ? (
                         <div className="relative w-16 h-10 rounded overflow-hidden">
                           <img
                             src={item.thumbnail}
                             alt={item.title}
                             className="w-full h-full object-cover"
                           />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                             <Video className="w-4 h-4 text-white opacity-80" />
                           </div>
                         </div>
                       ) : (
                         <div className="w-16 h-10 flex items-center justify-center text-muted-foreground bg-accent/50 rounded">
                           <Video className="w-6 h-6 opacity-20" />
                         </div>
                       )
                     ) : (
                       <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                        {item.src ? (
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                          </div>
                        )}
                       </div>
                     )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[200px]" title={item.title}>
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingMedia(item);
                          setIsCreating(false);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => handleDeleteMedia(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
