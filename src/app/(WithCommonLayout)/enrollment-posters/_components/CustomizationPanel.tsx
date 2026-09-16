"use client";

import Image from "next/image";
import { LayoutTemplate, Upload, ArrowLeft, ArrowUp, ArrowDown, ArrowRight, ZoomIn, ZoomOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PosterTemplate } from "@/constants/posterTemplates";

interface CustomizationPanelProps {
  templates: PosterTemplate[];
  selectedTemplateIndex: number;
  onSelectTemplate: (index: number) => void;
  enrollments: Array<{ _id: string; batchId: { courseId: { title: string } }; course?: { title?: string }; courseId?: { title?: string }; status: string }>;
  selectedEnrollmentValue: string | undefined;
  onEnrollmentChange: (value: string) => void;
  userName: string;
  onUserNameChange: (value: string) => void;
  userImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  batchNo: string;
  imageOffset: { x: number; y: number };
  imageZoom: number;
  onMoveImage: (dx: number, dy: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetImage: () => void;
  onPreviewPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPreviewPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPreviewPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  previewImgRef: React.RefObject<HTMLDivElement | null>;
  MIN_ZOOM: number;
  MAX_ZOOM: number;
  ZOOM_STEP: number;
  setImageZoom: (zoom: number) => void;
}

export default function CustomizationPanel({
  templates, selectedTemplateIndex, onSelectTemplate,
  enrollments, selectedEnrollmentValue, onEnrollmentChange,
  userName, onUserNameChange,
  userImage, onImageUpload, batchNo,
  imageOffset, imageZoom,
  onMoveImage, onZoomIn, onZoomOut, onResetImage,
  onPreviewPointerDown, onPreviewPointerMove, onPreviewPointerUp,
  previewImgRef, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP, setImageZoom,
}: CustomizationPanelProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <Card className="border-primary/20 bg-surface-darker/80 text-white shadow-[0_0_60px_hsl(156_70%_42%/0.08)] backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <LayoutTemplate className="h-4 w-4 text-primary" />
            </span>
            Choose Template
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {templates.map((template, index) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(index)}
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                selectedTemplateIndex === index
                  ? "border-primary shadow-[0_0_24px_hsl(156_70%_42%/0.25)]"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <Image src={template.src} alt={template.name} width={200} height={200} className="h-full w-full object-cover" />
              {selectedTemplateIndex === index && (
                <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-white shadow-lg">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-surface-darker/80 text-white shadow-[0_0_60px_hsl(156_70%_42%/0.08)] backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-white">Customize Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/80">Select Course</Label>
            <Select value={selectedEnrollmentValue} onValueChange={onEnrollmentChange}>
              <SelectTrigger className="bg-[#0d1f12] border-primary/25 text-white data-[placeholder]:text-white/45">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1f12] border-primary/30 text-white">
                {enrollments.map((enrollment) => {
                  const title = enrollment.batchId.courseId.title || enrollment.course?.title || enrollment.courseId?.title || "Unknown Course";
                  return (
                    <SelectItem key={enrollment._id} value={enrollment._id} className="text-white focus:bg-primary/15 focus:text-white">
                      {title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-white/70">Student Name</Label>
            <Input value={userName} onChange={(e) => onUserNameChange(e.target.value)} placeholder="Enter your full name" className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:ring-primary/50" />
          </div>

          <div className="space-y-2 hidden">
            <Label className="text-white/80">Batch ID</Label>
            <Input value={batchNo} readOnly placeholder="e.g. BATCH-06" className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30" />
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-white/70">Profile Photo</Label>
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.04]">
              <input type="file" id="image-upload" accept="image/*" onChange={onImageUpload} className="hidden" />
              <label htmlFor="image-upload" className="block h-full w-full cursor-pointer">
                {userImage ? (
                  <div className="mx-auto">
                    <div
                      className="relative mx-auto h-24 w-24 cursor-grab touch-none overflow-hidden rounded-full border border-primary/30"
                      ref={previewImgRef}
                      onPointerDown={onPreviewPointerDown}
                      onPointerMove={onPreviewPointerMove}
                      onPointerUp={onPreviewPointerUp}
                      onPointerCancel={onPreviewPointerUp}
                      style={{ touchAction: "none" }}
                    >
                      <Image src={userImage} alt="Preview" fill sizes="96px" className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white" onClick={(e) => { e.preventDefault(); onMoveImage(0, -0.05); }} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white" onClick={(e) => { e.preventDefault(); onMoveImage(-0.05, 0); }} aria-label="Move left"><ArrowLeft className="h-4 w-4" /></Button>
                        <Button type="button" size="sm" variant="ghost" className="h-8 px-3 text-xs text-white/60 hover:bg-white/10 hover:text-white" onClick={(e) => { e.preventDefault(); onResetImage(); }}>Reset</Button>
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white" onClick={(e) => { e.preventDefault(); onMoveImage(0.05, 0); }} aria-label="Move right"><ArrowRight className="h-4 w-4" /></Button>
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white" onClick={(e) => { e.preventDefault(); onMoveImage(0, 0.05); }} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white" onClick={(e) => { e.preventDefault(); onZoomOut(); }} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
                        <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP} value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-36 accent-emerald-500" />
                        <Button type="button" size="icon" variant="outline" className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white" onClick={(e) => { e.preventDefault(); onZoomIn(); }} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
                      </div>
                      <p className="text-[11px] tabular-nums text-white/40">
                        X: {Math.round(imageOffset.x * 100)}% Y: {Math.round(imageOffset.y * 100)}% · Zoom: {Math.round(imageZoom * 100)}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="block">
                    <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                      <Upload className="h-6 w-6" />
                    </span>
                    <span className="block text-sm font-medium text-white/70">Click to upload photo</span>
                    <span className="mt-1 block text-xs text-white/35">PNG or JPG, square works best</span>
                  </span>
                )}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
