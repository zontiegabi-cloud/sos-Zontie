import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HomepageHeroBanner } from "@/lib/featured-content.types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Share2, ThumbsDown, ThumbsUp, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { isSupportedVideoUrl } from "./VideoEmbed";
import { InteractiveVideoPlayer } from "./InteractiveVideoPlayer";
import { useMemberAuth } from "@/hooks/use-member-auth";

interface HeroBannerDialogProps {
  banner: HomepageHeroBanner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BannerComment {
  id: string;
  text: string;
  createdAt: string;
  authorName?: string;
  authorAvatar?: string;
}

function formatCommentTime(value: string): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) {
    return "Just now";
  }

  const diffMs = Date.now() - time;
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return new Date(value).toLocaleDateString();
}

export function HeroBannerDialog({ banner, open, onOpenChange }: HeroBannerDialogProps) {
  const { isAuthenticated, user } = useMemberAuth();
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState<BannerComment[]>([]);
  const [draftComment, setDraftComment] = useState("");

  const storageKey = useMemo(
    () => (banner ? `hero_banner_meta_${banner.id}` : null),
    [banner]
  );

  useEffect(() => {
    if (!banner || !storageKey) {
      setUserVote(null);
      setLikes(0);
      setDislikes(0);
      setComments([]);
      setDraftComment("");
      return;
    }

    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setUserVote(null);
      setLikes(0);
      setDislikes(0);
      setComments([]);
      setDraftComment("");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        userVote?: "like" | "dislike" | null;
        likes?: number;
        dislikes?: number;
        comments?: BannerComment[];
      };
      setUserVote(parsed.userVote ?? null);
      setLikes(parsed.likes ?? 0);
      setDislikes(parsed.dislikes ?? 0);
      setComments(Array.isArray(parsed.comments) ? parsed.comments : []);
      setDraftComment("");
    } catch {
      setUserVote(null);
      setLikes(0);
      setDislikes(0);
      setComments([]);
      setDraftComment("");
    }
  }, [banner, storageKey]);

  const persistState = (
    nextVote: "like" | "dislike" | null,
    nextLikes: number,
    nextDislikes: number,
    nextComments: BannerComment[]
  ) => {
    if (!storageKey) return;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        userVote: nextVote,
        likes: nextLikes,
        dislikes: nextDislikes,
        comments: nextComments,
      })
    );
  };

  const handleVote = (type: "like" | "dislike") => {
    let nextVote = userVote;
    let nextLikes = likes;
    let nextDislikes = dislikes;

    if (type === "like") {
      if (userVote === "like") {
        nextVote = null;
        nextLikes = Math.max(0, likes - 1);
      } else if (userVote === "dislike") {
        nextVote = "like";
        nextLikes = likes + 1;
        nextDislikes = Math.max(0, dislikes - 1);
      } else {
        nextVote = "like";
        nextLikes = likes + 1;
      }
    } else {
      if (userVote === "dislike") {
        nextVote = null;
        nextDislikes = Math.max(0, dislikes - 1);
      } else if (userVote === "like") {
        nextVote = "dislike";
        nextLikes = Math.max(0, likes - 1);
        nextDislikes = dislikes + 1;
      } else {
        nextVote = "dislike";
        nextDislikes = dislikes + 1;
      }
    }

    setUserVote(nextVote);
    setLikes(nextLikes);
    setDislikes(nextDislikes);
    persistState(nextVote, nextLikes, nextDislikes, comments);
  };

  const handleShare = async () => {
    if (!banner) return;

    const shareUrl = banner.ctaLink || window.location.href;
    const shareTitle = banner.title || "Hero Banner";
    const shareText = banner.description || shareTitle;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Banner link copied to clipboard.");
      }
    } catch {
      toast.error("Could not share this banner.");
    }
  };

  const handleAddComment = () => {
    if (!isAuthenticated || !user) {
      toast.error("You need to log in as a member to comment.");
      return;
    }

    const text = draftComment.trim();
    if (!text) return;

    const nextComments = [
      {
        id: `${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        authorName: user.displayName || user.username,
        authorAvatar: user.avatarUrl || undefined,
      },
      ...comments,
    ];

    setComments(nextComments);
    setDraftComment("");
    persistState(userVote, likes, dislikes, nextComments);
  };

  if (!banner) return null;

  const isVideo = isSupportedVideoUrl(banner.bannerUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-md max-h-[92vh] overflow-y-auto border-primary/20 p-0">
        <div className="relative w-full bg-black">
          {isVideo ? (
            <InteractiveVideoPlayer
              url={banner.bannerUrl}
              className="w-full rounded-none"
              aspectRatio={16 / 9}
            />
          ) : (
            <div className="relative w-full aspect-[21/9]">
              <img
                src={banner.bannerUrl}
                alt={banner.title || "Hero banner"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-3xl lg:text-4xl uppercase text-foreground pr-8">
              {banner.title || "Hero Banner"}
            </DialogTitle>
            <DialogDescription className={banner.description ? "text-base text-muted-foreground" : "sr-only"}>
              {banner.description || "Hero banner details with media playback, reactions, sharing, and member comments."}
            </DialogDescription>
          </DialogHeader>

          {banner.callToAction && banner.ctaLink && (
            <div className="flex">
              <a href={banner.ctaLink} target="_blank" rel="noreferrer">
                <Button size="lg">{banner.callToAction}</Button>
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/40">
            <button
              onClick={() => handleVote("like")}
              className={cn(
                "group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                userVote === "like"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                  : "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground"
              )}
              title="Like this banner"
            >
              <ThumbsUp
                className={cn(
                  "w-5 h-5 transition-transform",
                  userVote === "like" ? "scale-110" : "group-hover:scale-110"
                )}
                fill={userVote === "like" ? "currentColor" : "none"}
              />
              <span className="font-heading font-bold">{likes}</span>
            </button>

            <button
              onClick={() => handleVote("dislike")}
              className={cn(
                "group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                userVote === "dislike"
                  ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 scale-105"
                  : "bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              )}
              title="Dislike this banner"
            >
              <ThumbsDown
                className={cn(
                  "w-5 h-5 transition-transform",
                  userVote === "dislike" ? "scale-110" : "group-hover:scale-110"
                )}
                fill={userVote === "dislike" ? "currentColor" : "none"}
              />
              <span className="font-heading font-bold">{dislikes}</span>
            </button>

            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span>{comments.length} comments</span>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="flex flex-col gap-4 rounded-[28px] border border-border/60 bg-gradient-to-br from-card via-card to-card/70 p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground">Community Comments</h3>
                    <p className="text-sm text-muted-foreground">
                      Logged-in members can join the discussion.
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
                </div>
              </div>

              <div className="rounded-[24px] border border-border/50 bg-background/60 p-4 backdrop-blur-sm">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 border border-border/60 ring-2 ring-primary/10">
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {(user.displayName || user.username || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground">
                          {user.displayName || user.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Posting as member
                        </div>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Member
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[20px] border border-border/60 bg-card/70 shadow-inner">
                      <Textarea
                        value={draftComment}
                        onChange={(e) => setDraftComment(e.target.value)}
                        placeholder="Share your thoughts about this banner..."
                        className="min-h-[130px] border-0 bg-transparent px-4 py-4 shadow-none focus-visible:ring-0"
                      />
                      <div className="flex flex-col gap-3 border-t border-border/50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                        <div className="text-xs text-muted-foreground">
                          Keep it respectful, clear, and useful.
                        </div>
                        <Button
                          onClick={handleAddComment}
                          className="rounded-full px-5"
                          disabled={!draftComment.trim()}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 rounded-[20px] border border-dashed border-primary/30 bg-primary/[0.04] p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Members only
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Log in or create an account from the site navbar to post comments.
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => toast.info("Use the Sign in button in the navbar to log in as a member.")}
                    >
                      Sign in to comment
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-border bg-card/30 px-6 py-8 text-center text-sm text-muted-foreground">
                  No comments yet. Be the first member to comment.
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-[24px] border border-border/60 bg-gradient-to-br from-card to-card/70 p-4 shadow-[0_20px_45px_-35px_rgba(0,0,0,0.75)]"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-11 w-11 border border-border/60 ring-2 ring-background">
                        <AvatarImage src={comment.authorAvatar} />
                        <AvatarFallback>
                          {(comment.authorName || "MB").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {comment.authorName || "Member"}
                          </span>
                          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                            Member
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatCommentTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
