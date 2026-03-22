import GalleryGrid from './components/GalleryGrid';
import StarField from '../../components/base/StarField';

export default function GalleryPage() {
  return (
    <div>
      <div
        className="relative pt-28 pb-12 overflow-hidden"
        style={{ borderBottom: '1px solid #1C1C1C', backgroundColor: '#080808' }}
      >
        <StarField count={40} />
        <div className="relative px-6 md:px-10 z-10">
          <p className="font-mono text-xs mb-4 flex items-center gap-3" style={{ color: '#585854' }}>
            <span style={{ display: 'inline-block', width: '20px', height: '1px', backgroundColor: '#C8A870' }} />
            02 / GALLERY
          </p>
          <h1
            className="font-display leading-none uppercase"
            style={{ fontSize: 'clamp(60px, 10vw, 140px)', color: '#F0EEE8', letterSpacing: '-0.01em' }}
          >
            GALLERY
          </h1>
          <p className="font-serif italic mt-2" style={{ color: '#585854' }}>
            Illustrations &amp; Artwork · 갤러리
          </p>
        </div>
      </div>
      <div className="px-6 md:px-10 py-16">
        <GalleryGrid />
      </div>
    </div>
  );
}
