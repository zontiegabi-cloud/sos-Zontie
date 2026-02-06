import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Calendar, ListTodo, Check, X, ArrowUp, ArrowDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServerFilePicker } from "@/components/admin/server-file-picker";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useContent } from "@/hooks/use-content";
import { cn, generateId } from "@/lib/utils";
import { RoadmapItem, RoadmapTask } from "@/lib/content-store";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function RoadMapTab() {
  const { roadmap, addRoadmapItem, updateRoadmapItem, deleteRoadmapItem } = useContent();
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Sorting
  const sortedRoadmap = [...(roadmap || [])].sort((a, b) => a.order - b.order);

  const filteredRoadmap = sortedRoadmap.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isCreating) {
      addRoadmapItem(editingItem);
      toast.success("Roadmap phase created!");
    } else {
      updateRoadmapItem(editingItem.id, editingItem);
      toast.success("Roadmap phase updated!");
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteRoadmapItem(deleteId);
      toast.success("Roadmap phase deleted!");
      setDeleteId(null);
    }
  };

  const createNewItem = () => {
    const maxOrder = roadmap?.length ? Math.max(...roadmap.map(i => i.order)) : -1;
    setEditingItem({
      id: generateId(),
      phase: "",
      title: "",
      date: "",
      status: "planned",
      description: "",
      tasks: [],
      order: maxOrder + 1,
    });
    setIsCreating(true);
  };

  const handleMoveItem = (id: string, direction: 'up' | 'down') => {
    const index = sortedRoadmap.findIndex(i => i.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const prev = sortedRoadmap[index - 1];
      const current = sortedRoadmap[index];
      updateRoadmapItem(current.id, { order: prev.order });
      updateRoadmapItem(prev.id, { order: current.order });
    } else if (direction === 'down' && index < sortedRoadmap.length - 1) {
      const next = sortedRoadmap[index + 1];
      const current = sortedRoadmap[index];
      updateRoadmapItem(current.id, { order: next.order });
      updateRoadmapItem(next.id, { order: current.order });
    }
  };

  // Task Management Helpers
  const addTask = () => {
    if (!editingItem) return;
    const newTask: RoadmapTask = {
      id: generateId(),
      text: "",
      status: "pending"
    };
    setEditingItem({
      ...editingItem,
      tasks: [...editingItem.tasks, newTask]
    });
  };

  const updateTask = (taskId: string, updates: Partial<RoadmapTask>) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      tasks: editingItem.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    });
  };

  const removeTask = (taskId: string) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      tasks: editingItem.tasks.filter(t => t.id !== taskId)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delayed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const uniqueCategories = Array.from(new Set(roadmap?.map(item => item.category).filter(Boolean) || []));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roadmap..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={createNewItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Phase
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredRoadmap.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="group relative overflow-hidden hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{item.phase}</span>
                          {item.category && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 py-0 border-primary/30 text-primary/80">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="secondary">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground max-w-2xl">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.tasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-center gap-1.5 text-xs bg-muted/50 px-2 py-1 rounded border">
                          {task.status === 'completed' ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : task.status === 'in-progress' ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                          )}
                          <span className={task.status === 'completed' ? 'line-through opacity-60' : ''}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                      {item.tasks.length > 5 && (
                        <span className="text-xs text-muted-foreground py-1 px-2">+ {item.tasks.length - 5} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 mr-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        disabled={index === 0}
                        onClick={() => handleMoveItem(item.id, 'up')}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        disabled={index === filteredRoadmap.length - 1}
                        onClick={() => handleMoveItem(item.id, 'down')}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingItem(item);
                        setIsCreating(false);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredRoadmap.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No roadmap phases found</p>
            <p className="text-sm mt-1">Create a new phase to get started</p>
          </div>
        )}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create Phase" : "Edit Phase"}</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <form onSubmit={handleSaveItem} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phase Name</Label>
                  <Input 
                    value={editingItem.phase} 
                    onChange={e => setEditingItem({...editingItem, phase: e.target.value})}
                    placeholder="e.g. Alpha"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date / ETA</Label>
                  <Input 
                    value={editingItem.date} 
                    onChange={e => setEditingItem({...editingItem, date: e.target.value})}
                    placeholder="e.g. Q4 2026"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={editingItem.title} 
                  onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                  placeholder="e.g. Global Release"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={editingItem.status} 
                  onValueChange={(val) => setEditingItem({...editingItem, status: val as 'planned' | 'in-progress' | 'completed' | 'delayed'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={editingItem.description} 
                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                  placeholder="Phase description..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Category (Optional)</Label>
                <div className="relative">
                  <Input 
                    value={editingItem.category || ""} 
                    onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                    placeholder="e.g. Crowdfunding, Prototype, Alpha..."
                    list="categories-list"
                  />
                  <datalist id="categories-list">
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use categories to group phases together. You can filter by this category in the Page Builder.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Phase Image (Optional)</Label>
                <div className="flex gap-2">
                  <FileUpload
                    currentValue={editingItem.image || ""}
                    onUploadComplete={(url) => setEditingItem({ ...editingItem, image: url })}
                    className="flex-1"
                  />
                  <ServerFilePicker
                    onSelect={(url) => setEditingItem({ ...editingItem, image: url })}
                    trigger={
                      <Button variant="outline" size="icon" type="button" title="Select from Uploads">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label>Tasks / Features</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addTask}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {editingItem.tasks.map((task, index) => (
                    <div key={task.id} className="flex gap-2 items-start">
                      <div className="mt-2 text-xs text-muted-foreground w-6">{index + 1}.</div>
                      <div className="flex-1 space-y-2">
                        <Input 
                          value={task.text}
                          onChange={e => updateTask(task.id, { text: e.target.value })}
                          placeholder="Task description"
                        />
                      </div>
                      <Select 
                        value={task.status} 
                        onValueChange={(val) => updateTask(task.id, { status: val as 'pending' | 'in-progress' | 'completed' })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeTask(task.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {editingItem.tasks.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">No tasks added yet.</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this roadmap phase.
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
    </div>
  );
}