'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Star,
  Heart,
} from 'lucide-react';

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

  // ============================================
  // 成功画面（ピンクキラキラ）
  // ============================================
  if (showSuccess) {
    return (
      <main className="min-h-screen qr-bg-rose flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center border-4 border-pink-300 relative overflow-hidden">
          {/* キラキラ背景 */}
          <div className="absolute inset-0 qr-glitter pointer-events-none opacity-60" />

          <div className="relative">
            {/* 装飾上 */}
            <div className="flex items-center justify-center gap-2 mb-3 text-pink-400">
              <Sparkles size={22} className="qr-sparkle" />
              <Star size={18} className="qr-sparkle fill-pink-400" />
              <Sparkles size={22} className="qr-sparkle" />
              <Star size={18} className="qr-sparkle fill-pink-400" />
              <Sparkles size={22} className="qr-sparkle" />
            </div>

            {/* チェックマーク */}
            <div className="qr-cta-pulse inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-2xl border-4 border-white mb-5">
              <CheckCircle2
                className="w-16 h-16 text-white qr-heart"
                strokeWidth={2.5}
              />
            </div>

            <div className="text-sm tracking-[0.4em] text-pink-500 mb-2 uppercase font-bold">
              ★ Thank You ★
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
              ご予約を
              <br />
              受け付けました
              <span className="qr-heart inline-block ml-2 text-pink-500">♥</span>
            </h1>

            <div className="qr-underline w-32 mx-auto mb-6" />

            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-bold">
              お店から確認のお電話を
              <br />
              いたします
              <span className="qr-heart inline-block ml-1 text-pink-500">♥</span>
              <br />
              そのままお待ちください
            </p>

            {/* 予約内容カード */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 text-left mb-6 border-2 border-pink-200 shadow-inner">
              <div className="flex items-center justify-center gap-2 text-pink-500 text-xs font-black tracking-[0.3em] uppercase mb-4">
                <Heart size={14} className="fill-pink-500" />
                <span>Booking Detail</span>
                <Heart size={14} className="fill-pink-500" />
              </div>
              <dl className="space-y-3 text-lg">
                <div className="flex justify-between items-center pb-2 border-b border-pink-200">
                  <dt className="text-gray-600 font-bold">女の子</dt>
                  <dd className="font-black text-gray-900 text-xl">
                    {girl.name}
                    <span className="text-pink-500 ml-1">♥</span>
                  </dd>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-pink-200">
                  <dt className="text-gray-600 font-bold">日時</dt>
                  <dd className="font-black text-gray-900">
                    {formData.date.replace(/-/g, '/')} {formData.time}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600 font-bold">コース</dt>
                  <dd className="font-black text-gray-900">
                    {selectedPlan.duration}分
                  </dd>
                </div>
              </dl>
            </div>

            <p className="text-sm text-pink-400 font-bold">
              ✨ 6秒後に一覧へ戻ります ✨
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // 入力フォーム本体
  // ============================================
  return (
    <main className="min-h-screen qr-bg-rose pb-16">
      {/* ====== ヘッダー（ホットピンク・キラキラ） ====== */}
      <section className="relative overflow-hidden qr-bg-hot text-white">
        <div className="absolute inset-0 qr-glitter pointer-events-none" />
        <div className="absolute inset-0 qr-shimmer pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 pt-6 pb-8">
          <Link
            href={`/qr/${shop.id}`}
            className="qr-tap-feedback inline-flex items-center gap-2 text-base text-yellow-100 font-bold mb-4 bg-pink-900/30 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <ArrowLeft size={20} strokeWidth={3} />
            <span>女の子の一覧に戻る</span>
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-yellow-200">
              <Sparkles size={18} className="qr-sparkle" />
              <span className="text-xs font-bold tracking-[0.4em] uppercase">
                Step 2
              </span>
              <Sparkles size={18} className="qr-sparkle" />
            </div>

            <h1
              className="text-3xl md:text-4xl font-black leading-tight drop-shadow-lg"
              style={{
                textShadow: '0 2px 12px rgba(0,0,0,0.35)',
              }}
            >
              ご予約内容の入力
              <span className="qr-heart inline-block ml-2">♥</span>
            </h1>
            <div className="qr-underline w-24 mx-auto mt-3" />
          </div>
        </div>

        {/* 下部の波形装飾 */}
        <svg
          className="block w-full h-8 -mb-px"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff5f8"
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          />
        </svg>
      </section>

      {/* ====== 選んだ女の子カード ====== */}
      <section className="max-w-2xl mx-auto px-6 -mt-2 mb-6">
        <div className="bg-white rounded-3xl shadow-xl p-5 flex items-center gap-5 border-4 border-pink-200 relative overflow-hidden">
          <div className="absolute top-2 right-3 text-pink-200 text-2xl opacity-50">
            ♡
          </div>

          <div className="relative w-28 h-36 flex-shrink-0 rounded-2xl overflow-hidden bg-pink-50 border-2 border-pink-300 shadow-md">
            <Image
              src={girl.thumbnail_url || '/placeholder-girl.jpg'}
              alt={girl.name}
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
            <div className="absolute top-1 right-1 text-pink-400 text-xl drop-shadow">
              ♥
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="inline-flex items-center gap-1 bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider mb-2">
              <Heart size={10} className="fill-pink-600" />
              <span>選んだ女の子</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              {girl.name}
              <span className="text-pink-500 ml-1">♥</span>
            </h2>
            <div className="text-base text-gray-700 mt-1 font-bold">
              {girl.age && `${girl.age}歳`}
              {girl.height && ` / 身長 ${girl.height}cm`}
            </div>
          </div>
        </div>
      </section>

      {/* ====== フォーム ====== */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 space-y-5">
        {/* お名前 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-pink-200">
          <label className="flex items-center gap-2 text-xl font-black text-gray-900 mb-3">
            <span className="text-pink-500 text-2xl">♥</span>
            <span>お名前</span>
            <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-black">
              必須
            </span>
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            placeholder="例: 山田"
            className={`w-full px-5 py-5 text-2xl border-2 rounded-2xl focus:outline-none transition font-bold ${
              errors.customerName
                ? 'border-red-400 bg-red-50 focus:border-red-500'
                : 'border-pink-200 bg-pink-50/40 focus:border-pink-500 focus:bg-white'
            }`}
            autoComplete="name"
          />
          {errors.customerName && (
            <p className="error-message mt-3 text-lg text-red-600 font-black flex items-center gap-2">
              <span>⚠</span>
              <span>{errors.customerName}</span>
            </p>
          )}
        </div>

        {/* 電話番号 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-pink-200">
          <label className="flex items-center gap-2 text-xl font-black text-gray-900 mb-3">
            <span className="text-pink-500 text-2xl">♥</span>
            <span>お電話番号</span>
            <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-black">
              必須
            </span>
          </label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) =>
              setFormData({ ...formData, customerPhone: e.target.value })
            }
            placeholder="090-1234-5678"
            className={`w-full px-5 py-5 text-2xl border-2 rounded-2xl focus:outline-none transition font-bold tracking-wider ${
              errors.customerPhone
                ? 'border-red-400 bg-red-50 focus:border-red-500'
                : 'border-pink-200 bg-pink-50/40 focus:border-pink-500 focus:bg-white'
            }`}
            autoComplete="tel"
            inputMode="tel"
          />
          {errors.customerPhone && (
            <p className="error-message mt-3 text-lg text-red-600 font-black flex items-center gap-2">
              <span>⚠</span>
              <span>{errors.customerPhone}</span>
            </p>
          )}
          <p className="text-base text-gray-700 mt-3 font-bold leading-relaxed bg-pink-50 px-4 py-3 rounded-xl">
            ✨ 確認のためお店から
            <br className="md:hidden" />
            お電話いたします ✨
          </p>
        </div>

        {/* 日付 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-pink-200">
          <label className="flex items-center gap-2 text-xl font-black text-gray-900 mb-3">
            <span className="text-pink-500 text-2xl">♥</span>
            <span>ご希望日</span>
            <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-black">
              必須
            </span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={today()}
            className={`w-full px-5 py-5 text-2xl border-2 rounded-2xl focus:outline-none transition font-bold ${
              errors.date
                ? 'border-red-400 bg-red-50 focus:border-red-500'
                : 'border-pink-200 bg-pink-50/40 focus:border-pink-500 focus:bg-white'
            }`}
          />
          {errors.date && (
            <p className="error-message mt-3 text-lg text-red-600 font-black flex items-center gap-2">
              <span>⚠</span>
              <span>{errors.date}</span>
            </p>
          )}
        </div>

        {/* 時間 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-pink-200">
          <label className="flex items-center gap-2 text-xl font-black text-gray-900 mb-3">
            <span className="text-pink-500 text-2xl">♥</span>
            <span>ご希望時間</span>
            <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-black">
              必須
            </span>
          </label>
          <div className="relative">
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className={`w-full appearance-none px-5 py-5 pr-14 text-2xl border-2 rounded-2xl focus:outline-none transition font-bold ${
                errors.time
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-pink-200 bg-pink-50/40 focus:border-pink-500 focus:bg-white'
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
              strokeWidth={3}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-500 pointer-events-none"
            />
          </div>
          {errors.time && (
            <p className="error-message mt-3 text-lg text-red-600 font-black flex items-center gap-2">
              <span>⚠</span>
              <span>{errors.time}</span>
            </p>
          )}
        </div>

        {/* コース */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-pink-200">
          <label className="flex items-center gap-2 text-xl font-black text-gray-900 mb-4">
            <span className="text-pink-500 text-2xl">♥</span>
            <span>コース</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {plans.map((plan) => {
              const selected = formData.planId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, planId: plan.id })}
                  className={`qr-tap-feedback flex items-center justify-between px-6 py-5 rounded-2xl text-2xl font-black border-4 transition ${
                    selected
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600 shadow-xl'
                      : 'bg-pink-50/40 text-gray-800 border-pink-200 hover:border-pink-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {selected && <span className="qr-heart text-yellow-200">♥</span>}
                    <span>{plan.duration}分</span>
                  </span>
                  <span className={selected ? 'text-yellow-100' : 'text-pink-600'}>
                    ¥{plan.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ご要望 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-pink-200">
          <label className="flex items-center gap-2 text-xl font-black text-gray-900 mb-3">
            <span className="text-pink-500 text-2xl">♥</span>
            <span>待ち合わせ場所・ご要望</span>
            <span className="text-sm text-gray-500 font-bold ml-1">（任意）</span>
          </label>
          <textarea
            value={formData.requests}
            onChange={(e) =>
              setFormData({ ...formData, requests: e.target.value })
            }
            placeholder="例: 中標津駅前でお願いします"
            rows={3}
            className="w-full px-5 py-4 text-xl border-2 border-pink-200 bg-pink-50/40 rounded-2xl focus:outline-none focus:border-pink-500 focus:bg-white resize-none font-bold"
          />
        </div>

        {/* ====== 確認 + 送信（ホットピンクCTA） ====== */}
        <div className="qr-bg-hot relative overflow-hidden rounded-3xl p-6 shadow-2xl">
          <div className="absolute inset-0 qr-glitter pointer-events-none" />
          <div className="absolute inset-0 qr-shimmer pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-center gap-2 text-yellow-200 mb-3">
              <Sparkles size={18} className="qr-sparkle" />
              <span className="text-xs font-black tracking-[0.4em] uppercase">
                Confirm
              </span>
              <Sparkles size={18} className="qr-sparkle" />
            </div>

            <div className="bg-pink-900/25 backdrop-blur-sm rounded-2xl p-5 mb-5 border border-yellow-200/40">
              <dl className="space-y-2 text-lg text-white">
                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                  <dt className="text-pink-100 font-bold">女の子</dt>
                  <dd className="font-black text-xl">
                    {girl.name}
                    <span className="text-yellow-200 ml-1">♥</span>
                  </dd>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                  <dt className="text-pink-100 font-bold">日時</dt>
                  <dd className="font-black">
                    {formData.date.replace(/-/g, '/')} {formData.time}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-pink-100 font-bold">コース</dt>
                  <dd className="font-black">
                    {selectedPlan.duration}分 / ¥
                    {selectedPlan.price.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`qr-tap-feedback w-full rounded-full py-6 text-3xl md:text-4xl font-black shadow-2xl border-4 flex items-center justify-center gap-3 transition ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-white/70 border-gray-300'
                  : 'qr-cta-pulse bg-white text-pink-600 border-yellow-300'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="qr-heart">♥</span>
                  <span>送信中…</span>
                </>
              ) : (
                <>
                  <span className="qr-heart">♥</span>
                  <span>予約する</span>
                  <span className="qr-heart">♥</span>
                </>
              )}
            </button>

            <p className="text-base text-pink-100 text-center mt-4 font-bold leading-relaxed">
              ✨ 送信後、お店から
              <br className="md:hidden" />
              確認のお電話をいたします ✨
            </p>
          </div>
        </div>
      </form>

      {/* ====== 電話予約 ====== */}
      {phoneHref && (
        <section className="max-w-2xl mx-auto px-6 mt-8">
          <div className="bg-white border-4 border-pink-200 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-2 right-3 text-pink-200 text-3xl opacity-50">
              ♡
            </div>
            <div className="absolute bottom-2 left-3 text-pink-200 text-2xl opacity-50">
              ♡
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-2 text-pink-500 text-xs font-black tracking-[0.4em] uppercase mb-2">
                <Heart size={12} className="fill-pink-500" />
                <span>Or Call Us</span>
                <Heart size={12} className="fill-pink-500" />
              </div>
              <p className="text-xl text-gray-800 font-black mb-4 leading-relaxed">
                お電話でも
                <br />
                ご予約いただけます
                <span className="qr-heart inline-block ml-1 text-pink-500">♥</span>
              </p>
              <a
                href={phoneHref}
                className="qr-tap-feedback inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full py-5 px-8 text-2xl md:text-3xl font-black shadow-xl border-4 border-yellow-300"
              >
                <Phone size={28} strokeWidth={3} className="qr-heart" />
                <span className="tracking-wider">{shop.phone}</span>
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-pink-400 mt-6 font-bold">
            ♥ Velvet — Nakashibetsu Premium ♥
          </p>
        </section>
      )}
    </main>
  );
}
