import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaItem } from "@/lib/content-store";
import { FileUpload } from "@/components/ui/file-upload";

export function MediaEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: MediaItem;
  onSave: (item: MediaItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Add" : "Edit"} Media
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Media title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MediaItem['type'] })}
                className="w-full h-10 px-3 bg-background border border-border rounded text-foreground"
              >
                <option value="image">Image</option>
                <option value="gif">GIF</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Gameplay"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              {formData.type === "video" ? "Video Source" : "Image Source"}
            </label>
            <div className="space-y-4">
              <FileUpload 
                currentValue={formData.src}
                onUploadComplete={(url) => setFormData({ ...formData, src: url })}
                accept={formData.type === "video" ? "video/*" : "image/*"}
                label={`Upload ${formData.type === "video" ? "Video" : "Image"}`}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or enter URL</span>
                </div>
              </div>

              <Input
                value={formData.src}
                onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                placeholder={formData.type === "video" ? "https://youtube.com/watch?v=... or https://.../video.mp4" : "https://..."}
              />
              {formData.type === "video" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Supports YouTube, Vimeo embed URLs, or direct video file URLs (.mp4, .webm)
                </p>
              )}
            </div>
          </div>

          {formData.type === "video" && (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Thumbnail URL (optional)</label>
              <div className="space-y-4">
                <FileUpload 
                  currentValue={formData.thumbnail || ""}
                  onUploadComplete={(url) => setFormData({ ...formData, thumbnail: url })}
                  accept="image/*"
                  label="Upload Thumbnail"
                />
                 <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or enter URL</span>
                  </div>
                </div>
                <Input
                  value={formData.thumbnail || ""}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://... (thumbnail image for video)"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Display image before video plays
              </p>
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this media item..."
              rows={3}
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
