import { useState } from 'react';
import type { TrpgCampaign } from '../../../types/trpg';
import HtmlEditor from '../../../components/base/HtmlEditor';

interface Props {
  campaign?: TrpgCampaign | null;
  onSave: (data: Partial<TrpgCampaign>) => void;
  onCancel: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'transparent',
  border: '1px solid #1C1C1C',
  color: '#F0EEE8',
  padding: '10px 12px',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'monospace',
  fontSize: '10px',
  color: '#585854',
  letterSpacing: '0.05em',
  marginBottom: '6px',
};

const STATUS_OPTIONS = ['진행 중', '완료', '준비 중'] as const;

export default function TrpgCampaignForm({ campaign, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(campaign?.title ?? '');
  const [titleEn, setTitleEn] = useState(campaign?.title_en ?? '');
  const [system, setSystem] = useState(campaign?.system ?? 'D&D 5e');
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>(
    (campaign?.status as typeof STATUS_OPTIONS[number]) ?? '진행 중'
  );
  const [startDate, setStartDate] = useState(campaign?.start_date ?? '');
  const [endDate, setEndDate] = useState(campaign?.end_date ?? '');
  const [description, setDescription] = useState(campaign?.description ?? '');
  const [gm, setGm] = useState(campaign?.gm ?? '');
  const [playerCount, setPlayerCount] = useState(campaign?.player_count ?? 4);
  const [image, setImage] = useState(campaign?.image ?? '');
  const [displayOrder, setDisplayOrder] = useState(campaign?.display_order ?? 1);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      title_en: titleEn.trim(),
      system: system.trim(),
      status,
      start_date: startDate.trim(),
      end_date: endDate.trim() || undefined,
      description: description.trim(),
      gm: gm.trim(),
      player_count: playerCount,
      image: image.trim(),
      display_order: displayOrder,
      is_active: campaign?.is_active ?? true,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>캠페인 이름 *</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="폐허의 별빛" />
        </div>
        <div>
          <label style={labelStyle}>영문 이름</label>
          <input style={inputStyle} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Stars Among Ruins" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>시스템</label>
          <input style={inputStyle} value={system} onChange={(e) => setSystem(e.target.value)} placeholder="D&D 5e" />
        </div>
        <div>
          <label style={labelStyle}>상태</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof STATUS_OPTIONS[number])}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} style={{ backgroundColor: '#0C0C0C' }}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>플레이어 수</label>
          <input
            type="number"
            style={inputStyle}
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            min={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>시작일</label>
          <input style={inputStyle} value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="2025.10.05" />
        </div>
        <div>
          <label style={labelStyle}>종료일 (완료 시)</label>
          <input style={inputStyle} value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="2025.08.10" />
        </div>
        <div>
          <label style={labelStyle}>GM</label>
          <input style={inputStyle} value={gm} onChange={(e) => setGm(e.target.value)} placeholder="DM 별빛" />
        </div>
      </div>

      <div>
        <label style={labelStyle}>캠페인 설명 (HTML 가능)</label>
        <HtmlEditor
          value={description}
          onChange={setDescription}
          minHeight={120}
          placeholder="<p>캠페인 소개 문장</p>"
        />
      </div>

      <div>
        <label style={labelStyle}>배너 이미지 URL</label>
        <input style={inputStyle} value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        {image && (
          <div className="mt-2 overflow-hidden" style={{ height: '80px', border: '1px solid #1C1C1C' }}>
            <img src={image} alt="" className="w-full h-full object-cover object-top" />
          </div>
        )}
      </div>

      <div>
        <label style={labelStyle}>표시 순서</label>
        <input
          type="number"
          style={{ ...inputStyle, width: '120px' }}
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid #1C1C1C' }}>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-3 font-mono text-xs cursor-pointer whitespace-nowrap"
          style={{
            border: '1px solid rgba(110,207,184,0.3)',
            backgroundColor: 'rgba(110,207,184,0.08)',
            color: '#6ECFB8',
          }}
        >
          저장
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 font-mono text-xs cursor-pointer whitespace-nowrap"
          style={{ border: '1px solid #1C1C1C', color: '#585854' }}
        >
          취소
        </button>
      </div>
    </div>
  );
}
