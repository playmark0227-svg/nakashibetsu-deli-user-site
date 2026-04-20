'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Girl {
  id: string;
  shop_id: string;
  name: string;
  age: number | null;
  height: number | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  thumbnail_url: string | null;
  is_new: boolean;
  view_count: number;
  ranking: number;
  description: string | null;
  available_options: string[] | null;
}

interface Shop {
  id: string;
  name: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Girl[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedShop, setSelectedShop] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [isNewOnly, setIsNewOnly] = useState(false);

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) =>
      supabase.from('shops').select('*').then(({ data }) => setShops((data as Shop[]) || []))
    ).catch(() => {});
  }, []);

  useEffect(() => {
    doSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(q: string) {
    setLoading(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      let query = supabase.from('girls').select('*');
      if (q) query = query.ilike('name', `%${q}%`);
      if (selectedShop) query = query.eq('shop_id', selectedShop);
      if (minAge) query = query.gte('age', parseInt(minAge));
      if (maxAge) query = query.lte('age', parseInt(maxAge));
      if (minHeight) query = query.gte('height', parseInt(minHeight));
      if (maxHeight) query = query.lte('height', parseInt(maxHeight));
      if (isNewOnly) query = query.eq('is_new', true);
      const { data } = await query;
      setResults((data as Girl[]) || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query)}`);
    doSearch(query);
  };

  const clearFilters = () => {
    setSelectedShop('');
    setMinAge('');
    setMaxAge('');
    setMinHeight('');
    setMaxHeight('');
    setIsNewOnly(false);
  };

  const hasActiveFilters = selectedShop || minAge || maxAge || minHeight || maxHeight || isNewOnly;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#faf7f2]">
        {/* Header */}
        <section className="bg-[#0b0a09] text-white py-20 md:py-24 grain relative">
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-10">
              <div className="text-[11px] tracking-[0.4em] text-[#c9a961] uppercase mb-4">Search</div>
              <h1 className="font-serif text-4xl md:text-5xl text-white">キャスト検索</h1>
            </div>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative border-b border-[#c9a961]">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="名前・店舗名で検索..."
                  className="w-full px-2 py-4 pl-10 bg-transparent text-white placeholder-neutral-500 focus:outline-none text-base"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#c9a961] w-4 h-4" />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 text-[10px] tracking-[0.25em] uppercase text-[#c9a961] hover:text-white transition-colors font-semibold"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          {/* Filter Panel */}
          <div className="border border-[#e7e1d6] bg-white mb-12">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-6 py-4 text-[11px] tracking-[0.25em] uppercase text-[#14110d] font-semibold hover:bg-[#faf7f2] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-[#c9a961] text-[#0b0a09] text-[9px] font-bold px-2 py-0.5">ON</span>
                )}
              </div>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFilters && (
              <div className="px-6 pb-6 border-t border-[#e7e1d6]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-2">Shop</label>
                    <select
                      value={selectedShop}
                      onChange={e => setSelectedShop(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e7e1d6] text-sm focus:outline-none focus:border-[#14110d] bg-white"
                    >
                      <option value="">All Shops</option>
                      {shops.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-2">Age</label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="18" min="18" max="50" value={minAge} onChange={e => setMinAge(e.target.value)} className="w-full px-3 py-2 border border-[#e7e1d6] text-sm focus:outline-none focus:border-[#14110d]" />
                      <span className="text-[#a9a294]">–</span>
                      <input type="number" placeholder="50" min="18" max="50" value={maxAge} onChange={e => setMaxAge(e.target.value)} className="w-full px-3 py-2 border border-[#e7e1d6] text-sm focus:outline-none focus:border-[#14110d]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-[#a9a294] uppercase mb-2">Height (cm)</label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="140" min="140" max="180" value={minHeight} onChange={e => setMinHeight(e.target.value)} className="w-full px-3 py-2 border border-[#e7e1d6] text-sm focus:outline-none focus:border-[#14110d]" />
                      <span className="text-[#a9a294]">–</span>
                      <input type="number" placeholder="180" min="140" max="180" value={maxHeight} onChange={e => setMaxHeight(e.target.value)} className="w-full px-3 py-2 border border-[#e7e1d6] text-sm focus:outline-none focus:border-[#14110d]" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={isNewOnly}
                    onChange={e => setIsNewOnly(e.target.checked)}
                    className="w-3 h-3 accent-[#14110d]"
                  />
                  <label htmlFor="isNew" className="text-xs tracking-wider text-[#3a342c]">New cast only</label>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => doSearch(query)}
                    className="px-6 py-2 bg-[#14110d] text-white text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[#c9a961] hover:text-[#0b0a09] transition-colors"
                  >
                    Apply
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={() => { clearFilters(); setTimeout(() => doSearch(query), 100); }}
                      className="flex items-center gap-1.5 px-4 py-2 border border-[#e7e1d6] text-[10px] tracking-[0.25em] uppercase text-[#76705f] hover:border-[#14110d] hover:text-[#14110d] transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#f1ede5] mb-4" />
                  <div className="h-4 bg-[#f1ede5] w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-[#f1ede5] w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-[11px] tracking-[0.2em] text-[#76705f] uppercase mb-10">
                {query && <>"{query}" — </>}{results.length} Result{results.length !== 1 ? 's' : ''}
              </p>

              {results.length === 0 ? (
                <div className="text-center py-32">
                  <Search className="w-10 h-10 text-[#e7e1d6] mx-auto mb-6" strokeWidth={1} />
                  <p className="text-sm text-[#76705f] tracking-wider mb-2">該当するキャストが見つかりませんでした</p>
                  <p className="text-xs text-[#a9a294] mb-8">別のキーワードまたは条件でお試しください</p>
                  <Link href="/girls" className="inline-flex items-center gap-3 px-6 py-3 border border-[#14110d] text-[11px] tracking-[0.25em] uppercase text-[#14110d] hover:bg-[#14110d] hover:text-white transition-colors">
                    View All
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
                  {results.map(girl => {
                    const shop = shops.find(s => s.id === girl.shop_id);
                    return (
                      <Link
                        key={girl.id}
                        href={`/girls/${girl.id}`}
                        className="group block"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#f1ede5] mb-4">
                          <Image
                            src={girl.thumbnail_url || '/placeholder-girl.jpg'}
                            alt={girl.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover lift"
                          />
                          {girl.is_new && (
                            <span className="absolute top-3 left-3 bg-[#c9a961] text-[#0b0a09] text-[9px] tracking-[0.2em] font-bold px-2 py-1 uppercase">
                              New
                            </span>
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="font-serif text-xl text-[#14110d] group-hover:text-[#a8862f] transition-colors truncate">
                            {girl.name}
                          </h3>
                          <p className="text-[10px] tracking-[0.15em] text-[#76705f] mt-1.5">
                            {girl.age} · T{girl.height} · B{girl.bust}
                          </p>
                          {shop && (
                            <p className="text-[10px] text-[#a9a294] mt-1 truncate">{shop.name}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="text-[11px] tracking-[0.3em] text-[#76705f] uppercase">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
