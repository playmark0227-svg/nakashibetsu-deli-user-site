'use client';

import Link from 'next/link';
import { Search, Heart, Menu, X } from 'lucide-react';
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

  const navLinks = [
    { href: '/', label: 'TOP' },
    { href: '/girls', label: 'CAST' },
    { href: '/shops', label: 'SHOP' },
    { href: '/ranking', label: 'RANKING' },
    { href: '/new', label: 'NEW' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0a09]/95 backdrop-blur-md border-b border-[#2a2620]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-baseline space-x-3 group">
            <span className="font-serif text-3xl tracking-[0.18em] text-white">
              Velvet
            </span>
            <span className="hidden sm:inline text-[10px] tracking-[0.3em] text-[#c9a961] uppercase">
              Nakashibetsu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-2 text-[12px] tracking-[0.2em] text-neutral-300 hover:text-[#c9a961] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/favorites"
              className="relative ml-3 px-3 py-2 text-neutral-300 hover:text-[#c9a961] transition-colors"
              aria-label="お気に入り"
            >
              <Heart className="w-[18px] h-[18px]" />
              {loaded && favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#c9a961] text-[#0b0a09] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-3 p-2 text-neutral-300 hover:text-[#c9a961] transition-colors"
              aria-label="検索"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-neutral-300"
            aria-label="メニュー"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Search drawer (desktop) */}
        {isMenuOpen && (
          <div className="hidden lg:block pb-5">
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="店舗名・キャスト名で検索"
                  autoFocus
                  className="w-full px-5 py-3 pl-12 bg-transparent border border-[#2a2620] text-white placeholder-neutral-500 focus:outline-none focus:border-[#c9a961] transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-[#2a2620] space-y-1">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="検索..."
                  className="w-full px-4 py-3 pl-11 bg-transparent border border-[#2a2620] text-white placeholder-neutral-500 focus:outline-none focus:border-[#c9a961] text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-sm tracking-[0.2em] text-neutral-300 hover:text-[#c9a961] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/favorites"
              className="flex items-center justify-between py-3 text-sm tracking-[0.2em] text-neutral-300 hover:text-[#c9a961] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                FAVORITES
              </span>
              {loaded && favorites.length > 0 && (
                <span className="bg-[#c9a961] text-[#0b0a09] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
