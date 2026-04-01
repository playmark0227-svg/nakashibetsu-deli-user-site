import { supabase, Review } from '../supabase';

// すべてのレビューを取得
export async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

// 女の子のレビューを取得
export async function getReviewsByGirlId(girlId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('girl_id', girlId)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

// 店舗のレビューを取得
export async function getReviewsByShopId(shopId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('shop_id', shopId)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

// レビューを作成
export async function createReview(
  review: Omit<Review, 'id' | 'verified' | 'approved' | 'created_at'>
): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ ...review, verified: false, approved: false }])
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    return null;
  }

  return data;
}

// レビューを承認
export async function approveReview(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('reviews')
    .update({ approved: true })
    .eq('id', id);

  if (error) {
    console.error('Error approving review:', error);
    return false;
  }

  return true;
}

// レビューを削除
export async function deleteReview(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting review:', error);
    return false;
  }

  return true;
}

// 女の子の平均評価を取得
export async function getAverageRating(girlId: string): Promise<number> {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('girl_id', girlId)
    .eq('approved', true);

  if (error || !data || data.length === 0) {
    return 0;
  }

  const sum = data.reduce((acc, review) => acc + review.rating, 0);
  return sum / data.length;
}
