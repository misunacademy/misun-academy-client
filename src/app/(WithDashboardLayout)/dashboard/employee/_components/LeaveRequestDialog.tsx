'use client';

import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddLeaveRequestMutation } from '@/redux/api/employeeApi';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarDays, Loader2, Send, X } from 'lucide-react';

const LEAVE_TYPES = ['Paid Leave', 'Sick Leave', 'Vacation', 'Other'] as const;

const leaveSchema = z.object({
    type: z.enum(LEAVE_TYPES),
    from: z.string().min(1, 'Start date is required'),
    to: z.string().min(1, 'End date is required'),
    reason: z.string().min(1, 'Please provide a reason'),
}).refine(
    (data) => !data.from || !data.to || new Date(data.to) >= new Date(data.from),
    { message: 'End date must be on or after start date', path: ['to'] }
);

type LeaveFormValues = z.infer<typeof leaveSchema>;

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

    const form = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema) as Resolver<LeaveFormValues>,
        defaultValues: {
            type: 'Paid Leave',
            from: '',
            to: '',
            reason: '',
        },
    });

    const watchedFrom = useWatch({ control: form.control, name: 'from' });
    const watchedTo = useWatch({ control: form.control, name: 'to' });
    const days = daysBetween(watchedFrom, watchedTo);
    const datesFilled = watchedFrom && watchedTo;
    const isDateValid = datesFilled && new Date(watchedTo) >= new Date(watchedFrom);

    const handleSubmit = async (values: LeaveFormValues) => {
        try {
            await addLeave(values).unwrap();
            toast.success('Leave request submitted!');
            form.reset();
            onClose();
        } catch {
            toast.error('Failed to submit leave request.');
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) { form.reset(); onClose(); } }}>
            <DialogContent className="max-w-md p-0 gap-0">
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-5 space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Leave Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {LEAVE_TYPES.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="from"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">From</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} disabled={isLoading} min={today} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="to"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">To</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} disabled={isLoading} min={watchedFrom || today} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {isDateValid && (
                            <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                                Duration: <span className="font-semibold text-foreground">{days} day{days !== 1 ? 's' : ''}</span>
                            </p>
                        )}

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            rows={3}
                                            placeholder="Briefly describe the reason for your leave…"
                                            disabled={isLoading}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-2 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { form.reset(); onClose(); }}
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="gap-2 min-w-[130px]"
                            >
                                {isLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                                    : <><Send className="w-4 h-4" /> Submit Request</>
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
