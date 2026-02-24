import Link from "next/link";
import Container from "@/components/ui/container";

const stats = [
    { value: "১২০০+", label: "সফল প্রজেক্ট" },
    { value: "৫০+", label: "সাইড প্রজেক্ট" },
    { value: "২৪/৭", label: "মেন্টর সাপোর্ট" },
    { value: "৯৫%", label: "সাফল্য হার" },
];

export default function EnrollCtaSection() {
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
            <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-primary/7 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Edge separators */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <Container className="relative z-10 py-20 max-w-7xl mx-auto">

                {/* Main card */}
                <div className="relative overflow-hidden rounded-3xl
                    bg-gradient-to-br from-[#0a2016] via-[#0d2b1c] to-[#060f0a]
                    border border-primary/25
                    shadow-[0_0_80px_hsl(156_70%_42%/0.18),inset_0_1px_0_hsl(156_70%_42%/0.15)]
                    p-8 md:p-12 lg:p-16">

                    {/* Inner dot-grid */}
                    <div
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60 rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60 rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60 rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60 rounded-br-3xl" />

                    {/* Top shimmer */}
                    <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

                    {/* Large background glow blob */}
                    <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                        {/* — Left: heading + CTA — */}
                        <div className="flex flex-col gap-6">

                            {/* Badge */}
                            <div className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                                </span>
                                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">এখনই শুরু করুন</span>
                            </div>

                            {/* Heading */}
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-bangla leading-[145%]">
                                <span className="bg-gradient-to-r from-white via-white/95 to-white/85 bg-clip-text text-transparent">
                                    নিজের দক্ষতাকে{" "}
                                </span>
                                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.5)]">
                                    বদলে ফেলার
                                </span>
                                <span className="bg-gradient-to-r from-white via-white/95 to-white/85 bg-clip-text text-transparent">
                                    {" "}এখনই সময়!
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="text-white/55 font-bangla text-base leading-relaxed max-w-md">
                                হাজারো শিক্ষার্থী আমাদের সাথে যুক্ত হয়ে তাদের ক্যারিয়ার সফলভাবে গড়ে তুলছেন। আপনি কি আজই শুরু করতে প্রস্তুত?
                            </p>

                            {/* Decorative divider */}
                            <div className="flex items-center gap-3 w-full max-w-[200px]">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                </div>
                                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
                            </div>

                            {/* CTA button */}
                            <div>
                                <Link href="/checkout">
                                    <div className="inline-block relative p-[1.5px] rounded-xl overflow-hidden">
                                        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                                        <button className="relative bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                                            hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                                            transition-all duration-300 text-white font-bold font-bangla text-base
                                            px-10 py-3.5 rounded-xl
                                            shadow-[0_0_24px_hsl(156_70%_42%/0.4)]
                                            hover:shadow-[0_0_36px_hsl(156_70%_42%/0.6)]
                                            cursor-pointer">
                                            আজই এনরোল করুন
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* — Right: stats grid — */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i}
                                    className="group relative overflow-hidden rounded-2xl
                                        bg-[#060f0a]/70 border border-primary/20
                                        px-6 py-7 text-center
                                        transition-all duration-300
                                        hover:border-primary/50
                                        hover:shadow-[0_4px_32px_hsl(156_70%_42%/0.22)]
                                        hover:-translate-y-0.5">

                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50 rounded-tl-2xl" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 rounded-tr-2xl" />

                                    {/* Top shimmer on hover */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                                    <p className="relative z-10 text-3xl md:text-4xl font-black bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_16px_hsl(156_70%_42%/0.5)]">
                                        {stat.value}
                                    </p>
                                    <p className="relative z-10 text-xs text-white/45 uppercase tracking-widest mt-2 font-bangla">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
