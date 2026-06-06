'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Banknote } from 'lucide-react';
import { SALARY_STRUCTURE, FIXED_ALLOWANCE_TOTAL, CardIconHeader } from './shared';

interface Props {
    grossSalary: number;
}

export function SalaryStructureCard({ grossSalary }: Props) {
    const basic = Math.max(0, grossSalary - FIXED_ALLOWANCE_TOTAL);

    return (
        <Card className="shadow-sm border-0 ring-1 ring-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-4">
                <CardIconHeader icon={Banknote} title="Salary Structure" bgColor="bg-blue-500" />
            </CardHeader>

            <CardContent className="p-0">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50/60">
                            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wide w-1/2">
                                Component
                            </th>
                            <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                Amount (Tk)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">

                        {/* Basic — computed as gross minus fixed allowances */}
                        <tr className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-700">Basic</td>
                            <td className="px-4 py-3 text-right">
                                {grossSalary > 0 ? (
                                    <span className="font-semibold text-emerald-700">
                                        ৳ {basic.toLocaleString()}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400 italic">—</span>
                                )}
                            </td>
                        </tr>

                        {/* Fixed allowance rows */}
                        {SALARY_STRUCTURE.map((row) => (
                            <tr key={row.label} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-700">
                                    {row.label}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                                    ৳ {row.fixed.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    {/* Totals footer */}
                    {grossSalary > 0 && (
                        <tfoot>
                            <tr className="bg-gray-800/5 border-t-2 border-gray-200">
                                <td className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Gross Total
                                </td>
                                <td className="px-4 py-2.5 text-right font-bold text-emerald-700">
                                    ৳ {grossSalary.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </CardContent>
        </Card>
    );
}
