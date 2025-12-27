"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Trophy, Loader2 } from "lucide-react";
import { useGetStudentDashboardDataQuery } from "@/redux/features/student/studentApi";

interface StudentDashboardData {
    enrolledCoursesCount: number;
    completedCoursesCount: number;
    upcomingClasses: number;
    enrolledCourses: Array<{
        id: string;
        courseTitle: string;
        courseSlug: string;
        batchTitle: string;
        batchCode: string;
        enrolledAt: string;
        status: string;
    }>;
    recentActivity: Array<{
        id: string;
        action: string;
        batch: string;
        date: string;
        status: string;
    }>;
}

export default function StudentDashboardClient() {
    const { data, isLoading, error } = useGetStudentDashboardDataQuery(undefined);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Error loading dashboard data</p>
            </div>
        );
    }

    const dashboardData: StudentDashboardData = data.data;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here&apos;s your learning overview.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.enrolledCoursesCount}</div>
                        <p className="text-xs text-muted-foreground">Active enrollments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.completedCoursesCount}</div>
                        <p className="text-xs text-muted-foreground">Certificates earned</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.upcomingClasses}</div>
                        <p className="text-xs text-muted-foreground">Active batches</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest learning progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dashboardData.recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.batch} • {new Date(activity.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {activity.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>My Courses</CardTitle>
                        <CardDescription>Courses you&apos;re currently enrolled in</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dashboardData.enrolledCourses.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardData.enrolledCourses.slice(0, 3).map((course) => (
                                    <div key={course.id} className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{course.courseTitle}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {course.batchTitle} ({course.batchCode})
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(course.enrolledAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No enrolled courses yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}