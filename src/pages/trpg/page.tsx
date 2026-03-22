import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { TrpgCampaign, TrpgSession } from '../../types/trpg';
import CampaignBanner from './components/CampaignBanner';
import SessionCard from './components/SessionCard';
import { useInView } from '../../hooks/useInView';
import StarField from '../../components/base/StarField';

function StatsPanel() {
  const { ref, inView } = useInView();
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    supabase
      .from('characters')
      .select('stats')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.stats) setStats(data.stats as Record<string, number>);
      });
  }, []);

  if (!stats) return null;

  const labels: Record<string, string> = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };

  return (
    <div ref={ref} className={`anim-element ${inView ? 'is-visible' : ''} border p-6 mb-10`} style={{ border: '1px solid #1C1C1C' }}>
      <p className="font-mono text-sm mb-5" style={{ color: '#585854' }}>CHARACTER STATS</p>
      <div className="grid grid-cols-6 gap-3">
        {Object.entries(stats).map(([key, val]) => {
          const mod = Math.floor((val - 10) / 2);
          const isHigh = val >= 16;
          return (
            <div key={key} className="text-center">
              <p className="font-mono text-xs mb-1" style={{ color: '#383834', fontSize: '12px' }}>{labels[key] ?? key.toUpperCase()}</p>
              <p className="font-display text-xl" style={{ color: isHigh ? '#6ECFB8' : '#A0A098' }}>{val}</p>
              <p className="font-mono text-xs" style={{ color: '#383834', fontSize: '12px' }}>{mod >= 0 ? `+${mod}` : mod}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrpgPage() {
  const [campaigns, setCampaigns] = useState<TrpgCampaign[]>([]);
  const [sessions, setSessions] = useState<TrpgSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCampaignId, setActiveCampaignId] = useState<string>('');
  const { ref, inView } = useInView();

  useEffect(() => {
    Promise.all([
      supabase.from('trpg_campaigns').select('*').eq('is_active', true).order('display_order', { ascending: true }),
      supabase.from('trpg_sessions').select('*').order('display_order', { ascending: true }),
    ]).then(([{ data: cData }, { data: sData }]) => {
      const c = cData ?? [];
      setCampaigns(c);
      setSessions(sData ?? []);
      if (c.length > 0) setActiveCampaignId(c[0].id);
      setLoading(false);
    });
  }, []);

  const campaign = campaigns.find((c) => c.id === activeCampaignId) ?? campaigns[0];
  const campaignSessions = campaign ? sessions.filter((s) => s.campaign_id === campaign.id) : [];

  const mockCampaign = campaign ? {
    id: Number(campaign.id) || 1,
    title: campaign.title,
    titleEn: campaign.title_en,
    system: campaign.system,
    status: campaign.status as '진행 중' | '완료' | '준비 중',
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    description: campaign.description,
    gm: campaign.gm,
    playerCount: campaign.player_count,
    image: campaign.image,
    sessions: [],
  } : null;

  const mockSessions = campaignSessions.map((s) => ({
    id: s.id as unknown as number,
    sessionNumber: s.session_number,
    title: s.title,
    date: s.date,
    summary: s.summary,
    highlights: s.highlights,
    image: s.image,
    status: s.status as '완료' | '예정',
  }));

  return (
    <div>
      <div className="relative pt-28 pb-12 overflow-hidden" style={{ borderBottom: '1px solid #1C1C1C', backgroundColor: '#080808' }}>
        <StarField count={40} />
        <div className="relative px-6 md:px-10 z-10">
          <p className="font-mono text-xs mb-4 flex items-center gap-3" style={{ color: '#585854' }}>
            <span style={{ display: 'inline-block', width: '20px', height: '1px', backgroundColor: '#C8A870' }} />
            04 / TRPG
          </p>
          <h1 className="font-display leading-none uppercase" style={{ fontSize: 'clamp(60px, 10vw, 140px)', color: '#F0EEE8', letterSpacing: '-0.01em' }}>
            TRPG
          </h1>
          <p className="font-serif italic mt-2" style={{ color: '#585854' }}>Campaign Chronicles · 캠페인 기록</p>
        </div>
      </div>

      <div className="px-6 md:px-10 py-16">
        {loading ? (
          <div className="py-32 text-center font-mono text-sm" style={{ color: '#383834' }}>LOADING...</div>
        ) : (
          <>
            <StatsPanel />

            <div ref={ref} className={`anim-element ${inView ? 'is-visible' : ''} flex flex-wrap gap-2 mb-8`}>
              {campaigns.map((c) => (
                <button
                  key={c.id}
                  className="flex items-center gap-2 px-4 py-2 font-mono text-sm tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap"
                  style={{
                    border: `1px solid ${activeCampaignId === c.id ? 'rgba(110, 207, 184, 0.3)' : '#1C1C1C'}`,
                    backgroundColor: activeCampaignId === c.id ? 'rgba(110, 207, 184, 0.06)' : 'transparent',
                    color: activeCampaignId === c.id ? '#6ECFB8' : '#585854',
                  }}
                  onClick={() => setActiveCampaignId(c.id)}
                >
                  {c.title}
                  <span className="font-mono text-xs px-1.5 py-0.5" style={{ border: '1px solid #1C1C1C', color: c.status === '진행 중' ? '#6ECFB8' : '#383834', fontSize: '12px' }}>
                    {c.status}
                  </span>
                </button>
              ))}
            </div>

            {mockCampaign && <CampaignBanner campaign={mockCampaign} />}

            <div>
              <p className="font-mono text-sm mb-6" style={{ color: '#585854' }}>SESSION RECORDS</p>
              {mockSessions.map((session, i) => (
                <SessionCard key={session.id} session={session} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
