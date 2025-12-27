import { z } from "zod";

// Lesson schema
const lessonSchema = z.object({
  lessonId: z.string(),
  title: z.string().min(1, "Lesson title is required"),
  type: z.enum(["video", "reading", "project"]),
  duration: z.number().min(0).optional(),
  isPreview: z.boolean().optional(),
  content: z.any().optional(),
  media: z.object({
    type: z.enum(["youtube", "gdrive", "video"]),
    url: z.string().url().optional(),
    thumbnail: z.string().url().optional(),
  }).optional(),
});

// Module schema (representing days)
const moduleSchema = z.object({
  moduleId: z.string(),
  title: z.string().min(1, "Module title is required"),
  description: z.string().optional(),
  order: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  lessons: z.array(lessonSchema),
});

// Course form validation schema
export const courseSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  language: z.string().min(1, "Language is required"),
  instructor: z.string().optional(),

  // Duration
  durationHours: z.number().min(0).optional(),
  durationWeeks: z.number().min(0).optional(),
  hoursPerWeek: z.number().min(0).optional(),

  // Pricing
  price: z.number().min(0, "Price must be positive").optional(),
  currency: z.string().optional(),
  discountPrice: z.number().min(0).optional().nullable(),
  discountExpiry: z.date().optional().nullable(),

  // Enrollment
  capacity: z.number().min(0).optional(),
  enrollmentStatus: z.enum(["open", "closed", "waitlist", "coming_soon"]).optional(),
  enrollmentStartDate: z.date().optional(),
  enrollmentEndDate: z.date().optional(),
  enrollmentDeadline: z.date().optional(),

  // Media
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  coverImageUrl: z.string().url().optional().or(z.literal("")),

  // Tags
  tags: z.array(z.string()),

  // Curriculum (Modules/Days)
  curriculum: z.array(moduleSchema).optional(),

  // Status
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
export type ModuleFormData = z.infer<typeof moduleSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;