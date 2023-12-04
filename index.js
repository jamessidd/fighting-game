// import {Sprite} from "../js/classes.js";
// import {Sprite} from "../js/classes.js";


const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); //c stands for context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.4;
const numOfJumps = 1;

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

const player = new Fighter({
  height: 120,
  width: 70,
  position: {
    x: 300,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  canbeReversed: true,
  direction: 1,
  imageSrc: "./img/FireKnight/idle.png",
  framesMax: 8,
  scale: 0.9,
  offset: {
    x: 120 + 241,
    y: 70 + 152,
  },
  sprites: {
    idle: {
      imageSrc: "./img/FireKnight/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/FireKnight/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/FireKnight/jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/FireKnight/fall.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./img/FireKnight/attack1.png",
      framesMax: 11,
    },
    attack2: {
      imageSrc: "./img/FireKnight/attack2.png",
      framesMax: 19,
    },
    attack3: {
      imageSrc: "./img/FireKnight/attack3.png",
      framesMax: 28,
    },
    attack4: {
      imageSrc: "./img/FireKnight/attack4.png",
      framesMax: 18,
    },
    attack5: {
      imageSrc: "./img/FireKnight/attack5.png",
      framesMax: 8,
    },
    takehit: {
      imageSrc: "./img/FireKnight/takehit.png",
      framesMax: 6,
    },
    death: {
      imageSrc: "./img/FireKnight/death.png",
      framesMax: 13,
    },
  },
  attacks: {
    attack1:{ id: 'attack1', offset: {x: 80, y: 0}, width: 100, height: 100, hitFrame: 5, damage: 5},
    attack2:{ id: 'attack2', offset: {x: -95, y: 0}, width: 310, height: 100, hitFrame: 12, damage: 5},
    attack3:{ id: 'attack3', offset: {x: 140, y: -30}, width: 130, height: 130, hitFrame: 23, damage: 5},
    attack4:{ id: 'attack4', offset: {x: 80, y: 0}, width: 50, height: 50, hitFrame: 14, damage: 5},
    attack5:{ id: 'attack5', offset: {x: 80, y: 0}, width: 200, height: 50, hitFrame: 4, damage: 5}

  }
  
});
console.log(player);

//enemy
const enemy = new Fighter({
  height: 95,
  width: 45,
  position: {
    x: canvas.width - 350,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  canbeReversed: true,
  direction: 1,
  imageSrc: "./img/WaterPrincess/idle.png",
  framesMax: 8,
  scale: 0.9,
  offset: {
    x: 80 + 241 + 43,
    y: 45 + 152 + 50,
  },
  sprites: {
    idle: {
      imageSrc: "./img/WaterPrincess/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/WaterPrincess/surf.png",
      framesMax: 9,
    },
    jump: {
      imageSrc: "./img/WaterPrincess/jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/WaterPrincess/fall.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./img/WaterPrincess/attack1.png",
      framesMax: 7,
    },
    attack2: {
      imageSrc: "./img/WaterPrincess/attack2.png",
      framesMax: 21,
    },
    attack3: {
      imageSrc: "./img/WaterPrincess/attack3.png",
      framesMax: 27,
    },
    attack4: {
      imageSrc: "./img/WaterPrincess/attack4.png",
      framesMax: 32,
    },
    attack5: {
      imageSrc: "./img/WaterPrincess/attack5.png",
      framesMax: 8,
    },
    takehit: {
      imageSrc: "./img/WaterPrincess/takehit.png",
      framesMax: 6,
    },
    death: {
      imageSrc: "./img/WaterPrincess/death.png",
      framesMax: 16,
    },
  },
  attacks: {
    attack1:{ id: 'attack1', offset: {x: 80, y: 10}, width: 100, height: 45, hitFrame: 3, damage: 5},
    attack2:{ id: 'attack2', offset: {x: 0, y: 35}, width: 215, height: 50, hitFrame: 14, damage: 5},
    attack3:{ id: 'attack3', offset: {x: 80, y: 0}, width: 200, height: 100, hitFrame: 21, damage: 5},
    attack4:{ id: 'attack4', offset: {x: 80, y: 0}, width: 50, height: 50, hitFrame: 14, damage: 5},
    attack5:{ id: 'attack5', offset: {x: 80, y: 0}, width: 200, height: 50, hitFrame: 3, damage: 5}

  }
  
});
console.log(enemy);

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

decreaseTimer();

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
  msPrev = msNow - excessTime;

  frames++;
  // console.log(msPassed, msPerFrame, msNow, excessTime)

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = `rgba(255,255,255,0.15)`;
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  console.log(player.sprites.attack1.image.c)
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  if(!player.isAttacking){
    if (player.position.x > enemy.position.x){
      player.direction = 0
    } else {
      player.direction = 1
    }
  }
  if(!enemy.isAttacking){
    if (enemy.position.x > player.position.x && !enemy.isAttacking){
      enemy.direction = 0
    } else {
      enemy.direction = 1
    }
  }

  //player movement
  if (player.canMove && keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -5;
    if (player.grounded) player.switchSprite("run");
  } else if (player.canMove && keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 5;
    if (player.grounded) player.switchSprite("run");
  } else if (player.grounded) {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 2) {
    player.switchSprite("fall");
  }
  //enemy movement
  if (
    enemy.canMove &&
    keys.ArrowLeft.pressed &&
    enemy.lastkey === "ArrowLeft"
  ) {
    enemy.velocity.x = -5;
    if (enemy.grounded) enemy.switchSprite("run");
  } else if (
    enemy.canMove &&
    keys.ArrowRight.pressed &&
    enemy.lastkey === "ArrowRight"
  ) {
    enemy.velocity.x = 5;
    if (enemy.grounded) enemy.switchSprite("run");
  } else if (enemy.grounded) {
    enemy.switchSprite("idle");
  }

  //jump animation enemy
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 2) {
    enemy.switchSprite("fall");
  }




  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    player.stopAttack = player.currentAttack.id
    enemy.takehit(player.currentAttack);
    
    //when enemy is hit make it face the player

    
    knockback(enemy, player)
    // document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    gsap.to(`#enemyHealth`, {
      width: enemy.health + "%",
    });
    console.log("player hits enemy");
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    enemy.stopAttack = enemy.currentAttack.id

    player.takehit(enemy.currentAttack);

    //when player is hit make it face the player

    knockback(player, enemy)

    gsap.to(`#playerHealth`, {
      width: player.health + "%",
    });
    console.log("enemy hits player");
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

let fKeyPressed = false
let downKeyPressed = false


window.addEventListener("keydown", (event) => {
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
      case "f":
        if (!fKeyPressed) {
          fKeyPressed = true;
          getAttack(player);
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
          getAttack(enemy);
        }
        break;

        

    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
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
  }
});
