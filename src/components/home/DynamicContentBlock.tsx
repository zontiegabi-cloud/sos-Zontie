import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import { 
  DynamicContentSource, 
  SiteContent,
  MediaItem,
  RoadmapItem,
  NewsItem,
  WeaponItem,
  MapItem,
  GameDeviceItem,
  GameModeItem,
  FeatureItem,
  PatchNoteItem
} from '@/lib/content-store';
import { useContent } from '@/hooks/use-content';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from "@/lib/utils";
import { NewsDetailDialog } from '@/components/news/NewsDetailDialog';
import { MediaDetailDialog } from '@/components/home/MediaDetailDialog';
import { 
  WeaponDetail, 
  MapDetail, 
  DeviceDetail, 
  GameModeDetail,
  FeatureDetail,
  PatchNoteDetail
} from '@/components/game';
import { RoadmapTimeline } from '@/components/game/RoadmapTimeline';
import { RoadmapShowcase } from '@/components/game/RoadmapShowcase';
import { Button } from "@/components/ui/button";

import { ContentItem } from './dynamic-content/types';
import { ContentCard } from './dynamic-content/ContentCard';
import { ListView } from './dynamic-content/ListView';
import { CarouselView } from './dynamic-content/CarouselView';
import { HeroCarouselView } from './dynamic-content/HeroCarouselView';
import { AccordionView } from './dynamic-content/AccordionView';
import { MasonryView } from './dynamic-content/MasonryView';
import { SpotlightView } from './dynamic-content/SpotlightView';
import { FeaturedView } from './dynamic-content/FeaturedView';
import { NewsTicker } from './dynamic-content/NewsTicker';
import { AlertBar } from './dynamic-content/AlertBar';
import { ReleaseStatus, CountdownTimer } from './dynamic-content/ReleaseStatus';
import { DiscordWidget } from './dynamic-content/DiscordWidget';
import { BugReportForm } from './dynamic-content/BugReportForm';
import { InteractiveClassList } from '@/components/game/InteractiveClassList';
import { ClassItem } from '@/lib/content-store';

