/* Lightweight Meta Pixel helper — safe to call before the pixel script loads. */

export function initPixel(pixelId?: string) {
  try {
    if (typeof window === "undefined" || !pixelId) return;

    console.debug('[MetaPixel] init requested', pixelId);

    if (window.fbq) {
      console.debug('[MetaPixel] fbq already present, skipping stub');
      return;
    }

    (function (f: Window, b: Document, e: "script", v: string) {
      if (f.fbq) return;
      const n: FBQ = function (...args: unknown[]) {
        if (n.callMethod) {
          n.callMethod(...args);
        } else {
          n.queue!.push(args);
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
      if (s?.parentNode) {
        s.parentNode.insertBefore(t, s);
      }
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq!("init", pixelId);
    window.fbq!("track", "PageView");

    console.debug('[MetaPixel] init completed, PageView sent');

    const q = window.__fbqQueue;
    if (Array.isArray(q)) {
      q.forEach((fn) => {
        try { fn(); } catch { /* ignore */ }
      });
      window.__fbqQueue = [];
    }
  } catch (err) {
    console.error("initPixel error", err);
  }
}

function _queueOrRun(fn: () => void) {
  if (typeof window === "undefined") return;
  if (window.fbq) {
    console.debug('[MetaPixel] running now');
    try { fn(); } catch { /* ignore */ }
    return;
  }
  console.debug('[MetaPixel] queuing event until pixel loads');
  window.__fbqQueue = window.__fbqQueue || [];
  window.__fbqQueue.push(fn);
}

export function track(eventName: string, params?: Record<string, unknown>, options?: Record<string, unknown>) {
  _queueOrRun(() => window.fbq!("track", eventName, params || {}, options || {}));
}

export function trackCustom(eventName: string, params?: Record<string, unknown>) {
  _queueOrRun(() => window.fbq!("trackCustom", eventName, params || {}));
}

export function trackPageView() { track("PageView"); }

const metaPixel = {
  initPixel,
  track,
  trackCustom,
  trackPageView,
};

export default metaPixel;
