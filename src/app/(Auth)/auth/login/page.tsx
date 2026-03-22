'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthLoginAlias() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectUrl = searchParams.get('redirect_url');

    if (redirectUrl) {
      router.replace(`/auth?redirect_url=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    router.replace('/auth');
  }, [router, searchParams]);

  return null;
}
