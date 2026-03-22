import { TrpgCampaign } from '../../../mocks/trpg';
import { useInView } from '../../../hooks/useInView';

export default function CampaignBanner({ campaign }: { campaign: TrpgCampaign }) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} relative overflow-hidden mb-10 border`}
      style={{ border: '1px solid #1C1C1C' }}>
      <div className="relative" style={{ height: '200px' }}>
        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(8,8,8,0.95) 40%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,0.2))' }} />

        {/* Film corner marks — mint */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
          <div key={i} className={`absolute w-3 h-3 ${pos}`} style={{
            borderTop: i < 2 ? '1px solid rgba(110, 207, 184, 0.3)' : 'none',
            borderBottom: i >= 2 ? '1px solid rgba(110, 207, 184, 0.3)' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid rgba(110, 207, 184, 0.3)' : 'none',
            borderRight: i % 2 === 1 ? '1px solid rgba(110, 207, 184, 0.3)' : 'none',
          }} />
        ))}

        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs px-2 py-1"
                style={{
                  border: `1px solid ${campaign.status === '진행 중' ? 'rgba(110, 207, 184, 0.35)' : '#1C1C1C'}`,
                  color: campaign.status === '진행 중' ? '#6ECFB8' : '#585854',
                  backgroundColor: 'rgba(8,8,8,0.7)', fontSize: '10px',
                }}>
                {campaign.status}
              </span>
              <span className="font-mono text-xs" style={{ color: '#585854', fontSize: '10px' }}>{campaign.system}</span>
            </div>
            <h3 className="font-display text-3xl tracking-wide mb-1" style={{ color: '#F0EEE8' }}>{campaign.title}</h3>
            <p className="font-serif italic text-sm mb-3" style={{ color: '#585854' }}>{campaign.titleEn}</p>
            <div
              className="text-xs leading-relaxed mb-4 trpg-html-content"
              style={{ color: '#808078', maxWidth: '380px' }}
              dangerouslySetInnerHTML={{ __html: campaign.description ?? '' }}
            />
            <div className="flex items-center gap-5">
              {[
                { label: 'DM', value: campaign.gm },
                { label: 'PLAYERS', value: `${campaign.playerCount}P` },
                { label: 'START', value: campaign.startDate },
                ...(campaign.endDate ? [{ label: 'END', value: campaign.endDate }] : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-mono text-xs" style={{ color: '#383834', fontSize: '10px' }}>{label}</p>
                  <p className="font-mono text-xs" style={{ color: '#808078' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
