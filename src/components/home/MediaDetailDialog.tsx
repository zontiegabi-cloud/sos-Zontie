import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MediaItem } from '@/lib/content-store';

interface MediaDetailDialogProps {
  item: MediaItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaDetailDialog({ item, open, onOpenChange }: MediaDetailDialogProps) {
  if (!item) return null;

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const isVideo = item.type === 'video';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-md p-0 border-primary/20 overflow-hidden">
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {isVideo ? (
            <iframe
              src={getEmbedUrl(item.src)}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          ) : (
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-contain"
            />
          )}
        </div>
        
        <div className="p-6">
           <DialogHeader>
              <DialogTitle className="text-2xl font-display uppercase">{item.title}</DialogTitle>
           </DialogHeader>
           {item.description && (
             <p className="mt-4 text-muted-foreground">{item.description}</p>
           )}
           <div className="mt-4 flex gap-2">
             <span className="px-2 py-1 bg-primary/20 text-primary text-xs uppercase font-bold rounded">
               {item.category}
             </span>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
