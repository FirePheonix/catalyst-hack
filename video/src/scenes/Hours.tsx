import React from "react";
import { Audio } from "@remotion/media";
import { Easing, Img, Interactive, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DitherField } from "../components/Dither";
import { bob, Paper } from "../components/Paper";
import { DitherText, ShadowBox } from "../components/Pixel";
import { C, F } from "../theme";

const pad = (n: number) => String(n).padStart(2, "0");

/** One blue ".countdown__cell" with the checker-ink shadow. */
const Cell: React.FC<{ value: string; unit: string; delay: number; sep?: boolean }> = ({ value, unit, delay, sep }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "relative",
        scale: interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(2.2)),
        }),
      }}
    >
      <ShadowBox face={C.blue} shadow="ink" offset={12} style={{ width: 280 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0 14px", color: "#fff" }}>
          <span style={{ fontFamily: F.pixel, fontWeight: 600, fontSize: 170, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {value}
          </span>
          <span style={{ marginTop: 6, fontFamily: F.tiny, fontSize: 30, textTransform: "uppercase", opacity: 0.85 }}>{unit}</span>
        </div>
      </ShadowBox>
      {sep ? (
        <span style={{ position: "absolute", right: -50, top: 40, fontFamily: F.pixel, fontSize: 110, color: C.ink }}>:</span>
      ) : null}
    </div>
  );
};

const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const hrs = Math.round(
    interpolate(frame, [12, 40], [0, 24], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );
  return (
    <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 92 }}>
      <Cell value={pad(hrs)} unit="hours" delay={6} sep />
      <Cell value="00" unit="min" delay={10} sep />
      <Cell value="00" unit="sec" delay={14} />
    </div>
  );
};

const WORDS = ["build.", "submit.", "pitch."];

const Words: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 56 }}>
      {WORDS.map((w, i) => {
        const at = 42 + i * 9;
        return (
          <div
            key={w}
            style={{
              opacity: frame >= at ? 1 : 0,
              scale: interpolate(frame, [at, at + 8], [1.5, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }),
            }}
          >
            <DitherText style={{ fontSize: 120, fontWeight: 600, color: C.ink, lineHeight: 1 }}>{w}</DitherText>
          </div>
        );
      })}
    </div>
  );
};

const MARQUEE = ["catalyst", "24 hours", "open source", "nov 18 → 20", "build", "submit", "pitch", "₹200 per team prize pool"];

/** The tilted blue ".marquee" band from the site. */
const Marquee: React.FC = () => {
  const frame = useCurrentFrame();
  const row = [...MARQUEE, ...MARQUEE, ...MARQUEE];
  return (
    <div
      style={{
        position: "absolute",
        left: -40,
        right: -40,
        top: 850,
        rotate: "-2deg",
        background: C.blue,
        borderTop: `3px solid ${C.ink}`,
        borderBottom: `3px solid ${C.ink}`,
        overflow: "hidden",
        translate: interpolate(frame, [0, 14], ["0px 260px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <div style={{ display: "flex", width: "max-content", padding: "20px 0", translate: `${-frame * 9}px 0px` }}>
        {row.map((t, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 40,
              paddingRight: 40,
              fontFamily: F.tiny,
              fontSize: 40,
              color: "#fff",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {t}
            <i style={{ fontStyle: "normal", opacity: 0.7 }}>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
};

export const Hours: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      <DitherField mode="rise" width={1920} height={560} pixel={6} strength={1.05} style={{ position: "absolute", left: 0, top: 520 }} />

      <Interactive.Div
        name="Intra-college label"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          fontFamily: F.tiny,
          fontSize: 40,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: C.ink,
          opacity: interpolate(frame, [2, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <i style={{ display: "inline-block", width: 22, height: 22, background: C.blue, opacity: Math.floor(frame / 15) % 2 ? 0 : 1 }} />
        intra-college hackathon
      </Interactive.Div>

      <Counter />
      <Words />

      <Img
        name="Gopher"
        src={staticFile("img/gopher.webp")}
        style={{
          position: "absolute",
          left: 120,
          top: 690,
          width: 170,
          rotate: "-8deg",
          translate: `0px ${bob(frame) + interpolate(frame, [14, 28], [220, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) })}px`,
        }}
      />
      <Img
        name="Steve"
        src={staticFile("img/steve.webp")}
        style={{
          position: "absolute",
          right: 130,
          top: 650,
          width: 190,
          translate: `0px ${bob(frame, 1.4) + interpolate(frame, [20, 34], [240, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) })}px`,
        }}
      />
      <Marquee />

      <Sequence name="Hour ticks" from={12} durationInFrames={30} layout="none">
        {[0, 2, 4, 6, 8, 10, 12, 14, 17, 20, 24].map((f) => (
          <Audio key={f} src={staticFile("sfx/blip.wav")} from={f} volume={0.4} />
        ))}
      </Sequence>
      <Audio name="Cells switch" src={staticFile("sfx/switch.wav")} from={6} volume={0.6} />
      <Audio name="24 lands" src={staticFile("sfx/coin.wav")} from={40} volume={0.55} />
      <Audio name="Build" src={staticFile("sfx/mouse-click.wav")} from={42} volume={0.8} />
      <Audio name="Submit" src={staticFile("sfx/mouse-click.wav")} from={51} volume={0.8} />
      <Audio name="Pitch" src={staticFile("sfx/mouse-click.wav")} from={60} volume={0.8} />
    </Paper>
  );
};
