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
        y: 157,
    },
    sprites: {
        idle: {
            imgSrc: './assets/samuraiMack/idle.png',
            framesMax: 8
        },
        run: {
            imgSrc: './assets/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imgSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imgSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imgSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imgSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imgSrc: './assets/samuraiMack/Death.png',
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
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
    },
    imgSrc: './assets/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset : {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imgSrc: './assets/kenji/idle.png',
            framesMax: 4
        },
        run: {
            imgSrc: './assets/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imgSrc: './assets/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imgSrc: './assets/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imgSrc: './assets/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imgSrc: './assets/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imgSrc: './assets/kenji/Death.png',
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -172,
            y: 50
        },
        width: 172,
        height: 50
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //Player Movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    // Player Jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    //Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }
    // Enemy Jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //Detect Collision for Player & Enemy Gets Hit
    if(reactangularCollision({
        rectangle1: player,
        rectangle2: enemy,
    }) && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit();
        player.isAttacking = false;
        // console.log("player attacking");
        // document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    //Detect Collision for Enemy & this is where player gets hit
    if(reactangularCollision({
        rectangle1: enemy,
        rectangle2: player,
    }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit();
        enemy.isAttacking = false;
        // console.log("enemy attacking");
        // document.querySelector('#playerHealth').style.width = player.health + '%';
        
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // End Game based on Health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate();

window.addEventListener('keydown', (event) => {
    //Player Movements
    if(!player.dead) {
        switch (event.key) {
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
            
            //Attack
            case " ":
                player.attack();
            break;

            // Jump
            case "w":
                player.velocity.y = -20;
            break;

        }
       
    }

    //Enemy Movements
    if(!enemy.dead) {
        switch (event.key) { 
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
                // enemy.isAttacking = true;
                enemy.attack();
            break;
        }
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