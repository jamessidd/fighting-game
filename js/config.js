// Central gameplay tuning. Imported by index.js and classes.js (ES modules);
// also attached to window so the classic-script utils.js can read it.

export const CONFIG = {
  fps: 60,

  // Physics
  gravity: 0.4,
  floorOffset: 96, // px from the bottom of the canvas to the ground line
  jumpVelocity: -12,
  fallThreshold: 2, // downward velocity at which the "fall" sprite kicks in

  // Animation
  moveFramesHold: 4, // ticks between frames for most animations
  attack4FramesHold: 6, // slower cadence for the heavy special

  // Combat
  hitstunMs: 600, // how long takehit locks movement
  knockbackMultiplier: 50,

  // Stamina
  stamina: {
    start: 20,
    max: 100,
    regenPerFrame: 100 / (15 * 60), // ~15s to fully refill at 60fps
  },

  // Costs / tuning for the resource-gated actions
  special: { staminaCost: 50 },
  roll: { staminaCost: 25, speed: 9, endlagMs: 130 },
  block: { damageMultiplier: 0.25, staminaCost: 20 },

  // Round
  timerStart: 101,
};

if (typeof window !== "undefined") window.CONFIG = CONFIG;
