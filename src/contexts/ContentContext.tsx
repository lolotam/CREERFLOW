'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'image' | 'hero' | 'stats';
  content: string;
}

interface ContentContextType {
  content: ContentSection[];
  getContent: (id: string) => string | null;
  getContentSection: (id: string) => ContentSection | null;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

interface ContentProviderProps {
  children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const [content, setContent] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/content');
      const result = await response.json();
      
      if (result.success) {
        setContent(result.data);
      } else {
        setError(result.message || 'Failed to fetch content');
      }
    } catch (err) {
      setError('Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getContent = (id: string): string | null => {
    const section = content.find(section => section.id === id);
    return section ? section.content : null;
  };

  const getContentSection = (id: string): ContentSection | null => {
    return content.find(section => section.id === id) || null;
  };

  const refreshContent = async () => {
    await fetchContent();
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        getContent,
        getContentSection,
        loading,
        error,
        refreshContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}