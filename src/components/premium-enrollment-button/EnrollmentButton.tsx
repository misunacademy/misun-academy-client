interface BannerSectionProps {
  courseSlug?: string;
}


export default function EnrollmentButton({ courseSlug }: BannerSectionProps = {}) {
    return (
        <div>
                  {/* ── Premium Enroll CTA ── */}
                        <div className="mt-2 mb-2 relative group inline-block">
                            {/* Ambient pulse halo */}
                            <div
                                className="absolute inset-0 rounded-full blur-md opacity-50 animate-pulse pointer-events-none "
                                style={{ background: 'radial-gradient(ellipse at center, hsl(156 80% 45% / 0.5) 0%, transparent 70%)' }}
                            />
                            {/* Spinning conic border */}
                            <div
                                className="relative p-[1.5px] rounded-full overflow-hidden transition-all duration-500
              group-hover:shadow-[0_0_28px_6px_hsl(156_75%_42%/0.5)]
              shadow-[0_0_18px_3px_hsl(156_70%_38%/0.35)]"
                            >
                                <div
                                    className="absolute inset-[-100%] animate-[spin_3.5s_linear_infinite]"
                                    style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 22%, hsl(156 60% 35% / 0.4) 34%, hsl(156 75% 52%) 44%, hsl(156 90% 72%) 50%, hsl(0 0% 100% / 0.95) 53%, hsl(156 90% 72%) 56%, hsl(156 75% 52%) 62%, hsl(156 60% 35% / 0.3) 74%, transparent 84%)' }}
                                />
                                <a
                                    href={`/checkout?course=${courseSlug}`}
                                    className="relative z-10 flex items-center gap-2.5 rounded-full overflow-hidden
                px-7 py-3.5 transition-all duration-500 group-hover:-translate-y-[1px] cursor-pointer no-underline"
                                    style={{ background: 'linear-gradient(135deg, hsl(156 30% 7%) 0%, hsl(156 25% 11%) 50%, hsl(156 20% 8%) 100%)' }}
                                >
                                    {/* Shimmer */}
                                    <div
                                        className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out"
                                        style={{ background: 'linear-gradient(105deg, transparent 35%, hsl(156 80% 70% / 0.15) 50%, transparent 65%)' }}
                                    />
                                    {/* Live dot */}
                                    <span className="relative flex h-[7px] w-[7px] shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ backgroundColor: 'hsl(156 75% 55%)' }} />
                                        <span className="relative inline-flex rounded-full h-[7px] w-[7px]" style={{ backgroundColor: 'hsl(156 80% 65%)' }} />
                                    </span>
                                    {/* Label */}
                                    <span
                                        className="relative text-base font-bold tracking-wide font-bangla"
                                        style={{ background: 'linear-gradient(90deg, hsl(156 75% 62%) 0%, hsl(156 85% 78%) 50%, hsl(156 70% 60%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                    >
                                        এখনই এনরোল করুন
                                    </span>
                                    {/* Arrow */}
                                    <svg
                                        className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0"
                                        style={{ color: 'hsl(156 80% 72%)' }}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
        </div>
    );
}