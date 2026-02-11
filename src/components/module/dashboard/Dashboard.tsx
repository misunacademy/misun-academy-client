/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, DollarSign, Calendar } from 'lucide-react';
import { useGetMetadataQuery } from '@/redux/features/student/studentApi';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import charts with no SSR to reduce initial bundle size
const DashboardCharts = dynamic(
    () => import('./DashboardCharts'),
    {
        ssr: false,
        loading: () => <ChartsSkeleton />
    }
);

function ChartsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Course-wise Income</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Batch-wise Income</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

interface DashboardData {
    totalEnrolled: number;
    batchWiseEnrolled: { batchId: string; totalEnrolled: number }[];
    courseWiseStats: { courseId: string; courseTitle: string; courseSlug: string; totalIncome: number; totalEnrollments: number }[];
    batchWiseIncome: { batchId: string; batchTitle: string; batchNumber: string; totalIncome: number; totalEnrollments: number }[];
    totalIncome: number;
    dayWiseStats: { date: string; totalIncome: number; totalEnrollment: number }[];
}

export default function Dashboard() {
    const { data, isLoading, error } = useGetMetadataQuery(undefined);

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

    const raw = (data as any)?.data ?? {};
    const dashboardData: DashboardData = {
        totalEnrolled: raw.totalEnrolled ?? 0,
        batchWiseEnrolled: raw.batchWiseEnrolled ?? [],
        courseWiseStats: raw.courseWiseStats ?? [],
        batchWiseIncome: raw.batchWiseIncome ?? [],
        totalIncome: raw.totalIncome ?? 0,
        dayWiseStats: raw.dayWiseStats ?? [],
    };

    const hasCourseData = dashboardData.courseWiseStats.length > 0;
    const hasBatchData = dashboardData.batchWiseIncome.length > 0;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.totalEnrolled}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">BDT {(dashboardData.totalIncome ?? 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.courseWiseStats.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.batchWiseIncome.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Course-wise Analytics */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Courses</CardTitle>
                        <CardDescription>Revenue and enrollment by course</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasCourseData ? (
                            <div className="space-y-4">
                                {dashboardData.courseWiseStats.slice(0, 5).map((course, index) => (
                                    <div key={course.courseId} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{course.courseTitle}</p>
                                                <p className="text-xs text-muted-foreground">{course.totalEnrollments} students</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">BDT {(course.totalIncome ?? 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                No course data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Batch Performance</CardTitle>
                        <CardDescription>Revenue by batch</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasBatchData ? (
                            <div className="space-y-4">
                                {dashboardData.batchWiseIncome.slice(0, 5).map((batch, index) => (
                                    <div key={batch.batchId} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{batch.batchTitle}</p>
                                                <p className="text-xs text-muted-foreground">{batch.totalEnrollments} students</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">BDT {(batch.totalIncome ?? 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-muted-foreground">
                                No batch data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <DashboardCharts
                courseWiseStats={dashboardData.courseWiseStats}
                batchWiseIncome={dashboardData.batchWiseIncome}
                hasCourseData={hasCourseData}
                hasBatchData={hasBatchData}
            />
        </div>
    );
}
