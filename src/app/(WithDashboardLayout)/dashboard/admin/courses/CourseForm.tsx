"use client";

import React, { useState } from "react";
import { useForm, Controller, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Save, ArrowLeft, Plus, Edit2, Trash2, Play, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { courseSchema, CourseFormData, ModuleFormData, LessonFormData } from "./course-schema";
import { useCreateCourseMutation, useUpdateCourseMutation, useGetCourseByIdQuery } from "@/redux/features/course/courseApi";
import { toast } from "sonner";

interface CourseFormProps {
    courseId?: string;
    isNew?: boolean;
}

// Module Dialog Component
function ModuleDialog({
    module,
    onSave,
    onCancel
}: {
    module: ModuleFormData | null;
    onSave: (module: ModuleFormData) => void;
    onCancel: () => void;
}) {
    const [moduleData, setModuleData] = useState<ModuleFormData>(
        module || {
            moduleId: `module-new`,
            title: "",
            description: "",
            order: 0,
            duration: 0,
            lessons: [],
        }
    );
    const [newLesson, setNewLesson] = useState<Partial<LessonFormData>>({
        title: "",
        type: "video",
        duration: 0,
        isPreview: false,
        media: {
            type: "youtube",
            url: "",
            thumbnail: "",
        },
        content: "",
    });

    const addLesson = () => {
        if (newLesson.title && newLesson.type) {
            const lesson: LessonFormData = {
                lessonId: `lesson-${moduleData.lessons.length + 1}`,
                title: newLesson.title,
                type: newLesson.type,
                duration: newLesson.duration || 0,
                isPreview: newLesson.isPreview || false,
                media: newLesson.media,
                content: newLesson.content,
            };
            setModuleData(prev => ({
                ...prev,
                lessons: [...prev.lessons, lesson],
            }));
            setNewLesson({
                title: "",
                type: "video",
                duration: 0,
                isPreview: false,
                media: {
                    type: "youtube",
                    url: "",
                    thumbnail: "",
                },
                content: "",
            });
        }
    };

    const removeLesson = (lessonId: string) => {
        setModuleData(prev => ({
            ...prev,
            lessons: prev.lessons.filter(l => l.lessonId !== lessonId),
        }));
    };

    const handleSave = () => {
        if (moduleData.title.trim()) {
            onSave(moduleData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            {module ? "Edit Day" : "Add New Day"}
                        </h2>
                        <Button variant="outline" size="sm" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {/* Module Info */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="moduleTitle">Day Title *</Label>
                                <Input
                                    id="moduleTitle"
                                    value={moduleData.title}
                                    onChange={(e) => setModuleData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. Day 1: Introduction"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="moduleDuration">Duration (minutes)</Label>
                                <Input
                                    id="moduleDuration"
                                    type="number"
                                    value={moduleData.duration || ""}
                                    onChange={(e) => setModuleData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                                    placeholder="Total duration for this day"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="moduleDescription">Description</Label>
                            <Textarea
                                id="moduleDescription"
                                value={moduleData.description || ""}
                                onChange={(e) => setModuleData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Brief description of what students will learn this day"
                                className="min-h-[80px]"
                            />
                        </div>

                        {/* Lessons */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Lessons</Label>
                                <Button type="button" onClick={addLesson} size="sm" variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Lesson
                                </Button>
                            </div>

                            {/* Add New Lesson Form */}
                            <Card className="border-dashed">
                                <CardContent className="pt-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Lesson Title</Label>
                                            <Input
                                                value={newLesson.title || ""}
                                                onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Lesson title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={newLesson.type || "video"}
                                                onValueChange={(value: "video" | "reading" |  "project") => setNewLesson(prev => ({ ...prev, type: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="video">Video</SelectItem>
                                                    <SelectItem value="reading">Reading</SelectItem>
                                                    
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Duration (min)</Label>
                                            <Input
                                                type="number"
                                                value={newLesson.duration || ""}
                                                onChange={(e) => setNewLesson(prev => ({ ...prev, duration: Number(e.target.value) }))}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Media Type</Label>
                                            <Select
                                                value={newLesson.media?.type || "youtube"}
                                                onValueChange={(value: "youtube" | "gdrive" | "video") => setNewLesson(prev => ({
                                                    ...prev,
                                                    media: { ...prev.media!, type: value }
                                                }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                    <SelectItem value="gdrive">Google Drive</SelectItem>
                                                    <SelectItem value="video">Direct Video</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Media URL</Label>
                                            <Input
                                                value={newLesson.media?.url || ""}
                                                onChange={(e) => setNewLesson(prev => ({
                                                    ...prev,
                                                    media: { ...prev.media!, url: e.target.value }
                                                }))}
                                                placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/..."
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Thumbnail URL (optional)</Label>
                                            <Input
                                                value={newLesson.media?.thumbnail || ""}
                                                onChange={(e) => setNewLesson(prev => ({
                                                    ...prev,
                                                    media: { ...prev.media!, thumbnail: e.target.value }
                                                }))}
                                                placeholder="https://example.com/thumbnail.jpg"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Content/Description (optional)</Label>
                                            <Textarea
                                                value={newLesson.content || ""}
                                                onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                                                placeholder="Additional content or description for this lesson"
                                                className="min-h-[60px]"
                                            />
                                        </div>
                                        <div className="space-y-2 flex items-center">
                                            <input
                                                type="checkbox"
                                                id="isPreview"
                                                checked={newLesson.isPreview || false}
                                                onChange={(e) => setNewLesson(prev => ({ ...prev, isPreview: e.target.checked }))}
                                                className="rounded"
                                            />
                                            <Label htmlFor="isPreview" className="ml-2">Preview Lesson</Label>
                                        </div>
                                        <div className="space-y-2 flex items-end">
                                            <Button type="button" onClick={addLesson} className="w-full">
                                                Add Lesson
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Existing Lessons */}
                            {moduleData.lessons.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic text-center py-4">
                                    No lessons added yet
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {moduleData.lessons.map((lesson, index) => (
                                        <Card key={lesson.lessonId}>
                                            <CardContent className="pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                {lesson.type === 'video' && <Play className="h-4 w-4 text-red-500" />}
                                                                {lesson.type === 'reading' && <BookOpen className="h-4 w-4 text-blue-500" />}
                                                                <span className="font-medium">{lesson.title}</span>
                                                                {lesson.isPreview && (
                                                                    <Badge variant="secondary" className="text-xs">Preview</Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground space-y-1">
                                                                {lesson.duration && (
                                                                    <div>Duration: {lesson.duration} minutes</div>
                                                                )}
                                                                {lesson.media?.url && (
                                                                    <div>Media: {lesson.media.type} - {lesson.media.url.length > 50 ? `${lesson.media.url.substring(0, 50)}...` : lesson.media.url}</div>
                                                                )}
                                                                {lesson.content && (
                                                                    <div>Content: {lesson.content.length > 50 ? `${lesson.content.substring(0, 50)}...` : lesson.content}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeLesson(lesson.lessonId)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSave} disabled={!moduleData.title.trim()}>
                                {module ? "Update Day" : "Add Day"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CourseForm({ courseId, isNew = false }: CourseFormProps) {
    const router = useRouter();
    const [newTag, setNewTag] = useState("");
    const [modules, setModules] = useState<ModuleFormData[]>([]);
    const [editingModule, setEditingModule] = useState<ModuleFormData | null>(null);
    const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);

    const { data: courseData, isLoading: isLoadingCourse } = useGetCourseByIdQuery(courseId || "", {
        skip: isNew || !courseId || courseId.trim() === "",
    });
    const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

    const isLoading = isCreating || isUpdating;

    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema) as unknown as Resolver<CourseFormData>,
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            shortDescription: "",
            category: "Programming",
            subcategory: "",
            level: "Beginner",
            language: "English",
            instructor: "",
            durationHours: undefined,
            durationWeeks: undefined,
            hoursPerWeek: undefined,
            price: undefined,
            currency: "BDT",
            discountPrice: undefined,
            discountExpiry: undefined,
            capacity: undefined,
            enrollmentStatus: "open",
            enrollmentStartDate: undefined,
            enrollmentEndDate: undefined,
            enrollmentDeadline: undefined,
            thumbnailUrl: "",
            coverImageUrl: "",
            tags: [],
            curriculum: [],
            isPublished: false,
            isFeatured: false,
        },
    });

    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = form;
    const watchedTags = useWatch({ control, name: "tags", defaultValue: [] });

    // Load existing course data
    React.useEffect(() => {
        if (courseData && !isNew && courseId) {
            const course = courseData;

            // Check if course data is valid
            if (!course) {
                console.error("Course data is null or undefined");
                return;
            }
            reset({
                title: course.title || "",
                subtitle: course.subtitle || "",
                description: course.description || "",
                shortDescription: course.shortDescription || "",
                category: course.category || "Programming",
                subcategory: course.subcategory || "",
                level: (course.level as "Beginner" | "Intermediate" | "Advanced" | "Expert") || "Beginner",
                language: course.language || "English",
                instructor: typeof course.instructor === "string" ? course.instructor : course.instructor?.name || "",
                durationHours: course.duration && typeof course.duration === "object" ? course.duration.hours : undefined,
                durationWeeks: course.duration && typeof course.duration === "object" ? course.duration.weeks : undefined,
                hoursPerWeek: course.duration && typeof course.duration === "object" ? course.duration.hoursPerWeek : undefined,
                price: course.pricing?.amount,
                currency: course.pricing?.currency || "BDT",
                discountPrice: course.pricing?.discountPrice,
                discountExpiry: course.pricing?.discountExpiry ? new Date(course.pricing.discountExpiry) : undefined,
                capacity: course.enrollment?.capacity,
                enrollmentStatus: course.enrollment?.status || "open",
                enrollmentStartDate: course.enrollment?.startDate ? new Date(course.enrollment.startDate) : undefined,
                enrollmentEndDate: course.enrollment?.endDate ? new Date(course.enrollment.endDate) : undefined,
                enrollmentDeadline: course.enrollment?.enrollmentDeadline ? new Date(course.enrollment.enrollmentDeadline) : undefined,
                thumbnailUrl: course.thumbnailUrl || "",
                coverImageUrl: course.coverImageUrl || "",
                tags: course.tags || [],
                curriculum: course.curriculum || [],
                isPublished: course.isPublished || false,
                isFeatured: course.isFeatured || false,
            });

            // Set modules state separately
            setModules(course.curriculum || []);
        }
    }, [courseData, isNew, courseId, reset]);

    const onSubmit = async (data: CourseFormData) => {
        try {
            const coursePayload = {
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                shortDescription: data.shortDescription,
                category: data.category,
                subcategory: data.subcategory,
                level: data.level,
                language: data.language,
                instructor: data.instructor,
                duration: {
                    hours: data.durationHours,
                    weeks: data.durationWeeks,
                    hoursPerWeek: data.hoursPerWeek,
                },
                pricing: {
                    amount: data.price,
                    currency: data.currency,
                    discountPrice: data.discountPrice,
                    discountExpiry: data.discountExpiry,
                },
                enrollment: {
                    capacity: data.capacity,
                    status: data.enrollmentStatus,
                    startDate: data.enrollmentStartDate,
                    endDate: data.enrollmentEndDate,
                    enrollmentDeadline: data.enrollmentDeadline,
                },
                thumbnailUrl: data.thumbnailUrl,
                coverImageUrl: data.coverImageUrl,
                tags: data.tags,
                curriculum: data.curriculum,
                isPublished: data.isPublished,
                isFeatured: data.isFeatured,
            };

            if (isNew) {
                await createCourse(coursePayload).unwrap();
                toast.success("Course created successfully!");
                router.push("/dashboard/admin/courses");
            } else if (courseId) {
                await updateCourse({ id: courseId, ...coursePayload }).unwrap();
                toast.success("Course updated successfully!");
                router.push("/dashboard/admin/courses");
            }
        } catch (error) {
            toast.error((error as Error)?.message || "Failed to save course");
        }
    };

    const addTag = () => {
        if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
            setValue("tags", [...watchedTags, newTag.trim()]);
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValue("tags", watchedTags.filter(tag => tag !== tagToRemove));
    };

    if (!isNew && courseId && !isLoadingCourse && !courseData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Course not found</p>
                    <p className="text-sm text-muted-foreground">
                        The course with ID &quot;{courseId}&quot; could not be found
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="mt-4"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isNew ? "Create New Course" : "Edit Course"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isNew ? "Add a new course to your academy" : "Update course information"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-9">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="category">Category</TabsTrigger>
                        <TabsTrigger value="duration">Duration</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="tags">Tags</TabsTrigger>
                        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    {/* Basic Information */}
                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Essential course details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Course Title *</Label>
                                    <Input
                                        id="title"
                                        {...register("title")}
                                        placeholder="Enter course title"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Input
                                        id="subtitle"
                                        {...register("subtitle")}
                                        placeholder="Brief subtitle for the course"
                                    />
                                    {errors.subtitle && (
                                        <p className="text-sm text-red-500">{errors.subtitle.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        {...register("description")}
                                        placeholder="Detailed course description"
                                        className="min-h-[100px]"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shortDescription">Short Description</Label>
                                    <Textarea
                                        id="shortDescription"
                                        {...register("shortDescription")}
                                        placeholder="Brief summary (appears in course cards)"
                                        className="min-h-[60px]"
                                    />
                                    {errors.shortDescription && (
                                        <p className="text-sm text-red-500">{errors.shortDescription.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                {/* Category & Level */}
                    <TabsContent value="category">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category & Level</CardTitle>
                                <CardDescription>Course classification and difficulty</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Programming">Programming</SelectItem>
                                                        <SelectItem value="Design">Design</SelectItem>
                                                        <SelectItem value="Business">Business</SelectItem>
                                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.category && (
                                            <p className="text-sm text-red-500">{errors.category.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Level *</Label>
                                        <Controller
                                            name="level"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                                        <SelectItem value="Expert">Expert</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.level && (
                                            <p className="text-sm text-red-500">{errors.level.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="subcategory">Subcategory</Label>
                                        <Input
                                            id="subcategory"
                                            {...register("subcategory")}
                                            placeholder="e.g. Web Development"
                                        />
                                        {errors.subcategory && (
                                            <p className="text-sm text-red-500">{errors.subcategory.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Language *</Label>
                                        <Controller
                                            name="language"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="English">English</SelectItem>
                                                        <SelectItem value="Bengali">Bengali</SelectItem>
                                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                                        <SelectItem value="French">French</SelectItem>
                                                        <SelectItem value="German">German</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.language && (
                                            <p className="text-sm text-red-500">{errors.language.message}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    {/* Duration */}
                    <TabsContent value="duration">
                        <Card>
                            <CardHeader>
                                <CardTitle>Duration</CardTitle>
                                <CardDescription>Course duration and schedule</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="durationHours">Total Hours</Label>
                                        <Input
                                            id="durationHours"
                                            type="number"
                                            {...register("durationHours", { valueAsNumber: true })}
                                            placeholder="e.g. 40"
                                        />
                                        {errors.durationHours && (
                                            <p className="text-sm text-red-500">{errors.durationHours.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="durationWeeks">Duration (Weeks)</Label>
                                        <Input
                                            id="durationWeeks"
                                            type="number"
                                            {...register("durationWeeks", { valueAsNumber: true })}
                                            placeholder="e.g. 8"
                                        />
                                        {errors.durationWeeks && (
                                            <p className="text-sm text-red-500">{errors.durationWeeks.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                                        <Input
                                            id="hoursPerWeek"
                                            type="number"
                                            {...register("hoursPerWeek", { valueAsNumber: true })}
                                            placeholder="e.g. 5"
                                        />
                                        {errors.hoursPerWeek && (
                                            <p className="text-sm text-red-500">{errors.hoursPerWeek.message}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                {/* Pricing */}
                    <TabsContent value="pricing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                                <CardDescription>Course pricing and discounts</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            {...register("price", { valueAsNumber: true })}
                                            placeholder="Enter price"
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-500">{errors.price.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Controller
                                            name="currency"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select currency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="BDT">BDT</SelectItem>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.currency && (
                                            <p className="text-sm text-red-500">{errors.currency.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="discountPrice">Discount Price</Label>
                                        <Input
                                            id="discountPrice"
                                            type="number"
                                            {...register("discountPrice", { valueAsNumber: true })}
                                            placeholder="Discounted price"
                                        />
                                        {errors.discountPrice && (
                                            <p className="text-sm text-red-500">{errors.discountPrice.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discountExpiry">Discount Expiry</Label>
                                        <Controller
                                            name="discountExpiry"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value || undefined}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.discountExpiry && (
                                            <p className="text-sm text-red-500">{errors.discountExpiry.message}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    {/* Enrollment */}
                    <TabsContent value="enrollment">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enrollment Settings</CardTitle>
                                <CardDescription>Configure enrollment options</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Capacity</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            {...register("capacity", { valueAsNumber: true })}
                                            placeholder="Maximum students"
                                        />
                                        {errors.capacity && (
                                            <p className="text-sm text-red-500">{errors.capacity.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="enrollmentStatus">Enrollment Status</Label>
                                        <Controller
                                            name="enrollmentStatus"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="open">Open</SelectItem>
                                                        <SelectItem value="closed">Closed</SelectItem>
                                                        <SelectItem value="waitlist">Waitlist</SelectItem>
                                                        <SelectItem value="coming_soon">Coming Soon</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.enrollmentStatus && (
                                            <p className="text-sm text-red-500">{errors.enrollmentStatus.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Enrollment Start Date</Label>
                                        <Controller
                                            name="enrollmentStartDate"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value || undefined}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.enrollmentStartDate && (
                                            <p className="text-sm text-red-500">{errors.enrollmentStartDate.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Enrollment End Date</Label>
                                        <Controller
                                            name="enrollmentEndDate"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value || undefined}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.enrollmentEndDate && (
                                            <p className="text-sm text-red-500">{errors.enrollmentEndDate.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Enrollment Deadline</Label>
                                        <Controller
                                            name="enrollmentDeadline"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value || undefined}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.enrollmentDeadline && (
                                            <p className="text-sm text-red-500">{errors.enrollmentDeadline.message}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Media */}
                    <TabsContent value="media">
                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                                <CardDescription>Course images and media</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                                    <Input
                                        id="thumbnailUrl"
                                        {...register("thumbnailUrl")}
                                        placeholder="https://example.com/thumbnail.jpg"
                                    />
                                    {errors.thumbnailUrl && (
                                        <p className="text-sm text-red-500">{errors.thumbnailUrl.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                                    <Input
                                        id="coverImageUrl"
                                        {...register("coverImageUrl")}
                                        placeholder="https://example.com/cover.jpg"
                                    />
                                    {errors.coverImageUrl && (
                                        <p className="text-sm text-red-500">{errors.coverImageUrl.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                {/* Tags */}
                    <TabsContent value="tags">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                                <CardDescription>Add relevant tags for the course</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add a tag"
                                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                    />
                                    <Button type="button" onClick={addTag} variant="outline">
                                        Add Tag
                                    </Button>
                                </div>
                                {watchedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {watchedTags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="cursor-pointer">
                                                {tag}
                                                <X
                                                    className="ml-1 h-3 w-3"
                                                    onClick={() => removeTag(tag)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    {/* Curriculum */}
                    <TabsContent value="curriculum">
                        <Card>
                            <CardHeader>
                                <CardTitle>Curriculum</CardTitle>
                                <CardDescription>Organize course content day by day</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">
                                        Add modules (days) and lessons to structure your course content
                                    </p>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setEditingModule(null);
                                            setIsModuleDialogOpen(true);
                                        }}
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Day
                                    </Button>
                                </div>

                                {modules.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No modules added yet</p>
                                        <p className="text-sm">Click &quot;Add Day&quot; to start building your course curriculum</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {modules.map((module, moduleIndex) => (
                                            <Card key={module.moduleId} className="border-l-4 border-l-blue-500">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                                                                {moduleIndex + 1}
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                                                {module.description && (
                                                                    <CardDescription>{module.description}</CardDescription>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setEditingModule(module);
                                                                    setIsModuleDialogOpen(true);
                                                                }}
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const updatedModules = modules.filter((_, i) => i !== moduleIndex);
                                                                    setModules(updatedModules);
                                                                    setValue("curriculum", updatedModules);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    {module.lessons.length === 0 ? (
                                                        <p className="text-sm text-muted-foreground italic">No lessons added to this day</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {module.lessons.map((lesson, lessonIndex) => (
                                                                <div key={lesson.lessonId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <div className="flex items-center justify-center w-6 h-6 bg-white border rounded-full text-xs font-semibold">
                                                                        {lessonIndex + 1}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            {lesson.type === 'video' && <Play className="h-4 w-4 text-red-500" />}
                                                                            {lesson.type === 'reading' && <BookOpen className="h-4 w-4 text-blue-500" />}
                                                                            <span className="font-medium">{lesson.title}</span>
                                                                            {lesson.isPreview && (
                                                                                <Badge variant="secondary" className="text-xs">Preview</Badge>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground mt-1">
                                                                            {lesson.duration && <span>{lesson.duration} minutes</span>}
                                                                            {lesson.media?.url && <span className="ml-2">• Media: {lesson.media.type}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                {/* Module Dialog */}
                {isModuleDialogOpen && (
                    <ModuleDialog
                        module={editingModule}
                        onSave={(moduleData) => {
                            if (editingModule) {
                                // Update existing module
                                const updatedModules = modules.map(m =>
                                    m.moduleId === editingModule.moduleId ? moduleData : m
                                );
                                setModules(updatedModules);
                                setValue("curriculum", updatedModules);
                            } else {
                                // Add new module
                                const newModules = [...modules, moduleData];
                                setModules(newModules);
                                setValue("curriculum", newModules);
                            }
                            setIsModuleDialogOpen(false);
                            setEditingModule(null);
                        }}
                        onCancel={() => {
                            setIsModuleDialogOpen(false);
                            setEditingModule(null);
                        }}
                    />
                )}

                    {/* Settings */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>Course visibility and features</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        {...register("isPublished")}
                                        className="rounded"
                                    />
                                    <Label htmlFor="isPublished">Publish Course</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        {...register("isFeatured")}
                                        className="rounded"
                                    />
                                    <Label htmlFor="isFeatured">Feature Course</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : isNew ? "Create Course" : "Update Course"}
                    </Button>
                </div>
            </form>
        </div>
    );
}