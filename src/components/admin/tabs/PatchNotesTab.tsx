import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { 
  Plus, Pencil, Trash2, Search, Calendar, ListTodo, Check, X, 
  ArrowUp, ArrowDown, ImageIcon, Type, List, CheckSquare, 
  Heading, GripVertical, FileText, ChevronRight, ChevronDown, 
  AlignLeft, Minus, Image as LucideImage
} from "lucide-react";
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
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn, generateId } from "@/lib/utils";
import { PatchNoteItem, PatchNoteBlock } from "@/lib/content-store";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Block Editor Components ---

interface BlockEditorProps {
  blocks: PatchNoteBlock[];
  onChange: (blocks: PatchNoteBlock[]) => void;
}

function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = (type: PatchNoteBlock['type']) => {
    const newBlock: PatchNoteBlock = {
      id: generateId(),
      type,
      content: '',
      items: type === 'list' || type === 'tree' ? [] : undefined,
      expanded: type === 'tree' ? true : undefined,
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<PatchNoteBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('header')}><Heading className="w-4 h-4 mr-1" /> Header</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('subheader')}><Type className="w-4 h-4 mr-1" /> Subheader</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('text')}><AlignLeft className="w-4 h-4 mr-1" /> Text</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('list')}><List className="w-4 h-4 mr-1" /> List</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('checkbox')}><CheckSquare className="w-4 h-4 mr-1" /> Checkbox</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('tree')}><ListTodo className="w-4 h-4 mr-1" /> Tree</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('image')}><LucideImage className="w-4 h-4 mr-1" /> Image</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => addBlock('divider')}><Minus className="w-4 h-4 mr-1" /> Divider</Button>
      </div>

      <div className="space-y-2">
        {blocks.map((block, index) => (
          <BlockItem 
            key={block.id} 
            block={block} 
            onUpdate={(updates) => updateBlock(block.id, updates)}
            onRemove={() => removeBlock(block.id)}
            onMove={(dir) => moveBlock(index, dir)}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
          />
        ))}
        {blocks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
            <p>No content blocks yet. Add one from the toolbar above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SimpleListEditorProps {
  items: PatchNoteBlock[];
  onChange: (items: PatchNoteBlock[]) => void;
  onPromote?: (item: PatchNoteBlock) => void;
  level?: number;
}

function SimpleListEditor({ items, onChange, onPromote, level = 0 }: SimpleListEditorProps) {
  const updateItem = (index: number, content: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], content };
    onChange(newItems);
  };

  const addItem = (index: number) => {
    const newItems = [...items];
    const newItem: PatchNoteBlock = { id: generateId(), type: 'text', content: '' };
    newItems.splice(index + 1, 0, newItem);
    onChange(newItems);
  };
  
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateSubItems = (index: number, subItems: PatchNoteBlock[]) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], items: subItems };
    onChange(newItems);
  };

  const handlePromote = (index: number, childItem: PatchNoteBlock) => {
    // Child wants to be promoted to our level, after the parent (items[index])
    const newItems = [...items];
    // Add childItem after items[index]
    newItems.splice(index + 1, 0, childItem);
    // The child was already removed from the parent's items by the sub-editor's logic?
    // No, the sub-editor calls onPromote, but it's the sub-editor's job to update its own list?
    // Actually, usually the parent handles the move.
    // Let's assume the sub-editor just signals "I want to move out".
    // But we need to remove it from items[index].items.
    // So we need to do both: update items[index] AND insert into newItems.
    
    // Wait, simpler: The sub-editor (rendering items[index].items) calls onPromote.
    // But the sub-editor has its own 'onChange'.
    // The sub-editor should probably remove the item itself via its onChange, AND call onPromote to add it here.
    // BUT, React state updates are batched/async.
    // Better pattern: Pass a callback that does BOTH.
    
    // Actually, the sub-editor calls 'onPromote' with the item.
    // The sub-editor logic (handleKeyDown -> Shift+Tab) will call onPromote.
    // It should ALSO remove the item from its list.
    
    // Let's refine the contract:
    // onPromote(item) -> Parent adds item to its list.
    // The Child editor is responsible for removing it from its list?
    // Yes.
    
    newItems.splice(index + 1, 0, childItem);
    
    // We also need to remove it from items[index].items? 
    // No, the sub-editor called 'onChange' with the item removed?
    // If the sub-editor handles the removal, we just handle the addition.
    
    onChange(newItems);
  };

  const handleIndent = (index: number) => {
    if (index === 0) return; // Cannot indent the first item
    
    const itemToMove = items[index];
    const newItems = [...items];
    
    // Remove from current list
    newItems.splice(index, 1);
    
    // Add to previous item's children
    const prevItem = newItems[index - 1];
    const prevItemChildren = prevItem.items || [];
    
    newItems[index - 1] = {
      ...prevItem,
      items: [...prevItemChildren, itemToMove]
    };
    
    onChange(newItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addItem(index);
    }
    if (e.key === 'Backspace' && items[index].content === '' && (!items[index].items || items[index].items?.length === 0)) {
        e.preventDefault();
        // If it's the last item and empty, just remove.
        // If we are at the start of content, maybe merge with previous?
        // For now, simple remove.
        removeItem(index);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent
        if (onPromote) {
           onPromote(items[index]);
           removeItem(index);
        }
      } else {
        // Indent
        handleIndent(index);
      }
    }
  };

  // Auto-resize textarea
  const adjustHeight = (el: HTMLTextAreaElement) => {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
  };

  if (!items || items.length === 0) {
      return (
          <Button type="button" variant="outline" size="sm" onClick={() => onChange([{ id: generateId(), type: 'text', content: '' }])}>
              <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
      )
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id} className="group/item">
           <div className="flex items-start gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 shrink-0 mt-3" />
             <div className="flex-1 space-y-2">
                <Textarea
                  value={item.content || ''}
                  onChange={(e) => {
                    updateItem(index, e.target.value);
                    adjustHeight(e.target);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder="List item..."
                  className="min-h-[38px] py-2 h-[38px] resize-none overflow-hidden"
                  autoFocus={item.content === '' && index === items.length - 1} 
                  ref={(ref) => ref && adjustHeight(ref)}
                />
                
                {/* Recursive Sub-list */}
                {(item.items && item.items.length > 0) && (
                  <div className="pl-4 border-l border-border/50">
                    <SimpleListEditor 
                      items={item.items} 
                      onChange={(subItems) => updateSubItems(index, subItems)}
                      onPromote={(promotedItem) => handlePromote(index, promotedItem)}
                      level={level + 1}
                    />
                  </div>
                )}
             </div>
             
             <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity mt-0.5" onClick={() => removeItem(index)}>
               <X className="w-4 h-4" />
             </Button>
           </div>
        </div>
      ))}
      {level === 0 && (
        <div className="pl-4 pt-1">
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 text-xs" onClick={() => addItem(items.length - 1)}>
              <Plus className="w-3 h-3 mr-2" /> Add Item (Enter)
          </Button>
        </div>
      )}
    </div>
  );
}

