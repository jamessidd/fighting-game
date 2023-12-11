function rectangularCollision({ rectangle1, rectangle2 }) {
  if (rectangle1.currentAttack === undefined) return false;

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

function fighterCollision(rect1, rect2) {
  return (
    rect1.position.x < rect2.position.x + rect2.width &&
    rect1.position.x + rect1.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height > rect2.position.y
  );
}

function getAttack(fighter, fighter2, specialAttack = false) {
  if (specialAttack) {
    if (!fighter.grounded) return;

    fighter.attack(
      fighter.attacks.attack4,
      0,
      fighter.sprites.attack4.framesMax
    );
    return;
  }

  if (!fighter.grounded) {
    if (fighter.canAttack)
      fighter.attack(
        fighter.attacks.attack5,
        fighter.framesCurrent,
        fighter.sprites.attack5.framesMax
      );
    return;
  }

  switch (fighter.currentAttack) {
    case fighter.attacks.attack1:
      setTimeout(() => {
        if (fighter.currentAttack === fighter.attacks.attack2) {
          setTimeout(() => {
            if (
              rectangularCollision({
                rectangle1: fighter,
                rectangle2: fighter2,
              })
            )
            fighter.attack(
              fighter.attacks.attack3,
              fighter.framesCurrent,
              fighter.sprites.attack2.framesMax
            );
            return;
          }, (fighter.sprites.attack2.framesMax - fighter.framesCurrent) * fighter.framesHold * 10);
        }
        if (
          rectangularCollision({
            rectangle1: fighter,
            rectangle2: fighter2,
          })
        )
          fighter.attack(
            fighter.attacks.attack2,
            fighter.framesCurrent,
            fighter.sprites.attack1.framesMax
          );
        return;
      }, (fighter.sprites.attack1.framesMax - fighter.framesCurrent) * fighter.framesHold * 10);
      break;

    case fighter.attacks.attack2:
      setTimeout(() => {
        if (
          rectangularCollision({
            rectangle1: fighter,
            rectangle2: fighter2,
          })
        )
        fighter.attack(
          fighter.attacks.attack3,
          fighter.framesCurrent,
          fighter.sprites.attack2.framesMax
        );
        return;
      }, (fighter.sprites.attack2.framesMax - fighter.framesCurrent) * fighter.framesHold * 10);
      break;

    case fighter.attacks.attack3:
      return;

    default:
      fighter.attack(
        fighter.attacks.attack1,
        0,
        fighter.sprites.attack1.framesMax
      );
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

function knockback(fighterhit, fighter2, dt) {
  if (fighterhit.dead) return;
  if (fighterhit.position.x > fighter2.position.x) {
    fighterhit.velocity.x += fighter2.currentAttack.knockback * 50 * dt;
    fighterhit.velocity.y -= 2;
  }
  if (fighterhit.position.x < fighter2.position.x) {
    fighterhit.velocity.x -= fighter2.currentAttack.knockback * 50 * dt;
    fighterhit.velocity.y -= 2;
  }
}
