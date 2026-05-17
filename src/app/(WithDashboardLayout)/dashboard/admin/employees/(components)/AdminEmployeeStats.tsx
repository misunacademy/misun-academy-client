'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Clock, CheckCircle, TrendingUp, Gift } from 'lucide-react';

interface Props {
    totalEmployees: number;
    totalSalaryPaid: number;
    pendingSalaries: number;
    paidSalaries: number;
    pendingLeaves: number;
    totalBonus: number;
}

export function AdminEmployeeStats({
    totalEmployees, totalSalaryPaid, pendingSalaries,
    paidSalaries, pendingLeaves, totalBonus,
}: Props) {
    const stats = [
        { label: 'Total Employees',   value: String(totalEmployees),                    icon: Users },
        { label: 'Total Salary Paid', value: `৳ ${totalSalaryPaid.toLocaleString()}`,    icon: DollarSign },
        { label: 'Total Bonus Paid',  value: `৳ ${totalBonus.toLocaleString()}`,          icon: Gift },
        { label: 'Paid Salaries',     value: String(paidSalaries),                       icon: TrendingUp },
        { label: 'Pending Salaries',  value: String(pendingSalaries),                    icon: Clock },
        { label: 'Pending Leaves',    value: String(pendingLeaves),                      icon: CheckCircle },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
                <Card key={label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{label}</CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
