import React from "react";
import { Audio } from "@remotion/media";
import { Easing, Img, Interactive, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DitherField, DitherImage } from "../components/Dither";
import { bob, drift, floaty, Paper } from "../components/Paper";
import { C, F } from "../theme";

const PRESENTS = ["technical", "society", "presents"];

/** "technical / society / presents" typed in one character at a time. */
const Presents: React.FC = () => {
  const frame = useCurrentFrame();
  const total = PRESENTS.join("").length;
  const shown = Math.floor(
    interpolate(frame, [16, 36], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  let used = 0;
  return (
    <Interactive.Div
      name="Technical society presents"
      style={{
        position: "absolute",
        left: 1180,
        top: 250,
        fontFamily: F.pixel,
        fontWeight: 500,
        fontSize: 46,
        lineHeight: 0.95,
        color: C.ink,
      }}
    >
      {PRESENTS.map((word) => {
        const start = used;
        used += word.length;
        const n = Math.max(0, Math.min(word.length, shown - start));
        return (
          <div key={word} style={{ height: "0.95em" }}>
            {word.slice(0, n)}
            {n > 0 && n < word.length ? <span style={{ color: C.blue }}>█</span> : null}
          </div>
        );
      })}
    </Interactive.Div>
  );
};

const Ambient: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {/* faint statue, like .hero__statue */}
      <Img
        name="Statue"
        src={staticFile("img/statue.webp")}
        style={{
          position: "absolute",
          left: 110,
          top: 40,
          width: 1700,
          opacity: 0.2,
          maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 72%)",
        }}
      />
      <DitherField mode="blobs" width={1920} height={1080} pixel={6} strength={0.95} style={{ position: "absolute" }} />

      {/* spikes ball dropping in from the top */}
      <div
        style={{
          position: "absolute",
          left: 460,
          top: -170,
          translate: `0px ${floaty(frame) + interpolate(frame, [0, 26], [-120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px`,
        }}
      >
        <DitherImage src={staticFile("img/spikes.webp")} width={1000} aspect={1800 / 876} start={0} duration={34} cell={10} seed="spk" />
      </div>

      {/* left cloud + gopher */}
      <div
        style={{
          position: "absolute",
          left: -70,
          top: 170,
          width: 620,
          translate: `${drift(frame, 11, 18) + interpolate(frame, [8, 34], [-260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px 0px`,
        }}
      >
        <Img
          name="Gopher"
          src={staticFile("img/gopher.webp")}
          style={{
            position: "absolute",
            left: "17%",
            top: "-16%",
            width: "21%",
            translate: `0px ${bob(frame) + interpolate(frame, [26, 40], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) })}px`,
          }}
        />
        <DitherImage src={staticFile("img/cloud-1.webp")} width={620} aspect={1400 / 593} start={8} duration={22} cell={8} seed="c1" style={{ position: "relative" }} />
      </div>

      {/* right cloud + steve */}
      <div
        style={{
          position: "absolute",
          right: -90,
          top: 690,
          width: 660,
          translate: `${-drift(frame, 13, 18) + interpolate(frame, [14, 40], [280, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px 0px`,
        }}
      >
        <Img
          name="Steve"
          src={staticFile("img/steve.webp")}
          style={{
            position: "absolute",
            left: "36%",
            top: "-24%",
            width: "19%",
            translate: `0px ${bob(frame, 1.4) + interpolate(frame, [32, 46], [70, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) })}px`,
          }}
        />
        <DitherImage src={staticFile("img/cloud-2.webp")} width={660} aspect={1400 / 566} start={14} duration={22} cell={8} seed="c2" style={{ position: "relative" }} />
      </div>
    </>
  );
};

export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      <Ambient />
      <Presents />

      {/* CATALYST wordmark dithering in */}
      <div style={{ position: "absolute", left: 385, top: 380, scale: interpolate(frame, [26, 60], [1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) }}>
        <DitherImage src={staticFile("img/wordmark.webp")} width={1150} aspect={1600 / 540} start={26} duration={30} cell={9} seed="wm" />
      </div>

      <Interactive.Div
        name="Tagline"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 790,
          textAlign: "center",
          fontFamily: F.serif,
          fontSize: 50,
          lineHeight: 1.2,
          color: C.ink,
          opacity: interpolate(frame, [54, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [54, 72], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
        }}
      >
        24 hours hackathon to solve the
        <br />
        biggest open source problems
      </Interactive.Div>

      {/* sound */}
      <Audio name="Spikes whoosh" src={staticFile("sfx/whoosh.wav")} volume={0.9} />
      <Audio name="Spikes dither" src={staticFile("sfx/dither.wav")} volume={0.5} />
      <Sequence name="Typing" from={16} durationInFrames={22} layout="none">
        {[0, 3, 6, 9, 12, 15, 18].map((f) => (
          <Audio key={f} src={staticFile("sfx/blip.wav")} from={f} volume={0.35} />
        ))}
      </Sequence>
      <Audio name="Clouds whip" src={staticFile("sfx/whip.wav")} from={10} volume={0.6} />
      <Audio name="Wordmark shutter" src={staticFile("sfx/shutter-modern.wav")} from={26} volume={0.8} />
      <Audio name="Wordmark dither" src={staticFile("sfx/dither.wav")} from={28} volume={0.55} />
      <Audio name="Wordmark lands" src={staticFile("sfx/ding.wav")} from={56} volume={0.35} />
    </Paper>
  );
};
