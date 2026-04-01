import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 animate-pulse">
      <div className="aspect-[3/4] bg-neutral-200" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-1/2" />
        <div className="h-3 bg-neutral-200 rounded w-2/3" />
        <div className="pt-2 mt-2 border-t border-neutral-100 flex justify-between">
          <div className="h-3 bg-neutral-200 rounded w-12" />
          <div className="h-3 bg-neutral-200 rounded w-8" />
        </div>
      </div>
    </div>
  );
}

export default function GirlsLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Header skeleton */}
        <section className="bg-gradient-to-br from-rose-300 to-rose-400 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="h-10 bg-white/20 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-white/20 rounded w-48 mx-auto animate-pulse" />
          </div>
        </section>

        {/* Filter skeleton */}
        <section className="bg-white border-b shadow-sm py-4">
          <div className="container mx-auto px-4">
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-24 bg-neutral-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </section>

        {/* Grid skeleton */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 15 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
