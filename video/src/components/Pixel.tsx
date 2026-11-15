import React, { useId } from "react";
import { C, CHECKER_BLUE, CHECKER_INK, CHECKER_SIZE, F } from "../theme";

/*
 * Pixel-art bits from the website (src/components/pixel.jsx): trophies,
 * laurels, "rays" tick marks. '1' = outline, '2' = halftone, '3' = solid.
 */
const TROPHY = [
  "..111111111111..",
  "1111222222221111",
  "1..1222222221..1",
  "1..1222222221..1",
  ".1.1222222221.1.",
  "..112222222211..",
  "...1222222221...",
  "....12222221....",
  ".....122221.....",
  "......1221......",
  "......1221......",
  ".....111111.....",
  "....12222221....",
  "....11111111....",
];

const TROPHY_STAR = [
  "..111111111111..",
  "1111222332221111",
  "1..1222332221..1",
  "1..1333333331..1",
  ".1.1233333321.1.",
  "..112233332211..",
  "...1233223321...",
  "....12222221....",
  ".....122221.....",
  "......1221......",
  "......1221......",
  ".....111111.....",
  "....12222221....",
  "....11111111....",
];

const LOCK = [
  "....111111....",
  "...11....11...",
  "..11......11..",
  "..1........1..",
  "..1........1..",
  "11111111111111",
  "12222222222221",
  "12222211222221",
  "12222211222221",
  "12222221222221",
  "12222222222221",
  "11111111111111",
];

const PixelArt: React.FC<{ map: string[]; width: number; color?: string; style?: React.CSSProperties }> = ({
  map,
  width,
  color = C.blue,
  style,
}) => {
  const id = useId().replace(/:/g, "");
  const w = map[0].length;
  const h = map.length;
  const cells: React.ReactNode[] = [];
  map.forEach((row, y) => {
    [...row].forEach((c, x) => {
      if (c === ".") return;
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1.02"
          height="1.02"
          fill={c === "2" ? `url(#ht-${id})` : color}
        />,
      );
    });
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={width}
      height={(width * h) / w}
      shapeRendering="crispEdges"
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <defs>
        <pattern id={`ht-${id}`} width="0.5" height="0.5" patternUnits="userSpaceOnUse">
          <rect width="0.5" height="0.5" fill="#fff" />
          <rect width="0.25" height="0.25" fill={color} />
        </pattern>
      </defs>
      {cells}
    </svg>
  );
};

export const PixelTrophy: React.FC<{ width: number; star?: boolean; color?: string; style?: React.CSSProperties }> = ({
  width,
  star = false,
  color,
  style,
}) => <PixelArt map={star ? TROPHY_STAR : TROPHY} width={width} color={color} style={style} />;

export const PixelLock: React.FC<{ width: number; color?: string; style?: React.CSSProperties }> = ({
  width,
  color = C.ink,
  style,
}) => <PixelArt map={LOCK} width={width} color={color} style={style} />;

/** Laurel branch; `flip` mirrors it for the right-hand side. */
export const Laurel: React.FC<{ width: number; flip?: boolean; color?: string }> = ({
  width,
  flip = false,
  color = C.blue,
}) => {
  const leaves: [number, number, number][] = [
    [14, 40, -55],
    [10, 32, -40],
    [8, 23, -25],
    [9, 14, -5],
    [13, 6, 15],
  ];
  return (
    <svg
      viewBox="0 0 26 50"
      width={width}
      height={(width * 50) / 26}
      style={{ display: "block", flex: "none", scale: flip ? "-1 1" : undefined }}
    >
      <path d="M20 48 C 8 40, 3 26, 12 4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse cx="-4" cy="0" rx="4.6" ry="2" fill={color} />
          <ellipse cx="4" cy="-1" rx="4.2" ry="1.8" fill={color} transform="rotate(-50)" />
        </g>
      ))}
    </svg>
  );
};

/** The three little "spark" strokes that sit next to headings. `draw` 0..1 animates them in. */
export const Rays: React.FC<{ width: number; color?: string; draw?: number; style?: React.CSSProperties }> = ({
  width,
  color = C.blue,
  draw = 1,
  style,
}) => {
  const lines = [
    [6, 22, 4, 6],
    [16, 26, 28, 12],
    [20, 36, 36, 32],
  ];
  return (
    <svg viewBox="0 0 40 40" width={width} height={width} style={{ display: "block", overflow: "visible", ...style }}>
      <g stroke={color} strokeWidth="3.4" strokeLinecap="round">
        {lines.map(([x1, y1, x2, y2], i) => {
          const local = Math.max(0, Math.min(1, draw * 3 - i));
          return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * local} y2={y1 + (y2 - y1) * local} opacity={local > 0 ? 1 : 0} />;
        })}
      </g>
    </svg>
  );
};

/** Card / button with the site's offset, checker-dithered shadow. */
export const ShadowBox: React.FC<{
  children?: React.ReactNode;
  face?: string;
  shadow?: "blue" | "ink";
  offset?: number;
  border?: string;
  style?: React.CSSProperties;
  pressed?: number; // 0..1, slides the face into the shadow like :active
}> = ({ children, face = C.card, shadow = "blue", offset = 10, border = C.ink, style, pressed = 0 }) => (
  <div style={{ position: "relative", ...style }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: shadow === "blue" ? CHECKER_BLUE : CHECKER_INK,
        backgroundSize: CHECKER_SIZE,
        translate: `${offset}px ${offset}px`,
      }}
    />
    <div
      style={{
        position: "relative",
        background: face,
        border: `3px solid ${border}`,
        translate: `${offset * pressed}px ${offset * pressed}px`,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  </div>
);

/** Text with the offset, checker-dithered blue shadow copy (".dither-heading"). */
export const DitherText: React.FC<{
  children: string;
  style?: React.CSSProperties;
  shadowColor?: "blue" | "ink";
}> = ({ children, style, shadowColor = "blue" }) => (
  <span style={{ position: "relative", display: "inline-block", fontFamily: F.pixel, ...style }}>
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        translate: "0.07em 0.07em",
        backgroundImage: shadowColor === "blue" ? CHECKER_BLUE : CHECKER_INK,
        backgroundSize: CHECKER_SIZE,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        whiteSpace: "pre",
      }}
    >
      {children}
    </span>
    <span style={{ position: "relative", whiteSpace: "pre" }}>{children}</span>
  </span>
);

/** Section kicker like  [ 02 / timeline ] */
export const Kicker: React.FC<{ n: string; children: string; style?: React.CSSProperties }> = ({
  n,
  children,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 18px",
      border: `3px solid ${C.ink}`,
      background: C.card,
      fontFamily: F.tiny,
      fontSize: 24,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: C.ink,
      ...style,
    }}
  >
    <span style={{ color: C.blue }}>{n}</span>
    <span style={{ opacity: 0.4 }}>/</span>
    {children}
  </div>
);
