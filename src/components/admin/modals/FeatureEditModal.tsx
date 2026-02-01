import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FeatureItem } from "@/lib/content-store";

export function FeatureEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: FeatureItem;
  onSave: (item: FeatureItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  const updateDevice = (index: number, field: 'name' | 'details' | 'icon', value: string) => {
    const newDevices = [...formData.devices];
    newDevices[index] = { ...newDevices[index], [field]: value };
    setFormData({ ...formData, devices: newDevices });
  };

  const addDevice = () => {
    setFormData({
      ...formData,
      devices: [...formData.devices, { name: "", details: "", icon: "" }],
    });
  };

  const removeDevice = (index: number) => {
    const newDevices = formData.devices.filter((_, i) => i !== index);
    setFormData({ ...formData, devices: newDevices });
  };

  const iconOptions = ["Crosshair", "Shield", "Wrench", "Target", "Users", "Eye", "Heart", "Zap"];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Create" : "Edit"} Feature
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
              placeholder="Feature title"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Feature description"
              rows={3}
            />
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
            <label className="text-sm text-muted-foreground mb-1 block">Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Devices Section Title</label>
            <Input
              value={formData.devicesSectionTitle || ""}
              onChange={(e) => setFormData({ ...formData, devicesSectionTitle: e.target.value })}
              placeholder="Devices & Features (leave empty for default)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Custom title for the devices section (e.g., "Abilities", "Components", "Tools", etc.)
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-muted-foreground">
                {formData.devicesSectionTitle || "Devices & Features"}
              </label>
              <Button variant="outline" size="sm" onClick={addDevice}>
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </div>

            <div className="space-y-3">
              {formData.devices.map((device, index) => (
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
                  <Input
                    value={device.name}
                    onChange={(e) => updateDevice(index, 'name', e.target.value)}
                    placeholder="Device name"
                    className="mb-2"
                  />
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Device Icon (optional)</label>
                    <select
                      value={device.icon || ""}
                      onChange={(e) => updateDevice(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                    >
                      <option value="">No Icon</option>
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Textarea
                    value={device.details}
                    onChange={(e) => updateDevice(index, 'details', e.target.value)}
                    placeholder="Device details"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 flex gap-4 justify-end border-t border-border sticky bottom-0 bg-card">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? "Create" : "Save"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
