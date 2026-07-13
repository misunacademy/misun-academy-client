import { CheckCircle, X } from "lucide-react";
import Link from "next/link";
import DarkCard from "./DarkCard";
import PrimaryBtn from "./PrimaryBtn";

interface CourseCompletionCardProps {
    courseTitle: string;
    calculatedPercentage: number;
    onDismiss: () => void;
}

export default function CourseCompletionCard({ courseTitle, calculatedPercentage, onDismiss }: CourseCompletionCardProps) {
    return (
        <DarkCard className="p-8">
            <button
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all z-20"
                onClick={onDismiss}
            >
                <X className="h-4 w-4" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative text-center space-y-4">
                <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_24px_hsl(156_70%_42%/0.3)]">
                    <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Congratulations! 🎉</h2>
                    <p className="text-white/50 mt-2">You&apos;ve successfully completed &ldquo;{courseTitle}&rdquo;</p>
                </div>
                <div className="text-sm text-white/30 space-y-1">
                    <p>Final progress: <span className="text-primary font-semibold">{calculatedPercentage}%</span></p>
                    <p>Completed on {new Date().toLocaleDateString()}</p>
                </div>
                <Link href="/my-classes/certificates">
                    <PrimaryBtn className="mx-auto">
                        <CheckCircle className="h-4 w-4" />
                        Get Your Certificate
                    </PrimaryBtn>
                </Link>
            </div>
        </DarkCard>
    );
}
