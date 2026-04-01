'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getGirlById, getAllGirls } from '@/lib/data';
import { Star, MessageSquare, User } from 'lucide-react';

export default function NewReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const girlId = searchParams.get('girlId');
  
  const allGirls = getAllGirls();
  const selectedGirl = girlId ? getGirlById(girlId) : null;

  const [formData, setFormData] = useState({
    girlId: girlId || '',
    userName: '',
    rating: 0,
    comment: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.girlId) newErrors.girlId = '女の子を選択してください';
    if (!formData.userName) newErrors.userName = 'お名前を入力してください';
    if (formData.rating === 0) newErrors.rating = '評価を選択してください';
    if (!formData.comment) newErrors.comment = '口コミ内容を入力してください';
    else if (formData.comment.length < 10) {
      newErrors.comment = '10文字以上入力してください';
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
      const response = await fetch('/api/reviews', {
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
          router.push(`/girls/${formData.girlId}`);
        }, 3000);
      } else {
        alert(result.error || 'レビュー投稿中にエラーが発生しました');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Review submission error:', error);
      alert('レビュー投稿中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">口コミを投稿しました</h2>
            <p className="text-gray-600 mb-4">
              ご投稿ありがとうございます。<br />
              口コミは確認後に公開されます。
            </p>
            <p className="text-sm text-gray-500">
              自動的に女の子のページに移動します...
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
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                口コミ投稿
              </h1>
              <p className="text-gray-600">
                ご利用いただいた女の子の口コミをお願いします
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
              {/* Girl Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  女の子 <span className="text-red-500">*</span>
                </label>
                <select
                  name="girlId"
                  value={formData.girlId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.girlId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">選択してください</option>
                  {allGirls.map((girl) => (
                    <option key={girl.id} value={girl.id}>
                      {girl.name}
                    </option>
                  ))}
                </select>
                {errors.girlId && <p className="text-red-500 text-sm mt-1">{errors.girlId}</p>}
              </div>

              {/* User Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={18} className="text-pink-600" />
                  お名前（ニックネーム可） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="例: T.K"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.userName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  イニシャルやニックネームでの投稿を推奨します
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Star size={18} className="text-pink-600" />
                  評価 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingClick(rating)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={
                          rating <= formData.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
                {formData.rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.rating === 5 && '最高でした！'}
                    {formData.rating === 4 && 'とても良かったです'}
                    {formData.rating === 3 && '良かったです'}
                    {formData.rating === 2 && 'まあまあでした'}
                    {formData.rating === 1 && '期待外れでした'}
                  </p>
                )}
                {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
              </div>

              {/* Comment */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare size={18} className="text-pink-600" />
                  口コミ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={6}
                  placeholder="ご利用いただいた感想をお聞かせください&#10;&#10;例：笑顔が本当に素敵で、終始楽しい時間を過ごせました。サービスも丁寧で大満足です。また指名したいと思います。"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none ${
                    errors.comment ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">10文字以上入力してください</p>
                  <p className="text-xs text-gray-500">{formData.comment.length}文字</p>
                </div>
                {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
              </div>

              {/* Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">ご注意</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 誹謗中傷や個人情報を含む内容は掲載できません</li>
                  <li>• 投稿内容は管理者の確認後に公開されます</li>
                  <li>• 虚偽の内容や不適切な表現は削除させていただきます</li>
                </ul>
              </div>

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
                  {isSubmitting ? '送信中...' : '口コミを投稿する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
