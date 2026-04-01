'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getGirlById, getShopById, getPricesByShop } from '@/lib/data';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, DollarSign } from 'lucide-react';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const girlId = searchParams.get('girlId');
  
  const girl = girlId ? getGirlById(girlId) : null;
  const shop = girl ? getShopById(girl.shopId) : null;
  const pricePlans = shop ? getPricesByShop(shop.id) : [];

  const [formData, setFormData] = useState({
    girlId: girlId || '',
    date: '',
    timeSlot: '',
    duration: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const availableDates = girl?.schedule.filter(s => s.available) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.girlId) newErrors.girlId = '女の子を選択してください';
    if (!formData.date) newErrors.date = '日付を選択してください';
    if (!formData.timeSlot) newErrors.timeSlot = '時間を選択してください';
    if (!formData.duration) newErrors.duration = 'コースを選択してください';
    if (!formData.customerName) newErrors.customerName = 'お名前を入力してください';
    if (!formData.customerPhone) newErrors.customerPhone = '電話番号を入力してください';
    else if (!/^[\d-]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = '正しい電話番号を入力してください';
    }
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = '正しいメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API呼び出し
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        
        // 3秒後にリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        alert(result.error || '予約処理中にエラーが発生しました');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('予約処理中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  const selectedDaySchedule = availableDates.find(d => d.date === formData.date);
  const selectedPlan = pricePlans.find(p => p.duration === Number(formData.duration));

  if (submitSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">予約を受け付けました</h2>
            <p className="text-gray-600 mb-4">
              ご予約ありがとうございます。<br />
              店舗から確認のご連絡を差し上げます。
            </p>
            <p className="text-sm text-gray-500">
              自動的にトップページに移動します...
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                WEB予約フォーム
              </h1>
              <p className="text-gray-600">
                以下のフォームにご記入の上、予約を確定してください
              </p>
            </div>

            {girl && shop && (
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-md p-6 mb-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">👧</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">{girl.name}</h2>
                    <p className="text-pink-100 text-sm">{shop.name}</p>
                    <p className="text-pink-100 text-sm">
                      {girl.age}歳 / T{girl.height} / B{girl.bust}-W{girl.waist}-H{girl.hip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
              {/* Date Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={18} className="text-pink-600" />
                  日付 <span className="text-red-500">*</span>
                </label>
                <select
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">日付を選択してください</option>
                  {availableDates.map((day) => (
                    <option key={day.date} value={day.date}>
                      {new Date(day.date).toLocaleDateString('ja-JP', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </option>
                  ))}
                </select>
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={18} className="text-pink-600" />
                  時間 <span className="text-red-500">*</span>
                </label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  disabled={!formData.date}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.timeSlot ? 'border-red-500' : 'border-gray-300'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">時間を選択してください</option>
                  {selectedDaySchedule?.timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}〜
                    </option>
                  ))}
                </select>
                {errors.timeSlot && <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>}
              </div>

              {/* Course/Duration Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign size={18} className="text-pink-600" />
                  コース <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {pricePlans.map((plan) => (
                    <label
                      key={plan.duration}
                      className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                        formData.duration === String(plan.duration)
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-300 hover:border-pink-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={plan.duration}
                        checked={formData.duration === String(plan.duration)}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-2xl font-bold text-pink-600 mb-1">
                        ¥{plan.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{plan.duration}分</div>
                    </label>
                  ))}
                </div>
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>

              {/* Customer Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={18} className="text-pink-600" />
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={18} className="text-pink-600" />
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="090-1234-5678"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  確認のご連絡をさせていただきます
                </p>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={18} className="text-pink-600" />
                  メールアドレス（任意）
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare size={18} className="text-pink-600" />
                  ご要望・備考（任意）
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="その他ご要望がございましたらご記入ください"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              {/* Summary */}
              {selectedPlan && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">予約内容</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {girl && <div>女の子: {girl.name}</div>}
                    {formData.date && <div>日付: {new Date(formData.date).toLocaleDateString('ja-JP')}</div>}
                    {formData.timeSlot && <div>時間: {formData.timeSlot}〜</div>}
                    <div className="text-lg font-bold text-pink-600 mt-2">
                      合計: ¥{selectedPlan.price.toLocaleString()} ({selectedPlan.duration}分)
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '送信中...' : '予約を確定する'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                予約確定後、店舗から確認のご連絡をさせていただきます。<br />
                ご予約は店舗の確認をもって正式に成立となります。
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
