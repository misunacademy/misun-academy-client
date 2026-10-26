import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

export default function AboutCtaSection() {
  return (
    <section className="relative bg-surface overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute -top-10 left-1/4 w-[400px] h-[400px] bg-primary/7 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="text-xs font-semibold text-primary-glow">এখনই যোগ দিন</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold leading-[1.45] mb-5 text-white">
          <span className="text-white">আপনার ক্যারিয়ার </span>
          <span className="text-primary-glow">এখনই শুরু করুন</span>
        </h2>

        <p className="readable-body mb-10">
          হাজারো শিক্ষার্থীর মতো আপনিও MISUN Academy-র সাথে যুক্ত হয়ে ডিজিটাল স্কিল অর্জন করুন এবং ফ্রিল্যান্সিং বা লোকাল মার্কেটে সফল হোন।
        </p>

        <div className="flex items-center gap-3 w-full max-w-xs mx-auto mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout" className="relative inline-block overflow-hidden rounded-xl p-[1.5px]">
              <AnimatedBorder variant="simple" speed="3s" />
              <span className="relative min-h-[44px] bg-primary hover:bg-primary/90 transition-all duration-300 text-primary-foreground font-bold text-base px-8 py-3.5 rounded-xl shadow-[0_0_24px_hsl(156_70%_42%/0.4)] hover:shadow-[0_0_36px_hsl(156_70%_42%/0.6)] inline-flex items-center gap-2">
                এখনই এনরোল করুন
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
          </Link>
          <Link href="/course-details" className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-surface border border-primary/30 text-white hover:border-primary/60 transition-all duration-300 px-8 py-3.5 rounded-xl text-base font-semibold">
              <ArrowRight className="w-4 h-4 text-primary-glow" aria-hidden="true" />
              কোর্স দেখুন
          </Link>
        </div>
      </div>
    </section>
  );
}
