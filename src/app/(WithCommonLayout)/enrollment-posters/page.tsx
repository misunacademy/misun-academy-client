/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Download,
  LayoutTemplate,
  Share2,
  Sparkles,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { courseInfo } from '@/constants/enrollment';
import { useAuth } from '@/hooks/useAuth';
import { useGetEnrollmentsQuery } from '@/redux/api/enrollmentApi';
import { useGetBatchByIdQuery } from '@/redux/api/batchApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* -------------------------------------------------------------------------- */
/*                                  Templates                                 */
/* -------------------------------------------------------------------------- */

type PosterTemplate = {
  id: number;
  name: string;
  src: string;
  config: {
    canvasWidth: number;
    canvasHeight: number;
    photo: { x: number; y: number; radius: number };
    name: { x: number; y: number; fontSize: number; color: string };
    batch: {
      x: number;
      y: number;
      fontSize: number;
      color: string;
      bgColor: string;
      minWidth?: number;
      minHeight?: number;
    };
  };
};

const TEMPLATES: Record<'graphic' | 'english', PosterTemplate[]> = {
  "graphic":[

    {
      id: 1,
      name: 'Green Neon Style',
      src: '/posters/templete-1.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540,
          y: 930,
          fontSize: 28,
          color: '#000000',
          bgColor: '#88f400',
        },
      },
    },
    {
      id: 2,
      name: 'Teal Ribbon Style',
      src: '/posters/templete-2.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540,
          y: 930,
          fontSize: 28,
          color: '#000000',
          bgColor: '#00ffb4',
        },
      },
    },
  ],
  "english":[ {
      id: 1,
      name: 'Blue Neon Style',
      src: '/posters/esun1.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540,
          y: 936,
          fontSize: 28,
          color: '#000000',
          bgColor: '#1e90ff',
          minWidth: 220,
          minHeight: 62,
        },
      },
    },
    {
      id: 2,
      name: 'Sky Ribbon Style',
      src: '/posters/esun2.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540,
          y: 936,
          fontSize: 28,
          color: '#000000',
          bgColor: '#38bdf8',
          minWidth: 220,
          minHeight: 62,
        },
      },
    },]
};

/* -------------------------------------------------------------------------- */
/*                               Helper Functions                              */
/* -------------------------------------------------------------------------- */

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const normalizeText = (value?: string | null) =>
  (value || '').toLowerCase().replace(/\s+/g, ' ').trim();

const getCourseType = (title?: string | null): 'graphic' | 'english' | 'general' => {
  const normalized = normalizeText(title);
  if (/(graphic|design|freelancing|photoshop|illustrator)/i.test(normalized)) return 'graphic';
  if (/(english|spoken|ielts|language)/i.test(normalized)) return 'english';
  return 'general';
};

