'use client';

import  { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import EnrollmentCheckout from '@/components/module/checkout/EnrollmentCheckout';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { enrollmentPeriod, isEnrollmentRunning } from '@/constants/enrollment';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { v4 as uuid } from "uuid";
import { track } from '@/lib/metaPixel';

const Page = () => {
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!isEnrollmentRunning) {
            // setOpenModal(true);
        }
    }, []);
    useEffect(() => {
        if (!user?.email) return; // wait until email exists
        if (hasTracked.current) return; // prevent double fire

        hasTracked.current = true;
        const eventId = uuid(); // same ID for Pixel + CAPI

        //  Meta Pixel (browser)
        // Use helper to queue the event if the pixel hasn't loaded yet
        track('Purchase', {
            value: 4000,
            currency: 'BDT',
            content_name: 'Misun Academy Course Enrollment',
            content_type: 'course',
        }, { eventID: eventId });

        // Conversions API (server)
        fetch("/api/meta-conversion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName: "Purchase",
                email: user?.email,
                value: 4000,
                currency: "BDT",
                eventId,
            }),
        });
    }, [user?.email]);

    const handleModalChange = (open: boolean) => {
        setOpenModal(open);
        if (!open) {
            router.back(); // Go back when modal is closed
        }
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#060f0a]">
                <div className="text-center space-y-5">
                    <div className="relative p-[1.5px] rounded-full overflow-hidden w-16 h-16 mx-auto">
                        <span className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                        <div className="relative w-full h-full rounded-full bg-[#060f0a] flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        </div>
                    </div>
                    <p className="text-white/50 text-sm tracking-wide">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    // Don't render checkout if not authenticated
    if (!user) {
        return null;
    }

    if (!isEnrollmentRunning) {
        return (
            <Dialog open={openModal} onOpenChange={handleModalChange}>
                <DialogContent className="sm:max-w-lg font-bangla bg-[#060f0a] border border-primary/20 text-white">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="relative p-[1.5px] rounded-full overflow-hidden">
                                <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(40_90%_55%)_100%)]" />
                                <div className="relative w-16 h-16 rounded-full bg-[#0f1a10] flex items-center justify-center">
                                    <AlertTriangle className="h-7 w-7 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                        <DialogTitle className="text-center text-xl font-bold text-white">
                            এনরোলমেন্ট এখনো শুরু হয়নি
                        </DialogTitle>
                        <DialogDescription className="text-center text-white/50">
                            এনরোলমেন্ট এখনো শুরু হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4">
                        {/* Start date card */}
                        <div className="relative overflow-hidden rounded-xl bg-[#060f0a] border border-primary/25 p-4">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-semibold text-primary text-sm">এনরোলমেন্ট শুরু হবে</span>
                            </div>
                            <p className="text-base font-bold text-white/90 ml-11">{enrollmentPeriod.startDate}</p>
                        </div>

                        {/* End date card */}
                        <div className="relative overflow-hidden rounded-xl bg-[#060f0a] border border-red-500/25 p-4">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-red-400" />
                                </div>
                                <span className="font-semibold text-red-400 text-sm">এনরোলমেন্টের শেষ তারিখ</span>
                            </div>
                            <p className="text-base font-bold text-white/90 ml-11">{enrollmentPeriod.endDate}</p>
                        </div>

                        <div className="rounded-xl bg-primary/8 border border-primary/20 p-3 text-center">
                            <p className="text-sm text-white/60">📌 এই পেজটি বুকমার্ক করে রাখুন!</p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <div className="relative p-[1.5px] rounded-xl overflow-hidden w-full">
                            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                            <button
                                onClick={() => handleModalChange(false)}
                                className="relative w-full bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41] transition-all duration-300 text-white font-bold py-3 rounded-xl cursor-pointer"
                            >
                                বুঝেছি
                            </button>
                        </div>
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
