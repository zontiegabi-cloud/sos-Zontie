import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContent } from "@/hooks/use-content";
import { ClassItem } from "@/lib/content-store";
import { toast } from "sonner";
import { ClassEditModal } from "@/components/admin/modals/ClassEditModal";

export function ClassesTab() {
  const { classes, addClassItem, updateClassItem, deleteClassItem, updateContent, content } = useContent();
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredClasses = classes.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredClasses.map((item) => item.id)));
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
    if (confirm(`Are you sure you want to delete ${selectedIds.size} classes?`)) {
      const newClasses = classes.filter((item) => !selectedIds.has(item.id));
      updateContent({ ...content, classes: newClasses });
      setSelectedIds(new Set());
      toast.success("Selected classes deleted!");
    }
  };

  const handleSaveClass = (item: ClassItem) => {
    if (isCreating) {
      addClassItem(item);
      toast.success("Class created!");
    } else {
      updateClassItem(item.id, item);
      toast.success("Class updated!");
    }
    setEditingClass(null);
    setIsCreating(false);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      deleteClassItem(id);
      toast.success("Class deleted!");
    }
  };

  const createNewClass = () => {
    setEditingClass({
      id: "",
      name: "",
      role: "",
      description: "",
      details: ["", "", "", ""],
      image: "",
      icon: "Crosshair",
      color: "from-red-500/20 to-transparent",
      devices: [],
      devicesUsedTitle: "",
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
            Manage Classes
          </h2>
          <p className="text-muted-foreground text-sm">
            {classes.length} classes total
          </p>
        </div>
        <Button onClick={createNewClass}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
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
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredClasses.length > 0 && selectedIds.size === filteredClasses.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No classes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClasses.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {item.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingClass(item);
                          setIsCreating(false);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClass(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingClass && (
        <ClassEditModal
          item={editingClass}
          onSave={handleSaveClass}
          onCancel={() => {
            setEditingClass(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}
