'use client';

import { useState } from 'react';
import { useAddLeaveRequestMutation } from '@/redux/api/employeeApi';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CalendarDays, Loader2, Send, X } from 'lucide-react';

const LEAVE_TYPES = ['Paid Leave', 'Sick Leave', 'Vacation', 'Other'] as const;
type LeaveType = typeof LEAVE_TYPES[number];

function daysBetween(from: string, to: string) {
    if (!from || !to) return 0;
    return Math.max(0, Math.round(
        (new Date(to).getTime() - new Date(from).getTime()) / 86400000
    ) + 1);
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export function LeaveRequestDialog({ open, onClose }: Props) {
    const [addLeave, { isLoading }] = useAddLeaveRequestMutation();

    const [form, setForm] = useState({
        type:   'Paid Leave' as LeaveType,
        from:   '',
        to:     '',
        reason: '',
    });

    const reset = () => setForm({ type: 'Paid Leave', from: '', to: '', reason: '' });

    const days = daysBetween(form.from, form.to);
    const isDateValid = form.from && form.to && new Date(form.to) >= new Date(form.from);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDateValid) { toast.error('End date must be on or after start date.'); return; }
        if (!form.reason.trim()) { toast.error('Please provide a reason.'); return; }

        try {
            await addLeave({
                type:   form.type,
                from:   form.from,
                to:     form.to,
                reason: form.reason.trim(),
            }).unwrap();
            toast.success('Leave request submitted!');
            reset();
            onClose();
        } catch {
            toast.error('Failed to submit leave request.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
            <DialogContent className="max-w-md p-0 gap-0">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <CalendarDays className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold">
                                Apply for Leave
                            </DialogTitle>
                            <DialogDescription className="text-xs mt-0.5">
                                Submit a leave request for admin approval.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Leave type */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Leave Type</Label>
                        <Select
                            value={form.type}
                            onValueChange={(v) => setForm((f) => ({ ...f, type: v as LeaveType }))}
                            disabled={isLoading}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {LEAVE_TYPES.map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">From</Label>
                            <Input
                                type="date"
                                value={form.from}
                                onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                                required
                                disabled={isLoading}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium">To</Label>
                            <Input
                                type="date"
                                value={form.to}
                                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                                required
                                disabled={isLoading}
                                min={form.from || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {/* Day count preview */}
                    {isDateValid && (
                        <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                            Duration: <span className="font-semibold text-foreground">{days} day{days !== 1 ? 's' : ''}</span>
                        </p>
                    )}
                    {form.from && form.to && !isDateValid && (
                        <p className="text-xs text-destructive">
                            End date must be on or after start date.
                        </p>
                    )}

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Reason</Label>
                        <Textarea
                            rows={3}
                            value={form.reason}
                            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                            placeholder="Briefly describe the reason for your leave…"
                            required
                            disabled={isLoading}
                            className="resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { reset(); onClose(); }}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <X className="w-4 h-4" /> Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !isDateValid}
                            className="gap-2 min-w-[130px]"
                        >
                            {isLoading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                                : <><Send className="w-4 h-4" /> Submit Request</>
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
