import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { TrpgCampaign, TrpgSession } from '../../../types/trpg';
import TrpgCampaignForm from '../components/TrpgCampaignForm';
import TrpgSessionForm from '../components/TrpgSessionForm';

type CampaignView = 'list' | 'create-campaign' | 'edit-campaign';
type SessionView = 'sessions' | 'create-session' | 'edit-session';

interface Props {
  showToast: (msg: string) => void;
}

export default function TrpgSection({ showToast }: Props) {
  const [campaigns, setCampaigns] = useState<TrpgCampaign[]>([]);
  const [sessions, setSessions] = useState<TrpgSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [campaignView, setCampaignView] = useState<CampaignView>('list');
  const [editCampaign, setEditCampaign] = useState<TrpgCampaign | null>(null);

  const [selectedCampaign, setSelectedCampaign] = useState<TrpgCampaign | null>(null);
  const [sessionView, setSessionView] = useState<SessionView>('sessions');
  const [editSession, setEditSession] = useState<TrpgSession | null>(null);

  const [deleteCampaignConfirm, setDeleteCampaignConfirm] = useState<string | null>(null);
  const [deleteSessionConfirm, setDeleteSessionConfirm] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: cData }, { data: sData }] = await Promise.all([
      supabase.from('trpg_campaigns').select('*').order('display_order', { ascending: true }),
      supabase.from('trpg_sessions').select('*').order('display_order', { ascending: true }),
    ]);
    setCampaigns(cData ?? []);
    setSessions(sData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const campaignSessions = selectedCampaign
    ? sessions.filter((s) => s.campaign_id === selectedCampaign.id)
    : [];

  // Campaign actions
  const handleCreateCampaign = async (data: Partial<TrpgCampaign>) => {
    const { error } = await supabase.from('trpg_campaigns').insert([data]);
    if (!error) { showToast('캠페인이 추가됐어요!'); setCampaignView('list'); fetchAll(); }
  };

  const handleUpdateCampaign = async (data: Partial<TrpgCampaign>) => {
    if (!editCampaign) return;
    const { error } = await supabase
      .from('trpg_campaigns')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editCampaign.id);
    if (!error) {
      showToast('저장 완료!');
      setCampaignView('list');
      setEditCampaign(null);
      if (selectedCampaign?.id === editCampaign.id) setSelectedCampaign(null);
      fetchAll();
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    await supabase.from('trpg_sessions').delete().eq('campaign_id', id);
    await supabase.from('trpg_campaigns').delete().eq('id', id);
    setDeleteCampaignConfirm(null);
    if (selectedCampaign?.id === id) setSelectedCampaign(null);
    showToast('캠페인과 모든 세션이 삭제됐어요.');
    fetchAll();
  };

  const toggleCampaignActive = async (campaign: TrpgCampaign) => {
    await supabase.from('trpg_campaigns').update({ is_active: !campaign.is_active }).eq('id', campaign.id);
    fetchAll();
  };

  // Session actions
  const handleCreateSession = async (data: Partial<TrpgSession>) => {
    const { error } = await supabase.from('trpg_sessions').insert([data]);
    if (!error) { showToast('세션이 추가됐어요!'); setSessionView('sessions'); fetchAll(); }
  };

  const handleUpdateSession = async (data: Partial<TrpgSession>) => {
    if (!editSession) return;
    const { error } = await supabase
      .from('trpg_sessions')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editSession.id);
    if (!error) { showToast('저장 완료!'); setSessionView('sessions'); setEditSession(null); fetchAll(); }
  };

  const handleDeleteSession = async (id: string) => {
    await supabase.from('trpg_sessions').delete().eq('id', id);
    setDeleteSessionConfirm(null);
    showToast('세션이 삭제됐어요.');
    fetchAll();
  };

  const getStatusColor = (status: string) => {
    if (status === '진행 중') return '#6ECFB8';
    if (status === '완료') return '#585854';
    return '#C8A870';
  };

  if (loading) {
    return <div className="py-20 text-center font-mono text-xs" style={{ color: '#383834' }}>LOADING...</div>;
  }

  // Campaign list view
  if (campaignView !== 'list') {
    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => { setCampaignView('list'); setEditCampaign(null); }} className="font-mono text-xs cursor-pointer" style={{ color: '#585854' }}>← 목록</button>
          <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>
            {campaignView === 'create-campaign' ? '새 캠페인' : '캠페인 수정'}
          </p>
        </div>
        <TrpgCampaignForm
          campaign={editCampaign}
          onSave={campaignView === 'create-campaign' ? handleCreateCampaign : handleUpdateCampaign}
          onCancel={() => { setCampaignView('list'); setEditCampaign(null); }}
        />
      </div>
    );
  }

  // Session view
  if (selectedCampaign) {
    if (sessionView === 'create-session' || sessionView === 'edit-session') {
      return (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => { setSessionView('sessions'); setEditSession(null); }} className="font-mono text-xs cursor-pointer" style={{ color: '#585854' }}>← 세션 목록</button>
            <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>
              {sessionView === 'create-session' ? '새 세션' : '세션 수정'}
            </p>
          </div>
          <TrpgSessionForm
            session={editSession}
            campaignId={selectedCampaign.id}
            defaultOrder={campaignSessions.length + 1}
            onSave={sessionView === 'create-session' ? handleCreateSession : handleUpdateSession}
            onCancel={() => { setSessionView('sessions'); setEditSession(null); }}
          />
        </div>
      );
    }

    return (
      <div>
        {/* Campaign header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedCampaign(null); setSessionView('sessions'); }}
              className="font-mono text-xs cursor-pointer whitespace-nowrap"
              style={{ color: '#585854' }}
            >
              ← 캠페인 목록
            </button>
            <div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>
                  {selectedCampaign.title}
                </p>
                <span
                  className="font-mono px-2 py-0.5"
                  style={{ border: '1px solid #1C1C1C', color: getStatusColor(selectedCampaign.status), fontSize: '10px' }}
                >
                  {selectedCampaign.status}
                </span>
              </div>
              <p className="font-mono text-xs mt-0.5" style={{ color: '#383834' }}>
                {selectedCampaign.system} · GM {selectedCampaign.gm} · {selectedCampaign.player_count}인
              </p>
            </div>
          </div>
          <button
            onClick={() => setSessionView('create-session')}
            className="flex items-center gap-2 px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap"
            style={{ border: '1px solid rgba(110,207,184,0.3)', backgroundColor: 'rgba(110,207,184,0.08)', color: '#6ECFB8' }}
          >
            + 새 세션
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: '#1C1C1C', marginBottom: '20px' }} />

        <p className="font-mono text-xs mb-4" style={{ color: '#585854' }}>
          SESSION RECORDS — {campaignSessions.length}개
        </p>

        {campaignSessions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs mb-3" style={{ color: '#383834' }}>세션이 없어요.</p>
            <button onClick={() => setSessionView('create-session')} className="font-mono text-xs px-4 py-2 cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#585854' }}>
              첫 세션 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {campaignSessions.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4" style={{ border: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <span className="font-mono text-xs flex-shrink-0" style={{ color: '#383834', minWidth: '28px' }}>
                  S{String(s.session_number).padStart(2, '0')}
                </span>
                {s.image && (
                  <div style={{ width: '52px', height: '32px', flexShrink: 0, border: '1px solid #1C1C1C', overflow: 'hidden' }}>
                    <img src={s.image} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: '#F0EEE8' }}>{s.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-mono" style={{ fontSize: '10px', color: '#383834' }}>{s.date}</span>
                    <span className="font-mono" style={{ fontSize: '10px', color: s.status === '완료' ? '#585854' : '#C8A870' }}>{s.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditSession(s); setSessionView('edit-session'); }} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#A0A098' }} title="수정">
                    <i className="ri-edit-line" />
                  </button>
                  <button onClick={() => setDeleteSessionConfirm(s.id)} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#585854' }} title="삭제">
                    <i className="ri-delete-bin-line" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteSessionConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(8,8,8,0.85)' }}>
            <div className="w-80 p-8" style={{ border: '1px solid #1C1C1C', backgroundColor: '#0C0C0C' }}>
              <p className="font-mono text-xs mb-3" style={{ color: '#585854' }}>CONFIRM DELETE</p>
              <p className="text-sm mb-6" style={{ color: '#A0A098' }}>이 세션을 삭제할까요?</p>
              <div className="flex gap-3">
                <button onClick={() => handleDeleteSession(deleteSessionConfirm)} className="flex-1 py-2.5 font-mono text-xs cursor-pointer whitespace-nowrap" style={{ border: '1px solid rgba(207,110,110,0.3)', backgroundColor: 'rgba(207,110,110,0.1)', color: '#CF6E6E' }}>삭제</button>
                <button onClick={() => setDeleteSessionConfirm(null)} className="flex-1 py-2.5 font-mono text-xs cursor-pointer whitespace-nowrap" style={{ border: '1px solid #1C1C1C', color: '#585854' }}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Campaign list
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs mb-1" style={{ color: '#585854' }}>TRPG</p>
          <p className="font-display text-2xl tracking-widest uppercase" style={{ color: '#F0EEE8' }}>TRPG 관리</p>
        </div>
        <button
          onClick={() => setCampaignView('create-campaign')}
          className="flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-widest cursor-pointer whitespace-nowrap"
          style={{ border: '1px solid rgba(110,207,184,0.3)', backgroundColor: 'rgba(110,207,184,0.08)', color: '#6ECFB8' }}
        >
          + 새 캠페인
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-mono text-xs" style={{ color: '#383834' }}>캠페인이 없어요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => {
            const cSessions = sessions.filter((s) => s.campaign_id === campaign.id);
            return (
              <div
                key={campaign.id}
                className="p-5 transition-colors"
                style={{ border: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}
              >
                <div className="flex items-start gap-4">
                  {campaign.image && (
                    <div style={{ width: '72px', height: '44px', flexShrink: 0, border: '1px solid #1C1C1C', overflow: 'hidden' }}>
                      <img src={campaign.image} alt="" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm" style={{ color: '#F0EEE8' }}>{campaign.title}</p>
                      <span className="font-mono text-xs" style={{ color: '#383834' }}>{campaign.title_en}</span>
                      <span className="font-mono px-2 py-0.5" style={{ border: '1px solid #1C1C1C', color: getStatusColor(campaign.status), fontSize: '10px' }}>
                        {campaign.status}
                      </span>
                      {!campaign.is_active && (
                        <span className="font-mono text-xs px-2 py-0.5" style={{ border: '1px solid #1C1C1C', color: '#383834' }}>HIDDEN</span>
                      )}
                    </div>
                    <p className="font-mono text-xs" style={{ color: '#383834' }}>
                      {campaign.system} · GM {campaign.gm} · {cSessions.length}세션
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setSelectedCampaign(campaign); setSessionView('sessions'); }}
                      className="px-3 py-1.5 font-mono cursor-pointer whitespace-nowrap transition-colors"
                      style={{ border: '1px solid #1C1C1C', color: '#A0A098', fontSize: '10px' }}
                      title="세션 관리"
                    >
                      세션 관리
                    </button>
                    <button onClick={() => toggleCampaignActive(campaign)} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: campaign.is_active ? '#6ECFB8' : '#383834' }}>
                      <i className={campaign.is_active ? 'ri-eye-line' : 'ri-eye-off-line'} />
                    </button>
                    <button onClick={() => { setEditCampaign(campaign); setCampaignView('edit-campaign'); }} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#A0A098' }}>
                      <i className="ri-edit-line" />
                    </button>
                    <button onClick={() => setDeleteCampaignConfirm(campaign.id)} className="w-8 h-8 flex items-center justify-center cursor-pointer" style={{ border: '1px solid #1C1C1C', color: '#585854' }}>
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteCampaignConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(8,8,8,0.85)' }}>
          <div className="w-80 p-8" style={{ border: '1px solid #1C1C1C', backgroundColor: '#0C0C0C' }}>
            <p className="font-mono text-xs mb-3" style={{ color: '#585854' }}>CONFIRM DELETE</p>
            <p className="text-sm mb-2" style={{ color: '#A0A098' }}>이 캠페인을 삭제할까요?</p>
            <p className="text-xs mb-6" style={{ color: '#585854' }}>캠페인에 포함된 모든 세션도 함께 삭제돼요.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteCampaign(deleteCampaignConfirm)} className="flex-1 py-2.5 font-mono text-xs cursor-pointer whitespace-nowrap" style={{ border: '1px solid rgba(207,110,110,0.3)', backgroundColor: 'rgba(207,110,110,0.1)', color: '#CF6E6E' }}>삭제</button>
              <button onClick={() => setDeleteCampaignConfirm(null)} className="flex-1 py-2.5 font-mono text-xs cursor-pointer whitespace-nowrap" style={{ border: '1px solid #1C1C1C', color: '#585854' }}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
