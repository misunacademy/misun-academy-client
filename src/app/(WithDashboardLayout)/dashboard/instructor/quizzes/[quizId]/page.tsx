"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import {
    useGetInstructorQuizByIdQuery,
    useGetInstructorQuizQuestionsQuery,
    useUpdateInstructorQuizMutation,
    useDeleteInstructorQuestionMutation,
    useDuplicateInstructorQuestionMutation,
    useReorderInstructorQuestionsMutation,
} from "@/redux/api/instructorApi";
import { IQuestion } from "@/types/quiz";
import { Plus, Pencil, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { ContentBlockDisplay } from "@/components/quiz/ContentBlockDisplay";

export default function QuizDetailPage({ params }: { params: Promise<{ quizId: string }> }) {
    const router = useRouter();
    const { quizId } = use(params);

    const { data: quizData, isLoading: quizLoading } = useGetInstructorQuizByIdQuery(quizId);
    const quiz = quizData?.data;
    const { data: questionsData } = useGetInstructorQuizQuestionsQuery(quizId);
    const questions: IQuestion[] = questionsData?.data ?? [];
    const [updateQuiz] = useUpdateInstructorQuizMutation();
    const [deleteQuestion] = useDeleteInstructorQuestionMutation();
    const [duplicateQuestion] = useDuplicateInstructorQuestionMutation();
    const [reorderQuestions] = useReorderInstructorQuestionsMutation();

    const handleDelete = async (questionId: string) => {
        try {
            await deleteQuestion(questionId).unwrap();
            toast.success("Question deleted");
        } catch {
            toast.error("Failed to delete question");
        }
    };

    const handleDuplicate = async (questionId: string) => {
        try {
            await duplicateQuestion(questionId).unwrap();
            toast.success("Question duplicated");
        } catch {
            toast.error("Failed to duplicate question");
        }
    };

    const handleMoveUp = async (index: number) => {
        if (index === 0) return;
        const newOrders = questions.map((q, i) => ({
            questionId: q._id,
            orderIndex: i === index ? index - 1 : i === index - 1 ? index : i,
        }));
        try {
            await reorderQuestions({ quizId, questionOrders: newOrders }).unwrap();
            toast.success("Questions reordered");
        } catch {
            toast.error("Failed to reorder");
        }
    };

    const handleMoveDown = async (index: number) => {
        if (index === questions.length - 1) return;
        const newOrders = questions.map((q, i) => ({
            questionId: q._id,
            orderIndex: i === index ? index + 1 : i === index + 1 ? index : i,
        }));
        try {
            await reorderQuestions({ quizId, questionOrders: newOrders }).unwrap();
            toast.success("Questions reordered");
        } catch {
            toast.error("Failed to reorder");
        }
    };

    const handleTogglePublish = async () => {
        try {
            const newStatus = quiz?.status === 'published' ? 'draft' : 'published';
            await updateQuiz({ quizId, data: { status: newStatus } }).unwrap();
            toast.success(`Quiz ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
        } catch {
            toast.error("Failed to update quiz status");
        }
    };

    if (quizLoading) return <div className="p-8">Loading quiz...</div>;

    return (
        <DashboardPageContainer
            heading={quiz?.title || "Quiz Details"}
            subheading={`${quiz?.totalQuestions || 0} questions · ${quiz?.totalMarks || 0} marks${quiz?.timeLimit ? ` · ${quiz.timeLimit} min` : ""}`}
            buttons={
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/dashboard/instructor/quizzes/${quizId}/analytics`)}>
                        Analytics
                    </Button>
                    <Button onClick={() => router.push(`/dashboard/instructor/quizzes/create?quizId=${quizId}`)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Settings
                    </Button>
                    <Button
                        variant={quiz?.status === 'published' ? 'secondary' : 'default'}
                        onClick={handleTogglePublish}
                    >
                        {quiz?.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                </div>
            }
            content={
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Questions</CardTitle>
                            <Button
                                onClick={() => router.push(`/dashboard/instructor/quizzes/${quizId}/questions/new`)}
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Question
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {questions.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No questions yet. Add your first question!
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {questions.map((question, index) => (
                                        <Card key={question._id} className="border-l-2 border-l-primary">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex flex-col gap-1 pt-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-5 w-5"
                                                            onClick={() => handleMoveUp(index)}
                                                            disabled={index === 0}
                                                        >
                                                            <ArrowUp className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-5 w-5"
                                                            onClick={() => handleMoveDown(index)}
                                                            disabled={index === questions.length - 1}
                                                        >
                                                            <ArrowDown className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <span className="text-sm font-medium text-muted-foreground shrink-0 mt-0.5">
                                                                Q{index + 1}.
                                                            </span>
                                                            <div className="flex-1">
                                                                <ContentBlockDisplay content={question.content} variant="question" />
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {question.questionType === 'mcq' ? 'MCQ' : 'True/False'}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {question.marks} mark{question.marks !== 1 ? 's' : ''}
                                                                </Badge>
                                                                {question.zamesPoints > 0 && (
                                                                    <Badge variant="secondary" className="text-xs text-amber-500">
                                                                        ★ {question.zamesPoints} Zames
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            {question.options.map((option, oi) => (
                                                                <div
                                                                    key={oi}
                                                                    className="flex items-center gap-2 p-2 rounded bg-muted/50"
                                                                >
                                                                    <span className="text-xs font-mono text-muted-foreground">
                                                                        {String.fromCharCode(65 + oi)}.
                                                                    </span>
                                                                    <ContentBlockDisplay content={option} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/dashboard/instructor/quizzes/${quizId}/questions/${question._id}/edit`
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleDuplicate(question._id)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleDelete(question._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            }
        />
    );
}
