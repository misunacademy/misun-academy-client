'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { CheckCircle, Clock, Gift } from 'lucide-react';
import { useGetMySalariesQuery } from '@/redux/api/employeeApi';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import DashboardPageTableWithPagination from '@/components/layout/DashboardPageTableWithPagination';
import { EmployeeStatCards } from '../(components)/EmployeeStatCards';

const COLUMNS = [
    'Month / Year',
    'Job Title',
    'Gross',
    <div key="bonus" className="flex items-center gap-1"><Gift className="w-3 h-3 text-rose-400" />Bonus</div>,
    'Total',
    'Status',
    'Payment Date',
];

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

                    <DashboardPageTableWithPagination
                        heading='All Salary Records'
                        subheading='View all your past salary records'
                        columns={COLUMNS}
                        data={salaries}
                        getRowKey={(s) => s._id}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        emptyState="No salary records found."
                        renderRow={(s) => (
                            <>
                                {/* Month / Year */}
                                <TableCell className="font-semibold text-gray-800 whitespace-nowrap">
                                    {s.month} {s.year}
                                </TableCell>

                                {/* Job Title */}
                                <TableCell className="text-gray-600 whitespace-nowrap">
                                    {s.jobTitle}
                                </TableCell>

                                {/* Gross */}
                                <TableCell className="text-gray-700 whitespace-nowrap">
                                    ৳ {s.amount.toLocaleString()}
                                </TableCell>

                                {/* Bonus — highlighted */}
                                <TableCell className="whitespace-nowrap">
                                    {s.bonus ? (
                                        <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                                            <Gift className="w-3.5 h-3.5" />
                                            ৳ {s.bonus.toLocaleString()}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </TableCell>

                                {/* Total */}
                                <TableCell className="font-bold text-gray-800 whitespace-nowrap">
                                    ৳ {s.totalAmount.toLocaleString()}
                                </TableCell>

                                {/* Status badge */}
                                <TableCell className="whitespace-nowrap">
                                    <Badge
                                        className={
                                            s.status === 'Paid'
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 gap-1'
                                                : 'bg-amber-100 text-amber-700 border-amber-200 gap-1'
                                        }
                                    >
                                        {s.status === 'Paid' ? (
                                            <CheckCircle className="w-3 h-3" />
                                        ) : (
                                            <Clock className="w-3 h-3" />
                                        )}
                                        {s.status}
                                    </Badge>
                                </TableCell>

                                {/* Payment date */}
                                <TableCell className="text-gray-500 whitespace-nowrap">
                                    {s.paymentDate
                                        ? new Date(s.paymentDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })
                                        : <span className="text-gray-300">—</span>}
                                </TableCell>
                            </>
                        )}
                        pagination={{ page, totalPages, total, limit, onPageChange: setPage }}
                    />
                </div>
            }
        />
    );
}
