function rectangularCollision({ rectangle1, rectangle2 }) {
  dir1 =
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <=
      rectangle2.position.y + rectangle2.height;

  dir0 =
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <=
      rectangle2.position.y + rectangle2.height;

  if (rectangle1.direction === 0) {
    return dir0;
  } else {
    return dir1;
  }
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
  if (fighterhit.position.x > fighter2.position.x){
    fighterhit.velocity.x += 25
    fighterhit.velocity.y -= 3

  }
  if (fighterhit.position.x < fighter2.position.x){
    fighterhit.velocity.x -= 25
    fighterhit.velocity.y -= 3

  }
}

