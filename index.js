import { roster } from "../js/characters.js";
import Sprite from "../js/classes.js";


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

// Fighters and their spawn snapshot are created when a match starts
// (see startMatch), after both players have picked in the select screen.
let player;
let enemy;
let lastMatch = { p1: "FireKnight", p2: "WaterPrincess" };

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

//ANIMATE AT 60fps
let msPrev = window.performance.now();
const fps = 60;
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

  //player movement

  if (player.canMove && keys.a.pressed && player.lastkey === "a") {
    if (player.currentAttack === undefined) {
      player.velocity.x = -player.moveSpeed;
      if(player.currentAttack === undefined)
        player.direction = 0;

    } else {
      player.velocity.x = -player.moveSpeed * player.attackMoveSpeed;
      if(player.currentAttack === undefined)
        player.direction = 0;

    }

    if (player.grounded) player.switchSprite("run");
  } else if (player.canMove && keys.d.pressed && player.lastkey === "d") {
    if (player.currentAttack === undefined) {
      player.velocity.x = player.moveSpeed;
      if(player.currentAttack === undefined)
        player.direction = 1;

    } else {
      player.velocity.x = player.moveSpeed * player.attackMoveSpeed;
      if(player.currentAttack === undefined)
        player.direction = 1;

    }
    if (player.grounded) player.switchSprite("run");
  } else if (player.canMove && player.grounded) {
    player.switchSprite("idle");
  }

  if (player.canMove && player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.canMove && player.velocity.y > 2) {
    player.switchSprite("fall");
  }
  //enemy movement
  if (
    enemy.canMove &&
    keys.ArrowLeft.pressed &&
    enemy.lastkey === "ArrowLeft"
  ) {
    if (enemy.currentAttack === undefined) {
      enemy.velocity.x = -enemy.moveSpeed;
      if(enemy.currentAttack === undefined)
        enemy.direction = 0;

    } else {
      enemy.velocity.x = -enemy.moveSpeed * enemy.attackMoveSpeed;
      if(enemy.currentAttack === undefined)
        enemy.direction = 0;

    }
    if (enemy.grounded) enemy.switchSprite("run");
  } else if (
    enemy.canMove &&
    keys.ArrowRight.pressed &&
    enemy.lastkey === "ArrowRight"
  ) {
    if (enemy.currentAttack === undefined) {
      enemy.velocity.x = enemy.moveSpeed;
      if(enemy.currentAttack === undefined)
        enemy.direction = 1;

    } else {
      enemy.velocity.x = enemy.moveSpeed * enemy.attackMoveSpeed;
      if(enemy.currentAttack === undefined)
        enemy.direction = 1;

    }
    if (enemy.grounded) enemy.switchSprite("run");
  } else if (enemy.canMove && enemy.grounded) {
    enemy.switchSprite("idle");
  }

  //jump animation enemy
  if (enemy.canMove && enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.canMove && enemy.velocity.y > 2) {
    enemy.switchSprite("fall");
  }

  // Auto-turnaround: face the opponent while neutral. Skipped mid-attack,
  // hit-stun, death, or specials (canMove is false / an attack is active), so
  // a fighter never flips in the middle of a move.
  if (player.canMove && player.currentAttack === undefined) {
    player.direction = player.position.x <= enemy.position.x ? 1 : 0;
  }
  if (enemy.canMove && enemy.currentAttack === undefined) {
    enemy.direction = enemy.position.x <= player.position.x ? 1 : 0;
  }

  // Guard stance: holding the dedicated block key while grounded and neutral.
  player.isBlocking =
    p1BlockHeld &&
    player.grounded &&
    player.canMove &&
    player.currentAttack === undefined &&
    !player.rolling;
  enemy.isBlocking =
    p2BlockHeld &&
    enemy.grounded &&
    enemy.canMove &&
    enemy.currentAttack === undefined &&
    !enemy.rolling;

  // While guarding, stand still and hold the defend pose.
  if (player.isBlocking) {
    player.velocity.x = 0;
    player.switchSprite("defend");
  }
  if (enemy.isBlocking) {
    enemy.velocity.x = 0;
    enemy.switchSprite("defend");
  }

  // Roll movement: carry the dodge velocity while a roll is active.
  if (player.rolling) player.velocity.x = player.rollDir * ROLL_SPEED;
  if (enemy.rolling) enemy.velocity.x = enemy.rollDir * ROLL_SPEED;

  //windAssassinSpecial
  if(player.currentAttack !== undefined){
    if(player.currentAttack.id === 'attack4' && player.characterId === 'WindAssassin' && (player.framesCurrent === 1))
      WASpecialMove(player, player.position.x ,enemy.position.x)
      
  }
  if(enemy.currentAttack !== undefined){
    if(enemy.currentAttack.id === 'attack4' && enemy.characterId === 'WindAssassin' && (enemy.framesCurrent === 1))
      WASpecialMove(enemy, enemy.position.x ,player.position.x)
      
  }

  //groundMonkSpecial
  if(player.currentAttack !== undefined){
    if(player.currentAttack.id === 'attack4' && player.characterId === 'GroundMonk' && (player.framesCurrent === 1))
      GMSpecialMove(player, enemy)
      
  }
  if(enemy.currentAttack !== undefined){
    if(enemy.currentAttack.id === 'attack4' && enemy.characterId === 'GroundMonk' && (enemy.framesCurrent === 1))
      GMSpecialMove(enemy, player)
      
  }

  if (frames % player.framesHold === 0){

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
      }) &&
      player.isAttacking &&
      !enemy.invincible
    ) {
      player.isAttacking = false;
      player.stopAttack = player.currentAttack.id;

      if (enemy.isBlocking && enemy.stamina > 0) {
        enemy.blockHit(player.currentAttack);
      } else {
        enemy.direction = player.position.x >= enemy.position.x ? 1 : 0;
        enemy.takehit(player.currentAttack);
        knockback(enemy, player, deltaTime);
      }
      gsap.to(`#enemyHealth`, {
        width: enemy.health + "%",
      });
    }

  }
  
  if (frames % enemy.framesHold === 0){
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
      }) &&
      enemy.isAttacking &&
      !player.invincible
    ) {
      enemy.isAttacking = false;
      enemy.stopAttack = enemy.currentAttack.id;

      if (player.isBlocking && player.stamina > 0) {
        player.blockHit(enemy.currentAttack);
      } else {
        player.direction = enemy.position.x >= player.position.x ? 1 : 0;
        player.takehit(enemy.currentAttack);
        knockback(player, enemy, deltaTime);
      }

      gsap.to(`#playerHealth`, {
        width: player.health + "%",
      });
    }
  }

  // Update stamina bars.
  playerStaminaEl.style.width = player.stamina + "%";
  enemyStaminaEl.style.width = enemy.stamina + "%";

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId, onEnd: endMatch });
  }
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

  gsap.set("#playerHealth", { width: "100%" });
  gsap.set("#enemyHealth", { width: "100%" });

  displayText.style.display = "none";
  displayText.innerHTML = "";
  characterSelectEl.style.display = "none";

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

