import { useState } from 'react';
import type { ArchiveEntry, ChatMessage } from '../../../types/archive';
import { ARCHIVE_CATEGORIES } from '../../../types/archive';
import ImageUpload from '../../../components/base/ImageUpload';
import HtmlEditor from '../../../components/base/HtmlEditor';

interface Props {
  entry?: ArchiveEntry | null;
  onSave: (data: Partial<ArchiveEntry>) => void;
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

export default function ArchiveForm({ entry, onSave, onCancel }: Props) {
  const isChatEntry = !!(entry?.chat_messages && entry.chat_messages.length > 0);

  const [title, setTitle] = useState(entry?.title ?? '');
  const [date, setDate] = useState(entry?.date ?? '');
  const [category, setCategory] = useState(entry?.category ?? ARCHIVE_CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState(entry?.tags?.join(', ') ?? '');
  const [preview, setPreview] = useState(entry?.preview ?? '');
  const [content, setContent] = useState(entry?.content ?? '');
  const [isChat, setIsChat] = useState(isChatEntry);
  const [messages, setMessages] = useState<ChatMessage[]>(entry?.chat_messages ?? []);
  const [displayOrder, setDisplayOrder] = useState(entry?.display_order ?? 1);
  const [thumbnailUrl, setThumbnailUrl] = useState(entry?.thumbnail_url ?? '');

  // New message compose state
  const [composeSender, setComposeSender] = useState('아라엘');
  const [composeText, setComposeText] = useState('');
  const [composeTime, setComposeTime] = useState('');
  const [composeIsMe, setComposeIsMe] = useState(true);

  const addMessage = () => {
    if (!composeText.trim()) return;
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: composeSender.trim() || '???',
      text: composeText.trim(),
      time: composeTime.trim() || undefined,
      isMe: composeIsMe,
    };
    setMessages((prev) => [...prev, newMsg]);
    setComposeText('');
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const moveMessage = (index: number, dir: -1 | 1) => {
    const newArr = [...messages];
    const target = index + dir;
    if (target < 0 || target >= newArr.length) return;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    setMessages(newArr);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      date: date.trim(),
      category,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      preview: preview.trim(),
      content: isChat ? '' : content.trim(),
      chat_messages: isChat && messages.length > 0 ? messages : null,
      display_order: displayOrder,
      is_active: entry?.is_active ?? true,
      thumbnail_url: thumbnailUrl || null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>TITLE *</label>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
        </div>
        <div>
          <label style={labelStyle}>DATE</label>
          <input style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026.03.10" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>CATEGORY</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {ARCHIVE_CATEGORIES.map((c) => (
              <option key={c} value={c} style={{ backgroundColor: '#0C0C0C' }}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>DISPLAY ORDER</label>
          <input
            type="number"
            style={inputStyle}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>TAGS (쉼표로 구분)</label>
        <input style={inputStyle} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="감성, TRPG, 외전" />
      </div>

      <div>
        <label style={labelStyle}>PREVIEW</label>
        <textarea
          style={{ ...inputStyle, minHeight: '64px', resize: 'vertical' }}
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder="목록에서 보이는 짧은 미리보기 텍스트"
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label style={labelStyle}>썸네일 이미지 (선택)</label>
        <ImageUpload
          value={thumbnailUrl}
          onChange={setThumbnailUrl}
          aspect="landscape"
          folder="archive"
        />
      </div>

      {/* Content type toggle */}
      <div>
        <label style={labelStyle}>CONTENT TYPE</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsChat(false)}
            className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap transition-colors"
            style={{
              border: `1px solid ${!isChat ? 'rgba(110,207,184,0.4)' : '#1C1C1C'}`,
              backgroundColor: !isChat ? 'rgba(110,207,184,0.08)' : 'transparent',
              color: !isChat ? '#6ECFB8' : '#585854',
            }}
          >
            일반 글
          </button>
          <button
            type="button"
            onClick={() => setIsChat(true)}
            className="px-4 py-2 font-mono text-xs cursor-pointer whitespace-nowrap transition-colors"
            style={{
              border: `1px solid ${isChat ? 'rgba(110,207,184,0.4)' : '#1C1C1C'}`,
              backgroundColor: isChat ? 'rgba(110,207,184,0.08)' : 'transparent',
              color: isChat ? '#6ECFB8' : '#585854',
            }}
          >
            역극 대화
          </button>
        </div>
      </div>

      {/* Text content */}
      {!isChat && (
        <div>
          <label style={labelStyle}>CONTENT (HTML 가능)</label>
          <HtmlEditor
            value={content}
            onChange={setContent}
            minHeight={200}
            placeholder="<p>본문 내용을 입력하세요</p>"
          />
        </div>
      )}

      {/* Chat editor */}
      {isChat && (
        <div>
          <label style={labelStyle}>역극 대화 편집기</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Preview */}
            <div
              className="overflow-y-auto p-4 space-y-2"
              style={{
                border: '1px solid #1C1C1C',
                backgroundColor: '#050505',
                maxHeight: '380px',
                minHeight: '200px',
              }}
            >
              {messages.length === 0 ? (
                <p className="font-mono text-xs text-center mt-8" style={{ color: '#383834' }}>
                  메시지를 추가하세요
                </p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                    <span className="font-mono mb-1" style={{ fontSize: '10px', color: '#383834' }}>
                      {m.sender}
                    </span>
                    <div
                      className="max-w-xs px-3 py-2 text-xs leading-relaxed"
                      style={{
                        backgroundColor: m.isMe ? 'rgba(110,207,184,0.15)' : '#111',
                        border: `1px solid ${m.isMe ? 'rgba(110,207,184,0.3)' : '#1C1C1C'}`,
                        color: m.isMe ? '#6ECFB8' : '#A0A098',
                        borderRadius: '4px',
                      }}
                    >
                      {m.text}
                    </div>
                    {m.time && (
                      <span className="font-mono mt-0.5" style={{ fontSize: '10px', color: '#383834' }}>
                        {m.time}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Message list editor */}
            <div
              className="overflow-y-auto space-y-1"
              style={{ maxHeight: '380px' }}
            >
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 px-3 py-2"
                  style={{ border: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}
                >
                  <span
                    className="font-mono flex-shrink-0"
                    style={{ fontSize: '10px', color: m.isMe ? '#6ECFB8' : '#585854', minWidth: '40px' }}
                  >
                    {m.sender}
                  </span>
                  <span className="flex-1 min-w-0 text-xs truncate" style={{ color: '#A0A098' }}>
                    {m.text}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => moveMessage(i, -1)}
                      className="w-5 h-5 flex items-center justify-center cursor-pointer"
                      style={{ color: '#383834' }}
                    >
                      <i className="ri-arrow-up-s-line" style={{ fontSize: '12px' }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveMessage(i, 1)}
                      className="w-5 h-5 flex items-center justify-center cursor-pointer"
                      style={{ color: '#383834' }}
                    >
                      <i className="ri-arrow-down-s-line" style={{ fontSize: '12px' }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMessage(m.id)}
                      className="w-5 h-5 flex items-center justify-center cursor-pointer"
                      style={{ color: '#585854' }}
                    >
                      <i className="ri-delete-bin-line" style={{ fontSize: '12px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compose area */}
          <div
            className="mt-3 p-4 space-y-3"
            style={{ border: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}
          >
            <p className="font-mono" style={{ fontSize: '10px', color: '#383834', letterSpacing: '0.05em' }}>
              + 메시지 추가
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label style={{ ...labelStyle, marginBottom: '4px' }}>발신자</label>
                <input
                  style={{ ...inputStyle, padding: '7px 10px', fontSize: '12px' }}
                  value={composeSender}
                  onChange={(e) => setComposeSender(e.target.value)}
                  placeholder="이름"
                />
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: '4px' }}>시각 (선택)</label>
                <input
                  style={{ ...inputStyle, padding: '7px 10px', fontSize: '12px' }}
                  value={composeTime}
                  onChange={(e) => setComposeTime(e.target.value)}
                  placeholder="22:14"
                />
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: '4px' }}>발신 방향</label>
                <div className="flex gap-2 h-9 items-center">
                  <button
                    type="button"
                    onClick={() => setComposeIsMe(true)}
                    className="flex-1 h-full font-mono cursor-pointer whitespace-nowrap transition-colors"
                    style={{
                      border: `1px solid ${composeIsMe ? 'rgba(110,207,184,0.4)' : '#1C1C1C'}`,
                      backgroundColor: composeIsMe ? 'rgba(110,207,184,0.08)' : 'transparent',
                      color: composeIsMe ? '#6ECFB8' : '#585854',
                      fontSize: '10px',
                    }}
                  >
                    나
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposeIsMe(false)}
                    className="flex-1 h-full font-mono cursor-pointer whitespace-nowrap transition-colors"
                    style={{
                      border: `1px solid ${!composeIsMe ? 'rgba(200,168,112,0.4)' : '#1C1C1C'}`,
                      backgroundColor: !composeIsMe ? 'rgba(200,168,112,0.08)' : 'transparent',
                      color: !composeIsMe ? '#C8A870' : '#585854',
                      fontSize: '10px',
                    }}
                  >
                    상대
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <textarea
                style={{ ...inputStyle, flex: 1, minHeight: '56px', resize: 'none', padding: '8px 12px', fontSize: '12px' }}
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                placeholder="메시지 내용"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addMessage(); }
                }}
              />
              <button
                type="button"
                onClick={addMessage}
                className="px-4 font-mono text-xs cursor-pointer whitespace-nowrap self-stretch transition-colors"
                style={{
                  border: '1px solid rgba(110,207,184,0.3)',
                  backgroundColor: 'rgba(110,207,184,0.08)',
                  color: '#6ECFB8',
                }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid #1C1C1C' }}>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-3 font-mono text-xs cursor-pointer whitespace-nowrap transition-colors"
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
