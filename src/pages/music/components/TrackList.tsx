import type { MusicTrack } from '../../../types/music';

interface Props {
  tracks: MusicTrack[];
  currentId: string | null;
  onSelect: (track: MusicTrack) => void;
}

export default function TrackList({ tracks, currentId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      {tracks.map((track, i) => {
        const isActive = track.id === currentId;
        return (
          <button
            key={track.id}
            onClick={() => onSelect(track)}
            className="w-full text-left px-4 py-3 cursor-pointer transition-all duration-200 whitespace-nowrap group"
            style={{
              backgroundColor: isActive ? 'rgba(110,207,184,0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid #6ECFB8' : '2px solid transparent',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-xs w-5 text-right shrink-0"
                style={{ color: isActive ? '#6ECFB8' : '#2A3E3A' }}
              >
                {isActive ? (
                  <span style={{ animation: 'blink 1.2s step-end infinite' }}>▶</span>
                ) : (
                  `${String(i + 1).padStart(2, '0')}`
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="font-mono text-xs truncate"
                  style={{ color: isActive ? '#F0EEE8' : '#A0A098' }}
                >
                  {track.title}
                </p>
                {track.artist && (
                  <p
                    className="font-mono mt-0.5 truncate"
                    style={{ fontSize: '10px', color: isActive ? '#6ECFB8' : '#585854' }}
                  >
                    {track.artist}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
