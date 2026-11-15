import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  continueRender,
  delayRender,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BAYER8, BAYER_T } from "../theme";

type RGB = readonly [number, number, number];
const BLUE: RGB = [1, 1, 238];

/**
 * Port of the site's <DitherField>: a continuous scalar field thresholded
 * against the Bayer matrix, but driven by the video frame instead of rAF.
 */
export const DitherField: React.FC<{
  readonly mode: "blobs" | "rise" | "fall";
  readonly width: number;
  readonly height: number;
  readonly pixel?: number;
  readonly strength?: number;
  readonly color?: RGB;
  readonly speed?: number;
  readonly style?: React.CSSProperties;
}> = ({ mode, width, height, pixel = 6, strength = 1, color = BLUE, speed = 1.4, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const w = Math.ceil(width / pixel);
  const h = Math.ceil(height / pixel);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(w, h);
    const data = img.data;
    const t = 4 + (frame / fps) * speed;
    const m = Math.min(w, h);
    const blobs =
      mode === "blobs"
        ? [
            { x: w * (0.02 + 0.03 * Math.sin(t * 0.31)), y: h * (0.78 + 0.1 * Math.cos(t * 0.23)), r: m * 0.17, a: 0.85 },
            { x: w * (0.99 + 0.02 * Math.cos(t * 0.27)), y: h * (0.22 + 0.12 * Math.sin(t * 0.19)), r: m * 0.15, a: 0.8 },
            { x: w * (0.86 + 0.08 * Math.sin(t * 0.17)), y: h * (1.04 + 0.03 * Math.cos(t * 0.41)), r: m * 0.19, a: 0.9 },
          ]
        : null;
    const [cr, cg, cb] = color;
    for (let y = 0; y < h; y++) {
      const row = (y & 7) << 3;
      const ny = y / h;
      for (let x = 0; x < w; x++) {
        let v = 0;
        if (blobs) {
          for (const b of blobs) {
            const dx = x - b.x;
            const dy = y - b.y;
            v += b.a * Math.exp(-(dx * dx + dy * dy) / (b.r * b.r));
          }
        } else {
          const nx = x / w;
          const wave =
            0.07 * Math.sin(nx * 9 + t * 1.1) + 0.05 * Math.sin(nx * 23 - t * 1.7) + 0.03 * Math.sin(nx * 47 + t * 2.3);
          const d = mode === "rise" ? ny : 1 - ny;
          v = Math.pow(Math.max(0, Math.min(1, (d - 0.12 + wave) / 0.88)), 1.35);
        }
        const on = v * strength > BAYER_T[row + (x & 7)];
        const i4 = (y * w + x) << 2;
        data[i4] = cr;
        data[i4 + 1] = cg;
        data[i4 + 2] = cb;
        data[i4 + 3] = on ? 255 : 0;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [frame, fps, w, h, mode, strength, color, speed]);

  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      style={{ width, height, imageRendering: "pixelated", display: "block", ...style }}
    />
  );
};

// ───────────────────────── image loading ─────────────────────────
const cache = new Map<string, HTMLImageElement>();

const useLoadedImage = (src: string) => {
  const [img, setImg] = useState<HTMLImageElement | null>(() => cache.get(src) ?? null);
  const [handle] = useState(() => (cache.has(src) ? null : delayRender(`Loading ${src}`)));
  useEffect(() => {
    if (img) {
      if (handle !== null) continueRender(handle);
      return;
    }
    const i = new Image();
    i.onload = () => {
      cache.set(src, i);
      setImg(i);
      if (handle !== null) continueRender(handle);
    };
    i.onerror = () => {
      if (handle !== null) continueRender(handle);
    };
    i.src = src;
  }, [src, img, handle]);
  return img;
};

/**
 * Port of the site's <DitherReveal>: the image "dithers in", cells appear in
 * Bayer-matrix order (plus a little seeded noise).
 */
export const DitherImage: React.FC<{
  readonly src: string;
  readonly width: number;
  readonly aspect: number; // natural width / height
  readonly start?: number;
  readonly duration?: number;
  readonly cell?: number;
  readonly reverse?: boolean; // dither OUT instead of in
  readonly seed?: string;
  readonly style?: React.CSSProperties;
}> = ({ src, width, aspect, start = 0, duration = 30, cell = 9, reverse = false, seed = "d", style }) => {
  const frame = useCurrentFrame();
  const img = useLoadedImage(src);
  const ref = useRef<HTMLCanvasElement>(null);
  const height = Math.round(width / aspect);
  const W = Math.round(width);
  const H = height;

  const raw = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const p = reverse ? 1 - raw : raw;

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    if (p <= 0) return;
    if (p >= 1) {
      ctx.drawImage(img, 0, 0, W, H);
      return;
    }
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    ctx.save();
    ctx.beginPath();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const o = (BAYER8[((y & 7) << 3) + (x & 7)] + random(`${seed}-${x}-${y}`) * 6) / 70;
        if (o < p) ctx.rect(x * cell, y * cell, cell, cell);
      }
    }
    ctx.clip();
    ctx.drawImage(img, 0, 0, W, H);
    ctx.restore();
  }, [img, p, W, H, cell, seed]);

  return <canvas ref={ref} width={W} height={H} style={{ width: W, height: H, display: "block", ...style }} />;
};

/**
 * A solid block of Bayer cells. `cover` 0..1 is the share of cells drawn.
 * Used for the dither wipes between scenes and the "locked" prize cards.
 */
export const DitherCover: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly cover: number;
  readonly cell?: number;
  readonly color?: string;
  readonly bias?: "none" | "diagonal" | "down";
  readonly seed?: string;
  readonly style?: React.CSSProperties;
}> = ({ width, height, cover, cell = 30, color = "#0101ee", bias = "none", seed = "c", style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    if (cover <= 0) return;
    ctx.fillStyle = color;
    if (cover >= 1) {
      ctx.fillRect(0, 0, width, height);
      return;
    }
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let o = (BAYER8[((y & 7) << 3) + (x & 7)] + random(`${seed}-${x}-${y}`) * 8) / 72;
        if (bias === "diagonal") o = o * 0.55 + ((x / cols) * 0.6 + (y / rows) * 0.4) * 0.45;
        if (bias === "down") o = o * 0.5 + (y / rows) * 0.5;
        if (o < cover) ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }, [width, height, cover, cell, color, bias, seed]);
  return <canvas ref={ref} width={width} height={height} style={{ width, height, display: "block", ...style }} />;
};
