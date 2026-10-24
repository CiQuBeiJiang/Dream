import React, { createContext, useContext, useState, useCallback } from 'react';
import { chapters, siteConfig } from '@/content/config';
import type { Chapter } from '@/content/config';

interface AppState {
  currentChapter: Chapter;
  sliderValue: number;
  videoSrc: string;
  setChapter: (id: string) => void;
  setSliderValue: (value: number) => void;
  setVideoSrc: (src: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentChapter, setCurrentChapterState] = useState<Chapter>(chapters[0]);
  const [sliderValue, setSliderValueState] = useState(0.15);
  const [videoSrc, setVideoSrcState] = useState(siteConfig.introVideo);

  const setChapter = useCallback((id: string) => {
    const chapter = chapters.find(c => c.id === id);
    if (chapter) setCurrentChapterState(chapter);
  }, []);

  const setSliderValue = useCallback((value: number) => {
    setSliderValueState(Math.max(0, Math.min(1, value)));
  }, []);

  const setVideoSrc = useCallback((src: string) => {
    setVideoSrcState(src);
  }, []);

  return (
    <AppContext.Provider value={{ currentChapter, sliderValue, videoSrc, setChapter, setSliderValue, setVideoSrc }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