const getBatchNumber = (batchValue?: string | null): number | null => {
  if (!batchValue) return null;
  const match = batchValue.match(/(\d+)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

const getTemplatePriority = (
  courseType: 'graphic' | 'english' | 'general',
  batchNumber: number | null
) => {
  const isEvenBatch = batchNumber !== null ? batchNumber % 2 === 0 : false;

  if (courseType === 'graphic') {
    return isEvenBatch ? [1, 0] : [0, 1];
  }

  if (courseType === 'english') {
    return isEvenBatch ? [0, 1] : [1, 0];
  }

  return isEvenBatch ? [1, 0] : [0, 1];
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));



/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

function CongratulationsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  /* ------------------------------- User Data -------------------------------- */

  const { user, isLoading: isAuthLoading } = useAuth();

  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery(undefined, {
    skip: !user?.id,
  });

  const appCourseType = getCourseType(courseInfo?.title);
  const allEnrollments = enrollmentsData?.data ?? [];
  const activeEnrollments = allEnrollments.filter((e) => e.status === 'active');
  const sourceList = activeEnrollments.length > 0 ? activeEnrollments : allEnrollments;
  const enrollments = Array.isArray(sourceList) ? sourceList : [];

  const latestEnrollment = (() => {
    if (selectedEnrollmentId) {
      const matchedById = sourceList.find((e) => (e as any)?._id === selectedEnrollmentId);
      if (matchedById) return matchedById;
    }

    const matchedByCourse = sourceList.find(
      (e) => getCourseType(e?.course?.title) === appCourseType
    );

    return matchedByCourse ?? sourceList[0];
  })();

  const selectedEnrollment = latestEnrollment as any;
  const courseTitle =
    selectedEnrollment?.batchId?.courseId?.title ||
    selectedEnrollment?.course?.title ||
    selectedEnrollment?.courseId?.title ||
    courseInfo?.title ||
    '';
  const selectedEnrollmentValue = selectedEnrollmentId || selectedEnrollment?._id || undefined;

  const { data: batchData } = useGetBatchByIdQuery(
    (selectedEnrollment?.batchId as any)?._id || selectedEnrollment?.batchId || '',
    { skip: !selectedEnrollment?.batchId }
  );

  /* ------------------------------- State ------------------------------------ */
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  
  // Use user data as initial values, but allow editing
  // Track if user has manually edited to prevent overwriting their changes
  const [userNameState, setUserNameState] = useState<{ value: string; edited: boolean }>({
    value: '',
    edited: false,
  });
  const [userImageState, setUserImageState] = useState<{ value: string | null; edited: boolean }>({
    value: null,
    edited: false,
  });

  // Update from user data only if not manually edited
  const userName = userNameState.edited ? userNameState.value : (user?.name || userNameState.value);
  const userImage = userImageState.edited ? userImageState.value : (user?.image || userImageState.value);

  const setUserName = (value: string) => {
    setUserNameState({ value, edited: true });
  };

  const setUserImage = (value: string | null) => {
    setUserImageState({ value, edited: true });
  };



  // Image pan state: normalized offsets in range [-1, 1]
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  // Zoom state, 1 = fit, >1 = zoom in
  const [imageZoom, setImageZoom] = useState<number>(1);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    pointerId?: number;
  } | null>(null);
  const previewImgRef = useRef<HTMLDivElement | null>(null);

  const moveImage = (dx: number, dy: number) => {
    setImageOffset((prev) => ({
      x: clamp(prev.x + dx, -1, 1),
      y: clamp(prev.y + dy, -1, 1),
    }));
  };

  // Zoom helpers - allow zoom-out (values < 1) so the image can be scaled down inside the circle
  const MIN_ZOOM = 0.5; // 50%
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.1;

  const zoomIn = () => setImageZoom((prev) => clamp(Number((prev + ZOOM_STEP).toFixed(2)), MIN_ZOOM, MAX_ZOOM));
  const zoomOut = () => setImageZoom((prev) => clamp(Number((prev - ZOOM_STEP).toFixed(2)), MIN_ZOOM, MAX_ZOOM));

  const onPreviewPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: imageOffset.x,
      startOffsetY: imageOffset.y,
      pointerId: e.pointerId,
    };
  };

  const onPreviewPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const el = e.currentTarget as HTMLDivElement;
    const dw = el.clientWidth || 1;
    const dh = el.clientHeight || 1;
    const deltaX = dx / dw;
    const deltaY = dy / dh;
    setImageOffset({
      x: clamp(state.startOffsetX + deltaX, -1, 1),
      y: clamp(state.startOffsetY + deltaY, -1, 1),
    });
  };

  const onPreviewPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (state && state.pointerId === e.pointerId) {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      dragStateRef.current = null;
    }
  };

  // Image offset reset is handled directly when a new image is uploaded (avoids synchronous setState in an effect)


  /* ------------------------------ Derived Data ------------------------------ */

  const batchNo =
    batchData?.data?.title ??
    latestEnrollment?.batch?.title ??
    selectedEnrollment?.batchId?.title ??
    (batchData?.data ? `BATCH-${batchData.data.batchNumber}` : '');

  const batchNumber = getBatchNumber(batchNo);
  const selectedCourseType = getCourseType(courseTitle);
  const templatePriority = getTemplatePriority(selectedCourseType, batchNumber);

  const templateGroups: Record<'graphic' | 'english' | 'general', PosterTemplate[]> = {
    graphic: TEMPLATES.graphic,
    english: TEMPLATES.english.length > 0 ? TEMPLATES.english : TEMPLATES.graphic,
    general: TEMPLATES.graphic,
  };

  const activeTemplateGroup = templateGroups[selectedCourseType];

  const courseTemplates = templatePriority
    .map((templateIndex) => activeTemplateGroup[templateIndex])
    .filter(Boolean);

  const resolvedTemplates = courseTemplates.length > 0 ? courseTemplates : activeTemplateGroup;

  /* ----------------------------- Image Upload ------------------------------- */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserImage(event.target?.result as string);
      // Reset pan/offset when a new image is uploaded so it starts centered
      setImageOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  /* ---------------------------- Poster Generator ---------------------------- */

  const generatePoster = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const template =
      resolvedTemplates[selectedTemplateIndex] ||
      resolvedTemplates[0] ||
      TEMPLATES.graphic[0];
    const { config } = template;

    const cssWidth = config.canvasWidth;
    const cssHeight = config.canvasHeight;
    const ratio = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;

    // Use high-DPI canvas scaling so the poster is crisp on retina screens
    canvas.width = Math.round(cssWidth * ratio);
    canvas.height = Math.round(cssHeight * ratio);
    // Make the canvas responsive so it fits inside the parent preview container
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // Prevent upscaling beyond the designed size
    canvas.style.maxWidth = `${cssWidth}px`;

    // Reset and scale the drawing context so subsequent drawing uses CSS pixel coordinates
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    /* Background */
    const bg = new window.Image();
    bg.src = template.src;
    bg.crossOrigin = 'anonymous';

    await new Promise<void>((resolve) => {
      bg.onload = () => {
        // Draw background using object-cover behavior (center-crop) so it doesn't stretch
        const sw = (bg.naturalWidth as number) || (bg.width as number);
        const sh = (bg.naturalHeight as number) || (bg.height as number);
        const srcAspect = sw / sh;
        const destAspect = cssWidth / cssHeight;

        let sx = 0;
        let sy = 0;
        let sWidth = sw;
        let sHeight = sh;

        if (srcAspect > destAspect) {
          // source is wider than destination; crop left/right
          sHeight = sh;
          sWidth = Math.round(sh * destAspect);
          sx = Math.round((sw - sWidth) / 2);
        } else {
          // source is taller than destination; crop top/bottom
          sWidth = sw;
          sHeight = Math.round(sw / destAspect);
          sy = Math.round((sh - sHeight) / 2);
        }

        ctx.drawImage(bg, sx, sy, sWidth, sHeight, 0, 0, cssWidth, cssHeight);
        resolve();
      };
      bg.onerror = () => {
        // If background fails to load, just fill with a neutral color so poster still renders
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, cssWidth, cssHeight);
        resolve();
      };
    });

    /* User Image */
    if (userImage) {
      const img = new window.Image();
      img.src = userImage;
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const { x, y, radius } = config.photo;

          // Crop the source image to a square, but allow panning and zoom using imageOffset and imageZoom
          const sw = (img.naturalWidth as number) || (img.width as number);
          const sh = (img.naturalHeight as number) || (img.height as number);
          const baseSize = Math.min(sw, sh);

          const z = clamp(Number(imageZoom) || 1, MIN_ZOOM, MAX_ZOOM);

          // Two modes:
          // - z >= 1: zoom-in (crop a smaller area from the source and scale to fill the circle)
          // - z < 1: zoom-out (use the base square crop and draw it scaled down into the circle so the subject appears smaller)
          let sSize = baseSize;
          if (z >= 1) {
            sSize = Math.max(1, Math.round(baseSize / z));
          }

          // Max allowed shifts in source coordinates given the current crop size
          const maxShiftX = Math.max(0, (sw - sSize) / 2);
          const maxShiftY = Math.max(0, (sh - sSize) / 2);

          // Compute center point in source using normalized offsets [-1..1]
          const centerX = sw / 2 + imageOffset.x * maxShiftX;
          const centerY = sh / 2 + imageOffset.y * maxShiftY;

          let sx = Math.round(centerX - sSize / 2);
          let sy = Math.round(centerY - sSize / 2);

          // Clamp to valid source rect
          sx = Math.max(0, Math.min(sx, sw - sSize));
          sy = Math.max(0, Math.min(sy, sh - sSize));

          const dx = Math.round(x - radius);
          const dy = Math.round(y - radius);
          const dSize = radius * 2;

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.clip();

          if (z >= 1) {
            // Zoom-in: draw cropped area to fully fill the circle
            ctx.drawImage(img, sx, sy, sSize, sSize, dx, dy, dSize, dSize);
          } else {
            // Zoom-out: draw the full/base crop but scaled down so the subject appears smaller
            const destSize = Math.round(dSize * z);
            const destX = Math.round(x - destSize / 2);
            const destY = Math.round(y - destSize / 2);
            ctx.drawImage(img, sx, sy, sSize, sSize, destX, destY, destSize, destSize);
          }

          ctx.restore();

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 8;
          ctx.stroke();

          resolve();
        };
        img.onerror = () => {
          // If image fails to load for some reason, don't block poster generation
          resolve();
        };
      });
    }

    /* Name */
    if (userName) {
      const { x, y, fontSize, color } = config.name;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(userName, x, y);
    }

    /* Batch */
    if (batchNo) {
      const { x, y, fontSize, color, bgColor, minWidth, minHeight } = config.batch;
      ctx.font = `bold ${fontSize}px Arial`;

      const text = batchNo.toUpperCase();
      const metrics = ctx.measureText(text);

      const paddingX = 30;
      const paddingY = 12;
      const width = Math.max(metrics.width + paddingX * 2, minWidth ?? 0);
      const height = Math.max(fontSize + paddingY * 2, minHeight ?? 0);

      ctx.fillStyle = bgColor;
      drawRoundedRect(
        ctx,
        x - width / 2,
        y - height / 2,
        width,
        height,
        height / 2
      );
      ctx.fill();

      ctx.fillStyle = color;
      ctx.fillText(text, x, y + 2);
    }
  }, [selectedTemplateIndex, userImage, userName, batchNo, imageOffset, imageZoom, resolvedTemplates]);

  /* ---------------------------- Auto Regenerate ----------------------------- */

  useEffect(() => {
    const timer = setTimeout(generatePoster, 100);
    return () => clearTimeout(timer);
  }, [generatePoster]);

  /* ---------------------------- Actions ------------------------------------- */

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `misun-academy-${userName}.png`;
      link.click();
      toast.success('Poster downloaded');
    } catch {
      toast.error('Download failed');
    }
  };

  const sharePoster = async () => {
    if (!canvasRef.current || !navigator.share) {
      toast.info('Sharing not supported');
      return;
    }

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.share({
        title: 'Misun Academy Enrollment',
        files: [new File([blob], 'poster.png', { type: 'image/png' })],
      });
    });
  };


  /* ------------------------------- Loading ---------------------------------- */

  if (isAuthLoading || isEnrollmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040a07]">
        <Sparkles className="animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040a07]">
        <p className="text-red-400">Please log in to view this page</p>
      </div>
    );
  }

  /* ------------------------------- UI --------------------------------------- */

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#040a07]">
      <div
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[620px] h-[280px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[8%] w-[300px] h-[200px] bg-primary/6 rounded-full blur-[90px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Welcome Card */}
          <Card className="mb-8 border-primary/20 bg-[#0a1610]/90 shadow-[0_0_50px_hsl(156_70%_42%/0.08)]">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Congratulations, {userName.split(' ')[0]}!</h1>

              <p className="text-white/75 max-w-2xl mx-auto">
                You have successfully enrolled in the <strong>{courseTitle || 'Graphic Design with Freelancing'}</strong> course.
                Download your welcome poster below and share your new journey!
              </p>

              {/* Added Email Instruction Section */}
              {/* <div className="mt-6 bg-primary/10 border border-primary/30 rounded-lg p-4 inline-block">
                <p className="text-primary font-medium">
                  📩 Please check your email—there are a few important things for you to do next.
                </p>
              </div> */}

            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN: Controls */}
            <div className="lg:col-span-5 space-y-6">

              {/* 1. Template Selection */}
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
                      className={`
                                                cursor-pointer rounded-lg border-2 overflow-hidden relative aspect-square transition-all
                                                ${selectedTemplateIndex === index ? 'border-green-500 ring-2 ring-green-500/30' : 'border-white/10 hover:border-white/30'}
                                            `}
                    >
                      <Image
                        src={template.src}
                        alt={template.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                      {selectedTemplateIndex === index && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 2. Customization */}
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
                          const enrollmentItem = enrollment as any;
                          const title =
                            enrollmentItem?.batchId?.courseId?.title ||
                            enrollmentItem?.course?.title ||
                            enrollmentItem?.courseId?.title ||
                            'Unknown Course';
                          const value = enrollmentItem?._id;
                          if (!value) return null;
                          return (
                            <SelectItem key={value} value={value} className="text-white focus:bg-primary/15 focus:text-white">
                              {title}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Student Name</Label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-[#0d1f12] border-primary/25 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2 hidden">
                    <Label className="text-white/80">Batch ID</Label>
                    <Input
                      value={batchNo}
                      // onChange={(e) => setBatchNo(e.target.value)}
                      readOnly
                      placeholder="e.g. BATCH-06"
                      className="bg-[#0d1f12] border-primary/25 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Profile Photo</Label>
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 hover:bg-primary/5 transition-colors text-center">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
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
                              style={{ touchAction: 'none' }}
                            >
                              <Image
                                src={userImage}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
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
                                    <Button size="sm" variant="ghost" onClick={() => { setImageOffset({ x: 0, y: 0 }); setImageZoom(1); }}>Reset</Button>
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
                                <input
                                  type="range"
                                  min={MIN_ZOOM}
                                  max={MAX_ZOOM}
                                  step={ZOOM_STEP}
                                  value={imageZoom}
                                  onChange={(e) => setImageZoom(Number(e.target.value))}
                                  className="w-40"
                                />
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

            {/* RIGHT COLUMN: Preview */}
            <div className="lg:col-span-7 ">
              <Card className="h-full border border-white/10 shadow-lg bg-[#0a1610]/90 backdrop-blur-sm sticky top-24 flex items-center justify-center">
                <CardContent className="p-6">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#0a1610] border border-white/10 shadow-inner mb-6">
                    {/* This Canvas is where the magic happens */}
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={downloadPoster}
                      className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Poster
                    </Button>
                    <Button
                      onClick={sharePoster}
                      variant="outline"
                      className="w-full h-12 text-lg border-primary/35 text-primary hover:bg-primary/10"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
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
};

export default CongratulationsPage;