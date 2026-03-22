import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SignalReceiver from '../../../components/base/SignalReceiver';

const glitchChars = 'アイウエオカキクケコ#@!%&0123456789ABCDEF';

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let iter = 0;
    const interval = setInterval(() => {
      iter += 1;
      setDisplay(
        text.split('').map((char, idx) => {
          if (idx < iter) return char;
          if (char === ' ') return ' ';
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }).join('')
      );
      if (iter >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <>{display}</>;
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [line1Done, setLine1Done] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setLine1Done(true), 800);
    }, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Signal Receiver */}
      <SignalReceiver />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
        }}
      />

      {/* Main content */}
      <div
        className="relative flex-1 flex flex-col justify-end px-6 md:px-10 pb-16 pt-24"
        style={{ zIndex: 10 }}
      >
        {/* Giant name */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(32px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <h1
            className="leading-[0.9] uppercase select-none"
            style={{
              fontSize: 'clamp(64px, 12vw, 180px)',
              color: '#F0EEE8',
              letterSpacing: '-0.02em',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              textShadow: visible ? '0 0 40px rgba(110,207,184,0.12)' : 'none',
            }}
          >
            {visible && <GlitchText text="M0EBIUS" />}
          </h1>
          <h1
            className="leading-[0.9] uppercase select-none"
            style={{
              fontSize: 'clamp(64px, 12vw, 180px)',
              color: 'transparent',
              letterSpacing: '-0.02em',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              WebkitTextStroke: '1px rgba(110,207,184,0.5)',
            }}
          >
            {line1Done && <GlitchText text="SUNJAE" />}
          </h1>
        </div>

        {/* Sub info */}
        <div
          className="flex flex-col mt-10 gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.7s ease 0.5s',
          }}
        >
          <div className="flex flex-col gap-3">
            {/* ADMIN PANEL BUTTON */}
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 cursor-pointer transition-all duration-200 whitespace-nowrap w-fit"
              style={{
                border: '1px solid rgba(110,207,184,0.6)',
                color: '#6ECFB8',
                fontFamily: 'Space Mono, monospace',
                fontSize: '13px',
                letterSpacing: '0.15em',
                backgroundColor: 'rgba(110,207,184,0.06)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,207,184,0.14)';
                (e.currentTarget as HTMLElement).style.borderColor = '#6ECFB8';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,207,184,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(110,207,184,0.6)';
              }}
            >
              <span>◈</span>
              <span>ADMIN PANEL</span>
              <span style={{ opacity: 0.6 }}>→</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.3, animation: 'scrollBounce 2s ease-in-out infinite' }}
        >
          <span
            style={{
              color: '#6ECFB8',
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.2em',
            }}
          >
            SCROLL
          </span>
          <div style={{ width: '1px', height: '28px', backgroundColor: '#6ECFB8' }} />
        </div>
      </div>
    </section>
  );
}
