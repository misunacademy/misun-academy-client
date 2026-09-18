/**
 * Pure sequential-unlock helpers for course curriculum navigation.
 *
 * A lesson/quiz is unlocked only when every lesson and quiz in every
 * previous module — plus every earlier item in its own module — is
 * completed. The server enforces the same rule via ModuleProgress rows;
 * these helpers mirror it so the UI can disable locked content up front.
 */

export interface LockableLesson {
    lessonId: string;
}

export interface LockableQuiz {
    quizId: string;
}

export interface LockableModule {
    moduleId: string;
    lessons: LockableLesson[];
    quizzes?: LockableQuiz[] | null;
}

export interface CompletedLesson {
    moduleId: string;
    lessonId: string;
}

export interface CompletedQuiz {
    moduleId: string;
    quizId: string;
}

export function isLessonCompleted(
    completedLessons: CompletedLesson[] | undefined,
    moduleId: string,
    lessonId: string
): boolean {
    return completedLessons?.some((c) => c.moduleId === moduleId && c.lessonId === lessonId) || false;
}

export function isQuizCompleted(
    completedQuizzes: CompletedQuiz[] | undefined,
    moduleId: string,
    quizId: string
): boolean {
    return completedQuizzes?.some((c) => c.moduleId === moduleId && c.quizId === quizId) || false;
}

export function isLessonUnlocked(
    curriculum: LockableModule[],
    completedLessons: CompletedLesson[] | undefined,
    completedQuizzes: CompletedQuiz[] | undefined,
    moduleIdx: number,
    lessonIdx: number
): boolean {
    for (let m = 0; m < moduleIdx; m++) {
        const mod = curriculum?.[m];
        if (!mod) continue;
        for (const les of mod.lessons) {
            if (!isLessonCompleted(completedLessons, mod.moduleId, les.lessonId)) return false;
        }
        for (const quiz of mod.quizzes || []) {
            if (!isQuizCompleted(completedQuizzes, mod.moduleId, quiz.quizId)) return false;
        }
    }
    const mod = curriculum?.[moduleIdx];
    if (!mod) return false;
    for (let l = 0; l < lessonIdx; l++) {
        if (!isLessonCompleted(completedLessons, mod.moduleId, mod.lessons[l].lessonId)) return false;
    }
    return true;
}

export function isQuizUnlocked(
    curriculum: LockableModule[],
    completedLessons: CompletedLesson[] | undefined,
    completedQuizzes: CompletedQuiz[] | undefined,
    moduleIdx: number,
    quizIdx: number
): boolean {
    for (let m = 0; m < moduleIdx; m++) {
        const mod = curriculum?.[m];
        if (!mod) continue;
        for (const les of mod.lessons) {
            if (!isLessonCompleted(completedLessons, mod.moduleId, les.lessonId)) return false;
        }
        for (const quiz of mod.quizzes || []) {
            if (!isQuizCompleted(completedQuizzes, mod.moduleId, quiz.quizId)) return false;
        }
    }
    const mod = curriculum?.[moduleIdx];
    if (!mod) return false;
    for (const les of mod.lessons) {
        if (!isLessonCompleted(completedLessons, mod.moduleId, les.lessonId)) return false;
    }
    for (let q = 0; q < quizIdx; q++) {
        if (!isQuizCompleted(completedQuizzes, mod.moduleId, (mod.quizzes || [])[q].quizId)) return false;
    }
    return true;
}
