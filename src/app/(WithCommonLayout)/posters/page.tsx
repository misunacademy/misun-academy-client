// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { CheckCircle2, Download, Share2, Upload, ArrowLeft, Sparkles, LayoutTemplate } from 'lucide-react';
// import { toast } from 'sonner';
// import Image from 'next/image';
// import { useAppSelector } from '@/redux/hooks';
// import { useGetEnrollmentsQuery } from '@/redux/api/enrollmentApi';
// import { useGetBatchByIdQuery } from '@/redux/api/batchApi';

// // --- CONFIGURATION ---
// // 1. Place your images in the public folder
// // 2. Adjust 'config' coordinates if the text/image isn't perfectly aligned
// // --- CONFIGURATION ---
// const TEMPLATES = [
//     {
//         id: 1,
//         name: 'Green Neon Style',
//         src: '/posters/templete-1.png', // Update to match your actual file name
//         config: {
//             canvasWidth: 1080,
//             canvasHeight: 1080,
//             // Increased radius to 235 to fill the white circle template
//             photo: { x: 535, y: 578, radius: 155 },
//             // Moved name up slightly to Y=820
//             name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
//             // Moved batch up to Y=930 and matched the Green color
//             batch: { x: 540, y: 930, fontSize: 28, color: '#000000', bgColor: '#88f400' }
//         }
//     },
//     {
//         id: 2,
//         name: 'Teal Ribbon Style',
//         src: '/posters/templete-2.png', // Update to match your actual file name
//         config: {
//             canvasWidth: 1080,
//             canvasHeight: 1080,
//             photo: { x: 535, y: 578, radius: 155 },
//             name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
//             // Teal color for the second template
//             batch: { x: 540, y: 930, fontSize: 28, color: '#000000', bgColor: '#00ffb4' }
//         }
//     }
// ];

// const CongratulationsPage = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const userInitializedRef = useRef(false);
//     const batchInitializedRef = useRef(false);
//     // State
//     const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
//     const [userImage, setUserImage] = useState<string | null>(null);
//     const [userName, setUserName] = useState('');
//     const [batchNo, setBatchNo] = useState('');
//     // Get user data from Redux
//     const user = useAppSelector((state) => state.auth.user);

//     // Fetch enrollments
//     const { data: enrollmentsData, isLoading: enrollmentsLoading } = useGetEnrollmentsQuery(undefined, {
//         skip: !user?.id,
//     });

//     // Get the latest active enrollment
//     const latestEnrollment = enrollmentsData?.data?.find(enrollment => enrollment.status === 'active') || enrollmentsData?.data?.[0];


//     // Fetch batch details if we have an enrollment
//     const { data: batchData } = useGetBatchByIdQuery((latestEnrollment?.batchId as any)?._id || '', {
//         skip: !latestEnrollment?.batchId,
//     });



//     // Initialize user data when available (only once)
//     useEffect(() => {
//         if (user && !userInitializedRef.current) {
//             setUserName(user.name || '');
//             if (user.image) {
//                 setUserImage(user.image);
//             }
//             userInitializedRef.current = true;
//         }
//     }, [user]);

//     // Initialize batch data when available (only once)
//     useEffect(() => {
//         if ((batchData?.data || latestEnrollment?.batch?.title) && !batchInitializedRef.current) {
//             if (batchData?.data) {
//                 setBatchNo(batchData.data.title || `BATCH-${batchData.data.batchNumber}`);
//             } else if (latestEnrollment?.batch?.title) {
//                 setBatchNo(latestEnrollment.batch.title);
//             }
//             batchInitializedRef.current = true;
//         }
//     }, [batchData, latestEnrollment]);

//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setUserImage(e.target?.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Helper to draw rounded rectangle
//     const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
//         ctx.beginPath();
//         ctx.moveTo(x + radius, y);
//         ctx.lineTo(x + width - radius, y);
//         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//         ctx.lineTo(x + width, y + height - radius);
//         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//         ctx.lineTo(x + radius, y + height);
//         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//         ctx.lineTo(x, y + radius);
//         ctx.quadraticCurveTo(x, y, x + radius, y);
//         ctx.closePath();
//     };

