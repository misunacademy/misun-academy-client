/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FormEvent, useState, useEffect, startTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { toast } from 'sonner';
import { ArrowBigLeft, Loader2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useGetBatchByIdQuery, useUpdateBatchMutation } from '@/redux/api/batchApi';


const BATCH_STATUSES = [
    { value: 'draft', label: 'Draft', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    { value: 'upcoming', label: 'Upcoming', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    { value: 'running', label: 'Running', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    { value: 'completed', label: 'Completed', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
];

type BatchStatus = 'draft' | 'upcoming' | 'running' | 'completed';

interface FormState {
    title: string;
    price: string;
    status: BatchStatus;
    selectedCourse: string;
    startDate: string;
    endDate: string;
    enrollmentStartDate: string;
    enrollmentEndDate: string;
    description: string;
}

const INITIAL_FORM_STATE: FormState = {
    title: '',
    price: '',
    status: 'draft',
    selectedCourse: '',
    startDate: '',
    endDate: '',
    enrollmentStartDate: '',
    enrollmentEndDate: '',
    description: '',
};

export default function BatchEdit() {
    const router = useRouter();
    const { id: batchId } = useParams<{ id: string }>();
    const { data: batch, isLoading, error } = useGetBatchByIdQuery(batchId);
    const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ status: "published" });
    const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
    const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);

    const courses = coursesData?.data || [];

    // Populate form when batch data is loaded
    useEffect(() => {
        if (!batch?.data) return;

        const newFormData = {
            title: batch.data.title || '',
            price: batch.data.price?.toString() || '',
            status: (batch.data.status as BatchStatus) || 'draft',
            selectedCourse: batch.data.courseId._id || '',
            startDate: batch.data.startDate
                ? new Date(batch.data.startDate).toISOString().split('T')[0]
                : '',
            endDate: batch.data.endDate
                ? new Date(batch.data.endDate).toISOString().split('T')[0]
                : '',
            enrollmentStartDate: batch.data.enrollmentStartDate
                ? new Date(batch.data.enrollmentStartDate).toISOString().split('T')[0]
                : '',
            enrollmentEndDate: batch.data.enrollmentEndDate
                ? new Date(batch.data.enrollmentEndDate).toISOString().split('T')[0]
                : '',
            description: (batch.data as any).description || '',
        };

        // Use startTransition to avoid synchronous state update inside the effect
        startTransition(() => {
            setFormData(prev => {
                // avoid unnecessary updates to prevent cascading renders
                if (JSON.stringify(prev) === JSON.stringify(newFormData)) return prev;
                return newFormData;
            });
        });
    }, [batch]);

    const handleInputChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        router.push('/dashboard/admin/batch');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.selectedCourse) {
            toast.error('Please select a course');
            return;
        }

        const batchData = {
            title: formData.title,
            price: Number(formData.price),
            status: formData.status,
            courseId: formData.selectedCourse,
            startDate: formData.startDate ? new Date(formData.startDate) : undefined,
            endDate: formData.endDate ? new Date(formData.endDate) : undefined,
            enrollmentStartDate: formData.enrollmentStartDate ? new Date(formData.enrollmentStartDate) : undefined,
            enrollmentEndDate: formData.enrollmentEndDate ? new Date(formData.enrollmentEndDate) : undefined,
            description: formData.description || undefined,
        };

        try {
            await updateBatch({ id: batchId, data: batchData }).unwrap();
            toast.success("Batch updated successfully");
            router.push('/dashboard/admin/batch');
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update batch");
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-destructive">Error loading batch</p>
                <Button onClick={() => router.push('/dashboard/admin/batch')}>
                    Go Back
                </Button>
            </div>
        );
    }

    // Show not found state
    if (!batch?.data) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-muted-foreground">Batch not found</p>
                <Button onClick={() => router.push('/dashboard/admin/batch')}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex ">
                <Button onClick={() => router.back()} className="gap-2">
                    <ArrowBigLeft className="w-4 h-4" />
                    Go Back
                </Button>
            </div>


            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Edit Batch</CardTitle>
                            <CardDescription>
                                Update batch information
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={resetForm}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="course">Course *</Label>
                            <Select
                                value={formData.selectedCourse}
                                defaultValue={batch.data.courseId.title}
                                onValueChange={(val) => handleInputChange('selectedCourse', val)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {coursesLoading ? (
                                        <div className="flex items-center justify-center py-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    ) : courses.length > 0 ? (
                                        courses.map((course: any) => (
                                            <SelectItem key={course._id} value={course._id}>
                                                {course.title}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-courses" disabled>
                                            No courses available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Batch Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g. Batch 6 - Winter 2026"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (BDT) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    placeholder="4000"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    defaultValue={batch.data.status}
                                    onValueChange={(val) => handleInputChange('status', val as BatchStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BATCH_STATUSES.map(status => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Brief description of this batch"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Batch Start Date *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Batch End Date *</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="enrollmentStartDate">Enrollment Start *</Label>
                                <Input
                                    id="enrollmentStartDate"
                                    type="date"
                                    value={formData.enrollmentStartDate}
                                    onChange={(e) => handleInputChange('enrollmentStartDate', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="enrollmentEndDate">Enrollment End *</Label>
                                <Input
                                    id="enrollmentEndDate"
                                    type="date"
                                    value={formData.enrollmentEndDate}
                                    onChange={(e) => handleInputChange('enrollmentEndDate', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Update Batch
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}