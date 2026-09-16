"use client";

import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FALLBACK_COURSE_TITLE } from "@/constants/courses";
import { TEMPLATES } from "@/constants/posterTemplates";
import { getCourseType, getBatchNumber, getTemplatePriority } from "@/utils/posterHelpers";
import { useAuth } from "@/hooks/useAuth";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { useImageEditor } from "@/hooks/useImageEditor";
import { usePosterGenerator } from "@/hooks/usePosterGenerator";
import PageBackground from "@/components/shared/PageBackground";
import PosterHeader from "./_components/PosterHeader";
import CustomizationPanel from "./_components/CustomizationPanel";
import PosterPreviewPanel from "./_components/PosterPreviewPanel";

function CongratulationsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const router = useRouter();

  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery(undefined, { skip: !user?.id });

  const appCourseType = getCourseType(FALLBACK_COURSE_TITLE);
  const allEnrollments = enrollmentsData?.data?.filter((e) => e.accessType !== "special") ?? [];
  const activeEnrollments = allEnrollments.filter((e) => e.status === "active");
  const sourceList = activeEnrollments.length > 0 ? activeEnrollments : allEnrollments;
  const enrollments = Array.isArray(sourceList) ? sourceList : [];
  const hasNoActiveEnrollments = !isEnrollmentsLoading && activeEnrollments.length === 0;
  const hasNoEnrollments = allEnrollments.length === 0;

  const latestEnrollment = (() => {
    if (selectedEnrollmentId) {
      const matchedById = sourceList.find((e) => e._id === selectedEnrollmentId);
      if (matchedById) return matchedById;
    }
    const matchedByCourse = sourceList.find((e) => getCourseType(e?.course?.title) === appCourseType);
    return matchedByCourse ?? sourceList[0];
  })();

  const selectedEnrollment = latestEnrollment;
  const courseTitle = selectedEnrollment?.batchId?.courseId?.title || selectedEnrollment?.course?.title || selectedEnrollment?.courseId?.title || FALLBACK_COURSE_TITLE;
  const selectedEnrollmentValue = selectedEnrollmentId || selectedEnrollment?._id || undefined;

  const { data: batchData } = useGetBatchByIdQuery(
    String((selectedEnrollment?.batchId as { _id?: string })?._id || selectedEnrollment?.batchId || ""),
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

  const templateGroups = {
    graphic: TEMPLATES.graphic,
    english: TEMPLATES.english.length > 0 ? TEMPLATES.english : TEMPLATES.graphic,
    general: TEMPLATES.graphic,
  } as const;
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
          <PosterHeader userName={userName} courseTitle={courseTitle} />

          <div className="grid lg:grid-cols-12 gap-8">
            <CustomizationPanel
              templates={resolvedTemplates}
              selectedTemplateIndex={selectedTemplateIndex}
              onSelectTemplate={setSelectedTemplateIndex}
              enrollments={enrollments}
              selectedEnrollmentValue={selectedEnrollmentValue}
              onEnrollmentChange={setSelectedEnrollmentId}
              userName={userName}
              onUserNameChange={setUserName}
              userImage={userImage}
              onImageUpload={handleImageUpload}
              batchNo={batchNo}
              imageOffset={imageOffset}
              imageZoom={imageZoom}
              onMoveImage={moveImage}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onResetImage={resetImage}
              onPreviewPointerDown={onPreviewPointerDown}
              onPreviewPointerMove={onPreviewPointerMove}
              onPreviewPointerUp={onPreviewPointerUp}
              previewImgRef={previewImgRef}
              MIN_ZOOM={MIN_ZOOM}
              MAX_ZOOM={MAX_ZOOM}
              ZOOM_STEP={ZOOM_STEP}
              setImageZoom={setImageZoom}
            />

            <PosterPreviewPanel
              canvasRef={canvasRef}
              onDownload={downloadPoster}
              onShare={sharePoster}
            />
          </div>
        </div>
      </div>
    </PageBackground>
  );
}

export default CongratulationsPage;
