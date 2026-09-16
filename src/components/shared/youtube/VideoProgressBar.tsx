interface VideoProgressBarProps {
  progress: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function VideoProgressBar({ progress, onSeek }: VideoProgressBarProps) {
  return (
    <div
      className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group/prog relative"
      onClick={onSeek}
      role="slider"
      aria-label="Seek"
      aria-valuenow={Math.round(progress)}
      tabIndex={0}
    >
      <div className="h-full bg-red-500 rounded-full transition-all relative" style={{ width: `${progress}%` }}>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/prog:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
