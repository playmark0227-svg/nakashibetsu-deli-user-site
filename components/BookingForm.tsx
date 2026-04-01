'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Phone as PhoneIcon, MessageSquare, Send, Package, Mail } from 'lucide-react';

interface BookingFormProps {
  shopId: string;
  shopName: string;
  shopPhone: string;
}

export default function BookingForm({ shopId, shopName, shopPhone }: BookingFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    girlName: '',
    customerName: '',
    phone: '',
    email: '',
    duration: '60',
    options: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // APIに送信
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_id: shopId,
          girl_name: formData.girlName || null,
          customer_name: formData.customerName,
          phone: formData.phone,
          email: formData.email || null,
          booking_date: formData.date,
          booking_time: formData.time,
          duration: parseInt(formData.duration),
          options: formData.options || null,
          message: formData.message || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '予約の送信に失敗しました');
      }

      // 成功
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // 3秒後に電話予約を促す
      setTimeout(() => {
        if (confirm('予約内容をデータベースに保存しました。\n店舗に直接お電話で最終確認をお願いします。')) {
          window.location.href = `tel:${shopPhone.replace(/-/g, '')}`;
        }
      }, 1000);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || '予約の送信中にエラーが発生しました');
      console.error('Booking error:', err);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">予約内容を確認しました</h3>
          <p className="text-gray-600 mb-6">
            以下の電話番号にお電話いただき、<br />
            最終的な予約確定をお願いします。
          </p>
          <a
            href={`tel:${shopPhone.replace(/-/g, '')}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-300 to-rose-400 text-white font-bold rounded-full hover:shadow-xl hover:shadow-rose-200 transition-all transform hover:scale-105"
          >
            <PhoneIcon className="w-5 h-5" />
            <span>{shopPhone}</span>
          </a>
          <p className="mt-4 text-sm text-gray-500">
            予約内容をお伝えください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <Calendar className="w-7 h-7 text-rose-400" />
        <span>オンライン予約フォーム</span>
      </h2>
      
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>注意:</strong> こちらは仮予約フォームです。送信後、店舗に直接お電話いただき最終確認をお願いします。
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">
            <strong>エラー:</strong> {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 希望日 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1 text-rose-400" />
              希望日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>

          {/* 希望時間 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1 text-rose-400" />
              希望時間 <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* 希望キャスト */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1 text-rose-400" />
            希望キャスト名（任意）
          </label>
          <input
            type="text"
            name="girlName"
            value={formData.girlName}
            onChange={handleChange}
            placeholder="指名がある場合はご記入ください"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* お名前 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="山田太郎"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>

          {/* 電話番号 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <PhoneIcon className="inline w-4 h-4 mr-1 text-rose-400" />
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="090-1234-5678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>

          {/* メールアドレス（任意） */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1 text-rose-400" />
              メールアドレス <span className="text-gray-500 text-xs">(任意)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              ※ 入力いただくと、予約確認メールをお送りします
            </p>
          </div>
        </div>

        {/* コース時間 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1 text-rose-400" />
            コース時間 <span className="text-red-500">*</span>
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          >
            <option value="60">60分</option>
            <option value="90">90分</option>
            <option value="120">120分</option>
            <option value="150">150分</option>
            <option value="180">180分</option>
          </select>
        </div>

        {/* オプション */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Package className="inline w-4 h-4 mr-1 text-rose-400" />
            オプション（任意）
          </label>
          <input
            type="text"
            name="options"
            value={formData.options}
            onChange={handleChange}
            placeholder="例: ローション、コスプレ、バイブなど"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            ご希望のオプションがあればご記入ください（カンマ区切り可）
          </p>
        </div>

        {/* 備考 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MessageSquare className="inline w-4 h-4 mr-1 text-rose-400" />
            ご要望・備考（任意）
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="その他ご要望があればご記入ください"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-gradient-to-r from-rose-300 to-rose-400 text-white font-bold rounded-full hover:shadow-xl hover:shadow-rose-200 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>送信中...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>予約内容を送信</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          ※ 送信後、店舗から確認のお電話をさせていただく場合がございます
        </p>
      </form>
    </div>
  );
}
