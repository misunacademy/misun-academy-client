"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreateCourseMutation, useUpdateCourseMutation, useGetCourseByIdQuery, type CourseResponse } from "@/redux/api/courseApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { toast } from "sonner";
import { Loader2, Book } from "lucide-react";
import { InstructorAssignDialog } from "../[courseId]/page";
import { splitLines, splitTags } from "./CourseFormHelpers";
import { CourseFormFields } from "./CourseFormFields";
import type { ImageFieldName } from "./fields/ImageUploadField";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  learningOutcomes: z.string().min(1, "Learning outcomes required"),
  prerequisites: z.string().optional(),
  targetAudience: z.string().min(1, "Target audience is required"),
  thumbnailImage: z.string().url("Valid URL required"),
  coverImage: z.string().url("Valid URL required").optional().or(z.literal("")),
  durationEstimate: z.string().min(1, "Duration estimate is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
  isCertificateAvailable: z.boolean().optional().default(true),
  instructor: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
});

export type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  courseId?: string;
  isNew?: boolean;
}

export default function CourseForm({ courseId, isNew = false }: CourseFormProps) {
  const router = useRouter();
  const { data: course, isFetching, error } = useGetCourseByIdQuery(courseId!, { skip: !courseId });
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
  const [uploadImage, { isLoading: uploadingImage }] = useUploadSingleImageMutation();
  const [selectedFiles, setSelectedFiles] = useState<Partial<Record<ImageFieldName, File>>>({});
  const [previews, setPreviews] = useState<Partial<Record<ImageFieldName, string>>>({});
  const [uploadingField, setUploadingField] = useState<ImageFieldName | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema) as Resolver<CourseFormValues>,
    defaultValues: {
      title: "", shortDescription: "", fullDescription: "", learningOutcomes: "",
      prerequisites: "", targetAudience: "", thumbnailImage: "", coverImage: "",
      durationEstimate: "", level: "beginner", category: "", tags: "",
      featured: false, status: "draft", isCertificateAvailable: true, instructor: "",
      features: [], highlights: [],
    },
  });

  useEffect(() => {
    if (course) {
      const c = course as CourseResponse;
      const normalizeLevel = (lvl: unknown): "beginner" | "intermediate" | "advanced" => {
        if (typeof lvl !== "string") return "beginner";
        const val = lvl.trim().toLowerCase();
        if (val === "intermediate" || val === "advanced") return val;
        return "beginner";
      };

      form.reset({
        title: c.title || "", shortDescription: c.shortDescription || "",
        fullDescription: c.fullDescription || "",
        learningOutcomes: (c.learningOutcomes || []).join("\n"),
        prerequisites: (c.prerequisites || []).join("\n"),
        targetAudience: c.targetAudience || "",
        thumbnailImage: c.thumbnailImage || "", coverImage: c.coverImage || "",
        durationEstimate: c.durationEstimate || "", level: normalizeLevel(c.level),
        category: c.category || "", tags: (c.tags || []).join(", "),
        featured: Boolean(c.featured), status: c.status || "draft",
        isCertificateAvailable: c.isCertificateAvailable ?? true,
        instructor: c.instructor || "", features: c.features || [], highlights: c.highlights || [],
      });

      setPreviews({ thumbnailImage: c.thumbnailImage || undefined, coverImage: c.coverImage || undefined });
      setFeatures(c.features || []);
      setHighlights(c.highlights || []);
    }
  }, [course, form]);

  const { errors } = form.formState;

  const handleFileChange = (field: ImageFieldName, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Use JPG, PNG, or WEBP.");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Max size is 5MB.");
      e.target.value = "";
      return;
    }

    setSelectedFiles((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const uploadImageForField = async (field: ImageFieldName) => {
    const file = selectedFiles[field];
    if (!file) { toast.error("Select an image first"); return; }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingField(field);
      const result = await uploadImage(formData).unwrap();
      const url = result.data.url;
      form.setValue(field, url, { shouldDirty: true, shouldValidate: true });
      setPreviews((prev) => ({ ...prev, [field]: url }));
      toast.success(field === "thumbnailImage" ? "Thumbnail uploaded" : "Cover image uploaded");
      setSelectedFiles((prev) => ({ ...prev, [field]: undefined }));
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  const onSubmit: SubmitHandler<CourseFormValues> = async (values) => {
    const payload = {
      title: values.title.trim(), shortDescription: values.shortDescription.trim(),
      fullDescription: values.fullDescription.trim(),
      learningOutcomes: splitLines(values.learningOutcomes),
      prerequisites: values.prerequisites ? splitLines(values.prerequisites) : [],
      targetAudience: values.targetAudience.trim(),
      thumbnailImage: values.thumbnailImage.trim(), coverImage: values.coverImage?.trim() || undefined,
      durationEstimate: values.durationEstimate.trim(), level: values.level,
      category: values.category.trim(), tags: values.tags ? splitTags(values.tags) : [],
      featured: values.featured ?? false, status: values.status ?? "draft",
      isCertificateAvailable: values.isCertificateAvailable ?? true,
      instructor: values.instructor?.trim() || undefined,
      features, highlights,
    };

    try {
      if (isNew) {
        await createCourse(payload).unwrap();
        toast.success("Course created");
      } else if (courseId) {
        await updateCourse({ id: courseId, data: payload }).unwrap();
        toast.success("Course updated");
      }
      router.push("/dashboard/admin/courses");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || "Failed to save course");
    }
  };

  const saving = creating || updating;

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading course: {(error as { data?: { message?: string }; message?: string })?.data?.message || (error as { data?: { message?: string }; message?: string })?.message || 'Unknown error'}
      </div>
    );
  }

  if (!isNew && isFetching) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-2">Loading course...</p>
      </div>
    );
  }

  if (!isNew && !course && !isFetching) {
    return (
      <div className="p-6 text-yellow-600">
        Course not found. The course may have been deleted or you may not have permission to view it.
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/admin/courses')} className="mb-2">← Back to Courses</Button>
          <div>
            <h1 className="text-3xl font-bold">{isNew ? "Create Course" : "Edit Course"}</h1>
            <p className="text-muted-foreground">Aligned with server course schema.</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {!isNew && courseId && (
            <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/admin/courses/${courseId}/content`)}>
              <Book className="h-4 w-4 mr-2" />Manage Content</Button>
          )}
          {!isNew && courseId && <InstructorAssignDialog courseId={courseId} />}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Required fields only</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseFormFields
            register={form.register} watch={form.watch} setValue={form.setValue} errors={errors}
            features={features} highlights={highlights} previews={previews} selectedFiles={selectedFiles}
            uploadingField={uploadingField} onFeaturesChange={setFeatures}
            onHighlightsChange={setHighlights} onFileChange={handleFileChange} onUpload={uploadImageForField}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving || isFetching}>
          {saving || isFetching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Course"}
        </Button>
      </div>
    </form>
  );
}
