import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { MusicTrack } from '../../types/music';
import MusicPlayer from './components/MusicPlayer';
import TrackList from './components/TrackList';

export default function MusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [current, setCurrent] = useState<MusicTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('music_playlist')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        const list = data ?? [];
        setTracks(list);
        if (list.length > 0) setCurrent(list[0]);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (!current || tracks.length === 0) return;
    const idx = tracks.findIndex((t) => t.id === current.id);
    const next = tracks[(idx + 1) % tracks.length];
    setCurrent(next);
  };

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#080808' }}>
      {/* Header */}
      <div className="px-8 md:px-16 pt-10 pb-8">
        <p
          className="font-mono text-xs tracking-[0.25em] mb-2"
          style={{ color: 'rgba(110,207,184,0.5)', fontFamily: 'Space Mono, monospace' }}
        >
          ◈ AUDIO_LOG
        </p>
        <h1
          className="font-mono text-2xl tracking-[0.15em] mb-1"
          style={{ color: '#F0EEE8', fontFamily: 'Space Mono, monospace' }}
        >
          MUSIC
        </h1>
        <div
          style={{
            height: '1px',
            width: '40px',
            background: 'linear-gradient(to right, #6ECFB8, transparent)',
            marginTop: '12px',
          }}
        />
      </div>

      <div className="px-8 md:px-16 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-mono text-xs tracking-widest" style={{ color: '#383834' }}>
              LOADING...
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6" style={{ maxWidth: '1100px' }}>
            {/* Player area */}
            <div className="flex-1 min-w-0">
              <MusicPlayer track={current} onEnded={handleNext} />

              {/* Now playing info */}
              {current && (
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: '#0C0C0C', borderTop: 'none', border: '1px solid #1C1C1C', borderTop: 'none' }}
                >
                  <div>
                    <p className="font-mono text-sm" style={{ color: '#F0EEE8' }}>{current.title}</p>
                    {current.artist && (
                      <p className="font-mono text-xs mt-0.5" style={{ color: '#6ECFB8' }}>{current.artist}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <span
                        key={i}
                        className="w-0.5"
                        style={{
                          backgroundColor: '#6ECFB8',
                          height: `${8 + (i % 3) * 4}px`,
                          display: 'inline-block',
                          animation: `soundbar 0.8s ease-in-out infinite`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Next track hint */}
              {current && tracks.length > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-mono" style={{ fontSize: '10px', color: '#383834' }}>
                    NEXT: {tracks[(tracks.findIndex((t) => t.id === current.id) + 1) % tracks.length].title}
                  </p>
                  <button
                    onClick={handleNext}
                    className="font-mono cursor-pointer transition-colors"
                    style={{ fontSize: '10px', color: '#585854' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#6ECFB8')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#585854')}
                  >
                    SKIP →
                  </button>
                </div>
              )}
            </div>

            {/* Playlist sidebar */}
            <div
              className="w-full lg:w-72 shrink-0"
              style={{ border: '1px solid #1C1C1C', backgroundColor: '#0C0C0C' }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid #1C1C1C' }}
              >
                <p className="font-mono text-xs tracking-widest" style={{ color: '#383834' }}>
                  PLAYLIST
                </p>
                <p className="font-mono text-xs" style={{ color: '#2A3E3A' }}>
                  {tracks.length} TRACKS
                </p>
              </div>
              <div className="py-1 overflow-y-auto" style={{ maxHeight: '480px' }}>
                <TrackList
                  tracks={tracks}
                  currentId={current?.id ?? null}
                  onSelect={setCurrent}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes soundbar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
