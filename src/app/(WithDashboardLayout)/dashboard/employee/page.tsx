'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { useGetEmployeeDashboardDataQuery } from '@/redux/features/employee/employeeApi';
import { Badge } from '@/components/ui/badge';

export default function EmployeeDashboard() {
    const { data, isLoading, error } = useGetEmployeeDashboardDataQuery();

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

    const { totalSalaryPaid, pendingLeaveCount, approvedLeaveCount, recentSalaries } = data.data;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Employee Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Salary Received</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">BDT {totalSalaryPaid.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All paid salaries</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingLeaveCount}</div>
                        <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedLeaveCount}</div>
                        <p className="text-xs text-muted-foreground">Approved leave days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Salaries */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Salary Records</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentSalaries.length > 0 ? (
                        <div className="space-y-4">
                            {recentSalaries.map((s) => (
                                <div key={s._id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">{s.month} {s.year}</p>
                                        <p className="text-xs text-muted-foreground">{s.jobTitle}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium">BDT {s.totalAmount.toLocaleString()}</span>
                                        <Badge variant={s.status === 'Paid' ? 'default' : 'secondary'}>
                                            {s.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No salary records yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}