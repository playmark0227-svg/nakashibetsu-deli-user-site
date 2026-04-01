import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RankingLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="h-10 bg-white/10 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-white/10 rounded w-48 mx-auto animate-pulse" />
          </div>
        </section>

        {/* TOP3 skeleton */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-end justify-center gap-8">
            {[1, 0, 2].map((i) => (
              <div key={i} className="flex flex-col items-center flex-1 max-w-[200px] animate-pulse">
                <div className="w-12 h-12 bg-neutral-200 rounded-full mb-3" />
                <div className={`w-full ${i === 0 ? 'scale-110' : ''} aspect-[3/4] bg-neutral-200 rounded-2xl`} />
                <div className="h-4 bg-neutral-200 rounded w-20 mt-3" />
                <div className="h-3 bg-neutral-200 rounded w-16 mt-1" />
              </div>
            ))}
          </div>
        </section>

        {/* List skeleton */}
        <section className="container mx-auto px-4 pb-16">
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-4 animate-pulse">
                <div className="w-10 h-10 bg-neutral-200 rounded-full flex-shrink-0" />
                <div className="w-16 h-20 bg-neutral-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
                <div className="w-16 h-4 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
