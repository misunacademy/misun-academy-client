interface FBQ {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue?: unknown[]
  push?: unknown
  loaded?: boolean
  version?: string
}

interface Window {
  fbq?: FBQ
  _fbq?: FBQ
  __fbqQueue?: (() => void)[]
  YT: {
    Player: new (
      element: HTMLElement | string,
      options: YTPlayerOptions
    ) => YTPlayer
    PlayerState: {
      UNSTARTED: number
      ENDED: number
      PLAYING: number
      PAUSED: number
      BUFFERING: number
      CUED: number
    }
  }
  onYouTubeIframeAPIReady?: () => void
  _ytApiCallbacks?: (() => void)[]
}

interface YTPlayerOptions {
  videoId?: string | null
  width?: string | number
  height?: string | number
  host?: string
  playerVars?: Record<string, string | number | null>
  events?: {
    onReady?: (event: { target: YTPlayer }) => void
    onStateChange?: (event: { data: number }) => void
    onPlaybackRateChange?: (event: { data: number }) => void
    onPlaybackQualityChange?: (event: { data: string }) => void
    onError?: (event: { data: number }) => void
  }
}

interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  destroy(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  mute(): void
  unMute(): void
  isMuted(): boolean
  setVolume(volume: number): void
  getVolume(): number
  getCurrentTime(): number
  getDuration(): number
  getPlayerState(): number
  getPlaybackRate(): number
  setPlaybackRate(suggestedRate: number): void
  getAvailablePlaybackRates(): number[]
  getPlaybackQuality(): string
  setPlaybackQuality(suggestedQuality: string): void
  getAvailableQualityLevels(): string[]
  loadVideoById(options: {
    videoId: string
    startSeconds?: number
    suggestedQuality?: string
  }): void
  getIframe?(): HTMLIFrameElement
  setPlaybackQualityRange?(...args: unknown[]): void
}
