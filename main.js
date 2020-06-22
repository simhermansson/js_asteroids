// Game constants
const GAME_SPEED = 1000 / 60;
const CANVAS_BORDER_COLOUR = "gray";
const CANVAS_BACKGROUND_COLOUR = "rgba(0, 0, 0, 0.6)";
const BLUR_AMOUNT = 5;

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
context.shadowColor = "white";
context.shadowOffsetX = 0;
context.shadowOffsetY = 0;
context.lineWidth = 2;
context.font = "30px hyperspace";


// Initialize game variables
let playerX = 150;
let playerY = 150;
let playerHeading = 0.0;
let maxAcceleration = 2;

let lastFiring = Date.now();
let firingDelay = 100;

let dx = 0;
let dy = 0;

let leftKey = false;
let rightKey = false;
let upKey = false;
let spaceKey = false;

let gameObjects = [];
let bullets = [];
let maxAsteroids = 5;
let currentAsteroidsOnScreen = 0;
let maxBullets = 4;
let score = 0;


class gameObject {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = 5;
    }

    draw() {
        context.fillStyle = "white";
        context.shadowBlur = BLUR_AMOUNT;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
}

class Bullet extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 3;
    }

    update() {
        for (let i = 0; i < gameObjects.length; i++) {
            let o = gameObjects[i];
            if (o.contains(this.x, this.y)) {
                gameObjects.splice(i, 1);
                o.kill();
                return true;
            }
        }
        return false;
    }
}


class Asteroid extends gameObject {
    constructor(x, y, dx, dy) {
        currentAsteroidsOnScreen++;
        super(x, y, dx, dy);
        this.shape = randomInRange(3);
        this.points = [];
        this.alive = true;
    }

    update() {
        return !this.alive;
    }

    contains(x, y) {
        return Math.abs(this.x - x) <= this.radius &&
               Math.abs(this.y - y) <= this.radius;
    }

    draw() {
        context.strokeStyle = "white";
        context.shadowBlur = BLUR_AMOUNT;
        context.beginPath();
        if (this.shape === 0) {
            context.moveTo(this.x - this.radius / 4, this.y - this.radius);
            context.lineTo(this.x + this.radius / 2, this.y - this.radius);
            context.lineTo(this.x + this.radius, this.y - this.radius / 4);
            context.lineTo(this.x + this.radius, this.y + this.radius / 2);
            context.lineTo(this.x, this.y + this.radius);
            context.lineTo(this.x, this.y + this.radius);
            context.lineTo(this.x, this.y + this.radius / 20);
            context.lineTo(this.x - this.radius / 2, this.y + this.radius);
            context.lineTo(this.x - this.radius, this.y + this.radius / 4);
            context.lineTo(this.x - this.radius / 2, this.y);
            context.lineTo(this.x - this.radius, this.y - this.radius / 4);
            context.lineTo(this.x - this.radius / 2 - this.radius / 6, this.y - this.radius / 2 - this.radius / 8);
            context.lineTo(this.x - this.radius / 2, this.y - this.radius / 2 - this.radius / 8);
            context.lineTo(this.x - this.radius / 4, this.y - this.radius);
        } else if (this.shape === 1) {
            context.moveTo(this.x, this.y - this.radius / 2);
            context.lineTo(this.x + this.radius / 4, this.y - this.radius);
            context.lineTo(this.x + this.radius, this.y - this.radius / 2);
            context.lineTo(this.x + this.radius / 2 + this.radius / 4, this.y);
            context.lineTo(this.x + this.radius, this.y + this.radius / 2);
            context.lineTo(this.x + this.radius / 4, this.y + this.radius);
            context.lineTo(this.x - this.radius / 2, this.y + this.radius);
            context.lineTo(this.x - this.radius, this.y + this.radius / 2);
            context.lineTo(this.x - this.radius, this.y - this.radius / 2);
            context.lineTo(this.x - this.radius / 2, this.y - this.radius);
            context.lineTo(this.x, this.y - this.radius / 2);
        } else if (this.shape === 2) {
            context.moveTo(this.x - this.radius / 2, this.y - this.radius);
            context.lineTo(this.x + this.radius / 4, this.y - this.radius);
            context.lineTo(this.x + this.radius, this.y - this.radius / 2);
            context.lineTo(this.x + this.radius, this.y - this.radius / 4);
            context.lineTo(this.x + this.radius / 4, this.y);
            context.lineTo(this.x + this.radius, this.y + this.radius / 4);
            context.lineTo(this.x + this.radius / 3, this.y + this.radius);
            context.lineTo(this.x + this.radius / 10, this.y + this.radius / 2 + this.radius / 4);
            context.lineTo(this.x - this.radius / 2, this.y + this.radius);
            context.lineTo(this.x - this.radius, this.y + this.radius / 3);
            context.lineTo(this.x - this.radius, this.y - this.radius / 3);
            context.lineTo(this.x - this.radius / 2 + this.radius / 4, this.y - this.radius / 3);
            context.lineTo(this.x - this.radius / 2, this.y - this.radius);
        }
        context.stroke();
    }
}


