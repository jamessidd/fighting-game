import { roster } from "../js/characters.js";
import Sprite from "../js/classes.js";
import { CONFIG } from "../js/config.js";


const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); //c stands for context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});
const shop = new Sprite({
  position: {
    x: 620,
    y: 135,
  },
  imageSrc: "./img/shop.png",
  scale: 0.9,
  framesMax: 6,
});

// Game state machine.
const GameState = {
  SELECT: "select",
  PLAYING: "playing",
  PAUSED: "paused",
  ENDED: "ended",
};
let gameState = GameState.SELECT;

const displayText = document.querySelector("#displayText");
const playerStaminaEl = document.querySelector("#playerStamina");
const enemyStaminaEl = document.querySelector("#enemyStamina");
const p1ControlsEl = document.querySelector("#p1Controls");
const p2ControlsEl = document.querySelector("#p2Controls");

// Fighters and their spawn snapshot are created when a match starts
// (see startMatch), after both players have picked in the select screen.
let player;
let enemy;
let lastMatch = { p1: "FireKnight", p2: "WaterPrincess" };

// Per-player control schemes. Directions/jump/attack/special/roll match
// event.key; block matches event.code (to tell Left vs Right Shift apart).
const SCHEMES = {
  p1: {
    left: "a",
    right: "d",
    jump: "w",
    attack: "s",
    special: "f",
    roll: "e",
    blockCode: "ShiftLeft",
  },
  p2: {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "ArrowUp",
    attack: "ArrowDown",
    special: "/",
    roll: ".",
    blockCode: "ShiftRight",
  },
};

// Human-readable labels for the on-screen controls display.
const KEY_LABELS = {
  a: "A", d: "D", w: "W", s: "S", f: "F", e: "E", ".": ".", "/": "/",
  ArrowLeft: "\u2190", ArrowRight: "\u2192", ArrowUp: "\u2191", ArrowDown: "\u2193",
  ShiftLeft: "Left Shift", ShiftRight: "Right Shift",
};

//ANIMATE AT 60fps
let msPrev = window.performance.now();
const fps = CONFIG.fps;
const msPerFrame = 1000 / fps;
let frames = 0;
function animate() {
  window.requestAnimationFrame(animate);

  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  if (msPassed < msPerFrame) return;

  const excessTime = msPassed % msPerFrame;
  const deltaTime = msPassed / 1000;

  msPrev = msNow - excessTime;

  frames++;

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // SELECT (or before any match): animate the background behind the overlay.
  if (gameState === GameState.SELECT || !player || !enemy) {
    background.update();
    shop.update();
    c.fillStyle = `rgba(255,255,255,0.15)`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  // PAUSED: render a frozen frame (no physics, no animation advance).
  if (gameState === GameState.PAUSED) {
    background.draw();
    shop.draw();
    c.fillStyle = `rgba(255,255,255,0.15)`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    enemy.draw();
    return;
  }

  background.update();
  shop.update();
  c.fillStyle = `rgba(255,255,255,0.15)`;
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  // ENDED: keep animating so the death animation plays out, but stop
  // input-driven movement, special moves, and hit detection.
  if (gameState !== GameState.PLAYING) return;

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Per-fighter update (identical logic for both players, just mirrored input).
  updateMovement(player);
  updateMovement(enemy);

  faceOpponent(player, enemy);
  faceOpponent(enemy, player);

  updateBlock(player);
  updateBlock(enemy);

  // Roll movement: carry the dodge velocity while a roll is active.
  if (player.rolling) player.velocity.x = player.rollDir * CONFIG.roll.speed;
  if (enemy.rolling) enemy.velocity.x = enemy.rollDir * CONFIG.roll.speed;

  handleSpecial(player, enemy);
  handleSpecial(enemy, player);

  resolveHit(player, enemy, "#enemyHealth", deltaTime);
  resolveHit(enemy, player, "#playerHealth", deltaTime);

  // Update stamina bars.
  playerStaminaEl.style.width = player.stamina + "%";
  enemyStaminaEl.style.width = enemy.stamina + "%";

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId, onEnd: endMatch });
  }
}

