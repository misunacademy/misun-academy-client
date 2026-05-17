import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Fixed allowance amounts (Tk)
export const ALLOWANCES = {
    houseRent:   3900,
    medical:      650,
    convenience:  650,
    internet:    1000,
    utility:     1000,
} as const;

export const FIXED_ALLOWANCE_TOTAL =
    ALLOWANCES.houseRent +
    ALLOWANCES.medical +
    ALLOWANCES.convenience +
    ALLOWANCES.internet +
    ALLOWANCES.utility; // 7,200 Tk

// Rows rendered in SalaryStructureCard
// Basic is computed at render-time as (gross - FIXED_ALLOWANCE_TOTAL)
export const SALARY_STRUCTURE = [
    { label: 'House Rent',   value: '৳ 3,900',  fixed: ALLOWANCES.houseRent },
    { label: 'Medical',      value: '৳ 650',    fixed: ALLOWANCES.medical },
    { label: 'Convenience',  value: '৳ 650',    fixed: ALLOWANCES.convenience },
    { label: 'Internet',     value: '৳ 1,000',  fixed: ALLOWANCES.internet },
    { label: 'Utility',      value: '৳ 1,000',  fixed: ALLOWANCES.utility },
];

export interface SalaryBreakdown {
    basic: number;
    houseRent: number;
    medical: number;
    convenience: number;
    internet: number;
    utility: number;
    allowance: number;
}

export function computeBreakdown(gross: number): SalaryBreakdown {
    const basic       = Math.max(0, gross - FIXED_ALLOWANCE_TOTAL);
    const houseRent   = ALLOWANCES.houseRent;
    const medical     = ALLOWANCES.medical;
    const convenience = ALLOWANCES.convenience;
    const internet    = ALLOWANCES.internet;
    const utility     = ALLOWANCES.utility;
    const allowance   = FIXED_ALLOWANCE_TOTAL;
    return { basic, houseRent, medical, convenience, internet, utility, allowance };
}

// ─── Placeholder info (extend when API exposes these fields) ──────────────────
export const PLACEHOLDER_INFO = {
    bloodGroup: 'B+',
    whatsapp: '+880 1700-000000',
    nidNumber: '1234567890',
    nidFront: null as string | null,
    presentAddress: 'Dhaka, Bangladesh',
    designation: 'Employee',
};

// ─── Shared colour variant type ───────────────────────────────────────────────
export type ColorVariant = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose';

// ─── InfoRow ──────────────────────────────────────────────────────────────────
export function InfoRow({
    icon: Icon,
    label,
    value,
    highlight,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div
                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5 ${
                    highlight
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                }`}
            >
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">
                    {label}
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words leading-snug">
                    {value || (
                        <span className="text-gray-400 font-normal italic">Not provided</span>
                    )}
                </p>
            </div>
        </div>
    );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<ColorVariant, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue:    'bg-blue-50 text-blue-600 border-blue-100',
    violet:  'bg-violet-50 text-violet-600 border-violet-100',
    amber:   'bg-amber-50 text-amber-600 border-amber-100',
    rose:    'bg-rose-50 text-rose-600 border-rose-100',
};

const ICON_BG: Record<ColorVariant, string> = {
    emerald: 'bg-emerald-500',
    blue:    'bg-blue-500',
    violet:  'bg-violet-500',
    amber:   'bg-amber-500',
    rose:    'bg-rose-500',
};

export function StatCard({
    icon: Icon,
    label,
    value,
    subValue,
    color,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    subValue?: string;
    color: ColorVariant;
}) {
    return (
        <Card className={`overflow-hidden border-none ${COLOR_MAP[color]}`}>
            <CardContent className="p-4 flex items-center gap-4">
                <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${ICON_BG[color]}`}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium opacity-70 uppercase tracking-wide truncate">
                        {label}
                    </p>
                    <p className="text-lg font-bold mt-0.5 truncate">{value}</p>
                    {subValue && (
                        <p className="text-xs opacity-60 mt-0.5 truncate">{subValue}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Section card header helper ───────────────────────────────────────────────
export function CardIconHeader({
    icon: Icon,
    title,
    bgColor,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    title: string;
    bgColor: string;
}) {
    return (
        <div className="flex items-center gap-2 text-base font-bold text-gray-800">
            <div
                className={`w-7 h-7 rounded-md flex items-center justify-center ${bgColor}`}
            >
                <Icon className="w-4 h-4 text-white" />
            </div>
            {title}
        </div>
    );
}
