import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Minus, Plus } from 'lucide-react';
import { formatTime, formatQualityLabel } from '@/lib/youtube/utils';
import type { YouTubePlayerState } from '@/types/youtube';
import { VideoProgressBar } from './VideoProgressBar';

interface VideoControlsProps {
  state: YouTubePlayerState;
  onTogglePlay: () => void;
  onToggleMute: (e: React.MouseEvent) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onPlaybackRateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onQualityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFullscreen: (e: React.MouseEvent) => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function VideoControls({
  state, onTogglePlay, onToggleMute, onVolumeChange, onVolumeUp, onVolumeDown,
  onPlaybackRateChange, onQualityChange, onFullscreen, onSeek,
}: VideoControlsProps) {
  return (
    <div className={`relative z-30 bg-linear-to-t from-black/90 via-black/40 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300 ${state.showControls ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <VideoProgressBar progress={state.progress} onSeek={onSeek} />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
            className="text-white hover:text-red-400 transition-colors"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
          </button>

          <button onClick={onToggleMute}
            className="text-white hover:text-red-400 transition-colors"
            aria-label={state.isMuted ? 'Unmute' : 'Mute'}
          >
            {state.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={onVolumeDown}
              className="text-white/80 hover:text-red-400 transition-colors"
              aria-label="Decrease volume"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input type="range" min={0} max={100} value={state.volume} onChange={onVolumeChange}
              className="w-20 accent-red-500 cursor-pointer" aria-label="Volume"
            />
            <button onClick={onVolumeUp}
              className="text-white/80 hover:text-red-400 transition-colors"
              aria-label="Increase volume"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-white/70 text-xs tabular-nums">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <select value={state.qualityLevel} onChange={onQualityChange}
              className="h-7 rounded bg-black/50 border border-white/20 text-white text-xs px-2 outline-none"
              aria-label="Resolution"
            >
              {state.qualityLevels.map((q) => (
                <option key={q} value={q}>{formatQualityLabel(q)}</option>
              ))}
            </select>

            <select value={state.playbackRate} onChange={onPlaybackRateChange}
              className="h-7 rounded bg-black/50 border border-white/20 text-white text-xs px-2 outline-none"
              aria-label="Playback speed"
            >
              {state.playbackRates.map((rate) => (
                <option key={rate} value={rate}>{rate}x</option>
              ))}
            </select>
          </div>

          <button onClick={onFullscreen}
            className="text-white hover:text-red-400 transition-colors"
            aria-label={state.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {state.isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
