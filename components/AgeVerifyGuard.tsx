'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AgeVerifyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
