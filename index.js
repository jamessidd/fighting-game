//WITH DOUBLE JUMP

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
    y: 0
  },
  imageSrc: './img/background.png'
})
const shop = new Sprite({
  position: {
    x: 620,
    y: 135
  },
  imageSrc: './img/shop.png',
  scale: 0.9,
  framesMax: 6
})

const player = new Fighter({
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
  imageSrc: './img/FireKnight/idle.png',
  framesMax: 8,
  scale: 0.85,
  offset: {
    x: 345,
    y: 222
  },
  sprites: {
    idle: {
      imageSrc: './img/FireKnight/idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/FireKnight/run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/FireKnight/jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/FireKnight/fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/FireKnight/attack1.png',
      framesMax: 11
    }
  }

})
console.log(player);
const enemy = new Fighter({
  position: {
    x: 750,
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
  imageSrc: './img/FireKnight/idle.png',
  framesMax: 8,
  scale: 0.85,
  offset: {
    x: 345,
    y: 222
  },
  sprites: {
    idle: {
      imageSrc: './img/FireKnight/idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/FireKnight/run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/FireKnight/jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/FireKnight/fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/FireKnight/attack1.png',
      framesMax: 11
    }
  }

})
console.log(enemy);
// const enemy = new Fighter({
//   position: {
//     x: canvas.width - 350,
//     y: 0,
//   },
//   velocity: {
//     x: 0,
//     y: 0,
//   },
//   colour: "blue",
//   offset: {
//     x: 0,
//     y: 0,
//   },
//   canbeReversed: true,
//   direction: 1,
// });
// console.log(enemy);

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

  background.update()
  shop.update()

  player.update();
  //enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement

  if (player.canMove && keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run')
  } else if (player.canMove && keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 5;
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')

  }

  //jump animation
  if (player.velocity.y < 0){
    player.switchSprite('jump')
  } else if (player.velocity.y > 0){
    player.switchSprite('fall')
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //collision detection in attackzone
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;

    enemy.health -= 10;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";

    console.log("player hits enemy");
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;

    player.health -= 10;
    document.querySelector("#playerHealth").style.width = player.health + "%";

    console.log("enemy hits player");
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  } 

}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastkey = "d";
      if (! player.isAttacking)
        player.direction = 1;
      break;
    case "a":
      keys.a.pressed = true;
      player.lastkey = "a";
      if (! player.isAttacking)
        player.direction = 0;

      break;
    case "w":
      if (player.canMove && player.numOfJumps > 0) {
        player.velocity.y = -10;
        player.numOfJumps -= 1;
      }
      break;
    case "s":
      player.attack();
      break;

    //enemyKeys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastkey = "ArrowRight";
      enemy.direction = 1;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = "ArrowLeft";
      enemy.direction = 0;

      break;
    case "ArrowUp":
      if (enemy.numOfJumps > 0) {
        enemy.velocity.y = -5;
        enemy.numOfJumps -= 1;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
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
  }

  //enemy Keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});