/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Save, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { useGetCoursesQuery } from "@/redux/features/course/courseApi";
import { useGetAllBatchesQuery } from "@/redux/api/batchApi";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api/settingsApi";

export default function DynamicUpdates() {
    const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetCoursesQuery({});
    const { data: batchesData, isLoading: batchesLoading, error: batchesError } = useGetAllBatchesQuery({});
    const { data: settingsData, isLoading: settingsLoading, error: settingsError, refetch: refetchSettings } = useGetSettingsQuery();
    const courses = coursesData?.data || [];
    const batches = useMemo(() => batchesData?.data || [], [batchesData?.data]);
    const settings = useMemo(() => settingsData?.data || {}, [settingsData?.data]);

    const [selectedCourse, setSelectedCourse] = useState<string>("none");
    const [selectedBatch, setSelectedBatch] = useState<string>("none");
    const [originalCourse, setOriginalCourse] = useState<string>("none");
    const [originalBatch, setOriginalBatch] = useState<string>("none");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [saving, setSaving] = useState(false);
    const [updateSettings] = useUpdateSettingsMutation();

    // Filter batches based on selected course, but always include the currently selected batch
    const filteredBatches = selectedCourse && selectedCourse !== "none"
        ? batches.filter((batch: any) => batch.courseId?._id === selectedCourse || batch._id === selectedBatch)
        : selectedBatch && selectedBatch !== "none" ? batches.filter((batch: any) => batch._id === selectedBatch) : [];

    // Set initial values when settings load
    React.useEffect(() => {
        if (settings && Object.keys(settings).length > 0) {
            const course = (settings.featuredEnrollmentCourse as any)?._id || "none";
            const batch = (settings.featuredEnrollmentBatch as any)?._id || "none";
            setSelectedCourse(course);
            setSelectedBatch(batch);
            setOriginalCourse(course);
            setOriginalBatch(batch);
        }
    }, [settings]);

    // Reset batch selection when course changes
    React.useEffect(() => {
        if (selectedCourse === "none" || !selectedCourse) {
            setSelectedBatch("none");
        } else {
            // Check if current batch belongs to the selected course
            const currentBatch = batches.find((batch: any) => batch._id === selectedBatch);
            if (currentBatch && currentBatch.courseId?._id !== selectedCourse) {
                setSelectedBatch("none");
            }
        }
    }, [selectedCourse, batches, selectedBatch]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setSelectedCourse(originalCourse);
        setSelectedBatch(originalBatch);
        setEditMode(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings({
                featuredEnrollmentCourse: selectedCourse === "none" ? undefined : selectedCourse,
                featuredEnrollmentBatch: selectedBatch === "none" ? undefined : selectedBatch,
            }).unwrap();
            setOriginalCourse(selectedCourse);
            setOriginalBatch(selectedBatch);
            setEditMode(false);
            refetchSettings();
            toast.success("Settings updated successfully");
        } catch {
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (coursesLoading || batchesLoading || settingsLoading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="text-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (coursesError || batchesError || settingsError) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="text-center">
                    <p>Error loading data. Please try again.</p>
                </div>
            </div>
        );
    }

    const currentCourse = settings.featuredEnrollmentCourse as any;
    const currentBatch = settings.featuredEnrollmentBatch as any;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dynamic Updates</h1>
                <p className="text-muted-foreground">Configure dynamic content and settings for the entire web app</p>
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
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Featured Course</label>
                                    <p className="text-sm text-muted-foreground">
                                        {currentCourse ? currentCourse.title : "None"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Featured Batch</label>
                                    <p className="text-sm text-muted-foreground">
                                        {currentBatch ? `${currentBatch.title} (Batch ${currentBatch.batchNumber})` : "None (Use current enrollment batch)"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleEdit} className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Settings
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Featured Course</label>
                                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {courses.map((course: any) => (
                                                <SelectItem key={course._id} value={course._id}>
                                                    {course.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Featured Batch</label>
                                    <Select
                                        value={selectedBatch}
                                        onValueChange={setSelectedBatch}
                                        disabled={!selectedCourse || selectedCourse === "none"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                !selectedCourse || selectedCourse === "none"
                                                    ? "Select a course first"
                                                    : "Select a batch"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None (Use current enrollment batch)</SelectItem>
                                            {filteredBatches.map((batch: any) => (
                                                <SelectItem key={batch._id} value={batch._id}>
                                                    {batch.title} (Batch {batch.batchNumber})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {(!selectedCourse || selectedCourse === "none") && (
                                        <p className="text-xs text-muted-foreground">
                                            Select a course above to see available batches
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Settings"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}