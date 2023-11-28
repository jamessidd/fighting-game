class Sprite {
  constructor({ position, direction, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
    this.position = position;
    this.width = 50;
    this.height = 100;
    this.direction = direction;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
    this.offset = offset
  }



  draw() {
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.drawImage(
      this.image,

      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames(){
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0){

        if (this.framesCurrent < this.framesMax - 1){
            this.framesCurrent++
        } else {
            this.framesCurrent = 0
        }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
    
  }
}

class Fighter extends Sprite{
  constructor({ position, velocity, colour = "red", direction, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}  }) {

    super({
        position,
        imageSrc,
        scale,
        framesMax,
        offset
    })
    
    this.velocity = velocity;
    this.width = 50;
    this.height = 100;
    this.lastkey;

    this.grounded;
    this.numOfJumps = numOfJumps;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.isAttacking;
    this.colour = colour;
    this.direction = direction;
    this.health = 100;
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
  }

  resetJumps() {
    this.numOfJumps = numOfJumps;
  }



  update() {
    this.draw();
    this.animateFrames()

    if (this.direction === 0) {
      this.attackBox.position.x = this.position.x + this.width;
    } else if (this.direction === 0) {
      this.attackBox.position.x = this.position.x;
    }

    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.grounded = true;
      this.resetJumps();
    } else {
      this.velocity.y += gravity;
      this.grounded = false;
    }

    //make sure players dont move past wall bounds
    if (this.position.x < 0) {
      this.position.x = 0;
    }

    if (this.position.x > canvas.width - this.width) {
      this.position.x = canvas.width - this.width;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
