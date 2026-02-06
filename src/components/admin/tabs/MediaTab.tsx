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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function MediaTab() {
  const { media, addMediaItem, updateMediaItem, deleteMediaItem, deleteMediaItems, updateContent, content } = useContent();
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Delete confirmation state
  const [isBatchDelete, setIsBatchDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Duplicate warning state
  const [duplicateWarning, setDuplicateWarning] = useState<{ isOpen: boolean; reason: string; item: MediaItem | null }>({ 
    isOpen: false, 
    reason: "", 
    item: null 
  });

  const filteredMedia = media
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

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

  const handleBatchDeleteClick = () => {
    setIsBatchDelete(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (isBatchDelete) {
      deleteMediaItems(selectedIds);
      setSelectedIds(new Set());
      toast.success("Selected media items deleted!");
      setIsBatchDelete(false);
    } else if (deleteId) {
      deleteMediaItem(deleteId);
      toast.success("Media item deleted!");
      setDeleteId(null);
    }
  };

  const handleSaveMedia = (item: MediaItem, force = false) => {
    // Check for duplicates (src or title)
    if (!force) {
      const duplicate = media.find(m => 
        m.id !== item.id && ( // Ignore self
          (m.src && item.src && m.src === item.src) || 
          (m.title.trim().toLowerCase() === item.title.trim().toLowerCase())
        )
      );

      if (duplicate) {
         const reason = duplicate.src === item.src ? 'source link' : 'title';
         setDuplicateWarning({ isOpen: true, reason, item });
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
    setDuplicateWarning({ isOpen: false, reason: "", item: null });
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
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleBatchDeleteClick}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedIds.size})
            </Button>
          )}
          <Button variant="outline" onClick={handleSelectDuplicates} title="Select duplicate items based on source URL">
            Select Duplicates
          </Button>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
              relative group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden
              ${selectedIds.has(item.id) ? 'ring-2 ring-primary' : ''}
            `}
          >
            <div className="absolute top-2 left-2 z-10">
              <Checkbox 
                checked={selectedIds.has(item.id)}
                onCheckedChange={(checked) => handleSelectOne(item.id, !!checked)}
              />
            </div>

            <div className="aspect-video bg-muted relative">
              {item.thumbnail || item.src ? (
                <img 
                  src={item.thumbnail || item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-8 h-8 opacity-20" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => setEditingMedia(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={() => {
                   navigator.clipboard.writeText(item.src);
                   toast.success("URL copied to clipboard");
                }}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDeleteClick(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {item.type === 'video' && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                  <Video className="w-3 h-3 mr-1" />
                  Video
                </div>
              )}
            </div>

            <div className="p-3">
              <h3 className="font-semibold text-sm truncate mb-1" title={item.title}>{item.title}</h3>
              <p className="text-xs text-muted-foreground capitalize flex justify-between">
                <span>{item.category}</span>
                <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
              </p>
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
          onCancel={() => setEditingMedia(null)}
          onSave={handleSaveMedia}
          isCreating={isCreating}
        />
      )}

      <AlertDialog open={!!deleteId || isBatchDelete} onOpenChange={(open) => {
        if (!open) {
          setDeleteId(null);
          setIsBatchDelete(false);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {isBatchDelete 
                ? `This will permanently delete ${selectedIds.size} media items. This action cannot be undone.`
                : "This will permanently delete this media item. This action cannot be undone."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={duplicateWarning.isOpen} onOpenChange={(open) => {
        if (!open) setDuplicateWarning({ ...duplicateWarning, isOpen: false });
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Item Detected</AlertDialogTitle>
            <AlertDialogDescription>
              A media item with the same {duplicateWarning.reason} already exists. Do you want to add it anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDuplicateWarning({ ...duplicateWarning, isOpen: false })}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (duplicateWarning.item) {
                handleSaveMedia(duplicateWarning.item, true);
              }
            }}>
              Add Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