class LargeAsteroid extends Asteroid {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 40;
        this.points = 20;
    }

    kill() {
        this.alive = false;
        score += this.points;
        let a = new MediumAsteroid(this.x, this.y, randomInRange(maxAcceleration), randomInRange(maxAcceleration));
        let b = new MediumAsteroid(this.x, this.y, randomInRange(maxAcceleration), randomInRange(maxAcceleration));
        gameObjects.push(a);
        gameObjects.push(b);
        currentAsteroidsOnScreen--;
    }
}


class MediumAsteroid extends Asteroid {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 20;
        this.points = 50;
    }

    kill() {
        score += this.points;
        let a = new SmallAsteroid(this.x, this.y, randomInRange(maxAcceleration), randomInRange(maxAcceleration));
        let b = new SmallAsteroid(this.x, this.y, randomInRange(maxAcceleration), randomInRange(maxAcceleration));
        gameObjects.push(a);
        gameObjects.push(b);
        currentAsteroidsOnScreen--;
    }
}


class SmallAsteroid extends Asteroid {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 10;
        this.points = 100;
    }

    kill() {
        score += this.points;
    }
}


// Start game
main();
document.addEventListener("keydown", function(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const SPACE_KEY = 32;
    if (event.keyCode === LEFT_KEY) leftKey = true;
    if (event.keyCode === RIGHT_KEY) rightKey = true;
    if (event.keyCode === UP_KEY) upKey = true;
    if (event.keyCode === SPACE_KEY) spaceKey = true;
});

document.addEventListener("keyup", function(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const SPACE_KEY = 32;
    if (event.keyCode === LEFT_KEY) leftKey = false;
    if (event.keyCode === RIGHT_KEY) rightKey = false;
    if (event.keyCode === UP_KEY) upKey = false;
    if (event.keyCode === SPACE_KEY) spaceKey = false;
});


function main() {

    setTimeout(function onTick() {
        clearCanvas();
        handleInput();
        updateObjects();
        drawPlayer();
        drawText();
        advancePlayer();

        if (currentAsteroidsOnScreen === 0) {
            for (let i = 0; i < maxAsteroids; i++) {
                spawnAsteroid();
            }
        }

        main();

    }, GAME_SPEED);

}


function clearCanvas() {
    context.shadowBlur = 0;
    context.fillStyle = CANVAS_BACKGROUND_COLOUR;
    context.strokestyle = CANVAS_BORDER_COLOUR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}


