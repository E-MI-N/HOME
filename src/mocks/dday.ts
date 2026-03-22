export interface DdayEvent {
  id: number;
  label: string;
  labelEn: string;
  date: string; // YYYY-MM-DD
  category: 'campaign' | 'birthday' | 'milestone' | 'event';
  color?: string;
}

export const ddayEvents: DdayEvent[] = [
  {
    id: 1,
    label: '아라엘의 생일',
    labelEn: "ARAEL'S BIRTHDAY",
    date: '2026-07-15',
    category: 'birthday',
    color: '#6ECFB8',
  },
  {
    id: 2,
    label: '폐허의 별빛 — 차회',
    labelEn: 'RUINS OF STARLIGHT NEXT SESSION',
    date: '2026-03-29',
    category: 'campaign',
    color: '#8EEBD8',
  },
  {
    id: 3,
    label: '알케마 협회 추방일',
    labelEn: 'EXILE ANNIVERSARY',
    date: '2026-05-03',
    category: 'milestone',
    color: '#F0EEE8',
  },
  {
    id: 4,
    label: '신규 일러스트 공개',
    labelEn: 'NEW ILLUST REVEAL',
    date: '2026-04-01',
    category: 'event',
    color: '#6ECFB8',
  },
  {
    id: 5,
    label: '기억의 실 캠페인 1주년',
    labelEn: 'THREAD OF MEMORY 1ST ANNIVERSARY',
    date: '2026-06-20',
    category: 'campaign',
    color: '#8EEBD8',
  },
];

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  label: string;
  type: 'session' | 'birthday' | 'art' | 'memo';
}

export const calendarEvents: CalendarEvent[] = [
  { date: '2026-03-21', label: '오늘', type: 'memo' },
  { date: '2026-03-25', label: '일러스트 의뢰 마감', type: 'art' },
  { date: '2026-03-29', label: '폐허의 별빛 세션', type: 'session' },
  { date: '2026-04-01', label: '신규 일러스트 공개', type: 'art' },
  { date: '2026-03-15', label: '세션 완료', type: 'session' },
];
