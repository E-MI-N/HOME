import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../../../hooks/useInView';
import { galleryItems } from '../../../mocks/gallery';

const FEATURED_IDS = [1, 4, 6, 9, 3, 7];

export default function ImageShowcase() {
  const { ref, inView } = useInView();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const featured = galleryItems.filter(g => FEATURED_IDS.includes(g.id));

  return (
    <section
      ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} px-6 md:px-10 py-14`}
      style={{ borderTop: '1px solid rgba(110,207,184,0.1)' }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div style={{ width: '18px', height: '1px', backgroundColor: '#6ECFB8' }} />
          <span className="font-mono text-xs" style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em' }}>
            IMAGE_ARCHIVE ◈ FEATURED
          </span>
        </div>
        <Link
          to="/gallery"
          className="font-mono text-xs cursor-pointer transition-colors duration-200 whitespace-nowrap"
          style={{ color: '#585854', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#6ECFB8')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#585854')}
        >
          VIEW_ALL →
        </Link>
      </div>

      {/* Image grid — masonry-ish layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {featured.map((item, i) => (
          <button
            key={item.id}
            className="relative overflow-hidden cursor-pointer block text-left w-full"
            style={{
              aspectRatio: i === 0 ? '1/1.2' : i === 2 ? '1/0.7' : '1/1',
              border: '1px solid rgba(110,207,184,0.15)',
              transition: 'border-color 0.2s',
              borderColor: hoveredId === item.id ? 'rgba(110,207,184,0.5)' : 'rgba(110,207,184,0.15)',
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setLightboxUrl(item.url)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover object-top transition-transform duration-500"
              style={{ transform: hoveredId === item.id ? 'scale(1.05)' : 'scale(1)' }}
            />
            {/* HUD corner marks */}
            {['top-1 left-1', 'bottom-1 right-1'].map((pos, ci) => (
              <div
                key={ci}
                className={`absolute w-2.5 h-2.5 ${pos}`}
                style={{
                  borderTop: ci === 0 ? '1px solid rgba(110,207,184,0.5)' : 'none',
                  borderBottom: ci === 1 ? '1px solid rgba(110,207,184,0.5)' : 'none',
                  borderLeft: ci === 0 ? '1px solid rgba(110,207,184,0.5)' : 'none',
                  borderRight: ci === 1 ? '1px solid rgba(110,207,184,0.5)' : 'none',
                }}
              />
            ))}
            {/* Overlay on hover */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-200"
              style={{
                background: 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 60%)',
                opacity: hoveredId === item.id ? 1 : 0,
              }}
            >
              <p className="font-mono" style={{ color: '#F0EEE8', fontFamily: 'Space Mono, monospace', fontSize: '9px', lineHeight: 1.5 }}>
                {item.title}
              </p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {item.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '7px',
                    color: '#6ECFB8', border: '1px solid rgba(110,207,184,0.3)',
                    padding: '1px 5px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Index label */}
            <div className="absolute top-2 right-2">
              <span className="font-mono" style={{ color: 'rgba(110,207,184,0.4)', fontFamily: 'Space Mono, monospace', fontSize: '7px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(8,8,8,0.95)' }}
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            {/* HUD corners */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 ${pos}`}
                style={{
                  borderTop: i < 2 ? '1px solid #6ECFB8' : 'none',
                  borderBottom: i >= 2 ? '1px solid #6ECFB8' : 'none',
                  borderLeft: i % 2 === 0 ? '1px solid #6ECFB8' : 'none',
                  borderRight: i % 2 === 1 ? '1px solid #6ECFB8' : 'none',
                }}
              />
            ))}
            <img src={lightboxUrl} alt="" className="w-full h-auto object-contain" style={{ maxHeight: '80vh' }} />
            <button
              className="absolute top-3 right-3 font-mono text-xs cursor-pointer whitespace-nowrap"
              style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace' }}
              onClick={() => setLightboxUrl(null)}
            >
              [CLOSE]
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
