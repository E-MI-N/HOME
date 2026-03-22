import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ImageUpload from '../../../components/base/ImageUpload';

interface Props {
  showToast: (msg: string) => void;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  date: string;
  url: string;
  is_landscape: boolean;
  published: boolean;
  display_order: number;
}

const EMPTY: Omit<GalleryItem, 'id'> = {
  title: '',
  description: '',
  tags: [],
  date: '',
  url: '',
  is_landscape: false,
  published: true,
  display_order: 0,
};

interface FormProps {
  initial: Omit<GalleryItem, 'id'>;
  onSave: (data: Omit<GalleryItem, 'id'>) => void;
  onCancel: () => void;
  loading: boolean;
}

function GalleryForm({ initial, onSave, onCancel, loading }: FormProps) {
  const [form, setForm] = useState<Omit<GalleryItem, 'id'>>(initial);
  const [tagInput, setTagInput] = useState('');

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      set('tags', [...form.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    set('tags', form.tags.filter((t) => t !== tag));
  };

  return (
    <div
      className="p-5 mb-4"
      style={{ border: '1px solid rgba(110,207,184,0.2)', backgroundColor: 'rgba(110,207,184,0.03)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>제목 *</label>
          <input
            className="w-full px-3 py-2 font-mono text-xs outline-none"
            style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>날짜 (예: 2026.03)</label>
          <input
            className="w-full px-3 py-2 font-mono text-xs outline-none"
            style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>이미지 *</label>
          <ImageUpload
            value={form.url}
            onChange={(url) => set('url', url)}
            aspect={form.is_landscape ? 'wide' : 'portrait'}
            folder="gallery"
          />
        </div>
        <div className="md:col-span-2">
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>설명</label>
          <textarea
            className="w-full px-3 py-2 font-mono text-xs outline-none resize-none"
            rows={2}
            style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="font-mono text-xs block mb-1.5" style={{ color: '#585854' }}>해시태그</label>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 font-mono text-xs"
                style={{ backgroundColor: 'rgba(110,207,184,0.1)', border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="cursor-pointer ml-0.5 transition-colors"
                  style={{ color: 'rgba(110,207,184,0.6)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#ff6b6b')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(110,207,184,0.6)')}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 font-mono text-xs outline-none"
              style={{ backgroundColor: '#0C0C0C', border: '1px solid #1C1C1C', color: '#F0EEE8' }}
              placeholder="태그 입력 후 추가"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            />
            <button
              onClick={addTag}
              className="px-3 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
              style={{ border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
            >
              + 추가
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_landscape}
              onChange={(e) => set('is_landscape', e.target.checked)}
            />
            <span className="font-mono text-xs" style={{ color: '#808078' }}>가로형 (16:9)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
            />
            <span className="font-mono text-xs" style={{ color: '#808078' }}>게시됨</span>
          </label>
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

      {/* Image preview — ImageUpload 컴포넌트가 미리보기를 이미 처리하므로 제거 */}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onSave(form)}
          disabled={loading || !form.title || !form.url}
          className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
          style={{ backgroundColor: 'rgba(110,207,184,0.12)', border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
        >
          {loading ? 'SAVING...' : 'SAVE'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
          style={{ border: '1px solid #1C1C1C', color: '#585854' }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}

export default function GallerySection({ showToast }: Props) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true });
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (form: Omit<GalleryItem, 'id'>) => {
    setSaving(true);
    const { error } = await supabase.from('gallery_items').insert(form);
    setSaving(false);
    if (error) { showToast('오류: ' + error.message); return; }
    showToast('갤러리 항목 추가 완료');
    setAdding(false);
    load();
  };

  const handleEdit = async (id: number, form: Omit<GalleryItem, 'id'>) => {
    setSaving(true);
    const { error } = await supabase.from('gallery_items').update(form).eq('id', id);
    setSaving(false);
    if (error) { showToast('오류: ' + error.message); return; }
    showToast('수정 완료');
    setEditing(null);
    load();
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    await supabase.from('gallery_items').update({ published: !item.published }).eq('id', item.id);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('삭제할까요?')) return;
    await supabase.from('gallery_items').delete().eq('id', id);
    showToast('삭제 완료');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs tracking-widest" style={{ color: '#383834' }}>GALLERY_MANAGER</p>
          <p className="font-mono text-lg mt-1" style={{ color: '#F0EEE8' }}>갤러리 관리</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
          style={{ border: '1px solid rgba(110,207,184,0.3)', color: '#6ECFB8' }}
        >
          + 사진 추가
        </button>
      </div>

      {adding && (
        <GalleryForm
          initial={{ ...EMPTY, display_order: items.length + 1 }}
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
          loading={saving}
        />
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id}>
            {editing === item.id ? (
              <GalleryForm
                initial={{
                  title: item.title,
                  description: item.description,
                  tags: item.tags ?? [],
                  date: item.date,
                  url: item.url,
                  is_landscape: item.is_landscape,
                  published: item.published,
                  display_order: item.display_order,
                }}
                onSave={(form) => handleEdit(item.id, form)}
                onCancel={() => setEditing(null)}
                loading={saving}
              />
            ) : (
              <div
                className="flex items-center gap-4 px-4 py-3"
                style={{
                  border: '1px solid #1C1C1C',
                  opacity: item.published ? 1 : 0.5,
                  backgroundColor: item.published ? 'transparent' : 'rgba(0,0,0,0.2)',
                }}
              >
                <span className="font-mono text-xs w-6 shrink-0 text-right" style={{ color: '#2A3E3A' }}>
                  {String(item.display_order).padStart(2, '0')}
                </span>
                <img
                  src={item.url}
                  alt={item.title}
                  style={{ width: '60px', height: '45px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs truncate" style={{ color: '#F0EEE8' }}>{item.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(item.tags ?? []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 font-mono"
                        style={{ fontSize: '9px', color: '#6ECFB8', border: '1px solid rgba(110,207,184,0.2)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className="font-mono cursor-pointer whitespace-nowrap transition-colors"
                    style={{ fontSize: '10px', color: item.published ? '#6ECFB8' : '#383834' }}
                  >
                    {item.published ? '게시중' : '비공개'}
                  </button>
                  <button
                    onClick={() => { setEditing(item.id); setAdding(false); }}
                    className="font-mono cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '10px', color: '#585854' }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
