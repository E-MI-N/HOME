export interface TrpgSession {
  id: string;
  campaign_id: string;
  session_number: number;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
  image: string;
  status: '완료' | '예정';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TrpgCampaign {
  id: string;
  title: string;
  title_en: string;
  system: string;
  status: '진행 중' | '완료' | '준비 중';
  start_date: string;
  end_date?: string;
  description: string;
  gm: string;
  player_count: number;
  image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sessions?: TrpgSession[];
}
