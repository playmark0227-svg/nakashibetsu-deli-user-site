'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Calendar, Clock, User, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';

interface Girl {
  id: string;
  name: string;
  age: number;
  thumbnail_url?: string;
  height: number;
  bust: number;
  waist: number;
  hip: number;
}

interface Shop {
  id: string;
  name: string;
  phone?: string;
  address?: string;
}

interface QRBookingFormProps {
  girl: Girl;
  shop: Shop;
}

export default function QRBookingForm({ girl, shop }: QRBookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // フォームの状態
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    duration: '60',
    requests: '',
  });

  // 今日の日付を取得（YYYY-MM-DD形式）
  const today = new Date().toISOString().split('T')[0];

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'お名前を入力してください';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = '電話番号を入力してください';
    } else if (!/^[0-9-]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = '正しい電話番号を入力してください';
    }

    if (!formData.date) {
      newErrors.date = '日付を選択してください';
    }

    if (!formData.time) {
      newErrors.time = '時間を選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // エラーがある場合は最初のエラーにスクロール
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // ここで実際の予約処理を行う
      // 例: await createBooking({ ...formData, girlId: girl.id, shopId: shop.id });
      
      // デモ用に2秒待機
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 成功画面を表示
      setShowSuccess(true);
      
      // 5秒後に店舗ページに戻る
      setTimeout(() => {
        router.push(`/qr/${shop.id}`);
      }, 5000);
    } catch (error) {
      alert('予約に失敗しました。お電話でご連絡ください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 成功画面
  if (showSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="mb-8">
                <CheckCircle className="w-32 h-32 text-green-500 mx-auto animate-bounce" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                ご予約ありがとうございます！
              </h1>
              <p className="text-3xl text-gray-700 mb-8 leading-relaxed">
                お店から確認のお電話を差し上げます。<br />
                少々お待ちください。
              </p>
              <div className="bg-blue-50 rounded-2xl p-8 mb-8">
                <p className="text-2xl text-gray-800 mb-4">
                  <span className="font-bold">キャスト:</span> {girl.name}
                </p>
                <p className="text-2xl text-gray-800 mb-4">
                  <span className="font-bold">日時:</span> {formData.date} {formData.time}
                </p>
                <p className="text-2xl text-gray-800">
                  <span className="font-bold">コース:</span> {formData.duration}分
                </p>
              </div>
              <p className="text-xl text-gray-600">
                5秒後に自動的に戻ります...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        {/* ヘッダー */}
        <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Link 
                href={`/qr/${shop.id}`}
                className="inline-flex items-center gap-3 text-2xl mb-6 hover:text-rose-100 transition-colors"
              >
                <ArrowLeft size={32} />
                <span>キャスト一覧に戻る</span>
              </Link>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
                ご予約フォーム
              </h1>
              <p className="text-2xl text-center">
                必要事項を入力してください
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* 選択したキャスト情報 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
                選択したキャスト
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-64 relative rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                  <Image
                    src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                    alt={girl.name}
                    fill
                    className="object-cover"
                    priority={true}
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-5xl font-bold text-gray-900 mb-4">{girl.name}</h3>
                  <div className="space-y-3 text-2xl text-gray-700">
                    <p>年齢: <span className="font-semibold">{girl.age}歳</span></p>
                    <p>身長: <span className="font-semibold">T{girl.height}cm</span></p>
                    <p>スリーサイズ: <span className="font-semibold">B{girl.bust} W{girl.waist} H{girl.hip}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* 予約フォーム */}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* お名前 */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <label className="flex items-center gap-4 text-3xl font-bold text-gray-900 mb-4">
                  <User size={36} />
                  お名前（必須）
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="山田 太郎"
                  className={`w-full px-5 py-4 text-xl border-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-300 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customerName && (
                  <p className="error-message mt-4 text-2xl text-red-600 font-semibold">
                    ⚠️ {errors.customerName}
                  </p>
                )}
              </div>

              {/* 電話番号 */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <label className="flex items-center gap-4 text-3xl font-bold text-gray-900 mb-4">
                  <Phone size={36} />
                  電話番号（必須）
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="090-1234-5678"
                  className={`w-full px-5 py-4 text-xl border-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-300 ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customerPhone && (
                  <p className="error-message mt-4 text-2xl text-red-600 font-semibold">
                    ⚠️ {errors.customerPhone}
                  </p>
                )}
                <p className="mt-4 text-xl text-gray-600">
                  ※ 確認のため、お店からお電話いたします
                </p>
              </div>

              {/* 日付 */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <label className="flex items-center gap-4 text-3xl font-bold text-gray-900 mb-4">
                  <Calendar size={36} />
                  ご希望日（必須）
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={today}
                  className={`w-full px-5 py-4 text-xl border-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-300 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="error-message mt-4 text-2xl text-red-600 font-semibold">
                    ⚠️ {errors.date}
                  </p>
                )}
              </div>

              {/* 時間 */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <label className="flex items-center gap-4 text-3xl font-bold text-gray-900 mb-4">
                  <Clock size={36} />
                  ご希望時間（必須）
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full px-5 py-4 text-xl border-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-300 ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">選択してください</option>
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                    <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="error-message mt-4 text-2xl text-red-600 font-semibold">
                    ⚠️ {errors.time}
                  </p>
                )}
              </div>

              {/* コース */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <label className="flex items-center gap-4 text-3xl font-bold text-gray-900 mb-6">
                  <Clock size={36} />
                  コース
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { value: '60', label: '60分', price: '¥12,000' },
                    { value: '90', label: '90分', price: '¥17,000' },
                    { value: '120', label: '120分', price: '¥22,000' },
                  ].map((course) => (
                    <button
                      key={course.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, duration: course.value })}
                      className={`p-8 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 ${
                        formData.duration === course.value
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xl'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">{course.label}</div>
                      <div className="text-xl">{course.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ご要望 */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <label className="flex items-center gap-4 text-3xl font-bold text-gray-900 mb-4">
                  <MapPin size={36} />
                  ご要望・待ち合わせ場所など
                </label>
                <textarea
                  value={formData.requests}
                  onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                  placeholder="例: 中標津駅前で待ち合わせ希望"
                  rows={4}
                  className="w-full px-6 py-6 text-2xl border-4 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-300"
                />
                <p className="mt-4 text-xl text-gray-600">
                  ※ 任意です。特にない場合は空欄でOKです
                </p>
              </div>

              {/* 送信ボタン */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-8 rounded-2xl text-3xl font-bold text-white transition-all transform hover:scale-105 shadow-xl ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      送信中...
                    </span>
                  ) : (
                    '予約を確定する'
                  )}
                </button>
                <p className="mt-6 text-center text-xl text-gray-600 leading-relaxed">
                  ※ 送信後、お店から確認のお電話をいたします
                </p>
              </div>
            </form>

            {/* 電話での予約案内 */}
            <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-12 text-center text-white shadow-xl">
              <h3 className="text-4xl font-bold mb-6">
                お電話でのご予約も可能です
              </h3>
              <a 
                href={`tel:${shop.phone?.replace(/-/g, '')}`}
                className="inline-flex items-center gap-4 bg-white text-blue-600 px-12 py-8 rounded-2xl text-4xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
              >
                <Phone size={48} />
                <span>{shop.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
