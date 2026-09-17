'use client';

import { AlertTriangle, ExternalLink, FileWarning } from 'lucide-react';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { extractVideoId, youtubeErrorMessage } from '@/lib/youtube/utils';
import { CenterOverlay } from './youtube/CenterOverlay';
import { VideoControls } from './youtube/VideoControls';

interface YoutubePrivatePlayerProps {
  url: string;
  className?: string;
}

export function YoutubePrivatePlayer({ url, className }: YoutubePrivatePlayerProps) {
  const videoId = extractVideoId(url);
  const { state, actions, playerContainerRef, outerRef } = useYouTubePlayer(videoId);

  if (!videoId) {
    return (
      <div className={`relative bg-black overflow-hidden flex flex-col items-center justify-center gap-2 p-6 text-center ${className || ''}`}>
        <FileWarning className="h-10 w-10 text-amber-400/70" />
        <p className="text-sm font-semibold text-white">Invalid video link</p>
        <p className="text-xs text-white/50 max-w-sm">
          This lesson&apos;s YouTube URL could not be read. Please contact support and mention this lesson.
        </p>
      </div>
    );
  }

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div
      ref={outerRef}
      className={`relative bg-black select-none overflow-hidden outline-none ${className || ''}`}
      style={state.isFullscreen ? { width: '100vw', height: '100vh', borderRadius: 0 } : { borderRadius: 'inherit' }}
      tabIndex={0}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={() => outerRef.current?.focus()}
      onMouseMove={actions.resetControlsTimer}
      onMouseEnter={() => actions.setShowControls(true)}
      onKeyDown={actions.handleKeyboardControl}
    >
      <div ref={playerContainerRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: state.isPlaying ? 'auto' : 'none', borderRadius: 'inherit' }}
      />

      <div className="absolute inset-0 z-10 flex flex-col justify-end cursor-pointer"
        style={{ borderRadius: 'inherit' }}
        onClick={actions.togglePlay}
      >
        <CenterOverlay
          isReady={state.isReady}
          isPlaying={state.isPlaying}
          isEnded={state.isEnded}
          onTogglePlay={actions.togglePlay}
        />

        <VideoControls
          state={state}
          onTogglePlay={actions.togglePlay}
          onToggleMute={actions.toggleMute}
          onVolumeChange={actions.handleVolumeChange}
          onVolumeUp={() => actions.updateVolume(state.volume + 10)}
          onVolumeDown={() => actions.updateVolume(state.volume - 10)}
          onPlaybackRateChange={actions.handlePlaybackRateChange}
          onQualityChange={actions.handleQualityChange}
          onFullscreen={actions.handleFullscreen}
          onSeek={actions.handleSeek}
        />
      </div>

      {state.errorCode !== null && state.errorCode !== undefined && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/85 p-6 text-center" style={{ borderRadius: 'inherit' }}>
          <AlertTriangle className="h-10 w-10 text-amber-400" />
          <p className="text-sm font-semibold text-white">This video can&apos;t be played here</p>
          <p className="text-xs text-white/60 max-w-sm">{youtubeErrorMessage(state.errorCode)}</p>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
          >
            Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <p className="text-[11px] text-white/30">If it also fails on YouTube, the video is private or deleted — contact support.</p>
        </div>
      )}
    </div>
  );
}
