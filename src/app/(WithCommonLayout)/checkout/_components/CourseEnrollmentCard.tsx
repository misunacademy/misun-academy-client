import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BatchResponse } from "@/redux/api/batchApi";

function fmtDate(iso: string | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('bn-BD', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

export function isWindowOpen(start: string | undefined, end: string | undefined): boolean {
    if (!start || !end) return false;
    const now = Date.now();
    return now >= new Date(start).getTime() && now <= new Date(end).getTime();
}

function hasBatchStarted(start: string | undefined): boolean {
    if (!start) return false;
    return Date.now() > new Date(start).getTime();
}

export default function CourseEnrollmentCard({
    courseData,
    batchData,
    courseSlug,
}: {
    courseData: Record<string, unknown> | undefined;
    batchData: BatchResponse | null;
    courseSlug: string;
}) {
    const courseName = (courseData?.name as string | undefined) ?? (courseData?.title as string | undefined);
    const batchTitle = batchData?.title;
    const start = batchData?.enrollmentStartDate as string | undefined;
    const end = batchData?.enrollmentEndDate as string | undefined;
    const fee = batchData?.price ?? (courseData?.price as number | undefined) ?? 0;
    const hasStarted = hasBatchStarted(start);
    const isOpen = isWindowOpen(start, end);

    if (!courseName) return null;
    return (
        <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-white/8">
                <p className="text-xs text-yellow-400/70 uppercase tracking-widest mb-0.5">কোর্স</p>
                <p className="font-bold text-white/90 text-sm leading-snug">{courseName}</p>
                {batchTitle && (
                    <p className="text-xs text-primary/70 mt-1">{batchTitle}</p>
                )}
            </div>
            <div className="p-4 space-y-2">
                {start && (
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-primary/70">এনরোলমেন্ট শুরু</p>
                            <p className="text-sm font-bold text-white/90">{fmtDate(start)}</p>
                        </div>
                    </div>
                )}
                {end && (
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                            <Clock className="h-3.5 w-3.5 text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs text-red-400/70">এনরোলমেন্টের শেষ তারিখ</p>
                            <p className="text-sm font-bold text-white/90">{fmtDate(end)}</p>
                        </div>
                    </div>
                )}
                {!start && !end && (
                    <p className="text-xs text-white/40 italic">এনরোলমেন্টের তারিখ শীঘ্রই জানানো হবে।</p>
                )}
                {fee > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-white/8 mt-2">
                        <span className="text-xs text-white/50">কোর্স ফি</span>
                        <span className="text-sm font-bold text-primary">৳{fee}</span>
                    </div>
                )}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${isOpen
                    ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                    : hasStarted
                        ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? 'bg-green-400' : hasStarted ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    {isOpen ? 'এনরোলমেন্ট চলছে' : hasStarted ? 'এনরোলমেন্ট শেষ' : 'শীঘ্রই আসছে'}
                </div>

                {isOpen && (
                    <div className="mt-3 relative group">
                        <div
                            className="absolute inset-0 rounded-xl blur-md opacity-50 animate-pulse"
                            style={{ background: 'radial-gradient(ellipse at center, hsl(156 80% 45% / 0.5) 0%, transparent 70%)' }}
                        />
                        <div className="relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_24px_6px_hsl(156_70%_42%/0.45)] shadow-[0_0_14px_2px_hsl(156_70%_38%/0.3)]">
                            <div
                                className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
                                style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 22%, hsl(156 60% 35% / 0.4) 34%, hsl(156 75% 52%) 44%, hsl(156 90% 72%) 50%, hsl(0 0% 100% / 0.9) 53%, hsl(156 90% 72%) 56%, hsl(156 75% 52%) 62%, hsl(156 60% 35% / 0.3) 74%, transparent 84%)' }}
                            />
                            <Link
                                href={`/checkout?course=${courseSlug}`}
                                className="relative z-10 flex items-center justify-center gap-2.5 w-full py-3 rounded-xl overflow-hidden transition-all duration-500 group-hover:-translate-y-[1px]"
                                style={{ background: 'linear-gradient(135deg, hsl(156 30% 7%) 0%, hsl(156 25% 11%) 50%, hsl(156 20% 8%) 100%)' }}
                            >
                                <div
                                    className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out"
                                    style={{ background: 'linear-gradient(105deg, transparent 35%, hsl(156 80% 70% / 0.15) 50%, transparent 65%)' }}
                                />
                                <span className="relative flex h-[7px] w-[7px] shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ backgroundColor: 'hsl(156 75% 55%)' }} />
                                    <span className="relative inline-flex rounded-full h-[7px] w-[7px]" style={{ backgroundColor: 'hsl(156 80% 65%)' }} />
                                </span>
                                <span
                                    className="relative text-sm font-bold tracking-wide font-mona"
                                    style={{ background: 'linear-gradient(90deg, hsl(156 75% 62%) 0%, hsl(156 85% 78%) 50%, hsl(156 70% 60%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                >
                                    এখনই এনরোল করুন
                                </span>
                                <ArrowRight
                                    className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0"
                                    style={{ color: 'hsl(156 80% 72%)' }}
                                />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
