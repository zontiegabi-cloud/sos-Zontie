import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useContent } from "@/hooks/use-content";

interface ContentPickerModalProps {
  open: boolean;
  onClose: () => void;
  contentSource: string;
  onSelect: (id: string, title: string, description?: string, thumbnail?: string) => void;
}

type PickerItem = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  src?: string;
};

export function ContentPickerModal({ open, onClose, contentSource, onSelect }: ContentPickerModalProps) {
  const { content } = useContent();
  const [search, setSearch] = useState("");

  // Get the right content list based on source
  const contentList = useMemo<PickerItem[]>(() => {
    switch (contentSource) {
      case "news": return content.news;
      case "weapons": return content.weapons;
      case "classes": return content.classes;
      case "maps": return content.maps;
      case "game_devices": return content.gameDevices;
      case "game_modes": return content.gameModes || [];
      default: return [];
    }
  }, [content, contentSource]);

  // Filter by search
  const filteredList = contentList.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const title = (item.title || item.name || "").toString().toLowerCase();
    const desc = (item.description || "").toString().toLowerCase();
    return title.includes(searchLower) || desc.includes(searchLower);
  });

  // Reset search when source changes
  useEffect(() => {
    setSearch("");
  }, [contentSource]);

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Content</DialogTitle>
          <DialogDescription>
            Pick {contentSource} to feature
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${contentSource}...`}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            {filteredList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No {contentSource} found.
              </div>
            ) : (
              filteredList.map((item) => (
                <button
                  key={item.id}
                  className="text-left p-3 rounded border hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => {
                    onSelect(
                      item.id,
                      item.title || item.name,
                      item.description,
                      item.image || item.thumbnail || item.src
                    );
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    {(item.image || item.thumbnail || item.src) && (
                      <div className="w-12 h-12 flex-shrink-0 bg-muted rounded overflow-hidden">
                        <img
                          src={item.image || item.thumbnail || item.src}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {item.title || item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
