// Self-contained audio: all SFX and background music are synthesized with the
// Web Audio API, so there are no binary asset files to ship. The AudioContext
// is created lazily and must be resumed from a user gesture (the title Start
// button calls audio.resume()).

let ctx = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let noiseBuffer = null;
let muted = false;

let musicOn = false;
let musicTimer = null;
let step = 0;
let nextNoteTime = 0;

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();

  masterGain = ctx.createGain();
  masterGain.gain.value = muted ? 0 : 0.9;
  masterGain.connect(ctx.destination);

  musicGain = ctx.createGain();
  musicGain.gain.value = 0.18;
  musicGain.connect(masterGain);

  sfxGain = ctx.createGain();
  sfxGain.gain.value = 0.6;
  sfxGain.connect(masterGain);

  // One second of white noise, reused for whooshes/impacts.
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  return ctx;
}

// A single enveloped oscillator note.
function tone(dest, { freq, type = "square", dur = 0.1, vol = 0.3, slideTo = null, at = 0 }) {
  ensureCtx();
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(dest);
  o.start(t);
  o.stop(t + dur + 0.02);
}

// A filtered noise burst.
function noise({ dur = 0.15, vol = 0.3, filterFreq = 1000, filterType = "lowpass", sweepTo = null }) {
  ensureCtx();
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const f = ctx.createBiquadFilter();
  f.type = filterType;
  f.frequency.setValueAtTime(filterFreq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(sfxGain);
  src.start(t);
  src.stop(t + dur + 0.02);
}

// --- Background music: a looping A-minor-pentatonic pattern ------------------
// null = rest. Melody is sparse; bass keeps a steady pulse.
const A2 = 110, C3 = 130.81, D3 = 146.83, E3 = 164.81, G3 = 196;
const A3 = 220, C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392, A4 = 440;
const MELODY = [A4, null, E4, G4, A4, null, G4, E4, D4, null, E4, D4, C4, null, A3, null];
const BASS   = [A2, A2, E3, E3, D3, D3, C3, C3, A2, A2, E3, E3, G3, G3, A2, E3];
const STEP_DUR = 0.16; // seconds per step

function scheduleMusic() {
  while (nextNoteTime < ctx.currentTime + 0.25) {
    const m = MELODY[step % MELODY.length];
    const b = BASS[step % BASS.length];
    const at = nextNoteTime - ctx.currentTime;
    if (m) tone(musicGain, { freq: m, type: "square", dur: STEP_DUR * 0.85, vol: 0.14, at });
    if (b) tone(musicGain, { freq: b, type: "triangle", dur: STEP_DUR * 0.9, vol: 0.22, at });
    nextNoteTime += STEP_DUR;
    step++;
  }
}

export const audio = {
  resume() {
    ensureCtx();
    if (ctx.state === "suspended") ctx.resume();
  },
  toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.9;
    return muted;
  },
  isMuted() {
    return muted;
  },
  startMusic() {
    ensureCtx();
    if (musicOn) return;
    musicOn = true;
    step = 0;
    nextNoteTime = ctx.currentTime + 0.1;
    musicTimer = setInterval(scheduleMusic, 40);
  },
  stopMusic() {
    musicOn = false;
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
  },

  // --- SFX ---
  attack() {
    noise({ dur: 0.12, vol: 0.16, filterFreq: 1400, filterType: "bandpass", sweepTo: 500 });
  },
  hit() {
    tone(sfxGain, { freq: 170, type: "square", dur: 0.14, vol: 0.32, slideTo: 70 });
    noise({ dur: 0.1, vol: 0.28, filterFreq: 900, filterType: "lowpass" });
  },
  block() {
    tone(sfxGain, { freq: 950, type: "square", dur: 0.08, vol: 0.22, slideTo: 620 });
    noise({ dur: 0.05, vol: 0.15, filterFreq: 3000, filterType: "highpass" });
  },
  jump() {
    tone(sfxGain, { freq: 300, type: "square", dur: 0.14, vol: 0.2, slideTo: 620 });
  },
  roll() {
    noise({ dur: 0.28, vol: 0.22, filterFreq: 300, filterType: "lowpass", sweepTo: 1400 });
  },
  special() {
    tone(sfxGain, { freq: 330, type: "sawtooth", dur: 0.1, vol: 0.18, at: 0 });
    tone(sfxGain, { freq: 440, type: "sawtooth", dur: 0.1, vol: 0.18, at: 0.06 });
    tone(sfxGain, { freq: 660, type: "sawtooth", dur: 0.16, vol: 0.2, at: 0.12 });
    noise({ dur: 0.25, vol: 0.14, filterFreq: 800, filterType: "bandpass", sweepTo: 2500 });
  },
  ko() {
    tone(sfxGain, { freq: 400, type: "square", dur: 0.5, vol: 0.28, slideTo: 60 });
  },
  ui() {
    tone(sfxGain, { freq: 660, type: "square", dur: 0.07, vol: 0.2 });
  },
};
