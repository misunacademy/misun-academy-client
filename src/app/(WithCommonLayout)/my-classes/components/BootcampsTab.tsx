"use client";

import { Flame, PlayCircle, Clock3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import {
  useGetMyBootcampPurchasesQuery,
  type BootcampPurchase,
} from "@/redux/api/bootcampApi";

const statusStyle: Record<string, string> = {
  paid: "bg-primary/20 text-primary border-primary/40",
  pending: "bg-amber-500/15 text-amber-400 border-amber-400/40",
  rejected: "bg-red-500/15 text-red-400 border-red-400/40",
};

const statusLabel: Record<string, string> = {
  paid: "পেইড",
  pending: "যাচাইকরণ চলছে",
  rejected: "বাতিল",
};

const BootcampPurchaseCard = memo(function BootcampPurchaseCard({
  purchase,
}: {
  purchase: BootcampPurchase;
}) {
  const bootcamp = purchase.bootcamp;
  const image = bootcamp?.posterImage || bootcamp?.thumbnail;
  const slug = bootcamp?.slug;
  const isPaid = purchase.status === "paid";

  return (
    <div className="group relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5">
      <span className="absolute inset-0 rounded-2xl border border-primary/10 group-hover:border-transparent transition-all duration-300" />

      <div
        className="relative flex flex-col sm:flex-row min-h-[160px] rounded-2xl bg-surface overflow-hidden
        group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-500"
      >
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-2xl z-10" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-2xl z-10" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/15 rounded-bl-2xl z-10" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/15 rounded-br-2xl z-10" />

        <div className="relative w-full sm:w-56 md:w-64 shrink-0 min-h-[140px] sm:min-h-0">
          {image ? (
            <Image
              src={image}
              alt={bootcamp?.title ?? "Bootcamp"}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 640px) 100vw, 256px"
            />
          ) : (
            <div className="w-full h-full min-h-[140px] bg-white/5 flex items-center justify-center text-white/30 text-xs">
              No Image
            </div>
          )}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border font-bangla ${
                statusStyle[purchase.status] ?? "bg-white/10 text-white/60 border-white/10"
              }`}
            >
              {statusLabel[purchase.status] ?? purchase.status}
            </span>
          </div>
        </div>

        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2 font-bangla">
              {bootcamp?.title ?? "বুটক্যাম্প"}
              {bootcamp?.season ? (
                <span className="text-white/40"> • {bootcamp.season}</span>
              ) : null}
            </h3>
            <p className="text-sm text-white/45 mt-1 flex items-center gap-1.5">
              <Clock3 className="w-3.5 h-3.5" />
              কেনা হয়েছে:{" "}
              {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              <span className="text-white/30">• ৳{purchase.amount}</span>
            </p>
          </div>

          {!isPaid && (
            <p className="relative text-sm text-amber-400/80 leading-relaxed font-bangla">
              {purchase.status === "pending"
                ? purchase.method === "SSLCommerz"
                  ? "SSLCommerz পেমেন্টটি শুরু হয়েছে কিন্তু এখনও সম্পন্ন হয়নি। সফল পেমেন্ট শেষে স্বয়ংক্রিয়ভাবে আনলক হবে — না হলে বুটক্যাম্প পেজ থেকে আবার পেমেন্ট করুন।"
                  : "পেমেন্ট যাচাই হলে ভিডিও আনলক হবে।"
                : "এই পারচেজটি বাতিল হয়েছে — আবার কিনতে বুটক্যাম্প পেজে যান।"}
            </p>
          )}

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 mt-auto pt-1">
            <div className="flex items-center gap-2 sm:ml-auto">
              {slug ? (
                <Link href={`/bootcamp/${slug}${isPaid ? "#bootcamp-videos" : ""}`}>
                  <button
                    className="group/btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm font-bangla
                    bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark text-white
                    shadow-[0_0_14px_hsl(156_70%_42%/0.35)] hover:shadow-[0_0_22px_hsl(156_70%_42%/0.55)]
                    transition-all duration-300 hover:-translate-y-px"
                  >
                    <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    {isPaid ? "ভিডিও দেখুন" : "বিস্তারিত দেখুন"}
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm opacity-40 cursor-not-allowed bg-white/5 border border-white/10 text-white/60"
                >
                  <PlayCircle className="w-4 h-4" />
                  Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export function BootcampsTab() {
  const { data, isLoading, error } = useGetMyBootcampPurchasesQuery();
  const purchases = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/5 border border-white/10" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-8 text-center">
        <p className="font-bangla text-sm text-red-300">
          বুটক্যাম্প পারচেজ লোড করা যায়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-surface overflow-hidden flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/25">
          <Flame className="h-10 w-10 text-primary" />
        </div>
        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-2 font-bangla">কোনো বুটক্যাম্প কেনা হয়নি</h3>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed font-bangla">
            আপনি এখনো কোনো বুটক্যাম্প রেকর্ডিং কেনেননি। রেকর্ডিং ব্রাউজ করে শেখা শুরু করুন।
          </p>
        </div>
        <Link href="/bootcamp" className="relative">
          <button
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm font-bangla
            bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark text-white
            shadow-[0_0_20px_hsl(156_70%_42%/0.3)] hover:shadow-[0_0_30px_hsl(156_70%_42%/0.5)]
            transition-all duration-300 hover:-translate-y-0.5"
          >
            Browse Bootcamps
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {purchases.map((purchase) => (
        <BootcampPurchaseCard key={purchase._id} purchase={purchase} />
      ))}
    </div>
  );
}
