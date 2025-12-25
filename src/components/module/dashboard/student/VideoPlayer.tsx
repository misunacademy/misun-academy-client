import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Convert Google Drive share link to embed link
  const getEmbedUrl = (url: string) => {
    // Handle different Google Drive URL formats
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/) ||
                       url.match(/\/open\?id=([a-zA-Z0-9-_]+)/) ||
                       url.match(/\/d\/([a-zA-Z0-9-_]+)/);

    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }

    // If it's already an embed URL, return as is
    if (url.includes('/preview')) {
      return url;
    }

    // Fallback: try to use the URL as is
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div
      className="relative bg-black rounded-lg overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Custom Controls Overlay (if needed for additional functionality) */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-white/20"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}