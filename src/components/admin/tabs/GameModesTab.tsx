import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Gamepad2, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "@/hooks/use-content";
import { GameModeItem } from "@/lib/content-store";
import { GameModeEditModal } from "../GameContentModals";
import { toast } from "sonner";

export function GameModesTab() {
  const { gameModes, addGameModeItem, updateGameModeItem, deleteGameModeItem, content, updateContent } = useContent();
  const [editingGameMode, setEditingGameMode] = useState<GameModeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredGameModes = gameModes.filter(mode => 
    mode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mode.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mode.shortName && mode.shortName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveGameMode = (item: GameModeItem) => {
    if (isCreating) {
      addGameModeItem(item);
      toast.success("Game mode created!");
    } else {
      updateGameModeItem(item.id, item);
      toast.success("Game mode updated!");
    }
    setEditingGameMode(null);
    setIsCreating(false);
  };

  const handleDeleteGameMode = (id: string) => {
    if (confirm("Are you sure you want to delete this game mode?")) {
      deleteGameModeItem(id);
      toast.success("Game mode deleted!");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredGameModes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGameModes.map(m => m.id)));
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
      const newGameModes = gameModes.filter(item => !selectedIds.has(item.id));
      updateContent({ ...content, gameModes: newGameModes });
      setSelectedIds(new Set());
      toast.success("Selected items deleted!");
    }
  };

  const createNewGameMode = () => {
    const newGameMode: GameModeItem = {
      id: Date.now().toString(),
      name: "",
      shortName: "",
      description: "",
      image: "",
      playerCount: "",
      roundTime: "",
      rules: [],
      media: [],
    };
    setEditingGameMode(newGameMode);
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
          <h2 className="text-2xl font-heading text-primary">Game Modes Management</h2>
          <p className="text-muted-foreground text-sm">Manage game modes and rules</p>
        </div>
        <div className="flex items-center gap-2">
           {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button onClick={createNewGameMode}>
            <Plus className="w-4 h-4 mr-2" />
            Add Game Mode
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search game modes..."
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
            {selectedIds.size === filteredGameModes.length && filteredGameModes.length > 0 ? (
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
        {filteredGameModes.map((mode) => (
          <motion.div
            key={mode.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-card border rounded-lg overflow-hidden flex flex-col transition-colors ${
              selectedIds.has(mode.id) ? "border-primary ring-1 ring-primary" : "border-border"
            }`}
          >
            <div className="relative h-48 bg-muted group">
              {mode.image ? (
                <img
                  src={mode.image}
                  alt={mode.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Gamepad2 className="w-12 h-12 opacity-20" />
                </div>
              )}
              
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedIds.has(mode.id)}
                  onCheckedChange={() => toggleSelection(mode.id)}
                  className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => {
                    setEditingGameMode(mode);
                    setIsCreating(false);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDeleteGameMode(mode.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-2 pointer-events-none">
                {mode.shortName && (
                  <span className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-bold uppercase">
                    {mode.shortName}
                  </span>
                )}
                {mode.playerCount && (
                  <span className="px-2 py-1 bg-primary/80 backdrop-blur-sm text-primary-foreground rounded text-xs font-bold">
                    {mode.playerCount}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col cursor-pointer" onClick={() => toggleSelection(mode.id)}>
              <h3 className="font-heading text-lg text-foreground mb-2">{mode.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                {mode.description}
              </p>
              <div className="text-xs text-muted-foreground pt-3 border-t border-border flex gap-4">
                <span>{mode.rules.length} Rules</span>
                <span>{mode.media.length} Media items</span>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredGameModes.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No game modes found matching your search.</p>
          </div>
        )}
      </div>

      {editingGameMode && (
        <GameModeEditModal
          item={editingGameMode}
          onSave={handleSaveGameMode}
          onCancel={() => {
            setEditingGameMode(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}
