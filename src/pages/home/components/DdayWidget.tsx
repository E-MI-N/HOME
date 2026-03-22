import { useEffect, useState } from 'react';
import { useInView } from '../../../hooks/useInView';
import { supabase } from '../../../lib/supabase';

interface DdayEvent {
  id: number;
  label: string;
  label_en: string;
  date: string;
  category: string;
  color: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  campaign: '◈',
  birthday: '★',
  milestone: '▲',
  event: '◆',
};

function getDdayValue(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function DdayTag({ diff }: { diff: number }) {
  if (diff === 0) {
    return (
      <span className="font-mono" style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700 }}>
        D-DAY
      </span>
    );
  }
  const sign = diff > 0 ? '-' : '+';
  const abs = Math.abs(diff);
  return (
    <span className="font-mono" style={{ color: diff > 0 ? '#6ECFB8' : '#585854', fontFamily: 'Space Mono, monospace', fontSize: '18px', fontWeight: 700 }}>
      D{sign}{abs}
    </span>
  );
}

function CountdownBlock({ dateStr }: { dateStr: string }) {
  const [diff, setDiff] = useState(getDdayValue(dateStr));

  useEffect(() => {
    const id = setInterval(() => setDiff(getDdayValue(dateStr)), 60000);
    return () => clearInterval(id);
  }, [dateStr]);

  return <DdayTag diff={diff} />;
}

export default function DdayWidget() {
  const { ref, inView } = useInView();
  const [ddayEvents, setDdayEvents] = useState<DdayEvent[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('dday_events').select('*').order('date', { ascending: true });
      const events = data ?? [];
      setDdayEvents(events);
      if (events.length > 0) setSelectedId(events[0].id);
    };
    load();
  }, []);

  const selectedEvent = ddayEvents.find(e => e.id === selectedId);

  return (
    <div
      ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} flex flex-col h-full`}
      style={{
        border: '1px solid rgba(110,207,184,0.18)',
        backgroundColor: 'rgba(8,8,8,0.9)',
        minHeight: '380px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(110,207,184,0.12)' }}>
        <div className="flex items-center gap-2">
          <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#6ECFB8' }} />
          <span className="font-mono text-xs" style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em' }}>
            D-DAY_COUNTER
          </span>
        </div>
        <span className="font-mono text-xs" style={{ color: '#2A3E3A', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
          {ddayEvents.length}_EVENTS
        </span>
      </div>

      {/* Selected event big display */}
      {selectedEvent && (
        <div className="px-5 py-5 flex flex-col gap-2" style={{ borderBottom: '1px solid rgba(110,207,184,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: '#384A45', fontFamily: 'Space Mono, monospace', fontSize: '10px' }}>
              {CATEGORY_ICONS[selectedEvent.category]}
            </span>
            <span className="font-mono" style={{ color: '#585854', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {selectedEvent.labelEn}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <CountdownBlock dateStr={selectedEvent.date} />
            <div className="text-right">
              <p className="font-mono text-xs" style={{ color: '#808078', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
                TARGET DATE
              </p>
              <p className="font-mono text-xs" style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace', fontSize: '11px' }}>
                {selectedEvent.date.replace(/-/g, '.')}
              </p>
            </div>
          </div>
          <p className="font-mono" style={{ color: '#A0A098', fontFamily: 'Space Mono, monospace', fontSize: '10px' }}>
            {selectedEvent.label}
          </p>
        </div>
      )}

      {/* Event list */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {ddayEvents.map((ev, i) => {
          const diff = getDdayValue(ev.date);
          const isSelected = ev.id === selectedId;
          return (
            <button
              key={ev.id}
              onClick={() => setSelectedId(ev.id)}
              className="flex items-center justify-between px-5 py-3 cursor-pointer transition-colors duration-150 text-left w-full"
              style={{
                backgroundColor: isSelected ? 'rgba(110,207,184,0.07)' : 'transparent',
                borderLeft: isSelected ? '2px solid #6ECFB8' : '2px solid transparent',
                borderBottom: i < ddayEvents.length - 1 ? '1px solid rgba(110,207,184,0.06)' : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: isSelected ? '#6ECFB8' : '#2A3E3A', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
                  {CATEGORY_ICONS[ev.category]}
                </span>
                <div>
                  <p className="font-mono" style={{ color: isSelected ? '#F0EEE8' : '#808078', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
                    {ev.label}
                  </p>
                  <p className="font-mono" style={{ color: '#2A3E3A', fontFamily: 'Space Mono, monospace', fontSize: '8px' }}>
                    {ev.date.replace(/-/g, '.')}
                  </p>
                </div>
              </div>
              <span className="font-mono" style={{
                color: diff === 0 ? '#6ECFB8' : diff > 0 ? 'rgba(110,207,184,0.7)' : '#585854',
                fontFamily: 'Space Mono, monospace', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                {diff === 0 ? 'D-DAY' : diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
