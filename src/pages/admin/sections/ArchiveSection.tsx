import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { ArchiveEntry } from '../../../types/archive';
import ArchiveForm from '../components/ArchiveForm';

type View = 'list' | 'create' | 'edit';

interface Props {
  showToast: (msg: string) => void;
}

export default function ArchiveSection({ showToast }: Props) {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [editTarget, setEditTarget] = useState<ArchiveEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('archive_entries')
      .select('*')
      .order('display_order', { ascending: true });
    setEntries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleCreate = async (data: Partial<ArchiveEntry>) => {
    const { error } = await supabase.from('archive_entries').insert([data]);
    if (!error) { showToast('아카이브 항목이 추가됐어요!'); setView('list'); fetchEntries(); }
    else showToast('저장 중 오류가 발생했어요.');
  };

  const handleUpdate = async (data: Partial<ArchiveEntry>) => {
    if (!editTarget) return;
    const { error } = await supabase
      .from('archive_entries')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editTarget.id);
    if (!error) { showToast('저장 완료!'); setView('list'); setEditTarget(null); fetchEntries(); }
    else showToast('저장 중 오류가 발생했어요.');
  };

  const handleDelete = async (id: string) => {
    await supabase.from('archive_entries').delete().eq('id', id);
    setDeleteConfirm(null);
    showToast('항목이 삭제됐어요.');
    fetchEntries();
  };

  const toggleActive = async (entry: ArchiveEntry) => {
    await supabase.from('archive_entries').update({ is_active: !entry.is_active }).eq('id', entry.id);
    fetchEntries();
  };

  const getCategoryColor = (category: string) => {
    if (category === '역극') return '#C8A870';
    return '#585854';
  };

  return (
    <div>
      {view === 'list' && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-xs mb-1" style={{ color: '#585854' }}>ARCHIVE</p>
              <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>아카이브 관리</p>
            </div>
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest cursor-pointer whitespace-nowrap"
              style={{ border: '1px solid rgba(110,207,184,0.3)', backgroundColor: 'rgba(110,207,184,0.08)', color: '#6ECFB8' }}
            >
              + 새 항목
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center font-mono text-xs" style={{ color: '#383834' }}>LOADING...</div>
          ) : entries.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-mono text-xs mb-4" style={{ color: '#383834' }}>항목이 없어요.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ border: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}
                >
                  <span className="font-mono text-xs flex-shrink-0" style={{ color: '#383834', minWidth: '24px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <p className="text-sm truncate" style={{ color: '#F0EEE8' }}>{entry.title}</p>
                      {!entry.is_active && (
                        <span className="font-mono text-xs px-2 py-0.5 flex-shrink-0" style={{ border: '1px solid #1C1C1C', color: '#383834' }}>HIDDEN</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono" style={{ fontSize: '10px', color: '#383834' }}>{entry.date}</span>
                      <span
                        className="font-mono px-2 py-0.5"
                        style={{ border: '1px solid #1C1C1C', color: getCategoryColor(entry.category), fontSize: '10px' }}
                      >
                        {entry.category}
                      </span>
                      {entry.chat_messages && entry.chat_messages.length > 0 && (
                        <span className="font-mono" style={{ fontSize: '10px', color: '#C8A870' }}>
                          <i className="ri-chat-3-line" /> 역극 {entry.chat_messages.length}줄
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-mono text-xs flex-shrink-0" style={{ color: '#383834' }}>#{entry.display_order}</span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(entry)} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: entry.is_active ? '#6ECFB8' : '#383834' }} title={entry.is_active ? '숨기기' : '보이기'}>
                      <i className={entry.is_active ? 'ri-eye-line' : 'ri-eye-off-line'} />
                    </button>
                    <button onClick={() => { setEditTarget(entry); setView('edit'); }} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#A0A098' }} title="수정">
                      <i className="ri-edit-line" />
                    </button>
                    <button onClick={() => setDeleteConfirm(entry.id)} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#585854' }} title="삭제">
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'create' && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView('list')} className="font-mono text-xs cursor-pointer" style={{ color: '#585854' }}>← 목록</button>
            <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>새 항목 추가</p>
          </div>
          <ArchiveForm onSave={handleCreate} onCancel={() => setView('list')} />
        </div>
      )}

      {view === 'edit' && editTarget && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => { setView('list'); setEditTarget(null); }} className="font-mono text-xs cursor-pointer" style={{ color: '#585854' }}>← 목록</button>
            <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>수정</p>
          </div>
          <ArchiveForm entry={editTarget} onSave={handleUpdate} onCancel={() => { setView('list'); setEditTarget(null); }} />
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(8,8,8,0.85)' }}>
          <div className="w-80 p-8" style={{ border: '1px solid #1C1C1C', backgroundColor: '#0C0C0C' }}>
            <p className="font-mono text-xs mb-3" style={{ color: '#585854' }}>CONFIRM DELETE</p>
            <p className="text-sm mb-6" style={{ color: '#A0A098' }}>이 항목을 삭제할까요? 되돌릴 수 없어요.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 font-mono text-xs cursor-pointer whitespace-nowrap" style={{ border: '1px solid rgba(207,110,110,0.3)', backgroundColor: 'rgba(207,110,110,0.1)', color: '#CF6E6E' }}>삭제</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 font-mono text-xs cursor-pointer whitespace-nowrap" style={{ border: '1px solid #1C1C1C', color: '#585854' }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
