import React from "react";
import { Audio } from "@remotion/media";
import { Easing, Interactive, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DitherCover } from "../components/Dither";
import { Paper } from "../components/Paper";
import { Kicker, Laurel, PixelLock, PixelTrophy, Rays, ShadowBox } from "../components/Pixel";
import { C, CHECKER_BLUE, CHECKER_SIZE, F } from "../theme";

/*
 * Prize rule: ₹200 goes into the pool for every registered team (from 25 teams),
 * one more winner every 25 teams, pool split equally between the winners.
 *   25 → ₹5,000 (1 winner)   30 → ₹6,000 (all to the winner)
 *   50 → ₹5,000 × 2          70 → ₹7,000 × 2          75 → ₹5,000 × 3  …
 */
const PER_TEAM = 200;

// Beats of the scene (frames, relative to scene start)
const UNLOCK = 30; // 25 teams: first winner
const AT_30 = 44; // 30 teams: ₹6,000 to the winner
const SPLIT2 = 62; // 50 teams: 2 winners
const AT_70 = 78; // 70 teams: ₹7,000 each
const SPLIT3 = 90; // 75 teams: 3 winners
const EVENTS = [UNLOCK, AT_30, SPLIT2, AT_70, SPLIT3];

const teamsAt = (frame: number) =>
  Math.round(
    interpolate(
      frame,
      [14, UNLOCK, 36, AT_30, 48, SPLIT2, 66, AT_70, 82, SPLIT3],
      [0, 25, 25, 30, 30, 50, 50, 70, 70, 75],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  );
const winnersFor = (teams: number) => (teams >= 25 ? Math.floor(teams / 25) : 0);
const poolFor = (teams: number) => (teams >= 25 ? teams * PER_TEAM : 0);

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (frame: number, at: number, peak = 1.14) => interpolate(frame, [at, at + 4, at + 14], [1, peak, 1], clamp);
const lastEvent = (frame: number) => [...EVENTS].reverse().find((e) => frame >= e) ?? -100;

// ───────────────────────── left column ─────────────────────────
const Heading: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 130, top: 90 }}>
      <Kicker n="04" style={{ opacity: interpolate(frame, [0, 6], [0, 1], clamp) }}>
        prizes
      </Kicker>
      <Interactive.Div
        name="Prize pool title"
        style={{
          position: "relative",
          marginTop: 18,
          fontFamily: F.pixel,
          fontWeight: 600,
          fontSize: 170,
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          color: C.ink,
          width: "fit-content",
          translate: interpolate(frame, [2, 16], ["-80px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          opacity: interpolate(frame, [2, 10], [0, 1], clamp),
        }}
      >
        prize pool
        <Rays
          width={70}
          draw={interpolate(frame, [12, 24], [0, 1], clamp)}
          style={{ position: "absolute", right: -78, top: -52 }}
        />
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginTop: 14,
          width: 760,
          fontFamily: F.serif,
          fontSize: 40,
          color: C.ink,
          opacity: interpolate(frame, [8, 18], [0, 1], clamp),
        }}
      >
        <span>
          <b style={{ color: C.blue, fontWeight: 500 }}>₹200</b> added for every team
        </span>
        <span style={{ flex: 1, height: 3, background: C.blue }} />
      </div>
    </div>
  );
};

/** Coins burst out of the total whenever the pool changes shape (seeded, deterministic). */
const Burst: React.FC<{ at: number; seed: string; count: number }> = ({ at, seed, count }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 24) return null;
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = 9 + random(`${seed}v${i}`) * 13;
        const x = Math.cos(a) * v * t;
        const y = Math.sin(a) * v * t * 0.7 + 0.55 * t * t;
        const size = 14 + Math.round(random(`${seed}s${i}`) * 3) * 6;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: size,
              height: size,
              translate: `${Math.round(x / 6) * 6}px ${Math.round(y / 6) * 6}px`,
              background: i % 3 === 0 ? C.blue : undefined,
              backgroundImage: i % 3 === 0 ? undefined : CHECKER_BLUE,
              backgroundSize: CHECKER_SIZE,
              opacity: t > 18 ? 0 : 1,
            }}
          />
        );
      })}
    </>
  );
};

