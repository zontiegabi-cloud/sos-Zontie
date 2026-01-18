import { useState, useEffect, useCallback } from 'react';
import { 
  SiteContent, 
  NewsItem, 
  ClassItem,
  MediaItem,
  FAQItem,
  FeatureItem,
  PageContent,
  WeaponItem,
  MapItem,
  GameDeviceItem,
  GameModeItem,
  getContent, 
  saveContent, 
  resetToDefaults 
} from '@/lib/content-store';

export function useContent() {
  const [content, setContent] = useState<SiteContent>(() => getContent());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setContent(getContent());
    setIsLoading(false);
  }, []);

  const updateContent = useCallback((newContent: SiteContent) => {
    setContent(newContent);
    saveContent(newContent);
  }, []);

  // News
  const addNewsItem = useCallback((item: Omit<NewsItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
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

  // Classes
  const addClassItem = useCallback((item: Omit<ClassItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
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
    const newItem = { ...item, id: Date.now().toString() };
    const newContent = { ...content, media: [...content.media, newItem] };
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

  // FAQ
  const addFAQItem = useCallback((item: Omit<FAQItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
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
    const newItem = { ...item, id: Date.now().toString() };
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
    const newItem = { ...item, id: Date.now().toString() };
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
    const newItem = { ...item, id: Date.now().toString() };
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
    const newItem = { ...item, id: Date.now().toString() };
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
    const newItem = { ...item, id: Date.now().toString() };
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

  // Privacy & Terms
  const updatePrivacy = useCallback((privacy: PageContent) => {
    updateContent({ ...content, privacy });
  }, [content, updateContent]);

  const updateTerms = useCallback((terms: PageContent) => {
    updateContent({ ...content, terms });
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
    privacy: content.privacy,
    terms: content.terms,
    weapons: content.weapons,
    maps: content.maps,
    gameDevices: content.gameDevices,
    gameModes: content.gameModes,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    addClassItem,
    updateClassItem,
    deleteClassItem,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
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
    updatePrivacy,
    updateTerms,
    reset,
  };
}
