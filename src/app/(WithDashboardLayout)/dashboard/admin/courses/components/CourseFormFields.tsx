"use client";

import { useFormContext } from "react-hook-form";
import { InputField } from "@/components/forms/input-field";
import { TextareaField } from "@/components/forms/textarea-field";
import { SelectField } from "@/components/forms/select-field";
import { SwitchField } from "@/components/forms/switch-field";
import { ArrayField } from "./fields/ArrayField";
import { ImageUploadField, type ImageFieldName } from "./fields/ImageUploadField";
import type { CourseFormValues } from "./CourseForm";

interface CourseFormFieldsProps {
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

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function CourseFormFields({
  features, highlights, previews, selectedFiles, uploadingField,
  onFeaturesChange, onHighlightsChange, onFileChange, onUpload,
}: CourseFormFieldsProps) {
  const { formState: { errors } } = useFormContext<CourseFormValues>();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <InputField name="title" label="Title" placeholder="e.g. Introduction to Graphic Design" />
        <InputField name="category" label="Category" placeholder="e.g. Graphic Design" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField name="level" label="Level" options={LEVEL_OPTIONS} placeholder="Select level" />
        <InputField name="durationEstimate" label="Duration Estimate" placeholder="e.g. 4 months" />
      </div>

      <TextareaField name="shortDescription" label="Short Description" placeholder="Brief overview of the graphic design course (Max ~200 chars)" />

      <TextareaField name="fullDescription" label="Full Description" className="min-h-[140px]" placeholder="Detailed description of the graphic design course" />

      <TextareaField
        name="learningOutcomes"
        label="Learning Outcomes (one per line)"
        className="min-h-[120px]"
        placeholder="e.g. Master Adobe Creative Suite (Photoshop, Illustrator, InDesign)
Create professional logos and branding materials
Apply color theory and typography principles
Design responsive web graphics and UI elements
Build a professional portfolio showcasing design work"
      />

      <TextareaField
        name="prerequisites"
        label="Prerequisites (one per line, optional)"
        className="min-h-[100px]"
        placeholder="e.g. Basic computer literacy and file management
Familiarity with Windows/Mac operating systems
Creative mindset and attention to detail
No prior design experience required (beginner-friendly)"
      />

      <TextareaField name="targetAudience" label="Target Audience" placeholder="e.g. Aspiring graphic designers, UI/UX enthusiasts, marketing professionals, small business owners, freelancers, students, career changers interested in creative fields" />

      <InputField name="instructor" label="Instructor (optional)" placeholder="e.g. Mithun Sarkar" />

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
          value={""}
          previewUrl={previews.thumbnailImage}
          selectedFile={selectedFiles.thumbnailImage ?? null}
          isUploading={uploadingField === "thumbnailImage"}
          isUploadingOtherField={uploadingField === "coverImage"}
          error={errors.thumbnailImage?.message as string | undefined}
          onFileChange={onFileChange}
          onUpload={onUpload}
        />
        <SelectField name="status" label="Status" options={STATUS_OPTIONS} />
      </div>

      <InputField name="tags" label="Tags (comma separated)" placeholder="photoshop, illustrator, indesign, graphic design, ui/ux, branding, typography, color theory, logo design, portfolio" />

      <div className="grid gap-4 md:grid-cols-2">
        <SwitchField name="isCertificateAvailable" label="Certificate Available" />
        <SwitchField name="featured" label="Featured" />
      </div>
    </div>
  );
}