// --- Per-fighter combat helpers (shared by both players) --------------------

// Horizontal movement + walk/idle/jump/fall animation from held input.
function updateMovement(f) {
  if (f.canMove && f.held.left && f.lastDir === "left") {
    const spd =
      f.currentAttack === undefined
        ? f.moveSpeed
        : f.moveSpeed * f.attackMoveSpeed;
    f.velocity.x = -spd;
    if (f.grounded) f.switchSprite("run");
  } else if (f.canMove && f.held.right && f.lastDir === "right") {
    const spd =
      f.currentAttack === undefined
        ? f.moveSpeed
        : f.moveSpeed * f.attackMoveSpeed;
    f.velocity.x = spd;
    if (f.grounded) f.switchSprite("run");
  } else if (f.canMove && f.grounded) {
    f.switchSprite("idle");
  }

  if (f.canMove && f.velocity.y < 0) f.switchSprite("jump");
  else if (f.canMove && f.velocity.y > CONFIG.fallThreshold) f.switchSprite("fall");
}

// Auto-turnaround: face the opponent while neutral (never mid-move).
function faceOpponent(f, opp) {
  if (f.canMove && f.currentAttack === undefined) {
    f.direction = f.position.x <= opp.position.x ? 1 : 0;
  }
}

// Guard stance: hold the block key while grounded + neutral to stand and defend.
function updateBlock(f) {
  f.isBlocking =
    f.held.block &&
    f.grounded &&
    f.canMove &&
    f.currentAttack === undefined &&
    !f.rolling;
  if (f.isBlocking) {
    f.velocity.x = 0;
    f.switchSprite("defend");
  }
}

// Character-specific special-move behaviour, dispatched on attack4 frame 1.
function handleSpecial(f, opp) {
  if (
    f.currentAttack === undefined ||
    f.currentAttack.id !== "attack4" ||
    f.framesCurrent !== 1
  )
    return;
  if (f.characterId === "WindAssassin")
    WASpecialMove(f, f.position.x, opp.position.x);
  else if (f.characterId === "GroundMonk") GMSpecialMove(f, opp);
}

// Resolve attacker's active hit against defender (block / dodge / takehit).
function resolveHit(attacker, defender, healthSel, dt) {
  if (frames % attacker.framesHold !== 0) return;
  if (!attacker.isAttacking || defender.invincible) return;
  if (!rectangularCollision({ rectangle1: attacker, rectangle2: defender }))
    return;

  attacker.isAttacking = false;
  attacker.stopAttack = attacker.currentAttack.id;

  if (defender.isBlocking && defender.stamina > 0) {
    defender.blockHit(attacker.currentAttack);
  } else {
    defender.direction = attacker.position.x >= defender.position.x ? 1 : 0;
    defender.takehit(attacker.currentAttack);
    knockback(defender, attacker, dt);
  }
  gsap.to(healthSel, { width: defender.health + "%" });
}

animate();

// --- Game state transitions -------------------------------------------------

// Called once when a match ends (KO or time out).
function endMatch() {
  gameState = GameState.ENDED;
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  displayText.innerHTML +=
    `<div style="font-size:11px;margin-top:18px;line-height:1.6;">Press R to rematch<br>C to change characters</div>`;
}

// Rematch with the same two characters (fresh instances).
function resetMatch() {
  startMatch(lastMatch.p1, lastMatch.p2);
}

// Create both fighters from the roster and begin a fresh match.
function startMatch(p1Id, p2Id) {
  lastMatch = { p1: p1Id, p2: p2Id };

  player = roster[p1Id].create();
  player.characterId = p1Id;
  player.position.x = 300;
  player.direction = 1;

  enemy = roster[p2Id].create();
  enemy.characterId = p2Id;
  enemy.position.x = canvas.width - 300;
  enemy.direction = 0;

  // Bind control schemes + fresh input state.
  player.controls = SCHEMES.p1;
  enemy.controls = SCHEMES.p2;
  player.held = { left: false, right: false, block: false };
  enemy.held = { left: false, right: false, block: false };
  player.lastDir = null;
  enemy.lastDir = null;

  gsap.set("#playerHealth", { width: "100%" });
  gsap.set("#enemyHealth", { width: "100%" });

  displayText.style.display = "none";
  displayText.innerHTML = "";
  characterSelectEl.style.display = "none";
  showControls();

  resetTimer();
  decreaseTimer(player, enemy, endMatch);

  gameState = GameState.PLAYING;
}

