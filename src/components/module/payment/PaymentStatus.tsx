'use client';

import { Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { track } from '@/lib/metaPixel';
import { useAuth } from '@/hooks/useAuth';
import { useVerifyMyPaymentQuery } from '@/redux/api/paymentApi';
import { extractApiData } from '@/lib/api-helpers';
import { Button } from '@/components/ui/button';
import { COURSE_SLUGS, FALLBACK_COURSE_TITLE } from '@/constants/courses';
import Congratulations from '@/components/module/payment/congratulations';

type StatusKey = 'success' | 'pending' | 'review' | 'cancelled' | 'failed';

interface StatusAction {
  href: string;
  label: string;
}

interface StatusConfig {
  icon: typeof CheckCircle2;
  iconClass: string;
  wrapClass: string;
  title: string;
  description: string;
  primary: StatusAction;
  secondary: StatusAction;
  isError: boolean;
}

const statusConfig: Record<StatusKey, StatusConfig> = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-400',
    wrapClass: 'border-emerald-500/30 bg-emerald-500/10',
    title: 'পেমেন্ট সফল হয়েছে!',
    description: 'আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। কনফার্মেশনের বিস্তারিত আপনার ইমেইলে পাঠানো হয়েছে।',
    primary: { href: '/my-classes', label: 'আমার ক্লাসগুলোতে যান' },
    secondary: { href: '/', label: 'হোম পেজে যান' },
    isError: false,
  },
  pending: {
    icon: Clock,
    iconClass: 'text-amber-400',
    wrapClass: 'border-amber-500/30 bg-amber-500/10',
    title: 'পেমেন্ট প্রক্রিয়াধীন',
    description: 'আপনার পেমেন্ট এখনো প্রক্রিয়াধীন। কনফার্ম হলে আমরা ইমেইল ও নোটিফিকেশনের মাধ্যমে জানাব।',
    primary: { href: '/my-classes', label: 'ড্যাশবোর্ডে ফিরে যান' },
    secondary: { href: '/', label: 'হোম পেজে যান' },
    isError: false,
  },
  review: {
    icon: Clock,
    iconClass: 'text-blue-400',
    wrapClass: 'border-blue-500/30 bg-blue-500/10',
    title: 'পেমেন্ট যাচাই চলছে',
    description: 'আপনার পেমেন্ট ম্যানুয়ালি যাচাই করা হচ্ছে (সাধারণত ১২–২৪ ঘণ্টার মধ্যে)। নিশ্চিত হলে আমরা আপনাকে জানাব।',
    primary: { href: '/my-classes', label: 'ড্যাশবোর্ডে ফিরে যান' },
    secondary: { href: '/', label: 'হোম পেজে যান' },
    isError: false,
  },
  cancelled: {
    icon: XCircle,
    iconClass: 'text-amber-400',
    wrapClass: 'border-amber-500/30 bg-amber-500/10',
    title: 'পেমেন্ট বাতিল হয়েছে',
    description: 'আপনি পেমেন্টটি বাতিল করেছেন। চাইলে আবার এনরোলমেন্ট করতে পারেন।',
    primary: { href: '/checkout', label: 'আবার চেষ্টা করুন' },
    secondary: { href: '/', label: 'হোম পেজে ফিরে যান' },
    isError: true,
  },
  failed: {
    icon: AlertCircle,
    iconClass: 'text-red-400',
    wrapClass: 'border-red-500/30 bg-red-500/10',
    title: 'পেমেন্ট ব্যর্থ হয়েছে',
    description: 'পেমেন্ট প্রক্রিয়া করতে সমস্যা হয়েছে। আবার চেষ্টা করুন অথবা সমস্যা থাকলে আমাদের সাপোর্টে যোগাযোগ করুন।',
    primary: { href: '/checkout', label: 'আবার চেষ্টা করুন' },
    secondary: { href: '/', label: 'হোম পেজে ফিরে যান' },
    isError: true,
  },
};

