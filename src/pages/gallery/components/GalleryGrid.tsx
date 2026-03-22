import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Lightbox from './Lightbox';
import { useInView } from '../../../hooks/useInView';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  date: string;
  url: string;
  is_landscape: boolean;
  published: boolean;
  display_order: number;
}

function GalleryCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} group cursor-pointer overflow-hidden`}
      style={{
        transitionDelay: `${(index % 6) * 55}ms`,
        gridColumn: item.is_landscape ? 'span 2' : 'span 1',
        border: '1px solid #1C1C1C',
      }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: item.is_landscape ? '16/9' : '1/1' }}>
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 font-mono text-xs" style={{ color: 'rgba(240,238,232,0.3)', fontSize: '10px' }}>
          {String(item.display_order).padStart(2, '0')}
        </div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
          style={{ background: 'linear-gradient(transparent 30%, rgba(8,8,8,0.92))' }}
        >
          <p className="font-display text-base tracking-wide" style={{ color: '#F0EEE8' }}>{item.title}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {(item.tags ?? []).slice(0, 3).map((tag) => (
              <span key={tag} className="tag-pill" style={{ fontSize: '10px' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTag, setActiveTag] = useState('전체');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });
      setItems(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const allTags = ['전체', ...Array.from(new Set(items.flatMap((i) => i.tags ?? [])))];
  const filtered = activeTag === '전체' ? items : items.filter((i) => (i.tags ?? []).includes(activeTag));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-mono text-xs" style={{ color: '#383834' }}>LOADING...</p>
      </div>
    );
  }

  return (
    <div>
      <div ref={ref} className={`anim-element ${inView ? 'is-visible' : ''} flex flex-wrap gap-2 mb-10`}>
        {allTags.slice(0, 14).map((tag) => (
          <button key={tag} className={`tag-pill cursor-pointer ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}>
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {filtered.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} onClick={() => setLightboxIndex(i)} />
        ))}
      </div>

      <p className="font-mono text-xs text-center mt-8" style={{ color: '#383834' }}>
        {String(filtered.length).padStart(2, '0')} WORKS
      </p>

      {lightboxIndex !== null && (
        <Lightbox
          item={{ ...filtered[lightboxIndex], isLandscape: filtered[lightboxIndex].is_landscape }}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i))}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < filtered.length - 1}
        />
      )}
    </div>
  );
}
