import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClassItem } from "@/lib/content-store";
import { FileUpload } from "@/components/ui/file-upload";

export function ClassEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: ClassItem;
  onSave: (item: ClassItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  const updateDetail = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const updateDevice = (index: number, field: 'name' | 'icon', value: string) => {
    const newDevices = [...(formData.devices || [])];
    newDevices[index] = { ...newDevices[index], [field]: value };
    setFormData({ ...formData, devices: newDevices });
  };

  const addDevice = () => {
    setFormData({
      ...formData,
      devices: [...(formData.devices || []), { name: "", icon: "Shield" }],
    });
  };

  const removeDevice = (index: number) => {
    const newDevices = (formData.devices || []).filter((_, i) => i !== index);
    setFormData({ ...formData, devices: newDevices });
  };

  const iconOptions = ["Crosshair", "Shield", "Eye", "Target", "Users", "Heart", "Zap", "Wrench"];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Create" : "Edit"} Class
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
                placeholder="Assault"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Role</label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Frontline Fighter"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Image URL</label>
            <div className="space-y-4">
              <FileUpload 
                currentValue={formData.image}
                onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                accept="image/*"
                label="Upload Class Image"
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
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
            >
              {["Crosshair", "Shield", "Eye", "Target", "Users", "Heart"].map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Class description..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Details (4 bullet points)</label>
            <div className="space-y-2">
              {[0, 1, 2, 3].map((index) => (
                <Input
                  key={index}
                  value={formData.details[index] || ""}
                  onChange={(e) => updateDetail(index, e.target.value)}
                  placeholder={`Detail ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-muted-foreground">Class Equipment/Devices</label>
              <Button variant="outline" size="sm" onClick={addDevice}>
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </div>
            <div>
            <label className="text-sm text-muted-foreground mb-1 block">Devices Used Title</label>
            <Input
              value={formData.devicesUsedTitle || ""}
              onChange={(e) => setFormData({ ...formData, devicesUsedTitle: e.target.value })}
              placeholder="Devices & Features (leave empty for default)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Custom title for the devices Used Class (e.g., "Abilities", "Components", "Tools", etc.)
            </p>
          </div>

            <div className="space-y-3">
              {(formData.devices || []).map((device, index) => (
                <div key={index} className="bg-surface-dark border border-border rounded p-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary font-heading">Device {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDevice(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={device.name}
                      onChange={(e) => updateDevice(index, 'name', e.target.value)}
                      placeholder="Device name"
                    />
                    <select
                      value={device.icon}
                      onChange={(e) => updateDevice(index, 'icon', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {(!formData.devices || formData.devices.length === 0) && (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  No devices added. Click "Add Device" to add equipment for this class.
                </p>
              )}
            </div>
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
