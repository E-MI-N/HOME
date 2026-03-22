import { useMemo } from 'react';

interface StarFieldProps {
  count?: number;
  className?: string;
}

export default function StarField({ count = 90, className = '' }: StarFieldProps) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: ((i * 9301 + 49297) % 233280) / 233280 * 100,
      y: ((i * 7793 + 34567) % 233280) / 233280 * 100,
      opacity: 0.06 + ((i * 4231) % 100) / 100 * 0.28,
      size: i % 11 === 0 ? 2 : 1,
    })),
    [count]
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: '#F0EEE8',
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
