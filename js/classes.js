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
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
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
    height,
    width,
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
    attacks = {
      attack1:{ id: 'attack1', offset: {}, width: 50, height: 50, hitFrame: 5, damage: 10, duration: 1000 },
      attack2:{ id: 'attack2', offset: {}, width: 50, height: 50, hitFrame: 5, damage: 10, duration: 1000 },
      attack3:{ id: 'attack3', offset: {}, width: 50, height: 50, hitFrame: 5, damage: 10, duration: 1000 },
      attack4:{ id: 'attack4', offset: {}, width: 50, height: 50, hitFrame: 5, damage: 10, duration: 1000 },
      attack5:{ id: 'attack5', offset: {}, width: 50, height: 50, hitFrame: 5, damage: 10, duration: 1000 }
    }
    
    // attackBox2 = { offset: {}, width: undefined, height: undefined },
    // attackBox3 = { offset: {}, width: undefined, height: undefined },
    // attackBox4 = { offset: {}, width: undefined, height: undefined },

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
    this.width = width;
    this.height = height;
    this.lastkey;
    this.canMove = true;
    this.canAttack = true;

    this.grounded;
    this.numOfJumps = numOfJumps;

    // this.attackBox = {
    //   position: {
    //     x: this.position.x,
    //     y: this.position.y,
    //   },
    //   width: attackBox.width,
    //   height: attackBox.height,
    //   offset: attackBox.offset,
    // };
    
    this.isAttacking;
    this.currentAttack;
    this.colour = colour;
    this.direction = direction;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.attacks = attacks
    this.dead = false;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    };

    for (const attackB in attacks){

      attacks[attackB] = {
        id: attacks[attackB].id,
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        width: attacks[attackB].width,
        height: attacks[attackB].height,
        offset: attacks[attackB].offset,
        hitFrame: attacks[attackB].hitFrame,
        damage: attacks[attackB].damage,
        duration: attacks[attackB].duration
      }
      
    };

    
  }
  resetJumps() {
    this.numOfJumps = numOfJumps;
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();
    
    if (this.dead) this.canMove = false;

    for (const attackB in this.attacks){
    if (this.direction === 0) {
      this.attacks[attackB].position.x =
        this.position.x +
        this.width -
        this.attacks[attackB].width -
        this.attacks[attackB].offset.x;
    } else if (this.direction === 1) {
      this.attacks[attackB].position.x = this.position.x + this.attacks[attackB].offset.x;
     

    }


    this.attacks[attackB].position.y = this.position.y + this.attacks[attackB].offset.y;
    }

    // console.log(player.attacks.attack1)
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = canvas.height - 96 - this.height;
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
  attack(atk) {
    c.fillRect(atk.position.x, atk.position.y, atk.width, atk.height) 
    // this.canMove = false;
    this.canAttack = false;
    this.switchSprite(atk.id)
    this.currentAttack = atk
    this.isAttacking = true;

    console.log(this.position.x, atk.position.x)
    
    setTimeout(() => {
      
      this.isAttacking = false;
      this.currentAttack = undefined;
      this.canAttack = true;

    }, atk.duration);
  }

  takehit() {
    this.switchSprite("takehit",true);
    this.isAttacking = false
    this.health -= 10;
    setTimeout(() => {
      this.canMove = true;
    }, 200);
  }

  switchSprite(sprite, priority = false) {

    if (priority){
      if (this.image !== this.sprites[sprite].image) {
        this.image = this.sprites[sprite].image;
        this.framesMax = this.sprites[sprite].framesMax;
        this.framesCurrent = 0;
      }
    }
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
    //overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    // if (
    //   this.image === this.sprites.attack2.image &&
    //   this.framesCurrent < this.sprites.attack2.framesMax - 1
    // )
    //   return;
    // if (
    //   this.image === this.sprites.attack3.image &&
    //   this.framesCurrent < this.sprites.attack3.framesMax - 1
    // )
    //   return;
    // if (
    //   this.image === this.sprites.attack4.image &&
    //   this.framesCurrent < this.sprites.attack4.framesMax - 1
    // )
    //   return;
    if (
      this.image === this.sprites.attack5.image &&
      this.framesCurrent < this.sprites.attack5.framesMax - 1
    )
      return;



    if (this.image !== this.sprites[sprite].image) {
      this.image = this.sprites[sprite].image;
      this.framesMax = this.sprites[sprite].framesMax;
      this.framesCurrent = 0;
    }

  }
}