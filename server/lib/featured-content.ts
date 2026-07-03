/**
 * Server-side Featured Content Module
 * Re-exports types from src and adds database-related types
 */
/**
 * Featured Content System Types
 * Used for spotlighting/promoting specific content on the homepage and other sections
 */

export interface FeaturedContentItem {
    id: number;                           // Auto-increment ID in featured_content table
    contentSource: 'news' | 'weapons' | 'classes' | 'maps' | 'game_devices' | 'game_modes';
    sourceId: string;                     // References the actual content item (UUID or auto-inc)
    title?: string;                       // Override title for featured context
    description?: string;
    thumbnail?: string;
    sortOrder: number;
    categoryGroup: 'hero' | 'grid-featured' | 'sidebar';
    isActive: boolean;
}

export interface HomepageHeroBanner {
    id: number;                           // Auto-increment ID in homepage_hero_banners table
    bannerUrl: string;                    // Full-size hero banner image
    thumbnailUrl?: string;
    title?: string;
    description?: string;
    callToAction?: string;                // Button text
    ctaLink?: string;                     // Link for CTA button
    sortOrder: number;
    isActive: boolean;
}

/**
 * DTO for saving/creating featured content via API
 */
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

/**
 * DTO for hero banner operations
 */
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

/**
 * Featured content response from API (with source data included)
 */
export interface FeaturedContentWithSource {
    featuredItem: FeaturedContentItem;
    sourceData: any; // The actual content item from its source table
}

/**
 * Hero banner response from API
 */
export interface HeroBannerResponse {
    id: number;
    bannerUrl: string;
    thumbnailUrl?: string;
    title?: string;
    description?: string;
    callToAction?: string;
    ctaLink?: string;
}

/**
 * Source-specific data types for the featured content transformation logic
 */
export interface NewsSourceData {
  news_title?: string;
  news_description?: string;
}

export interface WeaponSourceData {
  weapon_name?: string;
  weapon_category?: string;
  weapon_description?: string;
}

export interface ClassSourceData {
  class_name?: string;
  class_role?: string;
  class_description?: string;
}

export interface MapSourceData {
  map_name?: string;
  map_description?: string;
}

export interface GameDeviceSourceData {
  game_device_name?: string;
  game_device_description?: string;
}

export interface GameModeSourceData {
  game_mode_name?: string;
  game_mode_description?: string;
}

/**
 * Union type for all source data
 */
export type SourceData = NewsSourceData | WeaponSourceData | ClassSourceData | 
                         MapSourceData | GameDeviceSourceData | GameModeSourceData;

/**
 * Enhanced FeaturedContentItem with database column types
 */
export interface DatabaseFeaturedContentItem {
  id: number;
  content_source: string;
  source_id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  sort_order: number;
  category_group: string;
  is_active: boolean;
}

/**
 * Enhanced HomepageHeroBanner with database column types
 */
export interface DatabaseHomepageHeroBanner extends HomepageHeroBanner {
  id: number;
  banner_url: string;
  thumbnail_url?: string;
  call_to_action?: string;
  cta_link?: string;
}

/**
 * Helper type to fix the empty object `{}` type issues in route files
 */
export interface AnyObject {
  [key: string]: any;
}