// Toggle pause/resume (only meaningful during an active match).
function togglePause() {
  if (gameState === GameState.PLAYING) {
    gameState = GameState.PAUSED;
    pauseTimer();
    displayText.style.display = "flex";
    displayText.innerHTML =
      `<div style="font-size:28px;text-shadow:3px 3px 0 #000;">Paused</div>` +
      `<div style="font-size:11px;margin-top:16px;">Press Esc to resume</div>`;
  } else if (gameState === GameState.PAUSED) {
    gameState = GameState.PLAYING;
    displayText.style.display = "none";
    displayText.innerHTML = "";
    resumeTimer(player, enemy, endMatch);
  }
}

// Edge-triggered action for a fighter (jump / attack / special / roll).
function edgeAction(f, opp, key) {
  if (!f.canMove) return;
  const ctrl = f.controls;
  if (key === ctrl.jump) {
    if (f.numOfJumps > 0) {
      f.velocity.y = CONFIG.jumpVelocity;
      f.numOfJumps -= 1;
    }
  } else if (key === ctrl.attack) {
    getAttack(f, opp);
  } else if (key === ctrl.special) {
    getAttack(f, opp, true);
  } else if (key === ctrl.roll) {
    rollFighter(f);
  }
}

window.addEventListener("keydown", (event) => {
  // Global controls (work regardless of fighter state).
  if (event.key === "r" || event.key === "R") {
    if (gameState === GameState.ENDED) resetMatch();
    return;
  }
  if (event.key === "c" || event.key === "C") {
    if (gameState === GameState.ENDED) openCharacterSelect();
    return;
  }
  if (event.key === "Escape" || event.key === "p" || event.key === "P") {
    if (gameState === GameState.PLAYING || gameState === GameState.PAUSED)
      togglePause();
    return;
  }
  // Ignore gameplay input while selecting, paused, or after the match ends.
  if (gameState !== GameState.PLAYING) return;

  // Held state (block by code; directions by key) for both fighters.
  for (const [f, opp] of [
    [player, enemy],
    [enemy, player],
  ]) {
    if (event.code === f.controls.blockCode) f.held.block = true;
    if (event.key === f.controls.left) {
      f.held.left = true;
      f.lastDir = "left";
    }
    if (event.key === f.controls.right) {
      f.held.right = true;
      f.lastDir = "right";
    }
    // Edge actions ignore auto-repeat so holding a key won't retrigger.
    if (!event.repeat) edgeAction(f, opp, event.key);
  }
});

window.addEventListener("keyup", (event) => {
  if (!player || !enemy) return;
  // Release held state (block by code, directions by key) for both fighters.
  for (const f of [player, enemy]) {
    if (event.code === f.controls.blockCode) f.held.block = false;
    if (event.key === f.controls.left) f.held.left = false;
    if (event.key === f.controls.right) f.held.right = false;
  }
});
























// --- Roll (dedicated key: forward dodge with i-frames + endlag) -------------

function rollFighter(fighter) {
  if (!fighter.grounded || !fighter.canMove || fighter.rolling) return;
  if (fighter.currentAttack !== undefined) return;
  if (fighter.stamina < CONFIG.roll.staminaCost) return;

  fighter.stamina -= CONFIG.roll.staminaCost;
  fighter.rolling = true;
  fighter.invincible = true; // i-frames only during the roll itself
  fighter.canMove = false;
  fighter.rollDir = fighter.direction === 1 ? 1 : -1; // forward only
  fighter.framesCurrent = 0;
  fighter.switchSprite("roll", true);

  const rollMs =
    fighter.sprites.roll.framesMax * CONFIG.moveFramesHold * (1000 / CONFIG.fps);
  // End of the roll: invincibility ends, movement stops -> vulnerable endlag.
  setTimeout(() => {
    fighter.rolling = false;
    fighter.invincible = false;
    fighter.velocity.x = 0;
    fighter.switchSprite("idle", true);
  }, rollMs);
  // Endlag over: fighter can act again.
  setTimeout(() => {
    fighter.canMove = true;
  }, rollMs + CONFIG.roll.endlagMs);
}

