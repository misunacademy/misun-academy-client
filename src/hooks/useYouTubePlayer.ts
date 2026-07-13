import { useCallback, useEffect, useRef, useState } from 'react';

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

export function useYouTubePlayer(videoId: string | null): {
  state: YouTubePlayerState;
  actions: YouTubePlayerActions;
  playerContainerRef: React.RefObject<HTMLDivElement | null>;
  outerRef: React.RefObject<HTMLDivElement | null>;
} {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<YouTubePlayerState>({
    isPlaying: false, isMuted: false, progress: 0, currentTime: 0, duration: 0,
    isReady: false, showControls: true, isFullscreen: false, isEnded: false,
    volume: 100, playbackRates: [0.5, 1, 1.5, 2], playbackRate: 1,
    qualityLevels: ['auto'], qualityLevel: 'auto',
  });

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qualityApplyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qualityPreferenceRef = useRef<string>('auto');

  const update = (partial: Partial<YouTubePlayerState>) => setState((prev) => ({ ...prev, ...partial }));

  useEffect(() => { qualityPreferenceRef.current = state.qualityLevel; }, [state.qualityLevel]);

  const syncPlaybackOptions = useCallback(() => {
    if (!playerRef.current) return;
    const rates = playerRef.current.getAvailablePlaybackRates?.();
    if (Array.isArray(rates) && rates.length > 0) update({ playbackRates: rates });
    const currentRate = playerRef.current.getPlaybackRate?.();
    if (typeof currentRate === 'number' && Number.isFinite(currentRate)) update({ playbackRate: currentRate });
    const qualities = playerRef.current.getAvailableQualityLevels?.();
    if (Array.isArray(qualities) && qualities.length > 0) {
      const normalized = qualities.filter((q) => !!q && q !== 'unknown' && q !== 'tiny').map((q) => (q === 'default' ? 'auto' : q));
      const nextQualities = Array.from(new Set(['auto', ...normalized]));
      update({ qualityLevels: nextQualities, qualityLevel: nextQualities.includes(state.qualityLevel) ? state.qualityLevel : 'auto' });
    }
  }, []);

  const applyQualityPreference = useCallback((nextQuality: string, hardReload = false) => {
    if (!playerRef.current || !videoId) return;
    const ytQuality = nextQuality === 'auto' ? 'default' : nextQuality;
    playerRef.current.setPlaybackQuality?.(ytQuality);
    if (typeof playerRef.current.setPlaybackQualityRange === 'function') {
      try { playerRef.current.setPlaybackQualityRange(nextQuality === 'auto' ? 'default' : ytQuality, ytQuality); } catch { /* ignore */ }
    }
    if (!hardReload || nextQuality === 'auto') return;
    const now = playerRef.current.getCurrentTime?.() ?? 0;
    const wasPlaying = playerRef.current.getPlayerState?.() === window.YT.PlayerState.PLAYING;
    playerRef.current.loadVideoById?.({ videoId, startSeconds: now, suggestedQuality: ytQuality });
    if (!wasPlaying) { playerRef.current.pauseVideo?.(); playerRef.current.seekTo?.(now, true); }
  }, [videoId]);

  const onPlayerReady = useCallback((event: { target: YTPlayer }) => {
    playerRef.current = event.target;
    update({ duration: event.target.getDuration(), volume: event.target.getVolume?.() ?? 100, isMuted: event.target.isMuted?.() ?? false, isReady: true });
    syncPlaybackOptions();
    const iframe = event.target.getIframe?.();
    if (iframe) {
      iframe.style.position = 'absolute';
      iframe.style.top = '-80px';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = 'calc(100% + 160px)';
      iframe.style.zIndex = '0';
      iframe.style.pointerEvents = 'none';
      iframe.style.border = '0';
      iframe.style.borderRadius = 'inherit';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    }
  }, [syncPlaybackOptions]);

  const onStateChange = useCallback((event: { data: number }) => {
    const { PlayerState } = window.YT;
    if (event.data === PlayerState.PLAYING) {
      syncPlaybackOptions();
      if (qualityPreferenceRef.current !== 'auto') applyQualityPreference(qualityPreferenceRef.current);
      update({ isPlaying: true, isEnded: false });
      progressInterval.current = setInterval(() => {
        const cur = playerRef.current?.getCurrentTime?.() ?? 0;
        const dur = playerRef.current?.getDuration?.() ?? 1;
        update({ currentTime: cur, progress: (cur / dur) * 100 });
      }, 500);
    } else if (event.data === PlayerState.ENDED) {
      playerRef.current?.stopVideo?.();
      update({ isPlaying: false, isEnded: true, progress: 0, currentTime: 0 });
      if (progressInterval.current) clearInterval(progressInterval.current);
    } else {
      update({ isPlaying: false });
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
  }, [syncPlaybackOptions, applyQualityPreference]);

  const onPlaybackRateChange = useCallback((event: { data: number }) => {
    if (typeof event.data === 'number' && Number.isFinite(event.data)) update({ playbackRate: event.data });
  }, []);

  const onPlaybackQualityChange = useCallback((event: { data: string }) => {
    if (typeof event.data === 'string' && event.data.length > 0) {
      const apiQuality = event.data === 'default' || event.data === 'tiny' ? 'auto' : event.data;
      update({ qualityLevel: state.qualityLevel === 'auto' ? apiQuality : state.qualityLevel });
    }
  }, [state.qualityLevel]);

  useEffect(() => {
    if (!videoId) return;
    let destroyed = false;

    function createPlayer() {
      if (destroyed || !playerContainerRef.current) return undefined;
      playerContainerRef.current.innerHTML = '';
      const target = document.createElement('div');
      playerContainerRef.current.appendChild(target);
      return new window.YT.Player(target, {
        videoId, width: '100%', height: '100%', host: 'https://www.youtube-nocookie.com',
        playerVars: { controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0, showinfo: 0, playsinline: 1, loop: 1, playlist: videoId, origin: window.location.origin },
        events: { onReady: onPlayerReady, onStateChange, onPlaybackRateChange, onPlaybackQualityChange },
      });
    }

    let rawPlayer: YTPlayer | undefined;
    function init() { rawPlayer = createPlayer(); }

    if (window.YT?.Player) {
      init();
    } else {
      window._ytApiCallbacks = window._ytApiCallbacks || [];
      window._ytApiCallbacks.push(init);
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = () => {
        (window._ytApiCallbacks || []).forEach((cb) => cb());
        window._ytApiCallbacks = [];
      };
    }

    return () => {
      destroyed = true;
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
      if (qualityApplyTimer.current) clearTimeout(qualityApplyTimer.current);
      playerRef.current?.destroy?.();
      rawPlayer?.destroy?.();
      playerRef.current = null;
      update({ isReady: false, isPlaying: false });
    };
  }, [videoId]);

  useEffect(() => {
    const handler = () => update({ isFullscreen: !!document.fullscreenElement });
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !state.isReady) return;
    if (state.isPlaying) playerRef.current.pauseVideo(); else playerRef.current.playVideo();
  }, [state.isReady, state.isPlaying]);

  const toggleMuteState = useCallback(() => {
    if (!playerRef.current) return;
    if (state.isMuted) {
      playerRef.current.unMute();
      if (state.volume === 0) { playerRef.current.setVolume?.(50); update({ volume: 50 }); }
      update({ isMuted: false });
    } else { playerRef.current.mute(); update({ isMuted: true }); }
  }, [state.isMuted, state.volume]);

  const toggleMute = useCallback((e: React.MouseEvent) => { e.stopPropagation(); toggleMuteState(); }, [toggleMuteState]);
  const updateVolume = useCallback((nextVolume: number) => {
    if (!playerRef.current) return;
    const bounded = Math.min(100, Math.max(0, nextVolume));
    playerRef.current.setVolume?.(bounded);
    if (bounded === 0) { playerRef.current.mute?.(); update({ isMuted: true }); }
    else { playerRef.current.unMute?.(); update({ isMuted: false }); }
    update({ volume: bounded });
  }, []);
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { e.stopPropagation(); updateVolume(Number(e.target.value)); }, [updateVolume]);
  const handlePlaybackRateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    const nextRate = Number(e.target.value);
    if (!Number.isFinite(nextRate)) return;
    playerRef.current.setPlaybackRate?.(nextRate);
    update({ playbackRate: nextRate });
  }, []);
  const handleQualityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    const nextQuality = e.target.value;
    applyQualityPreference(nextQuality);
    if (qualityApplyTimer.current) clearTimeout(qualityApplyTimer.current);
    qualityApplyTimer.current = setTimeout(() => {
      if (!playerRef.current || nextQuality === 'auto') return;
      const applied = playerRef.current.getPlaybackQuality?.();
      const normalizedApplied = applied === 'default' ? 'auto' : applied;
      if (normalizedApplied !== nextQuality) applyQualityPreference(nextQuality, true);
    }, 800);
    update({ qualityLevel: nextQuality });
  }, [applyQualityPreference]);
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!playerRef.current || !state.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const seekTo = pct * state.duration;
    playerRef.current.seekTo(seekTo, true);
    update({ progress: pct * 100, currentTime: seekTo });
  }, [state.duration]);
  const handleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) outerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }, []);
  const seekToTime = useCallback((nextTime: number) => {
    if (!playerRef.current || !state.duration) return;
    const bounded = Math.min(state.duration, Math.max(0, nextTime));
    playerRef.current.seekTo(bounded, true);
    update({ currentTime: bounded, progress: (bounded / state.duration) * 100, isEnded: false });
  }, [state.duration]);
  const handleKeyboardControl = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;
    switch (e.key) {
      case ' ': case 'k': case 'K': e.preventDefault(); togglePlay(); resetControlsTimer(); break;
      case 'ArrowLeft': case 'j': case 'J': e.preventDefault(); seekToTime((playerRef.current?.getCurrentTime?.() ?? state.currentTime) - 5); resetControlsTimer(); break;
      case 'ArrowRight': case 'l': case 'L': e.preventDefault(); seekToTime((playerRef.current?.getCurrentTime?.() ?? state.currentTime) + 5); resetControlsTimer(); break;
      case 'ArrowUp': e.preventDefault(); updateVolume(state.volume + 5); resetControlsTimer(); break;
      case 'ArrowDown': e.preventDefault(); updateVolume(state.volume - 5); resetControlsTimer(); break;
      case 'm': case 'M': e.preventDefault(); toggleMuteState(); resetControlsTimer(); break;
      case 'f': case 'F': e.preventDefault(); handleFullscreen(e as unknown as React.MouseEvent); resetControlsTimer(); break;
      case 'Home': e.preventDefault(); seekToTime(0); resetControlsTimer(); break;
      case 'End': e.preventDefault(); seekToTime(state.duration); resetControlsTimer(); break;
    }
  }, [togglePlay, seekToTime, state.volume, state.currentTime, state.duration, updateVolume, toggleMuteState, handleFullscreen]);
  const resetControlsTimer = useCallback(() => {
    update({ showControls: true });
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => { if (state.isPlaying) update({ showControls: false }); }, 3000);
  }, [state.isPlaying]);

  return {
    state, actions: {
      togglePlay, toggleMute, updateVolume, handleVolumeChange, handlePlaybackRateChange,
      handleQualityChange, handleSeek, handleFullscreen, handleKeyboardControl, resetControlsTimer,
      setShowControls: (v: boolean) => update({ showControls: v }),
    },
    playerContainerRef, outerRef,
  };
}
