import { TrpgSession } from '../../../mocks/trpg';
import { useInView } from '../../../hooks/useInView';

export default function SessionCard({ session, index }: { session: TrpgSession; index: number }) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} flex gap-5 mb-6`}
      style={{ transitionDelay: `${(index % 5) * 70}ms` }}>

      {/* Number / Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 flex items-center justify-center border font-mono text-xs"
          style={{
            border: `1px solid ${session.status === '예정' ? '#1C1C1C' : 'rgba(110, 207, 184, 0.25)'}`,
            color: session.status === '예정' ? '#383834' : '#6ECFB8',
            backgroundColor: session.status === '예정' ? 'transparent' : 'rgba(110, 207, 184, 0.05)',
          }}>
          {session.sessionNumber}
        </div>
        <div style={{ width: '1px', flex: 1, backgroundColor: '#1C1C1C', minHeight: '16px', marginTop: '6px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 border mb-1" style={{ border: '1px solid #1C1C1C' }}>
        <div className="relative overflow-hidden" style={{ height: '130px' }}>
          <img src={session.image} alt={session.title} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 40%, rgba(8,8,8,0.9))' }} />
          <div className="absolute top-2 right-2 font-mono text-xs px-2 py-1"
            style={{
              border: `1px solid ${session.status === '예정' ? '#1C1C1C' : 'rgba(110, 207, 184, 0.25)'}`,
              color: session.status === '예정' ? '#585854' : '#6ECFB8',
              backgroundColor: 'rgba(8,8,8,0.8)', fontSize: '10px',
            }}>
            {session.status}
          </div>
          <div className="absolute bottom-2 left-3 font-mono text-xs"
            style={{ color: 'rgba(240,238,232,0.3)', fontSize: '10px' }}>
            SESSION {String(session.sessionNumber).padStart(2, '0')}
          </div>
        </div>

        <div className="p-4">
          <p className="font-mono text-xs mb-2" style={{ color: '#383834' }}>{session.date}</p>
          <h4 className="font-serif text-base mb-2" style={{ color: '#F0EEE8' }}>{session.title}</h4>
          <div
            className="text-xs leading-relaxed mb-4 trpg-html-content"
            style={{ color: '#585854' }}
            dangerouslySetInnerHTML={{ __html: session.summary ?? '' }}
          />
          <div className="space-y-1">
            {session.highlights.map((h) => (
              <div key={h} className="flex items-start gap-2">
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(110,207,184,0.5)', flexShrink: 0, marginTop: '6px', display: 'block' }} />
                <p className="font-mono text-xs" style={{ color: '#808078', fontSize: '11px' }}>{h}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
