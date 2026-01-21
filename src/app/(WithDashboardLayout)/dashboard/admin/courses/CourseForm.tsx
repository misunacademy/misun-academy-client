/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateCourseMutation, useUpdateCourseMutation, useGetCourseByIdQuery } from "@/redux/features/course/courseApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { toast } from "sonner";
import { Loader2, Book, Plus, X } from "lucide-react";

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
  price: z.coerce.number({ message: "Price must be a number" }).min(0, "Price must be positive"),
  discountPercentage: z
    .coerce.number({ message: "Discount must be a number" })
    .min(0, "Min 0")
    .max(100, "Max 100")
    .optional(),
  instructor: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
});

export type CourseFormValues = z.infer<typeof formSchema>;

type ImageField = "thumbnailImage" | "coverImage";

interface CourseFormProps {
  courseId?: string;
  isNew?: boolean;
}

interface ArrayFieldProps {
  label: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  placeholder?: string;
}

function ArrayField({ label, items, onAdd, onRemove, onUpdate, placeholder }: ArrayFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {label.toLowerCase().replace(/s$/, '')}
        </Button>
      </div>
    </div>
  );
}

export default function CourseForm({ courseId, isNew = false }: CourseFormProps) {
  const router = useRouter();
  const { data: course, isFetching, error } = useGetCourseByIdQuery(courseId!, { skip: !courseId });
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
  const [uploadImage, { isLoading: uploadingImage }] = useUploadSingleImageMutation();
  const [selectedFiles, setSelectedFiles] = useState<Partial<Record<ImageField, File>>>({});
  const [previews, setPreviews] = useState<Partial<Record<ImageField, string>>>({});
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const fileInputRefs = useRef<Partial<Record<ImageField, HTMLInputElement | null>>>({});

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema) as Resolver<CourseFormValues>,
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      learningOutcomes: "",
      prerequisites: "",
      targetAudience: "",
      thumbnailImage: "",
      coverImage: "",
      durationEstimate: "",
      level: "beginner",
      category: "",
      tags: "",
      featured: false,
      status: "draft",
      price: 0,
      discountPercentage: 0,
      instructor: "",
      features: [],
      highlights: [],
    },
  });

  useEffect(() => {
    if (course) {
      const normalizeLevel = (lvl: unknown): "beginner" | "intermediate" | "advanced" => {
        if (typeof lvl !== "string") return "beginner";
        const val = lvl.trim().toLowerCase();
        if (val === "intermediate" || val === "advanced") return val;
        return "beginner";
      };

      const normalizedLevel = normalizeLevel((course as any).level);


      const formData = {
        title: (course as any).title || "",
        shortDescription: (course as any).shortDescription || "",
        fullDescription: (course as any).fullDescription || "",
        learningOutcomes: ((course as any).learningOutcomes || []).join("\n"),
        prerequisites: ((course as any).prerequisites || []).join("\n"),
        targetAudience: (course as any).targetAudience || "",
        thumbnailImage: (course as any).thumbnailImage || "",
        coverImage: (course as any).coverImage || "",
        durationEstimate: (course as any).durationEstimate || "",
        level: normalizedLevel,
        category: (course as any).category || "",
        tags: ((course as any).tags || []).join(", "),
        featured: Boolean((course as any).featured),
        status: (course as any).status || "draft",
        price: (course as any).price ?? 0,
        discountPercentage: (course as any).discountPercentage ?? 0,
        instructor: (course as any).instructor || "",
        features: (course as any).features || [],
        highlights: (course as any).highlights || [],
      };

      form.reset(formData);
      
      // Force update the level field explicitly
      setTimeout(() => {
        form.setValue("level", normalizedLevel, { 
          shouldDirty: false, 
          shouldValidate: true,
          shouldTouch: false
        });
        form.setValue("status", (course as any).status || "draft", { shouldDirty: false, shouldValidate: true, shouldTouch: false });
      }, 0);

      setPreviews({
        thumbnailImage: (course as any).thumbnailImage || undefined,
        coverImage: (course as any).coverImage || undefined,
      });

      setFeatures((course as any).features || []);
      setHighlights((course as any).highlights || []);
    }
  }, [course, form]);

  const thumbnailValue = form.watch("thumbnailImage");
  const coverValue = form.watch("coverImage");
  const { errors } = form.formState;

  const handleFileChange = (field: ImageField, e: ChangeEvent<HTMLInputElement>) => {
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

  const uploadImageForField = async (field: ImageField) => {
    const file = selectedFiles[field];
    if (!file) {
      toast.error("Select an image first");
      return;
    }

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

      if (fileInputRefs.current[field]) {
        fileInputRefs.current[field]!.value = "";
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  const onSubmit: SubmitHandler<CourseFormValues> = async (values) => {
    const payload = {
      title: values.title.trim(),
      shortDescription: values.shortDescription.trim(),
      fullDescription: values.fullDescription.trim(),
      learningOutcomes: splitLines(values.learningOutcomes),
      prerequisites: values.prerequisites ? splitLines(values.prerequisites) : [],
      targetAudience: values.targetAudience.trim(),
      thumbnailImage: values.thumbnailImage.trim(),
      coverImage: values.coverImage?.trim() || undefined,
      durationEstimate: values.durationEstimate.trim(),
      level: values.level,
      category: values.category.trim(),
      tags: values.tags ? splitTags(values.tags) : [],
      featured: values.featured ?? false,
      status: values.status ?? "draft",
      price: Number(values.price) || 0,
      discountPercentage: values.discountPercentage ?? 0,
      instructor: values.instructor?.trim() || undefined,
      features: features,
      highlights: highlights,
    };

    try {
      if (isNew) {
        await createCourse(payload).unwrap();
        toast.success("Course created");
      } else if (courseId) {
        await updateCourse({ id: courseId, ...payload }).unwrap();
        toast.success("Course updated");
      }
      router.push("/dashboard/admin/courses");
    } catch (err: any) {
        toast.error(err?.data?.message || err?.message || "Failed to save course");
    }
  };

  const saving = creating || updating;

  // Error handling
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading course: {(error as any)?.data?.message || (error as any)?.message || 'Unknown error'}
      </div>
    );
  }

  // Loading state for existing courses
  if (!isNew && isFetching) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Loading course...</p>
      </div>
    );
  }

  // Course not found
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
        <div>
          <h1 className="text-3xl font-bold">{isNew ? "Create Course" : "Edit Course"}</h1>
          <p className="text-muted-foreground">Aligned with server course schema.</p>
        </div>
        {!isNew && courseId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/admin/courses/${courseId}/content`)}
          >
            <Book className="h-4 w-4 mr-2" />
            Manage Content
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Required fields only</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <Input {...form.register("title")} placeholder="e.g. Introduction to Graphic Design" />
            </Field>
            <Field label="Category">
              <Input {...form.register("category")} placeholder="e.g. Graphic Design" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Level">
              <Select
                value={form.watch("level")}
                onValueChange={(v) => form.setValue("level", v as any, { shouldDirty: true, shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Duration Estimate">
              <Input {...form.register("durationEstimate")} placeholder="e.g. 4 months" />
            </Field>
          </div>

          <Field label="Short Description">
            <Textarea {...form.register("shortDescription")} placeholder="Brief overview of the graphic design course (Max ~200 chars)" />
          </Field>

          <Field label="Full Description">
            <Textarea {...form.register("fullDescription")} className="min-h-[140px]" placeholder="Detailed description of the graphic design course" />
          </Field>

          <Field label="Learning Outcomes (one per line)">
            <Textarea
              {...form.register("learningOutcomes")}
              className="min-h-[120px]"
              placeholder="e.g. Master Adobe Creative Suite (Photoshop, Illustrator, InDesign)
Create professional logos and branding materials
Apply color theory and typography principles
Design responsive web graphics and UI elements
Build a professional portfolio showcasing design work"
            />
          </Field>

          <Field label="Prerequisites (one per line, optional)">
            <Textarea
              {...form.register("prerequisites")}
              className="min-h-[100px]"
              placeholder="e.g. Basic computer literacy and file management
Familiarity with Windows/Mac operating systems
Creative mindset and attention to detail
No prior design experience required (beginner-friendly)"
            />
          </Field>

          <Field label="Target Audience">
            <Textarea {...form.register("targetAudience")} placeholder="e.g. Aspiring graphic designers, UI/UX enthusiasts, marketing professionals, small business owners, freelancers, students, career changers interested in creative fields" />
          </Field>

          <Field label="Instructor (optional)">
            <Input {...form.register("instructor")} placeholder="e.g. Mithun Sarkar" />
          </Field>

          <ArrayField
            label="Features"
            items={features}
            onAdd={() => setFeatures([...features, ""])}
            onRemove={(index) => setFeatures(features.filter((_, i) => i !== index))}
            onUpdate={(index, value) => {
              const newFeatures = [...features];
              newFeatures[index] = value;
              setFeatures(newFeatures);
            }}
            placeholder="e.g. 50+ hours of hands-on design tutorials with Adobe Creative Suite
Real-world projects including logo design, branding, and web graphics
Personal feedback and portfolio reviews from industry experts
Lifetime access to design resources and templates
Certificate of completion recognized by design professionals"
          />

          <ArrayField
            label="Highlights"
            items={highlights}
            onAdd={() => setHighlights([...highlights, ""])}
            onRemove={(index) => setHighlights(highlights.filter((_, i) => i !== index))}
            onUpdate={(index, value) => {
              const newHighlights = [...highlights];
              newHighlights[index] = value;
              setHighlights(newHighlights);
            }}
            placeholder="e.g. Adobe Photoshop, Illustrator, InDesign
Figma and Sketch for UI/UX design
Typography and color theory mastery
Logo design and branding strategies
Portfolio development and client presentation"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Thumbnail Image (upload)">
              <input type="hidden" {...form.register("thumbnailImage")} />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    ref={(el) => {
                      fileInputRefs.current.thumbnailImage = el;
                    }}
                    onChange={(e) => handleFileChange("thumbnailImage", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage || uploadingField === "coverImage" || !selectedFiles.thumbnailImage}
                    onClick={() => uploadImageForField("thumbnailImage")}
                  >
                    {uploadingField === "thumbnailImage" ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading</span>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
                {thumbnailValue && (
                  <p className="text-xs text-muted-foreground break-all">Saved URL: {thumbnailValue}</p>
                )}
                {previews.thumbnailImage && (
                  <Image
                    src={previews.thumbnailImage}
                    alt="Thumbnail preview"
                    width={512}
                    height={288}
                    className="h-32 w-full rounded border object-cover"
                  />
                )}
                {errors.thumbnailImage && (
                  <p className="text-sm text-red-500">{errors.thumbnailImage.message as string}</p>
                )}
              </div>
            </Field>

            <Field label="Cover Image (optional upload)">
              <input type="hidden" {...form.register("coverImage")} />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    ref={(el) => {
                      fileInputRefs.current.coverImage = el;
                    }}
                    onChange={(e) => handleFileChange("coverImage", e)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage || uploadingField === "thumbnailImage" || !selectedFiles.coverImage}
                    onClick={() => uploadImageForField("coverImage")}
                  >
                    {uploadingField === "coverImage" ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading</span>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
                {coverValue && (
                  <p className="text-xs text-muted-foreground break-all">Saved URL: {coverValue}</p>
                )}
                {previews.coverImage && (
                  <Image
                    src={previews.coverImage}
                    alt="Cover preview"
                    width={512}
                    height={288}
                    className="h-32 w-full rounded border object-cover"
                  />
                )}
                {errors.coverImage && (
                  <p className="text-sm text-red-500">{errors.coverImage.message as string}</p>
                )}
              </div>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Price">
              <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
            </Field>
            <Field label="Discount %">
              <Input type="number" step="1" {...form.register("discountPercentage", { valueAsNumber: true })} />
            </Field>
            <Field label="Status">
              <Select value={form.watch("status") as string}
                onValueChange={(v) => form.setValue("status", v as any, { shouldDirty: true, shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Tags (comma separated)">
            <Input {...form.register("tags")} placeholder="photoshop, illustrator, indesign, graphic design, ui/ux, branding, typography, color theory, logo design, portfolio" />
          </Field>

          <div className="flex items-center gap-2">
            <Switch
              checked={form.watch("featured")}
              onCheckedChange={(checked) => form.setValue("featured", checked)}
            />
            <Label className="font-medium">Featured</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || isFetching}>
          {saving || isFetching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Course"
          )}
        </Button>
      </div>
    </form>
  );
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitTags(value: string) {
  return value
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
