"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface WebGLContextOptions {
  alpha?: boolean;
  antialias?: boolean;
  depth?: boolean;
  stencil?: boolean;
  premultipliedAlpha?: boolean;
  powerPreference?: WebGLPowerPreference;
}

export type ManagedWebGLContext =
  | WebGL2RenderingContext
  | WebGLRenderingContext;

export interface WebGLContextState {
  context: ManagedWebGLContext | null;
  isLost: boolean;
  isSupported: boolean;
  isInitialized: boolean;
}

const DEFAULT_OPTIONS: WebGLContextOptions = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: true,
  powerPreference: "default",
};

export function useWebGLContext(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: WebGLContextOptions = {},
) {
  const [state, setState] = useState<WebGLContextState>({
    context: null,
    isLost: false,
    isSupported: false,
    isInitialized: false,
  });

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      setState({
        context: null,
        isLost: false,
        isSupported: false,
        isInitialized: false,
      });

      return;
    }

    let active = true;

    const contextOptions: WebGLContextOptions = {
      ...DEFAULT_OPTIONS,
      ...optionsRef.current,
    };

    const gl = (canvas.getContext("webgl2", contextOptions) ??
      canvas.getContext("webgl", contextOptions)) as ManagedWebGLContext | null;

    if (!gl) {
      setState({
        context: null,
        isLost: false,
        isSupported: false,
        isInitialized: false,
      });

      return;
    }

    const updateState = (updater: (previous: WebGLContextState) => WebGLContextState) => {
      if (active) {
        setState(updater);
      }
    };

    updateState((previous) => ({
      ...previous,
      context: gl,
      isLost: gl.isContextLost(),
      isSupported: true,
      isInitialized: !gl.isContextLost(),
    }));

    const handleContextLost = (event: Event) => {
      // Allow the browser to attempt context restoration.
      event.preventDefault();

      updateState((previous) => ({
        ...previous,
        isLost: true,
        isInitialized: false,
      }));
    };

    const handleContextRestored = () => {
      updateState((previous) => ({
        ...previous,
        context: gl,
        isLost: false,
        isSupported: true,
        isInitialized: true,
      }));

      // IMPORTANT:
      // Recreate your WebGL resources here or notify the renderer.
      // Textures, shaders, buffers and framebuffers may need rebuilding.
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      active = false;

      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [canvasRef, resetKey]);

  const reinitialize = useCallback(() => {
    setResetKey((previous) => previous + 1);
  }, []);

  return {
    ...state,
    reinitialize,
    canvas: state.context?.canvas ?? null,
    isReady:
      state.isSupported &&
      state.context !== null &&
      !state.isLost &&
      state.isInitialized,
  };
}

/**
 * Checks whether WebGL1 and WebGL2 context creation is available.
 *
 * Uses separate canvases because a canvas cannot provide independent
 * WebGL1 and WebGL2 contexts simultaneously.
 */
export function useWebGLSupport() {
  const [support, setSupport] = useState({
    webgl2: false,
    webgl1: false,
  });

  useEffect(() => {
    const testWebGL = (type: "webgl2" | "webgl") => {
      const canvas = document.createElement("canvas");

      try {
        const context = canvas.getContext(type);
        return context !== null;
      } catch {
        return false;
      }
    };

    // Defer to the next microtask so the effect body itself does not call
    // setState synchronously (React would schedule a cascading render).
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setSupport({
        webgl2: testWebGL("webgl2"),
        webgl1: testWebGL("webgl"),
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return support;
}