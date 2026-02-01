import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "@/hooks/use-content";
import { WeaponItem } from "@/lib/content-store";
import { toast } from "sonner";
import { WeaponEditModal } from "@/components/admin/GameContentModals";

export function WeaponsTab() {
  const { weapons, addWeaponItem, updateWeaponItem, deleteWeaponItem, updateContent, content } = useContent();
  const [editingWeapon, setEditingWeapon] = useState<WeaponItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredWeapons = weapons.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredWeapons.map((item) => item.id)));
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
    if (confirm(`Are you sure you want to delete ${selectedIds.size} weapons?`)) {
      const newWeapons = weapons.filter((item) => !selectedIds.has(item.id));
      updateContent({ ...content, weapons: newWeapons });
      setSelectedIds(new Set());
      toast.success("Selected weapons deleted!");
    }
  };

  const handleSaveWeapon = (item: WeaponItem) => {
    if (isCreating) {
      addWeaponItem(item);
      toast.success("Weapon created!");
    } else {
      updateWeaponItem(item.id, item);
      toast.success("Weapon updated!");
    }
    setEditingWeapon(null);
    setIsCreating(false);
  };

  const handleDeleteWeapon = (id: string) => {
    if (confirm("Are you sure you want to delete this weapon?")) {
      deleteWeaponItem(id);
      toast.success("Weapon deleted!");
    }
  };

  const createNewWeapon = () => {
    setEditingWeapon({
      id: "",
      name: "",
      category: "assault",
      description: "",
      image: "",
      stats: { damage: 50, accuracy: 50, range: 50, fireRate: 50, mobility: 50, control: 50 },
      attachments: [],
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
            Manage Weapons
          </h2>
          <p className="text-muted-foreground text-sm">
            {weapons.length} weapons total
          </p>
        </div>
        <Button onClick={createNewWeapon}>
          <Plus className="w-4 h-4 mr-2" />
          Add Weapon
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search weapons..."
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
            checked={filteredWeapons.length > 0 && selectedIds.size === filteredWeapons.length}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWeapons.map((item) => (
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
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Crosshair className="w-12 h-12 opacity-20" />
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
                    setEditingWeapon(item);
                    setIsCreating(false);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDeleteWeapon(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 flex-1">
              <span className="text-xs text-primary uppercase font-heading">{item.category}</span>
              <h3 className="font-heading text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
              <p className="text-xs text-muted-foreground">{item.attachments.length} attachments</p>
            </div>
          </motion.div>
        ))}
        {filteredWeapons.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
            <Crosshair className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No weapons found matching your search.</p>
          </div>
        )}
      </div>

      {editingWeapon && (
        <WeaponEditModal
          item={editingWeapon}
          onSave={handleSaveWeapon}
          onCancel={() => {
            setEditingWeapon(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}
