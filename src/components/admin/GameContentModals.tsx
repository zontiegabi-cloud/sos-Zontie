import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  WeaponItem, 
  WeaponAttachment, 
  MapItem, 
  MapMediaItem,
  GameDeviceItem, 
  GameModeItem 
} from "@/lib/content-store";

// Weapon Edit Modal
export function WeaponEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: WeaponItem;
  onSave: (item: WeaponItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  const categoryOptions: WeaponItem["category"][] = [
    "assault", "smg", "lmg", "sniper", "shotgun", "pistol", "melee"
  ];

  const attachmentTypes: WeaponAttachment["type"][] = [
    "optic", "barrel", "grip", "magazine", "stock", "accessory"
  ];

  const updateStat = (stat: keyof typeof formData.stats, value: number) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [stat]: Math.min(100, Math.max(0, value)) }
    });
  };

  const addAttachment = () => {
    const newAttachment: WeaponAttachment = {
      id: Date.now().toString(),
      name: "",
      type: "optic",
      description: "",
    };
    setFormData({
      ...formData,
      attachments: [...formData.attachments, newAttachment]
    });
  };

  const updateAttachment = (index: number, field: keyof WeaponAttachment, value: string) => {
    const newAttachments = [...formData.attachments];
    newAttachments[index] = { ...newAttachments[index], [field]: value };
    setFormData({ ...formData, attachments: newAttachments });
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Add" : "Edit"} Weapon
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Weapon name"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as WeaponItem["category"] })}
                className="w-full h-10 px-3 bg-background border border-border rounded text-foreground"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Weapon description..."
              rows={3}
            />
          </div>

          {/* Stats */}
          <div className="border-t border-border pt-4">
            <label className="text-sm text-muted-foreground mb-3 block">Stats (0-100)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(Object.keys(formData.stats) as (keyof typeof formData.stats)[]).map((stat) => (
                <div key={stat}>
                  <label className="text-xs text-muted-foreground capitalize mb-1 block">{stat}</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.stats[stat]}
                    onChange={(e) => updateStat(stat, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-muted-foreground">Attachments</label>
              <Button variant="outline" size="sm" onClick={addAttachment}>
                <Plus className="w-4 h-4 mr-2" />
                Add Attachment
              </Button>
            </div>

            <div className="space-y-3">
              {formData.attachments.map((attachment, index) => (
                <div key={attachment.id} className="bg-muted/30 border border-border rounded p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-heading">Attachment {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={attachment.name}
                      onChange={(e) => updateAttachment(index, "name", e.target.value)}
                      placeholder="Attachment name"
                    />
                    <select
                      value={attachment.type}
                      onChange={(e) => updateAttachment(index, "type", e.target.value)}
                      className="h-10 px-3 bg-background border border-border rounded text-foreground"
                    >
                      {attachmentTypes.map((type) => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <Textarea
                    value={attachment.description}
                    onChange={(e) => updateAttachment(index, "description", e.target.value)}
                    placeholder="Attachment description..."
                    rows={2}
                  />
                </div>
              ))}
              {formData.attachments.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  No attachments. Click "Add Attachment" to add one.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4 sticky bottom-0 bg-card">
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

// Map Edit Modal
export function MapEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: MapItem;
  onSave: (item: MapItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  const sizeOptions: MapItem["size"][] = ["small", "medium", "large"];

  const addMedia = () => {
    const newMedia: MapMediaItem = {
      type: "image",
      url: "",
      title: "",
    };
    setFormData({
      ...formData,
      media: [...formData.media, newMedia]
    });
  };

  const updateMedia = (index: number, field: keyof MapMediaItem, value: string) => {
    const newMedia = [...formData.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setFormData({ ...formData, media: newMedia });
  };

  const removeMedia = (index: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Add" : "Edit"} Map
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Map name"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Size</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as MapItem["size"] })}
                className="w-full h-10 px-3 bg-background border border-border rounded text-foreground"
              >
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>{size.charAt(0).toUpperCase() + size.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Environment</label>
              <Input
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                placeholder="Urban, Desert, Forest..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Main Image URL</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Map description..."
              rows={3}
            />
          </div>

          {/* Media Gallery */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-muted-foreground">Gallery (Images & Videos)</label>
              <Button variant="outline" size="sm" onClick={addMedia}>
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </div>

            <div className="space-y-3">
              {formData.media.map((mediaItem, index) => (
                <div key={index} className="bg-muted/30 border border-border rounded p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-heading">Media {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={mediaItem.type}
                      onChange={(e) => updateMedia(index, "type", e.target.value)}
                      className="h-10 px-3 bg-background border border-border rounded text-foreground"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <Input
                      className="col-span-2"
                      value={mediaItem.url}
                      onChange={(e) => updateMedia(index, "url", e.target.value)}
                      placeholder="URL..."
                    />
                  </div>
                  <Input
                    value={mediaItem.title || ""}
                    onChange={(e) => updateMedia(index, "title", e.target.value)}
                    placeholder="Title (optional)"
                  />
                </div>
              ))}
              {formData.media.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  No media. Click "Add Media" to add images or videos.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4 sticky bottom-0 bg-card">
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

// Device Edit Modal
export function DeviceEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: GameDeviceItem;
  onSave: (item: GameDeviceItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  const addMedia = () => {
    const newMedia: MapMediaItem = {
      type: "image",
      url: "",
      title: "",
    };
    setFormData({
      ...formData,
      media: [...formData.media, newMedia]
    });
  };

  const updateMedia = (index: number, field: keyof MapMediaItem, value: string) => {
    const newMedia = [...formData.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setFormData({ ...formData, media: newMedia });
  };

  const removeMedia = (index: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Add" : "Edit"} Device
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Device name"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Class Restriction (optional)</label>
              <Input
                value={formData.classRestriction || ""}
                onChange={(e) => setFormData({ ...formData, classRestriction: e.target.value })}
                placeholder="e.g., Juggernaut"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description..."
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Details</label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Technical details, usage instructions..."
              rows={4}
            />
          </div>

          {/* Media Gallery */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-muted-foreground">Media (Images & Videos)</label>
              <Button variant="outline" size="sm" onClick={addMedia}>
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </div>

            <div className="space-y-3">
              {formData.media.map((mediaItem, index) => (
                <div key={index} className="bg-muted/30 border border-border rounded p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-heading">Media {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={mediaItem.type}
                      onChange={(e) => updateMedia(index, "type", e.target.value)}
                      className="h-10 px-3 bg-background border border-border rounded text-foreground"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <Input
                      className="col-span-2"
                      value={mediaItem.url}
                      onChange={(e) => updateMedia(index, "url", e.target.value)}
                      placeholder="URL..."
                    />
                  </div>
                  <Input
                    value={mediaItem.title || ""}
                    onChange={(e) => updateMedia(index, "title", e.target.value)}
                    placeholder="Title (optional)"
                  />
                </div>
              ))}
              {formData.media.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  No media. Click "Add Media" to add images or videos.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4 sticky bottom-0 bg-card">
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

// Game Mode Edit Modal
export function GameModeEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: GameModeItem;
  onSave: (item: GameModeItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  const addRule = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, ""]
    });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const removeRule = (index: number) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter((_, i) => i !== index)
    });
  };

  const addMedia = () => {
    const newMedia: MapMediaItem = {
      type: "image",
      url: "",
      title: "",
    };
    setFormData({
      ...formData,
      media: [...formData.media, newMedia]
    });
  };

  const updateMedia = (index: number, field: keyof MapMediaItem, value: string) => {
    const newMedia = [...formData.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setFormData({ ...formData, media: newMedia });
  };

  const removeMedia = (index: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Add" : "Edit"} Game Mode
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Team Deathmatch"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Short Name</label>
              <Input
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                placeholder="TDM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Player Count</label>
              <Input
                value={formData.playerCount || ""}
                onChange={(e) => setFormData({ ...formData, playerCount: e.target.value })}
                placeholder="5v5"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Round Time</label>
              <Input
                value={formData.roundTime || ""}
                onChange={(e) => setFormData({ ...formData, roundTime: e.target.value })}
                placeholder="10 minutes"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Game mode description..."
              rows={3}
            />
          </div>

          {/* Rules */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-muted-foreground">Rules</label>
              <Button variant="outline" size="sm" onClick={addRule}>
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    placeholder="Rule..."
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRule(index)}
                    className="text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {formData.rules.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-2">
                  No rules. Click "Add Rule" to add one.
                </p>
              )}
            </div>
          </div>

          {/* Media Gallery */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-muted-foreground">Media (Images & Videos)</label>
              <Button variant="outline" size="sm" onClick={addMedia}>
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </div>

            <div className="space-y-3">
              {formData.media.map((mediaItem, index) => (
                <div key={index} className="bg-muted/30 border border-border rounded p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-heading">Media {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={mediaItem.type}
                      onChange={(e) => updateMedia(index, "type", e.target.value)}
                      className="h-10 px-3 bg-background border border-border rounded text-foreground"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <Input
                      className="col-span-2"
                      value={mediaItem.url}
                      onChange={(e) => updateMedia(index, "url", e.target.value)}
                      placeholder="URL..."
                    />
                  </div>
                  <Input
                    value={mediaItem.title || ""}
                    onChange={(e) => updateMedia(index, "title", e.target.value)}
                    placeholder="Title (optional)"
                  />
                </div>
              ))}
              {formData.media.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  No media. Click "Add Media" to add images or videos.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4 sticky bottom-0 bg-card">
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