//     const generatePoster = async () => {
//         if (!canvasRef.current) return;

//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         const currentTemplate = TEMPLATES[selectedTemplateIndex];
//         const { config } = currentTemplate;

//         // 1. Set Canvas Size
//         canvas.width = config.canvasWidth;
//         canvas.height = config.canvasHeight;

//         // 2. Load and Draw Template Background
//         const templateImg = new window.Image();
//         templateImg.src = currentTemplate.src;
//         templateImg.crossOrigin = "anonymous";

//         await new Promise<void>((resolve) => {
//             templateImg.onload = () => {
//                 ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
//                 resolve();
//             };
//             templateImg.onerror = () => {
//                 console.error("Failed to load template image");
//                 resolve();
//             };
//         });


//         // 3. Draw User Image (Circular with White Border)
//         if (userImage) {
//             const img = new window.Image();
//             // This allows the browser to export the image even if the source is external
//             img.crossOrigin = "anonymous";
//             img.src = userImage;
//             await new Promise<void>((resolve) => {
//                 img.onload = () => {
//                     const { x, y, radius } = config.photo;

//                     ctx.save();

//                     // A. Define the clipping path
//                     ctx.beginPath();
//                     ctx.arc(x, y, radius, 0, Math.PI * 2);
//                     ctx.closePath();
//                     ctx.clip(); // Restrict drawing to this circle

//                     // B. Draw image centered in the circle
//                     // Draw slightly larger (+1px) to ensure no sub-pixel gaps
//                     ctx.drawImage(img, x - radius - 1, y - radius - 1, (radius * 2) + 2, (radius * 2) + 2);

//                     // C. --- ADD WHITE BORDER ---
//                     // We must redefine the path because ctx.clip() consumed the previous one.
//                     ctx.beginPath();
//                     ctx.arc(x, y, radius, 0, Math.PI * 2);
//                     ctx.closePath();

//                     // Border styles
//                     ctx.lineWidth = 8; // Adjust thickness here (e.g., 6, 8, 10)
//                     ctx.strokeStyle = '#FFFFFF'; // White color
//                     ctx.stroke(); // Draw the border
//                     // ---------------------------

//                     ctx.restore();
//                     resolve();
//                 };
//             });
//         }
//         // 4. Draw Name
//         if (userName) {
//             const { x, y, fontSize, color } = config.name;
//             ctx.fillStyle = color;
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'middle';
//             ctx.font = `bold ${fontSize}px Arial, sans-serif`;

//             // Subtle shadow for better readability
//             ctx.shadowColor = 'rgba(0,0,0,0.3)';
//             ctx.shadowBlur = 4;
//             ctx.shadowOffsetY = 2;

//             ctx.fillText(userName, x, y);

//             // Reset shadow
//             ctx.shadowColor = 'transparent';
//             ctx.shadowBlur = 0;
//             ctx.shadowOffsetY = 0;
//         }

//         // 5. Draw Batch Number (Pill Badge Style)
//         if (batchNo) {
//             const { x, y, fontSize, color, bgColor } = config.batch;
//             ctx.font = `bold ${fontSize}px Arial, sans-serif`;
//             const text = batchNo.toUpperCase();
//             const metrics = ctx.measureText(text);

//             // Adjust padding to make it look like a pill
//             const paddingX = 30;
//             const paddingY = 12;
//             const bgWidth = metrics.width + (paddingX * 2);
//             const bgHeight = fontSize + (paddingY * 2);
//             const cornerRadius = bgHeight / 2; // This makes it a perfect pill shape

//             // Draw Badge Background
//             ctx.fillStyle = bgColor;
//             drawRoundedRect(
//                 ctx,
//                 x - (bgWidth / 2),
//                 y - (bgHeight / 2),
//                 bgWidth,
//                 bgHeight,
//                 cornerRadius
//             );
//             ctx.fill();

