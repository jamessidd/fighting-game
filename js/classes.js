
export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d"); //c stands for context
export const gravity = 0.4;

export default class Sprite {
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

export class Fighter extends Sprite {
  constructor({
    height,
    width,
    position,
    velocity,
    moveSpeed = 5,
    attackMoveSpeed = 0.35,
    colour = "red",
    canbeReversed = true,
    direction,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attacks = {
      attack1: {
        id: "attack1",
        offset: {},
        width: 50,
        height: 50,
        hitFrame: [],
        damage: 10,
        knockback: 10

      },
      attack2: {
        id: "attack2",
        offset: {},
        width: 50,
        height: 50,
        hitFrame: [],
        damage: 10,
        knockback: 10

      },
      attack3: {
        id: "attack3",
        offset: {},
        width: 50,
        height: 50,
        hitFrame: [],
        damage: 10,
        knockback: 10
      },
      attack4: {
        id: "attack4",
        offset: {},
        width: 50,
        height: 50,
        hitFrame: [],
        damage: 10,
        knockback: 10

      },
      attack5: {
        id: "attack5",
        offset: {},
        width: 50,
        height: 50,
        hitFrame: [],
        damage: 10,
        knockback: 10

      },
    },

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
    this.moveSpeed = moveSpeed;
    this.attackMoveSpeed = attackMoveSpeed;
    this.width = width;
    this.height = height;
    this.lastkey;
    this.canMove = true;
    this.canAttack = true;

    this.grounded;
    this.numOfJumps = 1;

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
    this.stopAttack = {};
    this.currentAttack;
    this.colour = colour;
    this.direction = direction;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 4;
    this.sprites = sprites;
    this.attacks = attacks;
    this.dead = false;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

    for (const attackB in attacks) {
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
        knockback: attacks[attackB].knockback,
      };
    }
  }
  resetJumps() {
    this.numOfJumps = 1;
  }

  
  


  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    if (this.dead) this.canMove = false;

    for (const attackB in this.attacks) {
      if (this.direction === 0) {
        this.attacks[attackB].position.x =
          this.position.x +
          this.width -
          this.attacks[attackB].width -
          this.attacks[attackB].offset.x;
      } else if (this.direction === 1) {
        this.attacks[attackB].position.x =
          this.position.x + this.attacks[attackB].offset.x;
      }
      // c.fillStyle = "rgba(255, 255, 255, 0.1)";

      //   c.fillRect(
      //     this.attacks.attack5.position.x,
      //     this.attacks.attack5.position.y,
      //     this.attacks.attack5.width,
      //     this.attacks.attack5.height
      //   );

      this.attacks[attackB].position.y =
        this.position.y + this.attacks[attackB].offset.y;
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
    //make sure players dont move past wall bounds left
    if (this.position.x < 0) {
      this.position.x = 0;
    }
    //make sure players dont move past wall bounds right
    if (this.position.x > canvas.width - this.width) {
      this.position.x = canvas.width - this.width;
    }

    if (this.image === this.sprites.attack4.image){
      this.framesHold = 6
    } else {
      this.framesHold = 4
    }

    switch (this.image) {
      case this.sprites.attack1.image:
        this.currentAttack = this.attacks.attack1;

        for (const i in this.attacks.attack1.hitFrame){
          if (this.framesCurrent === this.attacks.attack1.hitFrame[i]) {
            this.isAttacking = true;
            break;
          } else {
            this.isAttacking = false;
          }
        }
        break;
      case this.sprites.attack2.image:
        this.currentAttack = this.attacks.attack2;
        for (const i in this.attacks.attack2.hitFrame){

          if (this.framesCurrent === this.attacks.attack2.hitFrame[i]) {

            this.isAttacking = true;
            break;

          } else {
            this.isAttacking = false;
          }
        }
        break;

      case this.sprites.attack3.image:
        this.currentAttack = this.attacks.attack3;
        for (const i in this.attacks.attack3.hitFrame){

          if (this.framesCurrent === this.attacks.attack3.hitFrame[i]) {
            this.isAttacking = true;
            break;
          } else {
            this.isAttacking = false;

          }
        }
        break;
      case this.sprites.attack4.image:
        this.currentAttack = this.attacks.attack4;
        this.canAttack = false
        

        for (const i in this.attacks.attack4.hitFrame){

          if (this.framesCurrent === this.attacks.attack4.hitFrame[i]) {
            this.isAttacking = true;
            break;
          } else {
            this.isAttacking = false;

          }
        }
        break;
      case this.sprites.attack5.image:
        this.currentAttack = this.attacks.attack5;
        for (const i in this.attacks.attack5.hitFrame){

          if (this.framesCurrent === this.attacks.attack5.hitFrame[i]) {
            this.isAttacking = true;
            break;
          } else {
            this.isAttacking = false;

          }
        }
        break;
      default:
        this.currentAttack = undefined;
        this.stopAttack = true
        this.canAttack = true
        

    }
  }

  attack(atk, framesCurrent, framesMax) {

    if (this.currentAttack === atk) return;



    this.canAttack = false;
    this.switchSprite(atk.id, true, framesCurrent);


    setTimeout(() => {
      if (atk !== this.currentAttack) return;

      this.canAttack = true;
    }, (framesMax - this.framesCurrent) * this.framesHold * 10);
  }

  takehit(atk) {


    if(this.dead)
      return
    this.canMove = false;
    this.framesCurrent = 0
    this.switchSprite("takehit", true);
    this.isAttacking = false
    this.stopAttack = this.currentAttack
    this.health -= atk.damage;
    setTimeout(() => {
      this.canMove = true;
    }, 600);
  }

  switchSprite(sprite, priority = false, framesCurrent = 0) {
    if (priority) {
      if (this.image !== this.sprites[sprite].image) {
        this.image = this.sprites[sprite].image;
        this.framesMax = this.sprites[sprite].framesMax;
        this.framesCurrent = framesCurrent;
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
    if (
      this.image === this.sprites.attack2.image &&
      this.framesCurrent < this.sprites.attack2.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.attack3.image &&
      this.framesCurrent < this.sprites.attack3.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.attack4.image &&
      this.framesCurrent < this.sprites.attack4.framesMax - 1
    )
      return;
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