//extra special move logic

function WASpecialMove(fighter, startPos, fighter2Pos){

  fighter.canMove = false
  fighter.canMove = false
  setTimeout(() => {

    fighter.position.x = fighter2Pos
  }, 500);

  setTimeout(() => {
    fighter.position.x = startPos
    fighter.canMove = true
  }, 2300);

}

function GMSpecialMove(fighter, fighter2){
  fighter.canMove = false
  if(fighter.position.x < fighter2.position.x && fighter.direction === 1){
    if(fighter.position.x + 225 > fighter2.position.x){
      fighter2.canMove = false

      setTimeout(() => {
        fighter2.position.x = fighter.position.x + 85

        setTimeout(() => {
          fighter.canMove = true
          fighter2.canMove = true
          return
        }, 2200);

      }, 300);
    }
  }
  if(fighter.position.x > fighter2.position.x && fighter.direction === 0){
    if(fighter.position.x - 225 < fighter2.position.x + fighter2.width){
      fighter2.canMove = false

      setTimeout(() => {
        fighter2.position.x = fighter.position.x - 85
  
        setTimeout(() => {
          fighter.canMove = true
          fighter2.canMove = true
          return
        }, 2200);
  
      }, 300);
        
    }

  }
  setTimeout(() => {
    fighter.canMove = true
    return
  }, 2000);
}

// --- Character select screen -------------------------------------------------

const characterSelectEl = document.querySelector("#characterSelect");
const csPrompt = document.querySelector("#csPrompt");
const csGrid = document.querySelector("#csGrid");
const csFight = document.querySelector("#csFight");
const csReset = document.querySelector("#csReset");

// Current picks. p1 is chosen first, then p2.
let pick = { p1: null, p2: null };

