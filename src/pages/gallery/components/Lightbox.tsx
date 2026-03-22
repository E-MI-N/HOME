import { useEffect } from 'react';
import { GalleryItem } from '../../../mocks/gallery';

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function Lightbox({ item, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(5, 3, 12, 0.94)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border transition-colors duration-200 cursor-pointer z-10"
        style={{ borderColor: 'rgba(42,32,80,0.6)', color: '#A8A0BC', borderRadius: '2px' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,212,160,0.4)';
          (e.currentTarget as HTMLElement).style.color = '#E8D4A0';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(42,32,80,0.6)';
          (e.currentTarget as HTMLElement).style.color = '#A8A0BC';
        }}
        onClick={onClose}
        aria-label="닫기"
      >
        <i className="ri-close-line" />
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border transition-all duration-200 cursor-pointer z-10"
          style={{ borderColor: 'rgba(42,32,80,0.6)', color: '#A8A0BC', borderRadius: '2px' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,212,160,0.4)';
            (e.currentTarget as HTMLElement).style.color = '#E8D4A0';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(42,32,80,0.6)';
            (e.currentTarget as HTMLElement).style.color = '#A8A0BC';
          }}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="이전"
        >
          <i className="ri-arrow-left-line" />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border transition-all duration-200 cursor-pointer z-10"
          style={{ borderColor: 'rgba(42,32,80,0.6)', color: '#A8A0BC', borderRadius: '2px' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,212,160,0.4)';
            (e.currentTarget as HTMLElement).style.color = '#E8D4A0';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(42,32,80,0.6)';
            (e.currentTarget as HTMLElement).style.color = '#A8A0BC';
          }}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="다음"
        >
          <i className="ri-arrow-right-line" />
        </button>
      )}

      {/* Content */}
      <div
        className="max-w-4xl w-full flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.title}
          className="max-h-[70vh] max-w-full object-contain"
          style={{ border: '1px solid rgba(42,32,80,0.5)' }}
        />
        <div className="text-center">
          <h3 className="font-serif text-lg mb-1" style={{ color: '#E8D4A0' }}>
            {item.title}
          </h3>
          <p className="text-sm mb-3" style={{ color: '#A8A0BC' }}>
            {item.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
