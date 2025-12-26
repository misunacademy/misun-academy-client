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
import { toast } from 'sonner';

export default function BatchDashboard() {
    const [title, setTitle] = useState('');
    const [courseFee, setCourseFee] = useState('');
    const { data: batches, isLoading, error } = useGetAllBatchesQuery(undefined);
    const [createBatch] = useCreateBatchMutation();
    const [updateBatch] = useUpdateBatchMutation();

    const handleCreateBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBatch({ title, courseFee: Number(courseFee) }).unwrap();
            toast("Batch created successfully");
            setTitle('');
            setCourseFee('');
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
        <div className="container mx-auto p-4">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Create New Batch</CardTitle>
                    <CardDescription>Add a new batch with title and course fee</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateBatch} className="space-y-4">
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
                    {isLoading && <p>Loading batches...</p>}
                    {error && <p className="text-red-500">Error loading batches</p>}
                    {batches?.data && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Course Fee</TableHead>
                                    <TableHead>Current Batch</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches?.data?.length && batches?.data?.map((batch: { _id: string, title: string, courseFee: number, isCurrent: boolean }) => (
                                    <TableRow key={batch._id}>
                                        <TableCell>{batch.title}</TableCell>
                                        <TableCell>{batch.courseFee} (BDT)</TableCell>
                                        <TableCell>{batch.isCurrent ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={batch.isCurrent}
                                                onCheckedChange={() => handleUpdateBatch(batch._id, !batch.isCurrent)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}