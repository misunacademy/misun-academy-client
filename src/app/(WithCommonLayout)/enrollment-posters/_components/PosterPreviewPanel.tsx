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
      <Card className="h-full border border-white/10 shadow-lg bg-[#0a1610]/90 backdrop-blur-sm sticky top-24 flex items-center justify-center">
        <CardContent className="p-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#0a1610] border border-white/10 shadow-inner mb-6">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={onDownload} className="w-full bg-green-600 hover:bg-green-700 sm:h-12 sm:text-lg">
              <Download className="w-5 h-5 mr-2" />Download Poster
            </Button>
            <Button onClick={onShare} variant="outline" className="w-full sm:h-12 sm:text-lg border-primary/35 text-primary hover:bg-primary/10">
              <Share2 className="w-5 h-5 mr-2" />Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
