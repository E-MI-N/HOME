import { useState, useEffect } from 'react';
import CharacterInfo from './components/CharacterInfo';
import CharacterStats from './components/CharacterStats';
import { useInView } from '../../hooks/useInView';
import StarField from '../../components/base/StarField';
import { supabase } from '../../lib/supabase';
import type { Character } from '../../types/character';

function PersonalitySection({ character }: { character: Character }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`anim-element ${inView ? 'is-visible' : ''} space-y-8`}>
      {character.personality && (
        <div>
          <p className="font-mono text-sm mb-5" style={{ color: '#585854' }}>PERSONALITY</p>
          {character.personality.split('\n\n').map((para, i) => (
            <p key={i} className="text-base leading-[1.9] mb-4" style={{ color: '#808078' }}>{para}</p>
          ))}
        </div>
      )}
      {character.background && (
        <div>
          <p className="font-mono text-sm mb-5" style={{ color: '#585854' }}>BACKGROUND</p>
          {character.background.split('\n\n').map((para, i) => (
            <p key={i} className="text-base leading-[1.9] mb-4" style={{ color: '#808078' }}>{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { ref, inView } = useInView();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      const list = data ?? [];
      setCharacters(list);
      if (list.length > 0) setSelected(list[0]);
      setLoading(false);
    };
    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080808' }}>
        <p className="font-mono text-xs" style={{ color: '#383834' }}>LOADING...</p>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080808' }}>
        <p className="font-mono text-xs" style={{ color: '#383834' }}>캐릭터가 없어요.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div
        className="relative pt-28 pb-12 overflow-hidden"
        style={{ borderBottom: '1px solid #1C1C1C', backgroundColor: '#080808' }}
      >
        <StarField count={40} />
        <div className="relative px-6 md:px-10 z-10">
          <p className="font-mono text-sm mb-4 flex items-center gap-3" style={{ color: '#585854' }}>
            <span style={{ display: 'inline-block', width: '20px', height: '1px', backgroundColor: '#6ECFB8' }} />
            01 / PROFILE
          </p>
          <h1
            className="font-display leading-none uppercase"
            style={{ fontSize: 'clamp(60px, 10vw, 140px)', color: '#F0EEE8', letterSpacing: '-0.01em' }}
          >
            PROFILE
          </h1>
          <p className="font-serif italic mt-2" style={{ color: '#585854' }}>
            Character Profile · 캐릭터 프로필
          </p>
        </div>
      </div>

      {/* Character Selector (if multiple) */}
      {characters.length > 1 && (
        <div className="px-6 md:px-10 pt-8 pb-0" style={{ borderBottom: '1px solid #1C1C1C' }}>
          <div className="flex gap-0 overflow-x-auto">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelected(char)}
                className="relative flex items-center gap-3 px-5 py-4 text-left cursor-pointer transition-colors whitespace-nowrap flex-shrink-0"
                style={{
                  borderBottom: char.id === selected?.id ? '1px solid #6ECFB8' : '1px solid transparent',
                  color: char.id === selected?.id ? '#F0EEE8' : '#585854',
                  backgroundColor: 'transparent',
                  marginBottom: '-1px',
                }}
              >
                {char.image && (
                  <div style={{ width: '28px', height: '36px', border: '1px solid #1C1C1C', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={char.image} alt={char.name} className="w-full h-full object-cover object-top" />
                  </div>
                )}
                <div>
                  <p className="text-base">{char.name}</p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: '#383834', fontSize: '12px' }}>{char.name_en}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 md:px-10 py-16">
        {/* Portrait + Info */}
        <div className="flex flex-col lg:flex-row gap-14 mb-16">
          {/* Portrait */}
          <div
            ref={ref}
            className={`anim-element ${inView ? 'is-visible' : ''} flex-shrink-0`}
          >
            <div
              className="relative overflow-hidden"
              style={{ width: '280px', height: '360px', border: '1px solid #1C1C1C' }}
            >
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Film corner marks */}
              {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
                <div key={i} className={`absolute w-3 h-3 ${pos}`} style={{
                  borderTop: i < 2 ? '1px solid rgba(110, 207, 184, 0.4)' : 'none',
                  borderBottom: i >= 2 ? '1px solid rgba(110, 207, 184, 0.4)' : 'none',
                  borderLeft: i % 2 === 0 ? '1px solid rgba(110, 207, 184, 0.4)' : 'none',
                  borderRight: i % 2 === 1 ? '1px solid rgba(110, 207, 184, 0.4)' : 'none',
                }} />
              ))}
              <div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{ background: 'linear-gradient(transparent, rgba(8,8,8,0.9))' }}
              >
                <p className="font-display text-lg tracking-widest" style={{ color: '#F0EEE8' }}>
                  {selected.name_en.toUpperCase()}
                </p>
                <p className="font-mono text-xs mt-0.5" style={{ color: '#808078' }}>
                  {selected.title}
                </p>
              </div>
            </div>
          </div>
          {/* Info */}
          <div className="flex-1"><CharacterInfo character={selected} /></div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#1C1C1C', marginBottom: '64px' }} />

        {/* Personality + Stats */}
        <div className="flex flex-col lg:flex-row gap-14">
          <div className="flex-1"><PersonalitySection character={selected} /></div>
          <div className="lg:w-72 flex-shrink-0"><CharacterStats character={selected} /></div>
        </div>
      </div>
    </div>
  );
}
