import { useState, useEffect } from 'react';
import { useInView } from '../../../hooks/useInView';
import { supabase } from '../../../lib/supabase';

interface CalendarEvent {
  id: number;
  date: string;
  label: string;
  type: string;
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const TYPE_COLORS: Record<string, string> = {
  session: '#6ECFB8',
  birthday: '#F0EEE8',
  art: '#8EEBD8',
  memo: '#6ECFB8',
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function CalendarWidget() {
  const { ref, inView } = useInView();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(
    toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('calendar_events').select('*');
      setCalendarEvents(data ?? []);
    };
    load();
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const getEventsForDay = (day: number) => {
    const ds = toDateStr(viewYear, viewMonth, day);
    return calendarEvents.filter(e => e.date === ds);
  };

  const selectedEvents = selectedDay
    ? calendarEvents.filter(e => e.date === selectedDay)
    : [];

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div
      ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} flex flex-col h-full`}
      style={{
        border: '1px solid rgba(110,207,184,0.18)',
        backgroundColor: 'rgba(8,8,8,0.9)',
        padding: '0',
        minHeight: '380px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(110,207,184,0.12)' }}>
        <div className="flex items-center gap-2">
          <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#6ECFB8' }} />
          <span className="font-mono text-xs" style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em' }}>
            CALENDAR_SYS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="font-mono text-xs cursor-pointer transition-colors duration-150"
            style={{ color: '#585854', fontFamily: 'Space Mono, monospace' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#6ECFB8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#585854')}
          >
            ◂
          </button>
          <span className="font-mono text-xs" style={{ color: '#F0EEE8', fontFamily: 'Space Mono, monospace', fontSize: '11px', minWidth: '80px', textAlign: 'center' }}>
            {viewYear} {monthNames[viewMonth]}
          </span>
          <button
            onClick={nextMonth}
            className="font-mono text-xs cursor-pointer transition-colors duration-150"
            style={{ color: '#585854', fontFamily: 'Space Mono, monospace' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#6ECFB8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#585854')}
          >
            ▸
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-4 pt-3 pb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center font-mono" style={{ color: '#384A45', fontFamily: 'Space Mono, monospace', fontSize: '8px', letterSpacing: '0.1em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-3 pb-3 flex-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const ds = toDateStr(viewYear, viewMonth, day);
          const dayEvents = getEventsForDay(day);
          const isToday = ds === todayStr;
          const isSelected = ds === selectedDay;

          return (
            <button
              key={ds}
              onClick={() => setSelectedDay(ds === selectedDay ? null : ds)}
              className="cal-day flex flex-col items-center justify-start pt-1 pb-1 relative"
              style={{
                color: isSelected ? '#6ECFB8' : isToday ? '#6ECFB8' : '#808078',
                backgroundColor: isSelected
                  ? 'rgba(110,207,184,0.15)'
                  : isToday
                  ? 'rgba(110,207,184,0.08)'
                  : 'transparent',
                outline: isSelected ? '1px solid rgba(110,207,184,0.5)' : isToday ? '1px solid rgba(110,207,184,0.25)' : 'none',
                minHeight: '36px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '10px', fontFamily: 'Space Mono, monospace', lineHeight: 1.4 }}>
                {String(day).padStart(2, '0')}
              </span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {dayEvents.slice(0, 2).map((ev, ei) => (
                    <span
                      key={ei}
                      style={{
                        width: '4px', height: '4px',
                        backgroundColor: TYPE_COLORS[ev.type] ?? '#6ECFB8',
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      <div style={{ borderTop: '1px solid rgba(110,207,184,0.1)', padding: '10px 16px', minHeight: '44px' }}>
        {selectedEvents.length > 0 ? (
          <div className="flex flex-col gap-1">
            {selectedEvents.map((ev, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ width: '4px', height: '4px', backgroundColor: TYPE_COLORS[ev.type], display: 'inline-block', flexShrink: 0 }} />
                <span className="font-mono text-xs" style={{ color: '#A0A098', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
                  {ev.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="font-mono" style={{ color: '#2A3E3A', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
            NO_EVENTS_SCHEDULED
          </span>
        )}
      </div>
    </div>
  );
}
