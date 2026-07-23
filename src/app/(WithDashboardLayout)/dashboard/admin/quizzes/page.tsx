"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import { useGetAllQuizzesQuery, useDeleteQuizMutation } from "@/redux/api/quizApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { IAdminQuizResponse, IAdminQuizStats } from "@/types/quiz";
import { Course } from "@/types/common";
import { Search, ExternalLink, Trash2, ClipboardList, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminQuizzes() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [courseFilter, setCourseFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    const { data: coursesData } = useGetAllCoursesQuery({});
    const courses = (coursesData?.data || []) as Course[];

    const { data, isLoading } = useGetAllQuizzesQuery({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        courseId: courseFilter !== "all" ? courseFilter : undefined,
        page,
        limit: 15,
    });

    const [deleteQuiz] = useDeleteQuizMutation();

    const quizzes: IAdminQuizResponse[] = data?.data?.quizzes || [];
    const stats: IAdminQuizStats = data?.data?.stats || {
        totalQuizzes: 0,
        publishedCount: 0,
        draftCount: 0,
        totalAttempts: 0,
        totalZamesAwarded: 0,
    };
    const meta = data?.meta || { page: 1, limit: 15, total: 0, totalPages: 0 };

    const handleDelete = async (quizId: string) => {
        try {
            await deleteQuiz(quizId).unwrap();
            toast.success("Quiz deleted successfully");
        } catch (err) {
            toast.error((err as Error)?.message || "Failed to delete quiz");
        }
    };

    return (
        <DashboardPageContainer
            heading="Quiz Management"
            subheading={`${stats.totalQuizzes} quizzes across all courses`}
            content={
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Total Quizzes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{stats.totalQuizzes}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Published</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">{stats.publishedCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Drafts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-yellow-600">{stats.draftCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Total Attempts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{stats.totalAttempts}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Zames Awarded</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-amber-500">★ {stats.totalZamesAwarded}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by quiz title..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(v) => { setStatusFilter(v); setPage(1); }}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={courseFilter}
                            onValueChange={(v) => { setCourseFilter(v); setPage(1); }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Courses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map((course) => (
                                    <SelectItem key={String(course._id)} value={String(course._id)}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Quizzes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-12 text-muted-foreground">Loading quizzes...</div>
                            ) : quizzes.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No quizzes found. Create a quiz from the instructor panel.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {quizzes.map((quiz: IAdminQuizResponse) => (
                                        <Card key={quiz._id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Link
                                                                href={`/dashboard/admin/quizzes/${quiz._id}`}
                                                                className="font-semibold hover:text-primary truncate"
                                                            >
                                                                {quiz.title}
                                                            </Link>
                                                            <Badge
                                                                variant={quiz.status === 'published' ? 'default' : 'secondary'}
                                                                className="shrink-0"
                                                            >
                                                                {quiz.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <ClipboardList className="h-3.5 w-3.5" />
                                                                {quiz.totalQuestions} questions · {quiz.totalMarks} marks
                                                            </span>
                                                            {quiz.moduleId?.courseId && (
                                                                <span>{quiz.moduleId.courseId.title}</span>
                                                            )}
                                                            {quiz.moduleId && (
                                                                <span>Module: {quiz.moduleId.title}</span>
                                                            )}
                                                            {quiz.timeLimit && (
                                                                <span>{quiz.timeLimit} min</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                            {quiz.createdBy && (
                                                                <span>
                                                                    Created by {quiz.createdBy.name}
                                                                </span>
                                                            )}
                                                            {quiz.attemptStats && (
                                                                <>
                                                                    <span>{quiz.attemptStats.totalAttempts} attempts</span>
                                                                    <span>Avg: {quiz.attemptStats.averageScore}%</span>
                                                                    <span>Pass rate: {quiz.attemptStats.passRate}%</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => router.push(`/dashboard/admin/quizzes/${quiz._id}`)}
                                                        >
                                                            <BarChart3 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleDelete(quiz._id)}
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

                            {meta.totalPages > 1 && (
                                <Pagination className="mt-6">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                isActive={page <= 1}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 2)
                                            .map((p, i, arr) => (
                                                <PaginationItem key={p}>
                                                    {i > 0 && arr[i - 1] !== p - 1 && <PaginationEllipsis />}
                                                    <Button
                                                        variant={page === p ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setPage(p)}
                                                    >
                                                        {p}
                                                    </Button>
                                                </PaginationItem>
                                            ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                                isActive={page >= meta.totalPages}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </CardContent>
                    </Card>
                </div>
            }
        />
    );
}
