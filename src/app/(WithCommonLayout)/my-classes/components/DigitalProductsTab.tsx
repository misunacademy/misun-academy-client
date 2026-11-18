'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FileCode, FileText, Download, Sparkles, Package, Calendar } from 'lucide-react';
import { useGetMyDigitalPurchasesQuery } from '@/redux/api/digitalProductApi';
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

export function DigitalProductsTab() {
    const { data, isLoading } = useGetMyDigitalPurchasesQuery();
    const purchases = data?.data ?? [];

    const baseApi = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5000/api/v1';

    if (isLoading) {
        return (
            <div className="py-12 text-center font-bangla text-sm text-white/50">
                ডিজিটাল প্রোডাক্টের তথ্য লোড হচ্ছে...
            </div>
        );
    }

    if (purchases.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center font-bangla">
                <Package className="mx-auto h-12 w-12 text-white/30" />
                <h3 className="mt-4 text-lg font-bold text-white">কোনো ডিজিটাল প্রোডাক্ট কেনা নেই</h3>
                <p className="mt-1 text-sm text-white/60">
                    বুটক্যাম্প পেজ থেকে ফটোশপ ও ইলাস্ট্রেটর শর্টকাট স্ক্রিপ্ট প্যাক সংগ্রহ করলে এখানে ডাউনলোড লিংক পাবেন।
                </p>
                <Link
                    href="/bootcamp"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ffd60a] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#ffd60a]/90"
                >
                    <Sparkles className="h-4 w-4" /> বুটক্যাম্প পেজে যান
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {purchases.map((item) => {
                const scriptUrl = item.downloadToken
                    ? `${baseApi}/digital-products/download/${item.downloadToken}/script`
                    : item.scriptDownloadUrl || '#';
                const guideUrl = item.downloadToken
                    ? `${baseApi}/digital-products/download/${item.downloadToken}/guide`
                    : item.guideDownloadUrl || '#';

                const softwareLabel =
                    item.product?.software === 'bundle'
                        ? 'Ps + Ai Bundle'
                        : item.product?.software || 'Script';

                const softwareColor =
                    item.product?.software === 'photoshop'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : item.product?.software === 'illustrator'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                          : 'bg-[#ffd60a]/20 text-[#ffd60a] border-[#ffd60a]/40';

                return (
                    <div
                        key={item.orderNumber}
                        className="group relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
                    >
                        {/* Animated border on hover */}
                        <AnimatedBorder
                            variant="course-card"
                            speed="5s"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-800"
                        />
                        <span className="absolute inset-0 rounded-2xl border border-primary/10 group-hover:border-transparent transition-all duration-300" />

                        {/* Card body */}
                        <div className="relative flex flex-col sm:flex-row min-h-[160px] rounded-2xl bg-surface overflow-hidden group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-500">
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-2xl z-10" />
                            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-2xl z-10" />
                            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/15 rounded-bl-2xl z-10" />
                            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/15 rounded-br-2xl z-10" />

                            {/* Thumbnail */}
                            <div className="relative w-full sm:w-56 md:w-64 shrink-0 min-h-[140px] sm:min-h-0">
                                {item.product?.thumbnail ? (
                                    <Image
                                        src={item.product.thumbnail}
                                        alt={item.product?.title || 'Product'}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, 256px"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <FileCode className="h-10 w-10 text-[#ffd60a]/40" />
                                    </div>
                                )}
                                {/* Software badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase ${softwareColor}`}>
                                        {softwareLabel}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
                                {/* Background hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative flex items-start justify-between gap-2">
                                    <h3 className="font-bangla text-base sm:text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                        {item.product?.title}
                                    </h3>
                                    <span className="font-mono text-[10px] text-white/30 shrink-0">{item.orderNumber}</span>
                                </div>

                                <div className="relative flex items-center gap-1.5 text-xs text-white/35">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="font-bangla">
                                        ক্রয়:{' '}
                                        {new Date(item.paidAt).toLocaleDateString('bn-BD', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>

                                {/* Download buttons */}
                                <div className="relative mt-auto space-y-2 pt-3 border-t border-white/5">
                                    <a
                                        href={scriptUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between rounded-xl border border-[#ffd60a]/30 bg-[#ffd60a]/10 px-4 py-2.5 text-xs font-bold text-[#ffd60a] transition hover:bg-[#ffd60a]/20"
                                    >
                                        <span className="flex items-center gap-2 font-bangla">
                                            <FileCode className="h-4 w-4" />
                                            স্ক্রিপ্ট কোড ডাউনলোড করুন
                                        </span>
                                        <Download className="h-3.5 w-3.5" />
                                    </a>

                                    <a
                                        href={guideUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                                    >
                                        <span className="flex items-center gap-2 font-bangla">
                                            <FileText className="h-4 w-4" />
                                            ইনস্টলেশন গাইড (PDF) ডাউনলোড
                                        </span>
                                        <Download className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
