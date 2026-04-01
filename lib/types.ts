// データ型定義
// ※ Supabaseの実際の型定義は lib/supabase.ts を参照してください

export interface Booking {
  id: string;
  girl_id: string | null;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  booking_date: string;
  time_slot: string;
  duration: number;
  total_price: number;
  notes?: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface FilterOptions {
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  bustMin?: number;
  bustMax?: number;
  availableOptions?: string[];
  shopId?: string;
  isNew?: boolean;
}

// キャスト出勤スケジュール
export interface GirlSchedule {
  id: string;
  girl_id: string;
  shop_id: string;
  date: string; // YYYY-MM-DD
  status: 'working' | 'scheduled' | 'off' | 'unknown';
  instant_available: boolean; // ソク姫対応可否
  start_time?: string; // HH:MM
  end_time?: string; // HH:MM
  notes?: string;
  updated_at: string;
  updated_by?: string;
}

// キャストと出勤状況を結合した型（supabase.tsのGirlを使うこと）
export interface GirlWithScheduleInfo {
  schedule_status?: 'working' | 'scheduled' | 'off' | 'unknown';
  instant_available?: boolean;
  work_start_time?: string;
  work_end_time?: string;
  schedule_notes?: string;
  status_updated_at?: string;
}
