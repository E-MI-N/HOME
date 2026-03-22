import { useRef } from 'react';

export default function SignalReceiver() {
  const sweepRef = useRef<SVGLineElement>(null);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center" style={{ zIndex: 1 }}>
      <svg
        width="700"
        height="700"
        viewBox="-350 -350 700 700"
        style={{ opacity: 0.55, position: 'absolute' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6ECFB8" stopOpacity="0.0" />
            <stop offset="70%" stopColor="#6ECFB8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6ECFB8" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="sweepLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ECFB8" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#6ECFB8" stopOpacity="0.9" />
          </linearGradient>
          <clipPath id="radarClip">
            <circle cx="0" cy="0" r="280" />
          </clipPath>
        </defs>

        {/* Outer border circle */}
        <circle cx="0" cy="0" r="280" fill="none" stroke="#6ECFB8" strokeWidth="0.8" opacity="0.7" />

        {/* Concentric range rings */}
        {[70, 140, 210, 280].map((r, i) => (
          <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#6ECFB8" strokeWidth="0.5"
            strokeDasharray={i % 2 === 1 ? '4 8' : 'none'}
            opacity={0.55 - i * 0.05}
          />
        ))}

        {/* Cross hairs */}
        <line x1="-280" y1="0" x2="280" y2="0" stroke="#6ECFB8" strokeWidth="0.5" opacity="0.45" />
        <line x1="0" y1="-280" x2="0" y2="280" stroke="#6ECFB8" strokeWidth="0.5" opacity="0.45" />
        <line x1="-198" y1="-198" x2="198" y2="198" stroke="#6ECFB8" strokeWidth="0.4" opacity="0.25" />
        <line x1="198" y1="-198" x2="-198" y2="198" stroke="#6ECFB8" strokeWidth="0.4" opacity="0.25" />

        {/* Radar sweep sector */}
        <g clipPath="url(#radarClip)">
          <path d="M0,0 L280,0 A280,280 0 0,1 240,-148 Z" fill="#6ECFB8" opacity="0.12">
            <animateTransform attributeName="transform" type="rotate"
              values="0;360" dur="4s" repeatCount="indefinite" />
          </path>
          {/* Sweep line */}
          <line ref={sweepRef} x1="0" y1="0" x2="280" y2="0" stroke="#6ECFB8" strokeWidth="1.6" opacity="0.85">
            <animateTransform attributeName="transform" type="rotate"
              values="0;360" dur="4s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Blip dots */}
        {[
          { x: 110, y: -60, delay: '0.8s' },
          { x: -140, y: 80, delay: '2.1s' },
          { x: 50, y: 190, delay: '3.4s' },
          { x: -80, y: -170, delay: '1.5s' },
          { x: 200, y: 100, delay: '0.3s' },
        ].map((blip, i) => (
          <g key={i}>
            <circle cx={blip.x} cy={blip.y} r="3.5" fill="#6ECFB8" opacity="0">
              <animate attributeName="opacity" values="0;1;0.6;0" dur="2s" begin={blip.delay} repeatCount="indefinite" />
            </circle>
            <circle cx={blip.x} cy={blip.y} r="7" fill="none" stroke="#6ECFB8" strokeWidth="1" opacity="0">
              <animate attributeName="opacity" values="0;0.7;0" dur="2s" begin={blip.delay} repeatCount="indefinite" />
              <animate attributeName="r" values="4;14" dur="2s" begin={blip.delay} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Center dot */}
        <circle cx="0" cy="0" r="3.5" fill="#6ECFB8" opacity="1" />
        <circle cx="0" cy="0" r="7" fill="none" stroke="#6ECFB8" strokeWidth="0.8" opacity="0.6" />
      </svg>

      {/* Expanding signal rings from center */}
      <div className="absolute" style={{ width: '600px', height: '600px' }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: 0,
              margin: 'auto',
              width: '60px',
              height: '60px',
              border: '1.5px solid rgba(110,207,184,0.7)',
              animation: `signalExpand 3.6s ease-out ${i * 0.9}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes signalExpand {
          0%   { width: 40px;  height: 40px;  opacity: 0.9; }
          100% { width: 560px; height: 560px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
