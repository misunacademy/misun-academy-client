'use client';

import { useState } from 'react';
import { useUpdateSalaryMutation } from '@/redux/api/employeeAdminApi';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, X, Briefcase, DollarSign, Gift, Calendar } from 'lucide-react';
import type { Salary } from '@/redux/api/employeeApi';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const JOB_TITLES = [
    'Instructor',
    'Senior Visualizer',
    'Visualizer',
    'Video Editor',
    'Design And Social Media Coordinator',
    'Web Developer',
    'Marketing Executive',
    'Community Growth Manager',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

interface Props {
    open: boolean;
    salary: Salary | null;
    onClose: () => void;
}

const getInitialForm = (salary: Salary | null) => ({
    jobTitle:    salary?.jobTitle ?? '',
    month:       salary?.month ?? MONTHS[new Date().getMonth()],
    year:        salary?.year ?? currentYear,
    amount:      salary ? String(salary.amount) : '',
    bonus:       salary?.bonus ? String(salary.bonus) : '',
    paymentDate: salary?.paymentDate
        ? new Date(salary.paymentDate).toISOString().split('T')[0]
        : '',
    status:      (salary?.status ?? 'Pending') as 'Paid' | 'Pending',
});

export function EditSalaryDialog({ open, salary, onClose }: Props) {
    const [updateSalary, { isLoading }] = useUpdateSalaryMutation();

    // Lazy initializer — runs once on mount (key prop in parent forces remount per record)
    const [form, setForm] = useState(() => getInitialForm(salary));

    const set = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!salary) return;
        if (!form.amount || isNaN(Number(form.amount))) {
            toast.error('Enter a valid salary amount.');
            return;
        }

        try {
            await updateSalary({
                id:          salary._id,
                jobTitle:    form.jobTitle,
                month:       form.month,
                year:        form.year,
                amount:      Number(form.amount),
                bonus:       form.bonus ? Number(form.bonus) : undefined,
                paymentDate: form.paymentDate || undefined,
                status:      form.status,
            }).unwrap();
            toast.success('Salary record updated!');
            onClose();
        } catch {
            toast.error('Failed to update salary record.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 z-10 bg-background">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold">Edit Salary Record</DialogTitle>
                            <DialogDescription className="text-xs mt-0.5">
                                Update payroll details for <span className="font-semibold">{salary?.employeeName}</span>.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Job Title */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" /> Job Title
                        </Label>
                        <Select
                            value={form.jobTitle}
                            onValueChange={(v) => setForm((f) => ({ ...f, jobTitle: v }))}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select job title…" />
                            </SelectTrigger>
                            <SelectContent>
                                {JOB_TITLES.map((title) => (
                                    <SelectItem key={title} value={title}>{title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Month + Year */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Month</Label>
                            <Select
                                value={form.month}
                                onValueChange={(v) => setForm((f) => ({ ...f, month: v }))}
                                disabled={isLoading}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m) => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Year</Label>
                            <Select
                                value={String(form.year)}
                                onValueChange={(v) => setForm((f) => ({ ...f, year: Number(v) }))}
                                disabled={isLoading}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {YEARS.map((y) => (
                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5" /> Gross Salary (৳)
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={form.amount}
                            onChange={set('amount')}
                            placeholder="e.g. 50000"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Bonus */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-muted-foreground" /> Bonus (৳)
                            <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            value={form.bonus}
                            onChange={set('bonus')}
                            placeholder="e.g. 5000"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(v) => setForm((f) => ({ ...f, status: v as 'Paid' | 'Pending' }))}
                            disabled={isLoading}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Date */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Payment Date
                            <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                        </Label>
                        <Input
                            type="date"
                            value={form.paymentDate}
                            onChange={set('paymentDate')}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Preview */}
                    {form.amount && (
                        <div className="bg-muted rounded-lg border px-4 py-3 space-y-1.5 text-sm">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Summary</p>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Gross Salary</span>
                                <span className="font-semibold">৳ {Number(form.amount).toLocaleString()}</span>
                            </div>
                            {form.bonus && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bonus</span>
                                    <span className="font-semibold">৳ {Number(form.bonus).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-1.5 font-bold">
                                <span>Total Payable</span>
                                <span>৳ {(Number(form.amount) + Number(form.bonus || 0)).toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="gap-2">
                            <X className="w-4 h-4" /> Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="gap-2 min-w-[130px]">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
