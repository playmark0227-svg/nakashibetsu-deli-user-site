import Link from 'next/link';
import { Crown, Mail, MapPin, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-rose-400 rounded-xl flex items-center justify-center">
                <Crown className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-rose-400 to-rose-400 bg-clip-text text-transparent">
                Velvet
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              中標津エリアのプレミアムエスコートサービス。最高級のおもてなしで、特別なひとときをお届けします。
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <MapPin size={16} className="text-rose-400" />
              <span>北海道標津郡中標津町</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Phone size={16} className="text-rose-400" />
              <span>お問い合わせは各店舗へ</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">サイトマップ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-rose-400 transition-colors flex items-center space-x-2">
                  <span>→</span>
                  <span>トップページ</span>
                </Link>
              </li>
              <li>
                <Link href="/girls" className="text-gray-400 hover:text-rose-400 transition-colors flex items-center space-x-2">
                  <span>→</span>
                  <span>キャスト一覧</span>
                </Link>
              </li>
              <li>
                <Link href="/shops" className="text-gray-400 hover:text-rose-400 transition-colors flex items-center space-x-2">
                  <span>→</span>
                  <span>店舗一覧</span>
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-gray-400 hover:text-rose-400 transition-colors flex items-center space-x-2">
                  <span>→</span>
                  <span>ランキング</span>
                </Link>
              </li>
              <li>
                <Link href="/new" className="text-gray-400 hover:text-rose-400 transition-colors flex items-center space-x-2">
                  <span>→</span>
                  <span>新人キャスト</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ご利用案内</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2 text-gray-400">
                <span className="text-rose-400 mt-1">●</span>
                <span>18歳未満の方はご利用いただけません</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <span className="text-rose-400 mt-1">●</span>
                <span>本サイトは情報提供サイトです</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <span className="text-rose-400 mt-1">●</span>
                <span>風営法を遵守してください</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <span className="text-rose-400 mt-1">●</span>
                <span>ご予約は各店舗へ直接お電話ください</span>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">フォローする</h3>
            <div className="flex space-x-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-rose-400 hover:border-rose-400 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-rose-400 hover:border-rose-400 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-rose-400 hover:border-rose-400 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400" />
              </a>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2 text-sm">お問い合わせ</h4>
              <p className="text-xs text-gray-400 mb-3">
                掲載に関するお問い合わせは各店舗様へ直接お願いいたします。
              </p>
              <a
                href="mailto:info@velvet-nakashibetsu.jp"
                className="flex items-center space-x-2 text-rose-400 hover:text-rose-300 transition-colors text-sm"
              >
                <Mail size={14} />
                <span>info@velvet-nakashibetsu.jp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Velvet - 中標津プレミアムエスコート. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-rose-400 transition-colors">
                プライバシーポリシー
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="text-gray-400 hover:text-rose-400 transition-colors">
                利用規約
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/sitemap" className="text-gray-400 hover:text-rose-400 transition-colors">
                サイトマップ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
