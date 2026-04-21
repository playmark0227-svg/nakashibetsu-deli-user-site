'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';

interface Girl {
  id: string;
  name: string;
  age: number | null;
  thumbnail_url: string | null;
  height: number | null;
  bust: number | null;
  waist?: number | null;
  hip?: number | null;
}

interface Shop {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
}

interface PricePlan {
  id: string;
  duration: number;
  price: number;
}

interface QRBookingFormProps {
  girl: Girl;
  shop: Shop;
  pricePlans: PricePlan[];
}

// 次の整数時を "HH:00" で返す
function nextHourSlot(): string {
  const now = new Date();
  const next = new Date(now.getTime() + 60 * 60 * 1000);
  return `${next.getHours().toString().padStart(2, '0')}:00`;
}

// 今日の日付 (YYYY-MM-DD)
function today(): string {
  return new Date().toISOString().split('T')[0];
}

export default function QRBookingForm({ girl, shop, pricePlans }: QRBookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // デフォルト料金プラン (DB があればそれを、なければ標準値)
  const fallbackPlans: PricePlan[] = [
    { id: 'fb-60', duration: 60, price: 12000 },
    { id: 'fb-90', duration: 90, price: 17000 },
    { id: 'fb-120', duration: 120, price: 22000 },
  ];
  const plans = pricePlans.length > 0 ? pricePlans : fallbackPlans;

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: today(),
    time: nextHourSlot(),
    planId: plans[0]?.id || '',
    requests: '',
  });

  const selectedPlan = plans.find((p) => p.id === formData.planId) || plans[0];
  const phoneHref = shop.phone ? `tel:${shop.phone.replace(/-/g, '')}` : undefined;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'お名前を入力してください';
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = '電話番号を入力してください';
    } else if (!/^[0-9\-+()\s]{10,}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = '正しい電話番号を入力してください';
    }
    if (!formData.date) newErrors.date = '日付を選んでください';
    if (!formData.time) newErrors.time = '時間を選んでください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.from('bookings').insert({
        girl_id: girl.id,
        shop_id: shop.id,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: null,
        booking_date: formData.date,
        time_slot: formData.time,
        duration: selectedPlan.duration,
        total_price: selectedPlan.price,
        notes: formData.requests || null,
        status: 'pending',
      });

      if (error) {
        console.error('Booking save error:', error);
        alert(
          'うまく予約を送信できませんでした。\n申し訳ありませんが、お店にお電話でご予約ください。\n' +
            (shop.phone || '')
        );
        setIsSubmitting(false);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/qr/${shop.id}`);
      }, 6000);
    } catch (err) {
      console.error(err);
      alert(
        'うまく予約を送信できませんでした。\n申し訳ありませんが、お店にお電話でご予約ください。\n' +
          (shop.phone || '')
      );
      setIsSubmitting(false);
    }
  };

  // 成功画面
  if (showSuccess) {
    return (
      <main className="min-h-screen bg-[#fdfbf6] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <CheckCircle2
            className="w-24 h-24 text-emerald-600 mx-auto mb-6"
            strokeWidth={2}
          />
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4 leading-tight">
            ご予約を<br />受け付けました
          </h1>
          <div className="hairline-gold w-16 mx-auto mb-6" />
          <p className="text-xl text-[#555] mb-8 leading-relaxed">
            お店から確認のお電話をいたします。<br />
            そのままお待ちください。
          </p>
          <div className="bg-[#fdfbf6] rounded-2xl p-6 text-left mb-6 border border-[#e5e0d4]">
            <div className="text-sm text-[#c9a961] uppercase tracking-wider mb-3">
              ご予約内容
            </div>
            <dl className="space-y-3 text-lg">
              <div className="flex justify-between">
                <dt className="text-[#666]">女の子</dt>
                <dd className="font-bold text-[#1a1a1a]">{girl.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#666]">日時</dt>
                <dd className="font-bold text-[#1a1a1a]">
                  {formData.date.replace(/-/g, '/')} {formData.time}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#666]">コース</dt>
                <dd className="font-bold text-[#1a1a1a]">{selectedPlan.duration}分</dd>
              </div>
            </dl>
          </div>
          <p className="text-sm text-[#999]">
            6秒後に一覧へ戻ります
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfbf6] pb-16">
      {/* ヘッダー */}
      <section className="bg-[#1a1a1a] text-white px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/qr/${shop.id}`}
            className="inline-flex items-center gap-2 text-lg text-[#c9a961] mb-4"
          >
            <ArrowLeft size={20} />
            <span>一覧に戻る</span>
          </Link>
          <div className="text-sm tracking-[0.3em] text-[#c9a961] uppercase">
            Step 2
          </div>
          <h1 className="text-3xl font-bold mt-1">ご予約内容の入力</h1>
        </div>
      </section>

      {/* 選択した女の子 */}
      <section className="max-w-2xl mx-auto px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-md p-5 flex items-center gap-5">
          <div className="relative w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-[#f5f1e8]">
            <Image
              src={girl.thumbnail_url || '/placeholder-girl.jpg'}
              alt={girl.name}
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#c9a961] uppercase tracking-wider mb-1">
              選んだ女の子
            </div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] leading-tight">
              {girl.name}
            </h2>
            <div className="text-base text-[#666] mt-1">
              {girl.age && `${girl.age}歳`}
              {girl.height && ` / T${girl.height}`}
            </div>
          </div>
        </div>
      </section>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 mt-8 space-y-5">
        {/* お名前 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <label className="block text-xl font-bold text-[#1a1a1a] mb-3">
            お名前 <span className="text-red-600">※必須</span>
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="例: 山田"
            className={`w-full px-5 py-5 text-2xl border-2 rounded-2xl focus:outline-none focus:border-[#c9a961] ${
              errors.customerName ? 'border-red-500' : 'border-[#e5e0d4]'
            }`}
            autoComplete="name"
          />
          {errors.customerName && (
            <p className="error-message mt-3 text-lg text-red-600 font-bold">
              ⚠ {errors.customerName}
            </p>
          )}
        </div>

        {/* 電話番号 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <label className="block text-xl font-bold text-[#1a1a1a] mb-3">
            お電話番号 <span className="text-red-600">※必須</span>
          </label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            placeholder="090-1234-5678"
            className={`w-full px-5 py-5 text-2xl border-2 rounded-2xl focus:outline-none focus:border-[#c9a961] ${
              errors.customerPhone ? 'border-red-500' : 'border-[#e5e0d4]'
            }`}
            autoComplete="tel"
            inputMode="tel"
          />
          {errors.customerPhone && (
            <p className="error-message mt-3 text-lg text-red-600 font-bold">
              ⚠ {errors.customerPhone}
            </p>
          )}
          <p className="text-base text-[#666] mt-3">
            ※ 確認のためお店から<br className="md:hidden" />お電話いたします
          </p>
        </div>

        {/* 日付 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <label className="block text-xl font-bold text-[#1a1a1a] mb-3">
            ご希望日 <span className="text-red-600">※必須</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={today()}
            className={`w-full px-5 py-5 text-2xl border-2 rounded-2xl focus:outline-none focus:border-[#c9a961] ${
              errors.date ? 'border-red-500' : 'border-[#e5e0d4]'
            }`}
          />
          {errors.date && (
            <p className="error-message mt-3 text-lg text-red-600 font-bold">
              ⚠ {errors.date}
            </p>
          )}
        </div>

        {/* 時間 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <label className="block text-xl font-bold text-[#1a1a1a] mb-3">
            ご希望時間 <span className="text-red-600">※必須</span>
          </label>
          <div className="relative">
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className={`w-full appearance-none px-5 py-5 pr-14 text-2xl border-2 rounded-2xl focus:outline-none focus:border-[#c9a961] bg-white ${
                errors.time ? 'border-red-500' : 'border-[#e5e0d4]'
              }`}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => {
                const v = `${h.toString().padStart(2, '0')}:00`;
                return (
                  <option key={v} value={v}>
                    {v}
                  </option>
                );
              })}
            </select>
            <ChevronDown
              size={28}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none"
            />
          </div>
          {errors.time && (
            <p className="error-message mt-3 text-lg text-red-600 font-bold">
              ⚠ {errors.time}
            </p>
          )}
        </div>

        {/* コース */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <label className="block text-xl font-bold text-[#1a1a1a] mb-4">
            コース
          </label>
          <div className="grid grid-cols-1 gap-3">
            {plans.map((plan) => {
              const selected = formData.planId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, planId: plan.id })}
                  className={`flex items-center justify-between px-6 py-5 rounded-2xl text-2xl font-bold border-2 transition ${
                    selected
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                      : 'bg-white text-[#1a1a1a] border-[#e5e0d4]'
                  }`}
                >
                  <span>{plan.duration}分</span>
                  <span className={selected ? 'text-[#c9a961]' : 'text-[#555]'}>
                    ¥{plan.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ご要望 */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <label className="block text-xl font-bold text-[#1a1a1a] mb-3">
            待ち合わせ場所・ご要望
            <span className="text-base text-[#888] font-normal ml-2">（任意）</span>
          </label>
          <textarea
            value={formData.requests}
            onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
            placeholder="例: 中標津駅前でお願いします"
            rows={3}
            className="w-full px-5 py-4 text-xl border-2 border-[#e5e0d4] rounded-2xl focus:outline-none focus:border-[#c9a961] resize-none"
          />
        </div>

        {/* 確認 + 送信 */}
        <div className="bg-[#1a1a1a] text-white rounded-3xl p-6 shadow-md">
          <div className="text-sm text-[#c9a961] uppercase tracking-wider mb-3 text-center">
            ご予約内容の確認
          </div>
          <dl className="space-y-2 text-lg mb-6">
            <div className="flex justify-between">
              <dt className="text-white/60">女の子</dt>
              <dd className="font-bold">{girl.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">日時</dt>
              <dd className="font-bold">
                {formData.date.replace(/-/g, '/')} {formData.time}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">コース</dt>
              <dd className="font-bold">
                {selectedPlan.duration}分 / ¥{selectedPlan.price.toLocaleString()}
              </dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-2xl py-6 text-3xl font-bold active:scale-95 transition-transform shadow ${
              isSubmitting
                ? 'bg-gray-500 cursor-not-allowed text-white/70'
                : 'bg-[#c9a961] text-[#1a1a1a]'
            }`}
          >
            {isSubmitting ? '送信中…' : '予約する'}
          </button>
          <p className="text-sm text-white/60 text-center mt-4">
            送信後、お店から確認のお電話をいたします
          </p>
        </div>
      </form>

      {/* 電話予約 */}
      {phoneHref && (
        <section className="max-w-2xl mx-auto px-6 mt-10">
          <div className="bg-white border-2 border-[#e5e0d4] rounded-3xl p-6 text-center">
            <p className="text-xl text-[#333] font-bold mb-4">
              お電話でも<br />ご予約いただけます
            </p>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-3 bg-[#1a1a1a] text-white rounded-2xl py-5 px-8 text-2xl font-bold active:scale-95 transition-transform"
            >
              <Phone size={28} strokeWidth={2.5} />
              <span>{shop.phone}</span>
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
