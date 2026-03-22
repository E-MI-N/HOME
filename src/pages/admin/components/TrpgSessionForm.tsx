import { useState } from 'react';
import type { TrpgSession } from '../../../types/trpg';
import HtmlEditor from '../../../components/base/HtmlEditor';

interface Props {
  session?: TrpgSession | null;
  campaignId: string;
  defaultOrder?: number;
  onSave: (data: Partial<TrpgSession>) => void;
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

export default function TrpgSessionForm({ session, campaignId, defaultOrder = 1, onSave, onCancel }: Props) {
  const [sessionNumber, setSessionNumber] = useState(session?.session_number ?? defaultOrder);
  const [title, setTitle] = useState(session?.title ?? '');
  const [date, setDate] = useState(session?.date ?? '');
  const [summary, setSummary] = useState(session?.summary ?? '');
  const [highlightsInput, setHighlightsInput] = useState(session?.highlights?.join('\n') ?? '');
  const [image, setImage] = useState(session?.image ?? '');
  const [status, setStatus] = useState<'완료' | '예정'>(session?.status ?? '예정');
  const [displayOrder, setDisplayOrder] = useState(session?.display_order ?? defaultOrder);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      campaign_id: campaignId,
      session_number: sessionNumber,
      title: title.trim(),
      date: date.trim(),
      summary: summary.trim(),
      highlights: highlightsInput
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      image: image.trim(),
      status,
      display_order: displayOrder,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label style={labelStyle}>세션 번호</label>
          <input
            type="number"
            style={inputStyle}
            value={sessionNumber}
            onChange={(e) => setSessionNumber(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label style={labelStyle}>날짜</label>
          <input style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} placeholder="2025.10.05" />
        </div>
        <div>
          <label style={labelStyle}>상태</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={status}
            onChange={(e) => setStatus(e.target.value as '완료' | '예정')}
          >
            <option value="완료" style={{ backgroundColor: '#0C0C0C' }}>완료</option>
            <option value="예정" style={{ backgroundColor: '#0C0C0C' }}>예정</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>세션 제목 *</label>
        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="첫 만남과 폐허의 도시" />
      </div>

      <div>
        <label style={labelStyle}>세션 요약 (HTML 가능)</label>
        <HtmlEditor
          value={summary}
          onChange={setSummary}
          minHeight={140}
          placeholder="<p>이번 세션에서 일어난 일을 서술해주세요</p>"
        />
      </div>

      <div>
        <label style={labelStyle}>하이라이트 (줄바꿈으로 구분)</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={highlightsInput}
          onChange={(e) => setHighlightsInput(e.target.value)}
          placeholder={`루카스와 첫 만남\n망각 마법 흔적 발견`}
        />
      </div>

      <div>
        <label style={labelStyle}>세션 이미지 URL</label>
        <input style={inputStyle} value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        {image && (
          <div className="mt-2 overflow-hidden" style={{ height: '70px', border: '1px solid #1C1C1C' }}>
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
