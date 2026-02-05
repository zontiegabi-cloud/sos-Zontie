import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { NewsItem } from '@/lib/content-store';
import { useContent } from '@/hooks/use-content';
import { cn } from "@/lib/utils";

interface NewsDetailDialogProps {
  item: NewsItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsDetailDialog({ item, open, onOpenChange }: NewsDetailDialogProps) {
  const { updateNewsItem } = useContent();
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [localItem, setLocalItem] = useState<NewsItem | null>(null);

  // Sync local item with prop item when it changes
  useEffect(() => {
    if (item) {
      setLocalItem(item);
      const storedVotes = JSON.parse(localStorage.getItem('news_votes') || '{}');
      setUserVote(storedVotes[item.id] || null);
    }
  }, [item]);

  // Handle voting for news items
  const handleVote = (type: 'like' | 'dislike') => {
    if (!localItem) return;
    
    const currentLikes = localItem.likes || 0;
    const currentDislikes = localItem.dislikes || 0;
    
    let newLikes = currentLikes;
    let newDislikes = currentDislikes;
    let newVote = userVote;

    // YouTube-style logic:
    if (type === 'like') {
      if (userVote === 'like') {
        // Toggle off
        newLikes = Math.max(0, currentLikes - 1);
        newVote = null;
      } else if (userVote === 'dislike') {
        // Switch from dislike to like
        newDislikes = Math.max(0, currentDislikes - 1);
        newLikes = currentLikes + 1;
        newVote = 'like';
      } else {
        // Add like
        newLikes = currentLikes + 1;
        newVote = 'like';
      }
    } else { // type === 'dislike'
      if (userVote === 'dislike') {
        // Toggle off
        newDislikes = Math.max(0, currentDislikes - 1);
        newVote = null;
      } else if (userVote === 'like') {
        // Switch from like to dislike
        newLikes = Math.max(0, currentLikes - 1);
        newDislikes = currentDislikes + 1;
        newVote = 'dislike';
      } else {
        // Add dislike
        newDislikes = currentDislikes + 1;
        newVote = 'dislike';
      }
    }
    
    // Update local state
    setUserVote(newVote);
    
    // Update localStorage
    const storedVotes = JSON.parse(localStorage.getItem('news_votes') || '{}');
    if (newVote) {
      storedVotes[localItem.id] = newVote;
    } else {
      delete storedVotes[localItem.id];
    }
    localStorage.setItem('news_votes', JSON.stringify(storedVotes));

    // Update local selected item to reflect change immediately
    const updatedItem = { ...localItem, likes: newLikes, dislikes: newDislikes };
    setLocalItem(updatedItem);

    // Persist changes
    if (updateNewsItem) {
      updateNewsItem(localItem.id, { likes: newLikes, dislikes: newDislikes });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return dateString;
  };

  if (!localItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-md max-h-[90vh] overflow-y-auto border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <DialogTitle className="font-display text-3xl lg:text-4xl uppercase text-foreground">
                {localItem.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 text-base">
                {localItem.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
            {/* Hero Image - Prefer bgImage, fallback to image */}
            {(localItem.bgImage || localItem.image) && (
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 border border-border/50 shadow-2xl">
                <img 
                  src={localItem.bgImage || localItem.image} 
                  alt={localItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
              </div>
            )}
            
            {/* Meta Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-border/40">
               <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                {localItem.tag}
              </span>
              <div className="h-4 w-px bg-border" />
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(localItem.date)}
              </span>
            </div>
            
            {/* Rich Text Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none text-foreground/90 leading-relaxed 
              [&_p]:mb-6 [&_p]:leading-7 
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 
              [&_li]:mb-2
              [&_h1]:text-4xl [&_h1]:font-display [&_h1]:mb-6 [&_h1]:text-foreground
              [&_h2]:text-3xl [&_h2]:font-display [&_h2]:mb-5 [&_h2]:text-foreground [&_h2]:mt-10
              [&_h3]:text-2xl [&_h3]:font-heading [&_h3]:mb-4 [&_h3]:text-foreground [&_h3]:mt-8
              [&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-primary/50 hover:[&_a]:border-primary hover:[&_a]:text-primary-foreground hover:[&_a]:bg-primary/10 [&_a]:transition-all
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-8
              [&_img]:rounded-xl [&_img]:shadow-xl [&_img]:my-8 [&_img]:border [&_img]:border-border/50"
              dangerouslySetInnerHTML={{ __html: localItem.content || '<p class="text-muted-foreground italic">No content available.</p>' }}
            />

            {/* Like/Dislike Buttons */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-border/40">
              <div className="flex items-center gap-3">
                 <button
                   onClick={() => handleVote('like')}
                   className={cn(
                     "group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                     userVote === 'like' 
                       ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                       : "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground"
                   )}
                   title="Like this article"
                 >
                   <ThumbsUp className={cn("w-5 h-5 transition-transform", userVote === 'like' ? "scale-110" : "group-hover:scale-110")} fill={userVote === 'like' ? "currentColor" : "none"} />
                   <span className="font-heading font-bold">{localItem.likes || 0}</span>
                 </button>
                 <button
                   onClick={() => handleVote('dislike')}
                   className={cn(
                     "group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                     userVote === 'dislike' 
                       ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 scale-105" 
                       : "bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                   )}
                   title="Dislike this article"
                 >
                   <ThumbsDown className={cn("w-5 h-5 transition-transform", userVote === 'dislike' ? "scale-110" : "group-hover:scale-110")} fill={userVote === 'dislike' ? "currentColor" : "none"} />
                   <span className="font-heading font-bold">{localItem.dislikes || 0}</span>
                 </button>
              </div>
              <span className="text-sm text-muted-foreground italic">
                Did you find this article helpful?
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
