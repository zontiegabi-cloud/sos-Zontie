import { 
  NewsItem, 
  ClassItem, 
  MediaItem, 
  FeatureItem, 
  WeaponItem, 
  MapItem, 
  GameDeviceItem,
  FAQItem,
  GameModeItem,
  RoadmapItem,
  PatchNoteItem
} from '@/lib/content-store';

export type ContentItem = NewsItem | ClassItem | MediaItem | FeatureItem | WeaponItem | MapItem | GameDeviceItem | FAQItem | GameModeItem | RoadmapItem | PatchNoteItem;
