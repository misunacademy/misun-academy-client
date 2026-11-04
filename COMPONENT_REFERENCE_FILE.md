## Integrate the <DitherVeil /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: DitherVeil
### Variant: JavaScript + CSS
### Dependencies: ogl

---

### Usage Example
```jsx
import DitherVeil from './DitherVeil';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <DitherVeil
    src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
    pattern="floyd"
    pixelSize={2}
    inkColor="#120f17"
    paperColor="#f4f1ea"
    revealRadius={200}
    softness={0.6}
    linger={1}
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | 'https://images.unsplash.com/...' | Image to veil. Must be served with CORS headers. |
| fit | 'contain' | 'cover' | 'contain' | Show the whole image on the ink, or crop it to fill the container. |
| pattern | 'bayer' | 'noise' | 'atkinson' | 'floyd' | 'lines' | 'floyd' | How the image is broken into dots: an ordered Bayer grid, blue noise stipple, Atkinson or Floyd-Steinberg error diffusion, or diagonal engraving lines. |
| palette | 'duotone' | 'rgb' | 'duotone' | Duotone maps brightness between the ink and paper colours. RGB dithers each channel for a retro colour look. |
| pixelSize | number | 2 | Size of each dither cell, in px. |
| levels | number | 2 | Tones per channel. 2 is pure 1-bit, higher values add in-between shades. |
| inkColor | string | '#120f17' | Colour of the darkest tone. |
| paperColor | string | '#f4f1ea' | Colour of the lightest tone. |
| contrast | number | 1.15 | Tonal contrast applied before dithering. |
| brightness | number | 0 | Shifts the image lighter or darker before dithering. |
| revealRadius | number | 200 | Radius of the full-colour window around the cursor, in px. |
| softness | number | 0.6 | How much of the reveal edge dissolves through the dither. 0 is a hard cut. |
| linger | number | 1 | Seconds the revealed trail takes to knit back into dither. 0 turns the trail off. |
| rimColor | string | '#a78bfa' | Colour of the cells along the dissolving edge. |
| rim | number | 0 | Thickness of the coloured rim on the dissolving edge. 0 hides it. |
| reverse | boolean | false | Start in full colour and dither wherever the cursor goes. |
| wander | boolean | false | Let the reveal drift around on its own while the pointer is away. |
| clickBurst | boolean | true | Clicking sends a ring of colour rippling out across the image. |
| className | string | '' | Extra classes on the container. |
| style | CSSProperties | - | Inline styles on the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture, RenderTarget } from 'ogl';

import './DitherVeil.css';

const DEFAULT_SRC = 'https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop';

const ORDERED = { bayer: 0, noise: 1, lines: 2 };

const KERNELS = {
  atkinson: [
    [1, 0, 1 / 8],
    [2, 0, 1 / 8],
    [-1, 1, 1 / 8],
    [0, 1, 1 / 8],
    [1, 1, 1 / 8],
    [0, 2, 1 / 8]
  ],
  floyd: [
    [1, 0, 7 / 16],
    [-1, 1, 3 / 16],
    [0, 1, 5 / 16],
    [1, 1, 1 / 16]
  ]
};

const MASK_SCALE = 0.5;
const MAX_BURSTS = 4;
const BURST_SECONDS = 1.2;
const HOLD = 1.6;
const INTRO_MS = 1100;

const hexToRgb = hex => {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h.replace(/./g, c => c + c);
  const n = parseInt(h.slice(0, 6), 16);
  return Number.isNaN(n) ? [0, 0, 0] : [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const fitScale = (w, h, iw, ih, contain) => {
  const ratio = w / h / (iw / ih);
  if (contain) return ratio > 1 ? [ratio, 1] : [1, 1 / ratio];
  return ratio > 1 ? [1, 1 / ratio] : [ratio, 1];
};

const wanderAt = (t, w, h) => [
  w * (0.5 + 0.33 * Math.sin(t * 0.53) + 0.08 * Math.sin(t * 1.31 + 0.6)),
  h * (0.5 + 0.28 * Math.sin(t * 0.71 + 1.1) + 0.07 * Math.cos(t * 1.57))
];

const measureEdge = (context, image) => {
  const size = 32;
  context.canvas.width = size;
  context.canvas.height = size;
  context.drawImage(image, 0, 0, size, size);
  const data = context.getImageData(0, 0, size, size).data;
  const sum = [0, 0, 0];
  const squares = [0, 0, 0];
  let count = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x > 0 && y > 0 && x < size - 1 && y < size - 1) continue;
      for (let c = 0; c < 3; c++) {
        const v = data[(y * size + x) * 4 + c] / 255;
        sum[c] += v;
        squares[c] += v * v;
      }
      count++;
    }
  }
  const matte = [sum[0] / count, sum[1] / count, sum[2] / count];
  const spread =
    matte.reduce((total, mean, c) => total + Math.sqrt(Math.max(0, squares[c] / count - mean * mean)), 0) / 3;
  return { matte, plain: spread < 0.06 };
};

let blueNoise = null;

const getBlueNoise = () => {
  if (blueNoise) return blueNoise;
  const size = 64;
  const n = size * size;
  const wrap = size - 1;
  const taps = [];
  for (let dy = -6; dy <= 6; dy++) {
    for (let dx = -6; dx <= 6; dx++) taps.push(dx, dy, Math.exp(-(dx * dx + dy * dy) / 4.5));
  }
  const energy = new Float32Array(n);
  const on = new Uint8Array(n);
  const splat = (i, sign) => {
    const x = i % size;
    const y = (i - x) / size;
    for (let k = 0; k < taps.length; k += 3) {
      energy[((y + taps[k + 1]) & wrap) * size + ((x + taps[k]) & wrap)] += sign * taps[k + 2];
    }
  };
  const find = (state, highest) => {
    let best = 0;
    let value = highest ? -Infinity : Infinity;
    for (let i = 0; i < n; i++) {
      if (on[i] !== state) continue;
      if (highest ? energy[i] > value : energy[i] < value) {
        value = energy[i];
        best = i;
      }
    }
    return best;
  };
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const initial = Math.round(n * 0.1);
  for (let placed = 0; placed < initial; ) {
    const i = Math.floor(random() * n);
    if (on[i]) continue;
    on[i] = 1;
    splat(i, 1);
    placed++;
  }
  for (let guard = 0; guard < n; guard++) {
    const cluster = find(1, true);
    on[cluster] = 0;
    splat(cluster, -1);
    const gap = find(0, false);
    on[gap] = 1;
    splat(gap, 1);
    if (gap === cluster) break;
  }
  const seedOn = on.slice();
  const seedEnergy = energy.slice();
  const rank = new Uint16Array(n);
  for (let r = initial - 1; r >= 0; r--) {
    const cluster = find(1, true);
    on[cluster] = 0;
    splat(cluster, -1);
    rank[cluster] = r;
  }
  on.set(seedOn);
  energy.set(seedEnergy);
  for (let r = initial; r < n; r++) {
    const gap = find(0, false);
    on[gap] = 1;
    splat(gap, 1);
    rank[gap] = r;
  }
  const data = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    const v = Math.floor((rank[i] / n) * 256);
    data[i * 4] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  }
  blueNoise = data;
  return data;
};

const diffuse = (pixels, cols, rows, kernel, levels, rgb, grade) => {
  const channels = rgb ? 3 : 1;
  const values = new Float32Array(cols * rows * channels);
  for (let i = 0; i < cols * rows; i++) {
    const r = pixels[i * 4] / 255;
    const g = pixels[i * 4 + 1] / 255;
    const b = pixels[i * 4 + 2] / 255;
    if (rgb) {
      values[i * 3] = grade(r);
      values[i * 3 + 1] = grade(g);
      values[i * 3 + 2] = grade(b);
    } else {
      values[i] = grade(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }
  }
  const steps = levels - 1;
  const out = new Uint8Array(cols * rows * 4);
  for (let y = 0; y < rows; y++) {
    const dir = y & 1 ? -1 : 1;
    for (let i = 0; i < cols; i++) {
      const x = dir > 0 ? i : cols - 1 - i;
      const p = y * cols + x;
      for (let c = 0; c < channels; c++) {
        const old = values[p * channels + c];
        const q = Math.min(steps, Math.max(0, Math.round(old * steps))) / steps;
        const err = old - q;
        const byte = Math.round(q * 255);
        if (rgb) out[p * 4 + c] = byte;
        else out[p * 4] = out[p * 4 + 1] = out[p * 4 + 2] = byte;
        for (let k = 0; k < kernel.length; k++) {
          const nx = x + kernel[k][0] * dir;
          const ny = y + kernel[k][1];
          if (nx < 0 || nx >= cols || ny >= rows) continue;
          values[(ny * cols + nx) * channels + c] += err * kernel[k][2];
        }
      }
      out[p * 4 + 3] = 255;
    }
  }
  return out;
};

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const maskFragment = `#version 300 es
precision highp float;

uniform sampler2D tPrev;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uSoftness;
uniform float uStrength;
uniform float uFade;
uniform float uHold;

in vec2 vUv;
out vec4 fragColor;

float strokeDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
  return length(p - a - ab * h);
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uSize;
  float trail = max(texture(tPrev, vUv).r - uFade, 0.0);
  float band = max(uRadius * uSoftness, 1.0) * uHold;
  float d = strokeDistance(p, uFrom, uTo);
  trail = max(trail, clamp((uRadius - d) / band, 0.0, 1.0) * uStrength);
  fragColor = vec4(trail, 0.0, 0.0, 1.0);
}
`;

const viewFragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tImage;
uniform sampler2D tMask;
uniform sampler2D tNoise;
uniform sampler2D tDiffused;
uniform vec2 uResolution;
uniform vec2 uCover;
uniform float uLod;
uniform float uCell;
uniform int uPattern;
uniform int uPalette;
uniform float uLevels;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uRimColor;
uniform float uRim;
uniform float uContrast;
uniform float uBrightness;
uniform float uReverse;
uniform float uIntro;
uniform float uHold;
uniform vec3 uMatte;
uniform float uKey;
uniform vec2 uSize;
uniform vec4 uBursts[4];
uniform float uBurstWidth;

in vec2 vUv;
out vec4 fragColor;

float bayer(vec2 cell) {
  ivec2 p = ivec2(mod(cell, 8.0));
  int v = p.x ^ p.y;
  int m = ((v & 1) << 5) | ((p.y & 1) << 4) | ((v & 2) << 2) | ((p.y & 2) << 1) | ((v & 4) >> 1) | ((p.y & 4) >> 2);
  return (float(m) + 0.5) / 64.0;
}

float blueNoise(vec2 cell) {
  return (texelFetch(tNoise, ivec2(mod(cell, 64.0)), 0).r * 255.0 + 0.5) / 256.0;
}

float engraving(vec2 cell) {
  float period = 6.0;
  float f = (mod(cell.x + cell.y, period) + 0.5) / period;
  return clamp(abs(f * 2.0 - 1.0) + (bayer(cell) - 0.5) * (2.0 / period), 0.0, 1.0);
}

vec2 imageUv(vec2 uv) {
  return (uv - 0.5) * uCover + 0.5;
}

float within(vec2 p) {
  vec2 s = step(vec2(0.0), p) * step(p, vec2(1.0));
  return s.x * s.y;
}

vec3 grade(vec3 c) {
  return pow(clamp((c - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0), vec3(1.6));
}

float shockwave(vec2 p) {
  float value = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 burst = uBursts[i];
    if (burst.w <= 0.0) continue;
    float offset = distance(p, burst.xy) - burst.z;
    float edge = offset > 0.0 ? offset / (uBurstWidth * 0.35) : -offset / uBurstWidth;
    value = max(value, clamp(1.0 - edge, 0.0, 1.0) * burst.w);
  }
  return value;
}

vec3 toned(vec3 c) {
  return uPalette == 1 ? grade(c) : grade(vec3(dot(c, vec3(0.2126, 0.7152, 0.0722))));
}

vec3 quantize(vec3 v, float t) {
  float steps = max(uLevels - 1.0, 1.0);
  vec3 s = v * steps;
  vec3 base = floor(s);
  return min(base + step(vec3(t), s - base), vec3(steps)) / steps;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell;
  vec2 cellUv = vec2(center.x / uResolution.x, 1.0 - center.y / uResolution.y);

  vec2 sampleUv = imageUv(cellUv);
  float framed = within(sampleUv);
  vec3 level;
  if (uPattern == 3) {
    level = texelFetch(tDiffused, ivec2(cell), 0).rgb;
  } else {
    vec3 c = mix(uMatte, textureLod(tImage, sampleUv, uLod).rgb, framed);
    float t = uPattern == 1 ? blueNoise(cell) : (uPattern == 2 ? engraving(cell) : bayer(cell));
    level = quantize(toned(c), t);
  }

  vec3 color = mix(uInk, mix(uInk, uPaper, level), max(framed, uKey));
  vec3 backdrop = mix(uInk, uPaper, toned(uMatte));
  vec2 photoUv = imageUv(vUv);
  vec3 raw = texture(tImage, photoUv).rgb;
  float plain = uKey * (1.0 - smoothstep(0.05, 0.22, distance(raw, uMatte)));
  vec3 photo = mix(mix(uInk, backdrop, uKey), mix(raw, backdrop, plain), within(photoUv));

  vec2 point = vec2(cellUv.x, 1.0 - cellUv.y) * uSize;
  float mask = max(clamp(texture(tMask, cellUv).r * uHold, 0.0, 1.0), shockwave(point));
  float shown = mix(mask, 1.0 - mask, uReverse);
  float order = bayer(cell.yx);
  float low = order * (1.0 - uRim);
  color = mix(color, uRimColor, step(low, shown) * step(0.001, uRim));
  color = mix(color, photo, step(low + uRim, shown));

  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  float spread = length((cellUv - 0.5) * aspect) / length(aspect * 0.5);
  float appear = step(spread * 0.72 + bayer(cell + vec2(3.0, 5.0)) * 0.28, uIntro * 1.001);
  fragColor = vec4(mix(uInk, color, appear), 1.0);
}
`;

const DitherVeil = ({
  src = DEFAULT_SRC,
  fit = 'contain',
  pattern = 'floyd',
  pixelSize = 2,
  levels = 2,
  palette = 'duotone',
  inkColor = '#120f17',
  paperColor = '#f4f1ea',
  contrast = 1.15,
  brightness = 0,
  revealRadius = 200,
  softness = 0.6,
  linger = 1,
  rimColor = '#a78bfa',
  rim = 0,
  reverse = false,
  wander = false,
  clickBurst = true,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const settingsRef = useRef(null);
  const wakeRef = useRef(() => {});

  useEffect(() => {
    settingsRef.current = {
      fit,
      pattern,
      pixelSize,
      levels,
      palette,
      inkColor,
      paperColor,
      contrast,
      brightness,
      revealRadius,
      softness,
      linger,
      rimColor,
      rim,
      reverse,
      wander,
      clickBurst
    };
    wakeRef.current();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: false, antialias: false });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const floatMask = renderer.isWebgl2 && !!renderer.getExtension('EXT_color_buffer_float');
    const geometry = new Triangle(gl);

    const dataTexture = () =>
      new Texture(gl, {
        image: new Uint8Array(4),
        width: 1,
        height: 1,
        generateMipmaps: false,
        flipY: false,
        minFilter: gl.NEAREST,
        magFilter: gl.NEAREST
      });
    const imageTexture = new Texture(gl, { minFilter: gl.LINEAR_MIPMAP_LINEAR, magFilter: gl.LINEAR });
    const noiseTexture = dataTexture();
    const diffusedTexture = dataTexture();

    const createMask = (w, h) =>
      new RenderTarget(gl, {
        width: w,
        height: h,
        depth: false,
        type: floatMask ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
        internalFormat: floatMask ? gl.RGBA16F : gl.RGBA,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR
      });
    const destroyMask = target => {
      gl.deleteFramebuffer(target.buffer);
      gl.deleteTexture(target.texture.texture);
    };
    let masks = [createMask(2, 2), createMask(2, 2)];

    const maskUniforms = {
      tPrev: { value: masks[0].texture },
      uSize: { value: [1, 1] },
      uFrom: { value: [0, 0] },
      uTo: { value: [0, 0] },
      uRadius: { value: 1 },
      uSoftness: { value: 0.5 },
      uStrength: { value: 0 },
      uFade: { value: 1 },
      uHold: { value: HOLD }
    };
    const viewUniforms = {
      tImage: { value: imageTexture },
      tMask: { value: masks[0].texture },
      tNoise: { value: noiseTexture },
      tDiffused: { value: diffusedTexture },
      uResolution: { value: [1, 1] },
      uCover: { value: [1, 1] },
      uLod: { value: 0 },
      uCell: { value: 3 },
      uPattern: { value: 0 },
      uPalette: { value: 0 },
      uLevels: { value: 2 },
      uInk: { value: [0, 0, 0] },
      uPaper: { value: [1, 1, 1] },
      uRimColor: { value: [1, 1, 1] },
      uRim: { value: 0 },
      uContrast: { value: 1 },
      uBrightness: { value: 0 },
      uReverse: { value: 0 },
      uIntro: { value: 0 },
      uHold: { value: HOLD },
      uMatte: { value: [0, 0, 0] },
      uKey: { value: 0 },
      uSize: { value: [1, 1] },
      uBursts: { value: Array.from({ length: MAX_BURSTS * 4 }, () => 0) },
      uBurstWidth: { value: 60 }
    };
    const program = (fragment, uniforms) =>
      new Program(gl, { vertex, fragment, uniforms, depthTest: false, depthWrite: false });
    const maskMesh = new Mesh(gl, { geometry, program: program(maskFragment, maskUniforms) });
    const viewMesh = new Mesh(gl, { geometry, program: program(viewFragment, viewUniforms) });

    const sampler = document.createElement('canvas');
    const samplerContext = sampler.getContext('2d', { willReadFrequently: true });

    let image = null;
    let introStart = 0;
    let diffusedKey = '';
    let diffusionBlocked = false;
    let width = 1;
    let height = 1;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let trailUntil = 0;
    let presence = 0;
    let drift = 0;
    const pointer = { x: 0, y: 0, inside: false, fresh: true, placed: false };
    const brush = { x: 0, y: 0, px: 0, py: 0 };
    const bursts = [];

    const layout = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height);
      viewUniforms.uResolution.value = [canvas.width, canvas.height];
      maskUniforms.uSize.value = [width, height];
      viewUniforms.uSize.value = [width, height];
      const mw = Math.max(2, Math.round(width * MASK_SCALE));
      const mh = Math.max(2, Math.round(height * MASK_SCALE));
      if (mw !== masks[0].width || mh !== masks[0].height) {
        masks.forEach(destroyMask);
        masks = [createMask(mw, mh), createMask(mw, mh)];
      }
      if (!pointer.placed) {
        pointer.x = width / 2;
        pointer.y = height / 2;
      }
    };

    const updateDiffusion = (cell, s) => {
      if (!image || !samplerContext) return;
      const cols = Math.ceil(canvas.width / cell);
      const rows = Math.ceil(canvas.height / cell);
      const key = [
        s.pattern,
        s.levels,
        s.palette,
        s.contrast,
        s.brightness,
        s.fit,
        cols,
        rows,
        canvas.width,
        canvas.height
      ].join('|');
      if (key === diffusedKey) return;
      diffusedKey = key;
      const [cx, cy] = viewUniforms.uCover.value;
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      sampler.width = cols;
      sampler.height = rows;
      samplerContext.imageSmoothingEnabled = true;
      samplerContext.imageSmoothingQuality = 'high';
      const [mr, mg, mb] = viewUniforms.uMatte.value;
      samplerContext.fillStyle = `rgb(${mr * 255}, ${mg * 255}, ${mb * 255})`;
      samplerContext.fillRect(0, 0, cols, rows);
      const sx = (0.5 - 0.5 * cx) * iw;
      const sy = (0.5 - 0.5 * cy) * ih;
      const sw = ((cols * cell) / canvas.width) * cx * iw;
      const sh = ((rows * cell) / canvas.height) * cy * ih;
      const x0 = Math.max(sx, 0);
      const y0 = Math.max(sy, 0);
      const x1 = Math.min(sx + sw, iw);
      const y1 = Math.min(sy + sh, ih);
      if (x1 > x0 && y1 > y0) {
        samplerContext.drawImage(
          image,
          x0,
          y0,
          x1 - x0,
          y1 - y0,
          ((x0 - sx) / sw) * cols,
          ((y0 - sy) / sh) * rows,
          ((x1 - x0) / sw) * cols,
          ((y1 - y0) / sh) * rows
        );
      }
      const grade = v => Math.pow(Math.min(1, Math.max(0, (v - 0.5) * s.contrast + 0.5 + s.brightness)), 1.6);
      const pixels = samplerContext.getImageData(0, 0, cols, rows).data;
      diffusedTexture.image = diffuse(pixels, cols, rows, KERNELS[s.pattern], s.levels, s.palette === 'rgb', grade);
      diffusedTexture.width = cols;
      diffusedTexture.height = rows;
      diffusedTexture.needsUpdate = true;
    };

    const frame = now => {
      raf = 0;
      const s = settingsRef.current;
      if (!s) return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const wanderOn = s.wander && !reducedMotion;
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (!pointer.inside && wanderOn) {
        drift = Math.min(1, drift + dt / 1.2);
        const [wx, wy] = wanderAt(now / 1000, width, height);
        const k = drift * drift * (3 - 2 * drift);
        targetX += (wx - targetX) * k;
        targetY += (wy - targetY) * k;
      } else {
        drift = 0;
      }

      presence += ((pointer.inside || wanderOn ? 1 : 0) - presence) * (1 - Math.exp(-dt / 0.16));

      if (pointer.fresh) {
        brush.x = brush.px = targetX;
        brush.y = brush.py = targetY;
        pointer.fresh = false;
      } else {
        const follow = 1 - Math.exp(-dt / 0.035);
        brush.x += (targetX - brush.x) * follow;
        brush.y += (targetY - brush.y) * follow;
      }

      const burstData = viewUniforms.uBursts.value;
      burstData.fill(0);
      for (let i = bursts.length - 1; i >= 0; i--) {
        if ((now - bursts[i].start) / 1000 >= BURST_SECONDS) bursts.splice(i, 1);
      }
      bursts.forEach((b, i) => {
        const k = Math.max(0, (now - b.start) / 1000 / BURST_SECONDS);
        const reach =
          Math.hypot(Math.max(b.x, width - b.x), Math.max(b.y, height - b.y)) + viewUniforms.uBurstWidth.value;
        burstData[i * 4] = b.x;
        burstData[i * 4 + 1] = b.y;
        burstData[i * 4 + 2] = reach * Math.sin((k * Math.PI) / 2);
        burstData[i * 4 + 3] = 1 - k * k * k;
      });

      if (presence > 0.002) trailUntil = now + s.linger * 1000 + 150;

      const minFade = floatMask ? 0 : 1.5 / 255;
      const fade = s.linger > 0 ? dt / s.linger : 1;
      maskUniforms.tPrev.value = masks[0].texture;
      maskUniforms.uFrom.value = [brush.px, brush.py];
      maskUniforms.uTo.value = [brush.x, brush.y];
      maskUniforms.uRadius.value = s.revealRadius * (0.45 + 0.55 * presence);
      maskUniforms.uSoftness.value = s.softness;
      maskUniforms.uStrength.value = presence;
      maskUniforms.uFade.value = Math.max(fade, minFade);
      viewUniforms.uBurstWidth.value = Math.max(60, s.revealRadius * 0.9);
      renderer.render({ scene: maskMesh, target: masks[1] });
      masks.reverse();
      brush.px = brush.x;
      brush.py = brush.y;

      const cell = Math.max(1, Math.round(s.pixelSize * renderer.dpr));
      if (image) {
        viewUniforms.uCover.value = fitScale(
          canvas.width,
          canvas.height,
          image.naturalWidth,
          image.naturalHeight,
          s.fit === 'contain'
        );
      }
      let patternIndex = ORDERED[s.pattern] ?? 0;
      if (KERNELS[s.pattern]) {
        patternIndex = 0;
        if (image && !diffusionBlocked) {
          try {
            updateDiffusion(cell, s);
            patternIndex = 3;
          } catch {
            diffusionBlocked = true;
          }
        }
      }
      if (patternIndex === 1 && noiseTexture.width !== 64) {
        noiseTexture.image = getBlueNoise();
        noiseTexture.width = 64;
        noiseTexture.height = 64;
        noiseTexture.needsUpdate = true;
      }

      const texelsPerPixel = image ? (viewUniforms.uCover.value[0] * image.naturalWidth) / canvas.width : 1;
      viewUniforms.tMask.value = masks[0].texture;
      viewUniforms.uCell.value = cell;
      viewUniforms.uLod.value = Math.log2(Math.max(cell * texelsPerPixel, 1));
      viewUniforms.uPattern.value = patternIndex;
      viewUniforms.uPalette.value = s.palette === 'rgb' ? 1 : 0;
      viewUniforms.uLevels.value = Math.max(2, Math.round(s.levels));
      viewUniforms.uInk.value = hexToRgb(s.inkColor);
      viewUniforms.uPaper.value = hexToRgb(s.paperColor);
      viewUniforms.uRimColor.value = hexToRgb(s.rimColor);
      viewUniforms.uRim.value = Math.min(Math.max(s.rim, 0), 0.95);
      viewUniforms.uContrast.value = s.contrast;
      viewUniforms.uBrightness.value = s.brightness;
      viewUniforms.uReverse.value = s.reverse ? 1 : 0;
      const intro = image ? Math.min(1, (now - introStart) / INTRO_MS) : 0;
      viewUniforms.uIntro.value = 1 - Math.pow(1 - intro, 2);
      renderer.render({ scene: viewMesh });

      const busy =
        pointer.inside || wanderOn || presence > 0.002 || bursts.length > 0 || now < trailUntil || (image && intro < 1);
      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      image = img;
      imageTexture.image = img;
      try {
        if (samplerContext) {
          const edge = measureEdge(samplerContext, img);
          viewUniforms.uMatte.value = edge.matte;
          viewUniforms.uKey.value = edge.plain ? 1 : 0;
        }
      } catch {}
      introStart = performance.now();
      wake();
    };
    img.src = src;

    const locate = e => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.placed = true;
    };
    const onMove = e => {
      locate(e);
      if (!pointer.inside) {
        pointer.inside = true;
        pointer.fresh = true;
      }
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };
    const onDown = e => {
      onMove(e);
      if (!settingsRef.current?.clickBurst || (e.pointerType === 'mouse' && e.button !== 0)) return;
      bursts.push({ x: pointer.x, y: pointer.y, start: performance.now() });
      if (bursts.length > MAX_BURSTS) bursts.shift();
    };
    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerenter', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });
    container.addEventListener('pointercancel', onLeave, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      layout();
      wake();
    });
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);

    layout();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      img.onload = null;
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onMove);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointercancel', onLeave);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [src]);

  return <div ref={containerRef} className={`dither-veil ${className}`.trim()} style={style} />;
};

export default DitherVeil;

```

### Component CSS
```css
.dither-veil {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.



## Integrate the <FlexCarousel /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: FlexCarousel
### Variant: JavaScript + CSS
### Dependencies: ogl

---

### Usage Example
```jsx
import FlexCarousel from './FlexCarousel';

const items = [
  { src: '/images/one.jpg', alt: 'A chrome sculpture', title: 'Iridescence' },
  { src: '/images/two.jpg', alt: 'A figure on a white set', title: 'White Room' },
  { src: '/images/three.jpg', alt: 'A clay bust in profile', title: 'Clay Study', subtitle: 'Studio 04' }
];

<div style={{ width: '100%', height: '560px', position: 'relative' }}>
  <FlexCarousel
    items={items}
    preset="liquid"
    intro="rise"
    cardHeight={0.5}
    gap={12}
    squeeze={0.2}
    focusOnClick
    captions
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | Array<{ src: string; alt?: string; title?: string; subtitle?: string }> | 12 sample photos | Images shown in the row. Each keeps its natural aspect ratio unless fit is set. The alt text is announced to screen readers, the title and optional subtitle are shown above the row. |
| preset | 'liquid' | 'ribbon' | 'vortex' | 'arch' | 'liquid' | A starting shape for the invisible glass. Every lens prop below overrides the preset value when you pass it. |
| intro | 'rise' | 'bloom' | 'spin' | 'deal' | 'none' | 'rise' | Entrance once the images load. Rise lifts the cards in from below, bloom fades them in while the bend forms, spin lands a fast flick, deal spreads the cards from the middle. Any input skips it. |
| fit | 'natural' | 'portrait' | 'square' | 'landscape' | 'natural' | Card shape. Natural keeps each image uncropped, the others crop every card to the same shape. |
| cardHeight | number | 0.5 | Card height as a fraction of the container height. |
| gap | number | 12 | Space between cards, in px. |
| radius | number | 0 | Corner radius of the cards, in px. |
| lensWidth | number | from preset | Width of the invisible glass as a fraction of the container width. |
| lensHeight | number | from preset | Height of the invisible glass as a fraction of the container width, so the bend keeps its shape at any size. |
| tilt | number | from preset | Rotation of the glass in degrees. It decides where its edge crosses the row. |
| roundness | number | from preset | Shape of the glass, from a rounded rectangle at 0 to a perfect ellipse at 1. |
| bend | number | from preset | How far the row flexes where it passes the edge of the glass. The glass itself is never drawn and the images always stay connected. |
| reach | number | from preset | Width of the curved edge of the glass. Small values give a tight kink, large values a long smooth bend. |
| curl | 'twist' | 'rise' | 'fall' | from preset | Which way the ends of the row flex. Twist sends the left end down and the right end up, rise lifts both, fall drops both. |
| dispersion | number | from preset | Rainbow splitting of light, only where the edge of the glass bends the images. |
| liquid | number | from preset | How much the glass stretches and wobbles like a liquid when the row moves. Off in every preset. |
| followCursor | boolean | from preset | Let the lens drift after the cursor like a loupe, and return to the center when it leaves. |
| squeeze | number | 0.2 | How much the cards shrink while the row moves fast. 0 keeps them at full size. |
| focusOnClick | boolean | true | Clicking a card centers it and opens it: the others part, the bend melts away and the card grows. Click, drag, scroll or Escape closes it. |
| autoplay | boolean | false | Advance one card at a time. Pauses on hover, focus and interaction, and when reduced motion is on. |
| interval | number | 4 | Seconds between autoplay steps. |
| captions | boolean | true | Show the title of the centered card above the row and a counter below it. |
| captureWheel | boolean | true | Let a vertical mouse wheel scroll the carousel while hovering. Horizontal wheels and trackpads always scroll it. |
| onChange | (index: number, item) => void | - | Called whenever a different card reaches the center. |
| onSelect | (index: number, item) => void | - | Called when the centered card is clicked or Enter is pressed. Clicking a side card centers it first. |
| className | string | '' | Extra classes on the container. |
| style | CSSProperties | - | Inline styles on the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Plane, Texture, RenderTarget } from 'ogl';

import './FlexCarousel.css';

const photo = id => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=max`;

const DEFAULT_ITEMS = [
  {
    src: photo('photo-1737071371043-761e02b1ef95'),
    alt: 'An iridescent chrome sculpture of a head',
    title: 'Iridescence'
  },
  {
    src: photo('photo-1693645325828-62cd35c8da8f'),
    alt: 'A person in dark clothes standing in front of a white backdrop',
    title: 'White Room'
  },
  { src: photo('photo-1739056238917-d89cd05c48d5'), alt: 'A twisted chrome form on black', title: 'Liquid Metal' },
  { src: photo('photo-1747191092806-c7da11881986'), alt: 'A clay bust shown in profile', title: 'Clay Study' },
  { src: photo('photo-1605034313761-73ea4a0cfbf3'), alt: 'Black and white low top sneakers', title: 'Low Tops' },
  { src: photo('photo-1495462911434-be47104d70fa'), alt: 'A woman in a wide black hat', title: 'Brim' },
  {
    src: photo('photo-1786835568925-20cd20007ed0'),
    alt: 'Three swirling shapes in white, gold and silver on grey',
    title: 'Three Forms'
  },
  { src: photo('photo-1770249196550-ff6c641165cb'), alt: 'A chrome humanoid sculpture', title: 'Automaton' },
  {
    src: photo('photo-1787181875088-087d612262a7'),
    alt: 'A black textured sculpture with an opening at its center',
    title: 'Obsidian'
  },
  {
    src: photo('photo-1770062422885-2dfcbe8fb65b'),
    alt: 'A woman in a white shirt crouching on a dark set',
    title: 'Poise'
  },
  { src: photo('photo-1726910133626-9b573eca70ff'), alt: 'Black curved shapes stacked like a fan', title: 'Fins' },
  { src: photo('photo-1604854574958-59047362c165'), alt: 'A white plaster bust on a black table', title: 'Plaster' }
];

const BEND_PRESETS = {
  liquid: {
    lensWidth: 0.74,
    lensHeight: 1.18,
    tilt: 62,
    roundness: 1,
    bend: 0.34,
    reach: 0.38,
    curl: 'twist',
    dispersion: 0.45,
    liquid: 0,
    followCursor: false
  },
  ribbon: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.34,
    reach: 0.34,
    curl: 'twist',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  },
  vortex: {
    lensWidth: 0.7,
    lensHeight: 0.95,
    tilt: 30,
    roundness: 1,
    bend: 0.46,
    reach: 0.3,
    curl: 'twist',
    dispersion: 0.5,
    liquid: 0,
    followCursor: false
  },
  arch: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.3,
    reach: 0.36,
    curl: 'rise',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  }
};