// Draw a zoomed-in portrait of the sprite's upper body (idle frame 0) into the
// card. The sprite's opaque bounding box is detected via pixel alpha so the
// crop auto-adapts to each character (sprites have lots of transparent padding
// and sit at different positions in their frames). topFrac controls how much of
// the character's height (from the top) to show; it's tunable per character.
function drawPortrait(canvasEl, portrait) {
  const img = new Image();
  img.onload = () => {
    const frameW = Math.floor(img.width / portrait.framesMax);
    const frameH = img.height;

    // Render frame 0 to an offscreen canvas and scan for opaque pixels.
    const off = document.createElement("canvas");
    off.width = frameW;
    off.height = frameH;
    const octx = off.getContext("2d");
    octx.drawImage(img, 0, 0, frameW, frameH, 0, 0, frameW, frameH);

    const ctx = canvasEl.getContext("2d");
    canvasEl.width = 150;
    canvasEl.height = 150;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 150, 150);

    let minX = frameW, minY = frameH, maxX = 0, maxY = 0, found = false;
    try {
      const data = octx.getImageData(0, 0, frameW, frameH).data;
      for (let y = 0; y < frameH; y++) {
        for (let x = 0; x < frameW; x++) {
          if (data[(y * frameW + x) * 4 + 3] > 24) {
            found = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
    } catch (e) {
      found = false;
    }

    if (!found) {
      ctx.drawImage(img, 0, 0, frameW, frameH, 0, 0, 150, 150);
      return;
    }

    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const topFrac = portrait.topFrac ?? 0.6; // portion of character height to show
    // Square crop, focused on the top of the character (head + upper torso).
    let side = Math.max(bh * topFrac, bw * 0.9);
    side = Math.min(side, frameH, frameW);
    let sx = minX + bw / 2 - side / 2;
    let sy = minY - side * 0.06; // a little headroom above the sprite
    sx = Math.max(0, Math.min(sx, frameW - side));
    sy = Math.max(0, Math.min(sy, frameH - side));

    ctx.drawImage(img, sx, sy, side, side, 0, 0, 150, 150);
  };
  img.src = portrait.src;
}

function refreshCardStyles() {
  document.querySelectorAll(".cs-card").forEach((card) => {
    const id = card.dataset.id;
    card.classList.remove("sel-p1", "sel-p2", "sel-both");
    card.querySelector(".cs-badge.p1").style.display =
      pick.p1 === id ? "block" : "none";
    card.querySelector(".cs-badge.p2").style.display =
      pick.p2 === id ? "block" : "none";
    if (pick.p1 === id && pick.p2 === id) card.classList.add("sel-both");
    else if (pick.p1 === id) card.classList.add("sel-p1");
    else if (pick.p2 === id) card.classList.add("sel-p2");
  });

  if (!pick.p1) csPrompt.textContent = "PLAYER 1 - CHOOSE YOUR FIGHTER";
  else if (!pick.p2) csPrompt.textContent = "PLAYER 2 - CHOOSE YOUR FIGHTER";
  else csPrompt.textContent = `${roster[pick.p1].name}  VS  ${roster[pick.p2].name}`;

  csFight.disabled = !(pick.p1 && pick.p2);
}

function onCardClick(id) {
  if (!pick.p1) pick.p1 = id;
  else if (!pick.p2) pick.p2 = id;
  else pick = { p1: id, p2: null }; // both picked -> start a new P1 selection
  refreshCardStyles();
}

function buildCharacterSelect() {
  csGrid.innerHTML = "";
  Object.values(roster).forEach((ch) => {
    const card = document.createElement("div");
    card.className = "cs-card";
    card.dataset.id = ch.id;

    const cv = document.createElement("canvas");
    const b1 = document.createElement("div");
    b1.className = "cs-badge p1";
    b1.textContent = "P1";
    b1.style.display = "none";
    const b2 = document.createElement("div");
    b2.className = "cs-badge p2";
    b2.textContent = "P2";
    b2.style.display = "none";
    const name = document.createElement("div");
    name.className = "cs-name";
    name.textContent = ch.name;

    card.append(cv, b1, b2, name);
    card.addEventListener("click", () => onCardClick(ch.id));
    csGrid.appendChild(card);

    drawPortrait(cv, ch.portrait);
  });
  refreshCardStyles();
}

// Show the select screen (from initial load or from the end screen).
function openCharacterSelect() {
  pick = { p1: null, p2: null };
  gameState = GameState.SELECT;
  pauseTimer();
  displayText.style.display = "none";
  displayText.innerHTML = "";
  characterSelectEl.style.display = "flex";
  hideControls();
  refreshCardStyles();
}

// --- In-game controls display (bottom corners) ------------------------------

function controlsHtml(scheme, title) {
  const L = (k) => KEY_LABELS[k] || k;
  return (
    `<div class="ctrl-title">${title}</div>` +
    `<div>Move: ${L(scheme.left)} / ${L(scheme.right)}</div>` +
    `<div>Jump: ${L(scheme.jump)}</div>` +
    `<div>Attack: ${L(scheme.attack)}</div>` +
    `<div>Special: ${L(scheme.special)}</div>` +
    `<div>Block (hold): ${L(scheme.blockCode)}</div>` +
    `<div>Roll: ${L(scheme.roll)}</div>`
  );
}

function buildControlsDisplay() {
  p1ControlsEl.innerHTML = controlsHtml(SCHEMES.p1, "PLAYER 1");
  p2ControlsEl.innerHTML = controlsHtml(SCHEMES.p2, "PLAYER 2");
}

function showControls() {
  p1ControlsEl.style.display = "block";
  p2ControlsEl.style.display = "block";
}

function hideControls() {
  p1ControlsEl.style.display = "none";
  p2ControlsEl.style.display = "none";
}

csFight.addEventListener("click", () => {
  if (pick.p1 && pick.p2) startMatch(pick.p1, pick.p2);
});
csReset.addEventListener("click", () => {
  pick = { p1: null, p2: null };
  refreshCardStyles();
});

buildCharacterSelect();
buildControlsDisplay();
openCharacterSelect();
