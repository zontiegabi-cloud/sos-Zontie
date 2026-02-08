import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  FeatureItem
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
  FeatureDetail
} from '@/components/game';
import { RoadmapTimeline } from '@/components/game/RoadmapTimeline';
import { RoadmapShowcase } from '@/components/game/RoadmapShowcase';
import { Button } from "@/components/ui/button";

import { ContentItem } from './dynamic-content/types';
import { ContentCard } from './dynamic-content/ContentCard';
import { CarouselView } from './dynamic-content/CarouselView';
import { HeroCarouselView } from './dynamic-content/HeroCarouselView';
import { AccordionView } from './dynamic-content/AccordionView';
import { MasonryView } from './dynamic-content/MasonryView';
import { SpotlightView } from './dynamic-content/SpotlightView';
import { FeaturedView } from './dynamic-content/FeaturedView';
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

    const key = source.type as keyof SiteContent;
    let allItems = (content[key] as ContentItem[]) || [];
    
    
    // Filter by Configured Type (e.g. for Media)
    if (source.type === 'media' && source.filterType && source.filterType !== 'all') {
      allItems = allItems.filter((item) => 'type' in item && (item as MediaItem).type === source.filterType);
    }

    // Filter by Configured Category (e.g. for Roadmap or Media)
    if ((source.type === 'roadmap' || source.type === 'media') && source.category && source.category !== 'all') {
      allItems = allItems.filter((item) => 'category' in item && (item as any).category === source.category);
    }

    // Sort items based on configuration or local override
    const currentSortBy = activeSortBy || source.sortBy;
    if (currentSortBy) {
      allItems = [...allItems].sort((a, b) => {
        let valA: any = '';
        let valB: any = '';

        switch (currentSortBy) {
          case 'date':
            valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            break;
          case 'title':
            valA = 'title' in a ? (a as any).title : 'name' in a ? (a as any).name : '';
            valB = 'title' in b ? (b as any).title : 'name' in b ? (b as any).name : '';
            break;
          case 'category':
            // Prioritize explicit category, then tag (news), then role (classes), then environment (maps), then type (weapons)
            valA = 'category' in a ? (a as any).category : 
                   'tag' in a ? (a as any).tag : 
                   'role' in a ? (a as any).role : 
                   'environment' in a ? (a as any).environment : 
                   'type' in a ? (a as any).type : ''; // Fallback to type for weapons if no category

            valB = 'category' in b ? (b as any).category : 
                   'tag' in b ? (b as any).tag : 
                   'role' in b ? (b as any).role : 
                   'environment' in b ? (b as any).environment : 
                   'type' in b ? (b as any).type : '';
            break;
          case 'type':
            valA = 'type' in a ? (a as any).type : '';
            valB = 'type' in b ? (b as any).type : '';
            break;
        }

        if (valA < valB) return source.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return source.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (['news', 'media'].includes(source.type)) {
      // Default fallback sort for news/media
      allItems = [...allItems].sort((a, b) => {
        const dateA = 'date' in a ? new Date((a as any).date).getTime() : 0;
        const dateB = 'date' in b ? new Date((b as any).date).getTime() : 0;
        return dateB - dateA;
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
      else if ('type' in item && (item as any).type) cats.add((item as any).type);
    });
    
    return Array.from(cats);
  }, [baseItems, source.enableFiltering, source.showSortButtons]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return baseItems;
    
    return baseItems.filter(item => {
      const cat = 'category' in item ? item.category : 
                  'tag' in item ? item.tag : 
                  'role' in item ? item.role : 
                  'type' in item ? (item as any).type : null;
      return cat === activeCategory;
    });
  }, [baseItems, activeCategory]);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (!baseItems.length) return null;

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
          gridCols[source.gridColumns as keyof typeof gridCols] || gridCols[3]
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

      {/* Detail Modals */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          source.type === 'news' ? (
            <NewsDetailDialog item={selectedItem as NewsItem} open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
          ) : source.type === 'media' ? (
            <MediaDetailDialog item={selectedItem as MediaItem} open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
          ) : source.type === 'weapons' ? (
             <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
               <WeaponDetail weapon={selectedItem as WeaponItem} onClose={() => setSelectedItem(null)} />
             </DialogContent>
          ) : source.type === 'maps' ? (
             <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
               <MapDetail map={selectedItem as MapItem} onClose={() => setSelectedItem(null)} />
             </DialogContent>
          ) : source.type === 'gameDevices' ? (
             <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
               <DeviceDetail device={selectedItem as GameDeviceItem} onClose={() => setSelectedItem(null)} />
             </DialogContent>
          ) : source.type === 'gameModes' || source.type === 'gamemodetab' ? (
             <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
               <GameModeDetail mode={selectedItem as GameModeItem} onClose={() => setSelectedItem(null)} />
             </DialogContent>
          ) : source.type === 'features' ? (
             <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
               <FeatureDetail feature={selectedItem as FeatureItem} onClose={() => setSelectedItem(null)} />
             </DialogContent>
          ) : (
             // Default Fallback Modal
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl uppercase">
                  {'title' in selectedItem ? (selectedItem as any).title : 'name' in selectedItem ? (selectedItem as any).name : 'Details'}
                </DialogTitle>
                <DialogDescription>
                  {'date' in selectedItem && (
                    <span className="block mb-2 text-primary">
                      {new Date((selectedItem as any).date).toLocaleDateString()}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {('image' in selectedItem || 'src' in selectedItem) && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-6">
                    <img 
                      src={'image' in selectedItem ? (selectedItem as any).image : (selectedItem as any).src} 
                      alt="Content" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {'description' in selectedItem ? (selectedItem as any).description : ''}
                  </p>
                </div>
              </div>
            </DialogContent>
          )
        )}
      </Dialog>
    </div>
  );
}
