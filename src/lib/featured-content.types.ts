// Featured Content System Types - Unified for both frontend and backend

// Legacy type for the old FeaturedSection component
export interface LegacyFeaturedContentItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  image?: string;
  thumbnail?: string;
  bgImage?: string;
  videoUrl?: string; // YouTube/Twitch/Vimeo embed URL
  embedType?: 'youtube' | 'twitch' | 'vimeo' | null;
  link?: string; // Optional external link
  callToAction?: string; // Button text (e.g., "Learn More", "Watch Now")
  isFeatured: boolean;
  displayOrder: number;
  category?: 'announcement' | 'spotlight' | 'event' | 'update';
  publishedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

// Database-based Featured Content Item
export interface FeaturedContentItem {
  id: number;
  contentSource: 'news' | 'weapons' | 'classes' | 'maps' | 'game_devices' | 'game_modes';
  sourceId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  sortOrder: number;
  categoryGroup: 'hero' | 'grid-featured' | 'sidebar';
  isActive: boolean;
}

export interface HomepageHeroBanner {
  id: number;
  bannerUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  callToAction?: string;
  ctaLink?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateFeaturedContent {
  contentSource: string;
  sourceId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  sortOrder: number;
  categoryGroup?: 'hero' | 'grid-featured' | 'sidebar';
  isActive?: boolean;
}

export interface CreateHeroBanner {
  bannerUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  callToAction?: string;
  ctaLink?: string;
  sortOrder: number;
  isActive?: boolean;
}

export interface FeaturedContentWithSource {
  featuredItem: FeaturedContentItem;
  sourceData: any;
}

export interface HeroBannerResponse {
  id: number;
  bannerUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  callToAction?: string;
  ctaLink?: string;
}

export interface FeaturedContentListResponse {
  items: FeaturedContentItem[];
  isEmpty: boolean;
}