"use client"
/* eslint-disable react-hooks/incompatible-library */

import { useForm, useFieldArray, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateModuleLessonMutation, useUpdateModuleLessonMutation } from "@/redux/api/lessonApi";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/forms/input-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { SwitchField } from "@/components/forms/switch-field";
import { SubmitButton } from "@/components/forms/submit-button";

interface Lesson {
    _id: string;
    moduleId: string;
    title: string;
    description?: string;
    type: 'video' | 'reading' | 'quiz' | 'project';
    orderIndex: number;
    videoSource?: 'youtube' | 'googledrive';
    videoId?: string;
    videoUrl?: string;
    videoDuration?: number;
    content?: string;
    isMandatory: boolean;
    isPublished?: boolean;
    resources?: {
        title: string;
        type: 'link' | 'text';
        url?: string;
        textContent?: string;
    }[];
}

const resourceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["link", "text"]),
    url: z.string().optional(),
    textContent: z.string().optional(),
});

const lessonSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.enum(["video", "reading", "quiz", "project"]),
    videoSource: z.enum(["youtube", "googledrive"]).optional(),
    videoId: z.string().optional(),
    videoUrl: z.string().optional(),
    videoDuration: z.coerce.number().optional(),
    content: z.string().optional(),
    isMandatory: z.boolean(),
    isPublished: z.boolean(),
    resources: z.array(resourceSchema),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

const LESSON_TYPE_OPTIONS = [
    { value: "video", label: "Video" },
    { value: "reading", label: "Reading" },
    { value: "quiz", label: "Quiz" },
    { value: "project", label: "Project" },
];

const VIDEO_SOURCE_OPTIONS = [
    { value: "youtube", label: "YouTube" },
    { value: "googledrive", label: "Google Drive" },
];

const RESOURCE_TYPE_OPTIONS = [
    { value: "link", label: "Link" },
    { value: "text", label: "Text" },
];

const LessonFormDialog = ({ open, mode, moduleId, data, onClose, onSuccess }: {
    open: boolean;
    mode: 'create' | 'edit';
    moduleId?: string;
    data?: Lesson;
    onClose: () => void;
    onSuccess: () => void;
}) => {
    const [createLesson, { isLoading: creating }] = useCreateModuleLessonMutation();
    const [updateLesson, { isLoading: updating }] = useUpdateModuleLessonMutation();

    const form = useForm<LessonFormValues>({
        resolver: zodResolver(lessonSchema) as Resolver<LessonFormValues>,
        defaultValues: {
            title: data?.title || '',
            description: data?.description || '',
            type: data?.type || 'video',
            videoSource: data?.videoSource || 'youtube',
            videoId: data?.videoId || '',
            videoUrl: data?.videoUrl || '',
            videoDuration: data?.videoDuration || 0,
            content: data?.content || '',
            isMandatory: data?.isMandatory ?? true,
            isPublished: data?.isPublished ?? true,
            resources: data?.resources || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "resources",
    });

    const watchedType = form.watch("type");

    const handleSubmit = async (values: LessonFormValues) => {
        try {
            const payload = { ...values };
            if (payload.type !== 'video') {
                delete payload.videoSource;
                delete payload.videoId;
                delete payload.videoUrl;
                delete payload.videoDuration;
            }

            if (mode === 'create') {
                await createLesson({ moduleId: moduleId!, ...payload }).unwrap();
                toast.success('Lesson created successfully');
            } else {
                await updateLesson({ lessonId: data!._id, ...payload }).unwrap();
                toast.success('Lesson updated successfully');
            }
            onSuccess();
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Operation failed');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create New Lesson' : 'Edit Lesson'}</DialogTitle>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <InputField name="title" label="Lesson Title" placeholder="Photoshop Interface and Basic Tools" required />
                        <TextareaField name="description" label="Description" placeholder="Master the Photoshop workspace, learn essential tools, and create your first design project..." />

                        <div className="grid grid-cols-2 gap-4">
                            <SelectField name="type" label="Type" options={LESSON_TYPE_OPTIONS} required />
                            <div className="flex items-end gap-4 pb-2">
                                <SwitchField name="isMandatory" label="Mandatory" />
                                <SwitchField name="isPublished" label="Published" />
                            </div>
                        </div>

                        {watchedType === 'video' && (
                            <>
                                <SelectField name="videoSource" label="Video Source" options={VIDEO_SOURCE_OPTIONS} />
                                <InputField
                                    name="videoId"
                                    label={form.watch("videoSource") === 'youtube' ? 'YouTube Video ID' : 'Google Drive File ID'}
                                    placeholder={form.watch("videoSource") === 'youtube' ? 'dQw4w9WgXcQ' : '1a2b3c4d5e6f7g8h9i0j'}
                                    description={form.watch("videoSource") === 'youtube'
                                        ? 'YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID'
                                        : 'Google Drive URL: https://drive.google.com/file/d/FILE_ID/view'}
                                />
                                <InputField name="videoDuration" label="Duration (seconds)" type="number" placeholder="300" />
                            </>
                        )}

                        {(watchedType === 'reading' || watchedType === 'project') && (
                            <TextareaField
                                name="content"
                                label="Content"
                                placeholder="## Photoshop Tools Overview

### Essential Tools for Graphic Designers

**Selection Tools:**
- Marquee tools for geometric selections
- Lasso tools for freeform selections
- Magic Wand for color-based selections

**Image Editing:**
- Clone Stamp for content removal
- Healing Brush for photo retouching
- Content-Aware Fill for intelligent removal

### Practice Exercise
Create a composite image using at least 3 different selection techniques..."
                                rows={8}
                            />
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Resources</label>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '', type: 'link', url: '', textContent: '' })}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Resource
                                </Button>
                            </div>
                            {fields.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No resources added yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="p-3">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium">Resource {index + 1}</label>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <InputField
                                                    name={`resources.${index}.title`}
                                                    label="Title"
                                                    placeholder="Resource title"
                                                    required
                                                    rules={{ required: "Title is required" }}
                                                />
                                                <SelectField
                                                    name={`resources.${index}.type`}
                                                    label="Type"
                                                    options={RESOURCE_TYPE_OPTIONS}
                                                />
                                                {form.watch(`resources.${index}.type`) === 'link' && (
                                                    <InputField
                                                        name={`resources.${index}.url`}
                                                        label="URL"
                                                        type="url"
                                                        placeholder="https://example.com"
                                                        rules={{ required: "URL is required" }}
                                                    />
                                                )}
                                                {form.watch(`resources.${index}.type`) === 'text' && (
                                                    <TextareaField
                                                        name={`resources.${index}.textContent`}
                                                        label="Text Content"
                                                        placeholder="Enter text content here..."
                                                        rows={3}
                                                        rules={{ required: "Content is required" }}
                                                    />
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <SubmitButton disabled={creating || updating} loadingText="Saving...">
                                {mode === 'create' ? 'Create Lesson' : 'Update Lesson'}
                            </SubmitButton>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

export default LessonFormDialog;
