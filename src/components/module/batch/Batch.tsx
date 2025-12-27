'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCreateBatchMutation, useGetAllBatchesQuery, useUpdateBatchMutation } from '@/redux/features/batch/batchApi';
import { useGetCoursesQuery } from '@/redux/features/course/courseApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BatchDashboard() {
    const [title, setTitle] = useState('');
    const [courseFee, setCourseFee] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const { data: batches, isLoading, error } = useGetAllBatchesQuery(undefined);
    const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({ isPublished: true });
    const [createBatch] = useCreateBatchMutation();
    const [updateBatch] = useUpdateBatchMutation();

    const courses = coursesData?.data || [];

    const handleCreateBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) {
            toast.error('Please select a course');
            return;
        }
        try {
            await createBatch({ title, courseFee: Number(courseFee), course: selectedCourse }).unwrap();
            toast("Batch created successfully");
            setTitle('');
            setCourseFee('');
            setSelectedCourse('');
        } catch (err) {
            console.log(err)
            toast("Failed to create batch");
        }
    };

    const handleUpdateBatch = async (id: string, isCurrent: boolean) => {
        try {
            await updateBatch({ id, isCurrent }).unwrap();
            toast("Batch updated successfully");
        } catch (err) {
            console.log(err)
            toast("Failed to update batch");
        }
    };

    console.log(batches)

    return (
        <div className="space-y-6">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Create New Batch</CardTitle>
                    <CardDescription>Add a new batch with title and course fee</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateBatch} className="space-y-4">
                        <div>
                            <Label htmlFor="course">Select Course</Label>
                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {coursesLoading ? (
                                        <SelectItem value="loading" disabled>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading courses...
                                        </SelectItem>
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
                        <div>
                            <Label htmlFor="title">Batch Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter batch title"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="courseFee">Course Fee</Label>
                            <Input
                                id="courseFee"
                                type="number"
                                value={courseFee}
                                onChange={(e) => setCourseFee(e.target.value)}
                                placeholder="Enter course fee"
                                required
                            />
                        </div>
                        <Button type="submit">Create Batch</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Batches</CardTitle>
                    <CardDescription>List of all batches with their details</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex items-center justify-center h-32">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    )}
                    {error && <p className="text-red-500">Error loading batches</p>}
                    {batches?.data && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Course Fee</TableHead>
                                    <TableHead>Current Batch</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches?.data && batches.data.length > 0 ? batches.data.map((batch: { _id: string, title: string, courseFee: number, isCurrent: boolean, course: { title: string } }) => (
                                    <TableRow key={batch._id}>
                                        <TableCell>{batch.title}</TableCell>
                                        <TableCell>{batch.course?.title || 'N/A'}</TableCell>
                                        <TableCell>{batch.courseFee} (BDT)</TableCell>
                                        <TableCell>{batch.isCurrent ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={batch.isCurrent}
                                                onCheckedChange={() => handleUpdateBatch(batch._id, !batch.isCurrent)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No batches found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}