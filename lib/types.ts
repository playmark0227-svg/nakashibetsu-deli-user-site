// データ型定義

export interface Booking {
  id: string;
  shop_id: string;
  girl_name?: string;
  customer_name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  options?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  businessHours: string;
  imageUrl: string;
}

export interface Girl {
  id: string;
  shopId: string;
  name: string;
  age: number;
  height: number;
  bust: number;
  waist: number;
  hip: number;
  bloodType: string;
  imageUrls: string[];
  thumbnailUrl: string;
  description: string;
  charmPoints: string[];
  availableOptions: string[];
  schedule: {
    date: string;
    available: boolean;
    timeSlots: string[];
  }[];
  ranking: number;
  viewCount: number;
  isNew: boolean;
  createdAt: string;
}

export interface PricePlan {
  duration: number; // 分
  price: number;
  shopId: string;
}

export interface Review {
  id: string;
  girlId: string;
  shopId: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
  verified: boolean;
}

export interface Booking {
  id: string;
  girlId: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
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

// キャストと出勤状況を結合した型
export interface GirlWithSchedule extends Girl {
  schedule_status?: 'working' | 'scheduled' | 'off' | 'unknown';
  instant_available?: boolean;
  work_start_time?: string;
  work_end_time?: string;
  schedule_notes?: string;
  status_updated_at?: string;
}
