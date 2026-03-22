import type { ChatMessage } from '../../../types/archive';

interface Props {
  messages: ChatMessage[];
  participants?: string[];
}

export default function ChatBubbleView({ messages, participants }: Props) {
  if (!messages || messages.length === 0) return null;

  const uniqueSenders = participants ?? [...new Set(messages.filter((m) => !m.isMe).map((m) => m.sender))];

  const senderColors: string[] = ['#C8A870', '#A0A098', '#8B9DBF', '#B8A0C8'];
  const senderColorMap: Record<string, string> = {};
  uniqueSenders.forEach((s, i) => {
    senderColorMap[s] = senderColors[i % senderColors.length];
  });

  let lastSender = '';

  return (
    <div>
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-4 py-3 mb-2"
        style={{ borderBottom: '1px solid #1C1C1C', backgroundColor: 'rgba(255,255,255,0.01)' }}
      >
        <i className="ri-chat-3-line" style={{ color: '#383834', fontSize: '14px' }} />
        <p className="font-mono" style={{ fontSize: '10px', color: '#383834', letterSpacing: '0.08em' }}>
          역극 대화 기록 — {messages.length}줄
        </p>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#1C1C1C' }} />
        <div className="flex items-center gap-2">
          {uniqueSenders.map((s) => (
            <span key={s} className="font-mono" style={{ fontSize: '10px', color: senderColorMap[s] ?? '#585854' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        className="p-4 space-y-1"
        style={{ backgroundColor: '#030303', minHeight: '120px' }}
      >
        {messages.map((msg) => {
          const showSender = msg.sender !== lastSender;
          lastSender = msg.sender;

          return (
            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} ${showSender ? 'mt-3' : 'mt-0.5'}`}>
              {showSender && (
                <span
                  className="font-mono mb-1 px-1"
                  style={{
                    fontSize: '13px',
                    color: msg.isMe ? 'rgba(110,207,184,0.6)' : (senderColorMap[msg.sender] ?? '#585854'),
                    letterSpacing: '0.05em',
                  }}
                >
                  {msg.sender}
                </span>
              )}
              <div className="flex items-end gap-2">
                {msg.isMe && msg.time && (
                  <span className="font-mono flex-shrink-0" style={{ fontSize: '11px', color: '#282828' }}>
                    {msg.time}
                  </span>
                )}
                <div
                  className="max-w-sm px-3 py-2 text-base leading-relaxed"
                  style={{
                    backgroundColor: msg.isMe ? 'rgba(110,207,184,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${msg.isMe ? 'rgba(110,207,184,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    color: msg.isMe ? '#B0E8D8' : '#A0A098',
                    borderRadius: '3px',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
                {!msg.isMe && msg.time && (
                  <span className="font-mono flex-shrink-0" style={{ fontSize: '11px', color: '#282828' }}>
                    {msg.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
