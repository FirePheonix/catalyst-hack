import React from "react";
import { Audio } from "@remotion/media";
import { Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DitherImage } from "../components/Dither";
import { bob, drift, Paper } from "../components/Paper";
import { Rays } from "../components/Pixel";
import { C, F } from "../theme";

type Item = { day: string; time?: string; text: string };

const ITEMS: Item[] = [
  { day: "18", time: "5 PM", text: "Registrations close." },
  { day: "18", time: "6 PM", text: "Problem statements revealed." },
  { day: "19", time: "6 PM", text: "Final submissions: pitch video (demo) + PPT." },
  { day: "20", text: "Top 10 teams pitch, offline on campus." },
  { day: "20", text: "Results & prize ceremony." },
];

const ITEM_START = 30;
const ITEM_GAP = 11;

const Row: React.FC<{ item: Item; index: number }> = ({ item, index }) => {
  const frame = useCurrentFrame();
  const at = ITEM_START + index * ITEM_GAP;
  const on = frame >= at;
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "34px 190px 1fr",
        alignItems: "center",
        gap: 26,
        height: 104,
        opacity: interpolate(frame, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: interpolate(frame, [at, at + 10], ["40px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      {/* node on the line */}
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: `3px solid #1d1d1d`,
          background: on ? C.blue : C.card,
          boxShadow: on ? `0 0 0 6px rgba(1,1,238,0.15)` : undefined,
          scale: interpolate(frame, [at, at + 5, at + 10], [0.4, 1.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      />
      {/* hand-drawn date pill */}
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "4px 10px",
          border: "3px solid #1d1d1d",
          borderRadius: "16px 12px 18px 10px",
          fontFamily: F.hand,
          fontSize: 36,
          lineHeight: 1.05,
          rotate: index % 2 ? "0.8deg" : "-0.8deg",
          background: C.card,
        }}
      >
        <span>
          {item.day}
          <sup style={{ fontSize: "0.55em" }}>th</sup> Nov
        </span>
        {item.time ? <span>{item.time}</span> : null}
      </span>
      <span style={{ fontFamily: F.hand, fontSize: 40, lineHeight: 1.15, color: "#1d1d1d" }}>
        <span style={{ display: "block", width: 34, height: 3, background: "#1d1d1d", marginBottom: 6 }} />
        {item.text}
      </span>
    </div>
  );
};

const Card: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 400,
        top: 150,
        width: 1120,
        height: 790,
        padding: "44px 70px",
        boxSizing: "border-box",
        borderRadius: 30,
        backgroundColor: "rgba(251,251,248,0.96)",
        backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`,
        backgroundSize: "20px 20px",
        boxShadow: "0 30px 60px rgba(20,20,60,0.12)",
        color: "#1d1d1d",
        translate: interpolate(frame, [0, 16], ["0px 120px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
        rotate: interpolate(frame, [0, 16], ["2deg", "0deg"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
        opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      {/* title with rays + hand-drawn underline */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
        <Rays width={44} color="#1d1d1d" draw={interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} style={{ scale: "-1 1" }} />
        <Interactive.Div name="Timeline title" style={{ position: "relative", fontFamily: F.hand, fontSize: 84, lineHeight: 1.1 }}>
          Hackathon Timeline
          <span
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 4,
              background: "#1d1d1d",
              width: `${interpolate(frame, [8, 24], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
            }}
          />
        </Interactive.Div>
        <Rays width={44} color="#1d1d1d" draw={interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </div>
      <Interactive.Div
        name="Timeline intro"
        style={{
          margin: "16px auto 30px",
          textAlign: "center",
          fontFamily: F.hand,
          fontSize: 38,
          lineHeight: 1.3,
          opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        From registrations to final winners, here’s how it all goes down:
      </Interactive.Div>

      <div style={{ position: "relative", marginLeft: 40 }}>
        {/* the vertical line draws itself downwards */}
        <span
          style={{
            position: "absolute",
            left: 15,
            top: 52,
            width: 3,
            background: "#1d1d1d",
            height: interpolate(frame, [ITEM_START, ITEM_START + ITEM_GAP * 4], [0, 4 * 104], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
        {ITEMS.map((it, i) => (
          <Row key={i} item={it} index={i} />
        ))}
      </div>
    </div>
  );
};

export const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      {/* side clouds like the timeline poster frame */}
      <div style={{ position: "absolute", left: -110, top: 600, width: 560, translate: `${drift(frame, 11, 18)}px 0px` }}>
        <Img
          name="Gopher"
          src={staticFile("img/gopher.webp")}
          style={{ position: "absolute", left: "18%", top: "-22%", width: "21%", translate: `0px ${bob(frame)}px` }}
        />
        <DitherImage src={staticFile("img/cloud-1.webp")} width={560} aspect={1400 / 593} start={0} duration={20} cell={8} seed="tc1" style={{ position: "relative" }} />
      </div>
      <div style={{ position: "absolute", right: -110, top: 300, width: 560, translate: `${-drift(frame, 13, 18)}px 0px` }}>
        <Img
          name="Steve"
          src={staticFile("img/steve.webp")}
          style={{ position: "absolute", left: "40%", top: "-20%", width: "19%", translate: `0px ${bob(frame, 1.4)}px` }}
        />
        <DitherImage src={staticFile("img/cloud-2.webp")} width={560} aspect={1400 / 566} start={4} duration={20} cell={8} seed="tc2" style={{ position: "relative" }} />
      </div>

      <Card />

      <Audio name="Card page turn" src={staticFile("sfx/page-turn.wav")} from={2} volume={0.9} />
      <Audio name="Item 1" src={staticFile("sfx/switch.wav")} from={ITEM_START} volume={0.55} />
      <Audio name="Item 2" src={staticFile("sfx/switch.wav")} from={ITEM_START + ITEM_GAP} volume={0.55} />
      <Audio name="Item 3" src={staticFile("sfx/switch.wav")} from={ITEM_START + ITEM_GAP * 2} volume={0.55} />
      <Audio name="Item 4" src={staticFile("sfx/switch.wav")} from={ITEM_START + ITEM_GAP * 3} volume={0.55} />
      <Audio name="Item 5" src={staticFile("sfx/switch.wav")} from={ITEM_START + ITEM_GAP * 4} volume={0.55} />
    </Paper>
  );
};
