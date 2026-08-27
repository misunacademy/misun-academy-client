'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    Download,
    ImageIcon,
    Move,
    RotateCcw,
    Share2,
    Upload,
} from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import frameImage from '@/assets/boocamp/frame.png';
import { posterStudio } from './bootcampData';

const CANVAS_SIZE = 1600;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface PhotoState {
    element: HTMLImageElement;
    objectUrl: string;
}

export const PosterStudio = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameImgRef = useRef<HTMLImageElement | null>(null);
    const photoRef = useRef<PhotoState | null>(null);
    const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
    const pendingDeltaRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);

    const [frameReady, setFrameReady] = useState(false);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isDropActive, setIsDropActive] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        img.src = frameImage.src;
        img.onload = () => {
            frameImgRef.current = img;
            setFrameReady(true);
        };
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const frame = frameImgRef.current;
        if (!canvas || !frame) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#0a0a0b';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const photo = photoRef.current;
        if (photo) {
            const scale =
                Math.max(CANVAS_SIZE / photo.element.width, CANVAS_SIZE / photo.element.height) *
                zoom;
            const drawWidth = photo.element.width * scale;
            const drawHeight = photo.element.height * scale;
            const maxOffsetX = (drawWidth - CANVAS_SIZE) / 2 / CANVAS_SIZE;
            const maxOffsetY = (drawHeight - CANVAS_SIZE) / 2 / CANVAS_SIZE;
            const clampedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offset.x));
            const clampedY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offset.y));
            const dx = (CANVAS_SIZE - drawWidth) / 2 + clampedX * CANVAS_SIZE;
            const dy = (CANVAS_SIZE - drawHeight) / 2 + clampedY * CANVAS_SIZE;
            ctx.drawImage(photo.element, dx, dy, drawWidth, drawHeight);
        }

        ctx.drawImage(frame, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }, [offset, zoom]);

    useEffect(() => {
        if (frameReady) draw();
    }, [frameReady, draw]);

    const loadPhotoFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('শুধু ছবি ফাইল আপলোড করা যাবে');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error('ছবির সাইজ ১০MB-এর কম হতে হবে');
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
            if (photoRef.current) URL.revokeObjectURL(photoRef.current.objectUrl);
            photoRef.current = { element: img, objectUrl };
            setOffset({ x: 0, y: -0.15 });
            setZoom(1);
            setHasPhoto(true);
            draw();
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            toast.error('ছবিটি লোড করা যায়নি');
        };
        img.src = objectUrl;
    }, [draw]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) loadPhotoFile(file);
        event.target.value = '';
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!photoRef.current) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
        setIsDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const sensitivity = 1.6;
        pendingDeltaRef.current.x += ((event.clientX - drag.x) / rect.width) * sensitivity;
        pendingDeltaRef.current.y += ((event.clientY - drag.y) / rect.height) * sensitivity;
        dragRef.current = { pointerId: drag.pointerId, x: event.clientX, y: event.clientY };

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                const delta = pendingDeltaRef.current;
                pendingDeltaRef.current = { x: 0, y: 0 };
                setOffset((prev) => ({ x: prev.x + delta.x, y: prev.y + delta.y }));
            });
        }
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId === event.pointerId) {
            dragRef.current = null;
            setIsDragging(false);
        }
    };

    useEffect(
        () => () => {
            if (photoRef.current) URL.revokeObjectURL(photoRef.current.objectUrl);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        },
        []
    );

    const exportBlob = (): Promise<Blob | null> =>
        new Promise((resolve) => {
            const canvas = canvasRef.current;
            if (!canvas) return resolve(null);
            canvas.toBlob((blob) => resolve(blob), 'image/png');
        });

    const handleDownload = async () => {
        if (!photoRef.current) return;
        const blob = await exportBlob();
        if (!blob) {
            toast.error('পোস্টার তৈরি করা যায়নি');
            return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'paracetamol-for-photoshop-poster.png';
        link.click();
        URL.revokeObjectURL(url);
        toast.success('পোস্টার ডাউনলোড হয়েছে');
    };

    const handleShare = async () => {
        if (!photoRef.current) return;
        const blob = await exportBlob();
        if (!blob) {
            toast.error('পোস্টার তৈরি করা যায়নি');
            return;
        }
        const file = new File([blob], 'paracetamol-for-photoshop-poster.png', {
            type: 'image/png',
        });
        if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Paracetamol For Photoshop Season 2.0',
                    text: posterStudio.shareText,
                });
            } catch {
                /* user cancelled the share sheet */
            }
        } else {
            await handleDownload();
            toast.info('শেয়ার সাপোর্ট নেই — পোস্টারটি ডাউনলোড হয়েছে');
        }
    };

    const inputId = 'bootcamp-poster-upload';

    return (
        <section className="border-y border-white/10 bg-[#0a0a0b] py-14 text-white">
            <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
                <FadeIn>
                    <p className="font-mona text-xs font-bold uppercase tracking-[0.3em] text-[#ffd60a]">
                        {posterStudio.eyebrow}
                    </p>
                    <h2 className="mt-2 font-bangla text-2xl font-bold sm:text-3xl">
                        {posterStudio.title}
                    </h2>
                    <p className="mt-3 font-bangla text-sm leading-relaxed text-white/60">
                        {posterStudio.description}
                    </p>

                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={posterStudio.dropzoneLabel}
                        onClick={() => document.getElementById(inputId)?.click()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                document.getElementById(inputId)?.click();
                            }
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDropActive(true);
                        }}
                        onDragLeave={() => setIsDropActive(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDropActive(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) loadPhotoFile(file);
                        }}
                        className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd60a] ${
                            isDropActive
                                ? 'border-[#ffd60a] bg-[#ffd60a]/10'
                                : 'border-white/20 bg-white/[0.03] hover:border-[#ffd60a]/50'
                        }`}
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd60a]/15 text-[#ffd60a]">
                            <Upload className="h-5 w-5" />
                        </span>
                        <span className="font-bangla text-sm font-semibold">
                            {posterStudio.dropzoneLabel}
                        </span>
                        <span className="font-bangla text-xs text-white/45">
                            {posterStudio.dropzoneHint}
                        </span>
                    </div>
                    <input
                        id={inputId}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                    />

                    {hasPhoto && (
                        <>
                            <div className="mt-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Move aria-hidden className="h-4 w-4 shrink-0 text-[#ffd60a]" />
                                    <p className="font-bangla text-xs text-white/55">
                                        {posterStudio.repositionHint}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label
                                        htmlFor="bootcamp-poster-zoom"
                                        className="w-16 shrink-0 font-bangla text-xs text-white/55"
                                    >
                                        {posterStudio.zoomLabel}
                                    </label>
                                    <input
                                        id="bootcamp-poster-zoom"
                                        type="range"
                                        min={1}
                                        max={2.5}
                                        step={0.05}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full accent-[#ffd60a]"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <label
                                    htmlFor={inputId}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 font-bangla text-sm font-semibold text-white/80 transition-colors hover:border-[#ffd60a]/50 hover:text-white"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    {posterStudio.changePhoto}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOffset({ x: 0, y: -0.15 });
                                        setZoom(1);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 font-bangla text-sm font-semibold text-white/80 transition-colors hover:border-[#ffd60a]/50 hover:text-white"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    {posterStudio.reset}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#ffd60a] px-4 py-2.5 font-bangla text-sm font-bold text-black transition-transform hover:scale-[1.02]"
                                >
                                    <Download className="h-4 w-4" />
                                    {posterStudio.download}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#ffd60a]/40 bg-[#ffd60a]/10 px-4 py-2.5 font-bangla text-sm font-bold text-[#ffd60a] transition-colors hover:bg-[#ffd60a]/20"
                                >
                                    <Share2 className="h-4 w-4" />
                                    {posterStudio.share}
                                </button>
                            </div>
                        </>
                    )}

                    <p className="mt-5 font-bangla text-xs text-white/40">
                        {posterStudio.privacyNote}
                    </p>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="mx-auto w-full max-w-md lg:max-w-none">
                        <div
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${
                                hasPhoto ? 'cursor-grab touch-none' : ''
                            } ${isDragging ? 'cursor-grabbing' : ''}`}
                        >
                            <canvas
                                ref={canvasRef}
                                width={CANVAS_SIZE}
                                height={CANVAS_SIZE}
                                aria-label="বুটক্যাম্প পোস্টার প্রিভিউ"
                                role="img"
                                className="block h-auto w-full select-none"
                            />
                            {!hasPhoto && (
                                <div className="pointer-events-none absolute inset-x-8 top-[16%] flex h-1/2 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/25 bg-black/30 text-center backdrop-blur-[2px]">
                                    <ImageIcon className="h-8 w-8 text-white/50" />
                                    <p className="mt-3 font-bangla text-sm text-white/60">
                                        আপনার ছবি এখানে দেখা যাবে
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
