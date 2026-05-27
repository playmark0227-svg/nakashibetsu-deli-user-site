export default function Loading() {
  return (
    <div
      className="min-h-screen qr-bg-rose flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="text-center px-6">
        <div className="relative inline-block">
          <div
            className="w-20 h-20 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin mx-auto"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-3xl text-pink-500 qr-heart">♥</span>
          </div>
        </div>
        <p className="mt-6 text-xl font-black text-gray-900">
          読み込み中
          <span className="qr-sparkle inline-block ml-1">…</span>
        </p>
        <p className="mt-2 text-sm text-pink-500 font-bold tracking-wider">
          ♥ Loading ♥
        </p>
      </div>
    </div>
  );
}
