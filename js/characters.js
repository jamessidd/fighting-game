import {Fighter} from "../js/classes.js";


//-----------------FireKnight-----------------------------------

export var FireKnight = new Fighter({
  height: 120,
  width: 70,
  position: {
    x: 0,
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
    attack1: {
      id: "attack1",
      offset: { x: 80, y: 0 },
      width: 100,
      height: 100,
      hitFrame: 5,
      damage: 5,
    },
    attack2: {
      id: "attack2",
      offset: { x: -95, y: 0 },
      width: 310,
      height: 100,
      hitFrame: 12,
      damage: 5,
    },
    attack3: {
      id: "attack3",
      offset: { x: 140, y: -30 },
      width: 130,
      height: 130,
      hitFrame: 23,
      damage: 5,
    },
    attack4: {
      id: "attack4",
      offset: { x: 80, y: 0 },
      width: 50,
      height: 50,
      hitFrame: 14,
      damage: 5,
    },
    attack5: {
      id: "attack5",
      offset: { x: 80, y: 0 },
      width: 200,
      height: 50,
      hitFrame: 4,
      damage: 5,
    },
  },
});

//----------------WATER PRINCESS------------------------------

export var WaterPrincess = new Fighter({
    height: 95,
    width: 45,
    position: {
      x: 0,
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
      attack1: {
        id: "attack1",
        offset: { x: 80, y: 10 },
        width: 100,
        height: 45,
        hitFrame: 3,
        damage: 5,
      },
      attack2: {
        id: "attack2",
        offset: { x: 0, y: 35 },
        width: 215,
        height: 50,
        hitFrame: 14,
        damage: 5,
      },
      attack3: {
        id: "attack3",
        offset: { x: 80, y: 0 },
        width: 200,
        height: 100,
        hitFrame: 21,
        damage: 5,
      },
      attack4: {
        id: "attack4",
        offset: { x: 80, y: 0 },
        width: 50,
        height: 50,
        hitFrame: 14,
        damage: 5,
      },
      attack5: {
        id: "attack5",
        offset: { x: 80, y: 0 },
        width: 200,
        height: 50,
        hitFrame: 4,
        damage: 5,
      },
    },
  });


//----------------METAL BLADEMASTER------------------------------

