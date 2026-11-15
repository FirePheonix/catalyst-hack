import React from "react";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DitherCover } from "./components/Dither";
import { Finale } from "./scenes/Finale";
import { Hero } from "./scenes/Hero";
import { Hours } from "./scenes/Hours";
import { Prizes } from "./scenes/Prizes";
import { Timeline } from "./scenes/Timeline";

/** Blue Bayer cells flood the frame, the cut happens underneath, then they dissolve. */
const DitherWipeInner: React.FC<{ readonly seed: string }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = Math.min(1, frame / 17); // overlays below are 18 frames long
  const cover = p < 0.5 ? p * 2 : 2 - p * 2;
  return (
    <>
      <DitherCover width={width} height={height} cover={Math.min(1, cover * 1.08)} cell={30} bias="diagonal" seed={seed} />
      <Audio src={staticFile("sfx/dither.wav")} volume={0.55} />
      <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />
    </>
  );
};

const DitherWipe = Interactive.create({
  Component: DitherWipeInner,
  layout: "absolute-fill",
});

const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Audio
      name="Chiptune bed"
      src={staticFile("music/bed.wav")}
      volume={interpolate(frame, [0, 10, 585, 600], [0, 0.5, 0.5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}
    />
  );
};

export const CatalystIntro: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f3f0" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Hero" durationInFrames={4 * fps}>
          <Hero />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={18}>
          <DitherWipe name="Wipe to 24h" seed="w1" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="24 hours" durationInFrames={3 * fps}>
          <Hours />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={18}>
          <DitherWipe name="Wipe to timeline" seed="w2" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Timeline" durationInFrames={4 * fps}>
          <Timeline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={18}>
          <DitherWipe name="Wipe to prizes" seed="w3" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Prize pool" durationInFrames={5 * fps}>
          <Prizes />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={18}>
          <DitherWipe name="Wipe to register" seed="w4" />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="Register" durationInFrames={4 * fps}>
          <Finale />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <MusicBed />
    </AbsoluteFill>
  );
};
