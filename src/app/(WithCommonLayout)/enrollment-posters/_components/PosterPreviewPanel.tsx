"use client";

import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PosterPreviewPanelProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onDownload: () => void;
  onShare: () => void;
}

export default function PosterPreviewPanel({ canvasRef, onDownload, onShare }: PosterPreviewPanelProps) {
  return (
    <div className="lg:col-span-7">
      <Card className="h-full border-primary/20 bg-surface-darker/80 text-white shadow-[0_0_60px_hsl(156_70%_42%/0.08)] backdrop-blur-sm lg:sticky lg:top-24">
        <CardContent className="p-5 sm:p-6">
          <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner">
            <canvas ref={canvasRef} className="h-full w-full object-contain" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={onDownload} className="h-11 w-full font-semibold">
              <Download className="mr-2 h-5 w-5" />Download Poster
            </Button>
            <Button onClick={onShare} variant="outline" className="h-11 w-full border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white">
              <Share2 className="mr-2 h-5 w-5" />Share
            </Button>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-white/35">
            Tip: drag your photo in the preview circle to reposition it before downloading.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