export var MetalBladeMaster = new Fighter({
  height: 110,
  width: 60,
  position: {
    x: 0,
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
  moveSpeed: 6,
  attackMoveSpeed: 0.5,
  canbeReversed: true,
  direction: 1,
  imageSrc: "./img/MetalBladeMaster/idle.png",
  framesMax: 8,
  scale: 0.9,
  offset: {
    x: 72.5 + 241 + 43,
    y: 30 + 152 + 50,
  },
  sprites: {
    idle: {
      imageSrc: "./img/MetalBladeMaster/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/MetalBladeMaster/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/MetalBladeMaster/jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/MetalBladeMaster/fall.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./img/MetalBladeMaster/attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./img/MetalBladeMaster/attack2.png",
      framesMax: 8,
    },
    attack3: {
      imageSrc: "./img/MetalBladeMaster/attack3.png",
      framesMax: 18,
    },
    attack4: {
      imageSrc: "./img/MetalBladeMaster/attack4.png",
      framesMax: 11,
    },
    attack5: {
      imageSrc: "./img/MetalBladeMaster/attack5.png",
      framesMax: 8,
    },
    takehit: {
      imageSrc: "./img/MetalBladeMaster/takehit.png",
      framesMax: 6,
    },
    death: {
      imageSrc: "./img/MetalBladeMaster/death.png",
      framesMax: 12,
    },
  },
  attacks: {
    attack1: {
      id: "attack1",
      offset: { x: 40, y: 20 },
      width: 110,
      height: 45,
      hitFrame: 3,
      damage: 2,
    },
    attack2: {
      id: "attack2",
      offset: { x: 40, y: 20 },
      width: 125,
      height: 45,
      hitFrame: 5,
      damage: 5,
    },
    attack3: {
      id: "attack3",
      offset: { x: 0, y: -40 },
      width: 185,
      height: 150,
      hitFrame: 13,
      damage: 5,
    },
    attack4: {
      id: "attack4",
      offset: { x: 80, y: 0 },
      width: 50,
      height: 50,
      hitFrame: 14,
      damage: 5,
    },
    attack5: {
      id: "attack5",
      offset: { x: 80, y: -20 },
      width: 120,
      height: 70,
      hitFrame: 2,
      damage: 5,
    },
  },
});

//----------------WIND ASSASSIN------------------------------

export var WindAssassin = new Fighter({
  height: 95,
  width: 65,
  position: {
    x: 0,
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
  moveSpeed: 5.25,
  attackMoveSpeed: 0.4,
  canbeReversed: true,
  direction: 1,
  imageSrc: "./img/WindAssassin/idle.png",
  framesMax: 8,
  scale: 0.9,
  offset: {
    x: 75 + 241 + 43,
    y: 45 + 152 + 50,
  },
  sprites: {
    idle: {
      imageSrc: "./img/WindAssassin/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/WindAssassin/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/WindAssassin/jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/WindAssassin/fall.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./img/WindAssassin/attack1.png",
      framesMax: 8,
    },
    attack2: {
      imageSrc: "./img/WindAssassin/attack2.png",
      framesMax: 18,
    },
    attack3: {
      imageSrc: "./img/WindAssassin/attack3.png",
      framesMax: 26,
    },
    attack4: {
      imageSrc: "./img/WindAssassin/attack4.png",
      framesMax: 30,
    },
    attack5: {
      imageSrc: "./img/WindAssassin/attack5.png",
      framesMax: 7,
    },
    takehit: {
      imageSrc: "./img/WindAssassin/takehit.png",
      framesMax: 6,
    },
    death: {
      imageSrc: "./img/WindAssassin/death.png",
      framesMax: 19,
    },
  },
  attacks: {
    attack1: {
      id: "attack1",
      offset: { x: 40, y: 20 },
      width: 70,
      height: 45,
      hitFrame: 3,
      damage: 2,
    },
    attack2: {
      id: "attack2",
      offset: { x: 40, y: -10 },
      width: 125,
      height: 120,
      hitFrame: 10,
      damage: 5,
    },
    attack3: {
      id: "attack3",
      offset: { x: 175, y: -40 },
      width: 130,
      height: 150,
      hitFrame: 20,
      damage: 5,
    },
    attack4: {
      id: "attack4",
      offset: { x: 80, y: 0 },
      width: 50,
      height: 50,
      hitFrame: 14,
      damage: 5,
    },
    attack5: {
      id: "attack5",
      offset: { x: 80, y: -35 },
      width: 100,
      height: 145,
      hitFrame: 2,
      damage: 5,
    },
  },
});


//----------------GROUND MONK------------------------------

export var GroundMonk = new Fighter({
  height: 95,
  width: 55,
  position: {
    x: 0,
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
  moveSpeed: 6.5,
  attackMoveSpeed: 0.3,
  canbeReversed: true,
  direction: 1,
  imageSrc: "./img/GroundMonk/idle.png",
  framesMax: 8,
  scale: 0.9,
  offset: {
    x: 80 + 241 + 43,
    y: 30 + 152 + 50,
  },
  sprites: {
    idle: {
      imageSrc: "./img/GroundMonk/idle.png",
      framesMax: 6,
    },
    run: {
      imageSrc: "./img/GroundMonk/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/GroundMonk/jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/GroundMonk/fall.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./img/GroundMonk/attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./img/GroundMonk/attack2.png",
      framesMax: 12,
    },
    attack3: {
      imageSrc: "./img/GroundMonk/attack3.png",
      framesMax: 23,
    },
    attack4: {
      imageSrc: "./img/GroundMonk/attack4.png",
      framesMax: 25,
    },
    attack5: {
      imageSrc: "./img/GroundMonk/attack5.png",
      framesMax: 7,
    },
    takehit: {
      imageSrc: "./img/GroundMonk/takehit.png",
      framesMax: 6,
    },
    death: {
      imageSrc: "./img/GroundMonk/death.png",
      framesMax: 18,
    },
  },
  attacks: {
    attack1: {
      id: "attack1",
      offset: { x: 60, y: 0 },
      width: 70,
      height: 65,
      hitFrame: 3,
      damage: 2,
    },
    attack2: {
      id: "attack2",
      offset: { x: 60, y: 0 },
      width: 70,
      height: 65,
      hitFrame: 3,
      damage: 2,
    },
    attack3: {
      id: "attack3",
      offset: { x: 175, y: -40 },
      width: 130,
      height: 150,
      hitFrame: 20,
      damage: 5,
    },
    attack4: {
      id: "attack4",
      offset: { x: 80, y: 0 },
      width: 50,
      height: 50,
      hitFrame: 14,
      damage: 5,
    },
    attack5: {
      id: "attack5",
      offset: { x: 80, y: -35 },
      width: 100,
      height: 145,
      hitFrame: 2,
      damage: 5,
    },
  },
});