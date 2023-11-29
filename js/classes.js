class Sprite {
  constructor({
    position,
    direction,
    canbeReversed = false,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 100;
    this.canbeReversed = canbeReversed;
    this.direction = direction;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }

  draw() {
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.canbeReversed) {
      if (this.direction === 0) {
        c.scale(-1, 1);
        c.drawImage(
          this.image,

          this.framesCurrent * (this.image.width / this.framesMax),
          0,
          this.image.width / this.framesMax,
          this.image.height,

          -this.position.x - this.offset.x - this.width,
          this.position.y - this.offset.y,
          (this.image.width / this.framesMax) * this.scale,
          this.image.height * this.scale
        );
        c.scale(-1, 1);
      } else if (this.direction === 1) {
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
      } else {
        throw "Object wrong direction at " + this.direction;
      }
    } else {
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
  }
  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    colour = "red",
    canbeReversed = true,
    direction,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      canbeReversed,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 100;
    this.lastkey;
    this.canMove = true;
    this.grounded;
    this.numOfJumps = numOfJumps;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset,
    };
    this.isAttacking;
    this.colour = colour;
    this.direction = direction;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  resetJumps() {
    this.numOfJumps = numOfJumps;
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    if (this.dead) this.canMove = false;

    if (this.direction === 0) {
      this.attackBox.position.x =
        this.position.x +
        this.width -
        this.attackBox.width -
        this.attackBox.offset.x;
    } else if (this.direction === 1) {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    }

    // c.fillStyle = "rgba(255, 255, 255, 0.25)";
    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 380;
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
    this.canMove = false;
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
      this.canMove = true;
    }, 900);
  }

  takehit() {
    this.switchSprite("takehit");
    this.health -= 10;
  }

  switchSprite(sprite) {
    //overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    //override if fighter gets hit
    if (
      this.image === this.sprites.takehit.image &&
      this.framesCurrent < this.sprites.takehit.framesMax - 1
    )
      return;
    //override if fighter dies
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    if (this.image !== this.sprites[sprite].image) {
      this.image = this.sprites[sprite].image;
      this.framesMax = this.sprites[sprite].framesMax;
      this.framesCurrent = 0;
    }

    // switch (sprite) {
    //   case "idle":
    //     if (this.image !== this.sprites.idle.image) {
    //       this.image = this.sprites.idle.image;
    //       this.framesMax = this.sprites.idle.framesMax;
    //       this.framesCurrent = 0;
    //     }

    //     break;
    //   case "run":
    //     if (this.image !== this.sprites.run.image) {
    //       this.image = this.sprites.run.image;
    //       this.framesMax = this.sprites.run.framesMax;
    //       this.framesCurrent = 0;
    //     }

    //     break;
    //   case "jump":
    //     if (this.image !== this.sprites.jump.image) {
    //       this.image = this.sprites.jump.image;
    //       this.framesMax = this.sprites.jump.framesMax;
    //       this.framesCurrent = 0;
    //     }
    //     break;
    //   case "fall":
    //     if (this.image !== this.sprites.fall.image) {
    //       this.image = this.sprites.fall.image;
    //       this.framesMax = this.sprites.fall.framesMax;
    //       this.framesCurrent = 0;
    //     }
    //     break;
    //   case "attack1":
    //     if (this.image !== this.sprites.attack1.image) {
    //       this.image = this.sprites.attack1.image;
    //       this.framesMax = this.sprites.attack1.framesMax;
    //       this.framesCurrent = 0;
    //     }
    //     break;
    // }
  }
}
