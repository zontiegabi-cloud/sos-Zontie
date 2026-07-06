import { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeaturedContent } from "@/hooks/use-featured-content";
import { cn } from "@/lib/utils";

export function FeaturedPopup() {
  const { featuredContent, isLoading } = useFeaturedContent();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Only show popup if there's featured content and user hasn't dismissed it in this session
  useEffect(() => {
    if (featuredContent.length > 0 && !dismissed) {
      setIsOpen(true);
    }
  }, [featuredContent, dismissed]);

  // Auto-rotate content
  useEffect(() => {
    if (!isOpen || featuredContent.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, featuredContent]);

  if (isLoading || !featuredContent.length || dismissed) {
    return null;
  }

  const currentItem = featuredContent[currentIndex];

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Popup */}
      <div
        className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-4xl bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 border border-gray-700",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            setDismissed(true);
          }}
          className="absolute top-3 right-3 p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Thumbnail */}
        {currentItem.thumbnail && (
          <div className="w-full h-64 md:h-80 relative">
            <img
              src={currentItem.thumbnail}
              alt={currentItem.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">
                {currentItem.contentSource}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentItem.title}
              </h2>
            </div>
          </div>

          {currentItem.description && (
            <p className="text-gray-300 mb-6 leading-relaxed">
              {currentItem.description}
            </p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(
                    (prev) => (prev - 1 + featuredContent.length) % featuredContent.length
                  );
                }}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
                }}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Dots */}
            <div className="flex gap-2">
              {featuredContent.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(i);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentIndex ? "bg-blue-500" : "bg-gray-600 hover:bg-gray-500"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
