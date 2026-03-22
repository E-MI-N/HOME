import type { Character } from '../../../types/character';
import { useInView } from '../../../hooks/useInView';

interface Props {
  character: Character;
}

const statNames: Record<string, string> = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
const statLabels: Record<string, string> = { str: '근력', dex: '민첩', con: '건강', int: '지능', wis: '지혜', cha: '매력' };

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function CharacterStats({ character }: Props) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className={`anim-element ${inView ? 'is-visible' : ''} space-y-10`}>
      {character.stats && Object.keys(character.stats).length > 0 && (
        <div>
          <p className="font-mono text-xs mb-5" style={{ color: '#585854' }}>STATS · D&D 5E</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(character.stats).map(([key, val], i) => {
              const isHigh = (val as number) >= 16;
              return (
                <div key={key}
                  className={`anim-element ${inView ? 'is-visible' : ''} flex flex-col items-center py-4 border transition-all duration-300 hover:scale-105`}
                  style={{
                    transitionDelay: `${i * 50}ms`,
                    border: `1px solid ${isHigh ? 'rgba(110, 207, 184, 0.25)' : '#1C1C1C'}`,
                    backgroundColor: isHigh ? 'rgba(110, 207, 184, 0.05)' : 'transparent',
                  }}>
                  <p className="font-mono text-xs mb-2" style={{ color: '#383834' }}>{statNames[key]}</p>
                  <p className="font-display text-2xl" style={{ color: isHigh ? '#6ECFB8' : '#A0A098' }}>{val as number}</p>
                  <p className="font-mono text-xs mt-1" style={{ color: isHigh ? 'rgba(110,207,184,0.6)' : '#383834' }}>
                    {getModifier(val as number)}
                  </p>
                  <p className="font-mono text-xs mt-1" style={{ color: '#383834', fontSize: '10px' }}>{statLabels[key]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {character.abilities?.length > 0 && (
        <div>
          <p className="font-mono text-xs mb-5" style={{ color: '#585854' }}>ABILITIES</p>
          <div className="space-y-3">
            {character.abilities.map((a, i) => (
              <div key={a.name}
                className={`anim-element ${inView ? 'is-visible' : ''} p-4 border`}
                style={{ transitionDelay: `${320 + i * 60}ms`, border: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(110,207,184,0.6)', flexShrink: 0, display: 'block' }} />
                  <p className="text-sm" style={{ color: '#6ECFB8' }}>{a.name}</p>
                  <p className="font-mono text-xs" style={{ color: '#383834', fontSize: '10px' }}>{a.nameEn}</p>
                </div>
                <p className="text-xs leading-relaxed pl-4" style={{ color: '#585854' }}>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
