'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { AlignLeft, LogOut, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { AuthUser } from '@/types/auth';
import Image from 'next/image';

export default function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const { user, signOut } = useAuth();
    const isEnrolled = (user?.enrolledCourses?.length ?? 0) > 0;

    useEffect(() => {
        const id = requestAnimationFrame(() => setIsHydrated(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const safeUser = isHydrated ? user : null;
    const userRole = (safeUser as AuthUser | null)?.role;
    const canSeeClasses = !!userRole && userRole.toLowerCase() === 'learner';

    const handleLogout = async () => {
        await signOut();
        setIsOpen(false);
    };

    return (
        <div className="relative z-[1001]">
            {/* Mobile Menu Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-[1201] transition-colors text-primary"
                aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-menu"
            >
                {isOpen ? <X className='text-primary' size={28} /> : <AlignLeft className='text-primary' size={28} />}
            </button>

            {isOpen ? (
                <button
                    type="button"
                    aria-label="Close mobile menu backdrop"
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-[1090] bg-black/45 backdrop-blur-[1px] md:hidden"
                />
            ) : null}

            {/* Mobile Menu */}
            <div
                id="mobile-nav-menu"
                className={cn(
                    'fixed right-2 top-16 z-[1100] w-[min(365px,calc(100vw-1rem))] max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-[#040a07] shadow-[0_12px_36px_rgba(0,0,0,0.75)] rounded-lg px-8 pb-10 pt-6 flex flex-col border border-primary/20 origin-top-right transition-all',
                    isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                )}
            >
                {/* <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/"
                    className="text-lg h-14 flex items-center border-b border-dark">
                    Home
                </Link> */}
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/"
                    className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla"
                >
                    হোম
                </Link>
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/courses"
                    className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla"
                >
                    কোর্সসমূহ
                </Link>
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/feedback"
                    className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla"
                >
                    শিক্ষার্থীদের মতামত
                </Link>
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/about"
                    className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla"
                >
                    আমাদের সম্পর্কে
                </Link>
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href={`${process.env.NEXT_PUBLIC_EP_FRONTEND_URL}/`}
                    className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla"
                >
                    প্রফেশনাল ইংলিশ
                </Link>
                {canSeeClasses ? (
                    <Link
                        onClick={() => setIsOpen(!isOpen)}
                        href="/my-classes"
                        className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla text-primary"
                    >
                        আমার ক্লাসগুলো
                    </Link>
                ) : null}
                {/* <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/blogs"
                    className="text-lg h-14 flex items-center border-b border-primary"
                >
                    Blogs
                </Link> */}
                {!safeUser ? (
                    <Link
                        onClick={() => setIsOpen(!isOpen)}
                        href="/auth"
                        className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla text-emerald-400"
                    >
                        লগইন
                    </Link>
                ) : (
                    <>
                     <div className="py-4 border-b border-green-500/20 flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden border border-green-500/40 flex items-center justify-center">
                                                    {user?.image ? (
                                                        <Image
                                                            src={user?.image}
                                                            alt={user?.name || 'User profile'}
                                                            width={40}
                                                            height={40}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-5 w-5 text-green-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                                                    <p className="text-xs text-white/60 truncate">{user?.email}</p>
                                                </div>
                                            </div>
                        <Link
                            onClick={() => setIsOpen(!isOpen)}
                            href="/profile"
                            className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla"
                        >
                            প্রোফাইল
                        </Link>
                        {
                            userRole === 'learner' && canSeeClasses && isEnrolled &&
                            <Link href="/enrollment-posters" className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla">
                                আপনার ভর্তি পোস্টারসমূহ
                            </Link>

                        }
                        {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'instructor') ? (
                            <Link
                                onClick={() => setIsOpen(!isOpen)}
                                href={`/dashboard/${userRole}`}
                                className="text-lg h-14 flex items-center border-b border-primary/20 font-bangla"
                            >
                                ড্যাশবোর্ড
                            </Link>
                        ) : null}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-left flex items-center gap-2  text-lg h-14 border-b border-primary/20 font-bangla text-red-400"
                        >
                            <LogOut className="h-5 w-5" />
                            লগআউট
                        </button>
                    </>
                )}
                <div className='flex space-x-4 pt-6 pb-2'>
                    <Link
                        onClick={() => setIsOpen(!isOpen)}
                        href="/checkout"
                    >
                        <Button className='w-28 font-bangla'>এনরোল করুন</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
