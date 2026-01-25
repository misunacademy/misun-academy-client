/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Save, Edit, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api/settingsApi";

const EMPTY_VALUE = "none";

export default function DynamicUpdates() {
    const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetAllCoursesQuery({});
    const { data: batchesData, isLoading: batchesLoading, error: batchesError } = useGetAllBatchesQuery({});
    const { data: settingsData, isLoading: settingsLoading, error: settingsError, refetch: refetchSettings } = useGetSettingsQuery();
    
    const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();
    
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(EMPTY_VALUE);
    const [selectedBatch, setSelectedBatch] = useState(EMPTY_VALUE);
    const [originalValues, setOriginalValues] = useState({
        course: EMPTY_VALUE,
        batch: EMPTY_VALUE
    });

    const courses = useMemo(() => coursesData?.data || [], [coursesData?.data]);
    const batches = useMemo(() => batchesData?.data || [], [batchesData?.data]);
    const settings = useMemo(() => settingsData?.data || {}, [settingsData?.data]);

    // Filter batches based on selected course
    const filteredBatches = useMemo(() => {
        if (!selectedCourse || selectedCourse === EMPTY_VALUE) return [];
        
        return batches.filter((batch) => {
            const batchCourseId = batch.courseId?._id || batch.courseId;
            return batchCourseId === selectedCourse || batch._id === selectedBatch;
        });
    }, [selectedCourse, batches, selectedBatch]);

    // Initialization moved to handleEdit to avoid calling setState synchronously inside an effect

    // Update batch selection when course changes (handled in the change handler to avoid calling setState synchronously in an effect)
    const handleCourseChange = (value: string) => {
        setSelectedCourse(value);

        if (value === EMPTY_VALUE) {
            setSelectedBatch(EMPTY_VALUE);
            return;
        }

        // If currently selected batch doesn't belong to the new course, reset it
        const currentBatch = batches.find((batch) => batch._id === selectedBatch);
        if (currentBatch) {
            const batchCourseId = currentBatch.courseId?._id || currentBatch.courseId;
            if (batchCourseId !== value) {
                setSelectedBatch(EMPTY_VALUE);
            }
        }
    };

    const handleEdit = () => {
        const courseId = (settings.featuredEnrollmentCourse as any)?._id || EMPTY_VALUE;
        const batchId = (settings.featuredEnrollmentBatch as any)?._id || EMPTY_VALUE;

        setSelectedCourse(courseId);
        setSelectedBatch(batchId);
        setOriginalValues({ course: courseId, batch: batchId });
        setEditMode(true);
    };

    const handleCancel = () => {
        setSelectedCourse(originalValues.course);
        setSelectedBatch(originalValues.batch);
        setEditMode(false);
    };

    const handleSave = async () => {
        try {
            await updateSettings({
                featuredEnrollmentCourse: selectedCourse === EMPTY_VALUE ? undefined : selectedCourse,
                featuredEnrollmentBatch: selectedBatch === EMPTY_VALUE ? undefined : selectedBatch,
            }).unwrap();
            
            setOriginalValues({ course: selectedCourse, batch: selectedBatch });
            setEditMode(false);
            refetchSettings();
            toast.success("Settings updated successfully");
        } catch (error:any) {
            toast.error(error?.data?.message || "Failed to update settings");
        }
    };

    const isLoading = coursesLoading || batchesLoading || settingsLoading;
    const hasError = coursesError || batchesError || settingsError;

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full max-w-md" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Error loading data. Please refresh the page and try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const currentCourse = settings.featuredEnrollmentCourse as any;
    const currentBatch = settings.featuredEnrollmentBatch as any;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Dynamic Updates</h1>
                <p className="text-muted-foreground">
                    Configure dynamic content and settings for the entire web app
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Featured Enrollment Section
                    </CardTitle>
                    <CardDescription>
                        Select which course and batch to feature in the enrollment section on the homepage
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!editMode ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Featured Course</Label>
                                    <div className="rounded-md border border-input bg-muted/50 px-3 py-2 min-h-10 flex items-center">
                                        <p className="text-sm">
                                            {currentCourse?.title || "None selected"}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Featured Batch</Label>
                                    <div className="rounded-md border border-input bg-muted/50 px-3 py-2 min-h-10 flex items-center">
                                        <p className="text-sm">
                                            {currentBatch 
                                                ? `${currentBatch.title} (Batch #${currentBatch.batchNumber})`
                                                : "None (Default to current enrollment batch)"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button onClick={handleEdit} className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Settings
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="course-select">Featured Course</Label>
                                    <Select value={selectedCourse} onValueChange={handleCourseChange}>
                                        <SelectTrigger id="course-select">
                                            <SelectValue placeholder="Select a course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={EMPTY_VALUE}>None</SelectItem>
                                            {courses.map((course:any) => (
                                                <SelectItem key={course._id} value={course._id}>
                                                    {course.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="batch-select">Featured Batch</Label>
                                    <Select
                                        value={selectedBatch}
                                        onValueChange={setSelectedBatch}
                                        disabled={!selectedCourse || selectedCourse === EMPTY_VALUE}
                                    >
                                        <SelectTrigger id="batch-select">
                                            <SelectValue 
                                                placeholder={
                                                    !selectedCourse || selectedCourse === EMPTY_VALUE
                                                        ? "Select a course first"
                                                        : "Select a batch"
                                                } 
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={EMPTY_VALUE}>
                                                None (Default to current enrollment batch)
                                            </SelectItem>
                                            {filteredBatches.map((batch) => (
                                                <SelectItem key={batch._id} value={batch._id}>
                                                    {batch.title} (Batch #{batch.batchNumber})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {(!selectedCourse || selectedCourse === EMPTY_VALUE) && (
                                        <p className="text-xs text-muted-foreground">
                                            Select a course to see available batches
                                        </p>
                                    )}
                                    {selectedCourse && selectedCourse !== EMPTY_VALUE && filteredBatches.length === 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            No batches available for this course
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button 
                                    variant="outline" 
                                    onClick={handleCancel} 
                                    className="gap-2"
                                    disabled={isSaving}
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSave} 
                                    disabled={isSaving} 
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? "Saving..." : "Save Settings"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}