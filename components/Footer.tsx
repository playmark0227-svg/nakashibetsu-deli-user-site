import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0a09] text-neutral-400 border-t border-[#2a2620]">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="mb-6">
              <div className="font-serif text-4xl tracking-[0.18em] text-white mb-2">Velvet</div>
              <div className="text-[10px] tracking-[0.3em] text-[#c9a961] uppercase">
                Nakashibetsu Premium Escort
              </div>
            </div>
            <div className="hairline-gold w-16 mb-6 ml-0 mr-auto" style={{ background: '#c9a961' }} />
            <p className="text-sm text-neutral-500 leading-loose mb-6 max-w-sm">
              中標津エリアにおける上質なエスコートサービスをご案内する情報サイトです。
              厳選された店舗とキャストを掲載しております。
            </p>
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <MapPin size={14} className="text-[#c9a961]" />
              <span>北海道標津郡中標津町</span>
            </div>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] tracking-[0.3em] text-[#c9a961] uppercase mb-6">Sitemap</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">トップ</Link></li>
              <li><Link href="/girls" className="hover:text-white transition-colors">在籍キャスト</Link></li>
              <li><Link href="/shops" className="hover:text-white transition-colors">店舗一覧</Link></li>
              <li><Link href="/ranking" className="hover:text-white transition-colors">ランキング</Link></li>
              <li><Link href="/new" className="hover:text-white transition-colors">新人キャスト</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div className="md:col-span-4">
            <h3 className="text-[11px] tracking-[0.3em] text-[#c9a961] uppercase mb-6">Information</h3>
            <ul className="space-y-3 text-xs text-neutral-500 leading-relaxed">
              <li>当サイトは18歳未満の方のご利用を固くお断りしております。</li>
              <li>本サイトは情報提供のみを目的とした掲載サイトです。</li>
              <li>ご予約・お問い合わせは各店舗へ直接ご連絡ください。</li>
            </ul>
            <a
              href="mailto:info@velvet-nakashibetsu.jp"
              className="inline-flex items-center space-x-2 mt-6 text-xs text-[#c9a961] hover:text-white transition-colors"
            >
              <Mail size={12} />
              <span>info@velvet-nakashibetsu.jp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2a2620] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] tracking-wider text-neutral-600">
              &copy; {currentYear} VELVET. ALL RIGHTS RESERVED.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[11px] tracking-wider">
              <Link href="/privacy" className="text-neutral-500 hover:text-[#c9a961] transition-colors">
                PRIVACY POLICY
              </Link>
              <Link href="/terms" className="text-neutral-500 hover:text-[#c9a961] transition-colors">
                TERMS
              </Link>
              <Link href="/sitemap" className="text-neutral-500 hover:text-[#c9a961] transition-colors">
                SITEMAP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
