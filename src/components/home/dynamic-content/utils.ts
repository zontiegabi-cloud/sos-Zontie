import { MediaItem, NewsItem, DynamicContentSource } from '@/lib/content-store';
import { ContentItem } from './types';

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

type SourceType = DynamicContentSource['type'];

export const getItemTitle = (item: ContentItem): string => {
  if ('title' in item && typeof item.title === 'string') {
    return item.title ?? '';
  }
  if ('name' in item && typeof (item as { name?: string }).name === 'string') {
    return (item as { name?: string }).name ?? '';
  }
  return '';
};

export const getItemDescription = (item: ContentItem): string => {
  if ('description' in item && typeof (item as { description?: string }).description === 'string') {
    return (item as { description?: string }).description ?? '';
  }
  return '';
};

export const getItemTag = (item: ContentItem, fallback?: string): string => {
  if ('tag' in item && typeof (item as { tag?: string }).tag === 'string') {
    const value = (item as { tag?: string }).tag;
    if (value) return value;
  }
  return fallback ?? '';
};

export const getItemQuestion = (item: ContentItem): string => {
  if ('question' in item && typeof (item as { question?: string }).question === 'string') {
    return (item as { question?: string }).question ?? '';
  }
  const title = getItemTitle(item);
  if (title) return title;
  return '';
};

export const getItemAnswer = (item: ContentItem): string => {
  if ('answer' in item && typeof (item as { answer?: string }).answer === 'string') {
    return (item as { answer?: string }).answer ?? '';
  }
  const description = getItemDescription(item);
  if (description) return description;
  return '';
};

export const getItemImage = (item: ContentItem, sourceType?: SourceType): string => {
  if (sourceType === 'media') {
    return getDisplayThumbnail(item as MediaItem);
  }

  if (sourceType === 'news') {
    const news = item as NewsItem;
    return news.bgImage || news.thumbnail || news.image || '/placeholder.jpg';
  }

  if ('image' in item) {
    const image = (item as { image?: string }).image;
    if (image) return image;
  }

  if ('thumbnail' in item) {
    const thumb = (item as { thumbnail?: string }).thumbnail;
    if (thumb) return thumb;
  }

  if ('src' in item) {
    const src = (item as { src?: string }).src;
    if (src) return src;
  }

  return '/placeholder.jpg';
};
