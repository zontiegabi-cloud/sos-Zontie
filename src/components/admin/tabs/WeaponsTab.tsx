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

export function WeaponsTab() {
  const { weapons, addWeaponItem, updateWeaponItem, deleteWeaponItem, updateContent, content } = useContent();
  const [editingWeapon, setEditingWeapon] = useState<WeaponItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBatchDelete, setIsBatchDelete] = useState(false);

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

  const handleBatchDeleteClick = () => {
    setIsBatchDelete(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (isBatchDelete) {
      const newWeapons = weapons.filter((item) => !selectedIds.has(item.id));
      updateContent({ ...content, weapons: newWeapons });
      setSelectedIds(new Set());
      toast.success("Selected weapons deleted!");
      setIsBatchDelete(false);
    } else if (deleteId) {
      deleteWeaponItem(deleteId);
      toast.success("Weapon deleted!");
      setDeleteId(null);
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
          <Button 
            variant="destructive" 
            size="sm" 
            disabled={selectedIds.size === 0}
            onClick={handleBatchDeleteClick}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedIds.size})
          </Button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWeapons.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Crosshair className="w-8 h-8 opacity-20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => setEditingWeapon(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDeleteClick(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold leading-none mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
  

      {editingWeapon && (
        <WeaponEditModal
          item={editingWeapon}
          onCancel={() => {
            setEditingWeapon(null);
            setIsCreating(false);
          }}
          onSave={handleSaveWeapon}
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
                ? `This will permanently delete ${selectedIds.size} weapons. This action cannot be undone.`
                : "This will permanently delete this weapon. This action cannot be undone."
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
    </motion.div>
  );
}
