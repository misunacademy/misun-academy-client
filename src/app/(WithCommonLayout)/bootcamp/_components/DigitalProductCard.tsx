'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    CheckCircle2,
    Zap,
    ChevronDown,
    ChevronUp,
    FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DigitalProduct } from '@/redux/api/digitalProductApi';

interface DigitalProductCardProps {
    product: DigitalProduct;
    onBuy: (product: DigitalProduct) => void;
}

export function DigitalProductCard({ product, onBuy }: DigitalProductCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const bdtPrice = product.discountPriceBDT ?? product.priceBDT;
    const inrPrice = product.discountPriceINR ?? product.priceINR;
    const hasBdtDiscount = Boolean(product.discountPriceBDT);
    const hasInrDiscount = Boolean(product.discountPriceINR);

    const allFeatures = product.features || [];
    // Show half of features (minimum 2) when collapsed
    const previewCount = Math.max(2, Math.ceil(allFeatures.length / 2));
    const displayedFeatures = isExpanded ? allFeatures : allFeatures.slice(0, previewCount);
    const hasMoreFeatures = allFeatures.length > previewCount;

    return (
        <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
            <div className="p-5 sm:p-6">
                {/* Thumbnail with Floating Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-inner">
                    {product.thumbnail ? (
                        <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                            <FileCode className="h-12 w-12 text-white/20" />
                        </div>
                    )}

                    {/* Gradient Overlay for contrast on floating badges */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

                    {/* Floating Software Badge (Top Left) */}
                    <div className="absolute left-3 top-3 z-10">
                        <Badge
                            variant="outline"
                            className={`backdrop-blur-md shadow-lg font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 ${
                                product.software === 'photoshop'
                                    ? 'border-blue-400/50 bg-blue-950/80 text-blue-300 shadow-blue-950/50'
                                    : product.software === 'illustrator'
                                      ? 'border-orange-400/50 bg-orange-950/80 text-orange-300 shadow-orange-950/50'
                                      : 'border-yellow-400/60 bg-amber-950/85 text-[#ffd60a] shadow-amber-950/50'
                            }`}
                        >
                            {product.software === 'bundle' ? 'Ps + Ai Bundle' : product.software}
                        </Badge>
                    </div>

                    {/* Floating Promo Badge (Top Right) */}
                    {product.badge && (
                        <div className="absolute right-3 top-3 z-10">
                            <span className="rounded-full bg-[#ffd60a] px-3 py-0.5 font-bangla text-[11px] font-extrabold text-black shadow-lg shadow-black/40">
                                {product.badge}
                            </span>
                        </div>
                    )}
                </div>

                {/* Title & Tagline */}
                <div className="mt-4">
                    <h3 className="font-bangla text-lg font-bold text-white transition group-hover:text-[#ffd60a] line-clamp-1">
                        {product.title}
                    </h3>

                    {product.tagline && (
                        <p className="mt-1 font-bangla text-xs leading-relaxed text-white/60 line-clamp-2">
                            {product.tagline}
                        </p>
                    )}
                </div>

                {/* Features List (Half visible with Read More / Truncate toggle) */}
                {allFeatures.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5">
                        <ul className="space-y-2">
                            {displayedFeatures.map((feat, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2 font-bangla text-xs text-white/80"
                                >
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ffd60a]" />
                                    <span className="line-clamp-1">{feat}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Read More / Truncate Button */}
                        {hasMoreFeatures && (
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2.5 inline-flex items-center gap-1 font-bangla text-xs font-semibold text-[#ffd60a] hover:text-[#ffd60a]/80 transition-colors"
                            >
                                {isExpanded ? (
                                    <>
                                        <span>সংক্ষিপ্ত করুন</span>
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </>
                                ) : (
                                    <>
                                        <span>আরও দেখুন (+{allFeatures.length - previewCount}টি ফিচার)</span>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Pricing & CTA */}
            <div className="mt-auto border-t border-white/10 bg-white/[0.015] p-5 sm:p-6">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-[11px] font-bangla text-white/50">
                            মূল্য (বাংলাদেশ):
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mona text-xl font-bold text-emerald-400">
                                ৳{bdtPrice}
                            </span>
                            {hasBdtDiscount && (
                                <span className="font-mona text-xs text-white/40 line-through">
                                    ৳{product.priceBDT}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[11px] font-bangla text-amber-300/70">
                            🇮🇳 ভারত (PhonePe):
                        </div>
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="font-mona text-base font-bold text-amber-300">
                                ₹{inrPrice}
                            </span>
                            {hasInrDiscount && (
                                <span className="font-mona text-[11px] text-white/40 line-through">
                                    ₹{product.priceINR}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => onBuy(product)}
                    className="mt-4 w-full bg-[#ffd60a] py-4 font-bangla text-sm font-bold text-black shadow-md shadow-[#ffd60a]/15 transition-all duration-200 hover:bg-[#ffd60a]/90"
                >
                    <Zap className="mr-2 h-4 w-4" /> এখনই সংগ্রহ করুন
                </Button>

                <div className="mt-2.5 flex items-center justify-center gap-2.5 text-[10px] font-bangla text-white/40">
                    <span>• ইনস্ট্যান্ট ডাউনলোড</span>
                    <span>• লাইফটাইম এক্সেস</span>
                </div>
            </div>
        </div>
    );
}
