import { useState, useEffect, useCallback } from 'react';
import { 
  SiteContent, 
  NewsItem, 
  ClassItem,
  MediaItem,
  FAQItem,
  FeatureItem,
  PageContent,
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
    updatePrivacy,
    updateTerms,
    reset,
  };
}
