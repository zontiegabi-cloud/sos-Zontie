import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import VideoEmbed, { isSupportedVideoUrl } from '@/components/home/VideoEmbed';
import { DynamicContentSource, MediaItem } from '@/lib/content-store';
import { ContentItem } from './types';
import { getItemImage, getItemTitle, getItemDescription, getItemTag } from './utils';

/**
 * Hero Banner Carousel View for Media source.
 * Reuses the visual language of the top-level <HeroBanners /> component
 * (full-width 600px slider, autoplay, dark overlay, centered title/desc/CTA,
 * arrow controls, dot indicators) but driven by items from a dynamic source.
 */
export function HeroBannerCarouselView({
  items,
  source,
  onView,
}: {
  items: ContentItem[];
  source: DynamicContentSource;
  onView: (item: ContentItem) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const bannerHeight = source.bannerHeight ?? 600;
  const autoplayInterval = source.autoplayInterval ?? 5000;
  const showCta = source.showCta ?? true;
  const ctaLabel = source.ctaLabel || 'View Details';

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, Math.max(1000, autoplayInterval));
    return () => clearInterval(interval);
  }, [items.length, isPaused, autoplayInterval]);

  if (items.length === 0) return null;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  // Prefer the raw src for media (so videos play), fall back to derived image
  const getBannerUrl = (item: ContentItem): string => {
    if (source.type === 'media') {
      const media = item as MediaItem;
      if (media.type === 'video' && media.src) return media.src;
      return getItemImage(item, source.type);
    }
    return getItemImage(item, source.type);
  };

  return (
    <div
      className="relative w-full left-1/2 -translate-x-1/2 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => {
          const bannerUrl = getBannerUrl(item);
          const title = getItemTitle(item);
          const description = getItemDescription(item);
          const tag = getItemTag(item, source.type);

          return (
            <div
              key={item.id}
              className="relative w-full flex-shrink-0 flex items-center justify-center bg-cover bg-center cursor-pointer"
              style={{ height: `${bannerHeight}px` }}
              onClick={() => onView(item)}
            >
              {isSupportedVideoUrl(bannerUrl) ? (
                <VideoEmbed
                  url={bannerUrl}
                  className="absolute inset-0 rounded-none"
                  autoPlay
                  muted
                  loop
                  controls={false}
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${bannerUrl})` }}
                />
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Content */}
              <div className="relative z-10 max-w-4xl mx-auto px-8 text-center text-white">
                {tag && (
                  <span className="inline-block mb-4 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/40 rounded backdrop-blur-md">
                    {tag}
                  </span>
                )}
                {title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg md:text-xl mb-8 text-gray-200 line-clamp-3">
                    {description}
                  </p>
                )}
                {showCta && (
                  <Button
                    size="lg"
                    className="text-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(item);
                    }}
                  >
                    {ctaLabel}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav arrows & dots */}
      {items.length > 1 && (
        <>
          <Button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
          >
            <ArrowRight className="w-6 h-6" />
          </Button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  i === currentIndex ? 'bg-white' : 'bg-white/40'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}