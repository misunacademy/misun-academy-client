export interface YouTubePlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  isReady: boolean;
  showControls: boolean;
  isFullscreen: boolean;
  isEnded: boolean;
  volume: number;
  playbackRates: number[];
  playbackRate: number;
  qualityLevels: string[];
  qualityLevel: string;
}

export interface YouTubePlayerActions {
  togglePlay: () => void;
  toggleMute: (e: React.MouseEvent) => void;
  updateVolume: (nextVolume: number) => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlaybackRateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleQualityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleFullscreen: (e: React.MouseEvent) => void;
  handleKeyboardControl: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  resetControlsTimer: () => void;
  setShowControls: (v: boolean) => void;
}
