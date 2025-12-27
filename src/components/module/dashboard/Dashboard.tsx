'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Users, DollarSign, Calendar } from 'lucide-react';
import { useGetMetadataQuery } from '@/redux/features/student/studentApi';

interface DashboardData {
    totalEnrolled: number;
    batchWiseEnrolled: { batchId: string; totalEnrolled: number }[];
    courseWiseStats: { courseId: string; courseTitle: string; courseSlug: string; totalIncome: number; totalEnrollments: number }[];
    batchWiseIncome: { batchId: string; batchTitle: string; batchCode: string; totalIncome: number; totalEnrollments: number }[];
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

    const dashboardData: DashboardData = data.data;

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
                        <div className="text-2xl font-bold">BDT {dashboardData.totalIncome.toLocaleString()}</div>
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
                                        <p className="text-sm font-medium">BDT {course.totalIncome.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Batch Performance</CardTitle>
                        <CardDescription>Revenue by batch</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                        <p className="text-sm font-medium">BDT {batch.totalIncome.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Course-wise Income Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course-wise Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboardData.courseWiseStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="courseTitle" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`BDT ${(value as number)?.toLocaleString() || '0'}`, 'Income']} />
                                <Bar dataKey="totalIncome" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Batch-wise Income Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Batch-wise Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboardData.batchWiseIncome}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="batchTitle" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`BDT ${(value as number)?.toLocaleString() || '0'}`, 'Income']} />
                                <Bar dataKey="totalIncome" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}