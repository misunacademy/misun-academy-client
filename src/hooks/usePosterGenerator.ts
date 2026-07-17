"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { generatePoster } from "@/utils/posterRenderer";
import type { PosterTemplate } from "@/constants/posterTemplates";

export function usePosterGenerator(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  resolvedTemplates: PosterTemplate[],
  selectedTemplateIndex: number,
  userImage: string | null,
  userName: string,
  batchNo: string,
  imageOffset: { x: number; y: number },
  imageZoom: number,
) {
  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    void generatePoster(
      canvas, resolvedTemplates, selectedTemplateIndex,
      userImage, userName, batchNo, imageOffset, imageZoom,
    );
  }, [canvasRef, resolvedTemplates, selectedTemplateIndex, userImage, userName, batchNo, imageOffset, imageZoom]);

  useEffect(() => {
    const timer = setTimeout(generate, 100);
    return () => clearTimeout(timer);
  }, [generate]);

  return { regenerate: generate };
}
