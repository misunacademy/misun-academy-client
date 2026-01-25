/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

import { useAppSelector } from '@/redux/hooks';
import { useGetEnrollmentsQuery } from '@/redux/api/enrollmentApi';
import { useGetBatchByIdQuery } from '@/redux/api/batchApi';

/* -------------------------------------------------------------------------- */
/*                                  Templates                                 */
/* -------------------------------------------------------------------------- */

const TEMPLATES = [
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
];

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

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

 function CongratulationsPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ------------------------------- User Data -------------------------------- */

  const user = useAppSelector((state) => state.auth.user);

  const { data: enrollmentsData, isLoading } = useGetEnrollmentsQuery(undefined, {
    skip: !user?.id,
  });

  const latestEnrollment =
    enrollmentsData?.data?.find((e) => e.status === 'active') ??
    enrollmentsData?.data?.[0];

  const { data: batchData } = useGetBatchByIdQuery(
    (latestEnrollment?.batchId as any)?._id || '',
    { skip: !latestEnrollment?.batchId }
  );

  /* ------------------------------- State ------------------------------------ */

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [userName, setUserName] = useState(() => user?.name ?? '');
  const [userImage, setUserImage] = useState<string | null>(
    () => user?.image ?? null
  );

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

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

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

  const setZoom = (z: number) => setImageZoom((prev) => clamp(z, MIN_ZOOM, MAX_ZOOM));
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
    (batchData?.data ? `BATCH-${batchData.data.batchNumber}` : '');

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

    const template = TEMPLATES[selectedTemplateIndex];
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
      const { x, y, fontSize, color, bgColor } = config.batch;
      ctx.font = `bold ${fontSize}px Arial`;

      const text = batchNo.toUpperCase();
      const metrics = ctx.measureText(text);

      const paddingX = 30;
      const paddingY = 12;
      const width = metrics.width + paddingX * 2;
      const height = fontSize + paddingY * 2;

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
  }, [selectedTemplateIndex, userImage, userName, batchNo, imageOffset, imageZoom]);

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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="animate-spin text-green-600" />
      </div>
    );
  }

  /* ------------------------------- UI --------------------------------------- */

    return (
        <div className="min-h-screen bg-slate-50 ">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-50 shadow-sm  ">
                <div className="container  px-4 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-slate-800">Enrollment Success</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">

                    {/* Welcome Card */}
                    <Card className="mb-8 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Congratulations, {userName.split(' ')[0]}!</h1>

                            <p className="text-slate-600 max-w-2xl mx-auto">
                                You have successfully enrolled in the <strong>{latestEnrollment?.course?.title || 'Graphic Design with Freelancing'}</strong> course.
                                Download your welcome poster below and share your new journey!
                            </p>

                            {/* Added Email Instruction Section */}
                            <div className="mt-6 bg-white/60 border border-green-200 rounded-lg p-4 inline-block">
                                <p className="text-green-800 font-medium">
                                    📩 Please check your email—there are a few important things for you to do next.
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN: Controls */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* 1. Template Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <LayoutTemplate className="w-4 h-4" />
                                        Choose Template
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    {TEMPLATES.map((template, index) => (
                                        <div
                                            key={template.id}
                                            onClick={() => setSelectedTemplateIndex(index)}
                                            className={`
                                                cursor-pointer rounded-lg border-2 overflow-hidden relative aspect-square transition-all
                                                ${selectedTemplateIndex === index ? 'border-green-600 ring-2 ring-green-100' : 'border-slate-100 hover:border-slate-300'}
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
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Customize Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Student Name</Label>
                                        <Input
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="space-y-2 hidden">
                                        <Label>Batch ID</Label>
                                        <Input
                                            value={batchNo}
                                            // onChange={(e) => setBatchNo(e.target.value)}
                                            readOnly
                                            placeholder="e.g. BATCH-06"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Profile Photo</Label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center">
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

                        {/* RIGHT COLUMN: Preview */}
                        <div className="lg:col-span-7 ">
                            <Card className="h-full border-0 shadow-lg bg-slate-900/5 backdrop-blur-sm sticky top-24 flex items-center justify-center">
                                <CardContent className="p-6">
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-inner mb-6">
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
                                            className="w-full h-12 text-lg"
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