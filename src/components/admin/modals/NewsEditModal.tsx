import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NewsItem } from "@/lib/content-store";
import { useContent } from "@/hooks/use-content";
import { FileUpload } from "@/components/ui/file-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ServerFilePicker } from "../server-file-picker";

export function NewsEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: NewsItem;
  onSave: (item: NewsItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const { addMediaItem, media, news } = useContent();
  const [formData, setFormData] = useState<NewsItem>(item);
  const [useBgAsThumbnail, setUseBgAsThumbnail] = useState(false);

  const handleSave = () => {
    // Check for duplicates (if creating or if title changed)
    const isDuplicate = news.some(n =>
      n.id !== formData.id && // Ignore self
      n.title.trim().toLowerCase() === formData.title.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert("Error: A news article with this title already exists. Please choose a different title.");
      return;
    }
    onSave(formData);
  };

  const addToLibrary = (url: string) => {
    if (!url) return;
    // Check if already exists to avoid duplicates
    if (media.some(m => m.src === url)) return;

    // Simple type detection
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('youtube') || url.includes('vimeo');
    const type = isVideo ? 'video' : 'image';
    
    // Create title from filename or use default
    let title = 'Uploaded Media';
    try {
      const urlObj = new URL(url);
      const filename = urlObj.pathname.split('/').pop();
      if (filename) title = filename.split('.')[0];
    } catch (e) {
      // If not a valid URL (e.g. data URI), try to extract info or leave as default
      if (url.startsWith('data:')) title = 'Uploaded Image';
    }

    addMediaItem({
      type: type as 'image' | 'video',
      title: title,
      src: url,
      category: 'News Uploads',
      description: 'Uploaded via News Editor'
    });
  };

  const handleThumbnailUpload = (url: string) => {
    addToLibrary(url);
    setFormData({ ...formData, thumbnail: url, image: url });
  };

  const handleBgUpload = (url: string) => {
    addToLibrary(url);
    const updates: Partial<NewsItem> = { bgImage: url };
    if (useBgAsThumbnail) {
      updates.thumbnail = url;
      updates.image = url;
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleUseBgAsThumbnailChange = (checked: boolean) => {
    setUseBgAsThumbnail(checked);
    if (checked && formData.bgImage) {
      setFormData(prev => ({ ...prev, thumbnail: prev.bgImage, image: prev.bgImage }));
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Create" : "Edit"} News Article
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article title"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="August 2024"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Tag</Label>
                  <Input
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="Development"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Short Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for cards..."
                  rows={4}
                  className="mt-1.5 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Thumbnail Image (Used for Cards) */}
              <div className={useBgAsThumbnail ? "opacity-50 pointer-events-none" : ""}>
                <Label>Card Image (Thumbnail)</Label>
                <div className="space-y-2 mt-1.5">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FileUpload 
                        currentValue={formData.thumbnail || ''}
                        onUploadComplete={handleThumbnailUpload}
                        accept="image/*"
                        label="Upload Card Image"
                      />
                    </div>
                    <ServerFilePicker 
                      onSelect={(url) => setFormData({ ...formData, thumbnail: url, image: url })}
                      accept="image"
                      trigger={
                        <Button variant="outline" className="h-full px-3 gap-2" title="Select from Uploads">
                          <ImageIcon className="h-4 w-4" />
                          <span>Uploads</span>
                        </Button>
                      }
                    />
                  </div>
                  <Input
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="Or enter URL..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
             {/* Background Image */}
             <div className="md:col-span-2">
                <Label>Background Image (Article Header)</Label>
                <div className="space-y-2 mt-1.5">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FileUpload 
                        currentValue={formData.bgImage || ''}
                        onUploadComplete={handleBgUpload}
                        accept="image/*"
                        label="Upload Background"
                      />
                    </div>
                    <ServerFilePicker 
                      onSelect={handleBgUpload}
                      accept="image"
                      trigger={
                        <Button variant="outline" className="h-full px-3 gap-2" title="Select from Uploads">
                          <ImageIcon className="h-4 w-4" />
                          <span>Uploads</span>
                        </Button>
                      }
                    />
                  </div>
                  <Input
                    value={formData.bgImage || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      const updates: Partial<NewsItem> = { bgImage: url };
                      if (useBgAsThumbnail) {
                        updates.thumbnail = url;
                        updates.image = url;
                      }
                      setFormData(prev => ({ ...prev, ...updates }));
                    }}
                    placeholder="Or enter URL..."
                  />
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox 
                      id="useBg" 
                      checked={useBgAsThumbnail}
                      onCheckedChange={(c) => handleUseBgAsThumbnailChange(c as boolean)}
                    />
                    <label
                      htmlFor="useBg"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Use as Card Image (Thumbnail)
                    </label>
                  </div>
                </div>
              </div>
            </div>

          <div className="pt-4 border-t border-border">
            <Label className="mb-2 block">Full Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Write your article content here... (Supports rich text, images, lists)"
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4 bg-card sticky bottom-0 z-10">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Article
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
