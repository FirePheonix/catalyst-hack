import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

/** The site's body background: warm paper with a faint 28px grid (scaled to 40px). */
export const Paper: React.FC<{ children?: React.ReactNode; grid?: number }> = ({ children, grid = 40 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: C.paper,
      backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`,
      backgroundSize: `${grid}px ${grid}px`,
      overflow: "hidden",
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Deterministic versions of the site's ambient CSS animations. */
export const bob = (frame: number, phase = 0) => {
  // .bob: 3.2s steps(6) up/down 8px  -> posterized sine
  const t = ((frame / 30 + phase) / 3.2) % 1;
  const stepped = Math.floor(t * 6) / 6;
  return -12 * Math.sin(stepped * Math.PI);
};
export const drift = (frame: number, period = 11, amp = 24, phase = 0) =>
  amp * Math.sin(((frame / 30 + phase) / period) * Math.PI * 2);
export const floaty = (frame: number, period = 7) => 14 * Math.sin((frame / 30 / period) * Math.PI * 2);
