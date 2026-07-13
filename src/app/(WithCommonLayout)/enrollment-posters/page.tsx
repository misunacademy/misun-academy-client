"use client";

import { useEffect, useRef, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { courseInfo } from "@/constants/enrollment";
import { TEMPLATES } from "@/constants/posterTemplates";
import { getCourseType, getBatchNumber, getTemplatePriority } from "@/utils/posterHelpers";
import { useAuth } from "@/hooks/useAuth";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { useImageEditor } from "@/hooks/useImageEditor";
import { usePosterGenerator } from "@/hooks/usePosterGenerator";
import PageBackground from "@/components/shared/PageBackground";

function CongratulationsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const router = useRouter();

  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery(undefined, { skip: !user?.id });

  const appCourseType = getCourseType(courseInfo?.title);
  const allEnrollments = enrollmentsData?.data?.filter((e) => e.accessType !== "special") ?? [];
  const activeEnrollments = allEnrollments.filter((e) => e.status === "active");
  const sourceList = activeEnrollments.length > 0 ? activeEnrollments : allEnrollments;
  const enrollments = Array.isArray(sourceList) ? sourceList : [];
  const hasNoActiveEnrollments = !isEnrollmentsLoading && activeEnrollments.length === 0;
  const hasNoEnrollments = allEnrollments.length === 0;

  const latestEnrollment = (() => {
    if (selectedEnrollmentId) {
      const matchedById = sourceList.find((e) => (e as any)?._id === selectedEnrollmentId);
      if (matchedById) return matchedById;
    }
    const matchedByCourse = sourceList.find((e) => getCourseType(e?.course?.title) === appCourseType);
    return matchedByCourse ?? sourceList[0];
  })();

  const selectedEnrollment = latestEnrollment as any;
  const courseTitle = selectedEnrollment?.batchId?.courseId?.title || selectedEnrollment?.course?.title || selectedEnrollment?.courseId?.title || courseInfo?.title || "";
  const selectedEnrollmentValue = selectedEnrollmentId || selectedEnrollment?._id || undefined;

  const { data: batchData } = useGetBatchByIdQuery(
    (selectedEnrollment?.batchId as any)?._id || selectedEnrollment?.batchId || "",
    { skip: !selectedEnrollment?.batchId },
  );

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [isNoActiveDialogDismissed, setIsNoActiveDialogDismissed] = useState(false);

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

  const batchNo = batchData?.data?.title ?? latestEnrollment?.batch?.title ?? selectedEnrollment?.batchId?.title ?? (batchData?.data ? `BATCH-${batchData.data.batchNumber}` : "");
  const batchNumber = getBatchNumber(batchNo);
  const selectedCourseType = getCourseType(courseTitle);
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
      <div className="min-h-screen flex items-center justify-center bg-surface-darker">
        <Sparkles className="animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-darker">
        <p className="text-red-400">Please log in to view this page</p>
      </div>
    );
  }

  const showNoActiveDialog = hasNoActiveEnrollments && !isNoActiveDialogDismissed;

  return (
    <PageBackground
      gradient="bg-surface-darker"
      dotOpacity="opacity-[0.10]"
      dotSize="34px"
      orbs={[
        { position: "top-[-120px] left-1/2 -translate-x-1/2", size: "w-[620px] h-[280px]", opacity: "bg-primary/10", blur: "blur-[120px]" },
        { position: "bottom-0 left-[8%]", size: "w-[300px] h-[200px]", opacity: "bg-primary/6", blur: "blur-[90px]" },
      ]}
    >
      <AlertDialog
        open={showNoActiveDialog}
        onOpenChange={(open) => {
          if (!open) { setIsNoActiveDialogDismissed(true); router.push("/"); }
        }}
      >
        <AlertDialogContent className="bg-[#0a1610] text-white border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>{hasNoEnrollments ? "No enrollments found" : "No active enrollments"}</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              {hasNoEnrollments
                ? "We could not find any enrollments for your account yet. Please enroll to generate a poster."
                : "We could not find any active enrollments. Showing your most recent enrollment instead so you can still download a poster."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700">Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8 border-primary/20 bg-[#0a1610]/90 shadow-[0_0_50px_hsl(156_70%_42%/0.08)]">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Congratulations, {userName.split(" ")[0]}!</h1>
              <p className="text-white/75 max-w-2xl mx-auto">
                You have successfully enrolled in the <strong>{courseTitle || "Graphic Design with Freelancing"}</strong> course.
                Download your welcome poster below and share your new journey!
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-[#0a1610]/90 border-white/10 text-white">
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
                      className={`cursor-pointer rounded-lg border-2 overflow-hidden relative aspect-square transition-all ${selectedTemplateIndex === index ? "border-green-500 ring-2 ring-green-500/30" : "border-white/10 hover:border-white/30"}`}
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
                    <Label className="text-white/80">select Course</Label>
                    <Select value={selectedEnrollmentValue} onValueChange={setSelectedEnrollmentId}>
                      <SelectTrigger className="bg-[#0d1f12] border-primary/25 text-white data-[placeholder]:text-white/45">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d1f12] border-primary/30 text-white">
                        {enrollments.map((enrollment) => {
                          const item = enrollment as any;
                          const title = item?.batchId?.courseId?.title || item?.course?.title || item?.courseId?.title || "Unknown Course";
                          if (!item?._id) return null;
                          return (
                            <SelectItem key={item._id} value={item._id} className="text-white focus:bg-primary/15 focus:text-white">
                              {title}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Student Name</Label>
                    <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your full name" className="bg-[#0d1f12] border-primary/25 text-white placeholder:text-white/40" />
                  </div>

                  <div className="space-y-2 hidden">
                    <Label className="text-white/80">Batch ID</Label>
                    <Input value={batchNo} readOnly placeholder="e.g. BATCH-06" className="bg-[#0d1f12] border-primary/25 text-white placeholder:text-white/40" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Profile Photo</Label>
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 hover:bg-primary/5 transition-colors text-center">
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
                                    <span className="text-xs text-white/55">X: {Math.round(imageOffset.x * 100)}% Y: {Math.round(imageOffset.y * 100)}% Zoom: {Math.round(imageZoom * 100)}%</span>
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

            <div className="lg:col-span-7">
              <Card className="h-full border border-white/10 shadow-lg bg-[#0a1610]/90 backdrop-blur-sm sticky top-24 flex items-center justify-center">
                <CardContent className="p-6">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#0a1610] border border-white/10 shadow-inner mb-6">
                    <canvas ref={canvasRef} className="w-full h-full object-contain" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={downloadPoster} className="w-full bg-green-600 hover:bg-green-700 sm:h-12 sm:text-lg">
                      <Download className="w-5 h-5 mr-2" />Download Poster
                    </Button>
                    <Button onClick={sharePoster} variant="outline" className="w-full sm:h-12 sm:text-lg border-primary/35 text-primary hover:bg-primary/10">
                      <Share2 className="w-5 h-5 mr-2" />Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}

export default CongratulationsPage;
