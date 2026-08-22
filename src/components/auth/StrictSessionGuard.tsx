'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function StrictSessionGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // Only apply this strict guard if the user is in the protected dashboard area
    if (!pathname.startsWith('/dashboard')) return;

    const handleBeforeUnload = () => {
      // sendBeacon fires a POST request that is guaranteed to complete 
      // even while the browser is destroying the page during a refresh (F5) or tab close.
      navigator.sendBeacon('/api/auth/logout');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null; // This is a silent background component
}
