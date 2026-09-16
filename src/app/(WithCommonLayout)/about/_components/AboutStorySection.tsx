export default function AboutStorySection() {
  return (
    <section className="relative bg-surface overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold leading-[140%]">
            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">আমাদের </span>
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.4)]">গল্প</span>
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-surface border border-primary/15 p-8 md:p-12 shadow-[0_0_60px_hsl(156_70%_42%/0.10)]">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-3xl" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8">
            <strong className="text-primary font-semibold">MISUN Academy</strong> একটি উদ্ভাবনী ডিজিটাল লার্নিং প্ল্যাটফর্ম, যা ভবিষ্যৎ প্রজন্মকে দক্ষ ও কর্মক্ষম করে গড়ে তোলার লক্ষ্য নিয়ে প্রতিষ্ঠিত হয়েছে। আমাদের মূল লক্ষ্য—বাংলাদেশসহ বিশ্বের যে কোনো প্রান্তে থাকা শিক্ষার্থীদের আধুনিক প্রযুক্তি ও ডিজিটাল স্কিল (যেমন: গ্রাফিক ডিজাইন, ফ্রিল্যান্সিং, ডিজিটাল মার্কেটিং, ভিডিও এডিটিং ইত্যাদি) শেখার সুযোগ করে দেওয়া।
          </p>

          <div className="relative pl-5 border-l-2 border-primary/50">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary/70" />
            <p className="text-base md:text-lg text-white/70 leading-relaxed italic">
              আমরা বিশ্বাস করি, প্রত্যেকের মধ্যেই সৃজনশীলতা আছে—সঠিক দিকনির্দেশনা আর প্র্যাকটিক্যাল স্কিল শেখার মাধ্যমে সেই প্রতিভা জাগ্রত করা সম্ভব। MISUN Academy সেই লক্ষ্যেই কাজ করে যাচ্ছে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
