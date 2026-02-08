import React, { forwardRef } from 'react';
import { DynamicContentSource, NewsItem, ClassItem, MediaItem, WeaponItem, MapItem, GameDeviceItem, GameModeItem, RoadmapItem } from '@/lib/content-store';
import { ContentItem } from './types';
import { FeaturesContentCard } from './FeaturesContentCard';
import { NewsContentCard } from './NewsContentCard';
import { MediaContentCard } from './MediaContentCard';
import { DefaultContentCard } from './DefaultContentCard';
import { ClassesContentCard } from '@/components/game/ClassesContentCard';
import { WeaponCard, MapCard, DeviceCard, GameModeCard } from '@/components/game/GameContentCards';
import { RoadmapCard } from '@/components/game/RoadmapCard';

export const ContentCard = forwardRef<HTMLDivElement, { 
  item: ContentItem, 
  type: DynamicContentSource['type'], 
  displayMode: string, 
  cardStyle?: string,
  index: number,
  onView: (item: ContentItem) => void
}>(({ item, type, displayMode, cardStyle, index, onView }, ref) => {
  if (type === 'features') {
    return <FeaturesContentCard ref={ref} item={item as any} index={index} onView={onView} />;
  }
  if (type === 'news') {
    return <NewsContentCard ref={ref} item={item as NewsItem} index={index} onView={onView} cardStyle={cardStyle} />;
  }
  if (type === 'classes') {
    return <ClassesContentCard ref={ref} item={item as ClassItem} index={index} onClick={() => onView(item)} cardStyle={cardStyle} />;
  }
  if (type === 'media') {
    return <MediaContentCard ref={ref} item={item as MediaItem} onView={onView} cardStyle={cardStyle} />;
  }
  if (type === 'weapons') {
    // WeaponCard is a button, so we wrap it in a div to accept the ref if needed, or pass ref if compatible
    // The original code wrapped it in a div.
    return (
      <div ref={ref} className="h-full w-full">
        <WeaponCard item={item as unknown as WeaponItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }
  if (type === 'maps') {
    return (
      <div ref={ref} className="h-full w-full">
        <MapCard item={item as unknown as MapItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }
  if (type === 'gameDevices') {
    return (
      <div ref={ref} className="h-full w-full">
        <DeviceCard item={item as unknown as GameDeviceItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }
  if (type === 'gameModes') {
    return (
      <div ref={ref} className="h-full w-full">
        <GameModeCard item={item as unknown as GameModeItem} index={index} onClick={() => onView(item)} />
      </div>
    );
  }
  if (type === 'roadmap') {
     // RoadmapCard might be different
     return (
       <div ref={ref} className="h-full w-full">
         <RoadmapCard item={item as unknown as RoadmapItem} />
       </div>
     );
  }

  return <DefaultContentCard ref={ref} item={item} />;
});

ContentCard.displayName = "ContentCard";
