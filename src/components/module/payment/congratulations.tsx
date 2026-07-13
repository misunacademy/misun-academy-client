"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, ArrowUp, ArrowDown, ArrowRight,
  CheckCircle2, Download, LayoutTemplate, Share2, Sparkles,
  Upload, ZoomIn, ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courseInfo } from "@/constants/enrollment";
import { TEMPLATES } from "@/constants/posterTemplates";
import { toSlug, getCourseType, getBatchNumber, getTemplatePriority } from "@/utils/posterHelpers";
import { useAuth } from "@/hooks/useAuth";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { useImageEditor } from "@/hooks/useImageEditor";
import { usePosterGenerator } from "@/hooks/usePosterGenerator";

interface CongratulationsPageProps {
  courseSlug?: string | null;
}

function CongratulationsPage({ courseSlug }: CongratulationsPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery(undefined, { skip: !user?.id });

  const queryCourseSlug = toSlug(courseSlug);
  const appCourseType = getCourseType(queryCourseSlug || courseInfo?.title);

  const latestEnrollment = (() => {
    const allEnrollments = enrollmentsData?.data ?? [];
    const activeEnrollments = allEnrollments.filter((e) => e.status === "active");
    const sourceList = activeEnrollments.length > 0 ? activeEnrollments : allEnrollments;

    if (queryCourseSlug) {
      const matchedBySlug = sourceList.find((e) => {
        const enrollment = e as any;
        const slug = toSlug(enrollment?.course?.slug) || toSlug(enrollment?.batchId?.courseId?.slug) || toSlug(enrollment?.courseId?.slug) || toSlug(enrollment?.batchId?.courseId?.title) || toSlug(enrollment?.courseId?.title) || toSlug(enrollment?.course?.title);
        return slug === queryCourseSlug;
      });
      if (matchedBySlug) return matchedBySlug;
    }

    const matchedByCourse = sourceList.find((e) => {
      const enrollment = e as any;
      return getCourseType(enrollment?.batchId?.courseId?.title || enrollment?.course?.title || enrollment?.courseId?.title || "") === appCourseType;
    });
    return matchedByCourse ?? sourceList[0];
  })();

  const courseTitle = (latestEnrollment as any)?.batchId?.courseId?.title || (latestEnrollment as any)?.course?.title || (latestEnrollment as any)?.courseId?.title || courseInfo?.title || "";

  const { data: batchData } = useGetBatchByIdQuery(
    (latestEnrollment?.batchId as any)?._id || "",
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

  const batchNo = batchData?.data?.title ?? latestEnrollment?.batch?.title ?? (latestEnrollment as any)?.batchId?.title ?? (batchData?.data ? `BATCH-${batchData.data.batchNumber}` : "");
  const batchNumber = getBatchNumber(batchNo);
  const selectedCourseType = queryCourseSlug ? getCourseType(queryCourseSlug) : getCourseType(courseTitle);
  const templatePriority = getTemplatePriority(selectedCourseType, batchNumber);

  const templateGroups: Record<string, any[]> = {
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
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Please log in to view this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Congratulations, {userName.split(" ")[0]}!</h1>
              <p className="text-slate-600 max-w-2xl mx-auto">
                You have successfully enrolled in the <strong>{latestEnrollment?.course?.title || "Graphic Design with Freelancing"}</strong> course.
                Download your welcome poster below and share your new journey!
              </p>
              <div className="mt-6 bg-white/60 border border-green-200 rounded-lg p-4 inline-block">
                <p className="text-green-800 font-medium">
                  📩 Please check your email&mdash;there are a few important things for you to do next.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4" />
                    Choose Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {resolvedTemplates.map((template, index) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplateIndex(index)}
                      className={`cursor-pointer rounded-lg border-2 overflow-hidden relative aspect-square transition-all ${selectedTemplateIndex === index ? "border-green-600 ring-2 ring-green-100" : "border-slate-100 hover:border-slate-300"}`}
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customize Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your full name" />
                  </div>

                  <div className="space-y-2 hidden">
                    <Label>Batch ID</Label>
                    <Input value={batchNo} readOnly placeholder="e.g. BATCH-06" />
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center">
                      <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                                    <Button size="sm" variant="outline" onClick={() => moveImage(0, -0.05)}><ArrowUp className="w-4 h-4" /></Button>
                                  </div>
                                  <Button size="sm" variant="outline" onClick={() => moveImage(-0.05, 0)}><ArrowLeft className="w-4 h-4" /></Button>
                                  <div className="flex items-center justify-center space-x-2">
                                    <Button size="sm" variant="ghost" onClick={resetImage}>Reset</Button>
                                    <span className="text-xs text-slate-500">X: {Math.round(imageOffset.x * 100)}% Y: {Math.round(imageOffset.y * 100)}% Zoom: {Math.round(imageZoom * 100)}%</span>
                                  </div>
                                  <Button size="sm" variant="outline" onClick={() => moveImage(0.05, 0)}><ArrowRight className="w-4 h-4" /></Button>
                                  <div className="col-span-3 flex justify-center">
                                    <Button size="sm" variant="outline" onClick={() => moveImage(0, 0.05)}><ArrowDown className="w-4 h-4" /></Button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-center gap-2">
                                <Button size="sm" variant="outline" onClick={zoomOut}><ZoomOut className="w-4 h-4" /></Button>
                                <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP} value={imageZoom} onChange={(e) => setImageZoom(Number(e.target.value))} className="w-40" />
                                <Button size="sm" variant="outline" onClick={zoomIn}><ZoomIn className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                              <Upload className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-slate-600">Click to upload photo</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7">
              <Card className="h-full border-0 shadow-lg bg-slate-900/5 backdrop-blur-sm sticky top-24 flex items-center justify-center">
                <CardContent className="p-6">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-inner mb-6">
                    <canvas ref={canvasRef} className="w-full h-full object-contain" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={downloadPoster} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
                      <Download className="w-5 h-5 mr-2" />Download Poster
                    </Button>
                    <Button onClick={sharePoster} variant="outline" className="w-full h-12 text-lg">
                      <Share2 className="w-5 h-5 mr-2" />Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CongratulationsPage;
