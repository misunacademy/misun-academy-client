'use client';

import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { CheckCircle, Clock, Gift, ChevronRight } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Salary } from '@/redux/api/employeeApi';
import { DataTable } from '@/components/ui/data-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
    salaries: Salary[];
}

export function SalaryHistoryTable({ salaries }: Props) {
    const columns = useMemo<ColumnDef<Salary>[]>(() => [
        { accessorKey: "month", header: "Month / Year", cell: ({ row }) => <span className="font-semibold text-gray-800 whitespace-nowrap">{row.original.month} {row.original.year}</span> },
        { accessorKey: "jobTitle", header: "Job Title", cell: ({ row }) => <span className="text-gray-600 whitespace-nowrap">{row.original.jobTitle}</span> },
        { accessorKey: "amount", header: "Gross", cell: ({ row }) => <span className="text-gray-700 whitespace-nowrap">৳ {row.original.amount.toLocaleString()}</span> },
        { accessorKey: "bonus", header: () => <div className="flex items-center gap-1"><Gift className="w-3 h-3 text-rose-400" />Bonus</div>, cell: ({ row }) => row.original.bonus ? <span className="inline-flex items-center gap-1 font-semibold text-rose-600"><Gift className="w-3.5 h-3.5" />৳ {row.original.bonus.toLocaleString()}</span> : <span className="text-gray-300">—</span> },
        { accessorKey: "totalAmount", header: "Total", cell: ({ row }) => <span className="font-bold text-gray-800 whitespace-nowrap">৳ {row.original.totalAmount.toLocaleString()}</span> },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge className={row.original.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 gap-1' : 'bg-amber-100 text-amber-700 border-amber-200 gap-1'}>{row.original.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{row.original.status}</Badge> },
        { accessorKey: "paymentDate", header: "Payment Date", cell: ({ row }) => row.original.paymentDate ? <span className="text-gray-500 whitespace-nowrap">{new Date(row.original.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> : <span className="text-gray-300">—</span> },
    ], []);

    if (salaries.length === 0) return null;

    return (
        <DataTable
            heading="Recent Salary History"
            actions={
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/employee/salary-history" className="flex items-center gap-1">
                        View All
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </Button>
            }
            columns={columns}
            data={salaries.slice(0, 3)}
            getRowId={(s) => s._id}
        />
    );
}
