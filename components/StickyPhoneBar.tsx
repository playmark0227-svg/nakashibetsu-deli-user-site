'use client';

import { Phone } from 'lucide-react';

interface StickyPhoneBarProps {
  phone: string;
  shopName?: string;
}

/**
 * 画面下に常時表示される電話CTAバー。
 * QRフロー専用 — 名刺経由のお客様（特に高齢者）が
 * スクロール中いつでも電話できるようにする。
 */
export default function StickyPhoneBar({ phone, shopName }: StickyPhoneBarProps) {
  const phoneHref = `tel:${phone.replace(/-/g, '')}`;

  return (
    <>
      {/* スペーサー（コンテンツが固定バーの下に隠れないように） */}
      <div aria-hidden="true" className="h-24 md:h-20" />

      {/* 固定バー本体 */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 qr-bg-hot text-white shadow-2xl border-t-4 border-yellow-300"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
        role="region"
        aria-label="電話で予約する固定バー"
      >
        <div className="absolute inset-0 qr-glitter pointer-events-none opacity-70" />
        <div className="relative max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] tracking-[0.3em] font-black text-yellow-200 uppercase">
              ♥ Call Now ♥
            </div>
            <div className="text-sm font-bold text-pink-50 truncate">
              {shopName ? `${shopName} へ電話` : '今すぐ電話で予約'}
            </div>
          </div>
          <a
            href={phoneHref}
            aria-label={`${shopName ?? ''} へ電話する ${phone}`}
            className="qr-tap-feedback qr-cta-pulse inline-flex items-center justify-center gap-2 bg-white text-pink-600 rounded-full py-3 px-5 text-xl font-black shadow-xl border-2 border-yellow-300 whitespace-nowrap"
          >
            <Phone size={22} strokeWidth={3} aria-hidden="true" />
            <span className="tracking-wider">{phone}</span>
          </a>
        </div>
      </div>
    </>
  );
}
