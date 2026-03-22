import type { Character } from '../../../types/character';
import { useInView } from '../../../hooks/useInView';

interface Props {
  character: Character;
}

export default function CharacterInfo({ character }: Props) {
  const { ref, inView } = useInView();

  const infoRows = [
    { label: '종족', value: character.race },
    { label: '나이', value: character.age },
    { label: '신장', value: character.height },
    { label: '직업', value: character.class },
    { label: '소속', value: character.affiliation },
    { label: '출신', value: character.origin },
  ];

  return (
    <div ref={ref} className={`anim-element ${inView ? 'is-visible' : ''} space-y-10`}>
      <div>
        <p className="font-mono text-xs mb-5" style={{ color: '#585854' }}>BASIC INFO</p>
        <div className="space-y-0">
          {infoRows.map(({ label, value }, i) => (
            <div
              key={label}
              className={`anim-element ${inView ? 'is-visible' : ''} flex items-start gap-6 py-3`}
              style={{ transitionDelay: `${i * 50}ms`, borderBottom: '1px solid #1C1C1C' }}
            >
              <span className="font-mono text-xs w-16 flex-shrink-0 pt-0.5" style={{ color: '#383834' }}>
                {label}
              </span>
              <span className="text-sm" style={{ color: '#A0A098' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {character.specialty?.length > 0 && (
        <div className={`anim-element ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '320ms' }}>
          <p className="font-mono text-xs mb-4" style={{ color: '#585854' }}>특기</p>
          <div className="flex flex-wrap gap-2">
            {character.specialty.map((s) => (
              <span key={s} className="tag-pill">{s}</span>
            ))}
          </div>
        </div>
      )}

      {character.motto && (
        <div className={`anim-element ${inView ? 'is-visible' : ''}`} style={{ transitionDelay: '380ms' }}>
          <p className="font-mono text-xs mb-4" style={{ color: '#585854' }}>MOTTO</p>
          <blockquote className="font-serif italic text-base leading-relaxed border-l-2 pl-5"
            style={{ borderColor: 'rgba(110, 207, 184, 0.3)', color: 'rgba(110, 207, 184, 0.7)' }}>
            &ldquo;{character.motto}&rdquo;
          </blockquote>
        </div>
      )}
    </div>
  );
}
