import { useCallback, useEffect, useRef, useState } from 'react';
import type { YouTubePlayerState } from '@/types/youtube';
import { useYouTubePlayerInit } from './useYouTubePlayerInit';

const INITIAL_STATE: YouTubePlayerState = {
  isPlaying: false, isMuted: false, progress: 0, currentTime: 0, duration: 0,
  isReady: false, showControls: true, isFullscreen: false, isEnded: false,
  volume: 100, playbackRates: [0.5, 1, 1.5, 2], playbackRate: 1,
  qualityLevels: ['auto'], qualityLevel: 'auto',
};

export function useYouTubePlayer(videoId: string | null) {
  "use no memo";
  const [state, setState] = useState<YouTubePlayerState>(INITIAL_STATE);
  const update = useCallback((partial: Partial<YouTubePlayerState>) => setState((prev) => ({ ...prev, ...partial })), []);

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qualityApplyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qualityPreferenceRef = useRef<string>('auto');
  const outerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => { qualityPreferenceRef.current = state.qualityLevel; }, [state.qualityLevel]);

  const syncPlaybackOptions = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const rates = p.getAvailablePlaybackRates?.();
    if (Array.isArray(rates) && rates.length > 0) update({ playbackRates: rates });
    const currentRate = p.getPlaybackRate?.();
    if (typeof currentRate === 'number' && Number.isFinite(currentRate)) update({ playbackRate: currentRate });
    const qualities = p.getAvailableQualityLevels?.();
    if (Array.isArray(qualities) && qualities.length > 0) {
      const normalized = qualities.filter((q) => !!q && q !== 'unknown' && q !== 'tiny').map((q) => (q === 'default' ? 'auto' : q));
      const next = Array.from(new Set(['auto', ...normalized]));
      update({ qualityLevels: next, qualityLevel: next.includes(state.qualityLevel) ? state.qualityLevel : 'auto' });
    }
  }, [state.qualityLevel, update]);

  const applyQualityPreference = useCallback((nextQuality: string, hardReload = false) => {
    const p = playerRef.current;
    if (!p || !videoId) return;
    const ytQuality = nextQuality === 'auto' ? 'default' : nextQuality;
    p.setPlaybackQuality?.(ytQuality);
    if (typeof (p as YTPlayer & { setPlaybackQualityRange?: (min: string, max: string) => void }).setPlaybackQualityRange === 'function') {
      try { (p as YTPlayer & { setPlaybackQualityRange: (min: string, max: string) => void }).setPlaybackQualityRange(ytQuality, ytQuality); } catch { /* ignore */ }
    }
    if (!hardReload || nextQuality === 'auto') return;
    const now = p.getCurrentTime?.() ?? 0;
    const wasPlaying = p.getPlayerState?.() === window.YT.PlayerState.PLAYING;
    p.loadVideoById?.({ videoId, startSeconds: now, suggestedQuality: ytQuality });
    if (!wasPlaying) { p.pauseVideo?.(); p.seekTo?.(now, true); }
  }, [videoId]);

  const onPlayerReady = useCallback((event: { target: YTPlayer }) => {
    const p = event.target;
    playerRef.current = p;
    update({
      duration: p.getDuration(), volume: p.getVolume?.() ?? 100,
      isMuted: p.isMuted?.() ?? false, isReady: true,
    });
    syncPlaybackOptions();
    const iframe = p.getIframe?.();
    if (iframe) {
      Object.assign(iframe.style, {
        position: 'absolute', top: '-80px', left: '0', width: '100%',
        height: 'calc(100% + 160px)', zIndex: '0', pointerEvents: 'none',
        border: '0', borderRadius: 'inherit',
      });
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    }
  }, [syncPlaybackOptions, update]);

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
  }, [syncPlaybackOptions, applyQualityPreference, update]);

  const onPlaybackRateChange = useCallback((event: { data: number }) => {
    if (typeof event.data === 'number' && Number.isFinite(event.data)) update({ playbackRate: event.data });
  }, [update]);

  const onPlaybackQualityChange = useCallback((event: { data: string }) => {
    if (typeof event.data === 'string' && event.data.length > 0) {
      const apiQuality = event.data === 'default' || event.data === 'tiny' ? 'auto' : event.data;
      update({ qualityLevel: state.qualityLevel === 'auto' ? apiQuality : state.qualityLevel });
    }
  }, [state.qualityLevel, update]);

  const { playerContainerRef } = useYouTubePlayerInit(
    videoId, onPlayerReady, onStateChange, onPlaybackRateChange, onPlaybackQualityChange, playerRef,
  );

  useEffect(() => {
    const handler = () => update({ isFullscreen: !!document.fullscreenElement });
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [update]);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
      if (qualityApplyTimer.current) clearTimeout(qualityApplyTimer.current);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p || !state.isReady) return;
    if (state.isPlaying) p.pauseVideo(); else p.playVideo();
  }, [state.isReady, state.isPlaying]);

  const toggleMuteState = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (state.isMuted) {
      p.unMute();
      if (state.volume === 0) { p.setVolume?.(50); update({ volume: 50 }); }
      update({ isMuted: false });
    } else { p.mute(); update({ isMuted: true }); }
  }, [state.isMuted, state.volume, update]);

  const toggleMute = useCallback((e: React.MouseEvent) => { e.stopPropagation(); toggleMuteState(); }, [toggleMuteState]);

  const updateVolume = useCallback((nextVolume: number) => {
    const p = playerRef.current;
    if (!p) return;
    const bounded = Math.min(100, Math.max(0, nextVolume));
    p.setVolume?.(bounded);
    if (bounded === 0) { p.mute?.(); update({ isMuted: true }); }
    else { p.unMute?.(); update({ isMuted: false }); }
    update({ volume: bounded });
  }, [update]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); updateVolume(Number(e.target.value));
  }, [updateVolume]);

  const handlePlaybackRateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    const nextRate = Number(e.target.value);
    if (!Number.isFinite(nextRate)) return;
    p.setPlaybackRate?.(nextRate);
    update({ playbackRate: nextRate });
  }, [update]);

  const handleQualityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    const nextQuality = e.target.value;
    applyQualityPreference(nextQuality);
    if (qualityApplyTimer.current) clearTimeout(qualityApplyTimer.current);
    qualityApplyTimer.current = setTimeout(() => {
      if (!p || nextQuality === 'auto') return;
      const applied = p.getPlaybackQuality?.();
      const normalized = applied === 'default' ? 'auto' : applied;
      if (normalized !== nextQuality) applyQualityPreference(nextQuality, true);
    }, 800);
    update({ qualityLevel: nextQuality });
  }, [applyQualityPreference, update]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p || !state.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const seekTo = pct * state.duration;
    p.seekTo(seekTo, true);
    update({ progress: pct * 100, currentTime: seekTo });
  }, [state.duration, update]);

  const handleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) outerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }, []);

  const seekToTime = useCallback((nextTime: number) => {
    const p = playerRef.current;
    if (!p || !state.duration) return;
    const bounded = Math.min(state.duration, Math.max(0, nextTime));
    p.seekTo(bounded, true);
    update({ currentTime: bounded, progress: (bounded / state.duration) * 100, isEnded: false });
  }, [state.duration, update]);

  const resetControlsTimer = useCallback(() => {
    update({ showControls: true });
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => { if (state.isPlaying) update({ showControls: false }); }, 3000);
  }, [state.isPlaying, update]);

  const handleKeyboardControl = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const tag = target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;
    const key = e.key.toLowerCase();
    const seek = (offset: number) => seekToTime((playerRef.current?.getCurrentTime?.() ?? state.currentTime) + offset);
    const handlers: Record<string, () => void> = {
      ' ': () => { e.preventDefault(); togglePlay(); resetControlsTimer(); },
      'k': () => { e.preventDefault(); togglePlay(); resetControlsTimer(); },
      'arrowleft': () => { e.preventDefault(); seek(-5); resetControlsTimer(); },
      'arrowright': () => { e.preventDefault(); seek(5); resetControlsTimer(); },
      'arrowup': () => { e.preventDefault(); updateVolume(state.volume + 5); resetControlsTimer(); },
      'arrowdown': () => { e.preventDefault(); updateVolume(state.volume - 5); resetControlsTimer(); },
      'm': () => { e.preventDefault(); toggleMuteState(); resetControlsTimer(); },
      'f': () => { e.preventDefault(); handleFullscreen(e as unknown as React.MouseEvent); resetControlsTimer(); },
      'home': () => { e.preventDefault(); seekToTime(0); resetControlsTimer(); },
      'end': () => { e.preventDefault(); seekToTime(state.duration); resetControlsTimer(); },
    };
    handlers[key]?.();
  }, [togglePlay, seekToTime, state.volume, state.currentTime, state.duration, updateVolume, toggleMuteState, handleFullscreen, resetControlsTimer]);

  return {
    state,
    actions: {
      togglePlay, toggleMute, updateVolume, handleVolumeChange,
      handlePlaybackRateChange, handleQualityChange, handleSeek,
      handleFullscreen, handleKeyboardControl, resetControlsTimer,
      setShowControls: (v: boolean) => update({ showControls: v }),
    },
    playerContainerRef,
    outerRef,
  };
}