function BlockItem({ 
  block, 
  onUpdate, 
  onRemove, 
  onMove, 
  isFirst, 
  isLast 
}: { 
  block: PatchNoteBlock; 
  onUpdate: (u: Partial<PatchNoteBlock>) => void; 
  onRemove: () => void; 
  onMove: (d: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="group relative border rounded-md p-3 bg-card hover:border-primary/50 transition-colors">
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button type="button" size="icon" variant="ghost" className="h-6 w-6" disabled={isFirst} onClick={() => onMove('up')}><ArrowUp className="w-3 h-3" /></Button>
        <Button type="button" size="icon" variant="ghost" className="h-6 w-6" disabled={isLast} onClick={() => onMove('down')}><ArrowDown className="w-3 h-3" /></Button>
        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={onRemove}><X className="w-3 h-3" /></Button>
      </div>

      <div className="flex items-start gap-3 pr-20">
        <div className="mt-2 text-muted-foreground">
          {block.type === 'header' && <Heading className="w-4 h-4" />}
          {block.type === 'subheader' && <Type className="w-4 h-4" />}
          {block.type === 'text' && <AlignLeft className="w-4 h-4" />}
          {block.type === 'list' && <List className="w-4 h-4" />}
          {block.type === 'checkbox' && <CheckSquare className="w-4 h-4" />}
          {block.type === 'tree' && <ListTodo className="w-4 h-4" />}
          {block.type === 'image' && <LucideImage className="w-4 h-4" />}
          {block.type === 'divider' && <Minus className="w-4 h-4" />}
        </div>

        <div className="flex-1 space-y-2">
          {/* Header & Subheader */}
          {(block.type === 'header' || block.type === 'subheader') && (
            <Input 
              value={block.content || ''} 
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder={block.type === 'header' ? "Header Text" : "Subheader Text"}
              className={block.type === 'header' ? "font-bold text-lg" : "font-semibold"}
            />
          )}

          {/* Text */}
          {block.type === 'text' && (
            <Textarea 
              value={block.content || ''} 
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter text content..."
              className="min-h-[80px]"
            />
          )}

          {/* Divider */}
          {block.type === 'divider' && (
            <div className="h-px bg-border my-4 w-full" />
          )}

          {/* Checkbox */}
          {block.type === 'checkbox' && (
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={block.checked} 
                onCheckedChange={(c) => onUpdate({ checked: c === true })} 
              />
              <Input 
                value={block.label || ''} 
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Checkbox Label"
              />
              <Input 
                value={block.content || ''} 
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Additional details (optional)"
                className="text-muted-foreground text-sm"
              />
            </div>
          )}

          {/* Image */}
          {block.type === 'image' && (
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ServerFilePicker
                      onSelect={(url) => onUpdate({ content: url })}
                      trigger={
                        <Button variant="outline" className="w-full justify-start">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          {block.content ? "Change Image" : "Select Image"}
                        </Button>
                      }
                    />
                  </div>
               </div>
               {block.content && (
                 <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden border">
                   <img src={block.content} alt="Preview" className="w-full h-full object-cover" />
                 </div>
               )}
            </div>
          )}

          {/* Nested List / Tree */}
          {(block.type === 'list' || block.type === 'tree') && (
            <div className="space-y-2">
               {block.type === 'tree' && (
                 <div className="flex items-center gap-2 mb-2">
                   <ChevronRight className="w-4 h-4 text-muted-foreground" />
                   <Input 
                     value={block.label || ''} 
                     onChange={(e) => onUpdate({ label: e.target.value })}
                     placeholder="Tree Section Label"
                     className="font-medium h-9"
                   />
                 </div>
               )}
               <div className={cn("space-y-2", block.type === 'tree' && "pl-6 border-l border-border/50")}>
                 <SimpleListEditor 
                   items={block.items || []} 
                   onChange={(items) => onUpdate({ items })} 
                 />
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export function PatchNotesTab() {
  const { patchnotes, addPatchNoteItem, updatePatchNoteItem, deletePatchNoteItem } = useContent();
  const { settings } = useSiteSettings();
  const [editingItem, setEditingItem] = useState<PatchNoteItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredItems = (patchnotes || []).filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendToDiscord = async (item: PatchNoteItem) => {
    const webhookUrl = settings.discord?.patchNotesWebhookUrl;
    if (!webhookUrl) return;

    // Helper to flatten blocks to text
    const blocksToText = (blocks: PatchNoteBlock[], depth = 0): string => {
      return blocks.map(block => {
        let text = "";
        const indent = "  ".repeat(depth);
        
        switch (block.type) {
          case 'header': text = `\n**${block.content}**\n`; break;
          case 'subheader': text = `\n*${block.content}*\n`; break;
          case 'text': text = `${block.content}\n`; break;
          case 'list': 
            if (block.items) {
              text = block.items.map(li => `• ${li.content}`).join('\n') + '\n';
            }
            break;
          case 'checkbox': text = `${block.checked ? '✅' : '⬜'} ${block.label}${block.content ? `: ${block.content}` : ''}\n`; break;
          case 'tree':
            text = `\n**${block.label}**\n` + (block.items ? blocksToText(block.items, depth + 1) : '');
            break;
          case 'divider': text = "---"; break;
        }
        return indent + text;
      }).join('\n');
    };

    const contentSummary = blocksToText(item.content).substring(0, 2000);

    const payload = {
      username: "Patch Notes Bot",
      avatar_url: "https://www.shadowsofsoldiers.com/wp-content/uploads/2020/08/cropped-logo-1.png",
      embeds: [
        {
          title: `🚀 New Update: v${item.version} - ${item.title}`,
          description: item.subtitle || "A new update has been released!",
          color: 3447003, // Blue
          fields: [
            {
              name: "Details",
              value: contentSummary || "No details provided.",
            },
            {
              name: "Category",
              value: item.category || "Update",
              inline: true
            },
            {
              name: "Date",
              value: item.date,
              inline: true
            }
          ],
          image: item.image ? { url: item.image.startsWith('http') ? item.image : `${window.location.origin}${item.image}` } : undefined,
          footer: {
            text: `Sent from ${settings.branding.siteName}`
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      const response = await fetch('/api/discord-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, payload })
      });

      if (!response.ok) {
        throw new Error('Failed to send Discord notification');
      }
      toast.success("Discord notification sent!");
    } catch (error) {
      console.error('Error sending to Discord:', error);
      toast.error("Failed to send Discord notification");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (isCreating) {
      addPatchNoteItem(editingItem);
      toast.success("Patch note created!");
      
      // Send to discord if webhook is configured
      if (settings.discord?.patchNotesWebhookUrl) {
        await sendToDiscord(editingItem);
      }
    } else {
      updatePatchNoteItem(editingItem.id, editingItem);
      toast.success("Patch note updated!");
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const createNew = () => {
    setEditingItem({
      id: generateId(),
      version: "1.0.0",
      title: "",
      subtitle: "",
      date: new Date().toLocaleDateString(),
      content: [],
      category: "Update"
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading text-foreground">Patch Notes</h2>
          <p className="text-muted-foreground">Manage game updates and changelogs.</p>
        </div>
        <Button onClick={createNew} className="gap-2">
          <Plus className="w-4 h-4" /> Create Note
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search versions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((item) => (
          <motion.div layout key={item.id}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">v{item.version}</Badge>
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <h3 className="font-heading text-xl">{item.title}</h3>
                    {item.subtitle && <p className="text-muted-foreground">{item.subtitle}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsCreating(false); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filteredItems.length === 0 && (
           <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No patch notes found</p>
            <p className="text-sm mt-1">Create a new update to get started</p>
          </div>
        )}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create Patch Note" : "Edit Patch Note"}</DialogTitle>
          </DialogHeader>

          {editingItem && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label>Version</Label>
                   <Input value={editingItem.version} onChange={e => setEditingItem({...editingItem, version: e.target.value})} required />
                </div>
                <div className="space-y-2">
                   <Label>Date</Label>
                   <Input value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} required />
                </div>
                <div className="space-y-2 col-span-2">
                   <Label>Title</Label>
                   <Input value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required />
                </div>
                <div className="space-y-2 col-span-2">
                   <Label>Subtitle (Optional)</Label>
                   <Input value={editingItem.subtitle || ''} onChange={e => setEditingItem({...editingItem, subtitle: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <Label>Category</Label>
                   <Select value={editingItem.category} onValueChange={v => setEditingItem({...editingItem, category: v})}>
                     <SelectTrigger><SelectValue /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Update">Update</SelectItem>
                       <SelectItem value="Hotfix">Hotfix</SelectItem>
                       <SelectItem value="Major Release">Major Release</SelectItem>
                       <SelectItem value="Event">Event</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label>Cover Image</Label>
                   <div className="flex gap-2">
                      <div className="flex-1">
                        <ServerFilePicker
                          onSelect={(url) => setEditingItem({ ...editingItem, image: url })}
                          trigger={
                            <Button type="button" variant="outline" className="w-full justify-start">
                              <ImageIcon className="w-4 h-4 mr-2" />
                              {editingItem.image ? "Change Image" : "Select Image"}
                            </Button>
                          }
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-heading">Content Blocks</Label>
                <div className="border rounded-lg p-4 bg-muted/10">
                  <BlockEditor 
                    blocks={editingItem.content} 
                    onChange={blocks => setEditingItem({...editingItem, content: blocks})} 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                <Button type="submit">Save Patch Note</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patch note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
               if(deleteId) {
                 deletePatchNoteItem(deleteId);
                 toast.success("Patch note deleted");
                 setDeleteId(null);
               }
            }} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
