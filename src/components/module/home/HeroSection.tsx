import Image from 'next/image';
import { HeroBanner } from '@/assets/images';
import { HeroBg } from '@/assets/svg';
import { Briefcase, Video, UserCheck, Clock, Home, PenTool, Palette, Layers, Crop, MousePointer2 } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div
      className="relative min-h-screen border-b border-white/5 overflow-hidden"
      style={{
        backgroundImage: `url(${HeroBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0a0f18', // Fallback deep navy
      }}
    >
      {/* ── Background Overlays & Animated Rings ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f18]/80 via-[#0a0f18]/40 to-[#0a0f18] z-0" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />

      <div className="absolute top-1/4 -left-20 lg:left-10 w-64 h-64 md:w-96 md:h-96 border-[8px] md:border-[16px] border-primary/10 rounded-full animate-zoom-in-out z-0 blur-xl md:blur-2xl" />
      <div className="absolute bottom-10 -right-20 lg:right-1/4 w-80 h-80 md:w-[30rem] md:h-[30rem] border-[12px] md:border-[24px] border-primary/5 rounded-full animate-zoom-in-out z-0 blur-2xl md:blur-3xl" style={{ animationDelay: '4s' }} />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 min-h-screen pt-16 pb-20 flex flex-col justify-center">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* ── Left Column: Typography & Info ── */}
          <div className="font-bangla space-y-8 max-w-2xl">

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-blue-500/20 hover:border-blue-500/30">
                <Home size={16} /> ঘরে বসেই
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-glow text-sm font-medium backdrop-blur-sm transition-colors hover:bg-primary/20 hover:border-primary/30">
                <PenTool size={16} /> ডিজাইন শেখা
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-yellow-500/20 hover:border-yellow-500/30">
                <Briefcase size={16} /> ক্যারিয়ার গড়া
              </span>
            </div>

            {/* Headings */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                <span className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent py-3">
                  {/* গ্রাফিক্স ডিজাইন */}
                  সঠিক সিদ্ধান্তে সফল 
                </span>
                {/* কোর্স */}
                ক্যারিয়ার
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white/90 leading-snug">
                আপনার ক্রিয়েটিভ <span className="text-primary-glow">ক্যারিয়ার</span> শুরু করুন আজই!
              </h2>
            </div>

            {/* Paragraph */}
            <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-[90%] font-light">
              ডিজিটাল এই যুগে সঠিক স্কিল শেখার মাধ্যমেই তৈরি হবে আপনার সফল ক্যারিয়ার। আর সেই পথটা সহজ করতে, শুরু থেকে শেষ পর্যন্ত আপনার পাশে থাকবে <strong className="text-primary font-medium tracking-wide">MISUN Academy</strong>। শুধু শেখানো নয়, আমরা বিশ্বাস করি একজন শিক্ষার্থীর পরিপূর্ণ ক্যারিয়ার গঠনে গাইড করাটাই সবচেয়ে গুরুত্বপূর্ণ।
            </p>

            {/* Platform Highlights (Glass Pill) */}
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] w-full">
              {/* Highlight 1 */}
              <div className="flex items-center gap-3  ">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <UserCheck size={18} className="text-primary-glow" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">এক্সপার্ট মেন্টরশিপ</div>
                  <div className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">সবসময় গাইডেন্স</div>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-white/10" />

              {/* Highlight 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Video size={18} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">লাইভ সাপোর্ট</div>
                  <div className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">নিয়মিত প্র্যাকটিস</div>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-white/10" />

              {/* Highlight 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                  <Clock size={18} className="text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">লাইফটাইম এক্সেস</div>
                  <div className="text-[11px] text-white/50 uppercase tracking-wider mt-0.5">কোর্স রেকর্ডিং</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link href="/courses">
                {/* Spinning glowing border wrapper */}
                <div className="relative inline-flex p-[2px] rounded-xl overflow-hidden
                  shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                  hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                  hover:scale-105 hover:-translate-y-0.5
                  active:scale-95 active:translate-y-0
                  transition-all duration-300 ease-out">
                  {/* Rotating conic-gradient border */}
                  <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(156_70%_42%)_25%,hsl(156_85%_70%)_50%,hsl(156_70%_42%)_75%,transparent_100%)]" />
                  <button className="group relative overflow-hidden
                    inline-flex items-center gap-2
                    px-8 py-3.5
                    text-base font-bold tracking-wide rounded-[10px]
                    bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                    text-white
                    hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                    transition-all duration-300 ease-out">
                    <span className="relative z-10 flex items-center gap-2">
                      আমাদের কোর্সসমূহ দেখুন
                      <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </span>
                    {/* Shine sweep */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  </button>
                </div>
              </Link>
            </div>

          </div>

          {/* ── Right Column: Hero Image & 3D Floating Elements ── */}
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center mt-12 lg:mt-0">

            {/* The Main Image */}
            <div className="relative z-10 w-[85%] h-[85%] transition-transform duration-1000 ease-out hover:scale-105 hover:rotate-1">
              {/* Image Glow Underneath */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-90" />

              <Image
                src={HeroBanner}
                alt="Graphic Design Hero Banner"
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 86vw, 42vw"
                priority
                quality={65}
                className="relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* ── 3D Floating Glass Elements ── */}
            {/* Top Left: Palette */}
            <div className="absolute top-[10%] left-[5%] z-20 animate-[bounce_5s_infinite_ease-in-out]">
              <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.3)] transform -rotate-12 transition-transform hover:scale-110 hover:rotate-0 hover:border-primary/50 cursor-default">
                <Palette className="w-6 h-6 md:w-8 md:h-8 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
              </div>
            </div>

            {/* Top Right: Pen Tool */}
            <div className="absolute top-[20%] right-[5%] z-20 animate-[bounce_4s_infinite_ease-in-out_1s]">
              <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-md shadow-[0_10px_30px_hsla(156,70%,42%,0.2)] transform rotate-12 transition-transform hover:scale-110 hover:-rotate-12 hover:border-primary cursor-default">
                <PenTool className="w-5 h-5 md:w-6 md:h-6 text-primary-glow drop-shadow-[0_0_8px_hsla(156,70%,42%,0.8)]" />
              </div>
            </div>

            {/* Bottom Left: Layers */}
            <div className="absolute bottom-[25%] left-[2%] z-20 animate-[bounce_6s_infinite_ease-in-out_2s]">
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-md shadow-[0_10px_30px_rgba(59,130,246,0.2)] transform -rotate-6 transition-transform hover:scale-110 hover:rotate-6 hover:border-blue-400/50 cursor-default">
                <div className="relative">
                  <Layers className="w-7 h-7 md:w-9 md:h-9 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]" />
                  {/* Tiny decorative dot */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bottom Right: Crop Tool */}
            <div className="absolute bottom-[15%] right-[10%] z-20 animate-[bounce_4.5s_infinite_ease-in-out_0.5s]">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 backdrop-blur-md shadow-[0_10px_30px_rgba(234,179,8,0.2)] transform rotate-6 transition-transform hover:scale-110 hover:-rotate-6 hover:border-yellow-400/50 cursor-default">
                <Crop className="w-5 h-5 md:w-7 md:h-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              </div>
            </div>

            {/* Center Background Tech Dots (Decorative) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-dashed border-white/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-dashed border-primary/10 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none -z-10" />

          </div>

        </div>
      </div>
    </div>
  );
}
