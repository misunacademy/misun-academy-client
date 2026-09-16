"use client";

import Image from "next/image";
import { useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export type ImageFieldName = "thumbnailImage" | "coverImage";

interface ImageUploadFieldProps {
  label: string;
  field: ImageFieldName;
  value: string;
  previewUrl?: string;
  selectedFile: File | null;
  isUploading: boolean;
  isUploadingOtherField: boolean;
  error?: string;
  onFileChange: (field: ImageFieldName, e: ChangeEvent<HTMLInputElement>) => void;
  onUpload: (field: ImageFieldName) => void;
}

export function ImageUploadField({
  label,
  field,
  value,
  previewUrl,
  selectedFile,
  isUploading,
  isUploadingOtherField,
  error,
  onFileChange,
  onUpload,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            ref={(el) => {
              inputRef.current = el;
            }}
            onChange={(e) => onFileChange(field, e)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || isUploadingOtherField || !selectedFile}
            onClick={() => onUpload(field)}
          >
            {isUploading ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading</span>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {value && (
          <p className="text-xs text-muted-foreground break-all">Saved URL: {value}</p>
        )}
        {previewUrl && (
          <Image
            src={previewUrl}
            alt={`${label} preview`}
            width={512}
            height={288}
            className="h-32 w-full rounded border object-cover"
          />
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
