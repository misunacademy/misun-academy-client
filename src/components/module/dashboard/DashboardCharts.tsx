'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
    name?: string;
    value?: number;
    [key: string]: string | number | undefined;
}

interface DashboardChartsProps {
    courseWiseStats: { courseId: string; courseTitle: string; totalIncome: number; totalEnrollments: number }[];
    batchWiseIncome: { batchId: string; batchTitle: string; totalIncome: number; totalEnrollments: number }[];
    hasCourseData: boolean;
    hasBatchData: boolean;
}

export default function DashboardCharts({
    courseWiseStats,
    batchWiseIncome,
    hasCourseData,
    hasBatchData
}: DashboardChartsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Course-wise Income Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Course-wise Income</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasCourseData ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={courseWiseStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="courseTitle" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`BDT ${(value as number)?.toLocaleString() || '0'}`, 'Income']} />
                                <Bar dataKey="totalIncome" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                            No course income data available
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Batch-wise Income Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Batch-wise Income</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasBatchData ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={batchWiseIncome}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="batchTitle" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`BDT ${(value as number)?.toLocaleString() || '0'}`, 'Income']} />
                                <Bar dataKey="totalIncome" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                            No batch income data available
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
