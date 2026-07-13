'use client';

import { DollarSign, TrendingUp, Clock, Calendar, Gift } from 'lucide-react';
import { StatCard } from './shared';

interface Props {
    grossSalary: number;
    totalPaid: number;
    latestBonus: number;
    pendingCount: number;
    recordCount: number;
}

export function EmployeeStatCards({
    grossSalary,
    totalPaid,
    latestBonus,
    pendingCount,
    recordCount,
}: Props) {
    const fmt = (n: number) => `৳ ${n.toLocaleString()}`;

    return (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <StatCard
                icon={DollarSign}
                label="Gross Salary"
                value={grossSalary ? fmt(grossSalary) : '—'}
                subValue="Current month"
                color="emerald"
            />
            <StatCard
                icon={Gift}
                label="Bonus"
                value={latestBonus ? fmt(latestBonus) : '—'}
                subValue={latestBonus ? 'Latest month bonus' : 'No bonus this month'}
                color="rose"
            />
            <StatCard
                icon={TrendingUp}
                label="Total Paid"
                value={totalPaid ? fmt(totalPaid) : '৳ 0'}
                subValue="All time"
                color="blue"
            />
            <StatCard
                icon={Clock}
                label="Pending"
                value={`${pendingCount} month${pendingCount !== 1 ? 's' : ''}`}
                subValue="Awaiting payment"
                color="amber"
            />
            <StatCard
                icon={Calendar}
                label="Records"
                value={`${recordCount}`}
                subValue="Payroll entries"
                color="violet"
            />
        </div>
    );
}
