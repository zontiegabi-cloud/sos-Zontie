import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Smartphone, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "@/hooks/use-content";
import { GameDeviceItem } from "@/lib/content-store";
import { DeviceEditModal } from "../GameContentModals";
import { toast } from "sonner";

export function DevicesTab() {
  const { gameDevices: devices, addDeviceItem, updateDeviceItem, deleteDeviceItem, content, updateContent } = useContent();
  const [editingDevice, setEditingDevice] = useState<GameDeviceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.classRestriction && device.classRestriction.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveDevice = (item: GameDeviceItem) => {
    if (isCreating) {
      addDeviceItem(item);
      toast.success("Device created!");
    } else {
      updateDeviceItem(item.id, item);
      toast.success("Device updated!");
    }
    setEditingDevice(null);
    setIsCreating(false);
  };

  const handleDeleteDevice = (id: string) => {
    if (confirm("Are you sure you want to delete this device?")) {
      deleteDeviceItem(id);
      toast.success("Device deleted!");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredDevices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDevices.map(d => d.id)));
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
      const newDevices = devices.filter(item => !selectedIds.has(item.id));
      updateContent({ ...content, gameDevices: newDevices });
      setSelectedIds(new Set());
      toast.success("Selected items deleted!");
    }
  };

  const createNewDevice = () => {
    const newDevice: GameDeviceItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      image: "",
      details: "",
      media: [],
      classRestriction: "",
    };
    setEditingDevice(newDevice);
    setIsCreating(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading text-primary">Devices Management</h2>
          <p className="text-muted-foreground text-sm">Manage game devices and gadgets</p>
        </div>
        <div className="flex items-center gap-2">
           {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button onClick={createNewDevice}>
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="whitespace-nowrap"
          >
            {selectedIds.size === filteredDevices.length && filteredDevices.length > 0 ? (
              <>
                <X className="w-4 h-4 mr-2" /> Deselect All
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" /> Select All
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <motion.div
            key={device.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-card border rounded-lg overflow-hidden flex flex-col transition-colors ${
              selectedIds.has(device.id) ? "border-primary ring-1 ring-primary" : "border-border"
            }`}
          >
            <div className="relative h-40 bg-muted group">
              {device.image ? (
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Smartphone className="w-12 h-12 opacity-20" />
                </div>
              )}
              
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedIds.has(device.id)}
                  onCheckedChange={() => toggleSelection(device.id)}
                  className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => {
                    setEditingDevice(device);
                    setIsCreating(false);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDeleteDevice(device.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col cursor-pointer" onClick={() => toggleSelection(device.id)}>
              <h3 className="font-heading text-lg text-foreground mb-1">{device.name}</h3>
              {device.classRestriction && (
                <div className="mb-2">
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {device.classRestriction} Only
                  </span>
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                {device.description}
              </p>
            </div>
          </motion.div>
        ))}
        {filteredDevices.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
            <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No devices found matching your search.</p>
          </div>
        )}
      </div>

      {editingDevice && (
        <DeviceEditModal
          item={editingDevice}
          onSave={handleSaveDevice}
          onCancel={() => {
            setEditingDevice(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}
