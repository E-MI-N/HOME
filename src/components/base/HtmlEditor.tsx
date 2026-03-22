import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  minHeight?: number;
  placeholder?: string;
}

interface ToolBtn {
  label: string;
  title: string;
  wrap?: [string, string]; // wrap selection
  insert?: string;          // insert at cursor
}

const TOOLS: ToolBtn[] = [
  { label: 'B',  title: '굵게',         wrap: ['<strong>', '</strong>'] },
  { label: 'I',  title: '기울임',        wrap: ['<em>', '</em>'] },
  { label: 'U',  title: '밑줄',          wrap: ['<u>', '</u>'] },
  { label: 'H4', title: '소제목',        wrap: ['<h4>', '</h4>'] },
  { label: 'P',  title: '단락',          wrap: ['<p>', '</p>'] },
  { label: 'BR', title: '줄바꿈',        insert: '<br>' },
  { label: '•',  title: '리스트 항목',   wrap: ['<li>', '</li>'] },
  { label: 'UL', title: '리스트 감싸기', wrap: ['<ul>\n', '\n</ul>'] },
  { label: '💬', title: '인용',         wrap: ['<blockquote>', '</blockquote>'] },
  { label: 'RED',    title: '붉은 텍스트',   wrap: ['<span style="color:#CF6E6E">', '</span>'] },
  { label: 'MINT',   title: '민트 텍스트',   wrap: ['<span style="color:#6ECFB8">', '</span>'] },
  { label: 'GOLD',   title: '황금 텍스트',   wrap: ['<span style="color:#C8A870">', '</span>'] },
  { label: 'GRAY',   title: '회색 텍스트',   wrap: ['<span style="color:#808078">', '</span>'] },
  { label: 'SM',     title: '작은 글씨',     wrap: ['<small>', '</small>'] },
];

export default function HtmlEditor({ value, onChange, minHeight = 160, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const applyTool = (tool: ToolBtn) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    let newText: string;
    let newCursor: number;

    if (tool.insert) {
      newText = value.slice(0, start) + tool.insert + value.slice(end);
      newCursor = start + tool.insert.length;
    } else if (tool.wrap) {
      const [open, close] = tool.wrap;
      newText = value.slice(0, start) + open + selected + close + value.slice(end);
      newCursor = start + open.length + selected.length + close.length;
    } else {
      return;
    }

    onChange(newText);
    // Restore focus + cursor after React re-render
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursor, newCursor);
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#F0EEE8',
    padding: '12px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'monospace',
    resize: 'vertical',
    minHeight: `${minHeight}px`,
    lineHeight: '1.6',
  };

  return (
    <div style={{ border: '1px solid #1C1C1C' }}>
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
        style={{ borderBottom: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.02)' }}
      >
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.title}
            onClick={() => applyTool(tool)}
            className="px-2 py-1 font-mono cursor-pointer transition-colors whitespace-nowrap"
            style={{ fontSize: '10px', color: '#585854', border: '1px solid transparent' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#6ECFB8';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(110,207,184,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#585854';
              (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
            }}
          >
            {tool.label}
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="px-3 py-1 font-mono cursor-pointer whitespace-nowrap transition-colors"
          style={{
            fontSize: '10px',
            border: `1px solid ${preview ? 'rgba(110,207,184,0.3)' : '#1C1C1C'}`,
            color: preview ? '#6ECFB8' : '#585854',
            backgroundColor: preview ? 'rgba(110,207,184,0.07)' : 'transparent',
          }}
        >
          {preview ? 'HTML 보기' : '미리보기'}
        </button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          className="px-4 py-3 prose-trpg overflow-auto"
          style={{
            minHeight: `${minHeight}px`,
            color: '#A0A098',
            fontSize: '13px',
            lineHeight: '1.7',
          }}
          dangerouslySetInnerHTML={{ __html: value || '<span style="color:#383834">미리보기할 내용이 없어요</span>' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={placeholder ?? '<p>HTML을 입력하세요</p>'}
          spellCheck={false}
        />
      )}
    </div>
  );
}
