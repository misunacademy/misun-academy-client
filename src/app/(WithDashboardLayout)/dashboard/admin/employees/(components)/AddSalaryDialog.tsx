'use client';

import { useState } from 'react';
import { useGetAllEmployeesQuery } from '@/redux/api/employeeAdminApi';
import { useAddSalaryMutation } from '@/redux/api/employeeAdminApi';
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
import { Loader2, Save, X, User, Briefcase, DollarSign, Gift, Calendar } from 'lucide-react';

const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

interface Props {
    open: boolean;
    onClose: () => void;
}

export function AddSalaryDialog({ open, onClose }: Props) {
    const [addSalary, { isLoading }] = useAddSalaryMutation();
    const { data: empData } = useGetAllEmployeesQuery({ limit: 100 });
    const employees = empData?.data?.employees ?? [];

    const [form, setForm] = useState({
        employeeId:   '',
        employeeName: '',
        jobTitle:     '',
        month:        MONTHS[new Date().getMonth()],
        year:         currentYear,
        amount:       '',
        bonus:        '',
        paymentDate:  '',
    });

    const set = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleEmployeeSelect = (id: string) => {
        const emp = employees.find((e) => e._id === id);
        setForm((f) => ({
            ...f,
            employeeId:   id,
            employeeName: emp?.name ?? '',
        }));
    };

    const reset = () => setForm({
        employeeId: '', employeeName: '', jobTitle: '',
        month: MONTHS[new Date().getMonth()], year: currentYear,
        amount: '', bonus: '', paymentDate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.employeeId) { toast.error('Please select an employee.'); return; }
        if (!form.amount || isNaN(Number(form.amount))) { toast.error('Enter a valid salary amount.'); return; }

        try {
            await addSalary({
                employeeId:   form.employeeId,
                employeeName: form.employeeName,
                jobTitle:     form.jobTitle,
                month:        form.month,
                year:         form.year,
                amount:       Number(form.amount),
                bonus:        form.bonus ? Number(form.bonus) : undefined,
                paymentDate:  form.paymentDate || undefined,
            }).unwrap();
            toast.success('Salary record created!');
            reset();
            onClose();
        } catch {
            toast.error('Failed to create salary record.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 z-10 bg-background">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold">
                                Add Salary Record
                            </DialogTitle>
                            <DialogDescription className="text-xs mt-0.5">
                                Create a new payroll entry for an employee.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Employee */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Employee
                        </Label>
                        <Select value={form.employeeId} onValueChange={handleEmployeeSelect} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select employee…" />
                            </SelectTrigger>
                            <SelectContent className="max-h-52">
                                {employees.map((emp) => (
                                    <SelectItem key={emp._id} value={emp._id}>
                                        {emp.name} — <span className="text-muted-foreground text-xs">{emp.email}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Job Title */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" /> Job Title
                        </Label>
                        <Input
                            value={form.jobTitle}
                            onChange={set('jobTitle')}
                            placeholder="e.g. Software Engineer"
                            required
                            disabled={isLoading}
                        />
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
                                <span>
                                    ৳ {(Number(form.amount) + Number(form.bonus || 0)).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }} disabled={isLoading} className="gap-2">
                            <X className="w-4 h-4" /> Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="gap-2 min-w-[130px]">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? 'Saving…' : 'Create Record'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
