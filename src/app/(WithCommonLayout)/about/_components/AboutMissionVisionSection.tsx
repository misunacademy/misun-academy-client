import { Target, Eye, ArrowRight } from "lucide-react";
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

const missionItems = [
  "বাংলাদেশের যুব সমাজকে আন্তর্জাতিক মানের ডিজিটাল দক্ষতা শেখানো।",
  "বাস্তব ভিত্তিক (hands-on) শেখার অভিজ্ঞতা প্রদান করা।",
  "ফ্রিল্যান্সিং ও রিমোট ক্যারিয়ার গড়ার জন্য আত্মবিশ্বাসী করে তোলা।",
  "প্রযুক্তি নির্ভর একটি আত্মনির্ভরশীল প্রজন্ম গড়ে তোলা।",
];

export default function AboutMissionVisionSection() {
  return (
    <section className="relative bg-surface overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2016] via-[#0d2b1c] to-surface border border-primary/25 p-10 shadow-[0_0_50px_hsl(156_70%_42%/0.12)] transition-all duration-300 hover:shadow-[0_0_70px_hsl(156_70%_42%/0.22)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/60 rounded-br-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8">
              <div className="relative inline-flex p-[1.5px] rounded-full overflow-hidden mb-5">
                <AnimatedBorder variant="simple" speed="5s" />
                <div className="relative w-16 h-16 rounded-full bg-[#0a2016] flex items-center justify-center">
                  <Target className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Our </span>
                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">Mission</span>
              </h3>
              <p className="text-primary/70 text-sm font-semibold mt-2 tracking-wide uppercase">Skill First, Career Next.</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

            <p className="text-white/55 text-sm mb-6">আমাদের মিশন হলো:</p>
            <ul className="space-y-4">
              {missionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center mt-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-white/65 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2016] via-[#0d2b1c] to-surface border border-primary/25 p-10 shadow-[0_0_50px_hsl(156_70%_42%/0.12)] transition-all duration-300 hover:shadow-[0_0_70px_hsl(156_70%_42%/0.22)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/60 rounded-br-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8">
              <div className="relative inline-flex p-[1.5px] rounded-full overflow-hidden mb-5">
                <AnimatedBorder variant="simple" speed="5s" reverse direction="from-180" />
                <div className="relative w-16 h-16 rounded-full bg-[#0a2016] flex items-center justify-center">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Our </span>
                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">Vision</span>
              </h3>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

            <p className="text-white/55 text-sm mb-6">আমাদের ভিশন হলো:</p>
            <p className="text-sm text-white/65 leading-relaxed mb-6">
              সবার জন্য সাশ্রয়ী, মানসম্মত এবং প্রাসঙ্গিক ডিজিটাল শিক্ষা নিশ্চিত করা, যা তাদের একটি স্বাধীন ও আত্মনির্ভরশীল জীবনের দিকে এগিয়ে নিতে পারে।
            </p>

            <div className="relative overflow-hidden rounded-2xl bg-primary/8 border border-primary/20 p-6">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40 rounded-tr-2xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <p className="text-sm text-white/60 leading-relaxed text-center italic">
                আমরা এমন একটি কমিউনিটি গড়ে তুলতে চাই, যেখানে শেখা মানেই শুধু সার্টিফিকেট নয়, বরং বাস্তবে কাজ করার দক্ষতা অর্জন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