//             // Draw Badge Text
//             ctx.fillStyle = color;
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'middle';
//             // Slight Y adjustment to optically center the text in the pill
//             ctx.fillText(text, x, y + 2);
//         }
//     };

//     const downloadPoster = () => {
//         if (!canvasRef.current) return;

//         try {
//             // Attempt to get the data URL
//             const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);

//             const link = document.createElement('a');
//             link.download = `misun-academy-welcome-${userName.replace(/\s+/g, '-').toLowerCase()}.png`;
//             link.href = dataUrl;

//             // Append to body (required for Firefox), click, then remove
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             toast.success('Poster downloaded!');
//         } catch (error) {
//             console.error("Canvas Export Error:", error);
//             toast.error("Could not download. This is likely a security restriction with your profile photo.");
//         }
//     };

//     const sharePoster = async () => {
//         if (!canvasRef.current) return;
//         try {
//             const blob = await new Promise<Blob>((resolve) => {
//                 canvasRef.current!.toBlob((blob) => {
//                     resolve(blob!);
//                 });
//             });

//             if (navigator.share) {
//                 await navigator.share({
//                     title: 'My Misun Academy Enrollment',
//                     text: `I'm excited to join Misun Academy!`,
//                     files: [new File([blob], 'poster.png', { type: 'image/png' })],
//                 });
//             } else {
//                 toast.info('Share feature not supported on this device');
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error('Failed to share poster');
//         }
//     };

//     useEffect(() => {
//         // Debounce generation slightly to prevent flickering on fast typing
//         const timer = setTimeout(() => {
//             if (canvasRef.current) {
//                 generatePoster();
//             }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [userImage, userName, batchNo, selectedTemplateIndex]);

//     // Show loading state while fetching data
//     if (enrollmentsLoading || !user) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Sparkles className="w-8 h-8 text-green-600 animate-spin" />
//                     </div>
//                     <p className="text-slate-600">Loading your enrollment details...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50">
//             {/* Header */}
//             <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
//                 <div className="container mx-auto px-4 py-4">
//                     <div className="flex items-center gap-4">
//                         <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
//                             <ArrowLeft className="w-4 h-4 mr-2" />
//                             Back
//                         </Button>
//                         <div className="flex items-center gap-2">
//                             <Sparkles className="w-5 h-5 text-green-600" />
//                             <span className="font-semibold text-slate-800">Enrollment Success</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="container mx-auto px-4 py-8">
//                 <div className="max-w-6xl mx-auto">

//                     {/* Welcome Card */}
//                     <Card className="mb-8 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
//                         <CardContent className="p-8 text-center">
//                             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <CheckCircle2 className="w-8 h-8 text-green-600" />
//                             </div>
//                             <h1 className="text-3xl font-bold text-slate-900 mb-2">Congratulations, {userName.split(' ')[0]}!</h1>

//                             <p className="text-slate-600 max-w-2xl mx-auto">
//                                 You have successfully enrolled in the <strong>{latestEnrollment?.course?.title || 'Graphic Design with Freelancing'}</strong> course.
//                                 Download your welcome poster below and share your new journey!
//                             </p>

//                             {/* Added Email Instruction Section */}
//                             <div className="mt-6 bg-white/60 border border-green-200 rounded-lg p-4 inline-block">
//                                 <p className="text-green-800 font-medium">
//                                     📩 Please check your email—there are a few important things for you to do next.
//                                 </p>
//                             </div>

//                         </CardContent>
//                     </Card>

//                     <div className="grid lg:grid-cols-12 gap-8">

//                         {/* LEFT COLUMN: Controls */}
//                         <div className="lg:col-span-5 space-y-6">

