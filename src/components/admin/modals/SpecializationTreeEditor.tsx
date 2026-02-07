import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronRight, ChevronDown, Link as LinkIcon, X } from "lucide-react";
import { SpecializationNode } from "@/lib/content-store";
import { useContent } from "@/hooks/use-content";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

const generateId = () => Math.random().toString(36).substring(2, 9);

interface TreeEditorProps {
  nodes: SpecializationNode[];
  onChange: (nodes: SpecializationNode[]) => void;
}

const TreeNode = ({ 
  node, 
  onUpdate, 
  onDelete, 
  onAddChild 
}: { 
  node: SpecializationNode; 
  onUpdate: (node: SpecializationNode) => void;
  onDelete: () => void;
  onAddChild: () => void;
}) => {
  const { weapons } = useContent();
  const [open, setOpen] = useState(false);

  const linkedWeapon = node.linkedContentId && node.linkedContentType === 'weapon' 
    ? weapons.find(w => w.id === node.linkedContentId) 
    : null;

  return (
    <div className="pl-4 border-l border-border/50 ml-2 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 flex items-center gap-2">
          <Input 
            value={node.label} 
            onChange={(e) => onUpdate({ ...node, label: e.target.value })}
            placeholder="Item name..."
            className="h-8 text-sm min-w-[150px]"
          />
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 px-2 gap-1 ${linkedWeapon ? 'text-primary border-primary/50' : 'text-muted-foreground'}`}
                title="Link Weapon"
              >
                <LinkIcon className="w-3 h-3" />
                {linkedWeapon ? (
                  <span className="max-w-[100px] truncate hidden sm:inline">{linkedWeapon.name}</span>
                ) : (
                  <span className="hidden sm:inline">Link</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[200px] z-[200]" align="start">
              <Command>
                <CommandInput placeholder="Search weapons..." />
                <CommandList>
                  <CommandEmpty>No weapons found.</CommandEmpty>
                  <CommandGroup heading="Weapons">
                    {weapons.map((weapon) => (
                      <CommandItem
                        key={weapon.id}
                        onSelect={() => {
                          onUpdate({
                            ...node,
                            label: node.label || weapon.name, // Auto-fill label if empty
                            linkedContentId: weapon.id,
                            linkedContentType: 'weapon'
                          });
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 rounded-sm bg-muted flex items-center justify-center overflow-hidden">
                             {weapon.image ? <img src={weapon.image} className="w-full h-full object-cover" /> : <div className="w-2 h-2 bg-primary/20 rounded-full" />}
                           </div>
                           <span>{weapon.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {linkedWeapon && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onUpdate({ ...node, linkedContentId: undefined, linkedContentType: undefined })}
              title="Unlink Weapon"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onAddChild}
          className="h-8 w-8 text-primary hover:text-primary/80"
          title="Add Child"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete}
          className="h-8 w-8 text-destructive hover:text-destructive/80"
          title="Remove Item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="space-y-1">
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              onUpdate={(updatedChild) => {
                const newChildren = [...(node.children || [])];
                newChildren[index] = updatedChild;
                onUpdate({ ...node, children: newChildren });
              }}
              onDelete={() => {
                const newChildren = (node.children || []).filter((_, i) => i !== index);
                onUpdate({ ...node, children: newChildren });
              }}
              onAddChild={() => {
                const newChildren = [...(node.children || []), { id: generateId(), label: "", children: [] }];
                onUpdate({ ...node, children: newChildren });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function SpecializationTreeEditor({ nodes, onChange }: TreeEditorProps) {
  const addRootNode = () => {
    onChange([...nodes, { id: generateId(), label: "", children: [] }]);
  };

  const updateNode = (index: number, updatedNode: SpecializationNode) => {
    const newNodes = [...nodes];
    newNodes[index] = updatedNode;
    onChange(newNodes);
  };

  const deleteNode = (index: number) => {
    const newNodes = nodes.filter((_, i) => i !== index);
    onChange(newNodes);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {nodes.map((node, index) => (
          <div key={node.id} className="relative">
            <TreeNode
              node={node}
              onUpdate={(updatedNode) => updateNode(index, updatedNode)}
              onDelete={() => deleteNode(index)}
              onAddChild={() => {
                const newChildren = [...(node.children || []), { id: generateId(), label: "", children: [] }];
                updateNode(index, { ...node, children: newChildren });
              }}
            />
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={addRootNode}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Root Item
      </Button>
    </div>
  );
}
