"use client";

import Image from "next/image";
import { useRef } from "react";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface QuestionImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function QuestionImageUpload({ value, onChange, label = "Image" }: QuestionImageUploadProps) {
  const [uploadImage, { isLoading }] = useUploadSingleImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await uploadImage(formData).unwrap();
      onChange(result.data.url);
      toast.success("Image uploaded");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Upload failed");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border">
          <div className="relative w-full h-40 bg-muted">
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary/10 file:text-primary
              hover:file:bg-primary/20
              disabled:opacity-50"
            disabled={isLoading}
          />
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        JPG, PNG, or WEBP (max 5MB)
      </p>
    </div>
  );
}
