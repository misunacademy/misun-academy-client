"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { useAuth } from "@/hooks/useAuth";
import {
    useGetInstructorCoursesQuery,
    useGetInstructorCourseModulesQuery,
    useGetInstructorModuleQuizzesQuery,
    type InstructorCourse,
    type InstructorModule,
} from "@/redux/api/instructorApi";

import { IQuiz } from "@/types/quiz";
import { Plus, ListChecks, BarChart3 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function InstructorQuizzes() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: coursesData } = useGetInstructorCoursesQuery(undefined, { skip: !user });
    const courses: InstructorCourse[] = coursesData?.data ?? [];

    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedBatchId, setSelectedBatchId] = useState<string>("");
    const [selectedModuleId, setSelectedModuleId] = useState<string>("");

    const selectedCourse = courses.find((c) => c._id === selectedCourseId);

    const { data: modulesData, isLoading: modulesLoading } = useGetInstructorCourseModulesQuery(
        { courseId: selectedCourseId, batchId: selectedBatchId },
        { skip: !selectedCourseId || !selectedBatchId },
    );
    const modules: InstructorModule[] = modulesData?.data ?? [];

    const { data: quizzesData, isLoading } = useGetInstructorModuleQuizzesQuery(selectedModuleId, {
        skip: !selectedModuleId,
    });
    const quizzes: IQuiz[] = (quizzesData?.data ?? []) as IQuiz[];

    return (
        <DashboardPageContainer
            heading="My Quizzes"
            subheading="Create and manage quizzes for your courses"
            buttons={
                selectedModuleId ? (
                    <Button onClick={() => router.push(`/dashboard/instructor/quizzes/create?moduleId=${selectedModuleId}`)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Quiz
                    </Button>
                ) : null
            }
            content={
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-full">
                            <Select value={selectedCourseId} onValueChange={(v) => { setSelectedCourseId(v); setSelectedBatchId(""); setSelectedModuleId(""); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course._id} value={course._id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Select value={selectedBatchId} onValueChange={(v) => { setSelectedBatchId(v); setSelectedModuleId(""); }} disabled={!selectedCourseId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCourse?.batches?.map((batch) => (
                                        <SelectItem key={batch._id} value={batch._id}>
                                            {batch.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Select value={selectedModuleId} onValueChange={setSelectedModuleId} disabled={!selectedBatchId}>
                                <SelectTrigger>
                                    <SelectValue placeholder={modulesLoading ? "Loading modules..." : "Select a module"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {modules.map((mod) => (
                                        <SelectItem key={mod._id} value={mod._id}>
                                            {mod.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quizzes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!selectedModuleId ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Select a course and module to view quizzes
                                </div>
                            ) : isLoading ? (
                                <div className="text-center py-12 text-muted-foreground">Loading...</div>
                            ) : quizzes.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No quizzes in this module. Create your first quiz!
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {quizzes.map((quiz) => (
                                        <Card key={quiz._id} className="border-l-4 border-l-primary">
                                            <CardContent className="flex items-center justify-between p-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{quiz.title}</span>
                                                        <Badge variant={quiz.status === 'published' ? 'default' : 'secondary'}>
                                                            {quiz.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {quiz.totalQuestions} questions · {quiz.totalMarks} marks
                                                        {quiz.timeLimit && ` · ${quiz.timeLimit} min`}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/dashboard/instructor/quizzes/${quiz._id}`)}
                                                    >
                                                        <ListChecks className="h-4 w-4 mr-1" />
                                                        Questions
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/dashboard/instructor/quizzes/${quiz._id}/analytics`)}
                                                    >
                                                        <BarChart3 className="h-4 w-4 mr-1" />
                                                        Analytics
                                                    </Button>
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
