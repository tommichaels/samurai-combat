const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Attack Box
        if (this.isAttacking) {
            ctx.fillStyle = 'green';
            ctx.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height
            )
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    position:   {
        x: 0,
        y: 0
    },
    velocity:   {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position:   {
        x: 400,
        y: 100
    },
    velocity:   {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})


console.log(player);

const keys ={
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
    },
}

//This detcts the collision between two rectangles (and in our case between the player's swor to the enemy's body) of whicch rectangle1 is the player and rectangle2 is the enemy
function reactangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    // console.log('Animate!!!!!');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Player Movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    //Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    //Detect Collision for Player
    if(reactangularCollision({
        rectangle1: player,
        rectangle2: enemy,
    }) && player.isAttacking) {
        player.isAttacking = false;
        console.log("player attacking");
    }

     //Detect Collision for Enemy
     if(reactangularCollision({
        rectangle1: enemy,
        rectangle2: player,
    }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        console.log("enemy attacking");
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //Player Movements
        // Move Right
        case "d":
            keys.d.pressed = true;
            player.lastKey = 'd';
        break;

        // Move Left
        case "a":
            keys.a.pressed = true;
            player.lastKey = 'a';
        break;

        case " ":
            player.attack();
        break;


        // Jump
        case "w":
            player.velocity.y = -20;
        break;
        
        //Enemy Movements
        // Move Right
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
        break;

        // Move Left
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
        break;

        // Jump
        case "ArrowUp":
            enemy.velocity.y = -20;
        break;

        //Enemy Attcak
        case "ArrowDown":
            enemy.isAttacking = true;
        break;
    }

    console.log(event.key);
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
        break;

        case "a":
            keys.a.pressed = false;
        break;
    }

    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
        break;

        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
        break;
    }

    console.log(event.key);
});