"use client";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/forms/input-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { useGetBatchByIdQuery, useUpdateBatchMutation, type CourseInfo } from '@/redux/api/batchApi';
import { Loader2 } from 'lucide-react';

const batchSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.string().min(1, "Price is required"),
    manualPaymentPrice: z.string().optional(),
    status: z.enum(["draft", "upcoming", "running", "completed"]),
    selectedCourse: z.string().min(1, "Please select a course"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    enrollmentStartDate: z.string().optional(),
    enrollmentEndDate: z.string().optional(),
    description: z.string().optional(),
});

type BatchFormValues = z.infer<typeof batchSchema>;

const BATCH_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "upcoming", label: "Upcoming" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
];

export default function BatchEdit() {
    const router = useRouter();
    const { id: batchId } = useParams<{ id: string }>();
    const { data: batch, isLoading, error } = useGetBatchByIdQuery(batchId);
    const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ status: "published" });
    const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();

    const courses = coursesData?.data || [];
    const courseOptions = courses.map((c: { _id: string; title: string }) => ({ value: c._id, label: c.title }));

    const form = useForm<BatchFormValues>({
        resolver: zodResolver(batchSchema) as Resolver<BatchFormValues>,
        defaultValues: {
            title: "",
            price: "",
            manualPaymentPrice: "",
            status: "draft",
            selectedCourse: "",
            startDate: "",
            endDate: "",
            enrollmentStartDate: "",
            enrollmentEndDate: "",
            description: "",
        },
    });

    useEffect(() => {
        if (!batch?.data) return;

        const d = batch.data;
        const selectedCourse = typeof d.courseId === "object" && d.courseId !== null
            ? (d.courseId as CourseInfo)._id || ""
            : typeof d.courseId === "string"
            ? d.courseId
            : "";

        form.reset({
            title: d.title || "",
            price: d.price?.toString() || "",
            manualPaymentPrice: d.manualPaymentPrice?.toString() || "",
            status: (d.status as "draft" | "upcoming" | "running" | "completed") || "draft",
            selectedCourse,
            startDate: d.startDate ? new Date(d.startDate).toISOString().split("T")[0] : "",
            endDate: d.endDate ? new Date(d.endDate).toISOString().split("T")[0] : "",
            enrollmentStartDate: d.enrollmentStartDate ? new Date(d.enrollmentStartDate).toISOString().split("T")[0] : "",
            enrollmentEndDate: d.enrollmentEndDate ? new Date(d.enrollmentEndDate).toISOString().split("T")[0] : "",
            description: (d as { description?: string }).description || "",
        });
    }, [batch, form]);

    const onSubmit = async (data: BatchFormValues) => {
        const batchData = {
            title: data.title,
            price: Number(data.price),
            manualPaymentPrice: data.manualPaymentPrice ? Number(data.manualPaymentPrice) : undefined,
            status: data.status as "draft" | "upcoming" | "running" | "completed",
            courseId: data.selectedCourse,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            enrollmentStartDate: data.enrollmentStartDate ? new Date(data.enrollmentStartDate) : undefined,
            enrollmentEndDate: data.enrollmentEndDate ? new Date(data.enrollmentEndDate) : undefined,
            description: data.description || undefined,
        };

        try {
            await updateBatch({ id: batchId, data: batchData }).unwrap();
            toast.success("Batch updated successfully");
            router.push('/dashboard/admin/batch');
        } catch (err: unknown) {
            const error = err as { data?: { message?: string } };
            toast.error(error?.data?.message || "Failed to update batch");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.push('/dashboard/admin/batch')} className="mb-2">← Back to Batches</Button>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Batch</h1>
                            <p className="text-muted-foreground">Update batch information</p>
                        </div>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Batch Details</CardTitle>
                        <CardDescription>Update the batch information below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <SelectField
                                name="selectedCourse"
                                label="Course"
                                options={courseOptions}
                                placeholder={coursesLoading ? "Loading courses..." : "Select a course"}
                                disabled={coursesLoading}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InputField name="title" label="Batch Title" placeholder="e.g. Batch 6" required />
                                <InputField name="price" label="Price (BDT)" type="number" placeholder="e.g. 4000" required />
                                <InputField name="manualPaymentPrice" label="Manual Payment Price" type="number" placeholder="e.g. 3000" />
                                <SelectField name="status" label="Status" options={BATCH_STATUS_OPTIONS} />
                            </div>

                            <TextareaField name="description" label="Description" placeholder="Brief description of this batch" rows={3} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField name="startDate" label="Batch Start Date" type="date" />
                                <InputField name="endDate" label="Batch End Date" type="date" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField name="enrollmentStartDate" label="Enrollment Start" type="date" />
                                <InputField name="enrollmentEndDate" label="Enrollment End" type="date" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => router.back()} className="gap-2">
                        Cancel
                    </Button>
                    <SubmitButton disabled={isUpdating} loadingText="Updating...">
                        Update Batch
                    </SubmitButton>
                </div>
            </form>
        </Form>
    );
}
