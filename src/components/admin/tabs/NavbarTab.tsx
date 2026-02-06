import { useState } from "react";
import { Plus, Trash2, Pencil, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { NavbarItem } from "@/lib/content-store";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

export function NavbarTab() {
  const { settings, updateNavbar } = useSiteSettings();
  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fallback to empty array if undefined
  const navbarItems = settings.navbar || [];

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isCreating) {
      const newItem = {
        ...editingItem,
        id: generateId(),
        order: navbarItems.length,
      };
      await updateNavbar([...navbarItems, newItem]);
      toast.success("Navbar item created");
    } else {
      const updatedItems = navbarItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      await updateNavbar(updatedItems);
      toast.success("Navbar item updated");
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDeleteItem = async (id: string) => {
    const updatedItems = navbarItems.filter(item => item.id !== id);
    await updateNavbar(updatedItems);
    toast.success("Navbar item deleted");
  };

  const handleMoveItem = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === navbarItems.length - 1) return;

    const newItems = [...navbarItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    // Update order property
    newItems.forEach((item, idx) => item.order = idx);
    
    await updateNavbar(newItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Navbar Configuration</h2>
          <p className="text-muted-foreground">
            Manage your website's main navigation menu.
          </p>
        </div>
        <Button onClick={() => {
          setEditingItem({
            id: "",
            name: "",
            path: "/",
            isExternal: false,
            order: 0,
            enabled: true
          });
          setIsCreating(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {navbarItems.map((item, index) => (
          <Card key={item.id} className="bg-muted/40">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  disabled={index === 0}
                  onClick={() => handleMoveItem(index, 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  disabled={index === navbarItems.length - 1}
                  onClick={() => handleMoveItem(index, 'down')}
                >
                   <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {!item.enabled && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Disabled</span>
                  )}
                  {item.isExternal && (
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono">{item.path}</p>
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  checked={item.enabled}
                  onCheckedChange={async (checked) => {
                     const updated = navbarItems.map(i => i.id === item.id ? { ...i, enabled: checked } : i);
                     await updateNavbar(updated);
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => {
                  setEditingItem(item);
                  setIsCreating(false);
                }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {navbarItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            <p>No navigation items found. Add one to get started.</p>
          </div>
        )}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCreating ? "Add Navigation Link" : "Edit Navigation Link"}</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input 
                  value={editingItem.name} 
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Home"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Path / URL</Label>
                <Input 
                  value={editingItem.path} 
                  onChange={(e) => setEditingItem({ ...editingItem, path: e.target.value })}
                  placeholder="e.g. /about or https://google.com"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Open in New Tab?</Label>
                <Switch 
                  checked={editingItem.isExternal}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isExternal: checked })}
                />
              </div>

               <div className="flex items-center justify-between">
                <Label>Enabled?</Label>
                <Switch 
                  checked={editingItem.enabled}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, enabled: checked })}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
