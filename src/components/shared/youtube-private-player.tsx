/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw } from 'lucide-react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | undefined
    _ytApiCallbacks: (() => void)[]
  }
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return v
      const match = u.pathname.match(/\/embed\/([^/?]+)/)
      if (match) return match[1]
    }
  } catch {
    // invalid URL
  }
  return null
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface YoutubePrivatePlayerProps {
  url: string
  className?: string
}

export function YoutubePrivatePlayer({ url, className }: YoutubePrivatePlayerProps) {
  // Container where YT injects its iframe
  const playerContainerRef = useRef<HTMLDivElement>(null)
  // The actual YT Player instance — only set inside onReady
  const playerRef = useRef<any>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isEnded, setIsEnded] = useState(false)

  const progressInterval = useRef<any>(null)
  const controlsTimer = useRef<any>(null)

  const videoId = extractVideoId(url)

  useEffect(() => {
    if (!videoId) return

    let destroyed = false

    function createPlayer() {
      if (destroyed || !playerContainerRef.current) return

      // Always inject a fresh <div> so YT has a clean target even after Strict Mode double-run
      playerContainerRef.current.innerHTML = ''
      const target = document.createElement('div')
      playerContainerRef.current.appendChild(target)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const player = new window.YT.Player(target, {
        videoId,
        width: '100%',
        height: '100%',
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          playsinline: 1,
          // loop trick: prevents YouTube end screen suggestions entirely
          loop: 1,
          playlist: videoId,
          origin: window.location.origin,
        },
        events: {
          onReady(e: any) {
            if (destroyed) return
            playerRef.current = e.target
            setDuration(e.target.getDuration())
            setIsReady(true)
            // ensure the injected iframe fills the container
            const iframe = e.target.getIframe?.()
            if (iframe) {
              // Overscan: make iframe taller & wider so YouTube's title bar (top ~60px)
              // and any bottom chrome are clipped by the overflow:hidden on the parent.
              // The extra 120px is split: -60px top offset hides the title/logo row.
              iframe.style.position = 'absolute'
              iframe.style.top = '-60px'
              iframe.style.left = '0'
              iframe.style.width = '100%'
              iframe.style.height = 'calc(100% + 120px)'
              iframe.style.zIndex = '0'
              iframe.style.pointerEvents = 'none'
            }
          },
          onStateChange(e: any) {
            if (destroyed) return
            const { PlayerState } = window.YT
            if (e.data === PlayerState.PLAYING) {
              setIsPlaying(true)
              setIsEnded(false)
              progressInterval.current = setInterval(() => {
                const cur = playerRef.current?.getCurrentTime?.() ?? 0
                const dur = playerRef.current?.getDuration?.() ?? 1
                setCurrentTime(cur)
                setProgress((cur / dur) * 100)
              }, 500)
            } else if (e.data === PlayerState.ENDED) {
              // Stop immediately so YouTube never shows end-screen suggestions
              playerRef.current?.stopVideo?.()
              setIsPlaying(false)
              setIsEnded(true)
              setProgress(0)
              setCurrentTime(0)
              clearInterval(progressInterval.current)
            } else {
              setIsPlaying(false)
              clearInterval(progressInterval.current)
            }
          },
        },
      })

      // Do NOT assign playerRef here — wait for onReady
      return player
    }

    let rawPlayer: any = null

    function init() {
      rawPlayer = createPlayer()
    }

    if (window.YT?.Player) {
      init()
    } else {
      window._ytApiCallbacks = window._ytApiCallbacks || []
      window._ytApiCallbacks.push(init)

      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script')
        tag.id = 'yt-iframe-api'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }

      window.onYouTubeIframeAPIReady = () => {
        ;(window._ytApiCallbacks || []).forEach((cb) => cb())
        window._ytApiCallbacks = []
      }
    }

    return () => {
      destroyed = true
      clearInterval(progressInterval.current)
      clearTimeout(controlsTimer.current)
      // Destroy whichever ref is live
      playerRef.current?.destroy?.()
      rawPlayer?.destroy?.()
      playerRef.current = null
      setIsReady(false)
      setIsPlaying(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  // Track native fullscreen state so we can style the container correctly
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!playerRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const seekTo = pct * duration
    playerRef.current.seekTo(seekTo, true)
    setProgress(pct * 100)
    setCurrentTime(seekTo)
  }

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!document.fullscreenElement) {
      outerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const resetControlsTimer = () => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  if (!videoId) return null

  return (
    <div
      ref={outerRef}
      className={`relative bg-black select-none overflow-hidden ${className || ''}`}
      style={isFullscreen ? { width: '100vw', height: '100vh' } : undefined}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={resetControlsTimer}
      onMouseEnter={() => setShowControls(true)}
    >
      {/* YT injects its iframe into this div; a fresh child div is created on each init */}
      <div
        ref={playerContainerRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Full overlay — must be z-10 so it always sits above the iframe and catches every click */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-end cursor-pointer"
        onClick={togglePlay}
      >
        {/* Centre play/replay button (shown when paused or ended) */}
        {(!isPlaying) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] scale-100 hover:scale-110 transition-transform duration-300">
              {isEnded
                ? <RotateCcw className="text-white w-6 h-6" />
                : <Play className="fill-white text-white w-6 h-6 ml-1" />
              }
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
            <div className="w-8 h-8 border-2 border-white/30 border-t-red-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Bottom controls bar */}
        <div
          className={`bg-linear-to-t from-black/90 via-black/40 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div
            className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group/prog relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-red-500 rounded-full transition-all relative"
              style={{ width: `${progress}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/prog:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay() }}
                className="text-white hover:text-red-400 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying
                  ? <Pause className="w-5 h-5 fill-white" />
                  : <Play className="w-5 h-5 fill-white" />
                }
              </button>

              <button
                onClick={toggleMute}
                className="text-white hover:text-red-400 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted
                  ? <VolumeX className="w-5 h-5" />
                  : <Volume2 className="w-5 h-5" />
                }
              </button>

              <span className="text-white/70 text-xs tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={handleFullscreen}
              className="text-white hover:text-red-400 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen
                ? <Minimize2 className="w-4 h-4" />
                : <Maximize2 className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
