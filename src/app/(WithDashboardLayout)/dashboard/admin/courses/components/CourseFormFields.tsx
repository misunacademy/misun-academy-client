"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrayField } from "./fields/ArrayField";
import { ImageUploadField, type ImageFieldName } from "./fields/ImageUploadField";
import { Field } from "./CourseFormHelpers";
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import type { CourseFormValues } from "./CourseForm";

interface CourseFormFieldsProps {
  register: UseFormRegister<CourseFormValues>;
  watch: UseFormWatch<CourseFormValues>;
  setValue: UseFormSetValue<CourseFormValues>;
  errors: FieldErrors<CourseFormValues>;
  features: string[];
  highlights: string[];
  previews: Partial<Record<ImageFieldName, string | undefined>>;
  selectedFiles: Partial<Record<ImageFieldName, File>>;
  uploadingField: ImageFieldName | null;
  onFeaturesChange: (features: string[]) => void;
  onHighlightsChange: (highlights: string[]) => void;
  onFileChange: (field: ImageFieldName, e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: (field: ImageFieldName) => Promise<void>;
}

export function CourseFormFields({
  register, watch, setValue, errors,
  features, highlights, previews, selectedFiles, uploadingField,
  onFeaturesChange, onHighlightsChange, onFileChange, onUpload,
}: CourseFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <Input {...register("title")} placeholder="e.g. Introduction to Graphic Design" />
        </Field>
        <Field label="Category">
          <Input {...register("category")} placeholder="e.g. Graphic Design" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Level">
          <Select
            value={watch("level")}
            onValueChange={(v) => setValue("level", v as "beginner" | "intermediate" | "advanced", { shouldDirty: true, shouldValidate: true })}
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
          <Input {...register("durationEstimate")} placeholder="e.g. 4 months" />
        </Field>
      </div>

      <Field label="Short Description">
        <Textarea {...register("shortDescription")} placeholder="Brief overview of the graphic design course (Max ~200 chars)" />
      </Field>

      <Field label="Full Description">
        <Textarea {...register("fullDescription")} className="min-h-[140px]" placeholder="Detailed description of the graphic design course" />
      </Field>

      <Field label="Learning Outcomes (one per line)">
        <Textarea
          {...register("learningOutcomes")}
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
          {...register("prerequisites")}
          className="min-h-[100px]"
          placeholder="e.g. Basic computer literacy and file management
Familiarity with Windows/Mac operating systems
Creative mindset and attention to detail
No prior design experience required (beginner-friendly)"
        />
      </Field>

      <Field label="Target Audience">
        <Textarea {...register("targetAudience")} placeholder="e.g. Aspiring graphic designers, UI/UX enthusiasts, marketing professionals, small business owners, freelancers, students, career changers interested in creative fields" />
      </Field>

      <Field label="Instructor (optional)">
        <Input {...register("instructor")} placeholder="e.g. Mithun Sarkar" />
      </Field>

      <ArrayField
        label="Features"
        items={features}
        onAdd={() => onFeaturesChange([...features, ""])}
        onRemove={(index) => onFeaturesChange(features.filter((_, i) => i !== index))}
        onUpdate={(index, value) => {
          const newFeatures = [...features];
          newFeatures[index] = value;
          onFeaturesChange(newFeatures);
        }}
        placeholder="e.g. 50+ hours of hands-on design tutorials with Adobe Creative Suite"
      />

      <ArrayField
        label="Highlights"
        items={highlights}
        onAdd={() => onHighlightsChange([...highlights, ""])}
        onRemove={(index) => onHighlightsChange(highlights.filter((_, i) => i !== index))}
        onUpdate={(index, value) => {
          const newHighlights = [...highlights];
          newHighlights[index] = value;
          onHighlightsChange(newHighlights);
        }}
        placeholder="e.g. Adobe Photoshop, Illustrator, InDesign"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ImageUploadField
          label="Thumbnail Image (upload)"
          field="thumbnailImage"
          value={watch("thumbnailImage")}
          previewUrl={previews.thumbnailImage}
          selectedFile={selectedFiles.thumbnailImage ?? null}
          isUploading={uploadingField === "thumbnailImage"}
          isUploadingOtherField={uploadingField === "coverImage"}
          error={errors.thumbnailImage?.message as string | undefined}
          onFileChange={onFileChange}
          onUpload={onUpload}
        />
        <Field label="Status">
          <Select value={watch("status") as string}
            onValueChange={(v) => setValue("status", v as "draft" | "published" | "archived", { shouldDirty: true, shouldValidate: true })}>
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
        <Input {...register("tags")} placeholder="photoshop, illustrator, indesign, graphic design, ui/ux, branding, typography, color theory, logo design, portfolio" />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("isCertificateAvailable")}
            onCheckedChange={(checked) => setValue("isCertificateAvailable", Boolean(checked), { shouldDirty: true })}
          />
          <Label className="font-medium">Certificate Available</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("featured")}
            onCheckedChange={(checked) => setValue("featured", checked)}
          />
          <Label className="font-medium">Featured</Label>
        </div>
      </div>
    </div>
  );
}
