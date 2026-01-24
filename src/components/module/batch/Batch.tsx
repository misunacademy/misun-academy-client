/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCreateBatchMutation, useGetAllBatchesQuery, useUpdateBatchMutation, useDeleteBatchMutation } from '@/redux/features/batch/batchApi';
import { useGetCoursesQuery } from '@/redux/features/course/courseApi';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BatchDashboard() {
    const [showForm, setShowForm] = useState(false);
    const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('draft');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [enrollmentStartDate, setEnrollmentStartDate] = useState('');
    const [enrollmentEndDate, setEnrollmentEndDate] = useState('');
    // const [maxCapacity, setMaxCapacity] = useState('');
    const [description, setDescription] = useState('');
    const { data: batches, isLoading, error } = useGetAllBatchesQuery(undefined);
    const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({ status: "published" });
    const [createBatch] = useCreateBatchMutation();
    const [updateBatch] = useUpdateBatchMutation();
    const [deleteBatch] = useDeleteBatchMutation();

    const courses = coursesData?.data || [];

    const handleStatusChange = async (batchId: string, newStatus: string) => {
        if (!batchId || batchId === 'undefined' || !newStatus) {
            console.error('Invalid batchId:', batchId);
            return;
        }
        try {
            console.log('Updating batch status:', { batchId, newStatus });
            console.log('batch status:', batches?.data);

            // Prevent multiple rapid updates
            const currentStatus = batches?.data?.find((b: any) => b._id === batchId)?.status;
            console.log('Status already set to:', newStatus);
            if (currentStatus === newStatus) {
                console.log('Status already set to:', newStatus);
                return;
            }

            await updateBatch({ id: batchId, status: newStatus }).unwrap();
            toast.success(`Batch status updated to ${newStatus}`);
        } catch (error: any) {
            console.error('Status update error:', error);
            const errorMessage = error?.data?.message || error?.message || 'Failed to update batch status';
            toast.error(errorMessage);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) {
            toast.error('Please select a course');
            return;
        }

        const batchData = {
            title,
            price: Number(price),
            status,
            courseId: selectedCourse,
            startDate: startDate, // Send as string, not Date object
            endDate: endDate, // Send as string, not Date object
            enrollmentStartDate: enrollmentStartDate, // Send as string, not Date object
            enrollmentEndDate: enrollmentEndDate, // Send as string, not Date object
            // maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
            description: description || undefined,
        };

        try {

            if (editingBatchId) {
                await updateBatch({ id: editingBatchId, ...batchData }).unwrap();
                toast.success("Batch updated successfully");
                setEditingBatchId(null);
                setShowForm(false);
            } else {
                await createBatch(batchData).unwrap();
                toast.success("Batch created successfully");
                setShowForm(false);
            }

            // Reset form
            setTitle('');
            setPrice('');
            setStatus('draft');
            setSelectedCourse('');
            setStartDate('');
            setEndDate('');
            setEnrollmentStartDate('');
            setEnrollmentEndDate('');
            // setMaxCapacity('');
            setDescription('');
        } catch (err: any) {
            console.error('Batch operation error:', err);
            const errorMessage = err?.data?.message || err?.message || (editingBatchId ? "Failed to update batch" : "Failed to create batch");
            toast.error(errorMessage);
        }
    };

    const handleEdit = (batch: any) => {
        setEditingBatchId(batch._id);
        setTitle(batch.title);
        setPrice(batch.price.toString());
        setStatus(batch.status || 'draft');
        // Handle courseId properly - it might be an object or string
        setSelectedCourse(typeof batch.courseId === 'object' ? batch.courseId._id : batch.courseId);
        setStartDate(new Date(batch.startDate).toISOString().split('T')[0]);
        setEndDate(new Date(batch.endDate).toISOString().split('T')[0]);
        setEnrollmentStartDate(new Date(batch.enrollmentStartDate).toISOString().split('T')[0]);
        setEnrollmentEndDate(new Date(batch.enrollmentEndDate).toISOString().split('T')[0]);
        // setMaxCapacity(batch.maxCapacity?.toString() || '');
        setDescription(batch.description || '');

        // Show form and scroll to top
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingBatchId(null);
        setTitle('');
        setPrice('');
        setStatus('draft');
        setSelectedCourse('');
        setStartDate('');
        setEndDate('');
        setEnrollmentStartDate('');
        setEnrollmentEndDate('');
        // setMaxCapacity('');
        setDescription('');
        setShowForm(false);
    };
    const handleDeleteBatch = (batchId: string) => () => {
        toast('Are you sure you want to delete this batch? This action cannot be undone.', {
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        await deleteBatch(batchId).unwrap();
                        toast.success("Batch deleted successfully");
                    } catch (err: any) {
                        console.error('Batch deletion error:', err);
                        const errorMessage = err?.data?.message || err?.message || "Failed to delete batch";
                        toast.error(errorMessage);
                    }
                },
            },
            cancel: 'Cancel',
        });
    }
    return (
        <div className="space-y-6">
            {!showForm && (
                <div className="flex justify-end">
                    <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create New Batch
                    </Button>
                </div>
            )}

            {showForm && (
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{editingBatchId ? 'Edit Batch' : 'Create New Batch'}</CardTitle>
                                <CardDescription>
                                    {editingBatchId ? 'Update batch information' : 'Add a new batch with all required details'}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => {
                                setShowForm(false);
                                handleCancelEdit();
                            }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="course">Select Course *</Label>
                                <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="title">Batch Title *</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Batch 6 - Winter 2026"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="price">Price (BDT) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="4000"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="running">Running</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of this batch"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate">Batch Start Date *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endDate">Batch End Date *</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="enrollmentStartDate">Enrollment Start *</Label>
                                    <Input
                                        id="enrollmentStartDate"
                                        type="date"
                                        value={enrollmentStartDate}
                                        onChange={(e) => setEnrollmentStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="enrollmentEndDate">Enrollment End *</Label>
                                    <Input
                                        id="enrollmentEndDate"
                                        type="date"
                                        value={enrollmentEndDate}
                                        onChange={(e) => setEnrollmentEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* <div>
                            <Label htmlFor="maxCapacity">Max Capacity</Label>
                            <Input
                                id="maxCapacity"
                                type="number"
                                value={maxCapacity}
                                onChange={(e) => setMaxCapacity(e.target.value)}
                                placeholder="e.g. 30"
                            />
                        </div> */}

                            <div className="flex gap-2">
                                <Button type="submit">{editingBatchId ? 'Update Batch' : 'Create Batch'}</Button>
                                {editingBatchId && (
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

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
                                    <TableHead>Batch #</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Enrollment</TableHead>
                                    {/* <TableHead>Capacity</TableHead> */}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches?.data && batches.data.length > 0 ? batches.data.map((batch: any) => (
                                    <TableRow key={batch._id}>
                                        <TableCell>#{batch.batchNumber}</TableCell>
                                        <TableCell>{batch.title}</TableCell>
                                        <TableCell>{batch.courseId?.title || 'N/A'}</TableCell>
                                        <TableCell>BDT {batch.price}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${batch.status === 'running' ? 'bg-green-100 text-green-800' :
                                                batch.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                    batch.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {batch.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(batch.startDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(batch.endDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{batch.currentEnrollment || 0}</TableCell>
                                        {/* <TableCell>{batch.maxCapacity || '∞'}</TableCell> */}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {/* {batch.status !== 'completed' && (
                                                    <Button 
                                                        onClick={() => handleStatusChange(batch._id, 'completed')}
                                                        variant="outline" 
                                                        size="sm"
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                    >
                                                        Mark Completed
                                                    </Button>
                                                )} */}
                                                {/* <Select
                                                    value={batch.status}
                                                    onValueChange={(newStatus) => handleStatusChange(batch._id, newStatus)}
                                                >
                                                    <SelectTrigger className="w-24 h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                                        <SelectItem value="running">Running</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select> */}
                                                {/* {['draft', 'upcoming', 'running', 'completed'].map((status) => (
                                                    <Button
                                                        key={status}
                                                        onClick={() => handleStatusChange(batch._id, status)}
                                                        variant={batch.status === status ? 'default' : 'outline'}
                                                        size="sm"
                                                        disabled={batch.status === status}
                                                        className={`capitalize ${batch.status === status ? 'bg-green-100 text-green-800' : ''}`}
                                                    >
                                                        {status}
                                                    </Button>
                                                ))} */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(batch)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleDeleteBatch(batch._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
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