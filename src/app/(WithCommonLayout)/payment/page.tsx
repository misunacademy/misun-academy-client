import PaymentStatus from '@/components/module/payment/PaymentStatus';
import React, { Suspense } from 'react';

const page = () => {
    return (
        <Suspense fallback={<div>Please wait....</div>}>
            <PaymentStatus />
        </Suspense>
    );
};

export default page;