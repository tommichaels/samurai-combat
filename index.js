const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './assets/background.png',
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imgSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6,
})

const player = new Fighter({
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
    },
    imgSrc: './assets/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset : {
        x: 215,
        y: 180,
    }
    
})

const enemy = new Fighter({
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

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate)
    // console.log('Animate!!!!!');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();
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
        // console.log("player attacking");
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    //Detect Collision for Enemy
    if(reactangularCollision({
        rectangle1: enemy,
        rectangle2: player,
    }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        // console.log("enemy attacking");
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // End Game based on Health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
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