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
      <Card className="bg-[#0a1610]/90 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" />
            Choose Template
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {templates.map((template, index) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(index)}
              className={`cursor-pointer rounded-lg border-2 overflow-hidden relative aspect-square transition-all ${
                selectedTemplateIndex === index
                  ? "border-green-500 ring-2 ring-green-500/30"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <Image src={template.src} alt={template.name} width={100} height={100} className="w-full h-full object-cover" />
              {selectedTemplateIndex === index && (
                <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-[#0a1610]/90 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Customize Details</CardTitle>
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
            <Label className="text-white/80">Student Name</Label>
            <Input value={userName} onChange={(e) => onUserNameChange(e.target.value)} placeholder="Enter your full name" className="bg-[#0d1f12] border-primary/25 text-white placeholder:text-white/40" />
          </div>

          <div className="space-y-2 hidden">
            <Label className="text-white/80">Batch ID</Label>
            <Input value={batchNo} readOnly placeholder="e.g. BATCH-06" className="bg-[#0d1f12] border-primary/25 text-white placeholder:text-white/40" />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Profile Photo</Label>
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 hover:bg-primary/5 transition-colors text-center">
              <input type="file" id="image-upload" accept="image/*" onChange={onImageUpload} className="hidden" />
              <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
                {userImage ? (
                  <div className="mx-auto">
                    <div
                      className="relative w-24 h-24 mx-auto rounded-full overflow-hidden touch-none cursor-grab"
                      ref={previewImgRef}
                      onPointerDown={onPreviewPointerDown}
                      onPointerMove={onPreviewPointerMove}
                      onPointerUp={onPreviewPointerUp}
                      onPointerCancel={onPreviewPointerUp}
                      style={{ touchAction: "none" }}
                    >
                      <Image src={userImage} alt="Preview" fill sizes="96px" className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="col-span-3 flex justify-center">
                            <Button size="sm" variant="outline" onClick={() => onMoveImage(0, -0.05)}><ArrowUp className="w-4 h-4" /></Button>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => onMoveImage(-0.05, 0)}><ArrowLeft className="w-4 h-4" /></Button>
                          <div className="flex items-center justify-center space-x-2">
                            <Button size="sm" variant="ghost" onClick={onResetImage}>Reset</Button>
                            <span className="text-xs text-white/55">X: {Math.round(imageOffset.x * 100)}% Y: {Math.round(imageOffset.y * 100)}% Zoom: {Math.round(imageZoom * 100)}%</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => onMoveImage(0.05, 0)}><ArrowRight className="w-4 h-4" /></Button>
                          <div className="col-span-3 flex justify-center">
                            <Button size="sm" variant="outline" onClick={() => onMoveImage(0, 0.05)}><ArrowDown className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={onZoomOut}><ZoomOut className="w-4 h-4" /></Button>
                        <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP} value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-40" />
                        <Button size="sm" variant="outline" onClick={onZoomIn}><ZoomIn className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-green-500">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-white/70">Click to upload photo</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
