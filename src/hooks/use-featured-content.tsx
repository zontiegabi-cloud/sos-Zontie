import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/config';
import { FeaturedContentItem, HomepageHeroBanner } from '@/lib/featured-content.types';

export function useFeaturedContent() {
  const [featuredContent, setFeaturedContent] = useState<FeaturedContentItem[]>([]);
  const [heroBanners, setHeroBanners] = useState<HomepageHeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedContent = useCallback(async () => {
    try {
      const featuredRes = await fetch(`${API_BASE_URL}/api/featured/content`);
      if (!featuredRes.ok) {
        throw new Error('Failed to fetch featured content');
      }
      const featuredData = await featuredRes.json();

      const bannersRes = await fetch(`${API_BASE_URL}/api/featured/homepage`);
      if (!bannersRes.ok) {
        throw new Error('Failed to fetch hero banners');
      }
      const bannersData = await bannersRes.json();

      setFeaturedContent(featuredData);
      setHeroBanners(bannersData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedContent();
  }, [fetchFeaturedContent]);

  return {
    featuredContent,
    heroBanners,
    isLoading,
    error,
    refresh: fetchFeaturedContent
  };
}
