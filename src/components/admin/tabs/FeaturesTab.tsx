import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "@/hooks/use-content";
import { FeatureItem } from "@/lib/content-store";
import { toast } from "sonner";
import { FeatureEditModal } from "@/components/admin/modals/FeatureEditModal";

export function FeaturesTab() {
  const { features, addFeatureItem, updateFeatureItem, deleteFeatureItem, content, updateContent } = useContent();
  const [editingFeature, setEditingFeature] = useState<FeatureItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredFeatures = features.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveFeature = (item: FeatureItem) => {
    if (isCreating) {
      addFeatureItem(item);
      toast.success("Feature created!");
    } else {
      updateFeatureItem(item.id, item);
      toast.success("Feature updated!");
    }
    setEditingFeature(null);
    setIsCreating(false);
  };

  const handleDeleteFeature = (id: string) => {
    if (confirm("Are you sure you want to delete this feature?")) {
      deleteFeatureItem(id);
      toast.success("Feature deleted!");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredFeatures.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFeatures.map(f => f.id)));
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
      const newFeatures = features.filter(item => !selectedIds.has(item.id));
      updateContent({ ...content, features: newFeatures });
      setSelectedIds(new Set());
      toast.success("Selected items deleted!");
    }
  };

  const createNewFeature = () => {
    setEditingFeature({
      id: "",
      title: "",
      description: "",
      image: "",
      icon: "Crosshair",
      devices: [{ name: "", details: "", icon: "" }],
      devicesSectionTitle: "",
    });
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
          <h2 className="text-2xl font-heading text-primary">Manage Features</h2>
          <p className="text-muted-foreground text-sm">Highlight key game features</p>
        </div>
        <div className="flex items-center gap-2">
           {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button onClick={createNewFeature}>
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
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
            {selectedIds.size === filteredFeatures.length && filteredFeatures.length > 0 ? (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((item) => (
          <div
            key={item.id}
            className={`bg-card border rounded p-4 flex items-start gap-4 relative transition-colors ${
              selectedIds.has(item.id) ? "border-primary ring-1 ring-primary" : "border-border"
            }`}
          >
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedIds.has(item.id)}
                onCheckedChange={() => toggleSelection(item.id)}
                className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
            </div>
            
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded cursor-pointer mt-6"
              onClick={() => toggleSelection(item.id)}
            />
            <div className="flex-1 cursor-pointer mt-6" onClick={() => toggleSelection(item.id)}>
              <h3 className="font-heading text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item.description}
              </p>
              <p className="text-xs text-primary mb-3">
                {item.devices.length} devices
              </p>
            </div>
             <div className="flex flex-col gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFeature(item);
                    setIsCreating(false);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFeature(item.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
          </div>
        ))}
        {filteredFeatures.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
            <p>No features found matching your search.</p>
          </div>
        )}
      </div>

      {editingFeature && (
        <FeatureEditModal
          item={editingFeature}
          onSave={handleSaveFeature}
          onCancel={() => {
            setEditingFeature(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}
