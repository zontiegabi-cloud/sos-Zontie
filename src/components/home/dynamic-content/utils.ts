import { MediaItem } from '@/lib/content-store';

// Helper to format date strings that might be non-standard (e.g. "Coming Soon")
export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Check if date is valid
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return dateString;
};

// Helper to convert YouTube/Vimeo URLs to embed format
export const getEmbedUrl = (url: string) => {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return null;
};

// Get YouTube thumbnail
export function getYouTubeThumbnail(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

// Get display thumbnail for media item
export const getDisplayThumbnail = (item: MediaItem): string => {
  if (item.thumbnail) return item.thumbnail;
  if (item.type === "video" || getEmbedUrl(item.src)) {
    const ytThumb = getYouTubeThumbnail(item.src);
    if (ytThumb) return ytThumb;
  }
  return item.src;
};
