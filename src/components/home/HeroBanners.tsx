import { useState, useEffect } from 'react';
import { useFeaturedContent } from '@/hooks/use-featured-content';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import VideoEmbed, { isSupportedVideoUrl } from './VideoEmbed';
import { HomepageHeroBanner } from '@/lib/featured-content.types';
import { HeroBannerDialog } from './HeroBannerDialog';

export function HeroBanners({ className }: { className?: string }) {
  const { heroBanners, isLoading, error } = useFeaturedContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState<HomepageHeroBanner | null>(null);

  useEffect(() => {
    if (heroBanners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
      }, 5000); // Auto-rotate every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroBanners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  if (isLoading) {
    return (
      <div className={cn("min-h-[600px] flex items-center justify-center bg-muted", className)}>
        <div className="text-muted-foreground">Loading hero banners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("min-h-[600px] flex items-center justify-center bg-muted", className)}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (heroBanners.length === 0) {
    return (
      <div className={cn("min-h-[300px] flex items-center justify-center bg-muted", className)}>
        <div className="text-muted-foreground">No hero banners available</div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Slides */}
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {heroBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative w-full h-[600px] flex-shrink-0 flex items-center justify-center bg-cover bg-center cursor-pointer"
            onClick={() => setSelectedBanner(banner)}
          >
            {isSupportedVideoUrl(banner.bannerUrl) ? (
              <VideoEmbed
                url={banner.bannerUrl}
                className="absolute inset-0 rounded-none"
                autoPlay
                muted
                loop
                controls={false}
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${banner.bannerUrl})`
                }}
              />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-8 text-center text-white">
              {banner.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {banner.title}
                </h1>
              )}
              {banner.description && (
                <p className="text-lg md:text-xl mb-8 text-gray-200">
                  {banner.description}
                </p>
              )}
              {banner.callToAction && banner.ctaLink && (
                <a
                  href={banner.ctaLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="lg" className="text-lg">
                    {banner.callToAction}
                  </Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      {heroBanners.length > 1 && (
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
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i === currentIndex ? "bg-white" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}

      <HeroBannerDialog
        banner={selectedBanner}
        open={!!selectedBanner}
        onOpenChange={(open) => {
          if (!open) setSelectedBanner(null);
        }}
      />
    </div>
  );
}
