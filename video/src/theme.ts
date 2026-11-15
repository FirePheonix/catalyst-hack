import { loadFont as loadPixelify } from "@remotion/google-fonts/PixelifySans";
import { loadFont as loadSilkscreen } from "@remotion/google-fonts/Silkscreen";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadHand } from "@remotion/google-fonts/PatrickHand";

// Same tokens as the website (src/styles.css :root)
export const C = {
  blue: "#0101ee",
  blueDeep: "#0000b8",
  ink: "#2b2b2b",
  inkSoft: "#555555",
  paper: "#f3f3f0",
  card: "#fbfbf8",
  grid: "rgba(20, 20, 40, 0.06)",
} as const;

export const F = {
  pixel: loadPixelify("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily,
  tiny: loadSilkscreen("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  serif: loadNewsreader("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
  serifItalic: loadNewsreader("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  mono: loadMono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily,
  sans: loadMontserrat("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] }).fontFamily,
  hand: loadHand("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
};

const checker = (hex: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6' shape-rendering='crispEdges'%3E%3Crect width='3' height='3' fill='%23${hex}'/%3E%3Crect x='3' y='3' width='3' height='3' fill='%23${hex}'/%3E%3C/svg%3E")`;

// 2×2 checkerboards: the core "dither" texture (scaled ×1.5 for 1080p video)
export const CHECKER_BLUE = checker("0101ee");
export const CHECKER_INK = checker("2b2b2b");
export const CHECKER_WHITE = checker("ffffff");
export const CHECKER_SIZE = "6px 6px";

// 8×8 ordered-dither (Bayer) matrix, values 0..63
export const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62,
  30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31,
  55, 23, 61, 29, 53, 21,
];
export const BAYER_T = BAYER8.map((v) => (v + 0.5) / 64);
