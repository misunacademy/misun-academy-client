'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EnrollmentCheckout from '@/components/module/checkout/EnrollmentCheckout';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { enrollmentPeriod, isEnrollmentRunning } from '@/constants/enrollment';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

const Page = () => {
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isEnrollmentRunning) {
            setOpenModal(true);
        }
    }, []);

    const handleModalChange = (open: boolean) => {
        setOpenModal(open);
        if (!open) {
            router.back(); // Go back when modal is closed
        }
    };

    if (!isEnrollmentRunning) {
        return (
            // <Dialog open={openModal} onOpenChange={handleModalChange}>
            //     <DialogContent>
            //         <DialogHeader>
            //             <DialogTitle className='text-primary'>এনরোলমেন্ট এখনো শুরু হয়নি</DialogTitle>
            //         </DialogHeader>
            //         <div className="space-y-2 text-muted-foreground text-sm">
            //             <p>
            //                 <strong>এনরোলমেন্ট শুরু হবে:</strong> {enrollmentPeriod.startDate}
            //             </p>
            //             <p>
            //                 <strong>এনরোলমেন্টের শেষ তারিখ:</strong> {enrollmentPeriod.endDate}
            //             </p>
            //         </div>
            //         <DialogFooter className="pt-4">
            //             <Button onClick={() => handleModalChange(false)}>বন্ধ করুন</Button>
            //         </DialogFooter>
            //     </DialogContent>
            // </Dialog>
            <Dialog open={openModal} onOpenChange={handleModalChange}>
                <DialogContent className="sm:max-w-lg shadow-elegant font-bangla">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 bg-yellow-600/10 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-xl font-bold text-primary">
                            এনরোলমেন্ট এখনো শুরু হয়নি
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            এনরোলমেন্ট এখনো শুরু হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Card className="border-l-4 border-l-primary bg-primary/5">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-primary">এনরোলমেন্ট শুরু হবে</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                    {enrollmentPeriod.startDate}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-destructive bg-destructive/5">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="h-5 w-5 text-destructive" />
                                    <span className="font-semibold text-destructive">এনরোলমেন্টের শেষ তারিখ</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">
                                    {enrollmentPeriod.endDate}
                                </p>
                            </CardContent>
                        </Card>

                        <div className="bg-info/5 border border-info/20 rounded-lg p-4">
                            <p className="text-sm text-info-foreground text-center">
                                📌 এই পেজটি বুকমার্ক করে রাখুন!
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            onClick={() => handleModalChange(false)}
                            className="w-full transition-all duration-300"
                            size="lg"
                        >
                            বুঝেছি
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        );
    }

    return (
        <div>
            <BreadcrumbJsonLd />
            <EnrollmentCheckout />
        </div>
    );
};

export default Page;
