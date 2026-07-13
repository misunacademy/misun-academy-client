"use client";

import { useState, useRef } from "react";
import { clamp } from "@/utils/posterHelpers";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export function useImageEditor() {
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [imageZoom, setImageZoom] = useState(1);

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

  const zoomIn = () =>
    setImageZoom((prev) => clamp(Number((prev + ZOOM_STEP).toFixed(2)), MIN_ZOOM, MAX_ZOOM));

  const zoomOut = () =>
    setImageZoom((prev) => clamp(Number((prev - ZOOM_STEP).toFixed(2)), MIN_ZOOM, MAX_ZOOM));

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
    setImageOffset({
      x: clamp(state.startOffsetX + dx / dw, -1, 1),
      y: clamp(state.startOffsetY + dy / dh, -1, 1),
    });
  };

  const onPreviewPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (state && state.pointerId === e.pointerId) {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      dragStateRef.current = null;
    }
  };

  const resetImage = () => {
    setImageOffset({ x: 0, y: 0 });
    setImageZoom(1);
  };

  return {
    imageOffset,
    imageZoom,
    previewImgRef,
    setImageOffset,
    setImageZoom,
    moveImage,
    zoomIn,
    zoomOut,
    onPreviewPointerDown,
    onPreviewPointerMove,
    onPreviewPointerUp,
    resetImage,
    MIN_ZOOM,
    MAX_ZOOM,
    ZOOM_STEP,
  };
}
