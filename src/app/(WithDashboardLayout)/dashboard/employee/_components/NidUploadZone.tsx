'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import {
  Loader2, Upload, ImagePlus, Trash2, CheckCircle2, AlertCircle,
} from 'lucide-react';

interface NidUploadZoneProps {
  label: string;
  inputId: string;
  currentUrl?: string | null;
  localFile: File | null;
  localPreview: string | null;
  isUploading: boolean;
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function NidUploadZone({
  label, inputId, currentUrl, localFile, localPreview, isUploading, isDragging,
  onFileSelect, onClear, onDragEnter, onDragLeave, onDrop,
}: NidUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayUrl = localPreview ?? currentUrl;
  const hasImage = !!displayUrl;
  const isNew = !!localFile;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !hasImage && inputRef.current?.click()}
        onKeyDown={(e) => !hasImage && e.key === 'Enter' && inputRef.current?.click()}
        className={`
          relative rounded-xl border-2 transition-all duration-200 overflow-hidden
          ${isDragging
            ? 'border-emerald-400 bg-emerald-50 scale-[1.01]'
            : hasImage
              ? 'border-emerald-200 bg-transparent cursor-default'
              : 'border-dashed border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer'
          }
        `}
      >
        {hasImage ? (
          <div className="relative w-full h-40 group">
            <Image src={displayUrl!} alt={`${label} preview`} fill sizes="400px" className="object-cover" unoptimized />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow transition-colors"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Change
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg shadow transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>

            {isUploading && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow">
                <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                Uploading…
              </div>
            )}
            {isNew && !isUploading && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full shadow">
                <AlertCircle className="w-3 h-3" />
                New — save to upload
              </div>
            )}
            {!isNew && !isUploading && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-1 rounded-full shadow">
                <CheckCircle2 className="w-3 h-3" />
                Uploaded
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-8 px-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">
                {isDragging ? `Drop your ${label} here` : `Upload ${label}`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Drag & drop, or <span className="text-emerald-600 font-medium underline">browse</span>
              </p>
              <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP · max 5 MB</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
