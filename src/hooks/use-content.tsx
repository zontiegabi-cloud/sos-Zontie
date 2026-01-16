import { useState, useEffect, useCallback } from 'react';
import { 
  SiteContent, 
  NewsItem, 
  ClassItem, 
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

  const updateNews = useCallback((news: NewsItem[]) => {
    const newContent = { ...content, news };
    setContent(newContent);
    saveContent(newContent);
  }, [content]);

  const updateClasses = useCallback((classes: ClassItem[]) => {
    const newContent = { ...content, classes };
    setContent(newContent);
    saveContent(newContent);
  }, [content]);

  const addNewsItem = useCallback((item: Omit<NewsItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const newNews = [...content.news, newItem];
    updateNews(newNews);
    return newItem;
  }, [content.news, updateNews]);

  const updateNewsItem = useCallback((id: string, updates: Partial<NewsItem>) => {
    const newNews = content.news.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateNews(newNews);
  }, [content.news, updateNews]);

  const deleteNewsItem = useCallback((id: string) => {
    const newNews = content.news.filter(item => item.id !== id);
    updateNews(newNews);
  }, [content.news, updateNews]);

  const addClassItem = useCallback((item: Omit<ClassItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const newClasses = [...content.classes, newItem];
    updateClasses(newClasses);
    return newItem;
  }, [content.classes, updateClasses]);

  const updateClassItem = useCallback((id: string, updates: Partial<ClassItem>) => {
    const newClasses = content.classes.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateClasses(newClasses);
  }, [content.classes, updateClasses]);

  const deleteClassItem = useCallback((id: string) => {
    const newClasses = content.classes.filter(item => item.id !== id);
    updateClasses(newClasses);
  }, [content.classes, updateClasses]);

  const reset = useCallback(() => {
    resetToDefaults();
    setContent(getContent());
  }, []);

  return {
    content,
    isLoading,
    news: content.news,
    classes: content.classes,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    addClassItem,
    updateClassItem,
    deleteClassItem,
    reset,
  };
}
