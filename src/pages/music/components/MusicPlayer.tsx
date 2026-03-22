import type { MusicTrack } from '../../../types/music';

interface Props {
  track: MusicTrack | null;
  onEnded?: () => void;
}

export default function MusicPlayer({ track, onEnded }: Props) {
  if (!track) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center"
        style={{ aspectRatio: '16/9', backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C' }}
      >
        <p className="font-mono text-xs" style={{ color: '#2A3E3A', letterSpacing: '0.2em' }}>
          SELECT A TRACK
        </p>
        <div className="flex items-center gap-1.5 mt-3">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="w-0.5 h-3"
              style={{
                backgroundColor: '#2A3E3A',
                animation: `soundbar 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ border: '1px solid #1C1C1C' }}>
      <iframe
        key={track.video_id}
        src={`https://www.youtube.com/embed/${track.video_id}?autoplay=1&rel=0&modestbranding=1`}
        title={track.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none' }}
        onEnded={onEnded}
      />
    </div>
  );
}
