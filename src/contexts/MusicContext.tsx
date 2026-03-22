import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { MusicTrack } from '../types/music';

interface MusicContextValue {
  tracks: MusicTrack[];
  currentIndex: number;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  selectTrack: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  playerRef: React.MutableRefObject<any>;
  apiReady: boolean;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    supabase
      .from('music_playlist')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => setTracks(data ?? []));
  }, []);

  // Load YouTube IFrame API
  useEffect(() => {
    if ((window as any).YT?.Player) {
      setApiReady(true);
      return;
    }
    const prev = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      setApiReady(true);
    };
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  const selectTrack = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    setCurrentIndex(i => (i + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    setCurrentIndex(i => (i - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider
      value={{ tracks, currentIndex, isPlaying, setIsPlaying, selectTrack, nextTrack, prevTrack, playerRef, apiReady }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusicContext must be used within MusicProvider');
  return ctx;
}
