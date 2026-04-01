export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-semibold">読み込み中...</p>
        <p className="mt-2 text-sm text-gray-400">少々お待ちください</p>
      </div>
    </div>
  );
}
