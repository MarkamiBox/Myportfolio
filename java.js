const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playerWidth = 128;
const playerHeight = 128;

let x = canvas.width / 2;
let y = canvas.height / 2;
let vx = 0;
let vy = 0;
let score = 0;

let gameStarted = false;

const playerImage = new Image();
playerImage.src = "img/player.png";

const EnemyPImage = new Image();
EnemyPImage.src = "img/EnemyPlane.png";

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        showIntroScreen();
        return;
    }

    ctx.drawImage(playerImage, x, y, playerWidth, playerHeight);

    x += vx;
    y += vy;

    if (x < 0) { //Map Size
        x = 0;
    } else if (x > canvas.width - playerWidth) {
        x = canvas.width - playerWidth;
    }

    if (y < 0) {
        y = 0;
    } else if (y > canvas.height - playerHeight) {
        y = canvas.height - playerHeight;
    }

    updateEnemies(); 
    drawEnemies();

    for (const enemy of enemies) {
        if (playerCollidesWithEnemy(enemy)) {
            location.reload(); // Restart the game
        }
    }

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 60, 30);

    requestAnimationFrame(update);
}

function showIntroScreen() { //intro
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Premi [Invio] per startare:", canvas.width / 2, canvas.height / 2);
    ctx.fillText("[W] [A] [S] [D] per muoverti", canvas.width / 2, canvas.height / 1.8);
}

const enemies = []; //Enemy functions
class Enemy {
    constructor(x, y, vy) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = vy;
        this.width = 128;
        this.height = 128;
    }

    update() {
        if (x > this.x) {
            this.x += 1;
        } else if (x < this.x) {
            this.x -= 1;
        }

        this.y += this.vy;

        if (this.y > canvas.height) {
            const index = enemies.indexOf(this);
            if (index !== -1) {
                enemies.splice(index, 1);
                score++; 
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(EnemyPImage, this.x, this.y, this.width, this.height);
    }
}

function spawnEnemy() {
    const numEnemies = Math.floor(Math.random() * 3) + 1;
    if (!gameStarted) return;
    for (let i = 0; i < numEnemies; i++) {
        const x = Math.random() * (canvas.width - EnemyPImage.width);
        const y = -EnemyPImage.height;
        const vy = 2 + Math.floor(Math.random() * score / 10);
        const enemy = new Enemy(x, y, vy);
        enemies.push(enemy);
    }
}
function updateEnemies() {
    for (const enemy of enemies) {
        enemy.update();
    }
}

function drawEnemies() {
    for (const enemy of enemies) {
        enemy.draw(ctx);
    }
}

function playerCollidesWithEnemy(enemy) {
    //Hitbox Player
    const playerHitboxX = x + 43 / 4; 
    const playerHitboxY = y + 43 / 4; 
    const playerHitboxWidth = 43 / 2; 
    const playerHitboxHeight = 128 - 43 / 2; 

    //Hitbox Enemy
    const enemyHitboxX = enemy.x + 67 / 4; 
    const enemyHitboxY = enemy.y + 51 / 4; 
    const enemyHitboxWidth = 67 / 2; 
    const enemyHitboxHeight = 51 / 2; 

    return (
        playerHitboxX < enemyHitboxX + enemyHitboxWidth &&
        playerHitboxX + playerHitboxWidth > enemyHitboxX &&
        playerHitboxY < enemyHitboxY + enemyHitboxHeight &&
        playerHitboxY + playerHitboxHeight > enemyHitboxY
    );
}


function keyDownHandler(event) {
    if (event.code === "Enter") {
        gameStarted = true;
        update();
        return;
    }

    if (event.code === "KeyD") {
        vx = 5; // Right
    } else if (event.code === "KeyA") {
        vx = -5; // Left
    } else if (event.code === "KeyW") {
        vy = -5; // Up
    } else if (event.code === "KeyS") {
        vy = 5; // Down
    }
}

function keyUpHandler(event) {
    if (event.code === "KeyD" || event.code === "KeyA") {
        vx = 0;
    } else if (event.code === "KeyW" || event.code === "KeyS") {
        vy = 0;
    }
}

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);

update();

setInterval(spawnEnemy, 2000 - score * 100); // 2s - Score


