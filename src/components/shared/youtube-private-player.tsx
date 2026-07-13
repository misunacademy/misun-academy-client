'use client';

import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { extractVideoId } from '@/lib/youtube/utils';
import { CenterOverlay } from './youtube/CenterOverlay';
import { VideoControls } from './youtube/VideoControls';

interface YoutubePrivatePlayerProps {
  url: string;
  className?: string;
}

export function YoutubePrivatePlayer({ url, className }: YoutubePrivatePlayerProps) {
  const videoId = extractVideoId(url);
  const { state, actions, playerContainerRef, outerRef } = useYouTubePlayer(videoId);

  if (!videoId) return null;

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
    </div>
  );
}
