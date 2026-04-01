import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export interface Shop {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  business_hours: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Girl {
  id: string;
  shop_id: string;
  name: string;
  age: number | null;
  height: number | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  blood_type: string | null;
  description: string | null;
  charm_points: string[] | null;
  available_options: string[] | null;
  thumbnail_url: string | null;
  image_urls: string[] | null;
  ranking: number;
  view_count: number;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  girl_id: string;
  shop_id: string;
  user_name: string;
  rating: number;
  comment: string;
  verified: boolean;
  approved: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  girl_id: string | null;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  time_slot: string;
  duration: number;
  total_price: number;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface PricePlan {
  id: string;
  shop_id: string;
  duration: number;
  price: number;
  created_at: string;
}

export interface Schedule {
  id: string;
  girl_id: string;
  schedule_date: string;
  available: boolean;
  time_slots: string[] | null;
  created_at: string;
}
