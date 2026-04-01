'use client';

import Link from 'next/link';
import { Search, Heart, Menu, X, Star, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, loaded } = useFavorites();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-rose-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-400/30 group-hover:shadow-rose-400/50 transition-all">
                <Crown className="text-white w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-rose-500 to-rose-500 bg-clip-text text-transparent">
                Velvet
              </span>
              <span className="text-xs text-gray-500 -mt-1">中標津プレミアム</span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="店舗名・キャスト名で検索..."
                className="w-full px-5 py-2.5 pl-12 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-400 to-rose-500 text-white px-5 py-1.5 rounded-full hover:shadow-lg hover:shadow-rose-400/30 transition-all text-sm font-medium"
              >
                検索
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-rose-500 flex items-center space-x-2 font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              <span>トップ</span>
            </Link>
            <Link
              href="/girls"
              className="px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-rose-500 flex items-center space-x-2 font-medium"
            >
              <Star className="w-4 h-4" />
              <span>キャスト</span>
            </Link>
            <Link
              href="/shops"
              className="px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-rose-500 flex items-center space-x-2 font-medium"
            >
              <Crown className="w-4 h-4" />
              <span>店舗</span>
            </Link>
            <Link
              href="/favorites"
              className="relative px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-rose-500 flex items-center space-x-2 font-medium"
            >
              <Heart className="w-4 h-4" />
              <span>お気に入り</span>
              {loaded && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/ranking"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium hover:shadow-lg hover:shadow-rose-400/30 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>ランキング</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索..."
              className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </form>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 space-y-2 border-t border-gray-200">
            <Link
              href="/"
              className="block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 hover:text-rose-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              トップ
            </Link>
            <Link
              href="/girls"
              className="block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 hover:text-rose-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              キャスト一覧
            </Link>
            <Link
              href="/shops"
              className="block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 hover:text-rose-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              店舗一覧
            </Link>
            <Link
              href="/favorites"
              className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 hover:text-rose-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>お気に入り</span>
              </span>
              {loaded && favorites.length > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/ranking"
              className="block py-3 px-4 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              ランキング
            </Link>
          </nav>
        )}
      </div>


    </header>
  );
}