const Total: React.FC = () => {
  const frame = useCurrentFrame();
  const teams = teamsAt(frame);
  const pool = poolFor(teams);
  const unlocked = frame >= UNLOCK;
  const scale = pop(frame, lastEvent(frame));
  return (
    <div style={{ position: "absolute", left: 130, top: 470, width: 860, opacity: interpolate(frame, [12, 22], [0, 1], clamp) }}>
      <div style={{ fontFamily: F.tiny, fontSize: 30, textTransform: "uppercase", letterSpacing: "0.06em", color: C.ink }}>
        {unlocked ? "prize pool · grows with every team" : "prize pool · unlocks at 25 teams"}
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 28, marginTop: 10 }}>
        <div
          style={{
            position: "relative",
            translate: `0px ${frame >= SPLIT3 ? 6 * Math.sin((frame - SPLIT3) / 5) : 0}px`,
            scale: `${scale}`,
          }}
        >
          <Rays
            width={44}
            draw={interpolate(frame, [SPLIT3 + 4, SPLIT3 + 14], [0, 1], clamp)}
            style={{ position: "absolute", left: -40, top: -34, scale: "-1 1" }}
          />
          <Rays
            width={44}
            draw={interpolate(frame, [SPLIT3 + 4, SPLIT3 + 14], [0, 1], clamp)}
            style={{ position: "absolute", right: -40, top: -34 }}
          />
          <PixelTrophy width={124} star={frame >= SPLIT3} color={unlocked ? C.blue : "#b9b9c4"} />
        </div>
        <span
          style={{
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 140,
            lineHeight: 1,
            color: unlocked ? C.blue : "rgba(43,43,43,0.25)",
            fontVariantNumeric: "tabular-nums",
            scale: `${scale}`,
            transformOrigin: "left center",
          }}
        >
          {fmt(pool)}
        </span>
        <div style={{ position: "absolute", left: 470, top: 70 }}>
          <Burst at={UNLOCK} seed="b1" count={16} />
          <Burst at={SPLIT2} seed="b2" count={22} />
          <Burst at={SPLIT3} seed="b3" count={30} />
        </div>
      </div>
    </div>
  );
};

