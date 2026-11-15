"""Generates the chiptune bed and 8-bit SFX used by the Catalyst intro.

Run: python -I scripts/synth.py   (writes into public/music and public/sfx)
120 BPM -> 1 beat = 0.5 s = 15 frames @ 30 fps, 1 bar = 2 s.
"""
import os
import wave

import numpy as np

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")


def write(path, sig):
    sig = np.clip(sig, -1, 1)
    data = (sig * 32767 * 0.95).astype(np.int16)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def t_of(dur):
    return np.arange(int(SR * dur)) / SR


def square(freq, dur, duty=0.5):
    t = t_of(dur)
    return np.where((t * freq) % 1 < duty, 1.0, -1.0)


def tri(freq, dur):
    t = t_of(dur)
    return 2 * np.abs(2 * ((t * freq) % 1) - 1) - 1


def env(n, a=0.004, d=0.0, s=1.0, r=0.03):
    e = np.ones(n) * s
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    nd = int(d * SR)
    if nd:
        e[na : na + nd] = np.linspace(1, s, nd)
    if nr and nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def note(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if j > i:
        buf[i:j] += sig[: j - i]


rng = np.random.default_rng(7)


def kick():
    t = t_of(0.28)
    f = 150 * np.exp(-t * 22) + 45
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 11)


def hat(dur=0.05):
    n = rng.standard_normal(int(SR * dur))
    n = np.diff(n, prepend=0)  # crude high-pass
    return n * np.exp(-t_of(dur) * 70) * 0.35


def snare():
    t = t_of(0.18)
    n = rng.standard_normal(len(t)) * np.exp(-t * 22)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    return (n * 0.55 + body * 0.5) * 0.8


# ───────────────────────── music bed ─────────────────────────
DUR = 20.0
BEAT = 0.5
bed = np.zeros(int(SR * DUR))
drums = np.zeros_like(bed)
bass = np.zeros_like(bed)
arp = np.zeros_like(bed)

# Am  F  C  G  (one bar each, repeating)
CHORDS = [(57, [57, 60, 64, 69]), (53, [53, 57, 60, 65]), (48, [55, 60, 64, 67]), (55, [55, 59, 62, 67])]

for bar in range(10):
    t0 = bar * 2.0
    root, tones = CHORDS[bar % 4]
    for b in range(4):
        bt = t0 + b * BEAT
        # break: 15.0 .. 16.0 s is the riser gap before the final scene
        in_break = 15.0 <= bt < 16.0
        if bt >= 2.0 and not in_break and bt < 19.5:
            add(drums, kick(), bt)
            if b in (1, 3) and bt >= 4.0:
                add(drums, snare(), bt)
            add(drums, hat(), bt + BEAT / 2)
            if bt >= 7.0:
                add(drums, hat(0.03) * 0.6, bt + BEAT / 4)
                add(drums, hat(0.03) * 0.6, bt + 3 * BEAT / 4)
        # bass: 8th notes, octave bounce
        for e in range(2):
            et = bt + e * BEAT / 2
            if et < 2.0 or in_break or et >= 19.5:
                continue
            m = root - 12 + (12 if e == 1 else 0)
            s = square(note(m), BEAT / 2 * 0.9, 0.25) * env(int(SR * BEAT / 2 * 0.9), r=0.02)
            add(bass, s * 0.22, et)
        # arp: 16th notes over chord tones (starts at 0 as the intro hook)
        for s16 in range(4):
            st = bt + s16 * BEAT / 4
            if in_break or st >= 19.5:
                continue
            m = tones[(b * 4 + s16) % 4] + 12
            dur = BEAT / 4 * 0.8
            sig = square(note(m), dur, 0.125) * env(int(SR * dur), r=0.03) * np.exp(-t_of(dur) * 9)
            add(arp, sig * 0.12, st)

# lead hook on the prize scene (11..15 s) and finale (16..19.5 s)
LEAD = [(11.0, 76, 0.5), (11.5, 79, 0.5), (12.0, 81, 1.0), (13.0, 79, 0.5), (13.5, 76, 0.5), (14.0, 74, 1.0),
        (16.0, 81, 0.75), (16.75, 79, 0.25), (17.0, 76, 0.5), (17.5, 79, 0.5), (18.0, 84, 1.5)]
lead = np.zeros_like(bed)
for st, m, d in LEAD:
    sig = square(note(m), d * 0.95, 0.5) * env(int(SR * d * 0.95), a=0.01, r=0.08)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 6 * t_of(d * 0.95))
    sig = np.sign(np.sin(2 * np.pi * np.cumsum(note(m) * vib) / SR))
    sig = sig * env(len(sig), a=0.01, r=0.08)
    add(lead, sig * 0.07, st)

# riser into the finale (15..16 s): rising noise + pitch sweep
rt = t_of(1.0)
riser = rng.standard_normal(len(rt)) * (rt ** 2) * 0.25
sweep = square(1, 1.0)  # placeholder shape
freqs = 200 + 1400 * rt ** 2
sweep = np.sign(np.sin(2 * np.pi * np.cumsum(freqs) / SR)) * rt * 0.08
add(bed, riser + sweep, 15.0)

bed += drums * 0.55 + bass + arp + lead
# fade the tail
fade = int(0.5 * SR)
bed[-fade:] *= np.linspace(1, 0, fade)
bed /= max(1e-6, np.max(np.abs(bed))) / 0.9
write(os.path.join(ROOT, "music", "bed.wav"), bed)

# ───────────────────────── 8-bit SFX ─────────────────────────
# coin: two-step square blip
c = np.concatenate([square(note(83), 0.07, 0.5), square(note(88), 0.32, 0.5)])
c *= env(len(c), r=0.2) * np.exp(-np.arange(len(c)) / SR * 4)
write(os.path.join(ROOT, "sfx", "coin.wav"), c * 0.6)

# blip: tiny tick for counters / cells appearing
b = square(note(96), 0.035, 0.5) * env(int(SR * 0.035), r=0.015)
write(os.path.join(ROOT, "sfx", "blip.wav"), b * 0.45)

# powerup: fast rising arpeggio (prize tier unlock)
pu = np.concatenate([square(note(m), 0.045, 0.25) for m in (72, 76, 79, 84, 88, 91, 96)])
pu *= env(len(pu), r=0.08)
write(os.path.join(ROOT, "sfx", "powerup.wav"), pu * 0.5)

# dither: crunchy bit-noise burst for the pixel dissolves
dn = t_of(0.35)
noise = np.sign(rng.standard_normal(len(dn)))
hold = 18
noise = np.repeat(noise[::hold], hold)[: len(dn)]
dz = noise * np.sin(np.pi * dn / 0.35) ** 2 * 0.3
write(os.path.join(ROOT, "sfx", "dither.wav"), dz)

print("ok")
