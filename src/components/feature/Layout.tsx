import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MusicBar from './MusicBar';
import { MusicProvider } from '../../contexts/MusicContext';

// Singleton AudioContext + pre-built click buffer
let _ctx: AudioContext | null = null;
let _clickBuf: AudioBuffer | null = null;

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === 'closed') {
    _ctx = new AudioContext();
  }
  return _ctx;
}

function buildClickBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  // 두 번의 짧은 타격 — 딸(attack) + 깍(release)
  const len = Math.floor(sr * 0.045);
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);

  const hit1 = 0;                           // 첫 번째 타격 시작 샘플
  const hit2 = Math.floor(sr * 0.018);      // 두 번째 타격 시작 샘플 (18ms 뒤)

  for (let i = 0; i < len; i++) {
    let v = 0;

    // --- 첫 번째 타격 (딸) ---
    if (i >= hit1) {
      const t = (i - hit1) / sr;
      const env = Math.exp(-t * 380);       // 극도로 짧은 decay
      // 노이즈 + 고주파 tone
      v += (Math.random() * 2 - 1) * env * 0.9;
      v += Math.sin(2 * Math.PI * 1800 * t) * env * 0.4;
      v += Math.sin(2 * Math.PI * 900 * t) * env * 0.2;
    }

    // --- 두 번째 타격 (깍) — 살짝 낮고 짧게 ---
    if (i >= hit2) {
      const t2 = (i - hit2) / sr;
      const env2 = Math.exp(-t2 * 600);    // 더 빠른 decay
      v += (Math.random() * 2 - 1) * env2 * 0.55;
      v += Math.sin(2 * Math.PI * 1200 * t2) * env2 * 0.25;
    }

    d[i] = v;
  }
  return buf;
}

function playClickSound() {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    if (!_clickBuf) {
      _clickBuf = buildClickBuffer(ctx);
    }

    const src = ctx.createBufferSource();
    src.buffer = _clickBuf;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);

    // 저음 컷 — 딸깍 느낌의 고주파 성분 살리기
    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = 400;

    // 피크 EQ로 1~2kHz 약간 부스트 → 선명한 딸깍
    const peakFilter = ctx.createBiquadFilter();
    peakFilter.type = 'peaking';
    peakFilter.frequency.value = 1500;
    peakFilter.gain.value = 6;
    peakFilter.Q.value = 1.2;

    src.connect(hpFilter);
    hpFilter.connect(peakFilter);
    peakFilter.connect(gain);
    gain.connect(ctx.destination);
    src.start(ctx.currentTime);
  } catch (e) {
    console.warn('click sound error:', e);
  }
}

export default function Layout() {
  const { pathname } = useLocation();
  const didInit = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      // 텍스트 입력 요소 클릭 시엔 소리 skip — 포커스 방해 방지
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target.getAttribute('contenteditable') !== null
      ) return;
      playClickSound();
    };

    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <MusicProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#080808', color: '#F0EEE8' }}>
        <div className="scanlines" />
        <Navbar />
        <main style={{ paddingBottom: '52px' }}>
          <Outlet />
        </main>
        <Footer />
        <MusicBar />
      </div>
    </MusicProvider>
  );
}
