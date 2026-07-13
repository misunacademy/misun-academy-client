import { ChevronLeft, ChevronRight } from "lucide-react";
import DarkCard from "./DarkCard";
import OutlineBtn from "./OutlineBtn";
import PrimaryBtn from "./PrimaryBtn";

interface CourseLessonNavProps {
    onPrev: () => void;
    onNext: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
    lessonLabel: string;
}

export default function CourseLessonNav({ onPrev, onNext, canGoPrev, canGoNext, lessonLabel }: CourseLessonNavProps) {
    return (
        <DarkCard className="p-4">
            <div className="flex items-center justify-between gap-4">
                <OutlineBtn onClick={onPrev} disabled={!canGoPrev}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </OutlineBtn>

                <span className="text-sm text-white/35 font-medium">{lessonLabel}</span>

                <PrimaryBtn onClick={onNext} disabled={!canGoNext}>
                    Next
                    <ChevronRight className="h-4 w-4" />
                </PrimaryBtn>
            </div>
        </DarkCard>
    );
}
