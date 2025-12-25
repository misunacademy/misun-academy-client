'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PaymentStatus() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('failed');

    useEffect(() => {
        const paymentStatus = searchParams.get('status');
        setStatus(paymentStatus || 'failed');
    }, [searchParams]);

    const getStatusContent = () => {
        switch (status) {
            case 'success':
                return {
                    icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
                    title: 'Payment Successful',
                    description: 'Your payment has been processed successfully. Check your email. Thank you!',
                    variant: 'default',
                };
            case 'pending':
            case 'failed':
            default:
                return {
                    icon: status === 'pending' ? <Clock className="h-8 w-8 text-yellow-500" /> : <AlertCircle className="h-8 w-8 text-red-500" />,
                    title: status === 'pending' ? 'Payment Pending' : 'Payment Failed',
                    description: status === 'pending'
                        ? 'Your payment is still being processed. Please check back later.'
                        : 'There was an issue processing your payment. Please try again.',
                    variant: status === 'pending' ? 'destructive' : 'destructive',
                };
        }
    };

    const { icon, title, description } = getStatusContent();

    return (
        <div className="container mx-auto p-4 h-96">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertTitle>Payment Status: <span className={`capitalize ${status === 'success' ? 'text-green-600 text-bold' : 'text-red-500'}`}>{status}</span></AlertTitle>
                        <AlertDescription>{description}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}