declare module 'gsap' {
  export function registerPlugin(...plugins: unknown[]): void;
  export function to(target: unknown, vars: Record<string, unknown>): unknown;
  export const gsap: {
    registerPlugin: typeof registerPlugin;
    to: typeof to;
  };
  const gsapLib: typeof gsap;
  export default gsapLib;
}

declare module 'gsap/MotionPathPlugin' {
  const MotionPathPlugin: Record<string, unknown>;
  export { MotionPathPlugin };
}

declare module 'gsap/ScrollTrigger' {
  const ScrollTrigger: Record<string, unknown>;
  export { ScrollTrigger };
}
