import { useState } from 'react';
import type { ArchiveEntry } from '../../../types/archive';
import { useInView } from '../../../hooks/useInView';
import ChatBubbleView from './ChatBubbleView';

interface ArchiveCardProps {
  entry: ArchiveEntry;
  index: number;
}

export default function ArchiveCard({ entry, index }: ArchiveCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { ref, inView } = useInView();
  const isChat = !!(entry.chat_messages && entry.chat_messages.length > 0);

  return (
    <div
      ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} border transition-colors duration-300`}
      style={{
        transitionDelay: `${(index % 4) * 70}ms`,
        border: `1px solid ${expanded ? (isChat ? 'rgba(200,168,112,0.2)' : 'rgba(110, 207, 184, 0.2)') : '#1C1C1C'}`,
        backgroundColor: expanded ? 'rgba(255,255,255,0.01)' : 'transparent',
      }}
    >
      <button className="w-full text-left p-5 md:p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Number + Date + Category */}
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs" style={{ color: '#383834' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-xs" style={{ color: '#383834' }}>
                {entry.date}
              </span>
              <span
                className="font-mono text-xs px-2 py-0.5"
                style={{ border: '1px solid #1C1C1C', color: '#585854', fontSize: '10px' }}
              >
                {entry.category}
              </span>
              {isChat && (
                <span className="font-mono flex items-center gap-1" style={{ fontSize: '10px', color: '#C8A870' }}>
                  <i className="ri-chat-3-line" />
                  대화
                </span>
              )}
            </div>
            <h3
              className="font-serif text-lg leading-snug mb-2 transition-colors duration-200"
              style={{ color: expanded ? (isChat ? '#C8A870' : '#6ECFB8') : '#F0EEE8' }}
            >
              {entry.title}
            </h3>
            {!expanded && (
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#585854' }}>
                {entry.preview}
              </p>
            )}
          </div>
          {/* Toggle */}
          <div
            className="font-mono text-sm flex-shrink-0 transition-transform duration-300"
            style={{ color: '#585854', transform: expanded ? 'rotate(45deg)' : 'none' }}
          >
            +
          </div>
        </div>
      </button>

      {expanded && (
        <div className="pb-6">
          <div style={{ height: '1px', backgroundColor: '#1C1C1C', marginBottom: '0' }} />

          {isChat ? (
            <ChatBubbleView messages={entry.chat_messages!} />
          ) : (
            <div
              className="px-5 md:px-6 pt-5 archive-html-content"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          )}

          <div className="flex flex-wrap gap-2 mt-5 px-5 md:px-6">
            {entry.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
