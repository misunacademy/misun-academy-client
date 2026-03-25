'use client';

import { useEffect } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthLoginAliasContent() {
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

export default function AuthLoginAlias() {
  return (
    <Suspense fallback={null}>
      <AuthLoginAliasContent />
    </Suspense>
  );
}