const FIT_ASPECT = { portrait: 0.75, square: 1, landscape: 4 / 3 };
const TAPS = 12;
const PIXEL_BUDGET = 4.5e6;
const INTRO_DURATION = { rise: 2.1, bloom: 1.6, spin: 2.2, deal: 1.5, fade: 0.35 };

const wrap = (value, size) => ((((value + size / 2) % size) + size) % size) - size / 2;
const clamp01 = value => Math.min(Math.max(value, 0), 1);
const easeOut = value => 1 - Math.pow(1 - clamp01(value), 3);
const easeOutQuint = value => 1 - Math.pow(1 - clamp01(value), 5);
const easeInOut = value => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const cardVertex = `#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`;

const cardFragment = `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uShift;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  scale /= 1.08;
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  uv.x += uShift * (1.0 - scale.x) * 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`;

const lensVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const lensFragment = `#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
uniform float uSceneAlpha;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);

  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 drift = vec2(0.0, -lift) - swirl;
  vec2 shifted = uv + drift / uResolution;

  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));

  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${TAPS}; i++) {
      float s = (float(i) + 0.5) / float(${TAPS});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }

  fragColor = color * uSceneAlpha;
}
`;

const Digits = ({ value }) => (
  <span className="flex-carousel__digits">
    {String(value)
      .padStart(2, '0')
      .split('')
      .map((digit, index) => (
        <span key={index} className="flex-carousel__digit">
          <span className="flex-carousel__reel" style={{ transform: `translateY(${-Number(digit) * 10}%)` }}>
            {'0123456789'.split('').map(n => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
  </span>
);

const FlexCarousel = ({
  items = DEFAULT_ITEMS,
  preset = 'liquid',
  intro = 'rise',
  cardHeight = 0.5,
  gap = 12,
  radius = 0,
  fit = 'natural',
  lensWidth,
  lensHeight,
  tilt,
  roundness,
  bend,
  reach,
  curl,
  dispersion,
  liquid,
  followCursor,
  squeeze = 0.2,
  focusOnClick = true,
  autoplay = false,
  interval = 4,
  captions = true,
  captureWheel = true,
  onChange,
  onSelect,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const settingsRef = useRef(null);
  const itemsRef = useRef(items);
  const engineRef = useRef(null);
  const callbacksRef = useRef({ onChange, onSelect });
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);

  const base = BEND_PRESETS[preset] || BEND_PRESETS.liquid;
  const pick = (value, key) => (value === undefined || value === null ? base[key] : value);

  const list = items && items.length ? items : DEFAULT_ITEMS;
  const itemsKey = list.map(item => item.src).join('|');

  useEffect(() => {
    itemsRef.current = list;
    callbacksRef.current = { onChange, onSelect };
    settingsRef.current = {
      intro,
      cardHeight,
      gap,
      radius,
      fit,
      lensWidth: pick(lensWidth, 'lensWidth'),
      lensHeight: pick(lensHeight, 'lensHeight'),
      tilt: pick(tilt, 'tilt'),
      roundness: pick(roundness, 'roundness'),
      bend: pick(bend, 'bend'),
      reach: pick(reach, 'reach'),
      curl: pick(curl, 'curl'),
      dispersion: pick(dispersion, 'dispersion'),
      liquid: pick(liquid, 'liquid'),
      followCursor: pick(followCursor, 'followCursor'),
      squeeze,
      focusOnClick,
      autoplay,
      interval,
      captureWheel
    };
    engineRef.current?.wake();
  });

  useEffect(() => {
    engineRef.current?.setItems(itemsRef.current);
  }, [itemsKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false
    });
    const gl = renderer.gl;
    if (!renderer.isWebgl2) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return undefined;
    }
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');
    container.prepend(canvas);

    const cardProgram = new Program(gl, {
      vertex: cardVertex,
      fragment: cardFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tMap: { value: new Texture(gl) },
        uRect: { value: [0, 0, 1, 1] },
        uResolution: { value: [1, 1] },
        uSize: { value: [1, 1] },
        uImage: { value: [1, 1] },
        uRadius: { value: 16 },
        uAlpha: { value: 1 },
        uReady: { value: 0 },
        uShift: { value: 0 },
        uDpr: { value: 1 },
        uPlaceholder: { value: [0.5, 0.5, 0.5] }
      }
    });
    cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram });

    const target = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR_MIPMAP_LINEAR,
      magFilter: gl.LINEAR
    });

    const lensUniforms = {
      tScene: { value: target.texture },
      uResolution: { value: [1, 1] },
      uDpr: { value: 1 },
      uCenter: { value: [0, 0] },
      uHalf: { value: [1, 1] },
      uAngle: { value: 0 },
      uExponent: { value: 2 },
      uInner: { value: 60 },
      uOuter: { value: 80 },
      uFlow: { value: 0 },
      uCurl: { value: 0 },
      uDispersion: { value: 0 },
      uStrength: { value: 0 },
      uSceneAlpha: { value: 0 }
    };
    const lensMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: lensVertex,
        fragment: lensFragment,
        uniforms: lensUniforms,
        depthTest: false,
        depthWrite: false
      })
    });

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const anisotropy = renderer.getExtension('EXT_texture_filter_anisotropic') ? 8 : 0;

    let slots = [];
    let width = 1;
    let height = 1;
    let pos = 0;
    let vel = 0;
    let goal = 0;
    let mode = 'spring';
    let wheelAt = 0;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let alive = true;
    let dirty = true;
    let activeIndex = -1;
    let interactedAt = -Infinity;
    let autoplayAt = performance.now();
    let hasFocus = false;
    let deform = 0;
    let deformVel = 0;
    let layout = null;
    let resnap = false;
    let hover = '';
    let lift = 1;
    let energy = 0;
    let lastPos = 0;
    const lens = { x: 0, y: 0, vx: 0, vy: 0, ready: false };
    const pointer = {
      x: 0,
      y: 0,
      over: false,
      down: false,
      id: -1,
      startX: 0,
      startY: 0,
      startPos: 0,
      dragging: false,
      touch: false,
      samples: []
    };
    const introState = { kind: 'none', t: 0, running: false, done: false, readyAt: 0 };
    const focus = { index: -1, pending: -1, t: 0, v: 0, target: 0 };
    let instances = [];

    const loadSlot = (item, index) => {
      const texture = new Texture(gl, {
        generateMipmaps: true,
        minFilter: gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR,
        anisotropy
      });
      const slot = {
        item,
        index,
        texture,
        aspect: 0.8,
        loaded: false,
        failed: false,
        ready: 0,
        color: [0.5, 0.5, 0.5],
        image: [1, 1],
        dispose: () => {}
      };
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.decoding = 'async';
      image.onload = () => {
        if (!alive || !slots.includes(slot)) return;
        texture.image = image;
        texture.update();
        slot.image = [image.naturalWidth || 1, image.naturalHeight || 1];
        slot.aspect = slot.image[0] / slot.image[1];
        try {
          const probe = document.createElement('canvas');
          probe.width = 8;
          probe.height = 8;
          const ctx = probe.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(image, 0, 0, 8, 8);
            const data = ctx.getImageData(0, 0, 8, 8).data;
            const avg = [0, 0, 0];
            for (let i = 0; i < data.length; i += 4) {
              avg[0] += data[i];
              avg[1] += data[i + 1];
              avg[2] += data[i + 2];
            }
            slot.color = avg.map(v => v / 64 / 255);
          }
        } catch {
          slot.color = [0.5, 0.5, 0.5];
        }
        slot.loaded = true;
        dirty = true;
        start();
      };
      image.onerror = () => {
        if (!alive) return;
        slot.failed = true;
        dirty = true;
        start();
      };
      image.src = item.src;
      slot.dispose = () => {
        image.onload = null;
        image.onerror = null;
        gl.deleteTexture(texture.texture);
      };
      return slot;
    };

    const setItems = next => {
      slots.forEach(slot => slot.dispose());
      slots = next.map(loadSlot);
      activeIndex = -1;
      layout = null;
      resnap = true;
      focus.target = 0;
      focus.t = 0;
      focus.v = 0;
      focus.pending = -1;
      setFocusOpen(false);
      introState.readyAt = performance.now();
      dirty = true;
      start();
    };

    const metrics = s => {
      const cardH = Math.max(24, s.cardHeight * height);
      const fixed = FIT_ASPECT[s.fit];
      const widths = slots.map(slot => (fixed || slot.aspect) * cardH);
      const centers = [];
      let cursor = 0;
      for (let i = 0; i < widths.length; i++) {
        centers.push(cursor + widths[i] / 2);
        cursor += widths[i] + s.gap;
      }
      return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) };
    };

    const nearest = (m, at) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < m.centers.length; i++) {
        const dist = Math.abs(wrap(m.centers[i] - at, m.loop));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    };

    const snapPoint = (m, at) => {
      const i = nearest(m, at);
      return at + wrap(m.centers[i] - at, m.loop);
    };

    const remap = (from, to, at) => {
      const i = nearest(from, at);
      const offset = wrap(at - from.centers[i], from.loop);
      const cycles = Math.round((at - offset - from.centers[i]) / from.loop);
      return cycles * to.loop + to.centers[i] + offset * (to.widths[i] / from.widths[i]);
    };

    const step = (m, delta) => {
      let at = snapPoint(m, goal);
      let index = nearest(m, at);
      const n = m.centers.length;
      for (let k = 0; k < Math.abs(delta); k++) {
        const next = (index + (delta > 0 ? 1 : n - 1)) % n;
        const distance =
          delta > 0
            ? m.widths[index] / 2 + m.gap + m.widths[next] / 2
            : -(m.widths[next] / 2 + m.gap + m.widths[index] / 2);
        at += distance;
        index = next;
      }
      goal = at;
      mode = 'spring';
      dirty = true;
      start();
    };

    const goTo = (m, index) => {
      const i = ((index % m.centers.length) + m.centers.length) % m.centers.length;
      goal = goal + wrap(m.centers[i] - goal, m.loop);
      mode = 'spring';
      dirty = true;
      start();
    };

    const openFocus = index => {
      focus.index = index;
      focus.pending = -1;
      focus.target = 1;
      setFocusOpen(true);
      dirty = true;
      start();
    };

    const closeFocus = () => {
      focus.pending = -1;
      if (focus.target === 0) return false;
      focus.target = 0;
      setFocusOpen(false);
      dirty = true;
      start();
      return true;
    };

    const skipIntro = () => {
      if (introState.running) introState.t = 1;
    };

    const introEffects = () => {
      const t = introState.running ? introState.t : introState.done ? 1 : 0;
      const e = { sceneAlpha: 1, strength: 1, card: null };
      if (!introState.done && !introState.running) {
        e.sceneAlpha = 0;
        e.strength = 0;
        return e;
      }
      if (t >= 1) return e;
      const kind = introState.kind;
      if (kind === 'rise') {
        e.strength = easeInOut((t - 0.3) / 0.65);
        e.card = rel => {
          const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.34;
          const local = clamp01((t - delay) / 0.6);
          return {
            alpha: clamp01(local * 4),
            x: 0,
            y: (1 - easeOutQuint(local)) * height * 0.62,
            scale: 0.5 + 0.5 * easeInOut((local - 0.18) / 0.82)
          };
        };
      } else if (kind === 'bloom') {
        e.strength = easeInOut((t - 0.2) / 0.8);
        e.card = rel => {
          const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.25;
          const local = easeOut((t - delay) / 0.55);
          return { alpha: local, x: 0, y: 0, scale: 0.92 + 0.08 * local };
        };
      } else if (kind === 'spin') {
        e.sceneAlpha = easeOut(t / 0.25);
        e.strength = easeOut((t - 0.55) / 0.45);
      } else if (kind === 'deal') {
        e.strength = easeOut((t - 0.45) / 0.5);
        e.card = rel => {
          const spread = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.3;
          const local = easeOut((t - 0.12 - spread) / 0.5);
          return { alpha: easeOut((t - spread) / 0.12), x: -rel * (1 - local), y: 0, scale: 1 };
        };
      } else {
        e.sceneAlpha = easeOut(t);
        e.strength = easeOut(t);
      }
      return e;
    };

    const beginIntro = (s, m) => {
      const kind = reducedMotion && s.intro !== 'none' ? 'fade' : s.intro;
      introState.kind = INTRO_DURATION[kind] ? kind : 'none';
      introState.running = introState.kind !== 'none';
      introState.done = !introState.running;
      introState.t = 0;
      if (introState.done) setRevealed(true);
      if (introState.kind === 'spin') {
        const distance = m.loop * 1.6 + width;
        pos = goal + distance;
        vel = -distance * 3;
        mode = 'spring';
      }
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
      renderer.setSize(width, height);
      target.setSize(Math.max(2, Math.round(width * renderer.dpr)), Math.max(2, Math.round(height * renderer.dpr)));
      lensUniforms.tScene.value = target.texture;
      dirty = true;
      start();
    };

    const frame = now => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      if (!s || !slots.length) {
        if (visible) raf = requestAnimationFrame(frame);
        return;
      }

      const m = metrics(s);
      const n = slots.length;
      let animating = false;

      if (resnap) {
        goal = snapPoint(m, goal);
        pos = goal;
        vel = 0;
        resnap = false;
      } else if (layout && layout.loop !== m.loop) {
        pos = remap(layout, m, pos);
        goal = remap(layout, m, goal);
        pointer.startPos = pos + (pointer.x - pointer.startX);
        animating = true;
      }
      layout = m;

      if (!introState.running && !introState.done) {
        const allSettled = slots.every(slot => slot.loaded || slot.failed);
        if (allSettled || now - introState.readyAt > 3500) {
          goal = snapPoint(m, goal);
          pos = goal;
          beginIntro(s, m);
        }
      }
      if (introState.running) {
        introState.t = Math.min(1, introState.t + dt / (INTRO_DURATION[introState.kind] || 1));
        if (introState.t >= 1) {
          introState.running = false;
          introState.done = true;
          setRevealed(true);
        }
        animating = true;
      }

      if (mode === 'wheel' && now - wheelAt > 150) {
        goal = snapPoint(m, goal);
        mode = 'spring';
      }
      if (!pointer.dragging) {
        const spinning = introState.running && introState.kind === 'spin';
        const stiffness = spinning ? 9 : mode === 'wheel' ? 80 : 55;
        const damping = 2 * Math.sqrt(stiffness);
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          const acc = stiffness * (goal - pos) - damping * vel;
          vel += acc * h;
          pos += vel * h;
        }
        if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) {
          pos = goal;
          vel = 0;
        } else {
          animating = true;
        }
      } else {
        animating = true;
      }

      if (Math.abs(pos) > m.loop * 8) {
        const shift = Math.round(pos / m.loop) * m.loop;
        pos -= shift;
        goal -= shift;
        pointer.startPos -= shift;
      }

      const current = nearest(m, pos);
      if (current !== activeIndex) {
        activeIndex = current;
        setActive(current);
        callbacksRef.current.onChange?.(current, itemsRef.current[current]);
      }

      if (focus.pending >= 0 && mode === 'spring' && Math.abs(goal - pos) < 1.5 && Math.abs(vel) < 30) {
        if (current === focus.pending) openFocus(current);
        else focus.pending = -1;
      }

      if (
        s.autoplay &&
        !reducedMotion &&
        introState.done &&
        focus.target === 0 &&
        focus.t < 0.01 &&
        !pointer.over &&
        !pointer.down &&
        !hasFocus &&
        mode === 'spring' &&
        Math.abs(goal - pos) < 1 &&
        now - interactedAt > 3000 &&
        now - autoplayAt > s.interval * 1000
      ) {
        autoplayAt = now;
        step(m, 1);
      }
      if (s.autoplay && !reducedMotion) animating = true;

      const travel = Math.abs(pos - lastPos) / dt;
      lastPos = pos;
      const energyTarget = reducedMotion ? 0 : Math.min(travel / 2600, 1);
      energy += (energyTarget - energy) * (1 - Math.exp(-dt / (energyTarget > energy ? 0.07 : 0.35)));
      if (energy > 0.001) animating = true;
      const liquidAmount = reducedMotion ? 0 : s.liquid;
      const push = Math.max(-1, Math.min(1, vel / 2200));
      const deformStiffness = 120;
      const deformDamping = 2 * Math.sqrt(deformStiffness) * 0.32;
      deformVel += (deformStiffness * (push - deform) - deformDamping * deformVel) * dt;
      deform += deformVel * dt;
      if (Math.abs(deform) > 0.0005 || Math.abs(deformVel) > 0.005) animating = true;

      const focusStiffness = 64;
      focus.v += (focusStiffness * (focus.target - focus.t) - 2 * Math.sqrt(focusStiffness) * focus.v) * dt;
      focus.t += focus.v * dt;
      if (Math.abs(focus.target - focus.t) < 0.0005 && Math.abs(focus.v) < 0.001) {
        focus.t = focus.target;
        focus.v = 0;
      } else {
        animating = true;
      }
      const focusAmount = clamp01(focus.t);
      const focusEase = easeInOut(focusAmount);
      const focusW = focus.index >= 0 && focus.index < n ? m.widths[focus.index] : m.cardH;
      const focusScale = Math.max(1, Math.min(1.3, (height * 0.84) / m.cardH, (width * 0.92) / focusW));
      const nextLift = 1 + (focusScale - 1) * focusEase;
      if (Math.abs(nextLift - lift) > 0.0005) {
        lift = nextLift;
        container.style.setProperty('--flex-carousel-lift', lift.toFixed(4));
      }

      const effects = introEffects();

      const homeX = width / 2;
      const homeY = height / 2;
      const follow = s.followCursor && pointer.over && !pointer.dragging && !pointer.touch && focus.target === 0;
      const aimX = follow ? pointer.x : homeX;
      const aimY = follow ? pointer.y : homeY;
      if (!lens.ready) {
        lens.x = homeX;
        lens.y = homeY;
        lens.ready = true;
      }
      const lensK = 110;
      const lensC = 2 * Math.sqrt(lensK) * 0.8;
      lens.vx += (lensK * (aimX - lens.x) - lensC * lens.vx) * dt;
      lens.vy += (lensK * (aimY - lens.y) - lensC * lens.vy) * dt;
      lens.x += lens.vx * dt;
      lens.y += lens.vy * dt;
      if (Math.abs(aimX - lens.x) + Math.abs(aimY - lens.y) > 0.2 || Math.abs(lens.vx) + Math.abs(lens.vy) > 0.5)
        animating = true;

      const cardH = m.cardH;
      let halfW = (s.lensWidth * width) / 2;
      let halfH = (s.lensHeight * width) / 2;
      const squash = Math.abs(deform) * liquidAmount;
      halfW *= 1 + squash * 0.16;
      halfH *= 1 - squash * 0.08;
      const lensX = lens.x - deform * 14 * liquidAmount;

      for (let i = 0; i < n; i++) {
        const slot = slots[i];
        if (slot.loaded && slot.ready < 1) {
          slot.ready = Math.min(1, slot.ready + dt / 0.45);
          animating = true;
        }
      }

      const waiting = !introState.done;
      if (dirty || animating || pointer.dragging) {
        dirty = false;
        instances = [];
        const dpr = renderer.dpr;
        cardProgram.uniforms.uResolution.value = [width, height];
        cardProgram.uniforms.uDpr.value = dpr;
        cardProgram.uniforms.uRadius.value = s.radius;
        const shrink = 1 - clamp01(s.squeeze) * energy;
        const draws = [];
        for (let i = 0; i < n; i++) {
          const w = m.widths[i];
          const baseRel = wrap(m.centers[i] - pos, m.loop);
          for (let k = -3; k <= 3; k++) {
            const rel = baseRel + k * m.loop;
            if (Math.abs(rel) - w / 2 > width + 40) continue;
            const fx = effects.card ? effects.card(rel) : null;
            let x = homeX + rel + (fx ? fx.x : 0);
            let scale = shrink * (fx ? fx.scale : 1);
            let alpha = fx ? fx.alpha : 1;
            if (focusAmount > 0) {
              if (i === focus.index && Math.abs(rel) < w) {
                scale *= 1 + (focusScale - 1) * focusEase;
              } else {
                const order = Math.min(Math.abs(rel) / width, 1) * 0.25;
                const part = easeInOut(focusAmount * 1.25 - order);
                x += Math.sign(rel) * part * width * 0.7;
                alpha *= 1 - part;
              }
            }
            const cw = w * scale;
            if (alpha <= 0.001 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue;
            draws.push({ i, rel, x, y: homeY + (fx ? fx.y : 0), cw, ch: cardH * scale, alpha });
          }
        }
        draws.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel));
        let first = true;
        for (const draw of draws) {
          const slot = slots[draw.i];
          cardProgram.uniforms.tMap.value = slot.texture;
          cardProgram.uniforms.uRect.value = [draw.x, draw.y, draw.cw + 2, draw.ch + 2];
          cardProgram.uniforms.uSize.value = [draw.cw, draw.ch];
          cardProgram.uniforms.uImage.value = slot.image;
          cardProgram.uniforms.uAlpha.value = draw.alpha;
          cardProgram.uniforms.uReady.value = slot.ready;
          cardProgram.uniforms.uShift.value = reducedMotion ? 0 : Math.max(-1, Math.min(1, draw.rel / (width * 0.75)));
          cardProgram.uniforms.uPlaceholder.value = slot.color;
          renderer.render({ scene: cardMesh, target, clear: first });
          first = false;
          instances.push({
            index: draw.i,
            x0: draw.x - draw.cw / 2,
            x1: draw.x + draw.cw / 2,
            y0: draw.y - draw.ch / 2,
            y1: draw.y + draw.ch / 2
          });
        }
        if (first) {
          renderer.bindFramebuffer(target);
          gl.viewport(0, 0, target.width, target.height);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        renderer.bindFramebuffer();
        target.texture.bind();
        gl.generateMipmap(gl.TEXTURE_2D);

        lensUniforms.uResolution.value = [width, height];
        lensUniforms.uDpr.value = dpr;
        lensUniforms.uCenter.value = [lensX, lens.y];
        lensUniforms.uHalf.value = [Math.max(halfW, 1), Math.max(halfH, 1)];
        lensUniforms.uAngle.value = (s.tilt * Math.PI) / 180;
        lensUniforms.uExponent.value = 2 + Math.pow(1 - clamp01(s.roundness), 1.5) * 10;
        const spanW = Math.max(halfW, 1);
        const spanH = Math.max(halfH, 1);
        const inner = Math.max(4, s.reach * (spanW + spanH) * 0.5);
        lensUniforms.uInner.value = inner;
        lensUniforms.uOuter.value = inner * 1.6;
        lensUniforms.uFlow.value = s.bend * (spanW + spanH) * 0.45;
        lensUniforms.uCurl.value = s.curl === 'rise' ? 1 : s.curl === 'fall' ? -1 : 0;
        lensUniforms.uDispersion.value = s.dispersion * 0.12 * (1 + Math.abs(deform) * liquidAmount * 1.2);
        lensUniforms.uStrength.value = effects.strength * (1 - focusEase);
        lensUniforms.uSceneAlpha.value = effects.sceneAlpha;
        renderer.render({ scene: lensMesh });
      }

      let nextHover = '';
      if (pointer.over && !pointer.dragging && introState.done && s.focusOnClick) {
        const hit = instances.find(
          inst => pointer.x >= inst.x0 && pointer.x <= inst.x1 && pointer.y >= inst.y0 && pointer.y <= inst.y1
        );
        if (focus.target > 0) nextHover = 'close';
        else if (hit) nextHover = 'open';
      }
      if (nextHover !== hover) {
        hover = nextHover;
        if (hover) container.setAttribute('data-hover', hover);
        else container.removeAttribute('data-hover');
      }

      if (visible && (animating || waiting || dirty || pointer.down)) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const localPoint = e => {
      const rect = container.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onPointerDown = e => {
      if (e.button !== undefined && e.button > 0) return;
      skipIntro();
      const [x, y] = localPoint(e);
      pointer.down = true;
      pointer.id = e.pointerId;
      pointer.touch = e.pointerType === 'touch';
      pointer.startX = x;
      pointer.startY = y;
      pointer.x = x;
      pointer.y = y;
      pointer.startPos = pos;
      pointer.dragging = false;
      pointer.samples = [{ x, t: performance.now() }];
      interactedAt = performance.now();
      if (Math.abs(vel) > 40) {
        goal = pos;
        vel = 0;
      }
      dirty = true;
      start();
    };

    const onPointerMove = e => {
      const [x, y] = localPoint(e);
      pointer.x = x;
      pointer.y = y;
      pointer.over = true;
      if (pointer.down && e.pointerId === pointer.id) {
        const dx = x - pointer.startX;
        const dy = y - pointer.startY;
        const slop = pointer.touch ? 10 : 5;
        if (!pointer.dragging) {
          if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
            pointer.down = false;
            return;
          }
          if (Math.abs(dx) > slop) {
            pointer.dragging = true;
            pointer.startX = x;
            pointer.startPos = pos;
            closeFocus();
            try {
              container.setPointerCapture(e.pointerId);
            } catch {
              pointer.dragging = true;
            }
            container.setAttribute('data-dragging', '');
          }
        }
        if (pointer.dragging) {
          pos = pointer.startPos - (x - pointer.startX);
          goal = pos;
          vel = 0;
          const now = performance.now();
          pointer.samples.push({ x, t: now });
          while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100) pointer.samples.shift();
        }
      }
      dirty = true;
      start();
    };

    const onPointerUp = e => {
      if (!pointer.down || e.pointerId !== pointer.id) return;
      pointer.down = false;
      container.removeAttribute('data-dragging');
      const s = settingsRef.current;
      if (!s) return;
      const m = metrics(s);
      interactedAt = performance.now();
      if (pointer.dragging) {
        pointer.dragging = false;
        const now = performance.now();
        const first = pointer.samples[0];
        const lastSample = pointer.samples[pointer.samples.length - 1];
        let velocity = 0;
        if (first && lastSample && lastSample.t > first.t && now - lastSample.t < 70) {
          velocity = -((lastSample.x - first.x) / (lastSample.t - first.t)) * 1000;
        }
        vel = velocity;
        const landing = snapPoint(m, pos + velocity * 0.32);
        goal = landing;
        if (Math.abs(velocity) > 400 && Math.abs(landing - pos) < 1) step(m, velocity > 0 ? 1 : -1);
        mode = 'spring';
        start();
        return;
      }
      if (closeFocus()) return;
      const [x, y] = localPoint(e);
      const hit = instances.find(inst => x >= inst.x0 && x <= inst.x1 && y >= inst.y0 && y <= inst.y1);
      if (!hit) return;
      if (hit.index === activeIndex && Math.abs(goal - pos) < 2) {
        callbacksRef.current.onSelect?.(hit.index, itemsRef.current[hit.index]);
        if (s.focusOnClick) openFocus(hit.index);
      } else {
        const rel = (hit.x0 + hit.x1) / 2 - width / 2;
        goal = snapPoint(m, pos + rel);
        mode = 'spring';
        if (s.focusOnClick) focus.pending = hit.index;
        start();
      }
    };

    const onPointerLeave = () => {
      pointer.over = false;
      dirty = true;
      start();
    };

    const onPointerCancel = () => {
      pointer.down = false;
      pointer.dragging = false;
      container.removeAttribute('data-dragging');
      const s = settingsRef.current;
      if (!s) return;
      goal = snapPoint(metrics(s), pos);
      mode = 'spring';
      start();
    };

    const onWheel = e => {
      const s = settingsRef.current;
      if (!s || e.ctrlKey) return;
      let dx = e.deltaX;
      let dy = e.deltaY;
      if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) {
        dx = dy;
        dy = 0;
      }
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      if (!horizontal && !s.captureWheel) return;
      e.preventDefault();
      skipIntro();
      interactedAt = performance.now();
      if (closeFocus()) return;
      const delta = Math.max(-120, Math.min(120, (horizontal ? dx : dy) * unit));
      goal += delta * 1.25;
      mode = 'wheel';
      wheelAt = performance.now();
      start();
    };

    const onKeyDown = e => {
      const s = settingsRef.current;
      if (!s) return;
      const m = metrics(s);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        skipIntro();
        closeFocus();
        interactedAt = performance.now();
        step(m, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        skipIntro();
        closeFocus();
        interactedAt = performance.now();
        step(m, -1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        closeFocus();
        goTo(m, 0);
      } else if (e.key === 'End') {
        e.preventDefault();
        closeFocus();
        goTo(m, slots.length - 1);
      } else if (e.key === 'Escape') {
        if (closeFocus()) e.preventDefault();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (closeFocus() || activeIndex < 0) return;
        callbacksRef.current.onSelect?.(activeIndex, itemsRef.current[activeIndex]);
        if (s.focusOnClick) openFocus(activeIndex);
      }
    };

    const onFocus = () => {
      hasFocus = true;
    };
    const onBlur = () => {
      hasFocus = false;
    };
    const onVisibility = () => {
      if (!document.hidden) start();
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointercancel', onPointerCancel);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('focus', onFocus);
    container.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(container);

    engineRef.current = {
      wake: () => {
        dirty = true;
        start();
      },
      setItems
    };

    resize();
    setItems(itemsRef.current);

    return () => {
      alive = false;
      visible = false;
      engineRef.current = null;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
      container.removeEventListener('focus', onFocus);
      container.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      slots.forEach(slot => slot.dispose());
      slots = [];
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  const current = list[active] || list[0];
  const label = current ? current.title || current.alt || `Image ${active + 1}` : '';

  return (
    <div
      ref={containerRef}
      className={`flex-carousel ${className}`.trim()}
      style={{ ...style, '--flex-carousel-half': `${Math.min(Math.max(cardHeight, 0.05), 1) * 50}%` }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
    >
      {captions && current && revealed && (
        <div className="flex-carousel__caption" aria-hidden="true">
          <span key={active} className="flex-carousel__title">
            {current.title || current.alt}
            {current.subtitle && <span className="flex-carousel__subtitle">{current.subtitle}</span>}
          </span>
          <span className="flex-carousel__count" data-hidden={focusOpen ? '' : undefined}>
            <Digits value={active + 1} />
            <span className="flex-carousel__slash">/</span>
            <span>{String(list.length).padStart(2, '0')}</span>
          </span>
        </div>
      )}
      <div className="flex-carousel__live" aria-live="polite" aria-atomic="true">
        {`${label}, ${active + 1} of ${list.length}`}
      </div>
    </div>
  );
};

export default FlexCarousel;

```

### Component CSS
```css
.flex-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior: contain;
  outline: none;
}

.flex-carousel[data-hover='open'] {
  cursor: zoom-in;
}

.flex-carousel[data-hover='close'] {
  cursor: zoom-out;
}

.flex-carousel[data-dragging] {
  cursor: grabbing;
}

.flex-carousel:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(128, 128, 140, 0.55);
}

.flex-carousel__caption {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% + var(--flex-carousel-half) * var(--flex-carousel-lift, 1) + 22px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  pointer-events: none;
  text-align: center;
  animation: flex-carousel-reveal 900ms ease both;
}

.flex-carousel__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  animation: flex-carousel-title 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.flex-carousel__subtitle {
  font-weight: 400;
  opacity: 0.6;
}

.flex-carousel__count {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  opacity: 0.5;
  transition: opacity 400ms ease;
}

.flex-carousel__count[data-hidden] {
  opacity: 0;
}

.flex-carousel__digits {
  display: inline-flex;
}

.flex-carousel__digit {
  display: inline-block;
  height: 1em;
  overflow: hidden;
}

.flex-carousel__reel {
  display: flex;
  flex-direction: column;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.flex-carousel__reel span {
  height: 1em;
}

.flex-carousel__slash {
  opacity: 0.6;
}

.flex-carousel__live {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes flex-carousel-title {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes flex-carousel-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flex-carousel__caption,
  .flex-carousel__title {
    animation: none;
  }

  .flex-carousel__reel {
    transition: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.



## Integrate the <TechText /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: TechText
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import TechText from './TechText';

<div style={{ width: '100%', height: '480px', position: 'relative' }}>
  <TechText
    text="React Bits"
    fontWeight={600}
    fontSize={150}
    reveal="letter"
    dashLength={4}
    dashGap={2}
    specks={15}
    intro="none"
    introDuration={2}
    clickKick
    guides={false}
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | 'React Bits' | The wordmark to render. |
| fontFamily | string | '' | Any font family loaded on the page. Leave empty to inherit the font of the container. |
| fontWeight | number | 600 | Weight of the wordmark. |
| fontSize | number | 150 | Largest font size in px. The wordmark shrinks to fit narrower containers. |
| letterSpacing | number | -0.05 | Extra space between letters, in em. |
| align | 'left' | 'center' | 'right' | 'center' | Where the wordmark sits across the container. |
| color | string | 'currentColor' | Colour of the letters and their outlines. Follows the surrounding text colour by default. |
| accentColor | string | 'currentColor' | Colour of the selection frame, connector, specks and labels. |
| reveal | 'area' | 'letter' | 'off' | 'letter' | Area fades the letters into outlines inside a circle around the pointer. Letter turns only the active letter into its outline. Off keeps every letter solid. |
| reach | number | 200 | Radius around the pointer where the letters turn into vector outlines, in px. |
| softness | number | 0.7 | How gradually the fill hands over to the outlines. 0 is a hard edge. |
| dashLength | number | 4 | Length of each outline dash, in px. |
| dashGap | number | 2 | Space between outline dashes, in px. |
| lineStyle | 'dashed' | 'solid' | 'dashed' | How the outlines under the pointer are drawn. Only the outer silhouette is traced either way. |
| strokeWidth | number | 1.5 | Thickness of the outline, in px. |
| specks | number | 15 | Tiny squares that blink and respawn around the active letter, seeded per letter. 0 turns them off. |
| selection | boolean | true | Frame the letter under the pointer. The frame glides from letter to letter. |
| labels | boolean | true | Label the frame with the letter and its size, or with its offset while dragged. |
| draggable | boolean | true | Let letters be dragged off the baseline. They spring back home on release. |
| bounce | number | 0.4 | How much a released letter overshoots on its way home, from 0 (none) to 1 (very springy). |
| clickKick | boolean | true | Clicking a letter kicks it upward on its spring and sends a ripple through its neighbours, each leaving its outline behind while it moves. |
| intro | 'none' | 'type' | 'assemble' | 'metrics' | 'none' | Entrance played once the wordmark is in view. Type places each letter as an outline under the selection frame, assemble flies pixel specks into the letters, metrics rules the font lines first and fills the letters zone by zone between them. |
| introDuration | number | 2 | Length of the intro, in seconds. |
| guides | boolean | false | Rule the baseline, x-height, cap height and descender across the wordmark while a letter is active. |
| sweep | boolean | true | Sweep the reveal across the wordmark on its own while the pointer is away. |
| speed | number | 1 | Speed of the idle sweep. |
| className | string | '' | Extra classes on the container. |
| style | CSSProperties | - | Inline styles on the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';

import './TechText.css';

const LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const FALLOFF_STEPS = 8;
const SPRING = 320;
const INHERIT = /^(currentcolor|inherit)$/i;
const INTRO_DELAY = 0.15;
const KICK_DECAY = 0.62;

const approach = (current, target, dt, seconds) => current + (target - current) * (1 - Math.exp(-dt / seconds));

const clamp01 = value => Math.min(1, Math.max(0, Number(value) || 0));

const smoothstep = (edge0, edge1, value) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const noise = (...values) => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = value => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0');

const TechText = ({
  text = 'React Bits',
  fontFamily = '',
  fontWeight = 600,
  fontSize = 150,
  letterSpacing = -0.05,
  color = 'currentColor',
  accentColor = 'currentColor',
  align = 'center',
  reach = 200,
  softness = 0.7,
  dashLength = 4,
  dashGap = 2,
  strokeWidth = 1.5,
  lineStyle = 'dashed',
  reveal = 'letter',
  specks = 15,
  selection = true,
  labels = true,
  draggable = true,
  bounce = 0.4,
  sweep = true,
  speed = 1,
  clickKick = true,
  intro = 'none',
  introDuration = 2,
  guides = false,
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef(null);
  const wakeRef = useRef(() => {});

  useEffect(() => {
    settingsRef.current = {
      text,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      color,
      accentColor,
      align,
      reach,
      softness,
      dashLength,
      dashGap,
      strokeWidth,
      lineStyle,
      reveal,
      specks,
      selection,
      labels,
      draggable,
      bounce,
      sweep,
      speed,
      clickKick,
      intro,
      introDuration,
      guides
    };
    wakeRef.current();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const scratch = document.createElement('canvas');
    const scratchCtx = scratch.getContext('2d');
    if (!container || !canvas || !ctx || !scratchCtx) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let alive = true;
    let layoutKey = '';
    let requestedFont = '';
    let word = null;
    let glyphs = [];
    let presence = 0;
    let clock = 0;
    let pulse = 0;
    let placed = false;
    let dragging = -1;
    let cursor = '';
    let introClock = 0;
    let introKind = '';
    let introducing = false;
    let fontsReady = !document.fonts;
    let guideAlpha = 0;
    const kicks = [];
    const press = { x: 0, y: 0, time: 0, index: -1 };
    const pointer = { x: 0, y: 0, inside: false };
    const grab = { x: 0, y: 0 };
    const lens = { x: 0, y: 0 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    const refreshFonts = () => {
      layoutKey = '';
      wakeRef.current();
    };

    const fontsLoaded = () => {
      fontsReady = true;
      refreshFonts();
    };

    const family = s => s.fontFamily || getComputedStyle(container).fontFamily || 'sans-serif';
    const fontFor = (s, size) => `${s.fontWeight} ${size}px ${family(s)}`;

    const palette = s => {
      const current = getComputedStyle(container).color || '#000000';
      const pick = value => (!value || INHERIT.test(String(value).trim()) ? current : value);
      return { ink: pick(s.color), accent: pick(s.accentColor) };
    };

    const setFont = (target, s, size) => {
      target.font = fontFor(s, size);
      if ('letterSpacing' in target) target.letterSpacing = `${s.letterSpacing * size}px`;
      target.textAlign = 'left';
      target.textBaseline = 'alphabetic';
    };

    const sprite = (s, view, glyph, stroke, ink) => {
      const pad = Math.ceil(s.strokeWidth * 2 + 4);
      const left = glyph.box.x1 - pad;
      const top = glyph.box.y1 - pad;
      const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
      const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      const image = document.createElement('canvas');
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      const c = image.getContext('2d');
      if (!c) return { image, left, top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, s, view.size);
      if (stroke) {
        c.lineJoin = 'round';
        c.lineWidth = s.strokeWidth * 2;
        c.lineCap = 'butt';
        c.strokeStyle = ink;
        if (s.lineStyle !== 'solid') c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
        c.strokeText(glyph.char, glyph.x, view.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = 'destination-out';
        c.fillStyle = '#000000';
        c.fillText(glyph.char, glyph.x, view.baseline);
        c.globalCompositeOperation = 'source-over';
      } else {
        c.fillStyle = ink;
        c.fillText(glyph.char, glyph.x, view.baseline);
      }
      return { image, left, top };
    };

    const ensureLayout = (s, ink) => {
      const key = [
        s.text,
        family(s),
        s.fontWeight,
        s.fontSize,
        s.letterSpacing,
        s.align,
        ink,
        s.dashLength,
        s.dashGap,
        s.strokeWidth,
        s.lineStyle,
        width,
        height,
        dpr
      ].join('|');
      if (key === layoutKey && word) return word;
      layoutKey = key;
      const wanted = fontFor(s, 64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, s.text).then(refreshFonts, refreshFonts);
      }

      const probe = scratchCtx;
      setFont(probe, s, s.fontSize);
      let m = probe.measureText(s.text);
      const fit = Math.min(
        1,
        (width * 0.9) / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1)
      );
      const size = s.fontSize * fit;
      setFont(probe, s, size);
      m = probe.measureText(s.text);
      const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const margin = width * 0.05;
      const start =
        s.align === 'left' ? margin : s.align === 'right' ? width - margin - inkWidth : (width - inkWidth) / 2;
      const x = start + m.actualBoundingBoxLeft;
      const baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;
      const xHeight = baseline - probe.measureText('x').actualBoundingBoxAscent;
      const capHeight = baseline - probe.measureText('H').actualBoundingBoxAscent;
      const ascender = baseline - probe.measureText('d').actualBoundingBoxAscent;
      const descender = baseline + probe.measureText('p').actualBoundingBoxDescent;
      const top = baseline - m.actualBoundingBoxAscent;
      const bottom = baseline + m.actualBoundingBoxDescent;
      const inkTop = Math.min(top, capHeight) - 2;
      const inkBottom = Math.max(bottom, baseline) + 2;
      const next = {
        size,
        baseline,
        left: x - m.actualBoundingBoxLeft,
        right: x + m.actualBoundingBoxRight,
        top,
        bottom,
        lines: [
          { y: baseline, label: 'baseline' },
          { y: xHeight, label: 'x-height' },
          { y: capHeight, label: 'cap height' },
          ...(capHeight - ascender > Math.max(11, size * 0.06) ? [{ y: ascender, label: 'ascender' }] : []),
          { y: descender, label: 'descender' }
        ],
        bands: [
          { y0: xHeight, y1: baseline, up: true, order: 0 },
          { y0: capHeight, y1: xHeight, up: true, order: 1 },
          { y0: inkTop, y1: capHeight, up: true, order: 2 },
          { y0: baseline, y1: inkBottom, up: false, order: 1 }
        ].filter(band => band.y1 - band.y0 > 0.5)
      };
      word = next;

      const chars = Array.from(s.text);
      const previous = glyphs;
      glyphs = [];
      let prefix = '';
      chars.forEach((char, i) => {
        prefix += char;
        const own = probe.measureText(char);
        const gx = x + probe.measureText(prefix).width - own.width;
        if (!char.trim()) return;
        const base = {
          char,
          x: gx,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: baseline + own.actualBoundingBoxDescent
          }
        };
        const kept = previous[glyphs.length];
        glyphs.push({
          ...base,
          offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          outline: 0,
          shown: 1,
          cells: null,
          assembled: 0,
          index: i,
          fill: sprite(s, next, base, false, ink),
          dashes: sprite(s, next, base, true, ink)
        });
      });
      dragging = -1;
      frame.index = -1;
      return next;
    };

    const glyphAt = (x, y) => {
      if (!word || y < word.top - 24 || y > word.bottom + 24) return -1;
      let best = -1;
      let bestDistance = Infinity;
      glyphs.forEach((glyph, i) => {
        const x1 = glyph.box.x1 + glyph.offset.x;
        const x2 = glyph.box.x2 + glyph.offset.x;
        const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 28 ? best : -1;
    };

    const falloff = (target, cx, cy, radius, strength, softness) => {
      const inner = Math.min(1, Math.max(0, 1 - softness));
      const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
      if (inner > 0.995) {
        gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        return gradient;
      }
      for (let i = 0; i <= FALLOFF_STEPS; i++) {
        const t = i / FALLOFF_STEPS;
        const eased = t * t * (3 - 2 * t);
        gradient.addColorStop(inner + (1 - inner) * t, `rgba(0, 0, 0, ${strength * (1 - eased)})`);
      }
      return gradient;
    };

    const blit = (target, art, dx, dy, originX, originY) => {
      target.drawImage(
        art.image,
        Math.round((art.left + dx) * dpr - originX),
        Math.round((art.top + dy) * dpr - originY)
      );
    };

    const drawReveal = s => {
      const radius = s.reach * dpr;
      const cx = lens.x * dpr;
      const cy = lens.y * dpr;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness);
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = 'source-over';

      const x0 = Math.max(0, Math.floor(cx - radius));
      const y0 = Math.max(0, Math.floor(cy - radius));
      const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
      const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
      if (x1 <= x0 || y1 <= y0) return;
      const w = x1 - x0;
      const h = y1 - y0;
      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w);
        scratch.height = Math.max(scratch.height, h);
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      scratchCtx.globalCompositeOperation = 'source-over';
      scratchCtx.clearRect(0, 0, w, h);
      for (const glyph of glyphs) blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0);
      scratchCtx.globalCompositeOperation = 'destination-in';
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness);
      scratchCtx.fillRect(0, 0, w, h);
      scratchCtx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = presence;
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
      ctx.globalAlpha = 1;
    };

    const crisp = value => (Math.round(value * dpr) + 0.5) / dpr;

    const perimeterPoint = (distance, w, h) => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    };

    const drawSpecks = (s, a, accent) => {
      const w = frame.x2 - frame.x1;
      const h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      const perimeter = 2 * (w + h);
      const seed = frame.index + 1;
      const grid = 3;
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;

      for (let k = 0; k < s.specks; k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2;
        const t = pulse / period + noise(seed, k, 17);
        const cycle = Math.floor(t);
        const life = t - cycle;
        if (life > 0.7) continue;
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        const pick = noise(seed, k, cycle, 2);
        const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
        const large = size >= 8;
        const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
        const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
        const tone = noise(seed, k, cycle, 3);
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        const left = Math.round(x - size / 2);
        const top = Math.round(y - size / 2);
        ctx.globalAlpha = alpha;
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeRect(left + 0.5, top + 0.5, size, size);
          if (large && tone > 0.5) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        } else {
          ctx.fillRect(left, top, size, size);
        }
      }

      for (let j = 0; j < 2; j++) {
        const head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
        for (let i = 0; i < 4; i++) {
          const [x, y] = perimeterPoint(head - i * 6, w, h);
          const size = i === 0 ? 3 : 2;
          ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
          ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawFrame = (s, accent) => {
      const glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      const a = frame.alpha;
      const x1 = crisp(frame.x1);
      const y1 = crisp(frame.y1);
      const x2 = crisp(frame.x2);
      const y2 = crisp(frame.y2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;

      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        const hx = (glyph.box.x1 + glyph.box.x2) / 2;
        const hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
        ctx.setLineDash([3, 4]);
        ctx.globalAlpha = 0.45 * a;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        ctx.globalAlpha = 0.7 * a;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.globalAlpha = 0.5 * a;
      ctx.stroke();

      ctx.beginPath();
      for (const [cx, cy] of [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2]
      ]) {
        ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
      }
      ctx.globalAlpha = 0.95 * a;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (s.specks > 0) drawSpecks(s, a, accent);

      if (!s.labels) return;
      ctx.font = LABEL_FONT;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.62 * a;
      const label =
        moved > 1
          ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
          : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
      ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
      ctx.globalAlpha = 1;
    };

    const drawLines = (s, view, accent, alpha, growth) => {
      const pad = Math.max(12, view.size * 0.12);
      const x1 = Math.round(view.left - pad);
      const x2 = Math.round(view.right + pad);
      const room = width - x2 > x1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      ctx.lineWidth = 1;
      ctx.font = LABEL_FONT;
      ctx.textBaseline = 'middle';
      ctx.textAlign = room ? 'left' : 'right';
      view.lines.forEach((line, k) => {
        const grow = growth(k);
        if (grow <= 0.001) return;
        const y = crisp(line.y);
        const end = x1 + (x2 - x1) * grow;
        ctx.globalAlpha = alpha * 0.4;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(end, y);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillRect(x1 - 1, Math.round(line.y) - 1, 3, 3);
        ctx.fillRect(Math.round(end) - 1, Math.round(line.y) - 1, 3, 3);
        if (s.labels) {
          ctx.globalAlpha = alpha * 0.62 * smoothstep(0.7, 1, grow);
          ctx.fillText(line.label, room ? x2 + 8 : x1 - 8, Math.round(line.y));
        }
      });
      ctx.textAlign = 'left';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    };

    const ensureCells = (glyph, view) => {
      if (glyph.cells) return glyph.cells;
      const art = glyph.fill;
      const size = Math.max(3, Math.round(view.size / 26));
      const w = art.image.width;
      const h = art.image.height;
      const source = art.image.getContext('2d');
      const cells = [];
      glyph.cells = cells;
      glyph.assembled = 0;
      if (!source || w < 2 || h < 2) return cells;
      const data = source.getImageData(0, 0, w, h).data;
      const gx = Math.floor(art.left / size) * size;
      const gy = Math.floor(art.top / size) * size;
      const cols = Math.ceil((art.left + w / dpr - gx) / size) + 1;
      const rows = Math.ceil((art.top + h / dpr - gy) / size) + 1;
      const hit = new Uint8Array(cols * rows);
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (data[(py * w + px) * 4 + 3] < 24) continue;
          const cx = Math.floor((art.left + px / dpr - gx) / size);
          const cy = Math.floor((art.top + py / dpr - gy) / size);
          hit[cy * cols + cx] = 1;
        }
      }
      const center = (glyph.box.x1 + glyph.box.x2) / 2;
      const along = clamp01((center - view.left) / Math.max(1, view.right - view.left));
      for (let k = 0; k < hit.length; k++) {
        if (!hit[k]) continue;
        const angle = noise(glyph.index, k, 1) * Math.PI * 2;
        const distance = view.size * (0.25 + 0.6 * noise(glyph.index, k, 2));
        const start = 0.03 + 0.36 * along + 0.12 * noise(glyph.index, k, 3);
        const land = start + 0.3 + 0.14 * noise(glyph.index, k, 4);
        cells.push({
          x: gx + (k % cols) * size,
          y: gy + Math.floor(k / cols) * size,
          size,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance * 0.7,
          start,
          land
        });
        glyph.assembled = Math.max(glyph.assembled, land);
      }
      return cells;
    };

    const cellRect = (x, y, size) => {
      const left = Math.round(x * dpr);
      const top = Math.round(y * dpr);
      return [left, top, Math.round((x + size) * dpr) - left, Math.round((y + size) * dpr) - top];
    };

    const drawAssembling = (glyph, progress, accent) => {
      const cells = glyph.cells || [];
      ctx.save();
      ctx.beginPath();
      let landed = 0;
      for (const cell of cells) {
        if (progress < cell.land) continue;
        const [x, y, w, h] = cellRect(cell.x, cell.y, cell.size);
        ctx.rect(x, y, w, h);
        landed++;
      }
      if (landed) {
        ctx.clip();
        blit(ctx, glyph.fill, 0, 0, 0, 0);
      }
      ctx.restore();
      ctx.fillStyle = accent;
      for (const cell of cells) {
        if (progress < cell.start || progress >= cell.land) continue;
        const u = (progress - cell.start) / (cell.land - cell.start);
        const eased = 1 - Math.pow(1 - u, 4);
        const size = cell.size * (0.4 + 0.6 * eased);
        const x = cell.x + (cell.size - size) / 2 + cell.dx * (1 - eased);
        const y = cell.y + (cell.size - size) / 2 + cell.dy * (1 - eased);
        const [left, top, w, h] = cellRect(x, y, size);
        ctx.globalAlpha = Math.min(1, u * 4) * (0.55 + 0.45 * eased);
        ctx.fillRect(left, top, Math.max(1, w), Math.max(1, h));
      }
      ctx.globalAlpha = 1;
    };

    const drawFilling = (glyph, lead, progress, view) => {
      const art = glyph.fill;
      const left = Math.floor(art.left * dpr);
      const top = Math.floor(art.top * dpr);
      const w = art.image.width + 2;
      const h = art.image.height + 2;
      const fill = clamp01((progress - 0.24 - 0.28 * lead) / 0.48);
      const rects = [];
      for (const band of view.bands) {
        const amount = smoothstep(0.3 * band.order, 0.3 * band.order + 0.4, fill);
        if (amount <= 0) continue;
        const span = (band.y1 - band.y0) * amount;
        const y0 = Math.round((band.up ? band.y1 - span : band.y0) * dpr);
        const y1 = Math.round((band.up ? band.y1 : band.y0 + span) * dpr);
        if (y1 > y0) rects.push([y0, y1 - y0]);
      }
      const outline = smoothstep(0.08 + 0.2 * lead, 0.22 + 0.2 * lead, progress);
      if (outline > 0.001) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(left - 2, top - 2, w + 2, h + 2);
        for (const [y, span] of rects) ctx.rect(left - 2, y, w + 2, span);
        ctx.clip('evenodd');
        ctx.globalAlpha = outline;
        blit(ctx, glyph.dashes, 0, 0, 0, 0);
        ctx.restore();
      }
      if (rects.length) {
        ctx.save();
        ctx.beginPath();
        for (const [y, span] of rects) ctx.rect(left - 2, y, w + 2, span);
        ctx.clip();
        blit(ctx, glyph.fill, 0, 0, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const kick = index => {
      const strength = (word ? word.size : 120) * 11;
      kicks.push({ index, at: pulse, velocity: strength });
      for (let d = 1; d < glyphs.length; d++) {
        const velocity = strength * Math.pow(KICK_DECAY, d);
        if (velocity < 30) break;
        for (const j of [index - d, index + d]) {
          if (j >= 0 && j < glyphs.length) kicks.push({ index: j, at: pulse + d * 0.055, velocity });
        }
      }
      wakeRef.current();
    };

    const tick = now => {
      raf = 0;
      const s = settingsRef.current;
      if (!s) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const { ink, accent } = palette(s);
      const view = ensureLayout(s, ink);
      const damping = 2 * Math.sqrt(SPRING) * (1 - clamp01(s.bounce) * 0.96);

      if (s.intro !== introKind) {
        introKind = s.intro;
        introClock = 0;
      }
      const introOn = introKind !== 'none' && !reducedMotion && glyphs.length > 0;
      if (introOn && fontsReady) introClock += dt;
      const progress = introOn ? clamp01((introClock - INTRO_DELAY) / Math.max(0.3, s.introDuration)) : 1;
      introducing = introOn && progress < 1;

      const sweeping = !introducing && s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
      if (sweeping) clock += dt * s.speed;
      pulse += dt;
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (sweeping) {
        targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
        targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
      }
      const active = !introducing && (pointer.inside || sweeping || dragging >= 0);
      if (active && !placed) {
        lens.x = targetX;
        lens.y = targetY;
      }
      if (active) {
        const lag = pointer.inside ? 0.05 : 0.22;
        lens.x = approach(lens.x, targetX, dt, lag);
        lens.y = approach(lens.y, targetY, dt, lag);
      }
      placed = active;
      presence = approach(presence, s.reveal === 'area' && active && dragging < 0 ? 1 : 0, dt, 0.16);

      for (let k = kicks.length - 1; k >= 0; k--) {
        if (kicks[k].at > pulse) continue;
        const glyph = glyphs[kicks[k].index];
        if (glyph) glyph.velocity.y -= kicks[k].velocity;
        kicks.splice(k, 1);
      }

      let moving = false;
      glyphs.forEach((glyph, i) => {
        if (i === dragging) {
          glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
          glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
          glyph.velocity.x = 0;
          glyph.velocity.y = 0;
          moving = true;
          return;
        }
        const { offset, velocity } = glyph;
        if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
          offset.x = 0;
          offset.y = 0;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
        velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
        moving = true;
      });

      let typing = -1;
      if (introducing && introKind === 'type') {
        const step = 0.86 / glyphs.length;
        const cursorAt = Math.min(glyphs.length - 1, Math.floor(progress / step));
        typing = progress < 0.93 ? cursorAt : -1;
        glyphs.forEach((glyph, i) => {
          glyph.shown = i < cursorAt ? 1 : i === cursorAt ? smoothstep(0, step * 0.3, progress - i * step) : 0;
        });
      } else {
        glyphs.forEach(glyph => {
          glyph.shown = 1;
        });
      }

      const focus = introducing ? typing : dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
      if (focus >= 0 && s.selection) {
        const glyph = glyphs[focus];
        const bx1 = glyph.box.x1 + glyph.offset.x - 6;
        const by1 = glyph.box.y1 + glyph.offset.y - 6;
        const bx2 = glyph.box.x2 + glyph.offset.x + 6;
        const by2 = glyph.box.y2 + glyph.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        const glide = focus === dragging ? 0.02 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

      glyphs.forEach((glyph, i) => {
        const target = introducing
          ? introKind === 'type' && (i === typing || (typing >= 0 && i > typing))
            ? 1
            : 0
          : s.reveal === 'letter' && i === focus && i !== dragging
            ? 1
            : 0;
        if (introducing && glyph.shown === 0) glyph.outline = target;
        glyph.outline = approach(glyph.outline, target, dt, 0.09);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
      });

      guideAlpha = approach(guideAlpha, s.guides && !introducing && (focus >= 0 || presence > 0.4) ? 1 : 0, dt, 0.14);

      const hovering = !introducing && focus >= 0 && pointer.inside;
      const nextCursor =
        dragging >= 0 ? 'grabbing' : hovering && s.draggable ? 'grab' : hovering && s.clickKick ? 'pointer' : '';
      if (nextCursor !== cursor) {
        cursor = nextCursor;
        container.style.cursor = nextCursor;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const glyph of glyphs) {
        const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
          blit(ctx, glyph.dashes, 0, 0, 0, 0);
          ctx.globalAlpha = 1;
        }
      }
      if (introducing && introKind === 'metrics') {
        drawLines(s, view, accent, 1 - smoothstep(0.84, 1, progress), k =>
          smoothstep(0.02 + 0.04 * k, 0.2 + 0.04 * k, progress)
        );
      } else if (guideAlpha > 0.005) {
        drawLines(s, view, accent, guideAlpha * 0.6, () => 1);
      }
      glyphs.forEach((glyph, i) => {
        if (introducing && introKind === 'assemble') {
          ensureCells(glyph, view);
          if (progress < glyph.assembled) {
            drawAssembling(glyph, progress, accent);
            return;
          }
        }
        if (introducing && introKind === 'metrics') {
          const lead = glyphs.length > 1 ? i / (glyphs.length - 1) : 0;
          if (progress < 0.72 + 0.28 * lead) {
            drawFilling(glyph, lead, progress, view);
            return;
          }
        }
        if (glyph.shown < 0.001) return;
        if (glyph.outline < 0.999) {
          ctx.globalAlpha = (1 - glyph.outline) * glyph.shown;
          blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline * glyph.shown;
          blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        ctx.globalAlpha = 1;
      });
      if (presence > 0.001) drawReveal(s);
      drawFrame(s, accent);

      const settling =
        moving ||
        introducing ||
        kicks.length > 0 ||
        (guideAlpha > 0.005 && guideAlpha < 0.995) ||
        Math.abs(presence - (s.reveal === 'area' && active && dragging < 0 ? 1 : 0)) > 0.002 ||
        (frame.alpha > 0.01 && frame.alpha < 0.99);
      if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      layoutKey = '';
      wake();
    };

    const locate = e => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = e => {
      locate(e);
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    };
    const onDown = e => {
      locate(e);
      pointer.inside = true;
      const s = settingsRef.current;
      const primary = e.pointerType !== 'mouse' || e.button === 0;
      const index = introducing || !primary ? -1 : glyphAt(pointer.x, pointer.y);
      press.x = pointer.x;
      press.y = pointer.y;
      press.time = performance.now();
      press.index = index;
      if (s?.draggable && index >= 0) {
        dragging = index;
        grab.x = pointer.x - glyphs[index].offset.x;
        grab.y = pointer.y - glyphs[index].offset.y;
        container.setPointerCapture?.(e.pointerId);
      }
      wake();
    };
    const onUp = e => {
      if (dragging >= 0) {
        dragging = -1;
        container.releasePointerCapture?.(e.pointerId);
        const rect = container.getBoundingClientRect();
        pointer.inside =
          e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
      if (
        e.type === 'pointerup' &&
        press.index >= 0 &&
        settingsRef.current?.clickKick &&
        !reducedMotion &&
        performance.now() - press.time < 450
      ) {
        const rect = container.getBoundingClientRect();
        if (Math.hypot(e.clientX - rect.left - press.x, e.clientY - rect.top - press.y) < 6) kick(press.index);
      }
      press.index = -1;
      wake();
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerenter', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerup', onUp, { passive: true });
    container.addEventListener('pointercancel', onUp, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);
    const themeObserver = new MutationObserver(wake);
    for (const node of [document.documentElement, document.body]) {
      if (node) themeObserver.observe(node, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    }
    const schemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    schemeQuery?.addEventListener?.('change', wake);
    if (document.fonts) document.fonts.ready.then(fontsLoaded, fontsLoaded);

    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      schemeQuery?.removeEventListener?.('change', wake);
      container.style.cursor = '';
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onMove);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      container.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={`tech-text ${className}`.trim()} style={style} role="img" aria-label={text}>
      <canvas ref={canvasRef} className="tech-text-canvas" />
    </div>
  );
};

export default TechText;

```

### Component CSS
```css
.tech-text {
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: pan-y;
  user-select: none;
}

.tech-text-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <AeroShards /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: AeroShards
### Variant: JavaScript + CSS
### Dependencies: vgpu

---

### Usage Example
```jsx
import AeroShards from './AeroShards';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <AeroShards
    shardColor="#896ABD"
    accentColor="#A855F7"
    placement="full"
    material="glass"
    markers="plus"
    count={1300}
    depthOfField={0.75}
    vignette={0.3}
    mouseInteraction
    pulseOnClick
    holdToGather
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| shardColor | string | '#896ABD' | Main color of the shards. |
| accentColor | string | '#A855F7' | Color of the light the shards catch, their rim light and the markers. |
| backgroundColor | string | 'transparent' | Fills the canvas behind the shards. Transparent lets the page show through. |
| lightMode | boolean | false | Draws the shards as soft tinted glass for light backgrounds. |
| placement | 'full' | 'left' | 'right' | 'center' | 'full' | Where the ribbons flow: across the whole view, down one side, or in a ring around the center. |
| material | 'glass' | 'chrome' | 'glass' | Surface of the shards: thick glass that catches light along its edges, or polished chrome. |
| markers | 'plus' | 'dots' | 'none' | 'plus' | Survey markers floating at each depth. A few blink, and the one nearest the cursor gets a target frame. |
| count | number | 1300 | Number of shards across all the ribbons. |
| shardSize | number | 1 | Size of the shards. |
| spread | number | 1 | Width of the ribbons. |
| twist | number | 1 | How much the ribbons twist along their length. |
| billow | number | 1 | How much the ribbons ripple like silk. |
| speed | number | 1 | How fast the shards flow. |
| scale | number | 1 | Zoom of the whole scene. |
| depthOfField | number | 0.75 | How soft the farther ribbons get. 0 keeps everything sharp. |
| glow | number | 0.35 | Soft bloom around the brightest glints. |
| grain | number | 0.06 | Film grain on the shards. 0 turns it off. |
| vignette | number | 0.3 | Fades everything out toward the edges of the frame. 0 runs edge to edge. |
| intro | boolean | true | The ribbons draw in from the left, front to back, on mount. |
| mouseInteraction | boolean | true | The cursor parts the shards it passes through and leans the camera toward it. |
| mouseStrength | number | 0.6 | How strongly the cursor parts the shards. |
| parallax | number | 0.5 | How far the camera leans toward the cursor. |
| pulseOnClick | boolean | true | Clicking sends a ring of light out through every depth, flipping the shards it passes. |
| holdToGather | boolean | true | Pressing and holding gathers nearby shards into a swirl that scatters back on release. |
| paused | boolean | false | Freezes the flow. |
| dpr | number | 2 | Maximum device pixel ratio of the canvas. |
| onError | (error: Error) => void | - | Called if WebGPU is unavailable or fails, so you can show a fallback. |
| className | string | '' | Extra class names for the container. |
| style | CSSProperties | - | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';
import { draw, effect, frame, init, sampler, storage, surface, target, uniforms } from 'vgpu';
import './AeroShards.css';

const ROOT = 'aero-shards';
const CANVAS = 'aero-shards-canvas';

const PLACEMENTS = ['full', 'left', 'right', 'center'];
const MATERIALS = {
  glass: [0, 0, 0, 0],
  chrome: [1, 0, 0, 0]
};
const FLOATS = 24;
const SAMPLES = 160;
const CAMERA = 4;
const FOCUS = 3.1;
const SHARD_FOCUS = 2.75;
const LAYER_SCALES = [1, 0.5];
const MAX_BANK = 1.0;
const DEPTHS = [2.7, 3.9, 5.6, 8.1, 11.6];
const SHARE = [0.26, 0.23, 0.2, 0.17, 0.14];
const GROWTH = [1, 1.3, 1.8, 2.6, 3.6];
const FADE = [1, 0.8, 0.52, 0.32, 0.2];
const LEVELS = DEPTHS.length;
const INTRO_SECONDS = 3.4;
const MARKER_STYLES = { plus: 0, dots: 1 };
const MARKER_FLOATS = 8;
const MARKER_PHASES = [
  [0.37, 0.61],
  [0.83, 0.12],
  [0.21, 0.88],
  [0.66, 0.44],
  [0.05, 0.27]
];
const MAX_RINGS = 4;
const RING_SECONDS = 2.6;
const BLOOM_LEVELS = 4;
const FULL_SLOPES = [
  [0.2, -0.78],
  [-0.72, 0.02],
  [0.58, -0.06],
  [-0.24, 0.62],
  [0.8, 0.3]
];
const SIDE_OFFSETS = [0.84, 0.62, 0.44, 0.28, 0.14];
const RING_SIZES = [
  [0.98, 0.78],
  [0.9, 0.7],
  [0.84, 0.64],
  [0.8, 0.6],
  [0.76, 0.56]
];
const TAU = Math.PI * 2;

const SHARD_SHADER = `
struct Frame {
  view: vec4f,
  eye: vec4f,
  forward: vec4f,
  right: vec4f,
  up: vec4f,
  shard: vec4f,
  accent: vec4f,
  marker: vec4f,
  surface: vec4f,
}

struct Layer {
  view: vec4f,
  look: vec4f,
}

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) @interpolate(flat, first) center: vec4f,
  @location(1) @interpolate(flat, first) axis: vec4f,
  @location(2) @interpolate(flat, first) normal: vec4f,
  @location(3) @interpolate(flat, first) p01: vec4f,
  @location(4) @interpolate(flat, first) p23: vec4f,
  @location(5) @interpolate(flat, first) p4: vec4f,
  @location(6) @interpolate(flat, first) topA: vec4f,
  @location(7) @interpolate(flat, first) topB: vec4f,
  @location(8) @interpolate(flat, first) topC: vec4f,
  @location(9) @interpolate(flat, first) bottomA: vec4f,
  @location(10) @interpolate(flat, first) bottomB: vec4f,
  @location(11) @interpolate(flat, first) bottomC: vec4f,
}

struct FragmentOut {
  @location(0) color: vec4f,
  @builtin(frag_depth) depth: f32,
}

@group(0) @binding(0) var<uniform> scene: Frame;
@group(0) @binding(1) var<storage, read> shards: array<vec4f>;
@group(0) @binding(2) var<uniform> layerInfo: Layer;

fn project(world: vec3f) -> vec3f {
  let offset = world - scene.eye.xyz;
  let depth = max(dot(offset, scene.forward.xyz), 0.05);
  let x = dot(offset, scene.right.xyz);
  let y = dot(offset, scene.up.xyz);
  return vec3f(layerInfo.view.x * 0.5 + x * layerInfo.view.z / depth, layerInfo.view.y * 0.5 - y * layerInfo.view.z / depth, depth);
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instance: u32) -> VertexOut {
  let index = instance * 6u;
  let a = shards[index];
  let b = shards[index + 1u];
  let c = shards[index + 2u];
  let d = shards[index + 3u];
  let e = shards[index + 4u];
  let f = shards[index + 5u];
  let center = a.xyz;
  let size = a.w;
  let axis = normalize(b.xyz);
  let normal = normalize(c.xyz);
  let side = normalize(cross(normal, axis));

  var out: VertexOut;
  let middle = project(center);
  if (middle.z < 0.35 || size <= 0.0) {
    out.position = vec4f(2.0, 2.0, 0.5, 1.0);
    return out;
  }

  let count = i32(f.z);
  let points = array<vec2f, 5>(d.xy, d.zw, e.xy, e.zw, f.xy);
  var low = vec2f(1e9);
  var high = vec2f(-1e9);
  var tops = array<vec2f, 5>(vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0));
  var bottoms = array<vec2f, 5>(vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0), vec2f(0.0));
  for (var i = 0; i < 5; i += 1) {
    let corner = points[min(i, count - 1)];
    let onPlate = center + (axis * corner.x + side * corner.y) * size;
    let top = project(onPlate + normal * b.w * size);
    let bottom = project(onPlate - normal * b.w * size);
    tops[i] = top.xy;
    bottoms[i] = bottom.xy;
    low = min(low, min(top.xy, bottom.xy));
    high = max(high, max(top.xy, bottom.xy));
  }
  low -= vec2f(2.0);
  high += vec2f(2.0);
  let corners = array<vec2f, 6>(vec2f(0.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0), vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0));
  let pixel = mix(low, high, corners[vertexIndex]);
  out.position = vec4f(pixel.x / layerInfo.view.x * 2.0 - 1.0, 1.0 - pixel.y / layerInfo.view.y * 2.0, 0.5, 1.0);
  out.center = a;
  out.axis = vec4f(axis, b.w);
  out.normal = vec4f(normal, c.w);
  out.p01 = d;
  out.p23 = e;
  out.p4 = f;
  out.topA = vec4f(tops[0], tops[1]);
  out.topB = vec4f(tops[2], tops[3]);
  out.topC = vec4f(tops[4], 0.0, 0.0);
  out.bottomA = vec4f(bottoms[0], bottoms[1]);
  out.bottomB = vec4f(bottoms[2], bottoms[3]);
  out.bottomC = vec4f(bottoms[4], 0.0, 0.0);
  return out;
}

fn cross2(a: vec2f, b: vec2f) -> f32 {
  return a.x * b.y - a.y * b.x;
}

fn outlineCoverage(p: vec2f, points: array<vec2f, 5>, count: i32) -> f32 {
  var area = 0.0;
  for (var i = 0; i < 5; i += 1) {
    if (i < count) {
      area += cross2(points[i], points[(i + 1) % count]);
    }
  }
  let orient = select(-1.0, 1.0, area > 0.0);
  var distance = -1e9;
  for (var i = 0; i < 5; i += 1) {
    if (i < count) {
      let a = points[i];
      let edge = points[(i + 1) % count] - a;
      let span = length(edge);
      if (span > 1e-4) {
        let n = vec2f(edge.y, -edge.x) * (orient / span);
        distance = max(distance, dot(p - a, n));
      }
    }
  }
  return clamp(0.5 - distance, 0.0, 1.0);
}

struct Prism {
  points: array<vec2f, 5>,
  count: i32,
  half: f32,
}

struct Hit {
  near: f32,
  far: f32,
  normal: vec3f,
}

fn plane(prism: Prism, k: i32) -> vec4f {
  if (k == 0) { return vec4f(0.0, 0.0, 1.0, prism.half); }
  if (k == 1) { return vec4f(0.0, 0.0, -1.0, prism.half); }
  let a = prism.points[k - 2];
  let b = prism.points[(k - 1) % prism.count];
  let edge = b - a;
  let n = normalize(vec2f(edge.y, -edge.x));
  return vec4f(n, 0.0, dot(n, a));
}

fn trace(prism: Prism, ro: vec3f, rd: vec3f) -> Hit {
  var hit: Hit;
  hit.near = -1e9;
  hit.far = 1e9;
  hit.normal = vec3f(0.0, 0.0, 1.0);
  for (var k = 0; k < 7; k += 1) {
    if (k < prism.count + 2) {
      let p = plane(prism, k);
      let denom = dot(p.xyz, rd);
      let gap = p.w - dot(p.xyz, ro);
      if (abs(denom) < 1e-7) {
        if (gap < 0.0) { hit.far = -1e9; }
      } else {
        let t = gap / denom;
        if (denom < 0.0) {
          if (t > hit.near) {
            hit.near = t;
            hit.normal = p.xyz;
          }
        } else if (t < hit.far) {
          hit.far = t;
        }
      }
    }
  }
  return hit;
}

fn exitFrom(prism: Prism, ro: vec3f, rd: vec3f) -> vec4f {
  var best = 1e9;
  var normal = vec3f(0.0, 0.0, -1.0);
  for (var k = 0; k < 7; k += 1) {
    if (k < prism.count + 2) {
      let p = plane(prism, k);
      let denom = dot(p.xyz, rd);
      if (denom > 1e-6) {
        let t = (p.w - dot(p.xyz, ro)) / denom;
        if (t < best) {
          best = t;
          normal = p.xyz;
        }
      }
    }
  }
  return vec4f(normal, max(best, 0.0));
}

fn rectLight(r: vec3f, dir: vec3f, across: vec3f, extent: vec2f, soft: f32) -> f32 {
  let facing = dot(r, dir);
  if (facing <= 0.0) { return 0.0; }
  let up = cross(dir, across);
  let u = dot(r, across) / facing;
  let v = dot(r, up) / facing;
  let a = 1.0 - smoothstep(extent.x - soft, extent.x + soft, abs(u));
  let b = 1.0 - smoothstep(extent.y - soft, extent.y + soft, abs(v));
  return a * b;
}

const KEY_DIR = vec3f(-0.28, 0.72, 0.64) / length(vec3f(-0.28, 0.72, 0.64));
const KEY_ACROSS = vec3f(0.92, 0.0, 0.4) / length(vec3f(0.92, 0.0, 0.4));
const LEFT_DIR = vec3f(-0.86, 0.12, 0.5) / length(vec3f(-0.86, 0.12, 0.5));
const LEFT_ACROSS = vec3f(0.5, 0.0, 0.86) / length(vec3f(0.5, 0.0, 0.86));
const RIM_DIR = vec3f(0.78, 0.22, -0.58) / length(vec3f(0.78, 0.22, -0.58));
const RIM_ACROSS = vec3f(0.6, 0.0, 0.8) / length(vec3f(0.6, 0.0, 0.8));
const TOP_DIR = vec3f(0.05, 0.94, -0.33) / length(vec3f(0.05, 0.94, -0.33));
const TOP_ACROSS = vec3f(1.0, 0.0, 0.0);

fn lobe(r: vec3f, dir: vec3f, width: f32) -> f32 {
  return exp((dot(r, dir) - 1.0) / (width * width));
}

fn studio(r: vec3f, soft: f32, accent: vec3f, ink: vec3f) -> vec3f {
  let sky = clamp(r.y * 0.5 + 0.5, 0.0, 1.0);
  var col = mix(ink * 0.03, ink * 0.12 + accent * 0.03, smoothstep(0.25, 0.95, sky));
  col += mix(ink, vec3f(1.0), 0.6) * lobe(r, KEY_DIR, 0.38) * 3.6;
  col += mix(accent, vec3f(1.0), 0.2) * lobe(r, RIM_DIR, 0.34) * 3.4;
  col += vec3f(1.0, 0.98, 1.0) * rectLight(r, LEFT_DIR, LEFT_ACROSS, vec2f(0.12, 0.8), 0.08 + soft) * 3.2;
  col += vec3f(1.0, 0.98, 1.0) * rectLight(r, TOP_DIR, TOP_ACROSS, vec2f(0.9, 0.1), 0.08 + soft) * 2.6;
  return col;
}

fn studioLight(r: vec3f, soft: f32, accent: vec3f) -> vec3f {
  let ground = vec3f(0.2, 0.2, 0.23);
  let skyTone = vec3f(0.97, 0.97, 0.99);
  var col = mix(ground, skyTone, smoothstep(-0.08 - soft, 0.16 + soft, r.y));
  col = mix(col, vec3f(0.55, 0.55, 0.6), lobe(r, vec3f(0.0, -1.0, 0.0), 0.5) * 0.4);
  col += vec3f(0.4) * rectLight(r, KEY_DIR, KEY_ACROSS, vec2f(0.46, 0.3), 0.07 + soft);
  col -= vec3f(0.55) * rectLight(r, LEFT_DIR, LEFT_ACROSS, vec2f(0.1, 0.85), 0.05 + soft);
  col -= vec3f(0.45) * rectLight(r, RIM_DIR, RIM_ACROSS, vec2f(0.12, 0.9), 0.05 + soft);
  return clamp(col, vec3f(0.05), vec3f(1.2));
}

fn schlick(cosine: f32, f0: f32) -> f32 {
  return f0 + (1.0 - f0) * pow(1.0 - clamp(cosine, 0.0, 1.0), 5.0);
}

fn rayFor(pixel: vec2f) -> vec3f {
  let x = pixel.x - layerInfo.view.x * 0.5;
  let y = layerInfo.view.y * 0.5 - pixel.y;
  return normalize(scene.forward.xyz * layerInfo.view.z + scene.right.xyz * x + scene.up.xyz * y);
}

struct Surface {
  coverage: f32,
  color: vec3f,
  alpha: f32,
  depth: f32,
}

fn shade(pixel: vec2f, in: VertexOut) -> Surface {
  let center = in.center.xyz;
  let size = in.center.w;
  let axis = in.axis.xyz;
  let plateNormal = in.normal.xyz;
  let side = normalize(cross(plateNormal, axis));
  var prism: Prism;
  prism.points = array<vec2f, 5>(in.p01.xy, in.p01.zw, in.p23.xy, in.p23.zw, in.p4.xy);
  prism.count = i32(in.p4.z);
  prism.half = in.axis.w;

  let eye = scene.eye.xyz;
  let toLocal = mat3x3f(axis.x, side.x, plateNormal.x, axis.y, side.y, plateNormal.y, axis.z, side.z, plateNormal.z);
  let fromLocal = mat3x3f(axis, side, plateNormal);
  let origin = toLocal * (eye - center) / size;

  let rd = rayFor(pixel);
  let ray = toLocal * rd;
  let denom = dot(ray, vec3f(0.0, 0.0, 1.0));
  let flatT = -origin.z / select(denom, 1e-4, abs(denom) < 1e-4);
  let flatPoint = origin.xy + ray.xy * flatT;
  let footprint = max(length(fwidth(flatPoint)) * 0.7, 1e-4);
  let softBase = clamp(length(fwidth(reflect(rd, plateNormal))) * 0.5, 0.0, 0.5);

  let primary = trace(prism, origin, ray);
  let tops = array<vec2f, 5>(in.topA.xy, in.topA.zw, in.topB.xy, in.topB.zw, in.topC.xy);
  let bottoms = array<vec2f, 5>(in.bottomA.xy, in.bottomA.zw, in.bottomB.xy, in.bottomB.zw, in.bottomC.xy);
  let coverage = max(outlineCoverage(pixel, tops, prism.count), outlineCoverage(pixel, bottoms, prism.count));

  var surface: Surface;
  let facing = select(-1.0, 1.0, origin.z > 0.0);
  let capT = (facing * prism.half - origin.z) / select(ray.z, -1e-4 * facing, abs(ray.z) < 1e-4);
  let missed = primary.near > primary.far;
  let hitT = select(primary.near, capT, missed);
  let hitNormal = select(primary.normal, vec3f(0.0, 0.0, facing), missed);
  surface.coverage = select(0.0, coverage, hitT > 0.0);
  surface.color = vec3f(0.0);
  surface.alpha = 0.0;
  surface.depth = 1.0;
  if (surface.coverage <= 0.0) { return surface; }
  let mainRay = ray;

  let local = origin + mainRay * hitT;
  let worldRay = fromLocal * mainRay;
  let viewDepth = max(hitT * size * dot(worldRay, scene.forward.xyz), 0.05);
  surface.depth = clamp(1.0 - 0.3 / viewDepth, 0.0, 1.0);

  let radius = max(prism.half * 1.15, footprint * 2.5);
  var n = hitNormal;
  var bevel = 0.0;
  if (abs(n.z) > 0.5) {
    var gap = 1e9;
    for (var k = 2; k < 7; k += 1) {
      if (k < prism.count + 2) {
        let p = plane(prism, k);
        gap = min(gap, p.w - dot(p.xy, local.xy));
      }
    }
    var toward = vec2f(0.0);
    for (var k = 2; k < 7; k += 1) {
      if (k < prism.count + 2) {
        let p = plane(prism, k);
        let g = p.w - dot(p.xy, local.xy);
        toward += p.xy * exp(-(g - gap) / (radius * 0.35));
      }
    }
    toward = normalize(toward);
    bevel = clamp(1.0 - gap / radius, 0.0, 1.0);
    let angle = bevel * bevel * 0.7853982;
    n = normalize(n * cos(angle) + vec3f(toward, 0.0) * sin(angle));
  } else {
    let gap = prism.half - abs(local.z);
    bevel = clamp(1.0 - gap / radius, 0.0, 1.0);
    let angle = bevel * bevel * 0.7853982;
    n = normalize(n * cos(angle) + vec3f(0.0, 0.0, sign(local.z)) * sin(angle));
  }
  let bendRate = 1.8 / max(radius / footprint, 1.0);
  let normal = normalize(fromLocal * n);
  let view = -worldRay;
  let reflected = reflect(worldRay, normal);
  let soft = softBase + bendRate * smoothstep(0.0, 0.25, bevel) * 1.2 + clamp(footprint * 0.6, 0.0, 0.5);
  let ndv = clamp(dot(normal, view), 0.0, 1.0);

  let accent = scene.accent.rgb;
  let base = scene.shard.rgb;
  let world = center + fromLocal * local * size;
  let height = clamp(0.5 + world.y * 0.45, 0.0, 1.0);
  let tone = mix(accent, base, height);
  let body = mix(tone, mix(base, accent, 0.5), in.normal.w * 0.3);
  let mode = scene.surface.x;
  let lightMode = scene.up.w > 0.5;
  let wrap = clamp(dot(normal, KEY_DIR) * 0.5 + 0.5, 0.0, 1.0);

  var color = vec3f(0.0);
  var alpha = 1.0;
  let chrome = mode > 0.5;
  if (lightMode) {
    let env = studioLight(reflected, soft, accent);
    if (chrome) {
      color = env * mix(body, vec3f(1.0), 0.6);
    } else {
      let fresnel = schlick(ndv, 0.05);
      let diffuse = clamp(dot(normal, KEY_DIR) * 0.5 + 0.5, 0.0, 1.0);
      alpha = clamp(0.32 + fresnel * 0.5 + (1.0 - abs(n.z)) * 0.5, 0.0, 1.0);
      color = mix(body, vec3f(1.0), 0.15) * (0.5 + 0.4 * diffuse) * alpha + (env - vec3f(0.78)) * fresnel * 0.8;
    }
  } else if (chrome) {
    let env = studio(reflected, soft, accent, body);
    color = env * mix(body, vec3f(1.0), 0.55) * 0.9 + body * 0.02;
  } else {
    let fresnel = schlick(ndv, 0.04);
    let env = studio(reflected, soft, accent, body);
    var light = vec3f(0.0);
    var cursor = local;
    var direction = toLocal * refract(worldRay, normal, 1.0 / 1.5);
    var travelled = 0.0;
    var carry = 1.0 - fresnel;
    var through = 0.0;
    for (var bounce = 0; bounce < 3; bounce += 1) {
      let outlet = exitFrom(prism, cursor, direction);
      travelled += outlet.w;
      cursor = cursor + direction * outlet.w;
      let outward = outlet.xyz;
      let escaped = refract(direction, -outward, 1.5);
      if (dot(escaped, escaped) > 0.0) {
        let leave = schlick(dot(direction, outward), 0.04);
        let worldOut = normalize(fromLocal * escaped);
        let absorb = exp(-(vec3f(1.0) - body) * travelled * size * 22.0);
        let straight = smoothstep(0.97, 0.999, dot(worldOut, worldRay));
        let energy = carry * (1.0 - leave);
        light += studio(worldOut, soft * 2.0 + 0.04, accent, body) * absorb * energy * (1.0 - straight) * 2.0;
        through += energy * straight * (absorb.r + absorb.g + absorb.b) / 3.0;
        carry *= leave;
      }
      direction = reflect(direction, outward);
    }
    let edge = max(pow(1.0 - abs(n.z), 1.2), bevel * bevel * 0.85);
    let glow = mix(mix(body, accent, 0.35), vec3f(1.0), 0.28) * edge * (0.35 + 0.45 * wrap);
    color = env * fresnel * 0.85 + light * (1.0 - smoothstep(0.0, 0.6, bevel)) + body * 0.02 + glow;
    alpha = clamp(1.0 - through + edge * 0.25, 0.0, 1.0);
  }

  color *= select(1.3, 1.0, lightMode);
  let haze = smoothstep(3.5, 12.0, viewDepth) * layerInfo.look.x;
  let hazeColor = select(mix(base, accent, 0.5) * 0.3, mix(base, vec3f(1.0), 0.72), lightMode);
  color = mix(color, hazeColor * alpha + color * 0.3, haze);
  let flash = in.p4.w;
  color += mix(accent, vec3f(1.0), 0.35) * flash * select(0.5, 0.0, lightMode) * max(alpha, 0.35);
  alpha = max(alpha, flash * 0.45 * select(1.0, 0.0, lightMode));
  surface.color = color;
  surface.alpha = alpha;
  return surface;
}

@fragment
fn fs_solid(in: VertexOut) -> FragmentOut {
  let surface = shade(in.position.xy, in);
  if (surface.coverage < 0.999 || surface.alpha < 0.6) { discard; }
  var out: FragmentOut;
  out.color = vec4f(surface.color, surface.alpha);
  out.depth = surface.depth;
  return out;
}

@fragment
fn fs_edge(in: VertexOut) -> FragmentOut {
  let surface = shade(in.position.xy, in);
  if (surface.coverage <= 0.001 || (surface.coverage >= 0.9996 && surface.alpha >= 0.62)) { discard; }
  var out: FragmentOut;
  out.color = vec4f(surface.color, surface.alpha) * surface.coverage;
  out.depth = surface.depth;
  return out;
}
`;

const LAYER_BLUR_SHADER = `
struct Spread { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> spreadInfo: Spread;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let sigma = max(spreadInfo.texel.z, 0.3);
  let reach = min(i32(ceil(sigma * 2.6)), 20);
  var total = textureSampleLevel(source, linearSampler, uv, 0.0);
  var weight = 1.0;
  for (var i = 1; i <= reach; i += 1) {
    let w = exp(-f32(i * i) / (2.0 * sigma * sigma));
    let o = spreadInfo.texel.xy * f32(i);
    total += (textureSampleLevel(source, linearSampler, uv + o, 0.0) + textureSampleLevel(source, linearSampler, uv - o, 0.0)) * w;
    weight += 2.0 * w;
  }
  return total / weight;
}
`;

const SHADOW_SHADER = `
struct Shade {
  info: vec4f,
  more: vec4f,
}
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var depthMap: texture_depth_2d;
@group(0) @binding(2) var<uniform> shadeInfo: Shade;

@fragment
fn fs_main(@builtin(position) pixel: vec4f) -> @location(0) vec4f {
  let bounds = vec2i(textureDimensions(source)) - vec2i(1);
  let here = vec2i(pixel.xy);
  let color = textureLoad(source, here, 0);
  if (color.a <= 0.002 || shadeInfo.info.z <= 0.0) { return color; }
  let depth = textureLoad(depthMap, here, 0);
  let east = textureLoad(depthMap, clamp(here + vec2i(1, 0), vec2i(0), bounds), 0);
  let west = textureLoad(depthMap, clamp(here - vec2i(1, 0), vec2i(0), bounds), 0);
  let south = textureLoad(depthMap, clamp(here + vec2i(0, 1), vec2i(0), bounds), 0);
  let north = textureLoad(depthMap, clamp(here - vec2i(0, 1), vec2i(0), bounds), 0);
  let limit = shadeInfo.more.x * 0.5;
  let slopeX = clamp(select(east - depth, depth - west, abs(depth - west) < abs(east - depth)), -limit, limit);
  let slopeY = clamp(select(south - depth, depth - north, abs(depth - north) < abs(south - depth)), -limit, limit);
  var occlusion = 0.0;
  for (var i = 1; i <= 12; i += 1) {
    let offset = -shadeInfo.info.xy * f32(i);
    let probe = clamp(vec2i(pixel.xy + offset), vec2i(0), bounds);
    let other = textureLoad(depthMap, probe, 0);
    let expected = depth + slopeX * offset.x + slopeY * offset.y;
    let closer = smoothstep(shadeInfo.more.x * 0.6, shadeInfo.more.x * 2.4, expected - other);
    let reach = 1.0 - f32(i - 1) / 12.0;
    occlusion = max(occlusion, closer * reach * reach);
  }
  return vec4f(color.rgb * (1.0 - occlusion * shadeInfo.info.z), color.a);
}
`;

const COMPOSITE_SHADER = `
struct Blend { info: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> mixInfo: Blend;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  return textureSampleLevel(source, linearSampler, uv, 0.0) * mixInfo.info.x;
}
`;

const MARKER_SHADER = `
struct Frame {
  view: vec4f,
  eye: vec4f,
  forward: vec4f,
  right: vec4f,
  up: vec4f,
  shard: vec4f,
  accent: vec4f,
  marker: vec4f,
  surface: vec4f,
}

struct MarkerOut {
  @builtin(position) position: vec4f,
  @location(0) local: vec2f,
  @location(1) @interpolate(flat, first) shape: vec4f,
  @location(2) @interpolate(flat, first) light: vec4f,
}

@group(0) @binding(0) var<uniform> scene: Frame;
@group(0) @binding(1) var<storage, read> markers: array<vec4f>;

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) instance: u32) -> MarkerOut {
  let a = markers[instance * 2u];
  let b = markers[instance * 2u + 1u];
  let offset = a.xyz - scene.eye.xyz;
  let depth = max(dot(offset, scene.forward.xyz), 0.05);
  let center = vec2f(
    scene.view.x * 0.5 + dot(offset, scene.right.xyz) * scene.view.z / depth,
    scene.view.y * 0.5 - dot(offset, scene.up.xyz) * scene.view.z / depth,
  );
  let pixel = scene.marker.y;
  let size = scene.marker.z * clamp(sqrt(scene.marker.w / depth), 0.6, 1.3) * b.z;
  let blur = min(scene.forward.w * abs(1.0 - scene.eye.w / depth), scene.right.w) * 0.18;
  let frame = b.y;
  let reach = select(size, size * 2.6, frame > 0.001) + blur + 1.5 * pixel;
  let corners = array<vec2f, 6>(vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0), vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0));
  let corner = corners[vertexIndex % 6u] * reach;
  var out: MarkerOut;
  if (depth < 0.35 || a.w <= 0.002) {
    out.position = vec4f(2.0, 2.0, 0.5, 1.0);
    return out;
  }
  let at = center + corner;
  out.position = vec4f(at.x / scene.view.x * 2.0 - 1.0, 1.0 - at.y / scene.view.y * 2.0, 0.5, 1.0);
  out.local = corner;
  out.shape = vec4f(size, blur, frame, pixel);
  out.light = vec4f(b.x, a.w, 0.0, 0.0);
  return out;
}

