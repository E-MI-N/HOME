import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { MusicTrack } from '../../../types/music';

interface Props {
  showToast: (msg: string) => void;
}

const EMPTY: Omit<MusicTrack, 'id' | 'created_at'> = {
  title: '',
  artist: '',
  youtube_url: '',
  video_id: '',
  display_order: 0,
  is_active: true,
};

function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return url.trim();
}

interface FormProps {
  initial: Omit<MusicTrack, 'id' | 'created_at'>;
  onSave: (data: Omit<MusicTrack, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  loading: boolean;
}

function TrackForm({ initial, onSave, onCancel, loading }: FormProps) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form, v: string | number | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleUrlBlur = () => {
    if (form.youtube_url) {
      set('video_id', extractVideoId(form.youtube_url));
    }
  };

  return (
    <div
      className="p-5 mb-4"
      style={{ border: '1px solid rgba(110,207,184,0.2)', backgroundColor: 'rgba(110,207,184,0.03)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>TITLE *</label>
          <input
            className="w-full px-3 py-2 font-mono text-xs outline-none"
            style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>ARTIST</label>
          <input
            className="w-full px-3 py-2 font-mono text-xs outline-none"
            style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
            value={form.artist}
            onChange={(e) => set('artist', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>YOUTUBE URL *</label>
          <input
            className="w-full px-3 py-2 font-mono text-xs outline-none"
            style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.youtube_url}
            onChange={(e) => set('youtube_url', e.target.value)}
            onBlur={handleUrlBlur}
          />
        </div>
        <div>
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>VIDEO ID (자동입력)</label>
          <input
            className="w-full px-3 py-2 font-mono text-xs outline-none"
            style={{ backgroundColor: '#080808', border: '1px solid #1C1C1C', color: '#585854' }}
            value={form.video_id}
            onChange={(e) => set('video_id', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>순서</label>
          <input
            type="number"
            className="w-full px-3 py-2 font-mono text-xs outline-none"
            style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
            value={form.display_order}
            onChange={(e) => set('display_order', Number(e.target.value))}
          />
        </div>
      </div>
      {form.video_id && (
        <div className="mt-3">
          <p className="font-mono text-xs mb-1.5" style={{ color: '#383834' }}>미리보기</p>
          <iframe
            src={`https://www.youtube.com/embed/${form.video_id}?rel=0`}
            style={{ width: '280px', height: '158px', border: '1px solid #1C1C1C' }}
            title="preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onSave(form)}
          disabled={loading || !form.title || !form.video_id}
          className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap transition-colors"
          style={{ backgroundColor: 'rgba(110,207,184,0.12)', border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
        >
          {loading ? 'SAVING...' : 'SAVE'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap transition-colors"
          style={{ border: '1px solid #1C1C1C', color: '#585854' }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}

export default function MusicSection({ showToast }: Props) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from('music_playlist')
      .select('*')
      .order('display_order', { ascending: true });
    setTracks(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (form: Omit<MusicTrack, 'id' | 'created_at'>) => {
    setSaving(true);
    const { error } = await supabase.from('music_playlist').insert(form);
    setSaving(false);
    if (error) { showToast('오류: ' + error.message); return; }
    showToast('트랙 추가 완료');
    setAdding(false);
    load();
  };

  const handleEdit = async (id: string, form: Omit<MusicTrack, 'id' | 'created_at'>) => {
    setSaving(true);
    const { error } = await supabase.from('music_playlist').update(form).eq('id', id);
    setSaving(false);
    if (error) { showToast('오류: ' + error.message); return; }
    showToast('수정 완료');
    setEditing(null);
    load();
  };

  const handleToggle = async (t: MusicTrack) => {
    await supabase.from('music_playlist').update({ is_active: !t.is_active }).eq('id', t.id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('삭제할까요?')) return;
    await supabase.from('music_playlist').delete().eq('id', id);
    showToast('삭제 완료');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs tracking-widest" style={{ color: '#383834' }}>MUSIC_PLAYLIST</p>
          <p className="font-mono text-lg mt-1" style={{ color: '#F0EEE8' }}>음악 재생목록</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
          style={{ border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
        >
          + 트랙 추가
        </button>
      </div>

      {adding && (
        <TrackForm
          initial={{ ...EMPTY, display_order: tracks.length + 1 }}
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
          loading={saving}
        />
      )}

      <div className="flex flex-col gap-2">
        {tracks.map((t) => (
          <div key={t.id}>
            {editing === t.id ? (
              <TrackForm
                initial={{ title: t.title, artist: t.artist, youtube_url: t.youtube_url, video_id: t.video_id, display_order: t.display_order, is_active: t.is_active }}
                onSave={(form) => handleEdit(t.id, form)}
                onCancel={() => setEditing(null)}
                loading={saving}
              />
            ) : (
              <div
                className="flex items-center gap-4 px-4 py-3"
                style={{ border: '1px solid #1C1C1C', backgroundColor: t.is_active ? 'transparent' : 'rgba(0,0,0,0.2)', opacity: t.is_active ? 1 : 0.5 }}
              >
                <span className="font-mono text-xs w-6 text-right" style={{ color: '#2A3E3A' }}>
                  {String(t.display_order).padStart(2, '0')}
                </span>
                <img
                  src={`https://img.youtube.com/vi/${t.video_id}/default.jpg`}
                  alt={t.title}
                  style={{ width: '60px', height: '45px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs truncate" style={{ color: '#F0EEE8' }}>{t.title}</p>
                  {t.artist && <p className="font-mono mt-0.5 truncate" style={{ fontSize: '10px', color: '#585854' }}>{t.artist}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(t)}
                    className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: t.is_active ? '#6ECFB8' : '#383834' }}
                  >
                    {t.is_active ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => { setEditing(t.id); setAdding(false); }}
                    className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#585854' }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#583034' }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
