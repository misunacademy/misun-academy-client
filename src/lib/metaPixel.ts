/* eslint-disable @typescript-eslint/no-explicit-any */
/* Lightweight Meta Pixel helper — safe to call before the pixel script loads. */

export function initPixel(pixelId?: string) {
  try {
    if (typeof window === "undefined" || !pixelId) return;

    console.debug('[MetaPixel] init requested', pixelId);

    // Standard Meta Pixel stub (idempotent)
    if ((window as any).fbq) {
      console.debug('[MetaPixel] fbq already present, skipping stub');
      return;
    }

    (function (f: any, b: any, e: any, v: any) {
      if (f.fbq) return;
      const n: any = f.fbq = function (...args: any[]) {
        if (n.callMethod) {
          n.callMethod(...args);
        } else {
          n.queue.push(args);
        }
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e);
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    (window as any).fbq("init", pixelId);
    (window as any).fbq("track", "PageView");

    console.debug('[MetaPixel] init completed, PageView sent');

    // Drain any queued calls we stored in __fbqQueue
    const q = (window as any).__fbqQueue;
    if (Array.isArray(q)) {
      q.forEach((fn: any) => {
        try { fn(); } catch { /* ignore */ }
      });
      (window as any).__fbqQueue = [];
    }
  } catch (err) {
    // fail silently
    console.error("initPixel error", err);
  }
}

function _queueOrRun(fn: () => void) {
  if (typeof window === "undefined") return;
  if ((window as any).fbq) {
    console.debug('[MetaPixel] running now');
    try { fn(); } catch { /* ignore */ }
    return;
  }
  console.debug('[MetaPixel] queuing event until pixel loads');
  (window as any).__fbqQueue = (window as any).__fbqQueue || [];
  (window as any).__fbqQueue.push(fn);
}

export function track(eventName: string, params?: Record<string, any>, options?: Record<string, any>) {
  _queueOrRun(() => (window as any).fbq("track", eventName, params || {}, options || {}));
}

export function trackCustom(eventName: string, params?: Record<string, any>) {
  _queueOrRun(() => (window as any).fbq("trackCustom", eventName, params || {}));
}

export function trackPageView() { track("PageView"); }

const metaPixel = {
  initPixel,
  track,
  trackCustom,
  trackPageView,
};

export default metaPixel;