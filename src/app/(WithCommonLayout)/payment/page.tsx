import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import PaymentStatus from '@/components/module/payment/PaymentStatus';
import React, { Suspense } from 'react';

export const metadata = genMeta({
  title: 'Payment Status | MISUN Academy',
  description: 'আপনার পেমেন্টের স্ট্যাটাস দেখুন। | Check your enrollment payment status at MISUN Academy.',
  slug: 'payment',
});

const page = () => {
    return (
        <Suspense fallback={<div>Please wait....</div>}>
            <PaymentStatus />
        </Suspense>
    );
};

export default page;