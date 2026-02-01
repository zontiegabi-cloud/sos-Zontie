import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Map, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "@/hooks/use-content";
import { MapItem } from "@/lib/content-store";
import { MapEditModal } from "../GameContentModals";
import { toast } from "sonner";

export function MapsTab() {
  const { maps, addMapItem, updateMapItem, deleteMapItem, updateContent, content } = useContent();
  const [editingMap, setEditingMap] = useState<MapItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredMaps = maps.filter((map) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.environment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredMaps.map((map) => map.id)));
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
    if (confirm(`Are you sure you want to delete ${selectedIds.size} maps?`)) {
      const newMaps = maps.filter((map) => !selectedIds.has(map.id));
      updateContent({ ...content, maps: newMaps });
      setSelectedIds(new Set());
      toast.success("Selected maps deleted!");
    }
  };

  const handleSaveMap = (item: MapItem) => {
    if (isCreating) {
      addMapItem(item);
      toast.success("Map created!");
    } else {
      updateMapItem(item.id, item);
      toast.success("Map updated!");
    }
    setEditingMap(null);
    setIsCreating(false);
  };

  const handleDeleteMap = (id: string) => {
    if (confirm("Are you sure you want to delete this map?")) {
      deleteMapItem(id);
      toast.success("Map deleted!");
    }
  };

  const createNewMap = () => {
    const newMap: MapItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      image: "",
      size: "medium",
      environment: "",
      media: [],
    };
    setEditingMap(newMap);
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
          <h2 className="text-2xl font-heading text-primary">Maps Management</h2>
          <p className="text-muted-foreground text-sm">
            {maps.length} maps total
          </p>
        </div>
        <Button onClick={createNewMap}>
          <Plus className="w-4 h-4 mr-2" />
          Add Map
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maps..."
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
            checked={filteredMaps.length > 0 && selectedIds.size === filteredMaps.length}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaps.map((map) => (
          <motion.div
            key={map.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-card border rounded-lg overflow-hidden flex flex-col transition-colors ${
              selectedIds.has(map.id) ? "border-primary ring-1 ring-primary" : "border-border"
            }`}
          >
            <div className="relative h-48 bg-muted group">
              {map.image ? (
                <img
                  src={map.image}
                  alt={map.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Map className="w-12 h-12 opacity-20" />
                </div>
              )}
              
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedIds.has(map.id)}
                  onCheckedChange={(checked) => handleSelectOne(map.id, checked as boolean)}
                  className="bg-background/80 backdrop-blur-sm border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => {
                    setEditingMap(map);
                    setIsCreating(false);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDeleteMap(map.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-bold uppercase">
                {map.size}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-heading text-lg text-foreground">{map.name}</h3>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                  {map.environment}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                {map.description}
              </p>
              <div className="text-xs text-muted-foreground pt-3 border-t border-border flex justify-between items-center">
                <span>{map.media.length} Media items</span>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredMaps.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
            <Map className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No maps found matching your search.</p>
          </div>
        )}
      </div>

      {editingMap && (
        <MapEditModal
          item={editingMap}
          onSave={handleSaveMap}
          onCancel={() => {
            setEditingMap(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}
