import { AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import type { BatchResponse } from "@/redux/api/batchApi";
import CourseEnrollmentCard from "./CourseEnrollmentCard";

export default function EnrollmentNotOpenModal({
    open,
    onOpenChange,
    courseData,
    batchData,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseData: Record<string, unknown> | undefined;
    batchData: BatchResponse | null;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg font-bangla bg-surface border border-primary/20 text-white z-50 mt-5">
                <DialogHeader className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="relative p-[1.5px] rounded-full overflow-hidden">
                            <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(40_90%_55%)_100%)]" />
                            <div className="relative w-16 h-16 rounded-full bg-[#0f1a10] flex items-center justify-center">
                                <AlertTriangle className="h-7 w-7 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-white">
                        এনরোলমেন্ট এখনো শুরু হয়নি
                    </DialogTitle>
                    <DialogDescription className="text-center text-white/50">
                        নিচে সকল কোর্সের এনরোলমেন্ট সময়সূচি দেখুন।
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    <CourseEnrollmentCard
                        courseData={courseData}
                        batchData={batchData}
                        courseSlug="graphic-design"
                    />
                </div>

                <DialogFooter className="pt-2">
                    <div className="relative group w-full">
                        <div
                            className="absolute inset-0 rounded-xl blur-sm opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                            style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 70%)' }}
                        />
                        <button
                            onClick={() => onOpenChange(false)}
                            className="relative w-full flex items-center justify-center gap-2 py-3 rounded-xl overflow-hidden cursor-pointer
                                border border-white/15 group-hover:border-white/30
                                transition-all duration-400 group-hover:-translate-y-[1px]
                                group-hover:shadow-[0_0_18px_3px_rgba(255,255,255,0.08)]"
                            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 100%)', backdropFilter: 'blur(8px)' }}
                        >
                            <div
                                className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out"
                                style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%)' }}
                            />
                            <svg className="relative w-4 h-4 shrink-0 text-white/50 group-hover:text-white/70 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span
                                className="relative text-sm font-bold tracking-wide font-bangla"
                                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.80) 50%, rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                            >
                                বুঝেছি
                            </span>
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
