import { AlertTriangle, Check } from "lucide-react";
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
                            aria-hidden="true"
                            className="absolute inset-0 rounded-xl bg-primary/40 blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                        />
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="relative w-full flex items-center justify-center gap-2 py-3 rounded-xl overflow-hidden cursor-pointer
                                bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark
                                text-white border border-primary/40 group-hover:border-primary-glow/70
                                transition-all duration-300 group-hover:-translate-y-[1px]
                                group-hover:shadow-[0_0_22px_4px_hsl(var(--primary)/0.45)]
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            />
                            <Check className="relative w-4 h-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                            <span className="relative text-sm font-bold tracking-wide font-bangla">
                                বুঝেছি
                            </span>
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
