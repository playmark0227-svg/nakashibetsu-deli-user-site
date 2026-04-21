'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AgeVerifyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // trailingSlash:true と basePath を併用するため、両方のケースに対応
    const normalized = (pathname || '').replace(/\/+$/, '') || '/';
    // QR フロー (/qr/*) は名刺から来店中の高齢者が対象なので年齢認証をバイパス
    if (normalized === '/age-verify' || normalized.startsWith('/qr')) {
      setIsLoading(false);
      setIsVerified(true);
      return;
    }

    let verified: string | null = null;
    try {
      verified = localStorage.getItem('age_verified');
    } catch {
      // iOS Safari Private mode などでは localStorage 例外になり得る
    }

    if (verified === 'true') {
      setIsVerified(true);
      setIsLoading(false);
    } else {
      // router.push が静的エクスポート環境で効かないケース対策で location も使う
      setIsLoading(false);
      router.push('/age-verify');
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0a09]">
        <div className="text-[10px] tracking-[0.4em] text-[#c9a961] uppercase">Loading</div>
      </div>
    );
  }

  if (!isVerified) {
    return null;
  }

  return <>{children}</>;
}
