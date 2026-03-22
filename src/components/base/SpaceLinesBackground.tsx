const MINT = '#6ECFB8';

interface SatProps { x: number; y: number; rot?: number; sz?: number; op?: number; }

function SatelliteShape({ x, y, rot = 0, sz = 1, op = 0.38 }: SatProps) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${sz})`} opacity={op}>
      {/* Body */}
      <rect x="-7" y="-9" width="14" height="18" fill="none" stroke={MINT} strokeWidth="1.1" rx="1" />
      <line x1="-7" y1="1" x2="7" y2="1" stroke={MINT} strokeWidth="0.5" opacity="0.7" />
      {/* Left solar panel */}
      <rect x="-36" y="-4" width="27" height="8" fill="none" stroke={MINT} strokeWidth="0.9" />
      <line x1="-27" y1="-4" x2="-27" y2="4" stroke={MINT} strokeWidth="0.5" opacity="0.7" />
      <line x1="-18" y1="-4" x2="-18" y2="4" stroke={MINT} strokeWidth="0.5" opacity="0.7" />
      {/* Right solar panel */}
      <rect x="9" y="-4" width="27" height="8" fill="none" stroke={MINT} strokeWidth="0.9" />
      <line x1="18" y1="-4" x2="18" y2="4" stroke={MINT} strokeWidth="0.5" opacity="0.7" />
      <line x1="27" y1="-4" x2="27" y2="4" stroke={MINT} strokeWidth="0.5" opacity="0.7" />
      {/* Antenna */}
      <line x1="0" y1="-9" x2="0" y2="-21" stroke={MINT} strokeWidth="0.8" />
      <circle cx="0" cy="-23" r="2.2" fill="none" stroke={MINT} strokeWidth="0.8" />
      <line x1="-5" y1="-17" x2="5" y2="-17" stroke={MINT} strokeWidth="0.7" />
    </g>
  );
}

export default function SpaceLinesBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        width="100%" height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="slbg-p1"><circle cx="1310" cy="60" r="270" /></clipPath>
          <clipPath id="slbg-p2"><circle cx="110" cy="820" r="100" /></clipPath>
          <clipPath id="slbg-p3"><circle cx="680" cy="610" r="48" /></clipPath>
        </defs>

        {/* ===== PLANET 1 — large, top-right ===== */}
        <g clipPath="url(#slbg-p1)" opacity="0.32">
          <ellipse cx="1310" cy="-110" rx="255" ry="55" fill="none" stroke={MINT} strokeWidth="1.0" />
          <ellipse cx="1310" cy="60"   rx="270" ry="65" fill="none" stroke={MINT} strokeWidth="1.0" />
          <ellipse cx="1310" cy="230" rx="240" ry="55" fill="none" stroke={MINT} strokeWidth="0.9" />
          <ellipse cx="1310" cy="60"   rx="270" ry="30" fill="none" stroke={MINT} strokeWidth="0.7" />
          <line x1="1040" y1="60" x2="1580" y2="60" stroke={MINT} strokeWidth="1.2" />
          <ellipse cx="1310" cy="60" rx="95"  ry="270" fill="none" stroke={MINT} strokeWidth="0.9" />
          <ellipse cx="1310" cy="60" rx="190" ry="270" fill="none" stroke={MINT} strokeWidth="0.8" />
          <line x1="1310" y1="-210" x2="1310" y2="330" stroke={MINT} strokeWidth="1.2" />
        </g>
        <circle cx="1310" cy="60" r="270" fill="none" stroke={MINT} strokeWidth="1.4" opacity="0.45" />
        <ellipse cx="1310" cy="60" rx="380" ry="85" fill="none" stroke={MINT} strokeWidth="0.8" opacity="0.18"
          transform="rotate(-22 1310 60)" />
        <circle cx="1005" cy="138" r="5" fill="none" stroke={MINT} strokeWidth="1.0" opacity="0.30" />

        {/* ===== PLANET 2 — small, bottom-left ===== */}
        <g clipPath="url(#slbg-p2)" opacity="0.30">
          <ellipse cx="110" cy="775" rx="90"  ry="22" fill="none" stroke={MINT} strokeWidth="0.9" />
          <ellipse cx="110" cy="820" rx="100" ry="25" fill="none" stroke={MINT} strokeWidth="0.9" />
          <ellipse cx="110" cy="865" rx="88"  ry="20" fill="none" stroke={MINT} strokeWidth="0.8" />
          <ellipse cx="110" cy="820" rx="38"  ry="100" fill="none" stroke={MINT} strokeWidth="0.8" />
          <line x1="110" y1="720" x2="110" y2="920" stroke={MINT} strokeWidth="0.9" />
        </g>
        <circle cx="110" cy="820" r="100" fill="none" stroke={MINT} strokeWidth="1.2" opacity="0.30" />
        <ellipse cx="110" cy="820" rx="145" ry="36" fill="none" stroke={MINT} strokeWidth="0.7" opacity="0.16"
          transform="rotate(10 110 820)" />

        {/* ===== PLANET 3 — tiny, mid ===== */}
        <g clipPath="url(#slbg-p3)" opacity="0.28">
          <ellipse cx="680" cy="598" rx="44" ry="11" fill="none" stroke={MINT} strokeWidth="0.8" />
          <ellipse cx="680" cy="610" rx="48" ry="12" fill="none" stroke={MINT} strokeWidth="0.8" />
          <ellipse cx="680" cy="610" rx="22" ry="48" fill="none" stroke={MINT} strokeWidth="0.7" />
          <line x1="680" y1="562" x2="680" y2="658" stroke={MINT} strokeWidth="0.8" />
        </g>
        <circle cx="680" cy="610" r="48" fill="none" stroke={MINT} strokeWidth="1.0" opacity="0.28" />
        <ellipse cx="680" cy="610" rx="72" ry="18" fill="none" stroke={MINT} strokeWidth="0.6" opacity="0.16"
          transform="rotate(-14 680 610)" />

        {/* ===== SATELLITE ORBIT ARCS (dashed) ===== */}
        <path d="M 60 380 A 360 240 -15 0 1 640 55"
          fill="none" stroke={MINT} strokeWidth="0.7" strokeDasharray="7 5" opacity="0.18" />
        <path d="M 820 200 A 400 300 10 0 1 1390 720"
          fill="none" stroke={MINT} strokeWidth="0.6" strokeDasharray="7 5" opacity="0.15" />
        <path d="M 600 690 A 250 100 -30 0 1 1040 860"
          fill="none" stroke={MINT} strokeWidth="0.6" strokeDasharray="6 5" opacity="0.14" />

        {/* ===== SATELLITES ===== */}
        <SatelliteShape x={350} y={185} rot={18}  sz={1.2} op={0.42} />
        <SatelliteShape x={1105} y={475} rot={-28} sz={0.9} op={0.36} />
        <SatelliteShape x={820}  y={790} rot={42}  sz={0.75} op={0.32} />

        {/* ===== CROSS / SPARKLE STARS ===== */}
        {([
          { x: 185, y: 140, s: 8 }, { x: 440, y: 75,  s: 6 },
          { x: 830, y: 190, s: 7 }, { x: 290, y: 490, s: 6 },
          { x: 565, y: 330, s: 5 }, { x: 1060,y: 390, s: 6 },
          { x: 155, y: 290, s: 5 }, { x: 920, y: 110, s: 5 },
          { x: 490, y: 690, s: 6 }, { x: 1210,y: 680, s: 5 },
          { x: 75,  y: 570, s: 6 }, { x: 1390,y: 480, s: 5 },
          { x: 740, y: 430, s: 4 }, { x: 340, y: 250, s: 5 },
          { x: 1050,y: 220, s: 4 }, { x: 880, y: 750, s: 5 },
          { x: 620, y: 180, s: 4 }, { x: 1330,y: 340, s: 4 },
        ] as { x: number; y: number; s: number }[]).map((st, i) => (
          <g key={i} transform={`translate(${st.x},${st.y})`} opacity={st.s >= 7 ? 0.50 : st.s >= 5 ? 0.38 : 0.28}>
            <line x1={-st.s} y1="0" x2={st.s} y2="0" stroke="#F0EEE8" strokeWidth="1.0" />
            <line x1="0" y1={-st.s} x2="0" y2={st.s} stroke="#F0EEE8" strokeWidth="1.0" />
            {st.s >= 5 && (
              <>
                <line x1={-st.s * 0.65} y1={-st.s * 0.65} x2={st.s * 0.65} y2={st.s * 0.65} stroke="#F0EEE8" strokeWidth="0.65" />
                <line x1={st.s * 0.65} y1={-st.s * 0.65} x2={-st.s * 0.65} y2={st.s * 0.65} stroke="#F0EEE8" strokeWidth="0.65" />
              </>
            )}
          </g>
        ))}

        {/* ===== COORDINATE MARKERS ===== */}
        {([
          { x: 580, y: 170, r: 5 }, { x: 880, y: 490, r: 4 },
          { x: 1140,y: 290, r: 4 }, { x: 260, y: 620, r: 5 },
        ] as { x: number; y: number; r: number }[]).map((m, i) => (
          <g key={i} transform={`translate(${m.x},${m.y})`} opacity="0.32">
            <line x1={-12} y1="0" x2={12} y2="0" stroke={MINT} strokeWidth="0.9" />
            <line x1="0" y1={-12} x2="0" y2={12} stroke={MINT} strokeWidth="0.9" />
            <circle cx="0" cy="0" r={m.r} fill="none" stroke={MINT} strokeWidth="0.8" />
          </g>
        ))}

        {/* ===== COMET ===== */}
        <g opacity="0.22">
          <line x1="220" y1="55" x2="410" y2="130" stroke="#F0EEE8" strokeWidth="0.8" />
          <circle cx="218" cy="54" r="2.5" fill="#F0EEE8" />
        </g>

        {/* ===== COORDINATE TEXT ===== */}
        <text x="22" y="32" fontFamily="Space Mono, monospace" fontSize="9" fill={MINT} opacity="0.25">
          RA 23h 45m · DEC +45°
        </text>
        <text x="1418" y="875" fontFamily="Space Mono, monospace" fontSize="9" fill={MINT} opacity="0.25" textAnchor="end">
          EPOCH J2000.0
        </text>
      </svg>
    </div>
  );
}
