//WITH DOUBLE JUMP

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d'); //c stands for context

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.4
const numOfJumps = 2

class Sprite{
    constructor({position, velocity, colour = "red", offset}){
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastkey

        this.grounded
        this.numOfJumps = numOfJumps

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 100,
            height: 50,
            offset
        }
        this.isAttacking
        this.isCrouching
        this.colour = colour

        this.health = 100
    }


    draw(){
        c.fillStyle = this.colour
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack box
        if(this.isAttacking){
            c.fillStyle = 'lime'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    resetJumps(){
        this.numOfJumps = numOfJumps
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y 
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
            this.grounded = true
            this.resetJumps()

        } else {
            this.velocity.y += gravity
            this.grounded = false
        }

        //crouching
        
        if (this.isCrouching){
            this.height = 50
        } else {
            this.height = 100

        }


    }

    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }


    
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },  
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
})
console.log(player)

const enemy = new Sprite({
    position: {
      x: 400,
      y: 200
    },  
    velocity: {
      x: 0,
      y: 0
    },
    colour: 'blue',
    offset: {
        x: -50,
        y: 0
      }
  })
console.log(enemy)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
        )
}

function determineWinner({player,enemy, timerId}){

    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'

    if (player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie!'
    } else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins!'
    } else if (enemy.health > player.health){
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins!'
        
    }
}

let timer = 101
let timerId
function decreaseTimer(){

    if (timer > 0) {

        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0){

        determineWinner({player,enemy,timerId})

    }
    
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0
    if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
    }
    //enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
    }

    //collision detection in attackzone
    if( rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
        ){
        player.isAttacking = false

        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'

        console.log('player hits enemy')
    }

    if( rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
    enemy.isAttacking
    ){
    enemy.isAttacking = false

    player.health -= 10
    document.querySelector('#playerHealth').style.width = player.health + '%'

    console.log('enemy hits player')
}

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){

        determineWinner({player,enemy,timerId})

    }

}

animate()


window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w':
            if (player.numOfJumps > 0){
                player.velocity.y = -10
                player.numOfJumps -= 1
            }
            break
        case 's':
            player.isCrouching = true
            break
        case ' ':
            player.attack()
            break


        //enemyKeys
        case 'ArrowRight': 
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.numOfJumps > 0){
                enemy.velocity.y = -10
                enemy.numOfJumps -= 1
            }            
            break   
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            player.isCrouching = false
            player.position.y -= player.height;
            break
    }

    //enemy Keys
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }
})