function PurchaseTracker({
  transactionId,
  courseSlug,
}: {
  transactionId: string | null;
  courseSlug: string | null;
}) {
  const { user } = useAuth();
  const hasTracked = useRef(false);
  // Values come from the verified server record — never from the URL, which
  // anyone can edit (?amount=999999). No verified payment => no event.
  const { data: verifyRaw } = useVerifyMyPaymentQuery(transactionId ?? "", {
    skip: !transactionId,
  });

  useEffect(() => {
    if (!user?.email || !transactionId || hasTracked.current) return;

    const verification = extractApiData<{
      verified: boolean;
      amount: number;
      currency: string;
      courseSlug: string;
    }>(verifyRaw);
    if (!verification) return; // still loading — wait for the verdict
    if (!verification.verified) return; // not a real purchase — stay silent

    const dedupeKey = `ma:purchaseTracked:${transactionId}`;
    try {
      if (sessionStorage.getItem(dedupeKey) === '1') {
        hasTracked.current = true;
        return;
      }
    } catch {
      // storage unavailable — proceed, ref guard still prevents double-fire in-session
    }

    hasTracked.current = true;
    const eventId = uuid();
    const value = typeof verification.amount === 'number' && verification.amount > 0
      ? verification.amount
      : undefined;
    const currency = verification.currency || 'BDT';
    const slug = verification.courseSlug || courseSlug;
    const contentName =
      slug === COURSE_SLUGS.GRAPHIC_DESIGN
        ? FALLBACK_COURSE_TITLE
        : slug || 'MISUN Academy Course';

    track('Purchase', {
      ...(value !== undefined ? { value, currency } : {}),
      content_name: contentName,
      content_type: 'course',
      transaction_id: transactionId,
    }, { eventID: eventId });

    fetch('/api/meta-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Purchase',
        email: user.email,
        value,
        currency,
        eventId,
      }),
    }).catch(() => {});

    try {
      sessionStorage.setItem(dedupeKey, '1');
    } catch {
      // ignore
    }
  }, [user?.email, transactionId, courseSlug, verifyRaw]);

  return null;
}

function StatusCard() {
  const searchParams = useSearchParams();
  const statusParam = searchParams?.get('status') || 'failed';
  const config = statusConfig[statusParam as StatusKey] ?? statusConfig.failed;
  const transactionId = searchParams?.get('t');
  const courseSlug = searchParams?.get('course');

  const Icon = config.icon;

  return (
    <div
      role={config.isError ? 'alert' : 'status'}
      aria-live="polite"
      className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-surface-darker/80 p-8 text-center shadow-[0_0_60px_hsl(156_70%_42%/0.10)] backdrop-blur-sm"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className={`relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border ${config.wrapClass}`}>
        <Icon className={`h-8 w-8 ${config.iconClass}`} />
      </div>
      <h1 className="relative text-2xl font-bold text-white">{config.title}</h1>
      <p className="relative mt-2 text-sm leading-relaxed text-white/60">{config.description}</p>

      {transactionId && (
        <p className="mt-4 break-all rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
          <span className="text-white/30">লেনদেন আইডি: </span>
          <span className="font-mono text-white/60">{transactionId}</span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild className="font-bangla">
          <Link href={config.primary.href}>{config.primary.label}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-white/15 bg-transparent font-bangla text-white/80 hover:bg-white/5 hover:text-white"
        >
          <Link href={config.secondary.href}>{config.secondary.label}</Link>
        </Button>
      </div>

      {statusParam === 'success' && (
        <PurchaseTracker
          transactionId={transactionId}
          courseSlug={courseSlug}
        />
      )}
    </div>
  );
}

function PaymentStatusFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-surface font-bangla">
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-surface-darker/60 px-6 py-4 text-white/60">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm">লোড হচ্ছে...</span>
      </div>
    </div>
  );
}

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams?.get('status') || 'failed';
  const courseSlug = searchParams?.get('course');
  const isSuccess = statusParam === 'success';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0f18] via-surface to-surface-darker px-4 py-10 font-bangla sm:py-14">
      {/* subtle background glow to match site */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
      {isSuccess ? (
        <div className="relative mx-auto w-full max-w-6xl space-y-8">
          <div className="flex justify-center">
            <StatusCard />
          </div>
          {/* divider between payment confirmation and poster builder */}
          <div className="flex items-center gap-4 px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
            <span className="whitespace-nowrap">ওয়েলকাম পোস্টার তৈরি করুন</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/30" />
          </div>
          <Congratulations courseSlug={courseSlug} />
        </div>
      ) : (
        <div className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <StatusCard />
        </div>
      )}
    </div>
  );
}

export default function PaymentStatus() {
  return (
    <Suspense fallback={<PaymentStatusFallback />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
