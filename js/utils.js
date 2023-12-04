


function rectangularCollision({ rectangle1, rectangle2 }) {
  if (rectangle1.currentAttack === undefined)
    return false
  
  // console.log(rectangle1.image)

  //player striking player on right detection
  dir0 =
    rectangle1.currentAttack.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.currentAttack.position.x + rectangle1.currentAttack.width >=
      rectangle2.position.x &&
    rectangle1.currentAttack.position.y + rectangle1.currentAttack.height >=
      rectangle2.position.y &&
    rectangle1.currentAttack.position.y <=
      rectangle2.position.y + rectangle2.height;

  //player striking player on left detection
  dir1 =
    rectangle1.currentAttack.position.x + rectangle1.currentAttack.width >=
      rectangle2.position.x &&
    rectangle1.currentAttack.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.currentAttack.position.y + rectangle1.currentAttack.height >=
      rectangle2.position.y &&
    rectangle1.currentAttack.position.y <=
      rectangle2.position.y + rectangle2.height;

  if (rectangle1.direction === 0) {
    return dir0;
  } else {
    return dir1;
  }
}

function getAttack(fighter) {

  if (!fighter.grounded) {
    if (fighter.canAttack) {
      fighter.attack(fighter.attacks.attack5, fighter.framesCurrent, fighter.sprites.attack5.framesMax);
    }
    return;
  }

  switch (fighter.currentAttack) {
    case fighter.attacks.attack1:
      // Wait for animation to complete before proceeding to the next attack

      setTimeout(() => {

        if(fighter.currentAttack === fighter.attacks.attack2){
          setTimeout(() => {
            fighter.attack(fighter.attacks.attack3, fighter.framesCurrent, fighter.sprites.attack2.framesMax);
            return
        
          }, ((fighter.sprites.attack2.framesMax - fighter.framesCurrent) * fighter.framesHold * 10));
          
        }

        fighter.attack(fighter.attacks.attack2, fighter.framesCurrent, fighter.sprites.attack1.framesMax);
        return
    
      }, ((fighter.sprites.attack1.framesMax - fighter.framesCurrent) * fighter.framesHold * 10));
      break;

    case fighter.attacks.attack2:
      setTimeout(() => {

        fighter.attack(fighter.attacks.attack3, fighter.framesCurrent, fighter.sprites.attack2.framesMax);
        return
    
      }, ((fighter.sprites.attack2.framesMax - fighter.framesCurrent) * fighter.framesHold * 10));
      break;

    case fighter.attacks.attack3:
      return;

    default:
      fighter.attack(fighter.attacks.attack1, 0, fighter.sprites.attack1.framesMax);
  }

  return;
}


function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";

  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie!";
  } else if (player.health > enemy.health) {
    enemy.canMove = false;
    enemy.switchSprite("death");
    document.querySelector("#displayText").innerHTML = "Player 1 Wins!";
  } else if (enemy.health > player.health) {
    player.canMove = false;

    player.switchSprite("death");
    document.querySelector("#displayText").innerHTML = "Player 2 Wins!";
  }
}

let timer = 101;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

function knockback(fighterhit, fighter2){

  if(fighterhit.dead)
    return
  if (fighterhit.position.x > fighter2.position.x){
    fighterhit.velocity.x += 25
    fighterhit.velocity.y -= 3

  }
  if (fighterhit.position.x < fighter2.position.x){
    fighterhit.velocity.x -= 25
    fighterhit.velocity.y -= 3

  }
}

