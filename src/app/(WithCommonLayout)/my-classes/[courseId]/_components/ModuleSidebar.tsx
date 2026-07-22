import { BookOpen, CheckCircle, PlayCircle, Lock, Clock, ChevronDown, ChevronUp, ClipboardCheck } from "lucide-react";
import DarkCard from "./DarkCard";

interface Lesson {
    lessonId: string;
    title: string;
    duration?: number;
}

interface QuizItem {
    quizId: string;
    title: string;
    timeLimit?: number;
    totalQuestions: number;
    totalMarks: number;
}

interface ModuleType {
    moduleId: string;
    title: string;
    lessons: Lesson[];
    quizzes?: QuizItem[];
}

export default function ModuleSidebar({
    curriculum,
    courseId,
    activeQuizId,
    currentModuleIndex,
    currentLessonIndex,
    expandedModules,
    toggleModule,
    isLessonCompleted,
    isLessonUnlocked,
    onSelectLesson,
    onSelectQuiz,
}: {
    curriculum: ModuleType[];
    courseId: string;
    activeQuizId?: string | null;
    currentModuleIndex: number;
    currentLessonIndex: number;
    expandedModules: Set<string>;
    toggleModule: (moduleId: string) => void;
    isLessonCompleted: (moduleId: string, lessonId: string) => boolean;
    isLessonUnlocked: (moduleIdx: number, lessonIdx: number) => boolean;
    onSelectLesson: (moduleIdx: number, lessonIdx: number) => void;
    onSelectQuiz?: (quizId: string) => void;
}) {
    const totalModules = curriculum.length;

    return (
        <DarkCard className="overflow-hidden">
            <div className="p-4 border-b border-white/[0.04] flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/15 border border-primary/25">
                    <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold text-white text-sm">Course Modules</h3>
                <span className="ml-auto text-xs text-white/30">{totalModules} modules</span>
            </div>
            <div className="max-h-[68vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="p-3 space-y-1">
                    {curriculum.length === 0 ? (
                        <div className="text-center py-10 px-4 space-y-3">
                            <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center mx-auto mb-2">
                                <BookOpen className="h-5 w-5 text-white/20" />
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed">No modules available yet.</p>
                        </div>
                    ) : (
                        curriculum.map((module, moduleIdx) => {
                            const moduleCompleted = module.lessons.filter((l) => isLessonCompleted(module.moduleId, l.lessonId)).length;
                            const isExpanded = expandedModules.has(module.moduleId);
                            const allDone = moduleCompleted === module.lessons.length;

                            return (
                                <div key={module.moduleId}>
                                    <button
                                        className="w-full flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200 hover:bg-white/[0.03] hover:border-white/[0.06]"
                                        onClick={() => toggleModule(module.moduleId)}
                                    >
                                        <span className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border
                                            ${allDone ? "bg-primary/20 text-primary border-primary/40" : "bg-white/[0.04] text-white/50 border-white/[0.06]"}`}>
                                            {allDone ? <CheckCircle className="w-3.5 h-3.5" /> : moduleIdx + 1}
                                        </span>
                                        <span className={`flex-1 text-xs font-semibold truncate ${allDone ? "text-primary" : "text-white/70"}`}>
                                            {module.title}
                                        </span>
                                        <span className="shrink-0 text-[10px] text-white/30">{moduleCompleted}/{module.lessons.length}</span>
                                        {isExpanded
                                            ? <ChevronUp className="shrink-0 h-3.5 w-3.5 text-white/30" />
                                            : <ChevronDown className="shrink-0 h-3.5 w-3.5 text-white/30" />}
                                    </button>

                                    {isExpanded && (
                                        <div className="ml-3 pl-3 border-l border-white/[0.05] space-y-1 mt-1 mb-2">
                                            {module.lessons.map((lesson, lessonIdx) => {
                                                const isCompleted = isLessonCompleted(module.moduleId, lesson.lessonId);
                                                const isCurrent = moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex;
                                                const isUnlocked = isLessonUnlocked(moduleIdx, lessonIdx) || isCurrent;

                                                return (
                                                    <button
                                                        key={lesson.lessonId}
                                                        onClick={() => onSelectLesson(moduleIdx, lessonIdx)}
                                                        disabled={!isUnlocked}
                                                        className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center gap-2.5
                                                            ${isCurrent
                                                                ? "bg-primary/12 border-primary/35 text-primary shadow-[0_0_10px_hsl(156_70%_42%/0.15)]"
                                                                : isCompleted
                                                                    ? "bg-white/[0.02] border-white/[0.04] text-white/50 hover:bg-white/[0.04]"
                                                                    : isUnlocked
                                                                        ? "bg-transparent border-white/[0.04] text-white/45 hover:bg-white/[0.03] hover:border-white/[0.08] hover:text-white/70"
                                                                        : "bg-transparent border-transparent text-white/20 cursor-not-allowed opacity-50"
                                                            }`}
                                                    >
                                                        <span className="shrink-0">
                                                            {isCompleted ? (
                                                                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                                            ) : isCurrent ? (
                                                                <PlayCircle className="h-3.5 w-3.5 text-primary" />
                                                            ) : isUnlocked ? (
                                                                <PlayCircle className="h-3.5 w-3.5 text-white/30" />
                                                            ) : (
                                                                <Lock className="h-3.5 w-3.5 text-white/20" />
                                                            )}
                                                        </span>
                                                        <span className="flex-1 truncate leading-snug">{lesson.title}</span>
                                                        {lesson.duration && (
                                                            <span className="shrink-0 text-white/25 flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {lesson.duration}m
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                            {module.quizzes && module.quizzes.length > 0 && (
                                                <div className="pt-1 pb-1">
                                                    <div className="text-[10px] font-semibold text-white/20 uppercase tracking-wider px-3 pb-1">Quizzes</div>
                                                    {module.quizzes.map((quiz) => {
                                                        const isActiveQuiz = activeQuizId === quiz.quizId;
                                                        return (
                                                            <button
                                                                key={quiz.quizId}
                                                                onClick={() => onSelectQuiz?.(quiz.quizId)}
                                                                className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center gap-2.5
                                                                    ${isActiveQuiz
                                                                        ? "bg-primary/12 border-primary/35 text-primary shadow-[0_0_10px_hsl(156_70%_42%/0.15)]"
                                                                        : "bg-transparent border-transparent text-white/45 hover:bg-white/[0.03] hover:border-white/[0.08] hover:text-white/70"}`}
                                                            >
                                                                <ClipboardCheck className={`h-3.5 w-3.5 shrink-0 ${isActiveQuiz ? "text-primary" : "text-white/30"}`} />
                                                                <span className="flex-1 truncate leading-snug">{quiz.title}</span>
                                                                <span className="shrink-0 text-[10px] text-white/25">{quiz.totalQuestions} questions</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </DarkCard>
    );
}
