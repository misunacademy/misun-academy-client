'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { CheckCircle, Clock, Gift, ChevronRight } from 'lucide-react';
import type { Salary } from '@/redux/api/employeeApi';
import DashboardPageTableWithPagination from '@/components/layout/DashboardPageTableWithPagination';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
    salaries: Salary[];
}

const COLUMNS = [
    'Month / Year',
    'Job Title',
    'Gross',
    <div key="bonus" className="flex items-center gap-1"><Gift className="w-3 h-3 text-rose-400" />Bonus</div>,
    'Total',
    'Status',
    'Payment Date',
];

export function SalaryHistoryTable({ salaries }: Props) {
    if (salaries.length === 0) return null;

    return (
        <DashboardPageTableWithPagination
            heading="Recent Salary History"
            actions={
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/employee/salary-history" className="flex items-center gap-1">
                        View All
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </Button>
            }
            columns={COLUMNS}
            data={salaries.slice(0, 3)}
            getRowKey={(s) => s._id}
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
        />
    );
}
