import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ArchiveEntry } from '../../types/archive';
import ArchiveCard from './components/ArchiveCard';
import { useInView } from '../../hooks/useInView';
import StarField from '../../components/base/StarField';

const ALL_CAT = '전체';

export default function ArchivePage() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(ALL_CAT);
  const { ref, inView } = useInView();

  useEffect(() => {
    supabase
      .from('archive_entries')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setEntries(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = [ALL_CAT, ...Array.from(new Set(entries.map((e) => e.category)))];

  const filtered = activeCategory === ALL_CAT
    ? entries
    : entries.filter((e) => e.category === activeCategory);

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
            03 / ARCHIVE
          </p>
          <h1
            className="font-display leading-none uppercase"
            style={{ fontSize: 'clamp(60px, 10vw, 140px)', color: '#F0EEE8', letterSpacing: '-0.01em' }}
          >
            ARCHIVE
          </h1>
          <p className="font-serif italic mt-2" style={{ color: '#585854' }}>
            Stories, Essays &amp; Records · 아카이브
          </p>
        </div>
      </div>

      <div className="px-6 md:px-10 py-16">
        {loading ? (
          <div className="py-32 text-center font-mono text-sm" style={{ color: '#383834' }}>LOADING...</div>
        ) : (
          <>
            {/* Category filter */}
            <div ref={ref} className={`anim-element ${inView ? 'is-visible' : ''} flex flex-wrap gap-2 mb-10`}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`tag-pill cursor-pointer ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Count */}
            <div className="flex items-center gap-4 mb-8">
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1C1C1C' }} />
              <p className="font-mono text-sm flex-shrink-0" style={{ color: '#383834' }}>
                {String(filtered.length).padStart(2, '0')} RECORDS
              </p>
            </div>

            {/* Archive list */}
            <div className="space-y-3">
              {filtered.map((entry, i) => (
                <ArchiveCard key={entry.id} entry={entry} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
