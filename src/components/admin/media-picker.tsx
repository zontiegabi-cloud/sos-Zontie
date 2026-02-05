import { useState } from "react";
import { Search, Image as ImageIcon, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContent } from "@/hooks/use-content";
import { cn } from "@/lib/utils";

interface MediaPickerProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MediaPicker({ onSelect, trigger, open, onOpenChange }: MediaPickerProps) {
  const { media, refresh } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      refresh();
    }
    setIsOpen(newOpen);
  };

  const filteredMedia = media.filter(
    (item) =>
      item.type === "image" &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image from Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 border rounded-md p-4">
          {filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
              <p>No images found in media library</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all group",
                    selectedUrl === item.src
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  )}
                  onClick={() => setSelectedUrl(item.src)}
                >
                  <img
                    src={item.thumbnail || item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{item.title}</p>
                  </div>
                  {selectedUrl === item.src && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedUrl}>
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
