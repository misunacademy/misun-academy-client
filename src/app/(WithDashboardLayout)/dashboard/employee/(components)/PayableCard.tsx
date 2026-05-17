'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign, TrendingUp, Gift, Wallet } from 'lucide-react';
import { computeBreakdown, CardIconHeader } from './shared';

interface Props {
    grossSalary: number;
    bonus: number;
    isLoading?: boolean;
}

interface PayRow {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    amount: number;
    textColor: string;
    subLabel?: string;
    highlight?: boolean;
}

export function PayableCard({ grossSalary, bonus, isLoading }: Props) {
    const bd = computeBreakdown(grossSalary);

    const rows: PayRow[] = [
        {
            label: 'Basic Salary',
            icon: DollarSign,
            amount: bd.basic,
            textColor: 'text-emerald-600',
            subLabel: '60% of gross',
        },
        {
            label: 'Allowance',
            icon: TrendingUp,
            amount: bd.allowance,
            textColor: 'text-blue-600',
            subLabel: 'House Rent + Medical + Convenience + Internet + Utility',
        },
        {
            label: 'Bonus',
            icon: Gift,
            amount: bonus,
            textColor: 'text-rose-600',
            subLabel: 'Performance / festive bonus',
            highlight: true,
        },
    ];

    const netPayable = bd.basic + bd.allowance + bonus;

    return (
        <Card className="shadow-sm border-0 ring-1 ring-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-4">
                <CardIconHeader icon={Wallet} title="Payable" bgColor="bg-violet-500" />
            </CardHeader>

            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-50">
                            {rows.map((row) => (
                                <tr
                                    key={row.label}
                                    className={`transition-colors ${
                                        row.highlight
                                            ? 'bg-rose-50/40 hover:bg-rose-50'
                                            : 'hover:bg-gray-50/50'
                                    }`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-start gap-2">
                                            <row.icon
                                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${row.textColor}`}
                                            />
                                            <div>
                                                <p className={`font-medium text-gray-700 ${row.highlight ? 'font-semibold' : ''}`}>
                                                    {row.label}
                                                    {row.highlight && (
                                                        <span className="ml-2 inline-block text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-semibold">
                                                            Bonus
                                                        </span>
                                                    )}
                                                </p>
                                                {row.subLabel && (
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {row.subLabel}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-4 py-3 font-bold text-right align-top ${row.textColor}`}>
                                        {grossSalary || row.amount
                                            ? `৳ ${row.amount.toLocaleString()}`
                                            : '—'}
                                    </td>
                                </tr>
                            ))}

                            {/* Net Payable total */}
                            <tr className="bg-gray-800">
                                <td className="px-4 py-3.5">
                                    <p className="font-bold text-white text-sm">Net Payable</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Basic + Allowance + Bonus
                                    </p>
                                </td>
                                <td className="px-4 py-3.5 text-right align-top">
                                    <p className="font-extrabold text-emerald-300 text-base">
                                        {netPayable ? `৳ ${netPayable.toLocaleString()}` : '—'}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
}
