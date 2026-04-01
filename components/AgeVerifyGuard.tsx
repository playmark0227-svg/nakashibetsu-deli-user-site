'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AgeVerifyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 年齢確認ページ自体は除外
    if (pathname === '/age-verify') {
      setIsLoading(false);
      setIsVerified(true);
      return;
    }

    const verified = localStorage.getItem('age_verified');
    if (verified === 'true') {
      setIsVerified(true);
      setIsLoading(false);
    } else {
      router.push('/age-verify');
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isVerified) {
    return null;
  }

  return <>{children}</>;
}