//                             {/* 1. Template Selection */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="text-lg flex items-center gap-2">
//                                         <LayoutTemplate className="w-4 h-4" />
//                                         Choose Template
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="grid grid-cols-2 gap-4">
//                                     {TEMPLATES.map((template, index) => (
//                                         <div
//                                             key={template.id}
//                                             onClick={() => setSelectedTemplateIndex(index)}
//                                             className={`
//                                                 cursor-pointer rounded-lg border-2 overflow-hidden relative aspect-square transition-all
//                                                 ${selectedTemplateIndex === index ? 'border-green-600 ring-2 ring-green-100' : 'border-slate-100 hover:border-slate-300'}
//                                             `}
//                                         >
//                                             <Image
//                                                 src={template.src}
//                                                 alt={template.name}
//                                                 width={100}
//                                                 height={100}
//                                                 className="w-full h-full object-cover"
//                                             />
//                                             {selectedTemplateIndex === index && (
//                                                 <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
//                                                     <CheckCircle2 className="w-3 h-3" />
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </CardContent>
//                             </Card>

//                             {/* 2. Customization */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="text-lg">Customize Details</CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-4">
//                                     <div className="space-y-2">
//                                         <Label>Student Name</Label>
//                                         <Input
//                                             value={userName}
//                                             onChange={(e) => setUserName(e.target.value)}
//                                             placeholder="Enter your full name"
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label>Batch ID</Label>
//                                         <Input
//                                             value={batchNo}
//                                             onChange={(e) => setBatchNo(e.target.value)}
//                                             readOnly
//                                             placeholder="e.g. BATCH-06"
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label>Profile Photo</Label>
//                                         <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center">
//                                             <input
//                                                 type="file"
//                                                 id="image-upload"
//                                                 accept="image/*"
//                                                 onChange={handleImageUpload}
//                                                 className="hidden"
//                                             />
//                                             <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
//                                                 {userImage ? (
//                                                     <div className="relative w-24 h-24 mx-auto">
//                                                         <Image
//                                                             src={userImage}
//                                                             alt="Preview"
//                                                             fill
//                                                             className="rounded-full object-cover border-4 border-white shadow-sm"
//                                                         />
//                                                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
//                                                             <Upload className="w-6 h-6 text-white" />
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     <div>
//                                                         <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
//                                                             <Upload className="w-6 h-6" />
//                                                         </div>
//                                                         <span className="text-sm font-medium text-slate-600">Click to upload photo</span>
//                                                     </div>
//                                                 )}
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* RIGHT COLUMN: Preview */}
//                         <div className="lg:col-span-7">
//                             <Card className="h-full border-0 shadow-lg bg-slate-900/5 backdrop-blur-sm sticky top-24">
//                                 <CardContent className="p-6">
//                                     <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-inner mb-6">
//                                         {/* This Canvas is where the magic happens */}
//                                         <canvas
//                                             ref={canvasRef}
//                                             className="w-full h-full object-contain"
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-4">
//                                         <Button
//                                             onClick={downloadPoster}
//                                             className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
//                                         >
//                                             <Download className="w-5 h-5 mr-2" />
//                                             Download Poster
//                                         </Button>
//                                         <Button
//                                             onClick={sharePoster}
//                                             variant="outline"
//                                             className="w-full h-12 text-lg"
//                                         >
//                                             <Share2 className="w-5 h-5 mr-2" />
//                                             Share
//                                         </Button>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CongratulationsPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  LayoutTemplate,
  Share2,
  Sparkles,
  Upload,
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

    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;

    /* Background */
    const bg = new window.Image();
    bg.src = template.src;
    bg.crossOrigin = 'anonymous';

    await new Promise<void>((resolve) => {
      bg.onload = () => {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
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

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.clip();

          ctx.drawImage(
            img,
            x - radius,
            y - radius,
            radius * 2,
            radius * 2
          );

          ctx.restore();

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 8;
          ctx.stroke();

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
  }, [selectedTemplateIndex, userImage, userName, batchNo]);

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

                                    <div className="space-y-2">
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
                                                    <div className="relative w-24 h-24 mx-auto">
                                                        <Image
                                                            src={userImage}
                                                            alt="Preview"
                                                            fill
                                                            className="rounded-full object-cover border-4 border-white shadow-sm"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                                                            <Upload className="w-6 h-6 text-white" />
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
                        <div className="lg:col-span-7">
                            <Card className="h-full border-0 shadow-lg bg-slate-900/5 backdrop-blur-sm sticky top-24">
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