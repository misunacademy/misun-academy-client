import { useEffect, useRef, type MutableRefObject } from 'react';

export function useYouTubePlayerInit(
  videoId: string | null,
  onReady: (event: { target: YTPlayer }) => void,
  onStateChange: (event: { data: number }) => void,
  onPlaybackRateChange: (event: { data: number }) => void,
  onPlaybackQualityChange: (event: { data: string }) => void,
  playerRef: MutableRefObject<YTPlayer | null>,
) {
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId) return;
    let destroyed = false;

    function createPlayer() {
      if (destroyed || !playerContainerRef.current) return;
      playerContainerRef.current.innerHTML = '';
      const target = document.createElement('div');
      playerContainerRef.current.appendChild(target);
      return new window.YT.Player(target, {
        videoId,
        width: '100%',
        height: '100%',
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3,
          modestbranding: 1, rel: 0, showinfo: 0, playsinline: 1,
          loop: 1, playlist: videoId,
          origin: window.location.origin,
        },
        events: { onReady, onStateChange, onPlaybackRateChange, onPlaybackQualityChange },
      });
    }

    function init() {
      const p = createPlayer();
      if (p) playerRef.current = p;
    }

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
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId, onReady, onStateChange, onPlaybackRateChange, onPlaybackQualityChange, playerRef]);

  return { playerContainerRef, playerRef };
}
