import * as characters from "../js/characters.js";
import Sprite from "../js/classes.js";
import Fighter from "../js/classes.js";


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

const player = characters.FireKnight;

player.position.x = 300

console.log(player);


//enemy
const enemy = characters.WaterPrincess;

enemy.position.x = canvas.width-300
enemy.direction = 0


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
  const deltaTime = msPassed / 1000;

  msPrev = msNow - excessTime;

  frames++;

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = `rgba(255,255,255,0.15)`;
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // if (!player.isAttacking) {
  //   if (player.position.x > enemy.position.x) {
  //     player.direction = 0;
  //   } else {
  //     player.direction = 1;
  //   }
  // }
  // if (!enemy.isAttacking) {
  //   if (enemy.position.x > player.position.x && !enemy.isAttacking) {
  //     enemy.direction = 0;
  //   } else {
  //     enemy.direction = 1;
  //   }
  // }

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
  } else if (enemy.grounded) {
    enemy.switchSprite("idle");
  }

  //jump animation enemy
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 2) {
    enemy.switchSprite("fall");
  }


  //windAssassinSpecial
  if(player.currentAttack !== undefined){
    if(player.currentAttack.id === 'attack4' && player.sprites.attack4.imageSrc === './img/WindAssassin/attack4.png' && (player.framesCurrent === 1))
      WASpecialMove(player, player.position.x ,enemy.position.x)
      
  }
  if(enemy.currentAttack !== undefined){
    if(enemy.currentAttack.id === 'attack4' && enemy.sprites.attack4.imageSrc === './img/WindAssassin/attack4.png' && (enemy.framesCurrent === 1))
      WASpecialMove(enemy, enemy.position.x ,player.position.x)
      
  }

  //groundMonkSpecial
  if(player.currentAttack !== undefined){
    if(player.currentAttack.id === 'attack4' && player.sprites.attack4.imageSrc === './img/GroundMonk/attack4.png' && (player.framesCurrent === 1))
      GMSpecialMove(player, enemy)
      
  }
  if(enemy.currentAttack !== undefined){
    if(enemy.currentAttack.id === 'attack4' && enemy.sprites.attack4.imageSrc === './img/GroundMonk/attack4.png' && (enemy.framesCurrent === 1))
      GMSpecialMove(enemy, player)
      
  }

  if (frames % player.framesHold === 0){

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
      }) &&
      player.isAttacking
    ) {
      // player.isAttacking = false;
      // player.stopAttack = player.currentAttack.id;
  
      enemy.direction = player.position.x >= enemy.position.x ? 1 : 0;
  
      enemy.takehit(player.currentAttack);
  
  
      knockback(enemy, player, deltaTime);
      // document.querySelector("#enemyHealth").style.width = enemy.health + "%";
      gsap.to(`#enemyHealth`, {
        width: enemy.health + "%",
      });
      console.log("player hits enemy");
    }

  }
  
  if (frames % enemy.framesHold === 0){
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
      }) &&
      enemy.isAttacking
    ) {
      enemy.isAttacking = false;
      enemy.stopAttack = enemy.currentAttack.id;
  
      player.direction = enemy.position.x >= player.position.x ? 1 : 0;
  
  
      player.takehit(enemy.currentAttack);
  
      //when player is hit make it face the player
  
      knockback(player, enemy, deltaTime);
  
      gsap.to(`#playerHealth`, {
        width: player.health + "%",
      });
      console.log("enemy hits player");
    }
  }
  
  console.log(player.currentAttack)
  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

let sKeyPressed = false;
let fKeyPressed = false;

let downKeyPressed = false;
let slashKeyPressed = false;


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
























//extra special move logic

function WASpecialMove(fighter, startPos, fighter2Pos){

  fighter.canMove = false
  fighter.canMove = false
  setTimeout(() => {

    fighter.position.x = fighter2Pos
  }, 500);

  setTimeout(() => {
    console.log('fin')

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
      
      console.log('colide')
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
