"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { TEMPLATES, type PosterTemplate } from "@/constants/posterTemplates";
import { drawRoundedRect, clamp } from "@/utils/posterHelpers";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

function generatePoster(
  canvas: HTMLCanvasElement,
  resolvedTemplates: PosterTemplate[],
  selectedTemplateIndex: number,
  userImage: string | null,
  userName: string,
  batchNo: string,
  imageOffset: { x: number; y: number },
  imageZoom: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const template =
    resolvedTemplates[selectedTemplateIndex] ||
    resolvedTemplates[0] ||
    TEMPLATES.graphic[0];
  const { config } = template;

  const cssWidth = config.canvasWidth;
  const cssHeight = config.canvasHeight;
  const ratio =
    typeof window !== "undefined" && window.devicePixelRatio
      ? window.devicePixelRatio
      : 1;

  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = `${cssWidth}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  return new Promise<void>((resolve) => {
    const bg = new window.Image();
    bg.src = template.src;
    bg.crossOrigin = "anonymous";

    bg.onload = () => {
      const sw = bg.naturalWidth || bg.width;
      const sh = bg.naturalHeight || bg.height;
      const srcAspect = sw / sh;
      const destAspect = cssWidth / cssHeight;

      let sx = 0, sy = 0, sWidth = sw, sHeight = sh;

      if (srcAspect > destAspect) {
        sHeight = sh;
        sWidth = Math.round(sh * destAspect);
        sx = Math.round((sw - sWidth) / 2);
      } else {
        sWidth = sw;
        sHeight = Math.round(sw / destAspect);
        sy = Math.round((sh - sHeight) / 2);
      }

      ctx.drawImage(bg, sx, sy, sWidth, sHeight, 0, 0, cssWidth, cssHeight);

      drawUserImage(ctx, config, userImage, imageOffset, imageZoom).then(() => {
        drawName(ctx, config, userName);
        drawBatch(ctx, config, batchNo);
        resolve();
      });
    };

    bg.onerror = () => {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, cssWidth, cssHeight);
      resolve();
    };
  });
}

function drawUserImage(
  ctx: CanvasRenderingContext2D,
  config: PosterTemplate["config"],
  userImage: string | null,
  imageOffset: { x: number; y: number },
  imageZoom: number,
) {
  if (!userImage) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const img = new window.Image();
    img.src = userImage;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const { x, y, radius } = config.photo;
      const sw = img.naturalWidth || img.width;
      const sh = img.naturalHeight || img.height;
      const baseSize = Math.min(sw, sh);
      const z = clamp(imageZoom || 1, MIN_ZOOM, MAX_ZOOM);
      const sSize = z >= 1 ? Math.max(1, Math.round(baseSize / z)) : baseSize;

      const maxShiftX = Math.max(0, (sw - sSize) / 2);
      const maxShiftY = Math.max(0, (sh - sSize) / 2);
      const centerX = sw / 2 + imageOffset.x * maxShiftX;
      const centerY = sh / 2 + imageOffset.y * maxShiftY;

      let sx = Math.round(centerX - sSize / 2);
      let sy = Math.round(centerY - sSize / 2);
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
        ctx.drawImage(img, sx, sy, sSize, sSize, dx, dy, dSize, dSize);
      } else {
        const destSize = Math.round(dSize * z);
        const destX = Math.round(x - destSize / 2);
        const destY = Math.round(y - destSize / 2);
        ctx.drawImage(img, sx, sy, sSize, sSize, destX, destY, destSize, destSize);
      }

      ctx.restore();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 8;
      ctx.stroke();

      resolve();
    };

    img.onerror = () => resolve();
  });
}

function drawName(
  ctx: CanvasRenderingContext2D,
  config: PosterTemplate["config"],
  userName: string,
) {
  if (!userName) return;
  const { x, y, fontSize, color } = config.name;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(userName, x, y);
}

function drawBatch(
  ctx: CanvasRenderingContext2D,
  config: PosterTemplate["config"],
  batchNo: string,
) {
  if (!batchNo) return;
  const { x, y, fontSize, color, bgColor, minWidth, minHeight } = config.batch;
  ctx.font = `bold ${fontSize}px Arial`;

  const text = batchNo.toUpperCase();
  const metrics = ctx.measureText(text);
  const paddingX = 30;
  const paddingY = 12;
  const width = Math.max(metrics.width + paddingX * 2, minWidth ?? 0);
  const height = Math.max(fontSize + paddingY * 2, minHeight ?? 0);

  ctx.fillStyle = bgColor;
  drawRoundedRect(ctx, x - width / 2, y - height / 2, width, height, height / 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.fillText(text, x, y + 2);
}

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
      canvas,
      resolvedTemplates,
      selectedTemplateIndex,
      userImage,
      userName,
      batchNo,
      imageOffset,
      imageZoom,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canvasRef,
    resolvedTemplates,
    selectedTemplateIndex,
    userImage,
    userName,
    batchNo,
    imageOffset.x,
    imageOffset.y,
    imageZoom,
  ]);

  useEffect(() => {
    const timer = setTimeout(generate, 100);
    return () => clearTimeout(timer);
  }, [generate]);

  return { regenerate: generate };
}
