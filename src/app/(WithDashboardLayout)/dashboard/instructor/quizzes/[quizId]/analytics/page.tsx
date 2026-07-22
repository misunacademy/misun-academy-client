"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { useGetInstructorQuizByIdQuery, useGetInstructorQuizQuestionsQuery } from "@/redux/api/instructorApi";
import { IQuestion } from "@/types/quiz";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, CheckCircle2, XCircle, BarChart3, Clock } from "lucide-react";

export default function QuizAnalyticsPage({ params }: { params: Promise<{ quizId: string }> }) {
    const router = useRouter();
    const { quizId } = use(params);

    const { data: quizData } = useGetInstructorQuizByIdQuery(quizId);
    const quiz = (quizData as any)?.data;
    const { data: questionsData } = useGetInstructorQuizQuestionsQuery(quizId);
    const questions = ((questionsData as any)?.data || []) as any[];

    const totalQuestions = (questions as IQuestion[]).length;
    const totalMarks = (questions as IQuestion[]).reduce((sum, q) => sum + q.marks, 0);

    return (
        <DashboardPageContainer
            heading="Quiz Analytics"
            subheading={`${quiz?.title || "Quiz"} — Performance overview`}
            buttons={
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            }
            content={
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Total Attempts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">--</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Pass Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">--%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    Avg Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">--%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Questions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {totalQuestions}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {" "}({totalMarks} marks)
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Question Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(questions as IQuestion[]).length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No questions in this quiz yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {(questions as IQuestion[]).map((question, index) => (
                                        <Card key={question._id} className="border-l-2 border-l-muted">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">Q{index + 1}</Badge>
                                                        <span className="text-sm font-medium">
                                                            {question.content.type === 'text' || question.content.type === 'text_image'
                                                                ? (question.content.text || `Question ${index + 1}`).substring(0, 60)
                                                                : `[Image] Question ${index + 1}`}
                                                        </span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {question.marks} mark{question.marks !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>Correct: --%</span>
                                                        <span>Attempts: --</span>
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
