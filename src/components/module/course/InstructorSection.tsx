import Image from "next/image";
import MithunSarkar from "@/assets/images/Mithun-Sarkar.png";
import Container from "@/components/ui/container";

const stats = [
    { value: "৬+", label: "বছরের অভিজ্ঞতা" },
    { value: "৫০০+", label: "প্রজেক্ট ডেলিভারড" },
    { value: "২০০০+", label: "স্টুডেন্ট রিচড" },
];

export default function InstructorSection() {
    return (
        <section className="relative bg-[#060f0a] overflow-hidden">

            {/* Dot-grid texture */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Ambient glows */}
            <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Edge separators */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <Container className="relative z-10 py-20 max-w-7xl mx-auto">

                {/* Section badge */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">Lead Instructor</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* — Left: image — */}
                    <div className="flex justify-center lg:justify-start lg:pl-8 xl:pl-16">
                        {/* Double-layer square + circular photo stack */}
                        <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px]">

                            {/* Enhanced Background Glows */}
                            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50 animate-pulse" />

                            {/* Layer 1 — outermost square, subtle rotation, centered */}
                            <div className="absolute inset-0 rounded-[3rem] rotate-[8deg] scale-[0.88]
                                bg-gradient-to-br from-primary/10 via-transparent to-transparent
                                border border-primary/20
                                shadow-[0_0_40px_hsl(156_70%_42%/0.15)] ">
                                {/* Corner accents — all 4 corners */}
                                <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-primary/40 rounded-tl-[3rem]" />
                                <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-primary/40 rounded-tr-[3rem]" />
                                <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-primary/40 rounded-bl-[3rem]" />
                                <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-primary/40 rounded-br-[3rem]" />
                            </div>

                            {/* Layer 2 — inner square, counter-rotated for balance */}
                            <div className="absolute inset-0 rounded-[3rem] rotate-[-4deg] scale-[0.94]
                                bg-gradient-to-br from-primary/15 via-[#060f0a]/80 to-primary/5
                                border border-primary/30 backdrop-blur-sm
                                shadow-[0_0_50px_hsl(156_70%_42%/0.25),inset_0_1px_0_hsl(156_70%_42%/0.2)] ">
                                {/* Corner accents — all 4 corners */}
                                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/60 rounded-tl-[3rem]" />
                                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/60 rounded-tr-[3rem]" />
                                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/60 rounded-bl-[3rem]" />
                                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/60 rounded-br-[3rem]" />
                                {/* Top shimmer line */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent rounded-t-[3rem]" />
                            </div>

                            {/* Circular photo — conic-spin border on top */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative p-[3px] rounded-full overflow-hidden w-[85%] h-[85%]
                                    shadow-[0_0_70px_hsl(156_70%_42%/0.4)] ring-1 ring-primary/20">
                                    <span className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_50%,hsl(156_70%_42%/1)_70%,transparent_100%)]" />
                                    <span className="absolute inset-[-100%] animate-[spin_10s_linear_infinite_reverse] bg-[conic-gradient(from_180deg,transparent_70%,hsl(156_85%_70%/0.6)_90%,transparent_100%)]" />
                                    <div className="relative rounded-full overflow-hidden w-full h-full bg-[#060f0a] p-[4px]">
                                        <div className="relative rounded-full overflow-hidden w-full h-full ring-1 ring-white/10">
                                            <Image
                                                src={MithunSarkar}
                                                alt="Mithun Sarkar — Lead Instructor"
                                                fill
                                                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                                                sizes="(max-width: 640px) 320px, (max-width: 1024px) 384px, 450px"
                                                priority
                                            />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating accent particles */}
                            <div className="absolute top-1/4 -right-12 space-y-4">
                                <div className="w-2 h-2 rounded-full bg-primary/60 blur-[1px] animate-pulse" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/30 ml-4 animate-bounce" />
                                <div className="w-2 h-2 rounded-full bg-primary/40 -ml-2" />
                            </div>
                            <div className="absolute bottom-1/4 -left-12 space-y-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 blur-[1px]" />
                                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse ml-4" style={{ animationDelay: '0.5s' }} />
                            </div>
                        </div>
                    </div>

                    {/* — Right: content — */}
                    <div className="flex flex-col gap-6">

                        {/* Heading */}
                        <h2 className="text-3xl lg:text-5xl font-bold leading-[140%]">
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent pt-2">
                                {/* অভিজ্ঞতা দিয়ে গাইড করা,{" "} */}
                                সঠিক সিদ্ধান্তে সফল
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.45)] pt-4">
                                {/* শুধু তত্ত্ব নয়। */}
                                ক্যারিয়ার
                            </span>
                        </h2>

                        {/* Quote */}
                        <div className="relative pl-5 border-l-2 border-primary/40">
                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary/60" />
                            <p className="text-white/55 italic text-base leading-relaxed font-bangla">
                                &ldquo;আমার লক্ষ্য হলো শিক্ষার্থীদের শুধু সফটওয়্যার শেখানো নয়, বরং প্রফেশনাল মানের বাস্তব দক্ষতা তৈরি করা — যা দিয়ে তারা ফ্রিল্যান্সিং বা লোকাল মার্কেটে সত্যিকারের সাফল্য পাবে।&rdquo;
                            </p>
                        </div>

                        {/* Name & Role */}
                        <div className="flex items-center gap-4">
                            <div className="relative p-[1.5px] rounded-xl overflow-hidden">
                                <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                <div className="relative bg-[#060f0a] rounded-xl px-4 py-2.5">
                                    <p className="font-bold text-white text-base">Mithun Sarkar</p>
                                    <p className="text-primary text-sm font-medium">Founder & Lead Instructor of MISUN ACADEMY</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative divider */}
                        <div className="flex items-center gap-3 w-full max-w-xs">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="group relative overflow-hidden rounded-xl bg-[#060f0a] border border-primary/15
                                    px-5 py-4 transition-all duration-300
                                    hover:border-primary/40 hover:shadow-[0_4px_24px_hsl(156_70%_42%/0.18)]">

                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40 rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40 rounded-tr-xl" />

                                    {/* Top shimmer */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <p className="text-2xl font-black bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_12px_hsl(156_70%_42%/0.4)]">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-white/45 uppercase tracking-widest mt-0.5 font-bangla">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
