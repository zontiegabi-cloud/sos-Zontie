import { useFeaturedContent } from '@/hooks/use-featured-content';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeaturedContentItem } from '@/lib/featured-content.types';

interface FeaturedContentGridProps {
  className?: string;
  title?: string;
  description?: string;
}

function ContentCard({ item }: { item: FeaturedContentItem }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {item.thumbnail && (
        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${item.thumbnail})` }} />
      )}
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      {item.description && (
        <CardContent>
          <p className="text-muted-foreground">{item.description}</p>
        </CardContent>
      )}
    </Card>
  );
}

export function FeaturedContentGrid({ className, title, description }: FeaturedContentGridProps) {
  const { featuredContent, isLoading, error } = useFeaturedContent();

  if (isLoading) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-muted-foreground">Loading featured content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (featuredContent.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-muted-foreground">No featured content available</div>
      </div>
    );
  }

  return (
    <section className={cn("py-12", className)}>
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredContent.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