export function DynamicContentBlock({ source, alignment = 'left' }: { source: DynamicContentSource, alignment?: 'left' | 'center' | 'right' }) {
  const { content } = useContent();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSortBy, setActiveSortBy] = useState<string | null>(null);

  // Get items based on type
  const baseItems = useMemo(() => {
    if (!content) return [];
    
    // Handle gamemodetab content mapping
    if (source.type === 'gamemodetab') {
      return content.gameModes || [];
    }

    // Handle new separated source types with inline content
    if (['alert-bar', 'popup', 'release-status', 'countdown'].includes(source.type)) {
      if (source.type === 'alert-bar') {
        return [{
          id: `inline-alert-${source.alertText}`,
          title: source.alertText || 'System Alert',
          description: source.alertText || '',
          tag: source.alertType === 'warning' ? 'Alert' : source.alertType === 'success' ? 'Success' : source.alertType === 'error' ? 'Error' : 'Info',
          date: new Date().toISOString(),
          image: '',
          link: source.alertLink,
          category: 'System',
          author: 'System'
        } as unknown as NewsItem];
      }
      if (source.type === 'popup') {
         return [{
          id: `inline-popup-${source.alertText}`,
          title: source.alertText || 'Announcement',
          description: source.alertText || '',
          tag: 'Announcement',
          date: new Date().toISOString(),
          image: source.popupImage || '',
          category: 'System',
          author: 'System'
        } as unknown as NewsItem];
      }
      if (source.type === 'release-status') {
        return [{
          id: 'inline-release',
          title: 'Release Status',
          status: source.releaseStatus || 'planned',
          date: source.targetDate || new Date().toISOString(),
          category: 'General',
          description: 'Current Release Status'
        } as unknown as RoadmapItem];
      }
      if (source.type === 'countdown') {
        return [{
          id: 'inline-countdown',
          title: source.alertText || 'Event',
          date: source.targetDate || new Date().toISOString(),
          status: 'planned',
          category: 'Event',
          description: 'Upcoming Event'
        } as unknown as RoadmapItem];
      }
      return [];
    }

    if (source.type === 'events') {
      const EVENT_CATEGORIES = ['event', 'tournament', 'scrim', 'playtest'];
      const roadmapItems = (content.roadmap || []) as RoadmapItem[];

      let allItems = roadmapItems.filter(
        (item) =>
          item.category &&
          EVENT_CATEGORIES.includes(item.category.toLowerCase())
      );

      if (source.category && source.category !== 'all') {
        const target = source.category.toLowerCase();
        allItems = allItems.filter(
          (item) => (item.category || '').toLowerCase() === target
        );
      }

      if (source.count && !source.fetchAll) {
        allItems = allItems.slice(0, source.count);
      }

      return allItems as unknown as ContentItem[];
    }

    const key = source.type as keyof SiteContent;
    let allItems = (content[key] as ContentItem[]) || [];
    
    // Mix in Patch Notes if enabled for News
    if (source.type === 'news' && source.includePatchNotes) {
      const patchNotes = content.patchnotes || [];
      const mappedPatchNotes = patchNotes.map(pn => ({
        ...pn,
        title: pn.title || `Patch Notes v${pn.version}`,
        date: pn.date,
        description: pn.subtitle || '',
        image: pn.image || '',
        tag: pn.category || 'Patch Notes', // Use category if available, fallback to 'Patch Notes'
        createdAt: pn.createdAt || pn.date,
        _isPatchNote: true 
      }));
      
      allItems = [...allItems, ...mappedPatchNotes] as ContentItem[];
    }
    
    
    // Filter by Configured Type (e.g. for Media)
    if (source.type === 'media' && source.filterType && source.filterType !== 'all') {
      allItems = allItems.filter((item) => 'type' in item && (item as MediaItem).type === source.filterType);
    }

    // Filter by Configured Category (e.g. for Roadmap or Media)
    if ((source.type === 'roadmap' || source.type === 'media') && source.category && source.category !== 'all') {
      allItems = allItems.filter(
        (item) => 'category' in item && item.category === source.category
      );
    }

    // Filter by Specific IDs (Manual Selection)
    if (source.ids && source.ids.length > 0) {
      allItems = allItems.filter(item => source.ids?.includes(item.id));
    }

    // Sort items based on configuration or local override
    const currentSortBy = activeSortBy || source.sortBy;
    if (currentSortBy) {
      allItems = [...allItems].sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        switch (currentSortBy) {
          case 'date':
            valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            break;
          case 'title':
            valA =
              'title' in a && typeof a.title === 'string'
                ? a.title ?? ''
                : 'name' in a && typeof (a as { name?: string }).name === 'string'
                  ? (a as { name?: string }).name ?? ''
                  : '';
            valB =
              'title' in b && typeof b.title === 'string'
                ? b.title ?? ''
                : 'name' in b && typeof (b as { name?: string }).name === 'string'
                  ? (b as { name?: string }).name ?? ''
                  : '';
            break;
          case 'category':
            // Prioritize explicit category, then tag (news), then role (classes), then environment (maps), then type (weapons)
            valA =
              'category' in a && a.category
                ? a.category
                : 'tag' in a && a.tag
                  ? a.tag
                  : 'role' in a && a.role
                    ? a.role
                    : 'environment' in a && a.environment
                      ? a.environment
                      : 'type' in a && a.type
                        ? a.type
                        : '';

            valB =
              'category' in b && b.category
                ? b.category
                : 'tag' in b && b.tag
                  ? b.tag
                  : 'role' in b && b.role
                    ? b.role
                    : 'environment' in b && b.environment
                      ? b.environment
                      : 'type' in b && b.type
                        ? b.type
                        : '';
            break;
          case 'type':
            valA = 'type' in a && a.type ? a.type : '';
            valB = 'type' in b && b.type ? b.type : '';
            break;
        }

        if (valA < valB) return source.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return source.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (['news', 'media'].includes(source.type)) {
      // Default fallback sort for news/media
      allItems = [...allItems].sort((a, b) => {
        const dateA =
          'date' in a && a.date ? new Date(a.date).getTime() : 0;
        const dateB =
          'date' in b && b.date ? new Date(b.date).getTime() : 0;
        return (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA);
      });
    }

    // Limit items
    if (source.count && !source.fetchAll) {
      allItems = allItems.slice(0, source.count);
    }

    return allItems;
  }, [content, source, activeSortBy]);

  // Derive unique categories from items if filtering is enabled
  const categories = useMemo(() => {
    if (!source.enableFiltering && !source.showSortButtons) return [];
    const cats = new Set<string>(["All"]);
    
    baseItems.forEach(item => {
      if ('category' in item && item.category) cats.add(item.category);
      else if ('tag' in item && item.tag) cats.add(item.tag);
      else if ('role' in item && item.role) cats.add(item.role);
      else if ('type' in item && item.type) cats.add(item.type);
    });
    
    return Array.from(cats);
  }, [baseItems, source.enableFiltering, source.showSortButtons]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return baseItems;
    
    return baseItems.filter(item => {
      const cat =
        'category' in item
          ? item.category
          : 'tag' in item
            ? item.tag
            : 'role' in item
              ? item.role
              : 'type' in item
                ? item.type
                : null;
      return cat === activeCategory;
    });
  }, [baseItems, activeCategory]);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (!baseItems.length && source.type !== 'discord-widget') return null;

  // Determine grid class
  let currentGridClass = gridCols[source.gridColumns as keyof typeof gridCols] || gridCols[3];
  
  // Force 1 column for patchnotes if not explicitly set to something else
  if (source.type === 'patchnotes' && !source.gridColumns) {
    currentGridClass = gridCols[1];
  }

  return (
    <div className="w-full">
      {/* Sort Buttons */}
      {source.showSortButtons && (source.type === 'news' || source.type === 'media' || source.type === 'weapons') && (
        <div className={cn(
          "flex flex-wrap gap-2 mb-4",
          alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'
        )}>
          <span className="text-sm text-muted-foreground mr-2 self-center">Sort by:</span>
          
          {source.type === 'news' && (
            <>
              {/* Date Button (Resets Filter) */}
              <Button
                variant={activeCategory === 'All' && (activeSortBy || source.sortBy) === 'date' ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveCategory('All');
                  setActiveSortBy('date');
                }}
                className="font-heading uppercase text-xs tracking-wider"
              >
                Date
              </Button>
              
              {/* Tag Buttons */}
              {categories.filter(cat => cat !== 'All').map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="font-heading uppercase text-xs tracking-wider"
                >
                  {cat}
                </Button>
              ))}
            </>
          )}

          {(source.type === 'media' || source.type === 'weapons') && (
             <>
               {/* Category Buttons (including All) */}
               {categories.map(cat => (
                 <Button
                   key={cat}
                   variant={activeCategory === cat ? "default" : "outline"}
                   size="sm"
                   onClick={() => setActiveCategory(cat)}
                   className="font-heading uppercase text-xs tracking-wider"
                 >
                   {cat}
                 </Button>
               ))}
             </>
          )}
        </div>
      )}

      {/* Category Filter - Only show if explicit filtering enabled AND NOT showing sort buttons (to avoid duplication) */}
      {source.enableFiltering && !source.showSortButtons && categories.length > 1 && (
        <div className={cn(
          "flex flex-wrap gap-2 mb-8",
          alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'
        )}>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="font-heading uppercase text-xs tracking-wider"
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      {source.displayMode === 'carousel' ? (
        source.cardStyle === 'hero-carousel' ? (
          <HeroCarouselView items={filteredItems} source={source} onView={setSelectedItem} />
        ) : (
          <CarouselView items={filteredItems} source={source} onView={setSelectedItem} />
        )
      
      ) : source.displayMode === 'accordion' ? (
        <AccordionView items={filteredItems} source={source} />
      ) : source.displayMode === 'timeline' && source.type === 'roadmap' ? (
         <RoadmapTimeline items={filteredItems as RoadmapItem[]} />
      ) : source.displayMode === 'showcase' && source.type === 'roadmap' ? (
         <RoadmapShowcase items={filteredItems as RoadmapItem[]} />
      ) : source.displayMode === 'masonry' || source.displayMode === 'mansory' ? (
        <MasonryView items={filteredItems} source={source} onView={setSelectedItem} />
      ) : source.displayMode === 'spotlight' || source.displayMode === 'spotlight-hero-list' || source.displayMode === 'Spotlight(hero+list)' ? (
        <SpotlightView items={filteredItems} source={source} onView={setSelectedItem} />
      ) : source.displayMode === 'featured' || source.displayMode === 'features' || source.displayMode === 'Feautures' ? (
        <FeaturedView items={filteredItems} source={source} onView={setSelectedItem} />
      ) : source.displayMode === 'list' ? (
        <ListView items={filteredItems} source={source} onView={setSelectedItem} />
      ) : source.displayMode === 'ticker' && source.type === 'news' ? (
        <NewsTicker items={filteredItems as (NewsItem | PatchNoteItem)[]} onView={setSelectedItem} />
      ) : (source.displayMode === 'alert-bar' || source.type === 'alert-bar') ? (
        <AlertBar items={filteredItems as (NewsItem | PatchNoteItem)[]} onView={setSelectedItem} />
      ) : (source.displayMode === 'popup' || source.type === 'popup') ? (
        <AlertBar items={filteredItems as (NewsItem | PatchNoteItem)[]} onView={setSelectedItem} variant="popup" />
      ) : (source.displayMode === 'release-status' || source.type === 'release-status') ? (
        <ReleaseStatus items={filteredItems as RoadmapItem[]} source={source} onView={setSelectedItem} />
      ) : (source.displayMode === 'countdown' || source.type === 'countdown') ? (
        <CountdownTimer 
          targetDate={source.type === 'countdown' ? (source.targetDate || new Date().toISOString()) : (filteredItems[0] ? (filteredItems[0] as RoadmapItem).date : new Date().toISOString())} 
          title={source.type === 'countdown' ? source.alertText : (filteredItems[0] ? (filteredItems[0] as RoadmapItem).title : undefined)}
        />
      ) : source.type === 'discord-widget' ? (
        source.displayMode === 'bug-report-form' ? (
          <BugReportForm webhookUrl={source.discordWebhookUrl} />
        ) : (
          <DiscordWidget 
            serverId={source.discordServerId} 
            channelId={source.discordChannelId}
            displayMode={source.displayMode}
          />
        )
      ) : ['detailed-interactive', 'classes-hex', 'classes-operator', 'classes-vanguard', 'classes-command'].includes(source.displayMode) && source.type === 'classes' ? (
        <InteractiveClassList 
          classes={filteredItems as ClassItem[]} 
          variant={
            source.displayMode === 'classes-hex' ? 'hex-tech' :
            source.displayMode === 'classes-operator' ? 'operator' :
            source.displayMode === 'classes-vanguard' ? 'vanguard' :
            source.displayMode === 'classes-command' ? 'command' : 'default'
          }
          showHoverInfo={source.showHoverInfo}
          previewMode={source.interactivePreviewMode || 'follow'}
        />
      ) : (
        <div className={cn(
          "grid gap-6",
          currentGridClass
        )}>
          {filteredItems.map((item, index) => (
            <ContentCard 
               key={item.id}
               item={item} 
               type={source.type} 
               displayMode={source.displayMode}
               cardStyle={source.cardStyle}
               index={index}
               onView={source.type === 'classes' ? undefined : setSelectedItem}
             />
          ))}
        </div>
      )}

      {/* Custom Dialogs (Self-contained) */}
      {selectedItem && source.type === 'news' && !('_isPatchNote' in selectedItem) && (
        <NewsDetailDialog item={selectedItem as NewsItem} open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
      )}

      {selectedItem && source.type === 'media' && (
        <MediaDetailDialog item={selectedItem as MediaItem} open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
      )}

      {/* Default Fallback Modal for generic types (Not Portal, Not Custom Dialog) */}
      <Dialog 
        open={!!selectedItem && !['news', 'media', 'weapons', 'maps', 'gameDevices', 'gameModes', 'gamemodetab', 'features', 'patchnotes'].includes(source.type)} 
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl uppercase">
              {selectedItem &&
                ('title' in selectedItem
                  ? (selectedItem as { title: string }).title
                  : 'name' in selectedItem
                    ? (selectedItem as { name: string }).name
                    : 'Details')}
            </DialogTitle>
            <DialogDescription>
              {selectedItem && 'date' in selectedItem && (
                <span className="block mb-2 text-primary">
                  {new Date((selectedItem as { date: string }).date).toLocaleDateString()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="mt-4">
              {('image' in selectedItem || 'src' in selectedItem) && (
                <div className="aspect-video rounded-lg overflow-hidden mb-6">
                  <img 
                    src={
                      'image' in selectedItem
                        ? (selectedItem as { image: string }).image
                        : (selectedItem as { src: string }).src
                    } 
                    alt="Content" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {'description' in selectedItem
                    ? (selectedItem as { description?: string }).description ?? ''
                    : ''}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Portal-based Details (rendered outside Dialog to avoid double-wrapping) */}
      {selectedItem && source.type === 'weapons' && (
         <WeaponDetail weapon={selectedItem as WeaponItem} onClose={() => setSelectedItem(null)} />
      )}
      {selectedItem && source.type === 'maps' && (
         <MapDetail map={selectedItem as MapItem} onClose={() => setSelectedItem(null)} />
      )}
      {selectedItem && source.type === 'gameDevices' && (
         <DeviceDetail device={selectedItem as GameDeviceItem} onClose={() => setSelectedItem(null)} />
      )}
      {selectedItem && (source.type === 'gameModes' || source.type === 'gamemodetab') && (
         <GameModeDetail mode={selectedItem as GameModeItem} onClose={() => setSelectedItem(null)} />
      )}
      {selectedItem && source.type === 'features' && (
         <FeatureDetail feature={selectedItem as FeatureItem} onClose={() => setSelectedItem(null)} />
      )}
      {selectedItem && (source.type === 'patchnotes' || (source.type === 'news' && '_isPatchNote' in selectedItem)) && (
         <PatchNoteDetail 
           item={selectedItem as PatchNoteItem} 
           onClose={() => setSelectedItem(null)} 
           variant={source.detailStyle || (source.includePatchNotes ? 'side-panel' : 'default')}
         />
      )}

      {/* View All Button for Patch Notes */}
      {source.type === 'patchnotes' && source.viewAllSettings?.enabled && (
        <div className={cn(
          "mt-8 flex",
          source.viewAllSettings.alignment === 'center' ? 'justify-center' : 
          source.viewAllSettings.alignment === 'right' ? 'justify-end' : 'justify-start'
        )}>
          <Button 
            variant="outline" 
            asChild 
            className="group uppercase tracking-wider font-heading border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <a href={source.viewAllSettings.url || '#'}>
              {source.viewAllSettings.label || 'View All Patch Notes'}
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