fn bar(value: f32, edge: f32, soft: f32) -> f32 {
  return clamp((edge - value) / soft + 0.5, 0.0, 1.0);
}

@fragment
fn fs_main(in: MarkerOut) -> @location(0) vec4f {
  let size = in.shape.x;
  let blur = in.shape.y;
  let frame = in.shape.z;
  let pixel = in.shape.w;
  let q = abs(in.local);
  let soft = 1.0 + blur;
  let thick = 0.6 * pixel + blur * 0.5;
  let energy = (0.6 * pixel) / thick;
  var cover = 0.0;
  if (scene.marker.x < 0.5) {
    let across = bar(q.x, size, soft) * bar(q.y, thick, soft);
    let down = bar(q.y, size, soft) * bar(q.x, thick, soft);
    cover = max(across, down) * energy;
  } else {
    cover = bar(length(in.local), size * 0.42 + blur * 0.3, soft) * mix(1.0, energy, 0.6);
  }
  if (frame > 0.001) {
    let edge = size * 2.3;
    let span = edge * 0.45;
    let line = 0.5 * pixel;
    let sides = bar(abs(q.x - edge), line, 1.0) * bar(edge - span - q.y, 0.0, 1.0) * bar(q.y - edge - line, 0.0, 1.0);
    let caps = bar(abs(q.y - edge), line, 1.0) * bar(edge - span - q.x, 0.0, 1.0) * bar(q.x - edge - line, 0.0, 1.0);
    cover = max(cover, max(sides, caps) * frame * 0.85);
  }
  let glow = in.light.x;
  let fade = in.light.y;
  let tint = mix(scene.shard.rgb, scene.accent.rgb, 0.4);
  if (scene.up.w > 0.5) {
    let ink = (1.0 - exp(-glow * 1.6)) * 0.85 * cover * fade;
    return vec4f(mix(tint, scene.accent.rgb, 0.5) * 0.55 * ink, ink);
  }
  let light = cover * glow * fade;
  let color = (1.0 - exp(-mix(tint, vec3f(1.0), 0.35) * light * 1.6)) * 1.4;
  return vec4f(color, max(max(color.r, color.g), color.b) * 0.8);
}
`;

const PREFILTER_SHADER = `
struct Bloom { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> bloom: Bloom;

fn bright(uv: vec2f) -> vec3f {
  let color = textureSampleLevel(source, linearSampler, uv, 0.0).rgb;
  let peak = max(max(color.r, color.g), color.b);
  return color * smoothstep(bloom.texel.z, bloom.texel.z + bloom.texel.w, peak);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let o = bloom.texel.xy;
  let total = bright(uv + vec2f(o.x, o.y)) + bright(uv + vec2f(-o.x, o.y)) + bright(uv + vec2f(o.x, -o.y)) + bright(uv - o);
  return vec4f(total * 0.25, 0.0);
}
`;

const DOWNSAMPLE_SHADER = `
struct Bloom { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> bloom: Bloom;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let o = bloom.texel.xy;
  var color = textureSampleLevel(source, linearSampler, uv, 0.0) * 0.25;
  color += textureSampleLevel(source, linearSampler, uv + vec2f(o.x, o.y), 0.0) * 0.1875;
  color += textureSampleLevel(source, linearSampler, uv + vec2f(-o.x, o.y), 0.0) * 0.1875;
  color += textureSampleLevel(source, linearSampler, uv + vec2f(o.x, -o.y), 0.0) * 0.1875;
  color += textureSampleLevel(source, linearSampler, uv - o, 0.0) * 0.1875;
  return color;
}
`;

const BLUR_SHADER = `
struct Bloom { texel: vec4f }
@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var<uniform> bloom: Bloom;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let delta = bloom.texel.xy;
  var color = textureSampleLevel(source, linearSampler, uv, 0.0) * 0.181862;
  color += (textureSampleLevel(source, linearSampler, uv + delta * 1.423135, 0.0) + textureSampleLevel(source, linearSampler, uv - delta * 1.423135, 0.0)) * 0.284316;
  color += (textureSampleLevel(source, linearSampler, uv + delta * 3.326702, 0.0) + textureSampleLevel(source, linearSampler, uv - delta * 3.326702, 0.0)) * 0.106598;
  color += (textureSampleLevel(source, linearSampler, uv + delta * 5.242989, 0.0) + textureSampleLevel(source, linearSampler, uv - delta * 5.242989, 0.0)) * 0.018156;
  return color;
}
`;

const FINISH_SHADER = `
struct Finish {
  info: vec4f,
  paper: vec4f,
  mode: vec4f,
}
@group(0) @binding(0) var sceneTexture: texture_2d<f32>;
@group(0) @binding(1) var linearSampler: sampler;
@group(0) @binding(2) var bloom0: texture_2d<f32>;
@group(0) @binding(3) var bloom1: texture_2d<f32>;
@group(0) @binding(4) var bloom2: texture_2d<f32>;
@group(0) @binding(5) var bloom3: texture_2d<f32>;
@group(0) @binding(6) var<uniform> finish: Finish;

