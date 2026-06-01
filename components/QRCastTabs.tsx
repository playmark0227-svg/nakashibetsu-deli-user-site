'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Heart, Sparkles, Star, Clock3, Zap } from 'lucide-react';

interface Girl {
  id: string;
  name: string;
  age: number | null;
  height: number | null;
  bust: number | null;
  waist?: number | null;
  hip?: number | null;
  thumbnail_url: string | null;
  is_new?: boolean;
  status?: string;
  instant_available?: boolean;
  review_count?: number;
  review_avg?: number;
}

interface QRCastTabsProps {
  /** ビルド時点の全キャスト（出勤状況はマウント後にクライアントで最新化する） */
  girls: Girl[];
  shopId: string;
  minDuration?: number | null;
  minPrice?: number | null;
}

type Tab = 'now' | 'all';

const isWorkingNow = (g: Girl) =>
  g.status === 'working' || g.instant_available === true;

export default function QRCastTabs({
  girls: initialGirls,
  shopId,
  minDuration = null,
  minPrice = null,
}: QRCastTabsProps) {
  // 出勤状況はビルド時に固定されると「ビルドした日の出勤」しか出せない。
  // マウント後にその日の girl_schedules を取り直して鮮度を担保する。
  const [girls, setGirls] = useState<Girl[]>(initialGirls);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('girl_schedules')
          .select('girl_id, status, instant_available')
          .eq('date', today)
          .in(
            'girl_id',
            initialGirls.map((g) => g.id)
          );
        if (cancelled || error || !data) return;
        const m = new Map(
          (data as { girl_id: string; status: string; instant_available: boolean }[]).map(
            (s) => [s.girl_id, s]
          )
        );
        setGirls((prev) =>
          prev.map((g) => {
            const s = m.get(g.id);
            return {
              ...g,
              status: s?.status ?? 'off',
              instant_available: s?.instant_available ?? false,
            };
          })
        );
      } catch {
        // 取得失敗時はビルド時データのまま（フォールバック）
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialGirls]);

  const workingGirls = useMemo(() => girls.filter(isWorkingNow), [girls]);
  const otherGirls = useMemo(() => girls.filter((g) => !isWorkingNow(g)), [girls]);
  const hasWorking = workingGirls.length > 0;

  const [tab, setTab] = useState<Tab>('now');
  // 出勤が0なら自動的に「全員」タブにフォールバック
  const activeTab: Tab = tab === 'now' && !hasWorking ? 'all' : tab;

  const displayed =
    activeTab === 'now' ? workingGirls : [...workingGirls, ...otherGirls];

  return (
    <section className="max-w-2xl mx-auto px-6 mb-10">
      {/* タブ切り替え */}
      <div
        role="tablist"
        aria-label="キャスト表示切り替え"
        className="grid grid-cols-2 gap-2 mb-6 bg-white rounded-full p-1.5 shadow-lg border-4 border-pink-200"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'now'}
          aria-controls="qr-cast-list"
          onClick={() => setTab('now')}
          disabled={!hasWorking}
          className={`qr-tap-feedback flex items-center justify-center gap-2 py-3 px-3 rounded-full text-base md:text-lg font-black transition ${
            activeTab === 'now'
              ? 'qr-bg-working text-white shadow-lg'
              : hasWorking
                ? 'bg-transparent text-gray-700 hover:bg-pink-50'
                : 'bg-transparent text-gray-300 cursor-not-allowed'
          }`}
        >
          <Sparkles size={18} strokeWidth={3} aria-hidden="true" />
          <span className="whitespace-nowrap">
            今すぐ会える
            {hasWorking && (
              <span
                className={`ml-1.5 inline-block min-w-[1.5em] px-1.5 py-0.5 rounded-full text-xs font-black ${
                  activeTab === 'now'
                    ? 'bg-white/30 text-white'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {workingGirls.length}
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'all'}
          aria-controls="qr-cast-list"
          onClick={() => setTab('all')}
          className={`qr-tap-feedback flex items-center justify-center gap-2 py-3 px-3 rounded-full text-base md:text-lg font-black transition ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
              : 'bg-transparent text-gray-700 hover:bg-pink-50'
          }`}
        >
          <Heart size={18} strokeWidth={3} aria-hidden="true" />
          <span className="whitespace-nowrap">
            全員
            <span
              className={`ml-1.5 inline-block min-w-[1.5em] px-1.5 py-0.5 rounded-full text-xs font-black ${
                activeTab === 'all' ? 'bg-white/30 text-white' : 'bg-pink-100 text-pink-700'
              }`}
            >
              {workingGirls.length + otherGirls.length}
            </span>
          </span>
        </button>
      </div>

      {/* 一覧 */}
      <div id="qr-cast-list" role="tabpanel" className="space-y-5">
        {displayed.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border-4 border-pink-200">
            <div className="text-5xl mb-3" aria-hidden="true">
              💌
            </div>
            <p className="text-xl text-gray-800 font-black">
              現在
              {activeTab === 'now' ? '出勤中のキャストはいません' : 'キャストの登録がありません'}
            </p>
          </div>
        ) : (
          displayed.map((girl) => {
            const isWorking =
              girl.status === 'working' || girl.instant_available === true;
            return (
              <QRGirlCard
                key={girl.id}
                girl={girl}
                shopId={shopId}
                accent={isWorking ? 'working' : 'default'}
                minDuration={minDuration}
                minPrice={minPrice}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

function QRGirlCard({
  girl,
  shopId,
  accent,
  minDuration,
  minPrice,
}: {
  girl: Girl;
  shopId: string;
  accent: 'working' | 'default';
  minDuration: number | null;
  minPrice: number | null;
}) {
  const isWorking = accent === 'working';
  const isInstant = girl.instant_available === true;
  const hasReviews = (girl.review_count ?? 0) > 0;

  return (
    <Link
      href={`/qr/${shopId}/book/${girl.id}`}
      aria-label={`${girl.name} の予約ページへ`}
      className={`qr-tap-feedback block bg-white rounded-3xl overflow-hidden shadow-xl border-4 ${
        isWorking ? 'border-emerald-400' : 'border-pink-200'
      }`}
    >
      <div className="flex">
        <div className="relative w-40 h-52 md:w-48 md:h-60 flex-shrink-0 bg-pink-50">
          <Image
            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
            alt={girl.name}
            fill
            sizes="200px"
            className="object-cover"
          />
          {/* 即対応バッジ（最も予約に効く「今すぐ」訴求） */}
          {isInstant && (
            <div className="absolute top-2 left-2 qr-pulse-ring bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Zap size={12} strokeWidth={3} aria-hidden="true" className="fill-white" />
              <span>即対応OK</span>
            </div>
          )}
          {isWorking && !isInstant && (
            <div className="absolute top-2 left-2 qr-pulse-ring bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <span aria-hidden="true">✨</span>
              <span>出勤中</span>
            </div>
          )}
          {girl.is_new && !isWorking && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
              NEW ♥
            </div>
          )}
          <div
            className="absolute top-2 right-2 text-pink-400 text-2xl drop-shadow-lg"
            aria-hidden="true"
          >
            ♥
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-br from-white to-pink-50">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-1 leading-tight">
              {girl.name}
              <span className="text-pink-500 ml-1" aria-hidden="true">
                ♥
              </span>
            </h3>

            {/* 実レビューの評価（社会的証明）。0件のときは出さない */}
            {hasReviews && (
              <div
                className="flex items-center gap-1 mb-2"
                aria-label={`評価 ${girl.review_avg} / 5、口コミ ${girl.review_count}件`}
              >
                <span className="flex items-center" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < Math.round(girl.review_avg ?? 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </span>
                <span className="text-sm font-black text-amber-600">
                  {girl.review_avg?.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  （口コミ{girl.review_count}）
                </span>
              </div>
            )}

            <div className="space-y-0.5 text-base md:text-lg text-gray-700 font-bold">
              {girl.age && (
                <div className="flex items-center gap-2">
                  <span className="text-pink-400" aria-hidden="true">
                    ●
                  </span>
                  <span>{girl.age}歳</span>
                </div>
              )}
              {girl.height && (
                <div className="flex items-center gap-2">
                  <span className="text-pink-400" aria-hidden="true">
                    ●
                  </span>
                  <span>身長 {girl.height}cm</span>
                </div>
              )}
              {(girl.bust || girl.waist || girl.hip) && (
                <div className="flex items-center gap-2">
                  <span className="text-pink-400" aria-hidden="true">
                    ●
                  </span>
                  <span>
                    {girl.bust && `B${girl.bust}`}
                    {girl.waist && ` W${girl.waist}`}
                    {girl.hip && ` H${girl.hip}`}
                  </span>
                </div>
              )}
            </div>

            {/* 最安料金（料金不安を先に解消） */}
            {minPrice != null && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 rounded-lg px-2.5 py-1 text-sm font-black">
                <Clock3 size={14} strokeWidth={3} aria-hidden="true" />
                <span>
                  {minDuration ? `${minDuration}分 ` : ''}¥
                  {minPrice.toLocaleString()}〜
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`py-5 px-6 flex items-center justify-center gap-2 text-2xl md:text-3xl font-black text-white ${
          isWorking
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            : 'bg-gradient-to-r from-pink-500 to-rose-500'
        }`}
      >
        <span className="qr-heart" aria-hidden="true">
          ♥
        </span>
        <span>{isInstant ? '今すぐこの子を呼ぶ' : 'この子を予約する'}</span>
        <ChevronRight size={28} strokeWidth={3} aria-hidden="true" />
      </div>
    </Link>
  );
}
