import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface Props {
  showToast: (msg: string) => void;
}

interface DdayEvent {
  id: number;
  label: string;
  label_en: string;
  date: string;
  category: string;
  color: string;
}

interface CalendarEvent {
  id: number;
  date: string;
  label: string;
  type: string;
}

const CATEGORY_OPTIONS = ['campaign', 'birthday', 'milestone', 'event'];
const TYPE_OPTIONS = ['session', 'birthday', 'art', 'memo'];

export default function DashboardSection({ showToast }: Props) {
  const [ddayEvents, setDdayEvents] = useState<DdayEvent[]>([]);
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'dday' | 'calendar'>('dday');
  const [saving, setSaving] = useState(false);

  // D-Day form state
  const [ddayForm, setDdayForm] = useState({ label: '', label_en: '', date: '', category: 'event', color: '#6ECFB8' });
  const [editingDday, setEditingDday] = useState<number | null>(null);
  const [addingDday, setAddingDday] = useState(false);

  // Calendar form state
  const [calForm, setCalForm] = useState({ date: '', label: '', type: 'memo' });
  const [editingCal, setEditingCal] = useState<number | null>(null);
  const [addingCal, setAddingCal] = useState(false);

  const loadDday = async () => {
    const { data } = await supabase.from('dday_events').select('*').order('date', { ascending: true });
    setDdayEvents(data ?? []);
  };
  const loadCal = async () => {
    const { data } = await supabase.from('calendar_events').select('*').order('date', { ascending: true });
    setCalEvents(data ?? []);
  };

  useEffect(() => { loadDday(); loadCal(); }, []);

  /* ---- D-Day CRUD ---- */
  const saveDday = async () => {
    if (!ddayForm.label || !ddayForm.date) return;
    setSaving(true);
    if (editingDday !== null) {
      const { error } = await supabase.from('dday_events').update(ddayForm).eq('id', editingDday);
      if (error) { showToast('오류: ' + error.message); } else { showToast('D-Day 수정 완료'); }
      setEditingDday(null);
    } else {
      const { error } = await supabase.from('dday_events').insert(ddayForm);
      if (error) { showToast('오류: ' + error.message); } else { showToast('D-Day 추가 완료'); }
      setAddingDday(false);
    }
    setSaving(false);
    setDdayForm({ label: '', label_en: '', date: '', category: 'event', color: '#6ECFB8' });
    loadDday();
  };

  const deleteDday = async (id: number) => {
    if (!window.confirm('삭제할까요?')) return;
    await supabase.from('dday_events').delete().eq('id', id);
    showToast('삭제 완료');
    loadDday();
  };

  const startEditDday = (ev: DdayEvent) => {
    setDdayForm({ label: ev.label, label_en: ev.label_en, date: ev.date, category: ev.category, color: ev.color });
    setEditingDday(ev.id);
    setAddingDday(false);
  };

  const cancelDday = () => { setEditingDday(null); setAddingDday(false); setDdayForm({ label: '', label_en: '', date: '', category: 'event', color: '#6ECFB8' }); };

  /* ---- Calendar CRUD ---- */
  const saveCal = async () => {
    if (!calForm.label || !calForm.date) return;
    setSaving(true);
    if (editingCal !== null) {
      const { error } = await supabase.from('calendar_events').update(calForm).eq('id', editingCal);
      if (error) { showToast('오류: ' + error.message); } else { showToast('캘린더 수정 완료'); }
      setEditingCal(null);
    } else {
      const { error } = await supabase.from('calendar_events').insert(calForm);
      if (error) { showToast('오류: ' + error.message); } else { showToast('캘린더 추가 완료'); }
      setAddingCal(false);
    }
    setSaving(false);
    setCalForm({ date: '', label: '', type: 'memo' });
    loadCal();
  };

  const deleteCal = async (id: number) => {
    if (!window.confirm('삭제할까요?')) return;
    await supabase.from('calendar_events').delete().eq('id', id);
    showToast('삭제 완료');
    loadCal();
  };

  const startEditCal = (ev: CalendarEvent) => {
    setCalForm({ date: ev.date, label: ev.label, type: ev.type });
    setEditingCal(ev.id);
    setAddingCal(false);
  };

  const cancelCal = () => { setEditingCal(null); setAddingCal(false); setCalForm({ date: '', label: '', type: 'memo' }); };

  const inputStyle = { backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' };
  const labelStyle = { color: '#585854' };

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-xs tracking-widest" style={{ color: '#383834' }}>DASHBOARD_MANAGER</p>
        <p className="font-mono text-lg mt-1" style={{ color: '#F0EEE8' }}>대시보드 관리</p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex items-center gap-0 mb-6" style={{ border: '1px solid #1C1C1C' }}>
        {(['dday', 'calendar'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="flex-1 py-2.5 font-mono text-xs cursor-pointer whitespace-nowrap transition-colors"
            style={{
              color: activeTab === t ? '#6ECFB8' : '#585854',
              backgroundColor: activeTab === t ? 'rgba(110,207,184,0.07)' : 'transparent',
              borderRight: t === 'dday' ? '1px solid #1C1C1C' : 'none',
            }}
          >
            {t === 'dday' ? 'D-DAY 카운터' : '캘린더 이벤트'}
          </button>
        ))}
      </div>

      {/* ---- D-DAY TAB ---- */}
      {activeTab === 'dday' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs" style={{ color: '#808078' }}>D-Day 이벤트 목록</p>
            <button
              onClick={() => { setAddingDday(true); setEditingDday(null); cancelDday(); setAddingDday(true); }}
              className="px-3 py-1.5 font-mono text-xs cursor-pointer whitespace-nowrap"
              style={{ border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
            >
              + 추가
            </button>
          </div>

          {(addingDday || editingDday !== null) && (
            <div className="p-4 mb-4" style={{ border: '1px solid rgba(110,207,184,0.2)', backgroundColor: 'rgba(110,207,184,0.03)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-xs block mb-1.5" style={labelStyle}>이름 *</label>
                  <input className="w-full px-3 py-2 font-mono text-xs outline-none" style={inputStyle}
                    value={ddayForm.label} onChange={(e) => setDdayForm((p) => ({ ...p, label: e.target.value }))} />
                </div>
                <div>
                  <label className="font-mono text-xs block mb-1.5" style={labelStyle}>영문 이름</label>
                  <input className="w-full px-3 py-2 font-mono text-xs outline-none" style={inputStyle}
                    value={ddayForm.label_en} onChange={(e) => setDdayForm((p) => ({ ...p, label_en: e.target.value }))} />
                </div>
                <div>
                  <label className="font-mono text-xs block mb-1.5" style={labelStyle}>날짜 (YYYY-MM-DD) *</label>
                  <input type="date" className="w-full px-3 py-2 font-mono text-xs outline-none" style={inputStyle}
                    value={ddayForm.date} onChange={(e) => setDdayForm((p) => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="font-mono text-xs block mb-1.5" style={labelStyle}>카테고리</label>
                  <select className="w-full px-3 py-2 font-mono text-xs outline-none" style={inputStyle}
                    value={ddayForm.category} onChange={(e) => setDdayForm((p) => ({ ...p, category: e.target.value }))}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={saveDday} disabled={saving || !ddayForm.label || !ddayForm.date}
                  className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: 'rgba(110,207,184,0.12)', border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}>
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
                <button onClick={cancelDday} className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
                  style={{ border: '1px solid #1C1C1C', color: '#585854' }}>CANCEL</button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {ddayEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 px-4 py-3" style={{ border: '1px solid #1C1C1C' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: ev.color ?? '#6ECFB8', display: 'inline-block', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs truncate" style={{ color: '#F0EEE8' }}>{ev.label}</p>
                  <p className="font-mono mt-0.5" style={{ fontSize: '10px', color: '#585854' }}>{ev.date} · {ev.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEditDday(ev)} className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#585854' }}>수정</button>
                  <button onClick={() => deleteDday(ev.id)} className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#583034' }}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- CALENDAR TAB ---- */}
      {activeTab === 'calendar' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs" style={{ color: '#808078' }}>캘린더 이벤트 목록</p>
            <button
              onClick={() => { setAddingCal(true); setEditingCal(null); cancelCal(); setAddingCal(true); }}
              className="px-3 py-1.5 font-mono text-xs cursor-pointer whitespace-nowrap"
              style={{ border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
            >
              + 추가
            </button>
          </div>

          {(addingCal || editingCal !== null) && (
            <div className="p-4 mb-4" style={{ border: '1px solid rgba(110,207,184,0.2)', backgroundColor: 'rgba(110,207,184,0.03)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-xs block mb-1.5" style={labelStyle}>날짜 (YYYY-MM-DD) *</label>
                  <input type="date" className="w-full px-3 py-2 font-mono text-xs outline-none" style={inputStyle}
                    value={calForm.date} onChange={(e) => setCalForm((p) => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="font-mono text-xs block mb-1.5" style={labelStyle}>이벤트명 *</label>
                  <input className="w-full px-3 py-2 font-mono text-xs outline-none" style={inputStyle}
                    value={calForm.label} onChange={(e) => setCalForm((p) => ({ ...p, label: e.target.value }))} />
                </div>
                <div>
                  <label className="font-mono text-xs block mb-1.5" style={labelStyle}>타입</label>
                  <select className="w-full px-3 py-2 font-mono text-xs outline-none" style={inputStyle}
                    value={calForm.type} onChange={(e) => setCalForm((p) => ({ ...p, type: e.target.value }))}>
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={saveCal} disabled={saving || !calForm.label || !calForm.date}
                  className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: 'rgba(110,207,184,0.12)', border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}>
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
                <button onClick={cancelCal} className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
                  style={{ border: '1px solid #1C1C1C', color: '#585854' }}>CANCEL</button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {calEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 px-4 py-3" style={{ border: '1px solid #1C1C1C' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs truncate" style={{ color: '#F0EEE8' }}>{ev.label}</p>
                  <p className="font-mono mt-0.5" style={{ fontSize: '10px', color: '#585854' }}>{ev.date} · {ev.type}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEditCal(ev)} className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#585854' }}>수정</button>
                  <button onClick={() => deleteCal(ev.id)} className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#583034' }}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
