import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Character } from '../../../types/character';
import CharacterForm from '../components/CharacterForm';

type View = 'list' | 'create' | 'edit';

interface Props {
  showToast: (msg: string) => void;
}

export default function CharactersSection({ showToast }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [editTarget, setEditTarget] = useState<Character | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('characters')
      .select('*')
      .order('display_order', { ascending: true });
    setCharacters(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCharacters(); }, [fetchCharacters]);

  const handleCreate = async (data: Partial<Character>) => {
    const { error } = await supabase.from('characters').insert([data]);
    if (!error) { showToast('캐릭터가 추가됐어요!'); setView('list'); fetchCharacters(); }
  };

  const handleUpdate = async (data: Partial<Character>) => {
    if (!editTarget) return;
    const { error } = await supabase
      .from('characters')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editTarget.id);
    if (!error) { showToast('저장 완료!'); setView('list'); setEditTarget(null); fetchCharacters(); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('characters').delete().eq('id', id);
    setDeleteConfirm(null);
    showToast('캐릭터가 삭제됐어요.');
    fetchCharacters();
  };

  const toggleActive = async (char: Character) => {
    await supabase.from('characters').update({ is_active: !char.is_active }).eq('id', char.id);
    fetchCharacters();
  };

  return (
    <div>
      {view === 'list' && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-xs mb-1" style={{ color: '#585854' }}>CHARACTERS</p>
              <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>캐릭터 관리</p>
            </div>
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest cursor-pointer whitespace-nowrap"
              style={{ border: '1px solid rgba(110,207,184,0.3)', backgroundColor: 'rgba(110,207,184,0.08)', color: '#6ECFB8' }}
            >
              + 새 캐릭터
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center font-mono text-xs" style={{ color: '#383834' }}>LOADING...</div>
          ) : characters.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-mono text-xs mb-4" style={{ color: '#383834' }}>캐릭터가 없어요.</p>
              <button onClick={() => setView('create')} className="font-mono text-xs px-4 py-2 cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#585854' }}>
                첫 캐릭터 추가하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {characters.map((char) => (
                <div key={char.id} className="flex items-center gap-5 p-5" style={{ border: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ width: '52px', height: '68px', flexShrink: 0, border: '1px solid #1C1C1C', overflow: 'hidden' }}>
                    {char.image ? (
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ri-user-line" style={{ color: '#383834', fontSize: '20px' }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm" style={{ color: '#F0EEE8' }}>{char.name}</p>
                      <p className="font-mono text-xs" style={{ color: '#383834' }}>{char.name_en}</p>
                      {!char.is_active && (
                        <span className="font-mono text-xs px-2 py-0.5" style={{ border: '1px solid #1C1C1C', color: '#383834' }}>HIDDEN</span>
                      )}
                    </div>
                    <p className="font-mono text-xs" style={{ color: '#585854' }}>{char.title}</p>
                  </div>
                  <span className="font-mono text-xs" style={{ color: '#383834' }}>#{char.display_order}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(char)} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: char.is_active ? '#6ECFB8' : '#383834' }} title={char.is_active ? '숨기기' : '보이기'}>
                      <i className={char.is_active ? 'ri-eye-line' : 'ri-eye-off-line'} />
                    </button>
                    <button onClick={() => { setEditTarget(char); setView('edit'); }} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#A0A098' }} title="수정">
                      <i className="ri-edit-line" />
                    </button>
                    <button onClick={() => setDeleteConfirm(char.id)} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#585854' }} title="삭제">
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
            <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>새 캐릭터 추가</p>
          </div>
          <CharacterForm onSave={handleCreate} onCancel={() => setView('list')} />
        </div>
      )}

      {view === 'edit' && editTarget && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => { setView('list'); setEditTarget(null); }} className="font-mono text-xs cursor-pointer" style={{ color: '#585854' }}>← 목록</button>
            <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>{editTarget.name_en}</p>
          </div>
          <CharacterForm character={editTarget} onSave={handleUpdate} onCancel={() => { setView('list'); setEditTarget(null); }} />
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(8,8,8,0.85)' }}>
          <div className="w-80 p-8" style={{ border: '1px solid #1C1C1C', backgroundColor: '#0C0C0C' }}>
            <p className="font-mono text-xs mb-3" style={{ color: '#585854' }}>CONFIRM DELETE</p>
            <p className="text-sm mb-6" style={{ color: '#A0A098' }}>이 캐릭터를 삭제할까요? 되돌릴 수 없어요.</p>
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