let sKeyPressed = false;
let fKeyPressed = false;

let downKeyPressed = false;
let slashKeyPressed = false;

// Hold-to-block state (Left Shift = P1, Right Shift = P2).
let p1BlockHeld = false;
let p2BlockHeld = false;


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

  // Hold-to-block (distinguish left vs right Shift via event.code).
  if (event.code === "ShiftLeft") p1BlockHeld = true;
  if (event.code === "ShiftRight") p2BlockHeld = true;

  // Roll (dedicated key, forward dodge). Ignore held-key auto-repeat.
  if (!event.repeat) {
    if (event.key === "e" || event.key === "E") rollFighter(player);
    if (event.key === ".") rollFighter(enemy);
  }

  if (player.canMove) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastkey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastkey = "a";

        break;
      case "w":
        if (player.canMove && player.numOfJumps > 0) {
          player.velocity.y = -12;
          player.numOfJumps -= 1;
        }
        break;
      case "s":
        if (!sKeyPressed) {
          sKeyPressed = true;
          getAttack(player,enemy);
        }
        break;
      case "f":
        if (!fKeyPressed) {
          fKeyPressed = true;
          getAttack(player,enemy, true);
        }
        break;
      
    }
  }
  if (enemy.canMove) {
    switch (event.key) {
      //enemyKeys
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastkey = "ArrowRight";

        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastkey = "ArrowLeft";

        break;
      case "ArrowUp":
        if (enemy.canMove && enemy.numOfJumps > 0) {
          enemy.velocity.y = -12;
          enemy.numOfJumps -= 1;
        }
        break;
      case "ArrowDown":
        if (!downKeyPressed) {
          downKeyPressed = true;
          getAttack(enemy,player);
        }
        break;
      case "/":
        if (!slashKeyPressed) {
          slashKeyPressed = true;
          getAttack(enemy,player,true);
        }
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  // Release hold-to-block.
  if (event.code === "ShiftLeft") p1BlockHeld = false;
  if (event.code === "ShiftRight") p2BlockHeld = false;

  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      sKeyPressed = false;
      break;
    case "f":
      fKeyPressed = false;
      break;
  }

  //enemy Keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowDown":
      downKeyPressed = false;
      break;
    case "/":
      slashKeyPressed = false;
      break;
  }
});
























// --- Roll (dedicated key: forward dodge with i-frames + endlag) -------------

const ROLL_STAMINA_COST = 25;
const ROLL_SPEED = 9;
const ROLL_ENDLAG_MS = 130; // vulnerable recovery after the roll

function rollFighter(fighter) {
  if (!fighter.grounded || !fighter.canMove || fighter.rolling) return;
  if (fighter.currentAttack !== undefined) return;
  if (fighter.stamina < ROLL_STAMINA_COST) return;

  fighter.stamina -= ROLL_STAMINA_COST;
  fighter.rolling = true;
  fighter.invincible = true; // i-frames only during the roll itself
  fighter.canMove = false;
  fighter.rollDir = fighter.direction === 1 ? 1 : -1; // forward only
  fighter.framesCurrent = 0;
  fighter.switchSprite("roll", true);

  const rollMs = fighter.sprites.roll.framesMax * 4 * (1000 / 60);
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
  }, rollMs + ROLL_ENDLAG_MS);
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
  refreshCardStyles();
}

csFight.addEventListener("click", () => {
  if (pick.p1 && pick.p2) startMatch(pick.p1, pick.p2);
});
csReset.addEventListener("click", () => {
  pick = { p1: null, p2: null };
  refreshCardStyles();
});

buildCharacterSelect();
openCharacterSelect();
