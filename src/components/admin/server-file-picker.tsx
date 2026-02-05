import { useState, useEffect } from "react";
import { Search, File, Check, RefreshCw, Film, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";

interface ServerFilePickerProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
  accept?: "image" | "video" | "all";
}

interface ServerFile {
  filename: string;
  url: string;
}

export function ServerFilePicker({ onSelect, trigger, accept = "all" }: ServerFilePickerProps) {
  const [files, setFiles] = useState<ServerFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/uploads`);
      if (!response.ok) throw new Error("Failed to fetch uploads");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load server files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (accept === "image") {
      return file.filename.match(/\.(jpg|jpeg|png|webp|svg|bmp|gif)$/i);
    } else if (accept === "video") {
      return file.filename.match(/\.(mp4|webm|mov|ogg)$/i);
    }
    
    return true;
  });

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      setIsOpen(false);
    }
  };

  const isVideo = (filename: string) => filename.match(/\.(mp4|webm|mov|ogg)$/i);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select from Server Uploads</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchFiles} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>

        <ScrollArea className="flex-1 border rounded-md p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <File className="h-10 w-10 mb-2 opacity-20" />
              <p>No matching files found on server</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.url}
                  className={cn(
                    "relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all group bg-muted",
                    selectedUrl === file.url
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  )}
                  onClick={() => setSelectedUrl(file.url)}
                >
                  {isVideo(file.filename) ? (
                     <div className="w-full h-full flex items-center justify-center bg-black/10">
                       <Film className="h-12 w-12 text-muted-foreground opacity-50" />
                     </div>
                  ) : (
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{file.filename}</p>
                  </div>
                  {selectedUrl === file.url && (
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
            Select File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
