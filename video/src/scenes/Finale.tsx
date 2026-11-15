import React from "react";
import { Audio } from "@remotion/media";
import { Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DitherField, DitherImage } from "../components/Dither";
import { Paper } from "../components/Paper";
import { DitherText, Kicker, ShadowBox } from "../components/Pixel";
import { C, F } from "../theme";

const CLICK = 66;

/** Top bar: brand on the left (like .nav__brand), partners on the right. */
const TopBar: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [2, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 60, display: "flex", alignItems: "center", gap: 16, opacity: fade }}>
        <Img name="Techsoc logo" src={staticFile("img/techsoc.webp")} style={{ width: 70 }} />
        <span style={{ fontFamily: F.pixel, fontWeight: 600, fontSize: 48, color: C.ink }}>catalyst</span>
      </div>
      <div style={{ position: "absolute", right: 90, top: 50, display: "flex", alignItems: "center", gap: 26, opacity: fade }}>
        <span style={{ fontFamily: F.tiny, fontSize: 24, textTransform: "uppercase", letterSpacing: "0.06em", color: C.ink }}>
          powered by
        </span>
        <Img name="Techsoc" src={staticFile("img/techsoc.webp")} style={{ height: 76 }} />
        <Img name="IIIT Sonepat" src={staticFile("img/iiits.webp")} style={{ height: 80 }} />
        <Img name="Algozenith" src={staticFile("img/algozenith.webp")} style={{ height: 74 }} />
      </div>
    </>
  );
};

const Heading: React.FC = () => {
  const frame = useCurrentFrame();
  const words = [
    ["Your", 8],
    ["24", 12],
    ["hours", 16],
  ] as const;
  const words2 = [
    ["start", 22],
    ["Nov 18.", 26],
  ] as const;
  const w = (txt: string, at: number) => (
    <span
      key={txt}
      style={{
        display: "inline-block",
        opacity: frame >= at ? 1 : 0,
        translate: interpolate(frame, [at, at + 8], ["0px 40px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.8)),
        }),
      }}
    >
      <DitherText style={{ fontSize: 150, fontWeight: 600, lineHeight: 1, color: txt === "24" || txt === "Nov 18." ? C.blue : C.ink }}>
        {txt}
      </DitherText>
    </span>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 255, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 44 }}>{words.map(([t, a]) => w(t, a))}</div>
      <div style={{ display: "flex", gap: 44 }}>{words2.map(([t, a]) => w(t, a))}</div>
    </div>
  );
};

/** The xl ".btn" with checker shadow, clicked by a pixel cursor. */
const RegisterButton: React.FC = () => {
  const frame = useCurrentFrame();
  const pressed = interpolate(frame, [CLICK, CLICK + 3, CLICK + 9], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 690,
        display: "flex",
        justifyContent: "center",
        scale: interpolate(frame, [36, 46], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(2)),
        }),
      }}
    >
      <ShadowBox face={frame >= CLICK + 3 ? C.blueDeep : C.blue} shadow="ink" offset={12} pressed={pressed}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "26px 56px",
            fontFamily: F.pixel,
            fontWeight: 600,
            fontSize: 60,
            lineHeight: 1,
            color: "#fff",
          }}
        >
          register now
          <span style={{ display: "inline-block", translate: `${frame >= CLICK ? 10 : 0}px 0px` }}>→</span>
        </span>
      </ShadowBox>
    </div>
  );
};

/** A chunky pixel arrow cursor that glides in and clicks the button. */
const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const map = [
    "1...........",
    "11..........",
    "121.........",
    "1221........",
    "12221.......",
    "122221......",
    "1222221.....",
    "12222221....",
    "122222221...",
    "1222222221..",
    "12222211111.",
    "1221221.....",
    "121.1221....",
    "11..1221....",
    "1....1221...",
    ".....1221...",
    "......11....",
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 1130,
        top: 760,
        opacity: interpolate(frame, [44, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: interpolate(frame, [44, CLICK - 2], ["380px 220px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }),
        scale: interpolate(frame, [CLICK, CLICK + 3, CLICK + 8], [1, 0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <svg viewBox="0 0 12 17" width={60} height={85} shapeRendering="crispEdges">
        {map.flatMap((row, y) =>
          [...row].map((c, x) =>
            c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={c === "1" ? C.ink : "#fff"} />,
          ),
        )}
      </svg>
    </div>
  );
};

export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      <DitherField mode="blobs" width={1920} height={1080} pixel={6} strength={0.75} style={{ position: "absolute" }} />
      {/* blue boxes rising at the bottom, like .final__boxes */}
      <div
        style={{
          position: "absolute",
          left: -40,
          top: 850,
          translate: `0px ${interpolate(frame, [4, 40], [120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px`,
        }}
      >
        <DitherImage src={staticFile("img/boxes.webp")} width={2000} aspect={1800 / 949} start={4} duration={34} cell={12} seed="bx" />
      </div>

      <TopBar />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", opacity: interpolate(frame, [4, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <Kicker n="08">register</Kicker>
      </div>
      <Heading />
      <Interactive.Div
        name="Deadline"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 590,
          textAlign: "center",
          fontFamily: F.serif,
          fontSize: 44,
          color: C.inkSoft,
          opacity: interpolate(frame, [30, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Registrations close <b style={{ color: C.ink, fontWeight: 500 }}>Nov 18, 5 PM</b>. Teams of up to 3.
      </Interactive.Div>
      <RegisterButton />
      <Cursor />

      <Audio name="Boxes dither" src={staticFile("sfx/dither.wav")} from={4} volume={0.5} />
      <Audio name="Word 1" src={staticFile("sfx/blip.wav")} from={8} volume={0.4} />
      <Audio name="Word 24" src={staticFile("sfx/blip.wav")} from={12} volume={0.4} />
      <Audio name="Word hours" src={staticFile("sfx/blip.wav")} from={16} volume={0.4} />
      <Audio name="Word start" src={staticFile("sfx/blip.wav")} from={22} volume={0.4} />
      <Audio name="Word date" src={staticFile("sfx/shutter-modern.wav")} from={26} volume={0.7} />
      <Audio name="Button pop" src={staticFile("sfx/switch.wav")} from={36} volume={0.6} />
      <Audio name="Cursor whoosh" src={staticFile("sfx/whoosh.wav")} from={46} volume={0.5} />
      <Audio name="Click" src={staticFile("sfx/mouse-click.wav")} from={CLICK} volume={0.65} />
      <Audio name="Registered" src={staticFile("sfx/coin.wav")} from={CLICK + 4} volume={0.45} />
    </Paper>
  );
};
