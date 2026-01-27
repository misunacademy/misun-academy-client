/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FormEvent, useState } from 'react';
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
import { useCreateBatchMutation } from '@/redux/api/batchApi';
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { toast } from 'sonner';
import { ArrowBigLeft, Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BATCH_STATUSES = [
    { value: 'draft', label: 'Draft', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    { value: 'upcoming', label: 'Upcoming', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    { value: 'running', label: 'Running', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    { value: 'completed', label: 'Completed', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
];

const INITIAL_FORM_STATE = {
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

export default function BatchCrate() {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ status: "published" });
    const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
    const router = useRouter();
    const courses = coursesData?.data || [];
console.log(courses)
    const handleInputChange = (field: any, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
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
            status: formData.status as 'draft' | 'upcoming' | 'running' | 'completed',
            courseId: formData.selectedCourse,
            startDate: formData.startDate ? new Date(formData.startDate) : undefined,
            endDate: formData.endDate ? new Date(formData.endDate) : undefined,
            enrollmentStartDate: formData.enrollmentStartDate ? new Date(formData.enrollmentStartDate) : undefined,
            enrollmentEndDate: formData.enrollmentEndDate ? new Date(formData.enrollmentEndDate) : undefined,
            description: formData.description || undefined,
        };

        try {

            await createBatch(batchData).unwrap();
            toast.success("Batch created successfully");

            resetForm();
        } catch (err: any) {
            toast.error(err?.data?.message || ("Failed to create batch"));
        }
    };



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
                            <CardTitle> Create New Batch</CardTitle>
                            <CardDescription>
                                Add a new batch with all required details
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="course">Course *</Label>
                            <Select
                                value={formData.selectedCourse}
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
                                    onValueChange={(val) => handleInputChange('status', val)}
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

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isCreating}>
                                {(isCreating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Batch
                            </Button>



                        </div>
                    </form>
                </CardContent>
            </Card>



        </div>
    );
}
