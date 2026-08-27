'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Gift } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Salary } from '@/redux/api/employeeApi';
import { useGetMySalariesQuery } from '@/redux/api/employeeApi';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import { DataTable } from '@/components/ui/data-table';
import { EmployeeStatCards } from '../_components/EmployeeStatCards';

export default function SalaryHistoryPage() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isFetching } = useGetMySalariesQuery({
        page,
        limit,
    });

    const salaries = data?.data?.salaries ?? [];
    const total = data?.data?.total ?? 0;
    const totalPages = data?.data?.totalPages ?? 1;

    const latestSalary = salaries[0];
    const grossSalary = latestSalary?.amount ?? 0;
    const latestBonus = latestSalary?.bonus ?? 0;
    const totalPaid = salaries
        .filter((s) => s.status === 'Paid')
        .reduce((acc, s) => acc + (s.totalAmount ?? 0), 0);
    const pendingCount = salaries.filter((s) => s.status === 'Pending').length;

    return (
        <DashboardPageContainer
            heading="Salary History"
            subheading="View all your past salary records"
            content={
                <div className="space-y-6">
                    <EmployeeStatCards
                        grossSalary={grossSalary}
                        latestBonus={latestBonus}
                        totalPaid={totalPaid}
                        pendingCount={pendingCount}
                        recordCount={total}
                    />

                    <DataTable
                        heading='All Salary Records'
                        subheading='View all your past salary records'
                        columns={useMemo<ColumnDef<Salary>[]>(() => [
                            { accessorKey: "month", header: "Month / Year", cell: ({ row }) => <span className="font-semibold text-gray-800 whitespace-nowrap">{row.original.month} {row.original.year}</span> },
                            { accessorKey: "jobTitle", header: "Job Title", cell: ({ row }) => <span className="text-gray-600 whitespace-nowrap">{row.original.jobTitle}</span> },
                            { accessorKey: "amount", header: "Gross", cell: ({ row }) => <span className="text-gray-700 whitespace-nowrap">৳ {row.original.amount.toLocaleString()}</span> },
                            { accessorKey: "bonus", header: () => <div className="flex items-center gap-1"><Gift className="w-3 h-3 text-rose-400" />Bonus</div>, cell: ({ row }) => row.original.bonus ? <span className="inline-flex items-center gap-1 font-semibold text-rose-600"><Gift className="w-3.5 h-3.5" />৳ {row.original.bonus.toLocaleString()}</span> : <span className="text-gray-300">—</span> },
                            { accessorKey: "totalAmount", header: "Total", cell: ({ row }) => <span className="font-bold text-gray-800 whitespace-nowrap">৳ {row.original.totalAmount.toLocaleString()}</span> },
                            { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge className={row.original.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 gap-1' : 'bg-amber-100 text-amber-700 border-amber-200 gap-1'}>{row.original.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{row.original.status}</Badge> },
                            { accessorKey: "paymentDate", header: "Payment Date", cell: ({ row }) => row.original.paymentDate ? <span className="text-gray-500 whitespace-nowrap">{new Date(row.original.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> : <span className="text-gray-300">—</span> },
                        ], [])}
                        data={salaries}
                        getRowId={(s) => s._id}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        emptyState="No salary records found."
                        pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
                    />
                </div>
            }
        />
    );
}
