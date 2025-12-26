'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Loader2, Users, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useGetMetadataQuery } from '@/redux/features/student/studentApi';

interface DashboardData {
    totalEnrolled: number;
    batchWiseEnrolled: { batchId: string; totalEnrolled: number }[];
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

    // Format day-wise stats for charts
    const chartData = dashboardData.dayWiseStats.map((stat) => ({
        date: format(new Date(stat.date), 'MMM dd'),
        income: stat.totalIncome,
        enrollment: stat.totalEnrollment,
    }));

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
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
                        <div className="text-2xl font-bold">{dashboardData.totalIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Batches</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardData.batchWiseEnrolled.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Batch-wise Enrollment Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Batch-wise Enrollment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboardData.batchWiseEnrolled}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="batchId" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="totalEnrolled" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Day-wise Stats Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Day-wise Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="income" stroke="#8884d8" name="Income (₹)" />
                                <Line yAxisId="right" type="monotone" dataKey="enrollment" stroke="#82ca9d" name="Enrollment" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}