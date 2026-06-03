'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// interface ChartData {
//     name?: string;
//     value?: number;
//     [key: string]: string | number | undefined;
// }

interface BatchIncomeEntry {
    batchId: string;
    batchTitle: string;
    courseTitle?: string;
    totalIncome: number;
    totalEnrollments: number;
}

interface DashboardChartsProps {
    courseWiseStats: { courseId: string; courseTitle: string; totalIncome: number; totalEnrollments: number }[];
    batchWiseIncome: BatchIncomeEntry[];
    hasCourseData: boolean;
    hasBatchData: boolean;
}

const truncateLabel = (value: string | undefined, maxLength = 14) => {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
};

const BatchCourseTick = ({
    x,
    y,
    payload
}: {
    x?: number;
    y?: number;
    payload?: { value?: string; payload?: BatchIncomeEntry };
}) => {
    const batchTitle = payload?.payload?.batchTitle ?? payload?.value ?? '';
    const courseTitle = payload?.payload?.courseTitle ?? '';
    const safeX = typeof x === 'number' ? x : 0;
    const safeY = typeof y === 'number' ? y : 0;

    return (
        <g transform={`translate(${safeX},${safeY})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="currentColor" className="text-muted-foreground text-xs">
                {truncateLabel(batchTitle)}
            </text>
            {courseTitle ? (
                <text x={0} y={0} dy={32} textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">
                    {truncateLabel(courseTitle)}
                </text>
            ) : null}
        </g>
    );
};

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
                            <BarChart data={batchWiseIncome} margin={{ top: 12, right: 12, bottom: 36, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="batchTitle" height={48} tick={<BatchCourseTick />} />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [`BDT ${(value as number)?.toLocaleString() || '0'}`, 'Income']}
                                    labelFormatter={(label, payload) => {
                                        const entry = (payload?.[0]?.payload as BatchIncomeEntry | undefined) ?? undefined;
                                        if (!entry) return label as string;
                                        return entry.courseTitle ? `${entry.batchTitle} - ${entry.courseTitle}` : entry.batchTitle;
                                    }}
                                />
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