fn hash12(value: vec2f) -> f32 {
  let p = fract(value * vec2f(0.1031, 0.1030));
  let mixed = p + dot(p, p.yx + 33.33);
  return fract((mixed.x + mixed.y) * mixed.x);
}

fn smootherstep(x: f32) -> f32 {
  let t = clamp(x, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

@fragment
fn fs_main(@location(0) uv: vec2f, @builtin(position) pixel: vec4f) -> @location(0) vec4f {
  let scene = textureLoad(sceneTexture, vec2i(pixel.xy), 0);
  let alpha = clamp(scene.a, 0.0, 1.0);
  let noise = hash12(floor(pixel.xy) + vec2f(finish.info.y, finish.info.y * 1.618)) - 0.5;
  let grain = 1.0 + noise * finish.info.x;
  var rgb = vec3f(0.0);
  var a = alpha;
  if (finish.mode.x > 0.5) {
    rgb = clamp(scene.rgb, vec3f(0.0), vec3f(alpha)) * grain;
  } else {
    var halo = textureSampleLevel(bloom0, linearSampler, uv, 0.0).rgb * 0.4;
    halo += textureSampleLevel(bloom1, linearSampler, uv, 0.0).rgb * 0.3;
    halo += textureSampleLevel(bloom2, linearSampler, uv, 0.0).rgb * 0.2;
    halo += textureSampleLevel(bloom3, linearSampler, uv, 0.0).rgb * 0.1;
    halo = halo * finish.info.z;
    rgb = (1.0 - exp(-max(scene.rgb, vec3f(0.0)) * finish.info.w)) * grain + halo / (1.0 + halo);
    a = max(alpha, max(max(rgb.r, rgb.g), rgb.b));
  }
  let vignette = finish.mode.y;
  if (vignette > 0.0) {
    let size = vec2f(textureDimensions(sceneTexture));
    let reach = max(vignette * 0.5 * min(size.x, size.y), 1.0);
    let fromEdge = min(pixel.xy, size - pixel.xy);
    let mask = smootherstep(fromEdge.x / reach) * smootherstep(fromEdge.y / reach);
    rgb *= mask;
    a *= mask;
  }
  rgb = clamp(rgb, vec3f(0.0), vec3f(max(a, 0.0)));
  if (finish.paper.a > 0.5) {
    return vec4f(finish.paper.rgb * (1.0 - a) + rgb, 1.0);
  }
  return vec4f(rgb, a);
}
`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const smoother = x => {
  const t = clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

let probe = null;

const parseColor = (value, fallback) => {
  if (value === 'transparent') return null;
  if (typeof document === 'undefined') return fallback;
  if (!probe) probe = document.createElement('canvas').getContext('2d');
  if (!probe) return fallback;
  probe.fillStyle = '#000000';
  probe.fillStyle = value;
  const text = probe.fillStyle;
  if (text.startsWith('#')) {
    const hex = parseInt(text.slice(1), 16);
    return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
  }
  const match = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(text);
  if (!match) return fallback;
  if (match[4] !== undefined && Number(match[4]) === 0) return null;
  return [Number(match[1]) / 255, Number(match[2]) / 255, Number(match[3]) / 255];
};

const prefersReduced = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

const latticeHash = (a, b, c, d) => {
  let h = Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35);
  h ^= Math.imul(c + 0x27d4eb2f, 0x165667b1) ^ Math.imul(d + 0x7f4a7c15, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
};

const random = seed => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const ribbonPoint = (placement, level, s, aspect, out) => {
  let u;
  let v;
  let d;
  if (placement === 0) {
    u = -1.32 + 2.64 * s;
    const slope = FULL_SLOPES[level];
    v =
      slope[0] +
      (slope[1] - slope[0]) * s +
      0.1 * Math.sin(s * TAU * 0.7 + level * 2.3) +
      0.045 * Math.sin(s * TAU * 1.9 + level);
    d = DEPTHS[level] + 0.35 * Math.sin(s * Math.PI * 1.4 + level * 1.9);
  } else if (placement === 3) {
    const angle = s * TAU + level * 0.9 + Math.PI * 0.5;
    const size = RING_SIZES[level];
    u = Math.cos(angle) * size[0];
    v = Math.sin(angle) * size[1] - 0.02;
    d = DEPTHS[level] * 1.1 - Math.sin(angle) * (0.5 + level * 0.25);
  } else {
    const mirror = placement === 1 ? -1 : 1;
    v = 1.32 - 2.64 * s;
    u =
      mirror *
      (SIDE_OFFSETS[level] +
        0.1 * Math.sin(s * TAU * 0.6 + level * 1.3) +
        0.03 * Math.sin(s * TAU * 2.1 + level) -
        0.08 * (1 - s));
    d = DEPTHS[level] + 0.3 * Math.sin(s * Math.PI * 1.2 + level);
  }
  out[0] = (u * aspect * d) / CAMERA;
  out[1] = (v * d) / CAMERA;
  out[2] = CAMERA - d;
  return out;
};

const createShards = (count, seed) => {
  const next = random(seed);
  const shards = [];
  let made = 0;
  for (let level = 0; level < LEVELS; level += 1) {
    const amount = level === LEVELS - 1 ? count - made : Math.round(count * SHARE[level]);
    made += amount;
    for (let index = 0; index < amount; index += 1) {
      const flat = next() * 2 - 1;
      const family = next();
      const outline = [];
      if (family < 0.55) {
        const spread = 0.17 + next() * 0.15;
        outline.push([1, (next() - 0.5) * 0.08]);
        outline.push([-0.5 - next() * 0.25, spread * (0.8 + next() * 0.4)]);
        outline.push([-0.5 - next() * 0.25, -spread * (0.8 + next() * 0.4)]);
      } else if (family < 0.8) {
        const spread = 0.2 + next() * 0.14;
        outline.push([1, 0]);
        outline.push([(next() - 0.3) * 0.5, spread]);
        outline.push([-0.55 - next() * 0.2, (next() - 0.5) * 0.1]);
        outline.push([(next() - 0.3) * 0.5, -spread * (0.8 + next() * 0.4)]);
      } else {
        const sides = next() < 0.5 ? 4 : 5;
        const stretch = 0.4 + next() * 0.3;
        const turn = next() * TAU;
        for (let corner = 0; corner < sides; corner += 1) {
          const angle = turn + ((corner + (next() - 0.5) * 0.6) * TAU) / sides;
          outline.push([Math.cos(angle), Math.sin(angle) * stretch]);
        }
      }
      const sides = outline.length;
      let mx = 0;
      let my = 0;
      for (const point of outline) {
        mx += point[0] / sides;
        my += point[1] / sides;
      }
      const shape = [];
      for (let corner = 0; corner < 5; corner += 1) {
        const point = outline[Math.min(corner, sides - 1)];
        shape.push(point[0] - mx, point[1] - my);
      }
      shards.push({
        level,
        phase: (index + next()) / Math.max(amount, 1),
        lane: Math.sign(flat) * Math.pow(Math.abs(flat), 0.85),
        layer: Math.sqrt(-2 * Math.log(Math.max(next(), 1e-6))) * Math.cos(TAU * next()),
        size: 0.6 + next() * next() * 1.25,
        shape,
        sides,
        thickness: 0.06 + next() * 0.04,
        yaw: (next() - 0.5) * 0.36,
        bank: (next() - 0.5) * 0.5,
        pitch: (next() - 0.5) * 0.24,
        tint: next(),
        drift: [next() * TAU, next() * TAU, next() * TAU],
        rate: [0.3 + next() * 0.35, 0.25 + next() * 0.35, 0.3 + next() * 0.3],
        flutter: [next() * TAU, 0.5 + next() * 0.5],
        arrive: next(),
        sign: next() < 0.5 ? -1 : 1,
        slot: [next() * TAU, 0.06 + 0.3 * Math.sqrt(next()), next() - 0.5, next() < 0.85 ? 1 : -1],
        offset: [0, 0, 0],
        velocity: [0, 0, 0],
        tilt: 0,
        tiltVelocity: 0,
        flash: 0,
        gather: 0,
        joined: false,
        position: [0, 0, 0],
        s: 0
      });
    }
  }
  return shards;
};

export default function AeroShards({
  shardColor = '#896ABD',
  accentColor = '#A855F7',
  backgroundColor = 'transparent',
  lightMode = false,
  placement = 'full',
  material = 'glass',
  count = 1300,
  shardSize = 1,
  spread = 1,
  twist = 1,
  billow = 1,
  speed = 1,
  scale = 1,
  depthOfField = 0.75,
  glow = 0.35,
  grain = 0.06,
  vignette = 0.3,
  intro = true,
  mouseInteraction = true,
  mouseStrength = 0.6,
  markers = 'plus',
  pulseOnClick = true,
  holdToGather = true,
  parallax = 0.5,
  paused = false,
  dpr = 2,
  className = '',
  style,
  onError
}) {
  const containerRef = useRef(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const settings = {
    shard: parseColor(shardColor, [0.54, 0.42, 0.74]) ?? [0.54, 0.42, 0.74],
    accent: parseColor(accentColor, [0.66, 0.33, 0.97]) ?? [0.66, 0.33, 0.97],
    paper: parseColor(backgroundColor, null),
    lightMode,
    placement: Math.max(0, PLACEMENTS.indexOf(placement)),
    material: MATERIALS[material] ?? MATERIALS.glass,
    count: Math.round(clamp(count, 100, 6000)),
    shardSize: clamp(shardSize, 0.2, 4),
    spread: clamp(spread, 0, 3),
    twist: clamp(twist, 0, 3),
    billow: clamp(billow, 0, 3),
    speed: clamp(speed, 0, 4),
    scale: clamp(scale, 0.4, 2.5),
    depthOfField: clamp(depthOfField, 0, 1),
    glow: clamp(glow, 0, 2),
    grain: clamp(grain, 0, 0.5),
    vignette: clamp(vignette, 0, 1),
    intro,
    mouseInteraction,
    mouseStrength: clamp(mouseStrength, 0, 1),
    markers: MARKER_STYLES[markers] ?? -1,
    pulseOnClick,
    holdToGather,
    parallax: clamp(parallax, 0, 1),
    paused,
    dpr: Math.max(0.5, dpr)
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const canvas = document.createElement('canvas');
    canvas.className = CANVAS;
    container.appendChild(canvas);

    let disposed = false;
    let gpu = null;
    let raf = 0;
    const cleanups = [];

    const fail = error => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      gpu?.dispose();
      gpu = null;
      onErrorRef.current?.(error instanceof Error ? error : new Error(String(error)));
    };

    const start = async () => {
      if (typeof navigator === 'undefined' || !('gpu' in navigator)) throw new Error('WebGPU is not available');
      const instance = await init({ powerPreference: 'high-performance' });
      gpu = instance;
      if (disposed) {
        instance.dispose();
        return;
      }
      cleanups.push(instance.onError(fail));
      const format = navigator.gpu.getPreferredCanvasFormat();
      const sizeFor = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, settingsRef.current.dpr);
        return [
          Math.max(1, Math.round(container.clientWidth * ratio)),
          Math.max(1, Math.round(container.clientHeight * ratio))
        ];
      };
      const output = surface(instance, canvas, {
        autoResize: false,
        size: sizeFor(),
        format,
        alphaMode: 'premultiplied'
      });
      const linear = sampler(instance, {
        minFilter: 'linear',
        magFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge'
      });
      const scene = target(instance, { size: output.size, format: 'rgba16float' });
      const levelSize = index => [
        Math.max(1, Math.round(output.size[0] / 2 ** (index + 1))),
        Math.max(1, Math.round(output.size[1] / 2 ** (index + 1)))
      ];
      const levels = Array.from({ length: BLOOM_LEVELS }, (_, index) => ({
        main: target(instance, { size: levelSize(index), format: 'rgba16float' }),
        spare: target(instance, { size: levelSize(index), format: 'rgba16float' })
      }));
      const frameParams = uniforms(instance, {
        view: [1, 1, 1, 0],
        eye: [0, 0, CAMERA, FOCUS],
        forward: [0, 0, -1, 0],
        right: [1, 0, 0, 0],
        up: [0, 1, 0, 0],
        shard: [0.54, 0.42, 0.74, 0.5],
        accent: [0.66, 0.33, 0.97, 0],
        marker: [0, 1, 4, CAMERA],
        surface: [7, 0, 0, 2.4]
      });
      let markerCapacity = 0;
      let markerBuffer = null;
      let markerData = new Float32Array(0);
      const markerDraw = draw(instance, {
        shader: MARKER_SHADER,
        vertices: 6,
        cull: 'none',
        depth: false,
        blend: 'premultiplied',
        label: 'aero-shards-markers'
      });
      const ensureMarkers = needed => {
        if (needed <= markerCapacity && markerBuffer) return;
        markerCapacity = Math.max(needed, 512);
        markerData = new Float32Array(markerCapacity * MARKER_FLOATS);
        markerBuffer = storage(instance, markerData.byteLength, 'read');
        markerDraw.set({ scene: frameParams, markers: markerBuffer });
      };
      ensureMarkers(512);
      const groupSize = scale => [
        Math.max(1, Math.round(output.size[0] * scale)),
        Math.max(1, Math.round(output.size[1] * scale))
      ];
      const groups = LAYER_SCALES.map((scale, index) => ({
        scale,
        layer: target(instance, { size: groupSize(scale), format: 'rgba16float', depth: 'depth32float' }),
        shaded: target(instance, { size: groupSize(scale), format: 'rgba16float' }),
        temp: target(instance, { size: index === 0 ? [1, 1] : groupSize(scale), format: 'rgba16float' }),
        blurred: target(instance, { size: index === 0 ? [1, 1] : groupSize(scale), format: 'rgba16float' }),
        softReady: index !== 0
      }));
      const layerParams = DEPTHS.map(() => uniforms(instance, { view: [1, 1, 1, 0], look: [0.7, 0, 0, 0] }));
      const spreadX = DEPTHS.map(() => uniforms(instance, { texel: [0, 0, 0, 0] }));
      const spreadY = DEPTHS.map(() => uniforms(instance, { texel: [0, 0, 0, 0] }));
      const mixParams = DEPTHS.map(() => uniforms(instance, { info: [1, 0, 0, 0] }));
      const shadeParams = DEPTHS.map(() => uniforms(instance, { info: [0, 0, 0, 0], more: [0, 0, 0, 0] }));
      const shardSolid = DEPTHS.map((_, level) =>
        draw(instance, {
          shader: SHARD_SHADER,
          entry: { fragment: 'fs_solid' },
          vertices: 6,
          cull: 'none',
          depth: { write: true, compare: 'less' },
          label: `aero-shards-solid-${level}`
        })
      );
      const shardEdge = DEPTHS.map((_, level) =>
        draw(instance, {
          shader: SHARD_SHADER,
          entry: { fragment: 'fs_edge' },
          vertices: 6,
          cull: 'none',
          depth: { write: false, compare: 'less' },
          blend: 'premultiplied',
          label: `aero-shards-edge-${level}`
        })
      );
      const layerPasses = DEPTHS.map((_, level) =>
        groups.map((group, index) => ({
          shadow: effect(instance, SHADOW_SHADER, {
            label: `aero-shards-shadow-${level}-${index}`,
            set: { source: group.layer, depthMap: group.layer.depth, shadeInfo: shadeParams[level] }
          }),
          blurX: effect(instance, LAYER_BLUR_SHADER, {
            label: `aero-shards-depth-x-${level}-${index}`,
            set: { source: group.shaded, linearSampler: linear, spreadInfo: spreadX[level] }
          }),
          blurY: effect(instance, LAYER_BLUR_SHADER, {
            label: `aero-shards-depth-y-${level}-${index}`,
            set: { source: group.temp, linearSampler: linear, spreadInfo: spreadY[level] }
          }),
          sharp: effect(instance, COMPOSITE_SHADER, {
            label: `aero-shards-sharp-${level}-${index}`,
            blend: 'premultiplied',
            set: { source: group.shaded, linearSampler: linear, mixInfo: mixParams[level] }
          }),
          soft: effect(instance, COMPOSITE_SHADER, {
            label: `aero-shards-soft-${level}-${index}`,
            blend: 'premultiplied',
            set: { source: group.blurred, linearSampler: linear, mixInfo: mixParams[level] }
          })
        }))
      );
      let capacity = 0;
      let shardBuffer = null;
      let upload = new Float32Array(0);
      let staging = new Float32Array(0);
      let depths = new Float32Array(0);
      const ensureCapacity = needed => {
        if (needed <= capacity && shardBuffer) return;
        capacity = Math.max(needed, 256);
        upload = new Float32Array(capacity * FLOATS);
        staging = new Float32Array(capacity * FLOATS);
        depths = new Float32Array(capacity);
        shardBuffer = storage(instance, upload.byteLength, 'read');
        DEPTHS.forEach((_, level) => {
          shardSolid[level].set({ scene: frameParams, shards: shardBuffer, layerInfo: layerParams[level] });
          shardEdge[level].set({ scene: frameParams, shards: shardBuffer, layerInfo: layerParams[level] });
        });
      };
      ensureCapacity(settingsRef.current.count);

      const passes = levels.map((level, index) => {
        const source = index === 0 ? scene : levels[index - 1].main;
        const downParams = uniforms(instance, { texel: [0, 0, 0, 0] });
        const horizontalParams = uniforms(instance, { texel: [0, 0, 0, 0] });
        const verticalParams = uniforms(instance, { texel: [0, 0, 0, 0] });
        return {
          source,
          level,
          downParams,
          horizontalParams,
          verticalParams,
          down: effect(instance, index === 0 ? PREFILTER_SHADER : DOWNSAMPLE_SHADER, {
            label: `aero-shards-down-${index}`,
            set: { source, linearSampler: linear, bloom: downParams }
          }),
          horizontal: effect(instance, BLUR_SHADER, {
            label: `aero-shards-blur-x-${index}`,
            set: { source: level.main, linearSampler: linear, bloom: horizontalParams }
          }),
          vertical: effect(instance, BLUR_SHADER, {
            label: `aero-shards-blur-y-${index}`,
            set: { source: level.spare, linearSampler: linear, bloom: verticalParams }
          })
        };
      });
      const finishParams = uniforms(instance, { info: [0, 0, 0, 1], paper: [0, 0, 0, 0], mode: [0, 0, 0, 0] });
      const finish = effect(instance, FINISH_SHADER, {
        label: 'aero-shards-finish',
        set: {
          sceneTexture: scene,
          linearSampler: linear,
          bloom0: levels[0].main,
          bloom1: levels[1].main,
          bloom2: levels[2].main,
          bloom3: levels[3].main,
          finish: finishParams
        }
      });
      await Promise.all([
        ...shardSolid.map(item => item.compile(groups[0].layer)),
        ...shardEdge.map(item => item.compile(groups[0].layer)),
        ...layerPasses.flatMap(list =>
          list.flatMap((item, index) => [
            item.shadow.compile(groups[index].shaded),
            item.blurX.compile(groups[index].temp),
            item.blurY.compile(groups[index].blurred),
            item.sharp.compile(scene),
            item.soft.compile(scene)
          ])
        ),
        markerDraw.compile(scene),
        finish.compile({ colors: [format] }),
        ...passes.flatMap((pass, index) => [
          pass.down.compile(levels[index].main),
          pass.horizontal.compile(levels[index].spare),
          pass.vertical.compile(levels[index].main)
        ])
      ]);
      if (disposed) return;

      const paths = Array.from({ length: LEVELS }, () => ({
        position: new Float32Array(SAMPLES * 3),
        tangent: new Float32Array(SAMPLES * 3),
        across: new Float32Array(SAMPLES * 3),
        lift: new Float32Array(SAMPLES * 3),
        length: 1
      }));
      const markerCounts = [0, 0, 0, 0, 0];
      const markerStarts = [0, 0, 0, 0, 0];
      const raw = new Float32Array((SAMPLES + 1) * 3);
      const lengths = new Float32Array(SAMPLES + 1);
      const point = [0, 0, 0];
      let pathKey = '';

      const state = {
        visible: false,
        clock: 0,
        last: 0,
        travel: new Float64Array(LEVELS),
        roll: 0,
        twist: 0,
        drift: 0,
        introAt: -1,
        weights: PLACEMENTS.map((_, index) => (index === settingsRef.current.placement ? 1 : 0)),
        weightVelocity: [0, 0, 0, 0],
        shards: createShards(settingsRef.current.count, 1337),
        order: [],
        pointer: [0.5, 0.5],
        inside: false,
        presence: 0,
        yaw: 0,
        pitch: 0,
        yawVelocity: 0,
        pitchVelocity: 0,
        pressAt: -1,
        pressPoint: null,
        holding: false,
        hold: 0,
        reach: 0,
        gatherCenter: [0, 0, 0],
        rings: [],
        markerDrift: 0,
        markerTarget: '',
        markerTotal: 0,
        targets: new Map(),
        quiet: 0,
        seen: null
      };

      const buildPaths = aspect => {
        const closed = state.weights[3] > 0.999;
        const key = `${aspect.toFixed(4)}|${state.weights.map(w => w.toFixed(4)).join(',')}`;
        if (key === pathKey) return closed;
        pathKey = key;
        for (let level = 0; level < LEVELS; level += 1) {
          const path = paths[level];
          let total = 0;
          for (let i = 0; i <= SAMPLES; i += 1) {
            const s = i / SAMPLES;
            let x = 0;
            let y = 0;
            let z = 0;
            for (let k = 0; k < 4; k += 1) {
              const weight = state.weights[k];
              if (weight < 0.0001) continue;
              ribbonPoint(k, level, s, aspect, point);
              x += point[0] * weight;
              y += point[1] * weight;
              z += point[2] * weight;
            }
            raw[i * 3] = x;
            raw[i * 3 + 1] = y;
            raw[i * 3 + 2] = z;
            if (i > 0) total += Math.hypot(x - raw[i * 3 - 3], y - raw[i * 3 - 2], z - raw[i * 3 - 1]);
            lengths[i] = total;
          }
          path.length = Math.max(total, 1e-3);
          let cursor = 0;
          for (let i = 0; i < SAMPLES; i += 1) {
            const want = (i / (SAMPLES - 1)) * total;
            while (cursor < SAMPLES - 1 && lengths[cursor + 1] < want) cursor += 1;
            const span = Math.max(lengths[cursor + 1] - lengths[cursor], 1e-6);
            const f = clamp((want - lengths[cursor]) / span, 0, 1);
            for (let c = 0; c < 3; c += 1) {
              path.position[i * 3 + c] = raw[cursor * 3 + c] + (raw[cursor * 3 + 3 + c] - raw[cursor * 3 + c]) * f;
            }
          }
          let px = 0;
          let py = 1;
          let pz = 0;
          for (let i = 0; i < SAMPLES; i += 1) {
            const a = Math.max(0, i - 1);
            const b = Math.min(SAMPLES - 1, i + 1);
            let tx = path.position[b * 3] - path.position[a * 3];
            let ty = path.position[b * 3 + 1] - path.position[a * 3 + 1];
            let tz = path.position[b * 3 + 2] - path.position[a * 3 + 2];
            const tl = Math.hypot(tx, ty, tz) || 1;
            tx /= tl;
            ty /= tl;
            tz /= tl;
            if (i === 0) {
              px = -ty;
              py = tx;
              pz = 0;
            }
            const along = px * tx + py * ty + pz * tz;
            px -= tx * along;
            py -= ty * along;
            pz -= tz * along;
            const pl = Math.hypot(px, py, pz) || 1;
            px /= pl;
            py /= pl;
            pz /= pl;
            path.tangent[i * 3] = tx;
            path.tangent[i * 3 + 1] = ty;
            path.tangent[i * 3 + 2] = tz;
            path.across[i * 3] = px;
            path.across[i * 3 + 1] = py;
            path.across[i * 3 + 2] = pz;
            path.lift[i * 3] = ty * pz - tz * py;
            path.lift[i * 3 + 1] = tz * px - tx * pz;
            path.lift[i * 3 + 2] = tx * py - ty * px;
          }
        }
        return closed;
      };

      const resize = () => {
        const next = sizeFor();
        if (next[0] === output.size[0] && next[1] === output.size[1]) return;
        output.resize(next);
        scene.resize(next);
        groups.forEach(group => {
          group.layer.resize(groupSize(group.scale));
          group.shaded.resize(groupSize(group.scale));
          if (group.softReady) {
            group.temp.resize(groupSize(group.scale));
            group.blurred.resize(groupSize(group.scale));
          }
        });
        levels.forEach((level, index) => {
          level.main.resize(levelSize(index));
          level.spare.resize(levelSize(index));
        });
        layerPasses.forEach(list =>
          list.forEach((item, index) => item.shadow.set({ depthMap: groups[index].layer.depth }))
        );
        state.quiet = 0;
      };
      const sizes = new ResizeObserver(resize);
      sizes.observe(container);
      cleanups.push(() => sizes.disconnect());

      const cam = { eye: [0, 0, CAMERA], forward: [0, 0, -1], right: [1, 0, 0], up: [0, 1, 0], focal: 1 };

      const updateCamera = s => {
        const cy = Math.cos(state.yaw);
        const sy = Math.sin(state.yaw);
        const cp = Math.cos(state.pitch);
        const sp = Math.sin(state.pitch);
        cam.eye[0] = sy * cp * CAMERA;
        cam.eye[1] = sp * CAMERA;
        cam.eye[2] = cy * cp * CAMERA;
        cam.forward[0] = -sy * cp;
        cam.forward[1] = -sp;
        cam.forward[2] = -cy * cp;
        const rl = Math.hypot(cam.forward[2], cam.forward[0]) || 1;
        cam.right[0] = -cam.forward[2] / rl;
        cam.right[1] = 0;
        cam.right[2] = cam.forward[0] / rl;
        cam.up[0] = cam.right[1] * cam.forward[2] - cam.right[2] * cam.forward[1];
        cam.up[1] = cam.right[2] * cam.forward[0] - cam.right[0] * cam.forward[2];
        cam.up[2] = cam.right[0] * cam.forward[1] - cam.right[1] * cam.forward[0];
        cam.focal = output.size[1] * 0.5 * CAMERA * s.scale;
      };

      const ray = [0, 0, 1];
      const rayAt = (px, py) => {
        const x = (px - 0.5) * output.size[0];
        const y = (0.5 - py) * output.size[1];
        ray[0] = cam.forward[0] * cam.focal + cam.right[0] * x + cam.up[0] * y;
        ray[1] = cam.forward[1] * cam.focal + cam.right[1] * x + cam.up[1] * y;
        ray[2] = cam.forward[2] * cam.focal + cam.right[2] * x + cam.up[2] * y;
        const length = Math.hypot(ray[0], ray[1], ray[2]) || 1;
        ray[0] /= length;
        ray[1] /= length;
        ray[2] /= length;
        return ray;
      };

      const simulate = (s, dt, reduced) => {
        const aspect = output.size[0] / Math.max(output.size[1], 1);
        const closed = buildPaths(aspect);
        const introOn = s.intro && !reduced;
        const introAge = state.introAt < 0 ? 0 : state.clock - state.introAt;
        const hover = s.mouseInteraction && !reduced ? state.presence * s.mouseStrength : 0;
        let rx = 0;
        let ry = 0;
        let rz = 0;
        if (hover > 0.001) {
          rayAt(state.pointer[0], state.pointer[1]);
          rx = ray[0];
          ry = ray[1];
          rz = ray[2];
        }
        const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
        const h = dt / Math.max(steps, 1);
        const halfHeight = output.size[1] * 0.5;
        const rings = state.rings.map(ring => {
          const life = ring.age / RING_SECONDS;
          return {
            x: ring.x,
            y: ring.y,
            age: ring.age,
            strength: (1 - Math.exp(-ring.age / 0.06)) * (1 - life) * (1 - life)
          };
        });
        const screenOf = (x, y, z, out) => {
          const ex = x - cam.eye[0];
          const ey = y - cam.eye[1];
          const ez = z - cam.eye[2];
          const depth = Math.max(ex * cam.forward[0] + ey * cam.forward[1] + ez * cam.forward[2], 0.05);
          out[0] = ((ex * cam.right[0] + ey * cam.right[1] + ez * cam.right[2]) * cam.focal) / depth / halfHeight;
          out[1] = ((ex * cam.up[0] + ey * cam.up[1] + ez * cam.up[2]) * cam.focal) / depth / halfHeight;
          return depth;
        };
        const ringBand = (sx, sy, level) => {
          let total = 0;
          for (const ring of rings) {
            const radius = Math.max(0, ring.age - level * 0.07) * 2.3;
            const distance = Math.hypot(sx - ring.x, sy - ring.y);
            total += Math.exp(-((distance - radius) * (distance - radius)) / 0.012) * ring.strength;
          }
          return total;
        };
        const flat = [0, 0];
        const shards = state.shards;
        const twistWeight = Math.min(1, s.twist);
        for (let index = 0; index < shards.length; index += 1) {
          const shard = shards[index];
          const level = shard.level;
          const path = paths[level];
          let s0 = (shard.phase + state.travel[level]) % 1;
          let appear = 1;
          let introBank = 0;
          if (introOn) {
            const begin =
              level * 0.22 + Math.max(0, s0 - 0.1) * (INTRO_SECONDS - 1.0 - (LEVELS - 1) * 0.22) + shard.arrive * 0.15;
            const local = clamp((introAge - begin) / 0.9, 0, 1);
            appear = smoother(local);
            const glide = (1 - local) * (1 - local);
            s0 = closed ? s0 - glide * 0.06 : Math.max(0, s0 - glide * 0.06);
            introBank = glide * 0.9 * shard.sign;
          }
          shard.s = s0;
          const f = (((s0 % 1) + 1) % 1) * (SAMPLES - 1);
          const i0 = Math.floor(f);
          const i1 = Math.min(i0 + 1, SAMPLES - 1);
          const t = f - i0;
          const at = (array, c) => array[i0 * 3 + c] + (array[i1 * 3 + c] - array[i0 * 3 + c]) * t;
          const cx = at(path.position, 0);
          const cy = at(path.position, 1);
          const cz = at(path.position, 2);
          const tx = at(path.tangent, 0);
          const ty = at(path.tangent, 1);
          const tz = at(path.tangent, 2);
          const ax0 = at(path.across, 0);
          const ay0 = at(path.across, 1);
          const az0 = at(path.across, 2);
          const lx0 = at(path.lift, 0);
          const ly0 = at(path.lift, 1);
          const lz0 = at(path.lift, 2);
          const angle = s.twist * (s0 * TAU * 0.6 + state.twist + level * 1.7);
          const ca = Math.cos(angle);
          const sa = Math.sin(angle);
          const ax = ax0 * ca + lx0 * sa;
          const ay = ay0 * ca + ly0 * sa;
          const az = az0 * ca + lz0 * sa;
          const bx = lx0 * ca - ax0 * sa;
          const by = ly0 * ca - ay0 * sa;
          const bz = lz0 * ca - az0 * sa;
          const depthScale = DEPTHS[level] / CAMERA;
          const width =
            s.spread * (0.15 + 0.035 * DEPTHS[level]) * (0.8 + 0.3 * Math.sin(s0 * TAU * 1.3 + level * 0.8));
          const lane = shard.lane * width;
          const layer = shard.layer * 0.012 * depthScale;
          const taper = closed ? 1 : smoother(s0 / 0.12) * smoother((1 - s0) / 0.12);
          const billow =
            s.billow *
            0.16 *
            depthScale *
            Math.sin(s0 * TAU * 1.3 - state.drift * 0.5 + level * 1.1) *
            (0.4 + 0.6 * taper);
          const sway = s.billow * 0.06 * depthScale * Math.sin(s0 * TAU * 0.8 - state.drift * 0.35 + level * 2.4);
          const wobble = 0.009 * depthScale;
          const drift = state.drift;
          const hx =
            cx +
            lx0 * billow +
            ax0 * sway +
            ax * lane +
            bx * layer +
            Math.sin(drift * shard.rate[0] + shard.drift[0]) * wobble;
          const hy =
            cy +
            ly0 * billow +
            ay0 * sway +
            ay * lane +
            by * layer +
            Math.sin(drift * shard.rate[1] + shard.drift[1]) * wobble;
          const hz =
            cz +
            lz0 * billow +
            az0 * sway +
            az * lane +
            bz * layer +
            Math.sin(drift * shard.rate[2] + shard.drift[2]) * wobble;

          let fx = 0;
          let fy = 0;
          let fz = 0;
          let tiltTarget = 0;
          const px = hx + shard.offset[0];
          const py = hy + shard.offset[1];
          const pz = hz + shard.offset[2];
          if (hover > 0.001) {
            const ex = px - cam.eye[0];
            const ey = py - cam.eye[1];
            const ez = pz - cam.eye[2];
            const along = ex * rx + ey * ry + ez * rz;
            const qx = ex - rx * along;
            const qy = ey - ry * along;
            const qz = ez - rz * along;
            const gap = Math.hypot(qx, qy, qz);
            const reach = (0.24 * depthScale) / s.scale;
            const falloff = Math.exp(-(gap * gap) / (reach * reach));
            if (falloff > 0.002 && gap > 1e-5) {
              const nx = qx / gap;
              const ny = qy / gap;
              const nz = qz / gap;
              const sideways = (nx * tx + ny * ty + nz * tz) * 0.7;
              const strength = hover * falloff * 9 * depthScale;
              fx += (nx - tx * sideways) * strength;
              fy += (ny - ty * sideways) * strength;
              fz += (nz - tz * sideways) * strength;
              tiltTarget += hover * falloff * 1.1 * (nx * ax0 + ny * ay0 + nz * az0);
            }
          }

          if (state.hold > 0.001 && shard.joined) {
            const slot = shard.slot;
            const orbit = slot[0] + state.clock * (0.8 / (0.12 + slot[1])) * slot[3];
            const radius = slot[1] / s.scale;
            const gx = state.gatherCenter[0] + Math.cos(orbit) * radius;
            const gy = state.gatherCenter[1] + Math.sin(orbit) * radius * 0.75;
            const gz = state.gatherCenter[2] + Math.sin(orbit) * radius * 0.45 + slot[2] * 0.3;
            shard.gather += (state.hold - shard.gather) * (1 - Math.exp(-dt / 0.3));
            const pull = shard.gather * 30;
            fx += (gx - px) * pull;
            fy += (gy - py) * pull;
            fz += (gz - pz) * pull;
            tiltTarget += shard.gather * 0.6 * Math.sin(orbit);
          } else {
            shard.gather += (0 - shard.gather) * (1 - Math.exp(-dt / 0.2));
          }

          if (rings.length) {
            screenOf(px, py, pz, flat);
            for (const ring of rings) {
              const radius = Math.max(0, ring.age - level * 0.07) * 2.3;
              const dxr = flat[0] - ring.x;
              const dyr = flat[1] - ring.y;
              const distance = Math.hypot(dxr, dyr);
              const band = Math.exp(-((distance - radius) * (distance - radius)) / 0.012) * ring.strength;
              if (band > 0.01) {
                shard.flash = Math.max(shard.flash, band * 0.75);
                const outward = Math.max(distance, 0.05);
                const ux = (cam.right[0] * dxr + cam.up[0] * dyr) / outward;
                const uy = (cam.right[1] * dxr + cam.up[1] * dyr) / outward;
                const uz = (cam.right[2] * dxr + cam.up[2] * dyr) / outward;
                tiltTarget += band * 1.4 * (ux * ax0 + uy * ay0 + uz * az0);
                const push = (band * 2.2 * depthScale) / Math.max(distance, 0.05);
                fx += (cam.right[0] * dxr + cam.up[0] * dyr) * push;
                fy += (cam.right[1] * dxr + cam.up[1] * dyr) * push;
                fz += (cam.right[2] * dxr + cam.up[2] * dyr) * push;
              }
            }
          }

          const stiffness = 24 * (1 - shard.gather * 0.95);
          for (let step = 0; step < steps; step += 1) {
            shard.velocity[0] += (fx - stiffness * shard.offset[0] - 7.5 * shard.velocity[0]) * h;
            shard.velocity[1] += (fy - stiffness * shard.offset[1] - 7.5 * shard.velocity[1]) * h;
            shard.velocity[2] += (fz - stiffness * shard.offset[2] - 7.5 * shard.velocity[2]) * h;
            shard.offset[0] += shard.velocity[0] * h;
            shard.offset[1] += shard.velocity[1] * h;
            shard.offset[2] += shard.velocity[2] * h;
            shard.tiltVelocity += (90 * (tiltTarget - shard.tilt) - 15 * shard.tiltVelocity) * h;
            shard.tilt += shard.tiltVelocity * h;
          }
          shard.flash *= Math.exp(-dt / 0.45);

          const ox = hx + shard.offset[0];
          const oy = hy + shard.offset[1];
          const oz = hz + shard.offset[2];
          shard.position[0] = ox;
          shard.position[1] = oy;
          shard.position[2] = oz;

          let vx = cam.eye[0] - ox;
          let vy = cam.eye[1] - oy;
          let vz = cam.eye[2] - oz;
          const vl = Math.hypot(vx, vy, vz) || 1;
          vx /= vl;
          vy /= vl;
          vz /= vl;
          let dx = tx + shard.velocity[0] * 0.05;
          let dy = ty + shard.velocity[1] * 0.05;
          let dz = tz + shard.velocity[2] * 0.05;
          const facingPart = dx * vx + dy * vy + dz * vz;
          dx -= vx * facingPart;
          dy -= vy * facingPart;
          dz -= vz * facingPart;
          let dl = Math.hypot(dx, dy, dz);
          if (dl < 1e-4) {
            dx = cam.right[0];
            dy = cam.right[1];
            dz = cam.right[2];
            dl = 1;
          }
          dx /= dl;
          dy /= dl;
          dz /= dl;
          const wx = vy * dz - vz * dy;
          const wy = vz * dx - vx * dz;
          const wz = vx * dy - vy * dx;
          const yaw = shard.yaw + 0.05 * Math.sin(state.clock * shard.flutter[1] * 0.7 + shard.flutter[0]);
          const cyaw = Math.cos(yaw);
          const syaw = Math.sin(yaw);
          const kx = dx * cyaw + wx * syaw;
          const ky = dy * cyaw + wy * syaw;
          const kz = dz * cyaw + wz * syaw;
          const jx = wx * cyaw - dx * syaw;
          const jy = wy * cyaw - dy * syaw;
          const jz = wz * cyaw - dz * syaw;
          const wave =
            0.8 * twistWeight * Math.sin(angle) +
            0.3 * Math.sin(s0 * TAU * 1.6 - state.roll * 0.55 + level * 0.9 + shard.lane * 0.7);
          const flutter = 0.06 * Math.sin(state.clock * shard.flutter[1] + shard.flutter[0]);
          const bank = MAX_BANK * Math.tanh((wave + shard.bank + flutter + shard.tilt + introBank) / MAX_BANK);
          const cb = Math.cos(bank);
          const sb = Math.sin(bank);
          const mx = vx * cb + jx * sb;
          const my = vy * cb + jy * sb;
          const mz = vz * cb + jz * sb;
          const pitch = shard.pitch + 0.2 * Math.sin(s0 * TAU * 1.1 - state.roll * 0.4 + level * 2.1);
          const cp = Math.cos(pitch);
          const sp = Math.sin(pitch);
          const axisX = kx * cp + mx * sp;
          const axisY = ky * cp + my * sp;
          const axisZ = kz * cp + mz * sp;
          const nx = mx * cp - kx * sp;
          const ny = my * cp - ky * sp;
          const nz = mz * cp - kz * sp;

          const ex = ox - cam.eye[0];
          const ey = oy - cam.eye[1];
          const ez = oz - cam.eye[2];
          const viewDepth = ex * cam.forward[0] + ey * cam.forward[1] + ez * cam.forward[2];
          depths[index] = viewDepth;
          const core = 1 - 0.45 * shard.lane * shard.lane;
          const size = 0.062 * s.shardSize * shard.size * GROWTH[level] * appear * Math.sqrt(taper) * core;
          const o = index * FLOATS;
          staging[o] = ox;
          staging[o + 1] = oy;
          staging[o + 2] = oz;
          staging[o + 3] = size > 1e-5 ? size : 0;
          staging[o + 4] = axisX;
          staging[o + 5] = axisY;
          staging[o + 6] = axisZ;
          staging[o + 7] = shard.thickness;
          staging[o + 8] = nx;
          staging[o + 9] = ny;
          staging[o + 10] = nz;
          staging[o + 11] = shard.tint;
          for (let k = 0; k < 10; k += 1) staging[o + 12 + k] = shard.shape[k];
          staging[o + 22] = shard.sides;
          staging[o + 23] = shard.flash;
        }

        let markerTotal = 0;
        for (let level = 0; level < LEVELS; level += 1) {
          markerCounts[level] = 0;
          markerStarts[level] = 0;
        }
        if (s.markers >= 0) {
          const ratio = output.size[1] / Math.max(container.clientHeight, 1);
          const pointerX = (state.pointer[0] - 0.5) * 2 * aspect;
          const pointerY = (0.5 - state.pointer[1]) * 2;
          const engaged = s.mouseInteraction && !reduced ? state.presence : 0;
          const previousTargets = state.targets;
          const nextTargets = new Map();
          const targetEase = 1 - Math.exp(-dt / 0.12);
          let nearestKey = '';
          let nearestGap = 72;
          for (let level = LEVELS - 1; level >= 0; level -= 1) {
            markerStarts[level] = markerTotal;
            const depth = DEPTHS[level];
            const depthScale = depth / CAMERA;
            const spacing = 0.42 * Math.pow(depthScale, 0.55);
            const halfW = ((aspect * depth) / (CAMERA * s.scale)) * 1.12 + spacing;
            const halfH = (depth / (CAMERA * s.scale)) * 1.12 + spacing;
            const drift = state.markerDrift;
            const phase = MARKER_PHASES[level];
            const i0 = Math.floor((drift - halfW) / spacing - phase[0]);
            const i1 = Math.ceil((drift + halfW) / spacing - phase[0]);
            const j0 = Math.floor(-halfH / spacing - phase[1]);
            const j1 = Math.ceil(halfH / spacing - phase[1]);
            const band = s.spread * (0.15 + 0.035 * depth) * 1.4;
            const position = paths[level].position;
            for (let i = i0; i <= i1; i += 1) {
              for (let j = j0; j <= j1; j += 1) {
                const keep = latticeHash(level, i, j, 11);
                if (keep > 0.5) continue;
                const x = (i + phase[0]) * spacing - drift;
                const y = (j + phase[1]) * spacing;
                const z = CAMERA - depth;
                const markerDepth = screenOf(x, y, z, flat);
                if (Math.abs(flat[0]) > aspect * 1.05 || Math.abs(flat[1]) > 1.05) continue;
                let best = Infinity;
                for (let k = 0; k < SAMPLES; k += 2) {
                  const dx = x - position[k * 3];
                  const dy = y - position[k * 3 + 1];
                  const dz = z - position[k * 3 + 2];
                  const d2 = dx * dx + dy * dy + dz * dz;
                  if (d2 < best) best = d2;
                }
                const near = Math.exp(-best / (band * band));
                const blinkSeed = latticeHash(level, i, j, 23);
                const blinkRate = latticeHash(level, i, j, 37);
                const blink =
                  blinkSeed < 0.07 ? 0.5 + 0.5 * Math.sin(state.clock * (1.4 + blinkRate * 2.2) + blinkRate * 40) : 0;
                const pointerGap = (Math.hypot(flat[0] - pointerX, flat[1] - pointerY) * halfHeight) / ratio;
                const key = `${level}:${i}:${j}`;
                if (level <= 2 && engaged > 0.01 && pointerGap < nearestGap) {
                  nearestGap = pointerGap;
                  nearestKey = key;
                }
                const wanted = key === state.markerTarget ? engaged * (1 - smoother((pointerGap - 30) / 42)) : 0;
                const before = previousTargets.get(key) ?? 0;
                const target = before + (wanted - before) * targetEase;
                if (target > 0.002) nextTargets.set(key, target);
                const bracket = Math.max(smoother((blink - 0.55) / 0.4), target);
                let ring = 0;
                if (rings.length) ring = ringBand(flat[0], flat[1], level);
                let reveal = 1;
                if (introOn) {
                  const across = clamp((flat[0] / aspect + 1) * 0.5, 0, 1);
                  const begin = level * 0.22 + 0.35 + across * (INTRO_SECONDS - 1.3 - (LEVELS - 1) * 0.22);
                  reveal = smoother((introAge - begin) / 0.5);
                }
                const fade = FADE[level] * (1 - smoother((markerDepth - 3) / 10) * 0.45) * reveal;
                if (fade < 0.002) continue;
                if (markerTotal >= markerCapacity) ensureMarkers(markerCapacity * 2);
                const o = markerTotal * MARKER_FLOATS;
                markerData[o] = x;
                markerData[o + 1] = y;
                markerData[o + 2] = z;
                markerData[o + 3] = fade;
                markerData[o + 4] = 0.42 + 0.5 * near + blink * 0.9 + target * 1.3 + ring * 2.5;
                markerData[o + 5] = bracket;
                markerData[o + 6] = 1 + 0.15 * near + 0.3 * blink + 0.2 * target;
                markerData[o + 7] = 0;
                markerTotal += 1;
                markerCounts[level] += 1;
              }
            }
          }
          state.targets = nextTargets;
          state.markerTarget = nearestKey;
        }
        state.markerTotal = markerTotal;
      };

      const render = (s, dt, reduced) => {
        updateCamera(s);
        const shards = state.shards;
        ensureCapacity(shards.length);
        simulate(s, dt, reduced);
        if (state.order.length !== shards.length) state.order = shards.map((_, index) => index);
        const order = state.order;
        for (let i = 0; i < shards.length; i += 1) depths[i] += shards[i].level * 100;
        for (let i = 1; i < order.length; i += 1) {
          const value = order[i];
          const key = depths[value];
          let j = i - 1;
          while (j >= 0 && depths[order[j]] < key) {
            order[j + 1] = order[j];
            j -= 1;
          }
          order[j + 1] = value;
        }
        const counts = [0, 0, 0, 0, 0];
        for (let slot = 0; slot < order.length; slot += 1) {
          const from = order[slot] * FLOATS;
          const to = slot * FLOATS;
          counts[shards[order[slot]].level] += 1;
          for (let k = 0; k < FLOATS; k += 1) upload[to + k] = staging[from + k];
        }
        shardBuffer?.write(upload.subarray(0, shards.length * FLOATS));
        if (state.markerTotal > 0) markerBuffer?.write(markerData.subarray(0, state.markerTotal * MARKER_FLOATS));
        const starts = [0, 0, 0, 0, 0];
        let running = 0;
        for (let level = LEVELS - 1; level >= 0; level -= 1) {
          starts[level] = running;
          running += counts[level];
        }

        frameParams.set({
          view: [output.size[0], output.size[1], cam.focal, state.clock],
          eye: [cam.eye[0], cam.eye[1], cam.eye[2], FOCUS],
          forward: [cam.forward[0], cam.forward[1], cam.forward[2], s.depthOfField * output.size[1] * 0.03],
          right: [cam.right[0], cam.right[1], cam.right[2], output.size[1] * 0.05],
          up: [cam.up[0], cam.up[1], cam.up[2], s.lightMode ? 1 : 0],
          shard: [...s.shard, 0],
          accent: [...s.accent, 0],
          surface: s.material,
          marker: [
            s.markers,
            output.size[1] / Math.max(container.clientHeight, 1),
            4 * (output.size[1] / Math.max(container.clientHeight, 1)),
            FOCUS
          ]
        });
        passes.forEach(({ downParams, horizontalParams, verticalParams, source, level }) => {
          downParams.set({ texel: [0.5 / source.size[0], 0.5 / source.size[1], 0.75, 0.5] });
          horizontalParams.set({ texel: [1 / level.main.size[0], 0, 0, 0] });
          verticalParams.set({ texel: [0, 1 / level.main.size[1], 0, 0] });
        });
        const paper = s.paper ?? [0, 0, 0];
        const blooming = s.glow > 0.001 && !s.lightMode;
        finishParams.set({
          info: [s.grain, Math.floor(state.clock * 24), blooming ? s.glow : 0, 1.3],
          paper: [paper[0], paper[1], paper[2], s.paper ? 1 : 0],
          mode: [s.lightMode ? 1 : 0, s.vignette, 0, 0]
        });

        const coc = s.depthOfField * output.size[1] * 0.012;
        const cap = output.size[1] * 0.02;
        const plan = DEPTHS.map((depth, level) => {
          const sigma = Math.min(coc * Math.abs(1 - SHARD_FOCUS / depth), cap);
          const groupIndex = sigma >= 2.2 ? 1 : 0;
          const group = groups[groupIndex];
          const soft = sigma >= 0.45;
          if (soft && !group.softReady) {
            group.softReady = true;
            group.temp.resize(groupSize(group.scale));
            group.blurred.resize(groupSize(group.scale));
          }
          const size = group.layer.size;
          layerParams[level].set({
            view: [size[0], size[1], cam.focal * (size[0] / output.size[0]), level],
            look: [s.lightMode ? 0.5 : 0.7, 0, 0, 0]
          });
          const local = sigma * group.scale;
          spreadX[level].set({ texel: [1 / size[0], 0, local, 0] });
          spreadY[level].set({ texel: [0, 1 / size[1], local, 0] });
          mixParams[level].set({ info: [FADE[level], 0, 0, 0] });
          const step = Math.max(0.6, 1.4 * (size[0] / Math.max(container.clientWidth, 1)));
          const shadowStrength = s.material === MATERIALS.glass ? 0 : s.lightMode ? 0.32 : 0.62;
          shadeParams[level].set({ info: [step * 0.55, step * 0.85, shadowStrength, 0], more: [0.00045, 0, 0, 0] });
          return { group, groupIndex, soft };
        });

        frame(instance, current => {
          for (let level = LEVELS - 1; level >= 0; level -= 1) {
            const { group, groupIndex, soft } = plan[level];
            const steps = layerPasses[level][groupIndex];
            if (counts[level] > 0) {
              current.pass({ target: group.layer, clear: [0, 0, 0, 0], clearDepth: 1 }, pass => {
                pass.draw(shardSolid[level], { instances: counts[level], firstInstance: starts[level] });
                pass.draw(shardEdge[level], { instances: counts[level], firstInstance: starts[level] });
              });
              current.pass({ target: group.shaded, clear: [0, 0, 0, 0] }, pass => pass.draw(steps.shadow));
              if (soft) {
                current.pass({ target: group.temp, clear: [0, 0, 0, 0] }, pass => pass.draw(steps.blurX));
                current.pass({ target: group.blurred, clear: [0, 0, 0, 0] }, pass => pass.draw(steps.blurY));
              }
            }
            current.pass({ target: scene, clear: level === LEVELS - 1 ? [0, 0, 0, 0] : false }, pass => {
              if (markerCounts[level] > 0) {
                pass.draw(markerDraw, { instances: markerCounts[level], firstInstance: markerStarts[level] });
              }
              if (counts[level] > 0) pass.draw(soft ? steps.soft : steps.sharp);
            });
          }
          passes.forEach((pass, index) => {
            const level = levels[index];
            if (!blooming) {
              current.pass({ target: level.main, clear: [0, 0, 0, 0] }, () => {});
              return;
            }
            current.pass({ target: level.main, clear: [0, 0, 0, 0] }, p => p.draw(pass.down));
            current.pass({ target: level.spare, clear: [0, 0, 0, 0] }, p => p.draw(pass.horizontal));
            current.pass({ target: level.main, clear: [0, 0, 0, 0] }, p => p.draw(pass.vertical));
          });
          current.pass({ target: output, clear: [0, 0, 0, 0] }, pass => pass.draw(finish));
        });
      };

      const tick = now => {
        raf = requestAnimationFrame(tick);
        if (!state.visible || document.hidden) {
          state.last = now;
          return;
        }
        const s = settingsRef.current;
        const dt = state.last ? Math.min((now - state.last) / 1000, 0.05) : 0;
        state.last = now;
        const reduced = prefersReduced();
        state.clock += dt;
        if (state.introAt < 0) state.introAt = state.clock;
        if (state.shards.length !== s.count) {
          state.shards = createShards(s.count, 1337);
          state.order = [];
        }
        const moving = !s.paused && !reduced;
        if (moving) {
          for (let level = 0; level < LEVELS; level += 1) {
            state.travel[level] = (state.travel[level] + (dt * s.speed * 0.09) / paths[level].length) % 1;
          }
          state.roll += dt * s.speed * 1.0;
          state.twist += dt * s.speed * 0.08;
          state.drift += dt * s.speed;
        }

        const goal = PLACEMENTS.map((_, index) => (index === s.placement ? 1 : 0));
        let settling = false;
        const decay = Math.exp(-4 * dt);
        for (let index = 0; index < 4; index += 1) {
          const offset = state.weights[index] - goal[index];
          const momentum = state.weightVelocity[index] + 4 * offset;
          state.weights[index] = goal[index] + (offset + momentum * dt) * decay;
          state.weightVelocity[index] = (state.weightVelocity[index] - 4 * momentum * dt) * decay;
          if (Math.abs(state.weights[index] - goal[index]) > 0.0005) settling = true;
        }
        if (!settling) {
          state.weights = goal;
          state.weightVelocity = [0, 0, 0, 0];
        }

        const engaged = s.mouseInteraction && state.inside && !reduced;
        state.presence += ((engaged ? 1 : 0) - state.presence) * (1 - Math.exp(-dt / 0.25));
        const lean = engaged ? s.parallax : 0;
        const targetYaw = (state.pointer[0] - 0.5) * lean * 0.14;
        const targetPitch = (state.pointer[1] - 0.5) * lean * 0.08;
        state.yawVelocity += (38 * (targetYaw - state.yaw) - 11 * state.yawVelocity) * dt;
        state.pitchVelocity += (38 * (targetPitch - state.pitch) - 11 * state.pitchVelocity) * dt;
        state.yaw += state.yawVelocity * dt;
        state.pitch += state.pitchVelocity * dt;
        const leaning =
          Math.abs(targetYaw - state.yaw) + Math.abs(targetPitch - state.pitch) > 1e-4 ||
          Math.abs(state.yawVelocity) + Math.abs(state.pitchVelocity) > 1e-4;

        if (
          state.pressAt >= 0 &&
          state.pressPoint &&
          s.holdToGather &&
          !reduced &&
          state.clock - state.pressAt > 0.18
        ) {
          if (!state.holding) {
            state.holding = true;
            updateCamera(s);
            rayAt(state.pressPoint[0], state.pressPoint[1]);
            const travelTo =
              FOCUS / Math.max(ray[0] * cam.forward[0] + ray[1] * cam.forward[1] + ray[2] * cam.forward[2], 0.2);
            state.gatherCenter = [
              cam.eye[0] + ray[0] * travelTo,
              cam.eye[1] + ray[1] * travelTo,
              cam.eye[2] + ray[2] * travelTo
            ];
            state.reach = 0;
          }
          state.hold = Math.min(1, state.hold + dt / 0.5);
          state.reach = Math.min(state.reach + dt * 0.5, 0.55);
          const reach = (0.22 + state.reach) / s.scale;
          for (const shard of state.shards) {
            if (shard.joined || shard.level > 2) continue;
            const gx = shard.position[0] - state.gatherCenter[0];
            const gy = shard.position[1] - state.gatherCenter[1];
            if (gx * gx + gy * gy < reach * reach) shard.joined = true;
          }
        } else if (state.hold > 0) {
          state.hold = Math.max(0, state.hold - dt / 0.3);
          if (state.hold === 0) {
            for (const shard of state.shards) shard.joined = false;
          }
        }

        for (const ring of state.rings) ring.age += dt;
        state.rings = state.rings.filter(ring => ring.age < RING_SECONDS);
        if (moving) state.markerDrift += dt * s.speed * 0.045;

        const flashing = state.shards.some(
          shard => shard.flash > 0.01 || Math.abs(shard.tiltVelocity) > 0.01 || Math.abs(shard.tilt) > 0.01
        );
        const transient =
          settling ||
          leaning ||
          flashing ||
          state.presence > 0.002 ||
          state.rings.length > 0 ||
          state.hold > 0 ||
          (s.intro && !reduced && state.clock - state.introAt < INTRO_SECONDS + 0.5);
        if (state.seen !== s || transient || moving) state.quiet = 0;
        else state.quiet += 1;
        state.seen = s;
        if (state.quiet > 30) return;
        resize();
        render(s, dt, reduced);
      };

      const local = event => {
        const rect = container.getBoundingClientRect();
        return {
          point: [
            (event.clientX - rect.left) / Math.max(rect.width, 1),
            (event.clientY - rect.top) / Math.max(rect.height, 1)
          ],
          inside:
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        };
      };

      const onMove = event => {
        const hit = local(event);
        state.inside = hit.inside;
        if (hit.inside) state.pointer = hit.point;
      };

      const onLeave = () => {
        state.inside = false;
      };

      const onDown = event => {
        const s = settingsRef.current;
        if (event.button !== 0 || prefersReduced() || !s.mouseInteraction) return;
        if (
          event.target instanceof Element &&
          event.target.closest('a, button, input, textarea, select, label, [role="button"]')
        )
          return;
        const hit = local(event);
        if (!hit.inside) return;
        state.pointer = hit.point;
        state.pressAt = state.clock;
        state.pressPoint = hit.point;
      };

      const onUp = () => {
        const s = settingsRef.current;
        if (state.pressAt < 0) return;
        if (!state.holding && s.pulseOnClick && state.pressPoint) {
          const aspect = output.size[0] / Math.max(output.size[1], 1);
          state.rings.push({
            x: (state.pressPoint[0] * 2 - 1) * aspect,
            y: 1 - state.pressPoint[1] * 2,
            age: 0
          });
          if (state.rings.length > MAX_RINGS) state.rings.shift();
        }
        if (state.holding) {
          for (const shard of state.shards) {
            if (shard.joined) shard.tiltVelocity += 9 * shard.sign;
          }
        }
        state.pressAt = -1;
        state.holding = false;
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      document.documentElement.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      });

      const visibility = new IntersectionObserver(entries => {
        state.visible = entries.some(entry => entry.isIntersecting);
      });
      visibility.observe(container);
      cleanups.push(() => visibility.disconnect());
      raf = requestAnimationFrame(tick);
    };

    start().catch(fail);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach(cleanup => cleanup());
      gpu?.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} className={[ROOT, className].filter(Boolean).join(' ')} style={style} />;
}

```

### Component CSS
```css
.aero-shards {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.aero-shards-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <InfiniteSpiral /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: InfiniteSpiral
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import InfiniteSpiral from './InfiniteSpiral';

const images = [
  { src: '/images/landscape-1.jpg', alt: 'Mountain lake' },
  { src: '/images/landscape-2.jpg', alt: 'Forest path' },
  { src: '/images/landscape-3.jpg', alt: 'Rocky summit' },
  { src: '/images/landscape-4.jpg', alt: 'Ocean shore' },
  { src: '/images/landscape-5.jpg', alt: 'Green meadow' },
  { src: '/images/landscape-6.jpg', alt: 'Desert light' }
];

<div style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
  <InfiniteSpiral
    items={images}
    animationMode="all"
    speed={0.55}
    radius={170}
    cardWidth={100}
    cardHeight={100}
    verticalSpacing={60}
    perspective={1000}
    cardRadius={10}
    centerScale={1.2}
    edgeBlur={6}
    cardsPerTurn={7}
    pauseOnHover
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | (string | SpiralItem)[] | [] | Images shown in the spiral. Objects may also include alt, href, target, label and id. |
| speed | number | 0.55 | Automatic travel speed in cards per second and the sensitivity of scroll-controlled motion. |
| direction | "up" | "down" | "up" | Vertical travel direction. |
| animationMode | "auto" | "drag" | "scroll" | "all" | "auto" | Selects automatic motion, pointer dragging, page-scroll control or all interactions. |
| radius | number | 170 | Depth radius of the helix in pixels. |
| cardWidth | number | 100 | Card width in pixels. |
| cardHeight | number | 100 | Card height in pixels. |
| verticalSpacing | number | 60 | Vertical distance between neighboring cards. |
| perspective | number | 1000 | CSS perspective applied to the 3D stage. |
| cardsPerTurn | number | 7 | Number of cards used for one complete revolution. |
| rotation | number | 0 | Global angular offset in degrees. |
| cardTilt | number | 0 | Additional clockwise card tilt in degrees. |
| cardRadius | number | 10 | Card corner radius in pixels. |
| centerScale | number | 1.2 | Scale multiplier for cards nearest the center. |
| edgeFade | number | 0.3 | Fraction of the outer travel range used for fading. |
| edgeBlur | number | 6 | Maximum blur applied near the edges. |
| pauseOnHover | boolean | true | Smoothly eases automatic motion to a stop while the gallery is hovered. |
| imageFit | "cover" | "contain" | "cover" | Object fit used by every image. |
| grayscale | number | 0 | Grayscale amount applied to every image, from 0 to 1. |
| className | string | "" | Additional class names for the root element. |

### Full Component Source
```jsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import './InfiniteSpiral.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

const InfiniteSpiral = ({
  items = [],
  speed = 0.55,
  direction = 'up',
  animationMode = 'auto',
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = 'cover',
  grayscale = 0,
  className = ''
}) => {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const dragMovedRef = useRef(false);

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) =>
        typeof item === 'string'
          ? { src: item, alt: `Spiral image ${index + 1}` }
          : { alt: `Spiral image ${index + 1}`, ...item }
      ),
    [items]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frameId;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scrollEnabled = animationMode === 'scroll' || animationMode === 'all';
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
    let lastScrollY = window.scrollY;

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(root);

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return;
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
        -1.5,
        1.5
      );
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = time => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const autoEnabled = animationMode === 'auto' || animationMode === 'all';
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current);
      const directionMultiplier = direction === 'down' ? -1 : 1;
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11));
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const responsiveRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        let offset = index - progressRef.current;
        offset = modulo(offset + half, count) - half;

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angle = offset * (360 / turnSize) + rotation;
        const angleRadians = (angle * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
        const visualScale = scale * depthScale;
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
        const blur = edgeBlur * smoothstep(0.35, 1, edge);
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none';
        card.style.zIndex = String(Math.round(depth * 100000) + index);
        card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover
  ]);

  const rootStyle = {
    perspective: `${perspective}px`,
    '--infinite-spiral-card-width': `${cardWidth}px`,
    '--infinite-spiral-card-height': `${cardHeight}px`,
    '--infinite-spiral-card-radius': `${cardRadius}px`,
    cursor: animationMode === 'drag' || animationMode === 'all' ? 'grab' : 'default',
    touchAction: animationMode === 'drag' || animationMode === 'all' ? 'pan-x' : 'auto',
    userSelect: animationMode === 'drag' || animationMode === 'all' ? 'none' : 'auto'
  };

  const dragEnabled = animationMode === 'drag' || animationMode === 'all';

  const stopDragging = event => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.cursor = dragEnabled ? 'grab' : 'default';
  };

  return (
    <div
      ref={rootRef}
      className={`infinite-spiral ${className}`.trim()}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onPointerDown={event => {
        if (!dragEnabled || event.button !== 0) return;
        draggingRef.current = true;
        dragMovedRef.current = false;
        lastPointerYRef.current = event.clientY;
        targetProgressRef.current = progressRef.current;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.cursor = 'grabbing';
      }}
      onPointerMove={event => {
        if (!draggingRef.current) return;
        const pointerDelta = event.clientY - lastPointerYRef.current;
        lastPointerYRef.current = event.clientY;
        if (Math.abs(pointerDelta) > 0.5) dragMovedRef.current = true;
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1);
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={event => {
        if (!dragMovedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragMovedRef.current = false;
      }}
    >
      <div className="infinite-spiral__stage" role="list" aria-label="Infinite spiral gallery">
        {normalizedItems.map((item, index) => {
          const Card = item.href ? 'a' : 'div';
          return (
            <Card
              key={item.id ?? `${item.src}-${index}`}
              ref={node => {
                cardRefs.current[index] = node;
              }}
              className="infinite-spiral__item"
              style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noreferrer' : undefined}
              role="listitem"
              aria-label={item.label ?? item.alt}
            >
              <img
                className="infinite-spiral__image"
                src={item.src}
                alt={item.alt}
                loading={index < 6 ? 'eager' : 'lazy'}
                draggable={false}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  objectFit: imageFit,
                  filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})`
                }}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InfiniteSpiral;

```

### Component CSS
```css
.infinite-spiral {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 320px;
  overflow: hidden;
  isolation: isolate;
}

.infinite-spiral__stage {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.infinite-spiral__item {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: var(--infinite-spiral-card-width);
  height: var(--infinite-spiral-card-height);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.24);
  border-radius: var(--infinite-spiral-card-radius);
  background: rgb(255 255 255 / 0.08);
  box-shadow: 0 14px 38px rgb(8 6 18 / 0.2);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity, filter;
  text-decoration: none;
}

.infinite-spiral__image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-position: center;
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .infinite-spiral__item {
    transition: none;
  }
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.


## Integrate the <GridScan /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: GridScan
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import GridScan from './GridScan';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <GridScan
    linesColor="#4d4757"
    scanColor="#7dd3fc"
    cells={8}
    depth={3}
    scanDuration={2.4}
    scanDelay={1.6}
    clickEffect="ping"
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| linesColor | string | '#4d4757' | Color of the grid lines. Light mode defaults to a pale gray. |
| scanColor | string | '#7dd3fc' | Color of the scan, its trail, the points and the click ping. Light mode defaults to a deeper blue. |
| cells | number | 8 | Number of grid cells from the floor to the ceiling. |
| lineThickness | number | 1 | Thickness of the grid lines in pixels. |
| lineStyle | 'solid' | 'dashed' | 'dotted' | 'solid' | Style of the grid lines. |
| depth | number | 3 | How deep the room goes, relative to its height. High values turn it into a long corridor. |
| depthFade | number | 0.6 | How much the room fades into the distance, from 0 (evenly bright) to 1 (gone by the back wall). |
| parallax | number | 1 | How far the view shifts as the cursor moves, as if you were moving your head in front of a window. 0 keeps it still. |
| shading | number | 0.7 | Soft light and corner shadows on the walls, from 0 (pure wireframe) to 1. |
| reflection | number | 0.35 | How much the glossy floor reflects the scan and pings, from 0 to 1. |
| points | boolean | true | Scatters points over the walls that sparkle as the scan passes, like a LiDAR capture. |
| scanDirection | 'forward' | 'backward' | 'pingpong' | 'forward' | Whether the scan travels into the room, out of it, or alternates. |
| scanDuration | number | 2.4 | Seconds each scan takes to cross the room. |
| scanDelay | number | 1.6 | Seconds between scans. |
| scanWidth | number | 1 | Thickness of the scan line, from 0.2 to 5. |
| trail | number | 0.5 | How long the walls keep glowing behind the scan, from 0 to 1. |
| glow | number | 0.6 | Bloom around the scan line and points, from 0 to 1.5. |
| autoScan | boolean | true | Runs scans on a loop. Turn it off to scan only on click. |
| interactive | boolean | true | Moves the view with the cursor and lights up the walls under it. |
| clickEffect | 'ping' | 'scan' | 'none' | 'ping' | What a click does. Ping sends a ring of light across the walls from that spot, scan starts a new scan. |
| enableWebcam | boolean | false | Moves the view with your head through the webcam. The face tracker is loaded from a CDN the first time it turns on. |
| showPreview | boolean | false | Shows a small camera preview with the tracking status while the webcam is on. |
| modelsPath | string | CDN URL | Where the face tracking model is loaded from. Point it at your own copy to self-host. |
| enableGyro | boolean | false | Moves the view as a phone or tablet tilts. iOS asks for permission on the first tap. |
| intro | boolean | true | Reveals the room with a first scan on mount. |
| lightMode | boolean | false | Renders a bright room with dark shading for light backgrounds. |
| dpr | number | auto | Maximum device pixel ratio, capped at 2. |
| className | string | '' | Extra class names for the container. |
| style | CSSProperties | - | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import './GridScan.css';

const MAX_PINGS = 4;
const PING_LIFE = 2.4;
const INTRO_SECONDS = 2.2;
const EYE_DISTANCE = 1.25;
const FACE_API_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
const MODELS_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';
const STYLES = { solid: 0, dashed: 1, dotted: 2 };

const VERTEX = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const ROOM = `#version 300 es
precision highp float;
precision highp int;
uniform float uAspect;
uniform float uPixel;
uniform vec3 uEye;
uniform float uDepth;
uniform vec3 uCell;
uniform float uThick;
uniform float uDot;
uniform int uStyle;
uniform vec3 uLineColor;
uniform vec3 uScanColor;
uniform vec3 uCoreColor;
uniform float uFade;
uniform float uScanZ;
uniform float uScanDir;
uniform float uScanAlpha;
uniform float uScanWidth;
uniform float uTrail;
uniform float uReveal;
uniform float uPoints;
uniform float uReflect;
uniform float uHaze;
uniform float uShade;
uniform float uLight;
uniform vec4 uPing[4];
uniform float uPingAlpha[4];
uniform vec4 uHover;
uniform float uTime;
in vec2 vUv;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outGlow;

struct Light {
  float grid;
  float fade;
  float core;
  float trail;
  float spill;
  float ping;
  float wake;
  float reveal;
};

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec2 hash2(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

float lines(float across, float along, float period, float dash, float fa, float fb) {
  float u = across / period;
  float du = fa / period;
  float d = abs(fract(u + 0.5) - 0.5) / max(du, 1e-5);
  float dense = smoothstep(0.1, 0.4, du);
  if (uStyle == 2) {
    float c = along / dash * 5.0;
    float dc = fb / dash * 5.0;
    float e = abs(fract(c + 0.5) - 0.5) / max(dc, 1e-5);
    float cov = clamp(uThick + 1.0 - length(vec2(d, e)), 0.0, 1.0);
    float mean = min(1.0, 3.1416 * (uThick + 0.5) * (uThick + 0.5) * du * dc);
    return mix(cov, mean, max(dense, smoothstep(0.1, 0.4, dc)));
  }
  float cov = clamp(uThick + 0.5 - d, 0.0, 1.0);
  float mean = min(1.0, 2.0 * uThick * du);
  if (uStyle == 1) {
    float c = along / dash * 4.0;
    float dc = fb / dash * 4.0;
    float e = abs(fract(c + 0.5) - 0.5);
    float m = clamp((0.25 - e) / max(dc, 1e-5) + 0.5, 0.0, 1.0);
    cov *= mix(m, 0.5, smoothstep(0.1, 0.4, dc));
    mean *= 0.5;
  }
  return mix(cov, mean, dense);
}

float depthFade(float z) {
  float n = clamp(z / uDepth, 0.0, 1.0);
  return mix(1.0, (exp(-3.0 * n) - 0.0497871) / 0.9502129, uFade);
}

vec3 project(vec3 eye, vec3 o, int face, float plane) {
  vec3 d = o - eye;
  float t = face == 0 ? (plane - o.x) / d.x : (face == 1 ? (plane - o.y) / d.y : (plane - o.z) / d.z);
  return o + d * t;
}

void trace(vec3 o, vec3 d, out int face, out float plane, out vec3 h) {
  float sx = d.x > 0.0 ? 0.5 * uAspect : -0.5 * uAspect;
  float sy = d.y > 0.0 ? 0.5 : -0.5;
  float tx = abs(d.x) > 1e-6 ? (sx - o.x) / d.x : 1e9;
  float ty = abs(d.y) > 1e-6 ? (sy - o.y) / d.y : 1e9;
  float t = (uDepth - o.z) / d.z;
  face = 2;
  plane = uDepth;
  if (tx < t) {
    face = 0;
    plane = sx;
    t = tx;
  }
  if (ty < t) {
    face = 1;
    plane = sy;
    t = ty;
  }
  h = o + d * t;
}

vec2 faceUv(vec3 h, int face) {
  if (face == 0) return vec2(h.z, h.y + 0.5);
  if (face == 1) return vec2(h.x + 0.5 * uAspect, h.z);
  return vec2(h.x + 0.5 * uAspect, h.y + 0.5);
}

Light illuminate(vec3 h, int face, vec2 uv, vec2 foot, float blur) {
  Light l;
  vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
  vec2 f = foot * blur;
  float minor = max(lines(uv.x, uv.y, cell.x, cell.y, f.x, f.y), lines(uv.y, uv.x, cell.y, cell.x, f.y, f.x));
  float major = max(
    lines(uv.x, uv.y, cell.x * 4.0, cell.y, f.x, f.y),
    lines(uv.y, uv.x, cell.y * 4.0, cell.x, f.y, f.x)
  );
  l.grid = max(minor * 0.75, major) / blur;
  float z = h.z;
  l.fade = depthFade(z);
  l.reveal = smoothstep(uReveal, uReveal - 0.2, z);
  float zFoot = face == 0 ? f.x : (face == 1 ? f.y : 0.0);
  float width = max(uScanWidth, zFoot * 1.1);
  float dz = z - uScanZ;
  l.core = exp(-dz * dz / (width * width)) * (face == 2 ? 0.45 : 1.0) * uScanAlpha;
  float behind = -dz * uScanDir;
  l.trail = exp(-max(behind, 0.0) / uTrail) * smoothstep(-width, width * 0.5, behind) * uScanAlpha;
  l.spill = exp(-dz * dz / 0.05) * uScanAlpha;
  l.ping = 0.0;
  l.wake = 0.0;
  for (int i = 0; i < 4; i++) {
    float alpha = uPingAlpha[i];
    if (alpha <= 0.0) continue;
    float dist = length(h - uPing[i].xyz) - uPing[i].w;
    l.ping += exp(-dist * dist / 0.0012) * alpha;
    l.wake += exp(min(dist, 0.0) / 0.22) * smoothstep(0.03, -0.03, dist) * alpha;
  }
  return l;
}

void over(inout vec4 acc, vec3 color, float alpha) {
  alpha = clamp(alpha, 0.0, 1.0);
  acc = vec4(color * alpha, alpha) + acc * (1.0 - alpha);
}

void paint(inout vec4 color, inout float energy, Light l, float gain, float lift, float hover) {
  float base = l.grid * l.fade * l.reveal * lift;
  float far = l.fade * l.reveal * gain;
  float lit = l.grid * (l.core * 1.2 + l.trail * 0.75 + l.ping * 1.4 + l.wake * 0.5 + hover * 0.5) * far;
  float sheen = (l.core * 0.14 + l.spill * 0.05 + l.trail * 0.03 + l.ping * 0.2 + l.wake * 0.04) * far;
  float laser = (l.core + l.ping * 0.35) * far;
  over(color, uLineColor, base);
  over(color, uScanColor, sheen);
  over(color, uScanColor, lit);
  over(color, uCoreColor, laser * 0.9);
  energy += laser * 0.9 + lit * 0.5;
}

void main() {
  vec3 p = vec3((vUv.x - 0.5) * uAspect, vUv.y - 0.5, 0.0);
  vec3 d = p - uEye;
  int face;
  float plane;
  vec3 h;
  trace(p, d, face, plane, h);
  vec3 hx = project(uEye, p + vec3(uPixel, 0.0, 0.0), face, plane);
  vec3 hy = project(uEye, p + vec3(0.0, uPixel, 0.0), face, plane);
  vec2 uv = faceUv(h, face);
  vec2 ux = faceUv(hx, face) - uv;
  vec2 uy = faceUv(hy, face) - uv;
  vec2 foot = vec2(length(vec2(ux.x, uy.x)), length(vec2(ux.y, uy.y)));
  Light l = illuminate(h, face, uv, foot, 1.0);

  vec4 color = vec4(0.0);
  float energy = 0.0;

  if (uShade > 0.0) {
    vec2 gaps = face == 0
      ? vec2(0.5 - abs(h.y), uDepth - h.z)
      : (face == 1 ? vec2(0.5 * uAspect - abs(h.x), uDepth - h.z) : vec2(0.5 * uAspect - abs(h.x), 0.5 - abs(h.y)));
    vec2 crease = 1.0 - exp(-max(gaps, 0.0) / 0.16);
    float occlusion = crease.x * crease.y;
    float lamp = 1.0 / (1.0 + h.z * h.z * 0.9);
    float tilt = face == 1 ? (plane < 0.0 ? 1.1 : 0.85) : (face == 2 ? 0.8 : 1.0);
    float glowSpill = (l.spill * 0.5 + l.trail * 0.12) * l.reveal * l.fade;
    if (uLight > 0.5) {
      float shadow = (1.0 - lamp * tilt) * 0.09 + (1.0 - occlusion) * 0.2;
      over(color, vec3(0.0), shadow * uShade * l.reveal * l.fade);
    } else {
      over(color, vec3(1.0), lamp * tilt * occlusion * 0.11 * uShade * l.reveal * l.fade);
    }
    over(color, uScanColor, glowSpill * uShade * occlusion * 0.35);
  }

  if (face == 1 && plane < 0.0 && uReflect > 0.0) {
    vec3 mirror = vec3(uEye.x, -1.0 - uEye.y, uEye.z);
    vec3 r = h - mirror;
    int face2;
    float plane2;
    vec3 h2;
    trace(h, r, face2, plane2, h2);
    vec2 uv2 = faceUv(h2, face2);
    vec2 ux2 = faceUv(project(mirror, hx, face2, plane2), face2) - uv2;
    vec2 uy2 = faceUv(project(mirror, hy, face2, plane2), face2) - uv2;
    vec2 foot2 = vec2(length(vec2(ux2.x, uy2.x)), length(vec2(ux2.y, uy2.y)));
    float travel = length(h2 - h);
    Light m = illuminate(h2, face2, uv2, foot2, 1.0 + travel * 4.0);
    m.reveal *= l.reveal;
    float grazing = 1.0 - normalize(r).y;
    float gain = (0.3 + 0.7 * grazing * grazing * grazing * grazing) * uReflect * exp(-travel * 1.1) * (uLight > 0.5 ? 0.6 : 1.0);
    float reflected = 0.0;
    paint(color, reflected, m, gain, 0.0, 0.0);
    energy += reflected * 0.6;
  }

  vec3 near = h - uHover.xyz;
  float hover = exp(-dot(near, near) / 0.08) * uHover.w;
  paint(color, energy, l, 1.0, 1.0, hover);

  if (uPoints > 0.5) {
    vec2 cell = face == 0 ? uCell.zy : (face == 1 ? uCell.xz : uCell.xy);
    vec2 spacing = cell / 2.5;
    vec2 q = uv / spacing;
    vec2 id = floor(q);
    vec2 seed = id + vec2(float(face) * 13.7 + plane * 5.3, float(face) * 3.1);
    vec2 delta = (q - id - (0.2 + 0.6 * hash2(seed))) * spacing;
    float det = ux.x * uy.y - ux.y * uy.x;
    vec2 s = vec2(delta.x * uy.y - delta.y * uy.x, ux.x * delta.y - ux.y * delta.x) / det;
    float radius = uDot * mix(1.0, 0.55, clamp(h.z / uDepth, 0.0, 1.0));
    float spot = clamp(radius + 0.5 - length(s), 0.0, 1.0);
    float gap = min(spacing.x / foot.x, spacing.y / foot.y);
    float r = hash(seed + 7.7);
    float flicker = 0.75 + 0.25 * sin(uTime * (3.0 + r * 5.0) + r * 40.0);
    float dots = spot * smoothstep(5.0, 10.0, gap) * smoothstep(0.25, 0.6, r) * (0.3 + 0.7 * r * r) * flicker;
    float hot = l.core * 2.5 + l.ping * 1.6;
    float warm = l.trail * l.trail * 1.3 + l.wake * 0.6 + hover * 1.3;
    float spark = dots * (hot + warm) * l.fade * l.reveal;
    over(color, mix(uScanColor, uCoreColor, clamp(hot / max(hot + warm, 1e-4), 0.0, 1.0)), spark);
    energy += spark * 0.9;
  }

  if (uHaze > 0.0 && uScanAlpha > 0.0 && uScanZ > 0.0 && h.z > uScanZ) {
    vec3 c = p + d * (uScanZ / d.z);
    float grain = hash(floor(c.xy * 180.0) + floor(uTime * 24.0) * 7.0);
    float edge = min(0.5 * uAspect - abs(c.x), 0.5 - abs(c.y));
    float rim = exp(-edge / 0.06);
    float veil = uHaze * uScanAlpha * (0.45 + 0.9 * grain) * (0.55 + rim * 1.6);
    over(color, uScanColor, veil * depthFade(uScanZ) * l.reveal);
  }

  energy = clamp(energy, 0.0, 1.0);
  outColor = color;
  outGlow = vec4(uScanColor * energy, energy);
}`;

const DOWN = `#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec2 o = uTexel;
  outColor = 0.25 * (
    texture(uSource, vUv + vec2(-o.x, -o.y)) +
    texture(uSource, vUv + vec2(o.x, -o.y)) +
    texture(uSource, vUv + vec2(-o.x, o.y)) +
    texture(uSource, vUv + vec2(o.x, o.y))
  );
}`;

const BLUR = `#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uStep;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec4 sum = texture(uSource, vUv) * 0.1964825501511404;
  sum += (texture(uSource, vUv + uStep * 1.411764705882353) + texture(uSource, vUv - uStep * 1.411764705882353)) * 0.2969069646728344;
  sum += (texture(uSource, vUv + uStep * 3.2941176470588234) + texture(uSource, vUv - uStep * 3.2941176470588234)) * 0.09447039785044732;
  sum += (texture(uSource, vUv + uStep * 5.176470588235294) + texture(uSource, vUv - uStep * 5.176470588235294)) * 0.010381362401148057;
  outColor = sum;
}`;

const COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uGlow;
in vec2 vUv;
out vec4 outColor;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
void main() {
  vec4 scene = texture(uScene, vUv);
  vec4 bloom = texture(uBloom, vUv) * uGlow;
  bloom.a = min(bloom.a, 1.0);
  bloom.rgb = min(bloom.rgb, vec3(bloom.a));
  vec4 color = scene + bloom * (1.0 - scene.a);
  float noise = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  color.a = clamp(color.a + noise, 0.0, 1.0);
  color.rgb = clamp(color.rgb + noise, vec3(0.0), vec3(color.a));
  outColor = color;
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = (gl, fragmentSource) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, '');
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
};

const createTarget = gl => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { texture, width: 0, height: 0 };
};

const sizeTarget = (gl, target, width, height) => {
  if (target.width === width && target.height === height) return;
  target.width = width;
  target.height = height;
  gl.bindTexture(gl.TEXTURE_2D, target.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
};

let faceApiLoader = null;

const loadFaceApi = () => {
  if (window.faceapi) return Promise.resolve(window.faceapi);
  if (!faceApiLoader) {
    faceApiLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = FACE_API_URL;
      script.async = true;
      script.onload = () => (window.faceapi ? resolve(window.faceapi) : reject(new Error('face-api.js')));
      script.onerror = () => {
        faceApiLoader = null;
        reject(new Error('face-api.js'));
      };
      document.head.appendChild(script);
    });
  }
  return faceApiLoader;
};

const STATUS_LABELS = {
  loading: 'Loading face tracking',
  searching: 'Looking for a face',
  tracking: 'Tracking',
  blocked: 'Camera unavailable'
};

export const GridScan = ({
  linesColor,
  scanColor,
  cells = 8,
  lineThickness = 1,
  lineStyle = 'solid',
  depth = 3,
  depthFade = 0.6,
  parallax = 1,
  points = true,
  reflection = 0.35,
  shading = 0.7,
  scanDirection = 'forward',
  scanDuration = 2.4,
  scanDelay = 1.6,
  scanWidth = 1,
  trail = 0.5,
  glow = 0.6,
  autoScan = true,
  interactive = true,
  clickEffect = 'ping',
  enableWebcam = false,
  showPreview = false,
  modelsPath = MODELS_URL,
  enableGyro = false,
  intro = true,
  lightMode = false,
  dpr,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const wakeRef = useRef(null);
  const headRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const settings = {
    linesColor: linesColor ?? (lightMode ? '#d4d4d8' : '#4d4757'),
    scanColor: scanColor ?? (lightMode ? '#0284c7' : '#7dd3fc'),
    cells: clamp(cells, 2, 40),
    thickness: clamp(lineThickness, 0.5, 4),
    style: STYLES[lineStyle] ?? 0,
    depth: clamp(depth, 0.5, 12),
    depthFade: clamp(depthFade, 0, 1),
    parallax: clamp(parallax, 0, 3),
    points,
    reflection: clamp(reflection, 0, 1),
    shading: clamp(shading, 0, 1),
    direction: scanDirection,
    duration: clamp(scanDuration, 0.3, 20),
    delay: clamp(scanDelay, 0, 30),
    scanWidth: clamp(scanWidth, 0.2, 5),
    trail: clamp(trail, 0, 1),
    glow: clamp(glow, 0, 1.5),
    autoScan,
    interactive,
    clickEffect,
    enableGyro,
    intro,
    lightMode,
    dpr
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!container || !canvas || !gl) return undefined;

    const room = link(gl, ROOM);
    const down = link(gl, DOWN);
    const blur = link(gl, BLUR);
    const composite = link(gl, COMPOSITE);
    if (!room || !down || !blur || !composite) return undefined;
    const vao = gl.createVertexArray();
    const scene = createTarget(gl);
    const light = createTarget(gl);
    const bloomA = createTarget(gl);
    const bloomB = createTarget(gl);
    const sceneBuffer = gl.createFramebuffer();
    const bloomBufferA = gl.createFramebuffer();
    const bloomBufferB = gl.createFramebuffer();

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const colorCache = new Map();
    const parse = value => {
      const key = String(value);
      const cached = colorCache.get(key);
      if (cached) return cached;
      let rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = key;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colorCache.set(key, rgb);
      return rgb;
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const view = { width: 1, height: 1, ratio: 1 };
    const eye = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, f: EYE_DISTANCE, vf: 0, tf: EYE_DISTANCE };
    const pointer = { x: 0, y: 0, inside: false };
    const look = { x: 0, y: 0, held: false };
    const tilt = { gamma: 0, beta: 0, ready: false, asked: false };
    const hover = { x: 0, y: 0, z: 0, strength: 0, ready: false };
    const scan = { z: 0, dir: 1, alpha: 0, start: 0, sweeps: 0, waiting: false };
    const pings = [];
    const pingData = new Float32Array(MAX_PINGS * 4);
    const pingAlpha = new Float32Array(MAX_PINGS);
    let time = 0;
    let introClock = settingsRef.current.intro && !reduce ? 0 : 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let leaveTimer = 0;

    const roomSize = () => {
      const s = settingsRef.current;
      const aspect = view.width / view.height;
      const cy = 1 / Math.round(s.cells);
      const cx = aspect / Math.max(1, Math.round(aspect / cy));
      const roomDepth = Math.max(cy, Math.round(s.depth / cy) * cy);
      return { aspect, cx, cy, roomDepth };
    };

    const castRay = (u, v) => {
      const { aspect, roomDepth } = roomSize();
      const px = (u - 0.5) * aspect;
      const py = v - 0.5;
      const dx = px - eye.x;
      const dy = py - eye.y;
      const dz = eye.f;
      const sx = dx > 0 ? 0.5 * aspect : -0.5 * aspect;
      const sy = dy > 0 ? 0.5 : -0.5;
      let t = roomDepth / dz;
      if (Math.abs(dx) > 1e-6) t = Math.min(t, (sx - px) / dx);
      if (Math.abs(dy) > 1e-6) t = Math.min(t, (sy - py) / dy);
      return { x: px + dx * t, y: py + dy * t, z: dz * t };
    };

    const startSweep = s => {
      scan.dir = s.direction === 'backward' || (s.direction === 'pingpong' && scan.sweeps % 2 === 1) ? -1 : 1;
      scan.start = time;
      scan.waiting = false;
      scan.sweeps += 1;
    };

    const updateScan = (s, roomDepth) => {
      if (introClock < 1) {
        const k = introClock;
        scan.dir = 1;
        scan.z = k * (roomDepth + 0.4) - 0.2;
        scan.alpha = Math.min(1, k * 6) * (1 - Math.max(0, k - 0.85) / 0.15);
        return;
      }
      if (scan.sweeps === 0 && !scan.waiting) {
        scan.waiting = true;
        scan.start = time;
        scan.alpha = 0;
      }
      if (scan.waiting) {
        scan.alpha = 0;
        if (s.autoScan && !reduce && time - scan.start >= s.delay) startSweep(s);
        return;
      }
      const k = (time - scan.start) / s.duration;
      if (k >= 1) {
        scan.waiting = true;
        scan.start = time;
        scan.alpha = 0;
        return;
      }
      const travel = k * (roomDepth + 0.3) - 0.15;
      scan.z = scan.dir > 0 ? travel : roomDepth - travel;
      scan.alpha = Math.min(1, k / 0.12) * Math.min(1, (1 - k) / 0.12);
    };

    const updateEye = dt => {
      const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        eye.vx += ((eye.tx - eye.x) * 42 - eye.vx * 11) * h;
        eye.vy += ((eye.ty - eye.y) * 42 - eye.vy * 11) * h;
        eye.vf += ((eye.tf - eye.f) * 42 - eye.vf * 11) * h;
        eye.x += eye.vx * h;
        eye.y += eye.vy * h;
        eye.f += eye.vf * h;
      }
    };

    const setLook = (nx, ny, held) => {
      look.x = clamp(nx, -1, 1);
      look.y = clamp(ny, -1, 1);
      look.held = held;
    };

    const aimEye = s => {
      const aspect = view.width / view.height;
      const drift = reduce ? 0 : 1;
      const nx = look.held ? look.x : (Math.sin(time * 0.21) * 0.2 + Math.sin(time * 0.083 + 1.3) * 0.12) * drift;
      const ny = look.held ? look.y : Math.sin(time * 0.17 + 2.1) * 0.16 * drift;
      eye.tx = nx * s.parallax * 0.22 * aspect;
      eye.ty = ny * s.parallax * 0.22;
    };

    const resize = () => {
      const s = settingsRef.current;
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      sizeTarget(gl, scene, canvas.width, canvas.height);
      sizeTarget(gl, light, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene.texture, 0);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, light.texture, 0);
      const bw = Math.max(1, Math.round(canvas.width / 4));
      const bh = Math.max(1, Math.round(canvas.height / 4));
      sizeTarget(gl, bloomA, bw, bh);
      sizeTarget(gl, bloomB, bw, bh);
      gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBufferA);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, bloomA.texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBufferB);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, bloomB.texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      draw();
      wake();
    };

    const draw = () => {
      const s = settingsRef.current;
      const { aspect, cx, cy, roomDepth } = roomSize();
      const lineRgb = parse(s.linesColor);
      const scanRgb = parse(s.scanColor);
      const coreRgb = s.lightMode ? scanRgb : scanRgb.map(c => c + (1 - c) * 0.65);
      const ru = room.uniforms;
      gl.bindVertexArray(vao);
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(room.program);
      gl.uniform1f(ru.uAspect, aspect);
      gl.uniform1f(ru.uPixel, 1 / canvas.height);
      gl.uniform3f(ru.uEye, eye.x, eye.y, -eye.f);
      gl.uniform1f(ru.uDepth, roomDepth);
      gl.uniform3f(ru.uCell, cx, cy, cy);
      gl.uniform1f(ru.uThick, s.thickness * view.ratio * 0.5);
      gl.uniform1f(ru.uDot, 1.8 * view.ratio);
      gl.uniform1i(ru.uStyle, s.style);
      gl.uniform3fv(ru.uLineColor, lineRgb);
      gl.uniform3fv(ru.uScanColor, scanRgb);
      gl.uniform3fv(ru.uCoreColor, coreRgb);
      gl.uniform1f(ru.uFade, s.depthFade);
      gl.uniform1f(ru.uScanZ, scan.z);
      gl.uniform1f(ru.uScanDir, scan.dir);
      gl.uniform1f(ru.uScanAlpha, scan.alpha);
      gl.uniform1f(ru.uScanWidth, 0.006 * s.scanWidth);
      gl.uniform1f(ru.uTrail, 0.04 + s.trail * 1.1);
      gl.uniform1f(ru.uReveal, introClock < 1 ? scan.z + 0.05 : 1e4);
      gl.uniform1f(ru.uPoints, s.points ? 1 : 0);
      gl.uniform1f(ru.uReflect, s.reflection);
      gl.uniform1f(ru.uHaze, s.lightMode ? 0.03 : 0.05);
      gl.uniform1f(ru.uShade, s.shading);
      gl.uniform1f(ru.uLight, s.lightMode ? 1 : 0);
      gl.uniform4fv(ru.uPing, pingData);
      gl.uniform1fv(ru.uPingAlpha, pingAlpha);
      gl.uniform4f(ru.uHover, hover.x, hover.y, hover.z, hover.strength);
      gl.uniform1f(ru.uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const glowing = s.glow > 0;
      if (glowing) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBufferA);
        gl.viewport(0, 0, bloomA.width, bloomA.height);
        gl.useProgram(down.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, light.texture);
        gl.uniform1i(down.uniforms.uSource, 0);
        gl.uniform2f(down.uniforms.uTexel, 1 / light.width, 1 / light.height);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const spread = (2.2 * view.ratio) / 2;
        gl.useProgram(blur.program);
        gl.uniform1i(blur.uniforms.uSource, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBufferB);
        gl.bindTexture(gl.TEXTURE_2D, bloomA.texture);
        gl.uniform2f(blur.uniforms.uStep, spread / bloomA.width, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, bloomBufferA);
        gl.bindTexture(gl.TEXTURE_2D, bloomB.texture);
        gl.uniform2f(blur.uniforms.uStep, 0, spread / bloomA.height);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(composite.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, scene.texture);
      gl.uniform1i(composite.uniforms.uScene, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, bloomA.texture);
      gl.uniform1i(composite.uniforms.uBloom, 1);
      gl.uniform1f(composite.uniforms.uGlow, glowing ? s.glow * (s.lightMode ? 0.8 : 1.6) : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.activeTexture(gl.TEXTURE0);
    };

    const frame = now => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.001, 0.05) : 1 / 60;
      last = now;
      time += dt;
      if (introClock < 1) introClock = Math.min(1, introClock + dt / INTRO_SECONDS);
      const { roomDepth } = roomSize();
      updateScan(s, roomDepth);
      aimEye(s);
      updateEye(dt);

      const aim = s.interactive && pointer.inside && !reduce ? 1 : 0;
      if (aim) {
        const target = castRay(pointer.x, pointer.y);
        if (!hover.ready) Object.assign(hover, target, { ready: true });
        const follow = 1 - Math.exp(-dt / 0.08);
        hover.x += (target.x - hover.x) * follow;
        hover.y += (target.y - hover.y) * follow;
        hover.z += (target.z - hover.z) * follow;
      }
      hover.strength += (aim - hover.strength) * (1 - Math.exp(-dt / 0.25));
      if (!aim && hover.strength < 0.01) hover.ready = false;

      for (let i = pings.length - 1; i >= 0; i--) {
        pings[i].age += dt;
        if (pings[i].age > PING_LIFE) pings.splice(i, 1);
      }
      for (let i = 0; i < MAX_PINGS; i++) {
        const ping = pings[i];
        if (!ping) {
          pingAlpha[i] = 0;
          continue;
        }
        const k = ping.age / PING_LIFE;
        pingData.set([ping.x, ping.y, ping.z, ping.age * 1.15], i * 4);
        pingAlpha[i] = Math.min(1, ping.age / 0.05) * (1 - k) * (1 - k);
      }

      draw();

      const settling =
        Math.abs(eye.tx - eye.x) + Math.abs(eye.ty - eye.y) + Math.abs(eye.tf - eye.f) > 1e-4 ||
        Math.abs(eye.vx) + Math.abs(eye.vy) + Math.abs(eye.vf) > 1e-4;
      const busy =
        introClock < 1 ||
        (!reduce && s.autoScan) ||
        !scan.waiting ||
        pings.length > 0 ||
        settling ||
        hover.strength > 0.002 ||
        (!reduce && s.parallax > 0 && !look.held) ||
        (s.points && !reduce && scan.alpha > 0);
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function wake() {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    const locate = event => {
      const rect = container.getBoundingClientRect();
      const u = (event.clientX - rect.left) / Math.max(1, rect.width);
      const v = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      return { u, v, inside: u >= 0 && u <= 1 && v >= 0 && v <= 1 };
    };

    const onPointerMove = event => {
      const s = settingsRef.current;
      const { u, v, inside } = locate(event);
      pointer.x = u;
      pointer.y = v;
      const was = pointer.inside;
      pointer.inside = inside;
      if (inside) {
        window.clearTimeout(leaveTimer);
        leaveTimer = 0;
        if (!headRef.current?.active && s.interactive && !reduce) setLook(u * 2 - 1, v * 2 - 1, true);
        wake();
      } else if (was && !leaveTimer) {
        leaveTimer = window.setTimeout(() => {
          leaveTimer = 0;
          if (!headRef.current?.active) look.held = false;
          wake();
        }, 220);
        wake();
      }
    };

    const onPointerDown = event => {
      const s = settingsRef.current;
      const { u, v, inside } = locate(event);
      if (!inside || reduce || s.clickEffect === 'none') return;
      if (s.clickEffect === 'scan') {
        if (introClock >= 1) startSweep(s);
      } else {
        const hit = castRay(u, v);
        pings.unshift({ ...hit, age: 0 });
        if (pings.length > MAX_PINGS) pings.pop();
      }
      wake();
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      if (!headRef.current?.active) look.held = false;
      wake();
    };

    const onOrientation = event => {
      const s = settingsRef.current;
      if (!s.enableGyro || headRef.current?.active || reduce || event.gamma === null || event.beta === null) return;
      if (!tilt.ready) Object.assign(tilt, { gamma: event.gamma, beta: event.beta, ready: true });
      setLook((event.gamma - tilt.gamma) / 25, (event.beta - tilt.beta) / -25, true);
      wake();
    };

    const onClick = () => {
      const s = settingsRef.current;
      const request = window.DeviceOrientationEvent?.requestPermission;
      if (!s.enableGyro || tilt.asked || typeof request !== 'function') return;
      tilt.asked = true;
      request.call(window.DeviceOrientationEvent).catch(() => {});
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('click', onClick);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    headRef.current = {
      active: false,
      move: (nx, ny, near) => {
        if (reduce) return;
        setLook(nx * 1.3, ny * 1.3, true);
        eye.tf = EYE_DISTANCE * clamp(near, 0.6, 1.6);
        wake();
      },
      release: () => {
        eye.tf = EYE_DISTANCE;
        look.held = false;
        wake();
      }
    };
    resize();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(leaveTimer);
      wakeRef.current = null;
      headRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('click', onClick);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      [scene, light, bloomA, bloomB].forEach(target => gl.deleteTexture(target.texture));
      [sceneBuffer, bloomBufferA, bloomBufferB].forEach(buffer => gl.deleteFramebuffer(buffer));
      gl.deleteVertexArray(vao);
      [room, down, blur, composite].forEach(item => gl.deleteProgram(item.program));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    if (!enableWebcam) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;
    let stopped = false;
    let stream = null;
    let timer = 0;
    let lost = 0;
    const smooth = { x: 0, y: 0, near: 1, ready: false };
    setStatus('loading');

    const run = async () => {
      try {
        const faceapi = await loadFaceApi();
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath);
        if (stopped) return;
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        if (stopped) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        video.srcObject = stream;
        await video.play();
        setStatus('searching');
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.45 });
        const detect = async () => {
          if (stopped) return;
          let result = null;
          try {
            result = await faceapi.detectSingleFace(video, options);
          } catch {
            result = null;
          }
          if (stopped) return;
          const head = headRef.current;
          if (result && head) {
            const box = result.box;
            const vw = video.videoWidth || 1;
            const vh = video.videoHeight || 1;
            const x = -((box.x + box.width / 2) / vw - 0.5) * 2;
            const y = -((box.y + box.height / 2) / vh - 0.5) * 2;
            const near = 0.32 / Math.max(0.08, box.width / vw);
            const k = smooth.ready ? 0.45 : 1;
            smooth.x += (x - smooth.x) * k;
            smooth.y += (y - smooth.y) * k;
            smooth.near += (near - smooth.near) * k;
            smooth.ready = true;
            lost = 0;
            head.active = true;
            head.move(smooth.x, smooth.y, smooth.near);
            setStatus('tracking');
          } else if (head && ++lost > 12 && head.active) {
            head.active = false;
            smooth.ready = false;
            head.release();
            setStatus('searching');
          }
          timer = window.setTimeout(detect, 40);
        };
        detect();
      } catch {
        if (!stopped) setStatus('blocked');
      }
    };
    run();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      stream?.getTracks().forEach(track => track.stop());
      video.srcObject = null;
      const head = headRef.current;
      if (head?.active) {
        head.active = false;
        head.release();
      }
    };
  }, [enableWebcam, modelsPath]);

  return (
    <div ref={containerRef} className={`grid-scan${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <canvas ref={canvasRef} className="grid-scan-canvas" aria-hidden="true" />
      {enableWebcam && (
        <div className={showPreview ? 'grid-scan-preview' : 'grid-scan-hidden'}>
          <video ref={videoRef} className="grid-scan-video" muted playsInline />
          {showPreview && <span className="grid-scan-status">{STATUS_LABELS[status]}</span>}
        </div>
      )}
    </div>
  );
};

export default GridScan;

```

### Component CSS
```css
.grid-scan {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.grid-scan-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.grid-scan-preview {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 168px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 14px;
  background: #0b0b0e;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.grid-scan-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}

.grid-scan-status {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(10, 10, 12, 0.6);
  color: #ffffff;
  font:
    500 11px/1.4 system-ui,
    -apple-system,
    sans-serif;
  backdrop-filter: blur(8px);
}

.grid-scan-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.



## Integrate the <Galaxy /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: Galaxy
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import Galaxy from './Galaxy';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Galaxy
    density={1}
    glowIntensity={0.3}
    flareIntensity={1}
    starSpeed={0.5}
    mouseRepulsion
    clickWarp
  />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| starColors | string[] | - | Up to four colors the stars are picked from. Replaces the hue shift and saturation coloring. |
| hueShift | number | 140 | Shifts the hue of the stars, in degrees. |
| saturation | number | 0 | Color saturation of the stars, from 0 to 1. |
| density | number | 1 | How densely the stars are packed. |
| glowIntensity | number | 0.3 | Brightness of the glow around each star. |
| starSize | number | 1 | Size of each star glow. |
| flareIntensity | number | 1 | Strength of the cross flares on the brightest stars. |
| twinkleIntensity | number | 0.3 | How much the stars twinkle, from 0 to 1. |
| starSpeed | number | 0.5 | How fast you travel through the stars. |
| speed | number | 1 | Overall speed of the animation. |
| rotationSpeed | number | 0.1 | How fast the starfield rotates. |
| layers | number | 4 | Number of star layers, from 2 to 8. |
| direction | 'forward' | 'backward' | 'forward' | Whether you fly into the stars or drift back out of them. |
| mouseInteraction | boolean | true | Lets the cursor interact with the stars. |
| mouseRepulsion | boolean | true | Pushes the stars away from the cursor. When off, the field shifts with the cursor instead. |
| repulsionStrength | number | 2 | Strength of the push away from the cursor. |
| autoCenterRepulsion | number | 0 | Pushes the stars away from the center without the cursor. 0 turns it off. |
| clickWarp | boolean | true | Clicking jumps forward at warp speed. |
| intro | boolean | true | Drops out of warp speed on mount. |
| focal | [number, number] | [0.5, 0.5] | Center of the starfield, from 0 to 1. |
| rotation | [number, number] | [1, 0] | Fixed rotation of the starfield as a [cos, sin] pair. |
| transparent | boolean | true | Shows the page behind the stars. When off, the stars sit on the background color. |
| backgroundColor | string | '#000000' | Background behind the stars when transparent is off, or the paper color in light mode. |
| lightMode | boolean | false | Draws the stars as ink for light backgrounds. |
| opacity | number | 1 | Opacity of the whole effect. |
| disableAnimation | boolean | false | Freezes the animation. |
| dpr | number | auto | Maximum device pixel ratio, capped at 2. |
| className | string | '' | Extra class names for the container. |
| style | CSSProperties | - | Inline styles for the container. |

### Full Component Source
```jsx
'use client';

import { useEffect, useRef } from 'react';
import './Galaxy.css';

const MAX_LAYERS = 8;
const MAX_COLORS = 4;
const INTRO_SECONDS = 2.2;

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uGloss;
uniform float uDepth;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uStarGlow;
uniform float uFlareGain;
uniform float uSquash;
uniform float uSaturation;
uniform float uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationAngle;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform int uLayers;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform float uWarp;
uniform float uReveal;
uniform float uMode;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;

#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare, vec2 radial, float invReach) {
#ifdef WARP
  float along = dot(uv, radial);
  float d = sqrt(max(dot(uv, uv) - uSquash * along * along, 0.0));
#else
  float d = length(uv);
#endif
  float m = uStarGlow / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uFlareGain;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uFlareGain;
  m *= smoothstep(1.0, 0.2, d * invReach);
#ifdef WARP
  m *= mix(1.0, smoothstep(1.0, 0.55, length(uv) * invReach), min(uWarp * 4.0, 1.0));
#endif
  return m;
}

vec3 StarLayer(vec2 uv, vec2 radial, vec2 repelAt, float pushCells, float spread) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uGloss / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

#ifdef PALETTE
      float pick = Hash21(si + 7.0) * float(uColorCount);
      vec3 base = uColors[int(min(floor(pick), float(uColorCount - 1)))];
#else
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
#endif

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      vec2 shift = vec2(0.0);
      float invReach = 1.0;
#ifdef REPEL
      vec2 away = si + 0.5 + pad - repelAt;
      float dist = length(away);
      float q = dist * spread;
      float cells = pushCells * exp(-q * q);
      float moved = cells * inversesqrt(1.0 + cells * cells * 2.78);
      shift = away * (moved / max(dist, 0.0001));
      invReach = 1.0 / (1.0 - moved);
#endif
      float star = Star(gv - offset - pad - shift, flareSize, radial, invReach);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      col += star * twinkle * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution;
  vec2 uv = (gl_FragCoord.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  vec2 repelAt = vec2(0.0);
  float strength = 0.0;
  float push = 0.0;
  if (uAutoCenterRepulsion > 0.0) {
    strength = uAutoCenterRepulsion;
    push = strength * 0.05;
  } else if (uMouseRepulsion > 0.5) {
    repelAt = (uMouse * uResolution - focalPx) / uResolution.y;
    strength = max(uRepulsionStrength, 0.0);
    push = strength * 0.05 * uMouseActiveFactor;
  } else {
    uv += mouseNorm * 0.1 * uMouseActiveFactor;
  }
  float radius = 0.16 + 0.04 * strength;

  vec2 radial = length(uv) > 0.0001 ? normalize(uv) : vec2(1.0, 0.0);
  float angle = uRotationAngle;
  uv = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
  radial = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * radial;
  radial = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * radial;
  repelAt = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * repelAt;
  repelAt = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * repelAt;

  vec3 col = vec3(0.0);
  float layers = float(uLayers);
  for (int k = 0; k < ${MAX_LAYERS}; k++) {
    if (k >= uLayers) break;
    float i = float(k) / layers;
    float depth = fract(i + uDepth);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    vec2 offset = vec2(i * 453.32);
    col += StarLayer(uv * scale + offset, radial, repelAt * scale + offset, push * scale, 1.0 / (scale * radius)) * fade;
  }
  col *= uReveal;

  if (uMode > 1.5) {
    vec3 lit = col * smoothstep(0.0, 0.3, length(col));
    float energy = max(max(lit.r, lit.g), lit.b);
    vec3 tint = lit / max(energy, 0.0001);
    vec3 ink = tint * (0.16 / max(dot(tint, vec3(0.2126, 0.7152, 0.0722)), 0.16));
    float coverage = pow(min(energy * 1.3, 1.0), 1.3) * 0.92 * uOpacity;
    outColor = uMode > 2.5 ? vec4(ink * coverage, coverage) : vec4(mix(uBackground, ink, coverage), 1.0);
  } else if (uMode > 0.5) {
    float alpha = min(smoothstep(0.0, 0.3, length(col)), 1.0) * uOpacity;
    outColor = vec4(col * alpha, alpha);
  } else {
    outColor = vec4(mix(uBackground, col, uOpacity), 1.0);
  }
}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const keyOf = (palette, repel, warp) => (palette ? 4 : 0) + (repel ? 2 : 0) + (warp ? 1 : 0);

const start = (gl, palette, repel, warp) => {
  const defines = `${palette ? '#define PALETTE\n' : ''}${repel ? '#define REPEL\n' : ''}${warp ? '#define WARP\n' : ''}`;
  const program = gl.createProgram();
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  if (!program || !vertex || !fragment) return null;
  gl.shaderSource(vertex, VERTEX);
  gl.shaderSource(fragment, FRAGMENT.replace('\n', `\n${defines}`));
  gl.compileShader(vertex);
  gl.compileShader(fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
};

const finish = (gl, program) => {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name.replace('[0]', '')] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
};

const Galaxy = ({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
  lightMode = false,
  starColors,
  starSize = 1,
  flareIntensity = 1,
  layers = 4,
  direction = 'forward',
  clickWarp = true,
  intro = true,
  backgroundColor,
  opacity = 1,
  dpr,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const palette = Array.isArray(starColors) ? starColors.filter(Boolean).slice(0, MAX_COLORS) : [];
  const settings = {
    focal: Array.isArray(focal) ? focal : [0.5, 0.5],
    rotation: Array.isArray(rotation) ? rotation : [1, 0],
    starSpeed,
    density: Math.max(0.01, density),
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity: Math.max(0, glowIntensity),
    saturation: Math.max(0, saturation),
    mouseRepulsion,
    repulsionStrength,
    twinkleIntensity: clamp(twinkleIntensity, 0, 1),
    rotationSpeed,
    autoCenterRepulsion: Math.max(0, autoCenterRepulsion),
    transparent,
    lightMode,
    palette,
    starSize: Math.max(0, starSize),
    flareIntensity: Math.max(0, flareIntensity),
    layers: clamp(Math.round(layers), 2, MAX_LAYERS),
    reverse: direction === 'backward',
    clickWarp,
    intro,
    backgroundColor,
    opacity: clamp(opacity, 0, 1),
    dpr
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!container || !canvas || !gl) return undefined;

    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const programs = new Map();
    const entry = (palette, repel, warp) => {
      const key = keyOf(palette, repel, warp);
      let found = programs.get(key);
      if (!found) {
        found = { program: start(gl, palette, repel, warp), linked: null, done: false };
        programs.set(key, found);
      }
      return found;
    };
    const variant = (palette, repel, warp, wait) => {
      const found = entry(palette, repel, warp);
      if (!found.done && found.program) {
        if (!wait && parallel && !gl.getProgramParameter(found.program, parallel.COMPLETION_STATUS_KHR)) return null;
        found.linked = finish(gl, found.program);
        found.done = true;
      }
      return found.linked;
    };
    const initial = settingsRef.current;
    if (!variant(initial.palette.length > 0, false, false, true)) {
      programs.forEach(found => found.program && gl.deleteProgram(found.program));
      return undefined;
    }

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const cache = new Map();
    const parse = (value, fallback) => {
      if (!value) return fallback;
      const key = String(value);
      if (cache.has(key)) return cache.get(key);
      let rgb = fallback;
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = key;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      cache.set(key, rgb);
      return rgb;
    };
    const colors = new Float32Array(MAX_COLORS * 3);

    const pointer = { x: 0.5, y: 0.5, inside: false };
    const state = {
      time: 0,
      gloss: 0,
      depth: 0,
      angle: 0,
      mx: 0.5,
      my: 0.5,
      active: 0,
      boost: 0,
      reveal: settingsRef.current.intro && !reduce ? 0 : 1
    };
    let raf = 0;
    let last = 0;
    let visible = true;

    const render = () => {
      const s = settingsRef.current;
      s.palette.forEach((value, index) => colors.set(parse(value, [1, 1, 1]), index * 3));
      const mode = s.lightMode ? (s.transparent ? 3 : 2) : s.transparent ? 1 : 0;
      const background = parse(s.backgroundColor, s.lightMode ? [1, 1, 1] : [0, 0, 0]);
      const reveal = state.reveal;
      const palette = s.palette.length > 0;
      const repel = s.autoCenterRepulsion > 0 || (s.mouseRepulsion && s.repulsionStrength > 0 && state.active > 0);
      const warp = state.boost > 0;
      const base = variant(palette, false, false, true);
      if (!base) return;
      const program = (repel || warp ? variant(palette, repel, warp, false) : null) ?? base;
      const u = program.uniforms;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program.program);
      gl.bindVertexArray(vao);
      gl.uniform1f(u.uTime, state.time);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform2f(u.uFocal, s.focal[0], s.focal[1]);
      gl.uniform2f(u.uRotation, s.rotation[0], s.rotation[1]);
      gl.uniform1f(u.uGloss, state.gloss);
      gl.uniform1f(u.uDepth, state.depth);
      gl.uniform1f(u.uDensity, s.density);
      gl.uniform1f(u.uHueShift, s.hueShift);
      gl.uniform1f(u.uSpeed, s.speed);
      gl.uniform2f(u.uMouse, state.mx, state.my);
      const stretch = 1 + state.boost * 5;
      gl.uniform1f(u.uStarGlow, (0.05 * s.glowIntensity * s.starSize) / Math.pow(stretch, 0.6));
      gl.uniform1f(u.uFlareGain, s.glowIntensity * s.flareIntensity);
      gl.uniform1f(u.uSquash, 1 - 1 / (stretch * stretch));
      gl.uniform1f(u.uSaturation, s.saturation);
      gl.uniform1f(u.uMouseRepulsion, s.mouseRepulsion ? 1 : 0);
      gl.uniform1f(u.uTwinkleIntensity, s.twinkleIntensity);
      gl.uniform1f(u.uRotationAngle, state.angle);
      gl.uniform1f(u.uRepulsionStrength, s.repulsionStrength);
      gl.uniform1f(u.uMouseActiveFactor, state.active);
      gl.uniform1f(u.uAutoCenterRepulsion, s.autoCenterRepulsion);
      gl.uniform1i(u.uLayers, s.layers);
      gl.uniform3fv(u.uColors, colors);
      gl.uniform1i(u.uColorCount, s.palette.length);
      gl.uniform1f(u.uWarp, state.boost);
      const fade = Math.min(1, reveal / 0.35);
      gl.uniform1f(u.uReveal, fade * fade * (3 - 2 * fade));
      gl.uniform1f(u.uMode, mode);
      gl.uniform3fv(u.uBackground, background);
      gl.uniform1f(u.uOpacity, s.opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = now => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60;
      last = now;
      const motion = s.disableAnimation || reduce ? 0 : 1;
      if (s.intro && !reduce && state.reveal < 1) {
        state.reveal = Math.min(1, state.reveal + dt / INTRO_SECONDS);
        state.boost = Math.max(state.boost, Math.pow(1 - state.reveal, 2) * 1.4);
      } else if (!s.intro || reduce) {
        state.reveal = 1;
      }
      const flight = (s.starSpeed / 10) * (s.reverse ? -1 : 1);
      state.time += dt * motion;
      state.gloss += dt * flight * motion;
      state.depth += dt * flight * s.speed * motion * (1 + state.boost * 14);
      state.angle += dt * s.rotationSpeed * motion;
      state.boost *= Math.exp(-dt * 1.3);
      if (state.boost < 0.001) state.boost = 0;

      const follow = 1 - Math.exp(-dt / 0.325);
      const engaged = s.mouseInteraction && pointer.inside && !reduce;
      if (engaged) {
        state.mx += (pointer.x - state.mx) * follow;
        state.my += (pointer.y - state.my) * follow;
      }
      const target = engaged ? 1 : 0;
      state.active += (target - state.active) * follow;
      if (Math.abs(target - state.active) < 0.001) state.active = target;

      render();
      const busy = motion > 0 || state.boost > 0 || state.active !== target || state.reveal < 1;
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const s = settingsRef.current;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      render();
      wake();
    };

    const locate = event => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x / Math.max(1, rect.width);
      pointer.y = 1 - y / Math.max(1, rect.height);
    };

    const onPointerMove = event => {
      locate(event);
      wake();
    };

    const onPointerDown = event => {
      const s = settingsRef.current;
      locate(event);
      if (!pointer.inside || !s.clickWarp || reduce) return;
      state.boost = Math.min(1.6, state.boost + 1);
      wake();
    };

    const onPointerUp = event => {
      if (event.pointerType !== 'mouse') pointer.inside = false;
    };

    const onPointerLeave = () => {
      pointer.inside = false;
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    resize();

    const repelling = initial.autoCenterRepulsion > 0 || (initial.mouseInteraction && initial.mouseRepulsion);
    const tinted = initial.palette.length > 0;
    if (initial.clickWarp || initial.intro) entry(tinted, false, true);
    if (repelling) entry(tinted, true, false);
    if (repelling && initial.clickWarp) entry(tinted, true, true);

    let lastDpr = settingsRef.current.dpr;
    wakeRef.current = () => {
      const s = settingsRef.current;
      if (s.dpr !== lastDpr) {
        lastDpr = s.dpr;
        resize();
        return;
      }
      if (!raf) render();
      wake();
    };

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      programs.forEach(found => found.program && gl.deleteProgram(found.program));
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div ref={containerRef} className={`galaxy-container${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <canvas ref={canvasRef} className="galaxy-canvas" aria-hidden="true" />
    </div>
  );
};

export default Galaxy;

```

### Component CSS
```css
.galaxy-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.galaxy-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.




## Integrate the <Counter /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: Counter
### Variant: JavaScript + CSS


---

### Usage Example
```jsx
import Counter from './Counter';

<Counter
  value={1284}
  fontSize={80}
  fontWeight={600}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | 0 | The number to show. Digits roll to every new value. |
| locale | string | 'en-US' | Locale used for separators, symbols and numerals. |
| format | Intl.NumberFormatOptions | - | Formatting options such as currency, percent, units or compact notation. |
| decimals | number | - | Fixed number of decimal places. Leave it out to use the format defaults. |
| minDigits | number | 1 | Pads the whole part with leading zeros. |
| prefix | ReactNode | - | Content shown before the number. |
| suffix | ReactNode | - | Content shown after the number. |
| direction | 'auto' | 'up' | 'down' | 'shortest' | 'auto' | Which way digits roll. Auto rolls up as the number grows and down as it shrinks. |
| duration | number | 0.7 | Roughly how long a roll takes, in seconds. |
| bounce | number | 0.2 | How much digits overshoot before settling, from 0 to 0.9. |
| stagger | number | 0.04 | Delay in seconds between neighbouring digits, so changes ripple from the right. |
| motionBlur | boolean | true | Blurs digits along their path while they spin fast. |
| intro | boolean | true | Spins every digit once and lands it when the counter first scrolls into view. |
| fade | number | 0.3 | How far in em digits roll beyond the text before fading out. 0 clips them at the edge. |
| fontSize | number | string | 100 | Font size in px, or any CSS size such as inherit. |
| fontWeight | number | string | 'inherit' | Font weight of the number. |
| textColor | string | 'inherit' | Color of the number. |
| gap | number | 0 | Space between digits and symbols in px. |
| padding | number | 0 | Extra height in px added to each digit, which also spaces out rolling digits. |
| tabular | boolean | true | Keeps every digit the same width. When off, widths ease between digits as they roll. |
| digitStyle | CSSProperties | - | Styles for each digit box, for example a tile background with padding and radius. |
| className | string | '' | Extra class names for the root. |
| style | CSSProperties | - | Inline styles for the root. |

### Full Component Source
```jsx
'use client';

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './Counter.css';

const ROOT = 'counter';
const SR = 'counter__sr';
const ROW = 'counter__row';
const AFFIX = 'counter__affix';
const DIGIT = 'counter__digit';
const SIZER = 'counter__sizer';
const WINDOW = 'counter__window';
const STRIP = 'counter__strip';
const NUMERAL = 'counter__numeral';
const SYMBOL = 'counter__symbol';
const SYMBOL_TEXT = 'counter__symbol-text';
const BLUR = 'counter__blur';
const MEASURE = 'counter__measure';

const TAU = Math.PI * 2;
const NUMERIC = new Set(['integer', 'group', 'decimal', 'fraction']);
const DIRECTIONS = ['auto', 'up', 'down', 'shortest'];
const MASK =
  'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.0355) calc(var(--counter-fade, 0em) * 0.1667), rgba(0, 0, 0, 0.2099) calc(var(--counter-fade, 0em) * 0.3333), rgba(0, 0, 0, 0.5) calc(var(--counter-fade, 0em) * 0.5), rgba(0, 0, 0, 0.7901) calc(var(--counter-fade, 0em) * 0.6667), rgba(0, 0, 0, 0.9645) calc(var(--counter-fade, 0em) * 0.8333), #000 var(--counter-fade, 0em), #000 calc(100% - var(--counter-fade, 0em)), rgba(0, 0, 0, 0.9645) calc(100% - var(--counter-fade, 0em) * 0.8333), rgba(0, 0, 0, 0.7901) calc(100% - var(--counter-fade, 0em) * 0.6667), rgba(0, 0, 0, 0.5) calc(100% - var(--counter-fade, 0em) * 0.5), rgba(0, 0, 0, 0.2099) calc(100% - var(--counter-fade, 0em) * 0.3333), rgba(0, 0, 0, 0.0355) calc(100% - var(--counter-fade, 0em) * 0.1667), rgba(0, 0, 0, 0) 100%)';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const mod = (value, base) => ((value % base) + base) % base;

const wrap = offset => mod(offset + 5, 10) - 5;

const prefersReduced = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

const stepBetween = (from, to, direction) => {
  const up = mod(to - from, 10);
  if (direction === 'up') return up;
  if (direction === 'down') return up === 0 ? 0 : up - 10;
  return up > 5 ? up - 10 : up;
};

const createFormatter = (locale, options) => {
  try {
    return new Intl.NumberFormat(locale, options);
  } catch {
    return new Intl.NumberFormat('en-US');
  }
};

const digitsFor = formatter => {
  const { locale, numberingSystem } = formatter.resolvedOptions();
  const plain = createFormatter(locale, { numberingSystem, useGrouping: false });
  return Array.from({ length: 10 }, (_, digit) => plain.format(digit));
};

const slotsFor = (formatter, digits, value) => {
  const parts = formatter.formatToParts(value);
  let first = -1;
  let last = -1;
  let place = 0;
  parts.forEach((part, index) => {
    if (!NUMERIC.has(part.type)) return;
    if (first < 0) first = index;
    last = index;
    if (part.type === 'integer') place += [...part.value].length;
  });
  let fraction = 0;
  const counts = {};
  const slots = [];
  parts.forEach((part, index) => {
    if (part.type === 'integer' || part.type === 'fraction') {
      [...part.value].forEach(char => {
        const digit = Math.max(0, digits.indexOf(char));
        if (part.type === 'integer') {
          place -= 1;
          slots.push({ key: `i${place}`, kind: 'digit', digit, text: '', rank: -2 * place });
        } else {
          slots.push({ key: `f${fraction}`, kind: 'digit', digit, text: '', rank: 1 + fraction });
          fraction += 1;
        }
      });
    } else if (part.type === 'group') {
      slots.push({ key: `g${place}`, kind: 'symbol', digit: 0, text: part.value, rank: 1 - 2 * place });
    } else if (part.type === 'decimal') {
      slots.push({ key: 'd', kind: 'symbol', digit: 0, text: part.value, rank: 0.5 });
    } else {
      const before = first < 0 || index < first;
      const name = `${before ? 'p' : 's'}-${part.type}`;
      counts[name] = (counts[name] || 0) + 1;
      slots.push({
        key: `${name}-${counts[name]}`,
        kind: 'symbol',
        digit: 0,
        text: part.value,
        rank: before ? -10000 - (first - index) : 10000 + (index - last)
      });
    }
  });
  return slots;
};

const makeItem = (slot, position, shown) => ({
  kind: slot.kind,
  rank: slot.rank,
  pos: position,
  vel: 0,
  target: position,
  shown,
  shownVel: 0,
  shownTarget: shown,
  wait: 0,
  exiting: false,
  natural: 0,
  el: null,
  numerals: null,
  strip: null,
  blur: null,
  filter: '',
  blurred: false
});

function Counter({
  value = 0,
  locale = 'en-US',
  format,
  decimals,
  minDigits = 1,
  prefix,
  suffix,
  direction = 'auto',
  duration = 0.7,
  bounce = 0.2,
  stagger = 0.04,
  motionBlur = true,
  intro = true,
  fade = 0.3,
  fontSize = 100,
  fontWeight = 'inherit',
  textColor = 'inherit',
  gap = 0,
  padding = 0,
  tabular = true,
  digitStyle,
  className = '',
  style
}) {
  const rootRef = useRef(null);
  const rowRef = useRef(null);
  const measureRef = useRef(null);
  const blurId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const amount = typeof value === 'number' ? (Object.is(value, -0) ? 0 : value) : Number(value);
  const formatKey = JSON.stringify(format ?? {});

  const formatter = useMemo(() => {
    const options = { ...JSON.parse(formatKey) };
    if (decimals !== undefined) {
      const fixed = clamp(Math.round(decimals), 0, 20);
      options.minimumFractionDigits = fixed;
      options.maximumFractionDigits = fixed;
    }
    if (minDigits > 1) options.minimumIntegerDigits = clamp(Math.round(minDigits), 1, 21);
    return createFormatter(locale, options);
  }, [locale, formatKey, decimals, minDigits]);

  const digits = useMemo(() => digitsFor(formatter), [formatter]);
  const slots = useMemo(() => slotsFor(formatter, digits, amount), [formatter, digits, amount]);
  const label = useMemo(() => formatter.format(amount), [formatter, amount]);
  const [list, setList] = useState(() =>
    slots.map(slot => ({ ...slot, start: slot.kind === 'digit' ? slot.digit : 0 }))
  );

  const engine = useRef({ items: new Map(), raf: 0, last: 0, ready: false, value: amount, widths: [], em: 16 });
  const settings = {
    direction: DIRECTIONS.includes(direction) ? direction : 'auto',
    duration: Math.max(0.05, duration),
    bounce: clamp(bounce, 0, 0.9),
    stagger: Math.max(0, stagger),
    motionBlur,
    tabular
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const paint = item => {
    const el = item.el;
    if (!el) return;
    const e = engine.current;
    const s = settingsRef.current;
    const shown = clamp(item.shown, 0, 1);
    const resting = item.pos === item.target && item.vel === 0;
    if (item.kind === 'digit') {
      item.numerals?.forEach((numeral, n) => {
        numeral.style.transform = `translateY(${(wrap(n - item.pos) * 100).toFixed(3)}%)`;
      });
      if (shown >= 1 && (s.tabular || resting)) {
        el.style.width = '';
      } else {
        const at = mod(item.pos, 10);
        const low = Math.floor(at);
        const from = e.widths[low % 10] ?? 0;
        const to = e.widths[(low + 1) % 10] ?? from;
        el.style.width = `${((from + (to - from) * (at - low)) * shown).toFixed(2)}px`;
      }
      if (item.blur && item.strip) {
        const radius = s.motionBlur ? clamp((Math.abs(item.vel) - 3) * 0.006, 0, 0.09) * e.em : 0;
        if (radius > 0.25) {
          item.blur.setAttribute('stdDeviation', `0 ${radius.toFixed(2)}`);
          if (!item.blurred) {
            item.strip.style.filter = `url(#${item.filter})`;
            item.blurred = true;
          }
        } else if (item.blurred) {
          item.strip.style.filter = '';
          item.blurred = false;
        }
      }
    } else {
      el.style.width = shown >= 1 ? '' : `${(item.natural * shown).toFixed(2)}px`;
    }
    el.style.setProperty('--counter-shown', shown >= 1 ? '' : shown.toFixed(3));
  };

  const frame = now => {
    const e = engine.current;
    e.raf = 0;
    const s = settingsRef.current;
    const elapsed = clamp((now - e.last) / 1000, 0, 1 / 20);
    e.last = now;
    const reduced = prefersReduced();
    const omega = TAU / s.duration;
    const zeta = 1 - s.bounce;
    const presence = TAU / (s.duration * 0.85);
    const done = [];
    let busy = false;
    e.items.forEach((item, key) => {
      if (reduced) {
        item.wait = 0;
        item.pos = item.target;
        item.vel = 0;
        item.shown = item.shownTarget;
        item.shownVel = 0;
      } else {
        let left = elapsed;
        if (item.wait > 0) {
          const used = Math.min(item.wait, left);
          item.wait -= used;
          left -= used;
        }
        if (left > 0) {
          const steps = Math.ceil(left * 240);
          const dt = left / steps;
          for (let i = 0; i < steps; i++) {
            item.vel += (-omega * omega * (item.pos - item.target) - 2 * zeta * omega * item.vel) * dt;
            item.pos += item.vel * dt;
            item.shownVel +=
              (-presence * presence * (item.shown - item.shownTarget) - 2 * presence * item.shownVel) * dt;
            item.shown += item.shownVel * dt;
          }
        }
      }
      const settled =
        item.wait <= 0 &&
        Math.abs(item.pos - item.target) < 0.002 &&
        Math.abs(item.vel) < 0.02 &&
        Math.abs(item.shown - item.shownTarget) < 0.002 &&
        Math.abs(item.shownVel) < 0.02;
      if (settled) {
        item.target = mod(Math.round(item.target), 10);
        item.pos = item.target;
        item.vel = 0;
        item.shown = item.shownTarget;
        item.shownVel = 0;
        if (item.exiting) done.push(key);
      } else {
        busy = true;
      }
      paint(item);
    });
    if (done.length) {
      done.forEach(key => e.items.delete(key));
      setList(previous => previous.filter(slot => !done.includes(slot.key)));
    }
    if (busy) e.raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    const e = engine.current;
    if (e.raf || typeof window === 'undefined') return;
    e.last = performance.now();
    e.raf = requestAnimationFrame(frame);
  };

  const kickRef = useRef(kick);
  kickRef.current = kick;

  useIsoLayoutEffect(() => {
    const e = engine.current;
    const s = settingsRef.current;
    if (!e.ready) {
      slots.forEach(slot => e.items.set(slot.key, makeItem(slot, slot.kind === 'digit' ? slot.digit : 0, 1)));
      e.ready = true;
      e.value = amount;
      return;
    }
    const previous = e.value;
    e.value = amount;
    const trend =
      s.direction !== 'auto'
        ? s.direction
        : Math.abs(amount) > Math.abs(previous)
          ? 'up'
          : Math.abs(amount) < Math.abs(previous)
            ? 'down'
            : 'shortest';
    const next = new Set(slots.map(slot => slot.key));
    const moving = [];
    slots.forEach(slot => {
      let item = e.items.get(slot.key);
      if (!item) {
        item = makeItem(slot, 0, 0);
        e.items.set(slot.key, item);
      }
      item.exiting = false;
      item.shownTarget = 1;
      item.rank = slot.rank;
      if (slot.kind !== 'digit') return;
      const step = stepBetween(mod(Math.round(item.target), 10), slot.digit, trend);
      if (step !== 0 || item.shown < 1) {
        item.target += step;
        moving.push(item);
      }
    });
    e.items.forEach((item, key) => {
      if (next.has(key) || item.exiting) return;
      item.exiting = true;
      item.shownTarget = 0;
      if (item.kind !== 'digit') return;
      item.target += stepBetween(mod(Math.round(item.target), 10), 0, trend);
      moving.push(item);
    });
    moving
      .sort((a, b) => b.rank - a.rank)
      .forEach((item, order) => {
        item.wait = order * s.stagger;
      });
    e.items.forEach((item, key) => {
      if (item.kind !== 'symbol' || key[0] !== 'g') return;
      const owner = e.items.get(`i${key.slice(1)}`);
      if (owner && (owner.shown < 1 || owner.shownTarget < 1)) item.wait = owner.wait;
    });
    setList(previous => {
      const known = new Map(previous.map(slot => [slot.key, slot]));
      const merged = slots.map(slot => ({ ...slot, start: known.get(slot.key)?.start ?? 0 }));
      previous.forEach(slot => {
        if (!next.has(slot.key)) merged.push(slot);
      });
      merged.sort((a, b) => a.rank - b.rank);
      const same =
        merged.length === previous.length &&
        merged.every(
          (slot, index) =>
            slot.key === previous[index].key &&
            slot.digit === previous[index].digit &&
            slot.text === previous[index].text
        );
      return same ? previous : merged;
    });
    kick();
  }, [slots]);

  useIsoLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const e = engine.current;
    row.querySelectorAll('[data-slot]').forEach(el => {
      const item = e.items.get(el.dataset.slot ?? '');
      if (!item) return;
      item.el = el;
      if (item.kind === 'digit') {
        item.numerals = [...el.querySelectorAll('[data-numeral]')];
        item.strip = el.querySelector('[data-strip]');
        item.blur = el.querySelector('feGaussianBlur');
        item.filter = el.querySelector('filter')?.id ?? '';
        if (!item.blur && item.strip) item.strip.style.filter = '';
        item.blurred = Boolean(item.blur && item.strip?.style.filter);
      } else if (item.shown < 1 || item.shownTarget < 1) {
        item.natural = el.firstElementChild?.getBoundingClientRect().width ?? 0;
      }
      paint(item);
    });
  }, [list, motionBlur]);

  useIsoLayoutEffect(() => {
    const row = measureRef.current;
    const root = rootRef.current;
    if (!row || !root) return undefined;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const e = engine.current;
      e.widths = [...row.children].map(child => child.getBoundingClientRect().width);
      e.em = parseFloat(getComputedStyle(root).fontSize) || 16;
    };
    measure();
    document.fonts?.ready?.then(measure).catch(() => {});
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        alive = false;
      };
    }
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!intro || !root || prefersReduced()) return undefined;
    const spin = () => {
      const e = engine.current;
      const s = settingsRef.current;
      const turn = s.direction === 'down' ? -10 : 10;
      [...e.items.values()]
        .filter(item => item.kind === 'digit' && !item.exiting)
        .sort((a, b) => a.rank - b.rank)
        .forEach((item, order) => {
          item.target += turn;
          item.wait = order * s.stagger;
        });
      kickRef.current();
    };
    if (typeof IntersectionObserver === 'undefined') {
      spin();
      return undefined;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        spin();
      },
      { threshold: 0.5 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [intro]);

  useEffect(() => {
    const e = engine.current;
    return () => cancelAnimationFrame(e.raf);
  }, []);

  const affix = node =>
    node === undefined || node === null || node === false ? null : <span className={AFFIX}>{node}</span>;

  return (
    <span
      ref={rootRef}
      className={[ROOT, className].filter(Boolean).join(' ')}
      style={{
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        fontWeight,
        color: textColor,
        fontVariantNumeric: tabular ? 'tabular-nums' : undefined,
        '--counter-fade': `${Math.max(0, fade)}em`,
        '--counter-gap': `${Math.max(0, gap)}px`,
        '--counter-padding': `${Math.max(0, padding)}px`,
        ...style
      }}
    >
      <span className={SR}>
        {prefix}
        {label}
        {suffix}
      </span>
      <span ref={rowRef} className={ROW} aria-hidden="true">
        {affix(prefix)}
        {list.map(slot =>
          slot.kind === 'digit' ? (
            <span key={slot.key} data-slot={slot.key} className={DIGIT} style={digitStyle}>
              <span className={SIZER}>{digits[slot.digit]}</span>
              <span className={WINDOW} style={{ maskImage: MASK, WebkitMaskImage: MASK }}>
                <span className={STRIP} data-strip="">
                  {digits.map((char, n) => (
                    <span
                      key={n}
                      className={NUMERAL}
                      data-numeral=""
                      style={{ transform: `translateY(${wrap(n - slot.start) * 100}%)` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>
              {motionBlur && (
                <svg className={BLUR} aria-hidden="true">
                  <filter
                    id={`${blurId}-${slot.key}`}
                    x="-10%"
                    y="-50%"
                    width="120%"
                    height="200%"
                    colorInterpolationFilters="sRGB"
                  >
                    <feGaussianBlur stdDeviation="0 0" />
                  </filter>
                </svg>
              )}
            </span>
          ) : (
            <span key={slot.key} data-slot={slot.key} className={SYMBOL}>
              <span className={SYMBOL_TEXT}>{slot.text}</span>
            </span>
          )
        )}
        {affix(suffix)}
      </span>
      <span ref={measureRef} className={MEASURE} aria-hidden="true">
        {digits.map((char, n) => (
          <span key={n}>{char}</span>
        ))}
      </span>
    </span>
  );
}

export default Counter;

```

### Component CSS
```css
.counter {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  line-height: 1;
  white-space: nowrap;
  direction: ltr;
  unicode-bidi: isolate;
}

.counter__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.counter__row {
  display: inline-flex;
  align-items: baseline;
  margin: 0 calc(var(--counter-gap, 0px) / -2);
  user-select: none;
  -webkit-user-select: none;
}

.counter__affix,
.counter__digit,
.counter__symbol {
  margin: 0 calc(var(--counter-gap, 0px) / 2 * var(--counter-shown, 1));
  opacity: var(--counter-shown, 1);
}

.counter__affix {
  white-space: pre;
}

.counter__digit {
  position: relative;
  display: inline-block;
  box-sizing: content-box;
  line-height: calc(1em + var(--counter-padding, 0px));
  text-align: center;
}

.counter__sizer {
  visibility: hidden;
}

.counter__window {
  position: absolute;
  top: calc(var(--counter-fade, 0em) * -1);
  right: 0;
  bottom: calc(var(--counter-fade, 0em) * -1);
  left: 0;
  overflow: hidden;
  pointer-events: none;
}

.counter__strip {
  position: absolute;
  inset: 0;
}

.counter__numeral {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.counter__symbol {
  position: relative;
  display: inline-flex;
  justify-content: center;
  clip-path: inset(-0.5em 0);
}

.counter__symbol-text {
  display: inline-block;
  white-space: pre;
}

.counter__blur {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.counter__measure {
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  overflow: hidden;
  white-space: nowrap;
  visibility: hidden;
  pointer-events: none;
}

.counter__measure > span {
  display: inline-block;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

### More from React Bits
The full library index, including everything reactbits.dev offers, is at https://reactbits.dev/llms.txt — fetch it if this component is not the right fit or the project needs more pieces.
