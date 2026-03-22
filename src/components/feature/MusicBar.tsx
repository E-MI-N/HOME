import { useEffect, useRef, useState } from 'react';
import { useMusicContext } from '../../contexts/MusicContext';

export default function MusicBar() {
  const {
    tracks,
    currentIndex,
    isPlaying,
    setIsPlaying,
    selectTrack,
    nextTrack,
    prevTrack,
    playerRef,
    apiReady,
  } = useMusicContext();

  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const currentIndexRef = useRef(currentIndex);
  const isPlayingRef = useRef(isPlaying);
  const nextTrackRef = useRef(nextTrack);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { nextTrackRef.current = nextTrack; }, [nextTrack]);

  // Initialize YouTube Player once API is ready and tracks are loaded
  useEffect(() => {
    if (!apiReady || tracks.length === 0 || initialized) return;

    playerRef.current = new (window as any).YT.Player('yt-music-player', {
      height: '1',
      width: '1',
      videoId: tracks[0].video_id,
      playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
      events: {
        onReady: () => setInitialized(true),
        onStateChange: (event: any) => {
          const YT = (window as any).YT;
          if (event.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          } else if (event.data === YT.PlayerState.ENDED) {
            nextTrackRef.current();
          }
        },
      },
    });
  }, [apiReady, tracks.length]);

  // Load new video when track changes (after initialized)
  useEffect(() => {
    if (!initialized || !playerRef.current || tracks.length === 0) return;
    const track = tracks[currentIndex];
    if (!track) return;
    if (isPlayingRef.current) {
      playerRef.current.loadVideoById?.(track.video_id);
    } else {
      playerRef.current.cueVideoById?.(track.video_id);
    }
  }, [currentIndex, initialized]);

  // Play/pause toggle
  useEffect(() => {
    if (!initialized || !playerRef.current) return;
    if (isPlaying) {
      playerRef.current.playVideo?.();
    } else {
      playerRef.current.pauseVideo?.();
    }
  }, [isPlaying, initialized]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const currentTrack = tracks[currentIndex];

  if (tracks.length === 0) return null;

  return (
    <>
      {/* Hidden YouTube player div */}
      <div
        style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '1px', height: '1px', overflow: 'hidden', zIndex: -1 }}
      >
        <div id="yt-music-player" />
      </div>

      {/* Playlist drawer */}
      {playlistOpen && (
        <div
          className="fixed z-40"
          style={{
            bottom: '52px',
            right: '0',
            width: '260px',
            maxHeight: '320px',
            backgroundColor: '#0C0C0C',
            borderTop: '1px solid #1C1C1C',
            borderLeft: '1px solid #1C1C1C',
            overflowY: 'auto',
          }}
        >
          <div
            className="px-4 py-2 flex items-center justify-between"
            style={{ borderBottom: '1px solid #1C1C1C' }}
          >
            <p className="font-mono" style={{ fontSize: '10px', color: '#383834', letterSpacing: '0.2em' }}>
              PLAYLIST · {tracks.length}
            </p>
          </div>
          {tracks.map((track, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={track.id}
                onClick={() => { selectTrack(i); setPlaylistOpen(false); }}
                className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors"
                style={{
                  backgroundColor: isActive ? 'rgba(110,207,184,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #6ECFB8' : '2px solid transparent',
                }}
              >
                <p className="font-mono truncate" style={{ fontSize: '11px', color: isActive ? '#F0EEE8' : '#808078' }}>
                  {isActive && <span style={{ color: '#6ECFB8', marginRight: '4px' }}>▶</span>}
                  {track.title}
                </p>
                {track.artist && (
                  <p className="font-mono mt-0.5 truncate" style={{ fontSize: '10px', color: isActive ? '#6ECFB8' : '#585854' }}>
                    {track.artist}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Music bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center px-4 md:px-6 gap-4"
        style={{
          height: '52px',
          backgroundColor: '#080808',
          borderTop: '1px solid rgba(110,207,184,0.15)',
        }}
      >
        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={prevTrack}
            className="cursor-pointer transition-colors w-6 h-6 flex items-center justify-center"
            style={{ color: '#6ECFB8' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <i className="ri-skip-back-fill" style={{ fontSize: '16px' }} />
          </button>

          <button
            onClick={togglePlay}
            className="cursor-pointer transition-all flex items-center justify-center"
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid rgba(110,207,184,0.7)',
              color: '#6ECFB8',
              backgroundColor: 'rgba(110,207,184,0.1)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,207,184,0.22)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,207,184,0.1)')}
          >
            <i className={isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} style={{ fontSize: '16px' }} />
          </button>

          <button
            onClick={nextTrack}
            className="cursor-pointer transition-colors w-6 h-6 flex items-center justify-center"
            style={{ color: '#6ECFB8' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <i className="ri-skip-forward-fill" style={{ fontSize: '16px' }} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', backgroundColor: '#1C1C1C', flexShrink: 0 }} />

        {/* Track info */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          {/* Sound animation */}
          <div className="flex items-end gap-0.5 shrink-0" style={{ height: '14px' }}>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="w-0.5"
                style={{
                  backgroundColor: isPlaying ? '#6ECFB8' : '#2A3E3A',
                  height: isPlaying ? `${6 + (i % 2) * 5}px` : '4px',
                  display: 'inline-block',
                  transition: 'height 0.3s ease',
                  animation: isPlaying ? `soundbar ${0.6 + i * 0.15}s ease-in-out infinite` : 'none',
                }}
              />
            ))}
          </div>

          <div className="min-w-0">
            <p className="font-mono truncate" style={{ fontSize: '12px', color: '#F0EEE8', fontFamily: 'Space Mono, monospace' }}>
              {currentTrack?.title ?? '—'}
            </p>
            {currentTrack?.artist && (
              <p className="font-mono truncate" style={{ fontSize: '10px', color: '#6ECFB8', fontFamily: 'Space Mono, monospace' }}>
                {currentTrack.artist}
              </p>
            )}
          </div>
        </div>

        {/* Track count */}
        <p className="font-mono shrink-0 hidden md:block" style={{ fontSize: '10px', color: '#2A3E3A', fontFamily: 'Space Mono, monospace' }}>
          {String(currentIndex + 1).padStart(2, '0')} / {String(tracks.length).padStart(2, '0')}
        </p>

        {/* Playlist toggle */}
        <button
          onClick={() => setPlaylistOpen(!playlistOpen)}
          className="cursor-pointer transition-colors shrink-0 w-7 h-7 flex items-center justify-center"
          style={{
            color: '#6ECFB8',
            backgroundColor: playlistOpen ? 'rgba(110,207,184,0.12)' : 'transparent',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,207,184,0.14)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = playlistOpen ? 'rgba(110,207,184,0.12)' : 'transparent')}
        >
          <i className="ri-playlist-2-line" style={{ fontSize: '16px' }} />
        </button>
      </div>

      <style>{`
        @keyframes soundbar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }
      `}</style>
    </>
  );
}
