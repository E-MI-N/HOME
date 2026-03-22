import { Link } from 'react-router-dom';
import { useInView } from '../../../hooks/useInView';

const sections = [
  {
    num: '01',
    label: 'PROFILE',
    ko: '프로필',
    desc: '캐릭터 상세 설정 및 능력치',
    path: '/profile',
    tag: 'CHARACTER_DATA',
  },
  {
    num: '02',
    label: 'GALLERY',
    ko: '갤러리',
    desc: '일러스트 & 아트워크',
    path: '/gallery',
    tag: 'IMAGE_ARCHIVE',
  },
  {
    num: '03',
    label: 'ARCHIVE',
    ko: '아카이브',
    desc: '독백, 에세이, 기록들',
    path: '/archive',
    tag: 'TEXT_LOG',
  },
  {
    num: '04',
    label: 'TRPG',
    ko: 'TRPG',
    desc: '캠페인 & 세션 기록',
    path: '/trpg',
    tag: 'SESSION_LOG',
  },
];

export default function SectionTeaser() {
  const { ref, inView } = useInView();

  return (
    <section className="px-6 md:px-10 py-10" style={{ borderTop: '1px solid rgba(110,207,184,0.1)' }}>
      {/* Header */}
      <div
        ref={ref}
        className={`anim-element ${inView ? 'is-visible' : ''} flex items-center gap-3 mb-6`}
      >
        <span className="font-mono" style={{ color: '#384A45', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>{'// '}</span>
        <span className="font-mono" style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em' }}>
          NAVIGATION_SECTORS
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(110,207,184,0.1)' }} />
        <span className="font-mono" style={{ color: '#2A3E3A', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
          04_NODES
        </span>
      </div>

      {/* Section rows */}
      {sections.map((s, i) => (
        <div
          key={s.path}
          className={`anim-element ${inView ? 'is-visible' : ''}`}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <Link
            to={s.path}
            className="group flex items-center gap-4 md:gap-8 py-4 transition-all duration-200 cursor-pointer"
            style={{ borderTop: '1px solid rgba(110,207,184,0.08)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,207,184,0.04)';
              (e.currentTarget as HTMLElement).style.borderLeftColor = '#6ECFB8';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            {/* Number */}
            <span className="font-mono flex-shrink-0" style={{ color: '#2A3E3A', fontFamily: 'Space Mono, monospace', fontSize: '9px', width: '20px' }}>
              {s.num}
            </span>

            {/* Label */}
            <span
              className="font-mono flex-1 transition-colors duration-200 group-hover:text-[#6ECFB8]"
              style={{ color: '#F0EEE8', fontFamily: 'Space Mono, monospace', fontSize: 'clamp(18px, 3vw, 32px)', letterSpacing: '0.05em' }}
            >
              {s.label}
            </span>

            {/* Tag */}
            <span
              className="hidden md:block font-mono text-xs flex-shrink-0 transition-colors duration-200 group-hover:text-[#6ECFB8]"
              style={{ color: '#384A45', fontFamily: 'Space Mono, monospace', fontSize: '9px', width: '160px', textAlign: 'right' }}
            >
              [{s.tag}]
            </span>

            {/* Desc */}
            <span
              className="hidden lg:block text-xs flex-shrink-0 w-44 text-right"
              style={{ color: '#585854', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}
            >
              {s.ko} · {s.desc}
            </span>

            {/* Arrow */}
            <span
              className="font-mono text-sm flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: '#384A45', fontFamily: 'Space Mono, monospace' }}
            >
              →
            </span>
          </Link>
        </div>
      ))}

      {/* Bottom border */}
      <div style={{ borderTop: '1px solid rgba(110,207,184,0.08)' }} />
    </section>
  );
}
