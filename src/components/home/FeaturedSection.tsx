import { cn } from '@/lib/utils';
import { LegacyFeaturedContentItem } from '@/lib/featured-content.types';
import VideoEmbed from './VideoEmbed';

export interface FeaturedSectionProps {
  item: LegacyFeaturedContentItem;
}

export default function FeaturedSection({ item }: FeaturedSectionProps) {
  if (!item || !item.title) return null;

  return (
    <section 
      className="relative w-full overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5"
      aria-label={item.title}
    >
      {/* Background Image */}
      {item.bgImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: `url(${item.bgImage})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.6
          }}
        />
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 
            className={cn(
              "text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4",
              item.image && "mb-8"
            )}
          >
            {item.title}
          </h1>

          {/* Description */}
          {item.description && (
            <p 
              className="text-lg md:text-xl text-slate-200 mb-6 max-w-3xl mx-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.description || '' }}
            />
          )}

          {/* Image */}
          {item.image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Video Embed */}
          {item.videoUrl && item.embedType && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-2xl border-4 border-primary/30">
              <VideoEmbed url={item.videoUrl} type={item.embedType} />
            </div>
          )}

          {/* Call to Action Button */}
          {item.link && item.callToAction && (
            <a 
              href={item.link}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200 shadow-lg"
            >
              {item.callToAction}
            </a>
          )}
        </div>

        {/* Featured Label */}
        <div className="text-center mt-8">
          <span className="inline-block px-6 py-2 rounded-full bg-primary/20 text-primary font-semibold text-sm backdrop-blur-sm">
            {item.category || 'Featured Content'}
          </span>
        </div>
      </div>
    </section>
  );
}
