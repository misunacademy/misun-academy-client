import { Play, RotateCcw } from 'lucide-react';

interface CenterOverlayProps {
  isReady: boolean;
  isPlaying: boolean;
  isEnded: boolean;
  onTogglePlay: () => void;
}

export function CenterOverlay({ isReady, isPlaying, isEnded, onTogglePlay }: CenterOverlayProps) {
  return (
    <>
      {!isPlaying && isReady && (
        <div className="absolute inset-0 z-20 pointer-events-auto"
          style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', background: 'rgba(0,0,0,0.15)', borderRadius: 'inherit' }}
          onClick={onTogglePlay}
        />
      )}

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] scale-100 hover:scale-110 transition-transform duration-300">
            {isEnded
              ? <RotateCcw className="text-white w-6 h-6" />
              : <Play className="fill-white text-white w-6 h-6 ml-1" />
            }
          </div>
        </div>
      )}

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
          <div className="w-8 h-8 border-2 border-white/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
