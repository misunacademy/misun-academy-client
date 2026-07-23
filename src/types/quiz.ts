import { QuizStatus, QuestionType, AttemptStatus } from './enums';

export interface IContentBlock {
    type: 'text' | 'image' | 'text_image' | 'audio' | 'video';
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
    altText?: string;
}

export interface IQuiz {
    _id: string;
    moduleId: string;
    title: string;
    slug: string;
    description?: string;
    instructions?: string;
    passingPercentage: number;
    totalMarks: number;
    totalQuestions: number;
    timeLimit?: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    allowReview: boolean;
    status: QuizStatus;
    orderIndex: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface IQuestion {
    _id: string;
    quizId: string;
    questionType: QuestionType;
    content: IContentBlock;
    options: IContentBlock[];
    correctAnswer?: string;
    explanation?: IContentBlock;
    marks: number;
    zamesPoints: number;
    orderIndex: number;
}

export interface IQuizAnswer {
    questionId: string;
    selectedAnswer: string | null;
    isCorrect: boolean;
    marksAwarded: number;
}

export interface IQuizAttempt {
    _id: string;
    quizId: string;
    userId: string;
    enrollmentId: string;
    attemptNumber: number;
    answers: IQuizAnswer[];
    totalMarks: number;
    earnedMarks: number;
    percentage: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    zamesEarned: number;
    startedAt: string;
    submittedAt?: string;
    timeTaken?: number;
    status: AttemptStatus;
}

export interface QuizAttemptStart {
    attempt: {
        _id: string;
        attemptNumber: number;
        quizId: string;
        startedAt: string;
        status: AttemptStatus;
    };
    quiz: {
        _id: string;
        title: string;
        timeLimit?: number;
        totalMarks: number;
        totalQuestions: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
    };
    questions: IQuestionPlay[];
}

export interface IQuestionPlay {
    _id: string;
    questionType: QuestionType;
    content: IContentBlock;
    options: IContentBlock[];
    marks: number;
    orderIndex: number;
}

export interface IAttemptResult {
    attempt: IQuizAttempt;
    motivationalMessage: {
        emoji: string;
        title: string;
        message: string;
        level: string;
    };
    questions: IQuestionReview[];
}

export interface IQuestionReview {
    _id: string;
    questionType: QuestionType;
    content: IContentBlock;
    options: IContentBlock[];
    correctAnswer?: string;
    explanation?: IContentBlock;
    marks: number;
}

export interface ILeaderboardEntry {
    rank: number;
    userId: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        image?: string;
    };
    totalZames: number;
    quizzesCompleted: number;
    averageScore: number;
    totalMarks: number;
    lastActive: string;
}

export interface IZamesStats {
    totalZames: number;
    quizzesCompleted: number;
    averageScore: number;
    highestScore: number;
    totalMarks: number;
    recentAttempts: {
        attemptId: string;
        quizId: string;
        percentage: number;
        earnedMarks: number;
        totalMarks: number;
        passed: boolean;
        submittedAt: string;
    }[];
    currentRank: number | null;
}

export interface IZamesTransaction {
    _id: string;
    userId: string;
    quizAttemptId?: string;
    quizId?: string;
    source: string;
    points: number;
    balanceBefore: number;
    balanceAfter: number;
    metadata?: Record<string, any>;
    createdAt: string;
}

export interface IAdminQuizStats {
    totalQuizzes: number;
    publishedCount: number;
    draftCount: number;
    totalAttempts: number;
    totalZamesAwarded: number;
}

export interface IAdminQuizResponse {
    _id: string;
    moduleId: {
        _id: string;
        title: string;
        courseId: { _id: string; title: string; slug: string };
    };
    createdBy: { _id: string; name: string; email: string };
    title: string;
    slug: string;
    description?: string;
    status: QuizStatus;
    totalQuestions: number;
    totalMarks: number;
    timeLimit?: number;
    passingPercentage: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    allowReview: boolean;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
    attemptStats: {
        totalAttempts: number;
        averageScore: number;
        passRate: number;
    };
}

export interface IAdminQuizListResponse {
    success: boolean;
    data: {
        quizzes: IAdminQuizResponse[];
        stats: IAdminQuizStats;
    };
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IModuleCurriculumItem {
    type: 'lesson' | 'quiz';
    _id: string;
    title: string;
    orderIndex: number;
    slug?: string;
    description?: string;
    timeLimit?: number;
    totalQuestions?: number;
    totalMarks?: number;
    status?: QuizStatus;
    totalAttempts?: number;
    bestScore?: number | null;
    bestScoreEarned?: number | null;
    bestScoreTotal?: number | null;
    lastAttemptAt?: string | null;
}
