export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time?: string;
  isMe: boolean;
}

export interface ArchiveEntry {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  preview: string;
  content: string;
  chat_messages: ChatMessage[] | null;
  is_active: boolean;
  display_order: number;
  thumbnail_url?: string | null;
  created_at: string;
  updated_at: string;
}

export const ARCHIVE_CATEGORIES = ['독백', '에세이', '조사 기록', '외전', '설정 자료', '역극'] as const;
