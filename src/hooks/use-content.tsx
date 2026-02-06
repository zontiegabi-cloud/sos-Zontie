import { useState, useEffect, useCallback } from 'react';
import { 
  SiteContent, 
  NewsItem, 
  ClassItem,
  MediaItem,
  FAQItem,
  FeatureItem,
  PageContent,
  Page,
  WeaponItem,
  MapItem,
  GameDeviceItem,
  GameModeItem,
  RoadmapItem,
  getContent, 
  getData,
  saveData, 
  resetToDefaults 
} from '@/lib/content-store';
import { generateId } from '@/lib/utils';

export function useContent() {
  const [content, setContent] = useState<SiteContent>(() => getContent());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await getData();
    setContent(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateContent = useCallback(async (newContent: SiteContent) => {
    setContent(newContent);
    const serverContent = await saveData(newContent);
    if (serverContent) {
      setContent(serverContent);
    }
  }, []);

  // News
  const addNewsItem = useCallback((item: Omit<NewsItem, 'id'>) => {
    // Check for duplicates
    const exists = content.news.some(n => n.title.trim().toLowerCase() === item.title.trim().toLowerCase());
    if (exists) {
      console.warn(`News article with title "${item.title}" already exists.`);
      return content.news.find(n => n.title.trim().toLowerCase() === item.title.trim().toLowerCase()) as NewsItem;
    }

    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, news: [newItem, ...content.news] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateNewsItem = useCallback((id: string, updates: Partial<NewsItem>) => {
    const newNews = content.news.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, news: newNews });
  }, [content, updateContent]);

  const deleteNewsItem = useCallback((id: string) => {
    const newNews = content.news.filter(item => item.id !== id);
    updateContent({ ...content, news: newNews });
  }, [content, updateContent]);

  const deleteNewsItems = useCallback((ids: Set<string>) => {
    const newNews = content.news.filter(item => !ids.has(item.id));
    updateContent({ ...content, news: newNews });
  }, [content, updateContent]);

  // Classes
  const addClassItem = useCallback((item: Omit<ClassItem, 'id'>) => {
    // Check for duplicates
    const exists = content.classes.some(c => c.name.trim().toLowerCase() === item.name.trim().toLowerCase());
    if (exists) {
      console.warn(`Class with name "${item.name}" already exists.`);
      return content.classes.find(c => c.name.trim().toLowerCase() === item.name.trim().toLowerCase()) as ClassItem;
    }

    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, classes: [...content.classes, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateClassItem = useCallback((id: string, updates: Partial<ClassItem>) => {
    const newClasses = content.classes.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, classes: newClasses });
  }, [content, updateContent]);

  const deleteClassItem = useCallback((id: string) => {
    const newClasses = content.classes.filter(item => item.id !== id);
    updateContent({ ...content, classes: newClasses });
  }, [content, updateContent]);

  // Media
  const addMediaItem = useCallback((item: Omit<MediaItem, 'id'>) => {
    // Check for duplicates (by title and src)
    const exists = content.media.some(m => 
      m.title.trim().toLowerCase() === item.title.trim().toLowerCase() ||
      m.src === item.src
    );
    if (exists) {
      console.warn(`Media with title "${item.title}" or src already exists.`);
      return content.media.find(m => 
        m.title.trim().toLowerCase() === item.title.trim().toLowerCase() ||
        m.src === item.src
      ) as MediaItem;
    }

    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, media: [newItem, ...content.media] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateMediaItem = useCallback((id: string, updates: Partial<MediaItem>) => {
    const newMedia = content.media.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, media: newMedia });
  }, [content, updateContent]);

  const deleteMediaItem = useCallback((id: string) => {
    const newMedia = content.media.filter(item => item.id !== id);
    updateContent({ ...content, media: newMedia });
  }, [content, updateContent]);

  const deleteMediaItems = useCallback((ids: Set<string>) => {
    const newMedia = content.media.filter(item => !ids.has(item.id));
    updateContent({ ...content, media: newMedia });
  }, [content, updateContent]);

  // FAQ
  const addFAQItem = useCallback((item: Omit<FAQItem, 'id'>) => {
    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, faq: [...content.faq, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateFAQItem = useCallback((id: string, updates: Partial<FAQItem>) => {
    const newFAQ = content.faq.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, faq: newFAQ });
  }, [content, updateContent]);

  const deleteFAQItem = useCallback((id: string) => {
    const newFAQ = content.faq.filter(item => item.id !== id);
    updateContent({ ...content, faq: newFAQ });
  }, [content, updateContent]);

  // Features
  const addFeatureItem = useCallback((item: Omit<FeatureItem, 'id'>) => {
    // Check for duplicates
    const exists = content.features.some(f => f.title.toLowerCase() === item.title.toLowerCase());
    if (exists) {
      console.warn(`Feature with title "${item.title}" already exists.`);
      return content.features.find(f => f.title.toLowerCase() === item.title.toLowerCase()) as FeatureItem;
    }

    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, features: [...content.features, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateFeatureItem = useCallback((id: string, updates: Partial<FeatureItem>) => {
    const newFeatures = content.features.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, features: newFeatures });
  }, [content, updateContent]);

  const deleteFeatureItem = useCallback((id: string) => {
    const newFeatures = content.features.filter(item => item.id !== id);
    updateContent({ ...content, features: newFeatures });
  }, [content, updateContent]);

  // Weapons
  const addWeaponItem = useCallback((item: Omit<WeaponItem, 'id'>) => {
    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, weapons: [...content.weapons, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateWeaponItem = useCallback((id: string, updates: Partial<WeaponItem>) => {
    const newWeapons = content.weapons.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, weapons: newWeapons });
  }, [content, updateContent]);

  const deleteWeaponItem = useCallback((id: string) => {
    const newWeapons = content.weapons.filter(item => item.id !== id);
    updateContent({ ...content, weapons: newWeapons });
  }, [content, updateContent]);

  // Maps
  const addMapItem = useCallback((item: Omit<MapItem, 'id'>) => {
    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, maps: [...content.maps, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateMapItem = useCallback((id: string, updates: Partial<MapItem>) => {
    const newMaps = content.maps.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, maps: newMaps });
  }, [content, updateContent]);

  const deleteMapItem = useCallback((id: string) => {
    const newMaps = content.maps.filter(item => item.id !== id);
    updateContent({ ...content, maps: newMaps });
  }, [content, updateContent]);

  // Game Devices
  const addGameDeviceItem = useCallback((item: Omit<GameDeviceItem, 'id'>) => {
    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, gameDevices: [...content.gameDevices, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateGameDeviceItem = useCallback((id: string, updates: Partial<GameDeviceItem>) => {
    const newGameDevices = content.gameDevices.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, gameDevices: newGameDevices });
  }, [content, updateContent]);

  const deleteGameDeviceItem = useCallback((id: string) => {
    const newGameDevices = content.gameDevices.filter(item => item.id !== id);
    updateContent({ ...content, gameDevices: newGameDevices });
  }, [content, updateContent]);

  // Game Modes
  const addGameModeItem = useCallback((item: Omit<GameModeItem, 'id'>) => {
    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, gameModes: [...content.gameModes, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateGameModeItem = useCallback((id: string, updates: Partial<GameModeItem>) => {
    const newGameModes = content.gameModes.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, gameModes: newGameModes });
  }, [content, updateContent]);

  const deleteGameModeItem = useCallback((id: string) => {
    const newGameModes = content.gameModes.filter(item => item.id !== id);
    updateContent({ ...content, gameModes: newGameModes });
  }, [content, updateContent]);

  // Roadmap
  const addRoadmapItem = useCallback((item: Omit<RoadmapItem, 'id'>) => {
    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, roadmap: [...(content.roadmap || []), newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updateRoadmapItem = useCallback((id: string, updates: Partial<RoadmapItem>) => {
    const newRoadmap = (content.roadmap || []).map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, roadmap: newRoadmap });
  }, [content, updateContent]);

  const deleteRoadmapItem = useCallback((id: string) => {
    const newRoadmap = (content.roadmap || []).filter(item => item.id !== id);
    updateContent({ ...content, roadmap: newRoadmap });
  }, [content, updateContent]);

  // Pages
  const addPage = useCallback((item: Omit<Page, 'id'>) => {
    const currentPages = content.pages || [];
    // Check for duplicates
    const exists = currentPages.some(p => p.slug.trim().toLowerCase() === item.slug.trim().toLowerCase());
    if (exists) {
      console.warn(`Page with slug "${item.slug}" already exists.`);
      return currentPages.find(p => p.slug.trim().toLowerCase() === item.slug.trim().toLowerCase()) as Page;
    }

    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    const newContent = { ...content, pages: [...currentPages, newItem] };
    updateContent(newContent);
    return newItem;
  }, [content, updateContent]);

  const updatePage = useCallback((id: string, updates: Partial<Page>) => {
    const currentPages = content.pages || [];
    const newPages = currentPages.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateContent({ ...content, pages: newPages });
  }, [content, updateContent]);

  const deletePage = useCallback((id: string) => {
    const currentPages = content.pages || [];
    const pageToDelete = currentPages.find(p => p.id === id);
    const newPages = currentPages.filter(item => item.id !== id);
    
    let newSettings = content.settings;
    if (pageToDelete) {
      const currentDeleted = content.settings.deletedPageSlugs || [];
      if (!currentDeleted.includes(pageToDelete.slug)) {
        newSettings = {
          ...content.settings,
          deletedPageSlugs: [...currentDeleted, pageToDelete.slug]
        };
      }
    }
    
    updateContent({ ...content, pages: newPages, settings: newSettings });
  }, [content, updateContent]);

  const reset = useCallback(() => {
    resetToDefaults();
    setContent(getContent());
  }, []);

  return {
    content,
    isLoading,
    news: content.news,
    classes: content.classes,
    media: content.media,
    faq: content.faq,
    features: content.features,
    pages: content.pages,
    weapons: content.weapons,
    maps: content.maps,
    gameDevices: content.gameDevices,
    gameModes: content.gameModes,
    roadmap: content.roadmap,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    deleteNewsItems,
    addClassItem,
    updateClassItem,
    deleteClassItem,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    deleteMediaItems,
    addFAQItem,
    updateFAQItem,
    deleteFAQItem,
    addFeatureItem,
    updateFeatureItem,
    deleteFeatureItem,
    addWeaponItem,
    updateWeaponItem,
    deleteWeaponItem,
    addMapItem,
    updateMapItem,
    deleteMapItem,
    addGameDeviceItem,
    updateGameDeviceItem,
    deleteGameDeviceItem,
    addGameModeItem,
    updateGameModeItem,
    deleteGameModeItem,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    addPage,
    updatePage,
    deletePage,
    updateContent,
    reset,
    refresh,
  };
}