const Meter: React.FC = () => {
  const frame = useCurrentFrame();
  const teams = teamsAt(frame);
  const MAX = 100;
  const SEGMENTS = 20; // 5 teams each, so 25/50/75 land on segment edges
  const lit = Math.floor(teams / (MAX / SEGMENTS));
  const W = 780;
  const markers = [
    { at: 25, label: "1 winner", hit: UNLOCK },
    { at: 50, label: "2 winners", hit: SPLIT2 },
    { at: 75, label: "3 winners", hit: SPLIT3 },
    { at: 100, label: "+ more", hit: 9999 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 130,
        top: 760,
        width: W,
        opacity: interpolate(frame, [10, 18], [0, 1], clamp),
        translate: interpolate(frame, [10, 22], ["0px 40px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 50 }}>
        <span style={{ fontFamily: F.tiny, fontSize: 28, textTransform: "uppercase", letterSpacing: "0.06em", color: C.ink }}>
          teams registered
        </span>
        <span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 60, lineHeight: 1, color: C.blue, fontVariantNumeric: "tabular-nums" }}>
          {String(teams).padStart(2, "0")}
        </span>
      </div>
      <div style={{ position: "relative" }}>
        {markers.map((m) => (
          <div
            key={m.at}
            style={{
              position: "absolute",
              left: (m.at / MAX) * W - (m.at === MAX ? 64 : 0),
              top: -44,
              translate: m.at === MAX ? "0px 0px" : "-50% 0px",
              scale: interpolate(frame, [m.hit, m.hit + 4, m.hit + 12], [1, 1.3, 1], clamp),
            }}
          >
            <span
              style={{
                display: "block",
                padding: "2px 8px",
                background: frame >= m.hit ? C.blue : C.card,
                color: frame >= m.hit ? "#fff" : C.ink,
                border: `3px solid ${C.ink}`,
                fontFamily: F.tiny,
                fontSize: 18,
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
        <ShadowBox face={C.card} shadow="ink" offset={8} style={{ height: 64 }}>
          <div style={{ display: "flex", gap: 4, padding: 6, height: "100%", boxSizing: "border-box" }}>
            {new Array(SEGMENTS).fill(0).map((_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  background: i < lit ? C.blue : "transparent",
                }}
              />
            ))}
          </div>
        </ShadowBox>
        {/* ticks at the exact 25 / 50 / 75 thresholds */}
        {[25, 50, 75].map((t) => (
          <span
            key={t}
            style={{
              position: "absolute",
              left: (t / MAX) * W - 1,
              top: 6,
              width: 3,
              height: 52,
              background: teams >= t ? "#fff" : "rgba(43,43,43,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ───────────────────────── right column: live winners card ─────────────────────────
const LABELS: Record<number, string[]> = {
  1: ["Winner"],
  2: ["1st Prize", "Runner-up"],
  3: ["1st Prize", "2nd Prize", "3rd Prize"],
};
const ROW_IN = [UNLOCK, SPLIT2, SPLIT3]; // when row i joins (row 0 exists from the start, locked)
const ROW_H = 86;

const WinnerRow: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const teams = teamsAt(frame);
  const winners = winnersFor(teams);
  const each = winners ? poolFor(teams) / winners : 5000;
  const label = winners ? LABELS[Math.min(3, winners)][index] : "Winner";
  const at = ROW_IN[index];
  const flash = EVENTS.some((e) => frame >= e && frame < e + 6) && winners > 0;
  const height = index === 0 ? ROW_H : interpolate(frame, [at, at + 8], [0, ROW_H], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (height <= 0) return null;
  return (
    <div style={{ height, overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          columnGap: 22,
          height: 72,
          opacity: index === 0 ? 1 : interpolate(frame, [at, at + 6], [0, 1], clamp),
          translate: index === 0 ? "0px 0px" : interpolate(frame, [at, at + 10], ["60px 0px", "0px 0px"], { ...clamp, easing: Easing.out(Easing.back(1.6)) }),
        }}
      >
        <div style={{ translate: `0px ${interpolate(frame, [at, at + 4, at + 10], [0, -14, 0], clamp)}px` }}>
          <PixelTrophy width={58} star={index === 0 && frame >= SPLIT3} />
        </div>
        <span style={{ fontFamily: F.mono, fontWeight: 500, fontSize: 32, color: C.ink }}>{label}</span>
        <span
          style={{
            minWidth: 230,
            textAlign: "center",
            padding: "2px 22px",
            border: `3px solid ${C.blue}`,
            borderRadius: 12,
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 40,
            lineHeight: 1.3,
            fontVariantNumeric: "tabular-nums",
            background: flash ? C.blue : "transparent",
            color: flash ? "#fff" : C.blue,
            scale: `${pop(frame, lastEvent(frame), 1.08)}`,
          }}
        >
          {fmt(each)}
        </span>
      </div>
    </div>
  );
};

const WinnersCard: React.FC = () => {
  const frame = useCurrentFrame();
  const teams = teamsAt(frame);
  const winners = winnersFor(teams);
  const W = 780;
  const caption =
    winners === 0
      ? "Unlocks at 25 teams"
      : winners === 1
        ? "All the money goes to the winner"
        : `Split equally between ${winners} winners`;
  return (
    <div
      style={{
        position: "absolute",
        left: 1010,
        top: 150,
        width: W,
        opacity: interpolate(frame, [6, 14], [0, 1], clamp),
        translate: interpolate(frame, [6, 20], ["120px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
        scale: `${pop(frame, lastEvent(frame), 1.035)}`,
      }}
    >
      {/* the card, styled like .tier on the site */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "22px 40px 80px",
          boxSizing: "border-box",
          border: `3px solid ${C.blue}`,
          borderRadius: 30,
          background: "#fff",
          color: C.blue,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 22 }}>
          <Laurel width={32} />
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "block",
                minWidth: 300,
                padding: "4px 26px",
                background: C.blue,
                color: "#fff",
                borderRadius: 8,
                fontFamily: F.tiny,
                fontSize: 40,
                lineHeight: 1.25,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.max(25, teams)} Teams
            </span>
            <span style={{ display: "block", marginTop: 2, fontFamily: F.serif, fontSize: 26 }}>Participating</span>
          </div>
          <Laurel width={32} flip />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <WinnerRow index={0} />
          <WinnerRow index={1} />
          <WinnerRow index={2} />
        </div>

        <div
          style={{
            marginTop: 10,
            textAlign: "center",
            fontFamily: F.serifItalic,
            fontSize: 32,
            color: C.ink,
          }}
        >
          {caption}
        </div>

        {/* halftone footer, like .tier::after */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 60,
            backgroundImage: `radial-gradient(circle, ${C.blue} 2px, transparent 2.6px)`,
            backgroundSize: "9px 9px",
            maskImage: "linear-gradient(to top, #000, transparent)",
            WebkitMaskImage: "linear-gradient(to top, #000, transparent)",
          }}
        />
        {/* locked: a dither veil that dissolves cell by cell at 25 teams */}
        <DitherCover
          width={W}
          height={700}
          cover={interpolate(frame, [UNLOCK, UNLOCK + 14], [1, 0], clamp)}
          cell={26}
          color="rgba(243,243,240,0.9)"
          seed="win"
          style={{ position: "absolute", left: -3, top: -3 }}
        />
      </div>

      {/* lock badge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          opacity: interpolate(frame, [UNLOCK - 2, UNLOCK + 4], [1, 0], clamp),
          scale: interpolate(frame, [UNLOCK - 2, UNLOCK + 4], [1, 1.4], clamp),
        }}
      >
        <PixelLock width={84} />
        <ShadowBox face={C.ink} shadow="blue" offset={6} border={C.ink}>
          <span style={{ display: "block", padding: "8px 18px", fontFamily: F.tiny, fontSize: 26, color: "#fff", textTransform: "uppercase" }}>
            unlocks at 25 teams
          </span>
        </ShadowBox>
      </div>
    </div>
  );
};

const Note: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Prize note"
      style={{
        position: "absolute",
        left: 1010,
        right: 130,
        top: 900,
        textAlign: "center",
        fontFamily: F.serif,
        fontSize: 38,
        color: C.inkSoft,
        opacity: interpolate(frame, [SPLIT3 + 10, SPLIT3 + 20], [0, 1], clamp),
        translate: interpolate(frame, [SPLIT3 + 10, SPLIT3 + 22], ["0px 20px", "0px 0px"], clamp),
      }}
    >
      More teams → <span style={{ color: C.blue, fontFamily: F.serifItalic }}>bigger pool, more winners</span>.
    </Interactive.Div>
  );
};

export const Prizes: React.FC = () => {
  return (
    <Paper>
      <Heading />
      <Total />
      <Meter />
      <WinnersCard />
      <Note />

      <Audio name="Title whip" src={staticFile("sfx/whip.wav")} from={2} volume={0.7} />
      <Audio name="Bar in" src={staticFile("sfx/switch.wav")} from={10} volume={0.5} />
      <Sequence name="Team ticks 0-25" from={14} durationInFrames={UNLOCK - 14} layout="none">
        {[0, 4, 8, 12].map((f) => (
          <Audio key={f} src={staticFile("sfx/blip.wav")} from={f} volume={0.35} />
        ))}
      </Sequence>
      <Audio name="Unlock powerup" src={staticFile("sfx/powerup.wav")} from={UNLOCK} volume={0.5} />
      <Audio name="Unlock coin" src={staticFile("sfx/coin.wav")} from={UNLOCK + 5} volume={0.4} />
      <Sequence name="Team ticks 25-30" from={36} durationInFrames={AT_30 - 36} layout="none">
        {[0, 4].map((f) => (
          <Audio key={f} src={staticFile("sfx/blip.wav")} from={f} volume={0.35} />
        ))}
      </Sequence>
      <Audio name="6K coin" src={staticFile("sfx/coin.wav")} from={AT_30} volume={0.4} />
      <Sequence name="Team ticks 30-50" from={48} durationInFrames={SPLIT2 - 48} layout="none">
        {[0, 4, 8, 12].map((f) => (
          <Audio key={f} src={staticFile("sfx/blip.wav")} from={f} volume={0.35} />
        ))}
      </Sequence>
      <Audio name="Split to 2 whip" src={staticFile("sfx/whip.wav")} from={SPLIT2} volume={0.6} />
      <Audio name="Split to 2 powerup" src={staticFile("sfx/powerup.wav")} from={SPLIT2} volume={0.45} />
      <Sequence name="Team ticks 50-70" from={66} durationInFrames={AT_70 - 66} layout="none">
        {[0, 4, 8].map((f) => (
          <Audio key={f} src={staticFile("sfx/blip.wav")} from={f} volume={0.35} />
        ))}
      </Sequence>
      <Audio name="7K coin" src={staticFile("sfx/coin.wav")} from={AT_70} volume={0.4} />
      <Audio name="Tick 75" src={staticFile("sfx/blip.wav")} from={84} volume={0.35} />
      <Audio name="Split to 3 whip" src={staticFile("sfx/whip.wav")} from={SPLIT3} volume={0.6} />
      <Audio name="Split to 3 powerup" src={staticFile("sfx/powerup.wav")} from={SPLIT3} volume={0.5} />
      <Audio name="Split to 3 boom" src={staticFile("sfx/vine-boom.wav")} from={SPLIT3} volume={0.2} />
      <Audio name="Jackpot ding" src={staticFile("sfx/ding.wav")} from={SPLIT3 + 10} volume={0.28} />
    </Paper>
  );
};
