"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, ArrowUp, ArrowDown, ArrowRight,
  CheckCircle2, Download, LayoutTemplate, MailOpen, Share2, Sparkles,
  Upload, ZoomIn, ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FALLBACK_COURSE_TITLE } from "@/constants/courses";
import { TEMPLATES, type PosterTemplate } from "@/constants/posterTemplates";
import { toSlug, getCourseType, getBatchNumber, getTemplatePriority } from "@/utils/posterHelpers";
import { useAuth } from "@/hooks/useAuth";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { useImageEditor } from "@/hooks/useImageEditor";
import { usePosterGenerator } from "@/hooks/usePosterGenerator";

interface CongratulationsPageProps {
  courseSlug?: string | null;
}

const darkCardClass =
  "border-primary/20 bg-surface-darker/80 text-white shadow-[0_0_60px_hsl(156_70%_42%/0.08)] backdrop-blur-sm";

function CongratulationsPage({ courseSlug }: CongratulationsPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery(undefined, { skip: !user?.id });

  const queryCourseSlug = toSlug(courseSlug);
  const appCourseType = getCourseType(queryCourseSlug || FALLBACK_COURSE_TITLE);

  const latestEnrollment = (() => {
    const allEnrollments = enrollmentsData?.data ?? [];
    const activeEnrollments = allEnrollments.filter((e) => e.status === "active");
    const sourceList = activeEnrollments.length > 0 ? activeEnrollments : allEnrollments;

    if (queryCourseSlug) {
      const matchedBySlug = sourceList.find((e) => {
        const slug = toSlug(e.course?.slug) || toSlug(e.batchId.courseId.slug) || toSlug(e.courseId?.slug) || toSlug(e.batchId.courseId.title) || toSlug(e.courseId?.title) || toSlug(e.course?.title);
        return slug === queryCourseSlug;
      });
      if (matchedBySlug) return matchedBySlug;
    }

    const matchedByCourse = sourceList.find((e) => {
      return getCourseType(e.batchId.courseId.title || e.course?.title || e.courseId?.title || "") === appCourseType;
    });
    return matchedByCourse ?? sourceList[0];
  })();

  const courseTitle = latestEnrollment?.batchId?.courseId?.title || latestEnrollment?.course?.title || latestEnrollment?.courseId?.title || FALLBACK_COURSE_TITLE;

  const { data: batchData } = useGetBatchByIdQuery(
    String((latestEnrollment?.batchId as { _id?: string })?._id || ""),
    { skip: !latestEnrollment?.batchId },
  );

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const [userNameState, setUserNameState] = useState<{ value: string; edited: boolean }>({ value: "", edited: false });
  const [userImageState, setUserImageState] = useState<{ value: string | null; edited: boolean }>({ value: null, edited: false });

  const userName = userNameState.edited ? userNameState.value : (user?.name || userNameState.value);
  const userImage = userImageState.edited ? userImageState.value : (user?.image || userImageState.value);

  const setUserName = (value: string) => setUserNameState({ value, edited: true });
  const setUserImage = (value: string | null) => setUserImageState({ value, edited: true });

  const {
    imageOffset, imageZoom, previewImgRef, setImageOffset, setImageZoom,
    moveImage, zoomIn, zoomOut,
    onPreviewPointerDown, onPreviewPointerMove, onPreviewPointerUp, resetImage,
    MIN_ZOOM, MAX_ZOOM, ZOOM_STEP,
  } = useImageEditor();

  const batchNo = batchData?.data?.title ?? latestEnrollment?.batch?.title ?? latestEnrollment?.batchId?.title ?? (batchData?.data ? `BATCH-${batchData.data.batchNumber}` : "");
  const batchNumber = getBatchNumber(batchNo);
  const selectedCourseType = queryCourseSlug ? getCourseType(queryCourseSlug) : getCourseType(courseTitle);
  const templatePriority = getTemplatePriority(selectedCourseType, batchNumber);

  const templateGroups: Record<string, PosterTemplate[]> = {
    graphic: TEMPLATES.graphic,
    english: TEMPLATES.english.length > 0 ? TEMPLATES.english : TEMPLATES.graphic,
    general: TEMPLATES.graphic,
  };
  const activeTemplateGroup = templateGroups[selectedCourseType];
  const courseTemplates = templatePriority.map((i) => activeTemplateGroup[i]).filter(Boolean);
  const resolvedTemplates = courseTemplates.length > 0 ? courseTemplates : activeTemplateGroup;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImage(event.target?.result as string);
      setImageOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  usePosterGenerator(canvasRef, resolvedTemplates, selectedTemplateIndex, userImage, userName, batchNo, imageOffset, imageZoom);

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `misun-academy-${userName}.png`;
      link.click();
      toast.success("Poster downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  const sharePoster = async () => {
    if (!canvasRef.current || !navigator.share) { toast.info("Sharing not supported"); return; }
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.share({ title: "Misun Academy Enrollment", files: [new File([blob], "poster.png", { type: "image/png" })] });
    });
  };

  if (isAuthLoading || isEnrollmentsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-surface-darker/60 px-6 py-4 text-sm text-white/60">
          <Sparkles className="h-5 w-5 animate-spin text-primary" />
          লোড হচ্ছে...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-300">
          Please log in to view this page
        </p>
      </div>
    );
  }

  const firstName = userName.split(" ")[0] || "there";

  return (
    <div className="w-full space-y-6">
      {/* Welcome banner */}
      <div className={`relative overflow-hidden rounded-2xl border p-8 text-center ${darkCardClass}`}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
          Congratulations, {firstName}!
        </h2>
        <p className="relative mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
          You have successfully enrolled in the{" "}
          <strong className="font-semibold text-white">
            {latestEnrollment?.course?.title || courseTitle}
          </strong>{" "}
          course. Download your welcome poster below and share your new journey!
        </p>
        <div className="relative mt-6 inline-flex max-w-full items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3 text-left">
          <MailOpen className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-[13px] font-medium leading-relaxed text-emerald-200/90">
            Please check your email — there are a few important things for you to do next.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left controls */}
        <div className="space-y-6 lg:col-span-5">
          <Card className={darkCardClass}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <LayoutTemplate className="h-4 w-4 text-primary" />
                </span>
                Choose Template
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {resolvedTemplates.map((template, index) => {
                const active = selectedTemplateIndex === index;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateIndex(index)}
                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                      active
                        ? "border-primary shadow-[0_0_24px_hsl(156_70%_42%/0.25)]"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <Image
                      src={template.src}
                      alt={template.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                    {active && (
                      <span className="absolute right-2 top-2 rounded-full bg-primary p-1 text-white shadow-lg">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className={darkCardClass}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-white">Customize Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-white/70">Student Name</Label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-white/70">Profile Photo</Label>
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.04]">
                  <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={(e) => { e.preventDefault(); moveImage(0, -0.05); }}
                              aria-label="Move up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={(e) => { e.preventDefault(); moveImage(-0.05, 0); }}
                              aria-label="Move left"
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-8 px-3 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                              onClick={(e) => { e.preventDefault(); resetImage(); }}
                            >
                              Reset
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={(e) => { e.preventDefault(); moveImage(0.05, 0); }}
                              aria-label="Move right"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={(e) => { e.preventDefault(); moveImage(0, 0.05); }}
                              aria-label="Move down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={(e) => { e.preventDefault(); zoomOut(); }}
                              aria-label="Zoom out"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <input
                              type="range"
                              min={MIN_ZOOM}
                              max={MAX_ZOOM}
                              step={ZOOM_STEP}
                              value={imageZoom}
                              onChange={(e) => setImageZoom(Number(e.target.value))}
                              className="w-36 accent-emerald-500"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={(e) => { e.preventDefault(); zoomIn(); }}
                              aria-label="Zoom in"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
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

        {/* Poster preview */}
        <div className="lg:col-span-7">
          <Card className={`${darkCardClass} lg:sticky lg:top-24`}>
            <CardContent className="p-5 sm:p-6">
              <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner">
                <canvas ref={canvasRef} className="h-full w-full object-contain" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={downloadPoster} className="h-11 w-full font-semibold">
                  <Download className="mr-2 h-5 w-5" />
                  Download Poster
                </Button>
                <Button
                  onClick={sharePoster}
                  variant="outline"
                  className="h-11 w-full border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
              <p className="mt-4 text-center text-xs leading-relaxed text-white/35">
                Tip: drag your photo in the preview circle to reposition it before downloading.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CongratulationsPage;