function updateObjects() {
    // Update gameObjects
    for (let i = 0; i < gameObjects.length; i++) {
        let o = gameObjects[i];
        if (o.update()) {
            gameObjects.splice(i, 1);
            break;
        } else {
            o.x = (o.x + o.dx) % canvas.width;
            if (o.x < 0) o.x += canvas.width;
            o.y = (o.y - o.dy) % canvas.height
            if (o.y < 0) o.y += canvas.height;

            o.draw();
        }
    }

    // Update bullets
    for (let i = 0; i < bullets.length; i++) {
        let o = bullets[i];
        if (o.update()) {
            bullets.splice(i, 1);
            break;
        } else {
            o.x = (o.x + o.dx) % canvas.width;
            if (o.x < 0) o.x += canvas.width;
            o.y = (o.y - o.dy) % canvas.height
            if (o.y < 0) o.y += canvas.height;

            o.draw();
        }
    }

    // Update player
    playerX = (playerX + dx) % canvas.width;
    if (playerX < 0) playerX += canvas.width;
    playerY = (playerY + dy) % canvas.height;
    if (playerY < 0) playerY += canvas.height;
}


function drawPlayer() {
    context.strokeStyle = "white";
    context.shadowBlur = BLUR_AMOUNT;
    context.beginPath();

    let shipRadius = 15;
    let outerLength = Math.sqrt(Math.pow(shipRadius, 2) + Math.pow(shipRadius, 2));

    let frontX = (shipRadius * Math.cos(toRadians(playerHeading)));
    let frontY = (shipRadius * Math.sin(toRadians(playerHeading)));
    let upperX = (outerLength * Math.cos(toRadians(35-playerHeading)));
    let upperY = (outerLength * Math.sin(toRadians(35-playerHeading)));
    let lowerX = (outerLength * Math.cos(toRadians(35+playerHeading)));
    let lowerY = (outerLength * Math.sin(toRadians(35+playerHeading)));
    let middleUpperX = ((outerLength-10) * Math.cos(toRadians(10-playerHeading)));
    let middleUpperY = ((outerLength-10) * Math.sin(toRadians(10-playerHeading)));
    let middleLowerX = ((outerLength-10) * Math.cos(toRadians(10+playerHeading)));
    let middleLowerY = ((outerLength-10) * Math.sin(toRadians(10+playerHeading)));

    context.moveTo(playerX + frontX, playerY - frontY);
    context.lineTo(playerX - lowerX, playerY + lowerY);
    context.lineTo(playerX - middleLowerX, playerY + middleLowerY);
    context.lineTo(playerX - middleUpperX, playerY - middleUpperY);
    context.lineTo(playerX - upperX, playerY - upperY);
    context.lineTo(playerX + frontX, playerY - frontY);

    context.stroke();
}


function drawText() {
    context.strokeStyle = "white";
    context.shadowBlur = BLUR_AMOUNT;
    // Draw score
    context.strokeText(score, 10, 30);
}


function advancePlayer() {
    playerX = (playerX + dx) % canvas.width;
    if (playerX < 0) playerX += canvas.width;
    playerY = (playerY + dy) % canvas.height;
    if (playerY < 0) playerY += canvas.height;
}


function fire() {
    let delta = Date.now() - lastFiring;
    if (delta > firingDelay) {
        lastFiring = Date.now();
        let bulletSpeedX = 10 * Math.cos(toRadians(playerHeading)) + dx;
        let bulletSpeedY = 10 * Math.sin(toRadians(playerHeading)) - dy;
        let b = new Bullet(playerX + (2 * bulletSpeedX),
                        playerY - (2 * bulletSpeedY), bulletSpeedX, bulletSpeedY);
        bullets.push(b);
        if (bullets.length > maxBullets) {
            bullets.shift();
        }
    }
}


function spawnAsteroid() {
    let a = new LargeAsteroid(randomInRange(canvas.width),
                              randomInRange(canvas.height),
                              randomInRange(maxAcceleration),
                              randomInRange(maxAcceleration));
    gameObjects.push(a);
}


function handleInput() {
    if (leftKey) {
        playerHeading = (playerHeading + 5) % 360;
    }
    if (rightKey) {
        playerHeading = (playerHeading - 5) % 360;
    }
    if (upKey) {
        dx += 0.1 * Math.cos(toRadians(playerHeading));
        dy -= 0.1 * Math.sin(toRadians(playerHeading));
    }
    if (spaceKey) {
        fire();
    }
}

function randomInRange(n) {
    return Math.round(Math.random() * n);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}
