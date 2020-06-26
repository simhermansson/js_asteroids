class gameObject {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = 2;
    }

    contains(x, y) {
        return Math.abs(this.x - x) <= this.radius &&
            Math.abs(this.y - y) <= this.radius;
    }

    update() {
        this.x = (this.x + this.dx) % canvas.width;
        if (this.x < 0) this.x += canvas.width;
        this.y = (this.y + this.dy) % canvas.height;
        if (this.y < 0) this.y += canvas.height;
    }

    draw() {
        context.fillStyle = "white";
        context.shadowBlur = BLUR_AMOUNT;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
}

class Ship extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.heading = 0;
        this.lastFiring = Date.now();
        this.firingDelay = 100;
        this.radius = 15;
        this.alive = false;
    }

    hyperjump() {
        spawnExplosion(this.x, this.y);
        this.x = randomInRange(0, canvas.width);
        this.y = randomInRange(0, canvas.height);
    }

    fire() {
        let delta = Date.now() - this.lastFiring;
        if (delta > this.firingDelay) {
            this.lastFiring = Date.now();
            let bx = 10 * Math.cos(toRadians(this.heading)) + this.dx;
            let by = -10 * Math.sin(toRadians(this.heading)) + this.dy;
            let b = new Bullet(this.x + (2 * bx),this.y + (2 * by), bx, by);
            bullets.push(b);
            if (bullets.length > maxBullets) {
                bullets.shift();
            }
        }
    }

    draw() {
        context.strokeStyle = "white";
        context.shadowBlur = BLUR_AMOUNT;
        context.beginPath();

        let outerLength = Math.sqrt(Math.pow(this.radius, 2) + Math.pow(this.radius, 2));

        let frontX = (this.radius * Math.cos(toRadians(this.heading)));
        let frontY = (this.radius * Math.sin(toRadians(this.heading)));
        let upperX = (outerLength * Math.cos(toRadians(35-this.heading)));
        let upperY = (outerLength * Math.sin(toRadians(35-this.heading)));
        let lowerX = (outerLength * Math.cos(toRadians(35+this.heading)));
        let lowerY = (outerLength * Math.sin(toRadians(35+this.heading)));
        let middleUpperX = ((outerLength-10) * Math.cos(toRadians(10-this.heading)));
        let middleUpperY = ((outerLength-10) * Math.sin(toRadians(10-this.heading)));
        let middleLowerX = ((outerLength-10) * Math.cos(toRadians(10+this.heading)));
        let middleLowerY = ((outerLength-10) * Math.sin(toRadians(10+this.heading)));

        context.moveTo(this.x + frontX, this.y - frontY);
        context.lineTo(this.x - lowerX, this.y + lowerY);
        context.lineTo(this.x - middleLowerX, this.y + middleLowerY);
        context.lineTo(this.x - middleUpperX, this.y - middleUpperY);
        context.lineTo(this.x - upperX, this.y - upperY);
        context.lineTo(this.x + frontX, this.y - frontY);

        context.stroke();
    }

    kill() {
        this.alive = false;
        bullets = [];
        spawnExplosion(this.x, this.y);
        if (removeLife()) {
            setTimeout(spawnPlayer, 3000);
        }
    }
}

class Saucer extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.maxSpeed = 1;
        this.alive = false;
        this.lastUpdate = Date.now();
        this.updateInterval = 2000;
        this.lastFiring = Date.now();
        this.firingInterval = 3000;
        this.bullets = [];
        this.maxBullets = 4;
    }

    update() {
        // Update position
        gameObject.prototype.update.call(this);

        // Update dy if interval is up
        if (this.lastUpdate + this.updateInterval < Date.now()) {
            this.lastUpdate = Date.now();
            this.dy = randomIntInRange(-this.maxSpeed, this.maxSpeed);
        }

        // Fire if interval is up
        if (this.lastFiring + this.firingInterval < Date.now()) {
            this.lastFiring = Date.now();
            this.fire();
        }

        if (player.alive && player.contains(this.x, this.y)) {
            player.kill();
        }

        updateObjectArray(this.bullets);
    }

    kill() {
        this.alive = false;
        this.bullets = [];
        score += this.points;
        scoreInterval += this.points;
        spawnExplosion(this.x, this.y);
    }

    contains(x, y) {
        return Math.abs(this.x - x) <= this.horizontalRadius &&
               Math.abs(this.y - y) <= this.verticalRadius;
    }

    draw() {
        context.strokeStyle = "white";
        context.shadowBlur = BLUR_AMOUNT;
        context.beginPath();

        context.moveTo(this.x - 2 * this.horizontalRadius / 5, this.y - this.verticalRadius / 2);
        context.lineTo(this.x + 2 * this.horizontalRadius / 5, this.y - this.verticalRadius / 2);
        context.moveTo(this.x - this.horizontalRadius / 5, this.y - this.verticalRadius);
        context.lineTo(this.x + this.horizontalRadius / 5, this.y - this.verticalRadius);
        context.moveTo(this.x - 2 * this.horizontalRadius / 5, this.y - this.verticalRadius / 2);
        context.lineTo(this.x - this.horizontalRadius / 5, this.y - this.verticalRadius);
        context.moveTo(this.x + 2 * this.horizontalRadius / 5, this.y - this.verticalRadius / 2);
        context.lineTo(this.x + this.horizontalRadius / 5, this.y - this.verticalRadius);
        context.moveTo(this.x - this.horizontalRadius, this.y);
        context.lineTo(this.x + this.horizontalRadius, this.y);
        context.moveTo(this.x - this.horizontalRadius, this.y);
        context.lineTo(this.x - 2 * this.horizontalRadius / 5, this.y - this.verticalRadius / 2);
        context.moveTo(this.x + this.horizontalRadius, this.y);
        context.lineTo(this.x + 2 * this.horizontalRadius / 5, this.y - this.verticalRadius / 2);
        context.moveTo(this.x - this.horizontalRadius + this.horizontalRadius / 5, this.y + this.verticalRadius / 2);
        context.lineTo(this.x + this.horizontalRadius - this.horizontalRadius / 5, this.y + this.verticalRadius / 2);
        context.moveTo(this.x - this.horizontalRadius + this.horizontalRadius / 5, this.y + this.verticalRadius / 2);
        context.lineTo(this.x - this.horizontalRadius, this.y);
        context.moveTo(this.x + this.horizontalRadius - this.horizontalRadius / 5, this.y + this.verticalRadius / 2);
        context.lineTo(this.x + this.horizontalRadius, this.y);

        context.stroke();
    }
}

class LargeSaucer extends Saucer {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.points = 200;
        this.accuracy = 0.3;
        this.verticalRadius = 15;
        this.horizontalRadius = 30;
    }

    fire() {
        let degrees = randomInRange(0, 360);
        let bx = 10 * Math.cos(degrees) + this.dx;
        let by = 10 * Math.sin(degrees) - this.dy;
        let b = new Bullet(this.x + (2 * bx),this.y + (2 * by), bx, by);
        b.firedBySaucer = true;
        this.bullets.push(b);
        if (this.bullets.length > this.maxBullets) {
            this.bullets.shift();
        }
    }
}

class SmallSaucer extends Saucer {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.points = 1000;
        this.verticalRadius = 10;
        this.horizontalRadius = 20;
    }

    fire() {
        let accuracy = randomInRange(0.9, 1.1);
        if (score > 70000) {
            this.accuracy = 1;
        }
        let radians = Math.atan2(this.y - player.y, player.x - this.x) * accuracy;
        let bx = 10 * Math.cos(radians) + this.dx;
        let by = -10 * Math.sin(radians) + this.dy;
        let b = new Bullet(this.x + (2 * bx),this.y + (2 * by), bx, by);
        b.firedBySaucer = true;
        this.bullets.push(b);
        if (this.bullets.length > this.maxBullets) {
            this.bullets.shift();
        }
    }
}

class Explosion extends Saucer {
    constructor(x, y) {
        super(x, y, 0, 0);
        this.startTime = Date.now();
        this.explosionTimer = 1500;
        this.debrisCount = 10;
        this.radius = 1;
        this.debris = [];
        for (let i = 0; i < this.debrisCount; i++) {
            let o = new gameObject(this.x, this.y, randomInRange(-0.5, 0.5), randomInRange(-0.5, 0.5));
            this.debris.push(o);
        }
    }

    update() {
        return this.startTime + this.explosionTimer < Date.now();
    }

    draw() {
        updateObjectArray(this.debris);
    }
}

class Bullet extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 3;
        this.firedBySaucer = false;
    }

    update() {
        gameObject.prototype.update.call(this);
        for (let i = 0; i < asteroids.length; i++) {
            let o = asteroids[i];
            if (o.contains(this.x, this.y)) {
                o.kill();
                return true;
            }
        }
        if (saucer.alive && !this.firedBySaucer && saucer.contains(this.x, this.y)) {
            saucer.kill();
            return true;
        }
        if (player.alive && player.contains(this.x, this.y)) {
            player.kill();
            return true;
        }
        return false;
    }
}

class Asteroid extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.shape = randomIntInRange(0, 2);
        this.points = [];
        this.alive = true;
        this.exploded = false;
        this.maxSpeed = 2;
    }

    update() {
        gameObject.prototype.update.call(this);
        if (player.alive && this.contains(player.x, player.y)) {
            player.kill();
        }
        return !this.alive;
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
        timeLastDestroyed = Date.now();
        score += this.points;
        scoreInterval += this.points;
        spawnExplosion(this.x, this.y);

        let a = new MediumAsteroid(this.x, this.y, randomInRange(-this.maxSpeed, this.maxSpeed),
            randomInRange(-this.maxSpeed, this.maxSpeed));
        let b = new MediumAsteroid(this.x, this.y, randomInRange(-this.maxSpeed, this.maxSpeed),
            randomInRange(-this.maxSpeed, this.maxSpeed));
        asteroids.push(a);
        asteroids.push(b);
    }
}

class MediumAsteroid extends Asteroid {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 20;
        this.points = 50;
    }

    kill() {
        this.alive = false;
        timeLastDestroyed = Date.now();
        score += this.points;
        scoreInterval += this.points;
        spawnExplosion(this.x, this.y);

        let a = new SmallAsteroid(this.x, this.y, randomInRange(-this.maxSpeed, this.maxSpeed),
                                                  randomInRange(-this.maxSpeed, this.maxSpeed));
        let b = new SmallAsteroid(this.x, this.y, randomInRange(-this.maxSpeed, this.maxSpeed),
                                                  randomInRange(-this.maxSpeed, this.maxSpeed));
        asteroids.push(a);
        asteroids.push(b);
    }
}

class SmallAsteroid extends Asteroid {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 10;
        this.points = 100;
    }

    kill() {
        this.alive = false;
        timeLastDestroyed = Date.now();
        score += this.points;
        scoreInterval += this.points;
        spawnExplosion(this.x, this.y);
    }
}


// Game constants
const GAME_SPEED = 1000 / 60;
const CANVAS_BORDER_COLOUR = "gray";
const CANVAS_BACKGROUND_COLOUR = "rgba(0, 0, 0, 0.5)";
const BLUR_AMOUNT = 5;

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
configureWindow();

// Initialize game variables
let leftKey = false;
let rightKey = false;
let upKey = false;
let spaceKey = false;

let gameMode = "intro";
let introHighScores = false;
let lives = [];
let asteroids = [];
let bullets = [];
let explosions = [];
let minAsteroids = 4;
let maxAsteroids = 6;
let maxBullets = 4;
let maxBulletSpeed = 2;
let score = 0;
let scoreInterval = 0;
let highScore = 0;
let highScores = [];
loadHighScores();
setInterval(loadHighScores, 1000);
let flashOn = true;
let initials = [null, null, null];
let currentInitial = 0;

let startTime = Date.now();
let introTime = 3000;
let endTime = null;
let timeLastDestroyed = Date.now();
let roundTimeout = 4000;
let lastSaucer = Date.now();
let saucerInterval = 30000;

let saucer = new SmallSaucer(0, 0, 0, 0);
saucer.alive = false;
let player = null;
spawnPlayer();
player.alive = false;


// Start game
main();

document.addEventListener("keydown", function(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const SPACE_KEY = 32;
    const H_KEY = 72;

    if (gameMode === "intro" || gameMode === "game") {
        if (event.keyCode === LEFT_KEY) leftKey = true;
        if (event.keyCode === RIGHT_KEY) rightKey = true;
        if (event.keyCode === UP_KEY) upKey = true;
        if (event.keyCode === SPACE_KEY && gameMode === "intro") {
            startGame();
        } else if (event.keyCode === SPACE_KEY) spaceKey = true;
        if (player.alive && event.keyCode === H_KEY) player.hyperjump();
    } else if (gameMode === "end") {
        if (event.keyCode === LEFT_KEY) endScreenLeft();
        if (event.keyCode === RIGHT_KEY) endScreenRight();
        if (event.keyCode === SPACE_KEY) endScreenSpace();
    }
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

window.addEventListener("resize", configureWindow, false);

function main() {
    setTimeout(function onTick() {
        clearCanvas();
        updateObjects();

        if (gameMode === "intro") {
            drawIntroText();
            score = 0;
            while (asteroids.length < 10) {
                spawnAsteroids(1);
            }
            if (!saucer.alive) {
                spawnSaucer();
            }
        } else if (gameMode === "game") {
            drawGameText();
            handlePlayerInput();

            if (asteroids.length === 0 && timeLastDestroyed + roundTimeout < Date.now()) {
                spawnAsteroids();
            }

            if (scoreInterval >= 10000) {
                addLife();
                scoreInterval %= 10000;
            }

            if (!saucer.alive && lastSaucer + saucerInterval < Date.now()) {
                lastSaucer = Date.now();
                spawnSaucer();
            }
        } else if (gameMode === "end") {
            drawEndText();
        }

        main();
    }, GAME_SPEED);
}

function updateObjects() {
    updateObjectArray(explosions);
    updateObjectArray(asteroids)
    updateObjectArray(bullets);

    if (saucer.alive) {
        saucer.update();
        saucer.draw();
    }

    if (gameMode === "game" && player.alive) {
        player.update();
        player.draw();
    }
}

function updateObjectArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        let o = arr[i];
        o.draw();
        if (o.update()) {
            arr.splice(i, 1);
            i = Math.max(i-1, 0);
        }
    }
}

function spawnPlayer() {
    let clear = true;
    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i].contains(canvas.width / 2, canvas.height / 2)) {
            clear = false;
            break;
        }
    }
    if (saucer.alive && saucer.contains(canvas.width / 2, canvas.height / 2)) {
        clear = false;
    }
    if (clear) {
        player = new Ship(canvas.width / 2, canvas.height / 2, 0, 0);
        player.alive = true;
    } else {
        setTimeout(spawnPlayer, 1000);
    }
}

function spawnExplosion(x, y) {
    let explosion = new Explosion(x, y);
    explosions.push(explosion);
}

function spawnSaucer() {
    if (score >= 40000 || randomIntInRange(0, 1) === 0) {
        saucer = new SmallSaucer(0, randomIntInRange(0, canvas.height),
                                 -saucer.maxSpeed, saucer.maxSpeed);
        saucer.alive = true;
    } else {
        saucer = new LargeSaucer(0, randomIntInRange(0, canvas.height),
                                 -saucer.maxSpeed, saucer.maxSpeed);
        saucer.alive = true;
    }
}

function spawnAsteroids() {
    let numberToSpawn = randomIntInRange(minAsteroids, maxAsteroids);
    for (let i = 0; i < numberToSpawn; i++) {
        let side = randomIntInRange(0, 3);
        if (side === 0) {
            let a = new LargeAsteroid(0,
                randomInRange(0, canvas.height),
                randomInRange(-maxBulletSpeed, maxBulletSpeed),
                randomInRange(-maxBulletSpeed, maxBulletSpeed));
            asteroids.push(a);
        } else if (side === 1) {
            let a = new LargeAsteroid(randomInRange(0, canvas.width),
                0,
                randomInRange(-maxBulletSpeed, maxBulletSpeed),
                randomInRange(-maxBulletSpeed, maxBulletSpeed));
            asteroids.push(a);
        } else if (side === 2) {
            let a = new LargeAsteroid(canvas.width,
                randomInRange(0, canvas.height),
                randomInRange(-maxBulletSpeed, maxBulletSpeed),
                randomInRange(-maxBulletSpeed, maxBulletSpeed));
            asteroids.push(a);
        } else if (side === 3) {
            let a = new LargeAsteroid(randomInRange(0, canvas.width),
                canvas.height,
                randomInRange(-maxBulletSpeed, maxBulletSpeed),
                randomInRange(-maxBulletSpeed, maxBulletSpeed));
            asteroids.push(a);
        }
    }
}

function startGame() {
    score = 0;
    asteroids = [];
    bullets = [];
    for (let i = 0; i < 3; i++) addLife();
    saucer.alive = false;
    gameMode = "game";
    spawnPlayer();
}

function endGame() {
    gameMode = "end";
    endTime = Date.now();
}

function addLife() {
    let s = new Ship((1 + lives.length) * 30, 60, 0, 0);
    s.heading = 90;
    lives.push(s);
}

function removeLife() {
    lives.pop();
    if (lives.length === 0) {
        endGame();
        return false;
    }
    return true;
}

function handlePlayerInput() {
    if (player.alive) {
        if (leftKey) {
            player.heading = (player.heading + 5) % 360;
        }
        if (rightKey) {
            player.heading = (player.heading - 5) % 360;
        }
        if (upKey) {
            player.dx += 0.1 * Math.cos(toRadians(player.heading));
            player.dy -= 0.1 * Math.sin(toRadians(player.heading));
        }
        if (spaceKey) {
            player.fire();
        }
    }
}

function clearCanvas() {
    context.shadowBlur = 0;
    context.fillStyle = CANVAS_BACKGROUND_COLOUR;
    context.strokestyle = CANVAS_BORDER_COLOUR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawIntroText() {
    context.strokeStyle = "white";
    context.shadowBlur = BLUR_AMOUNT;

    drawScores();
    drawCoins();

    // Print flashing push start
    let flashInterval = 500;
    if (startTime + flashInterval > Date.now()) {
        if (flashOn) {
            context.font = "30px hyperspace";
            context.textAlign = "center";
            let pushStart = "push start";
            context.strokeText(pushStart, canvas.width / 2, canvas.height / 4);
        }
    } else {
        startTime = Date.now();
        flashOn = !flashOn;
    }

    // Print 1 coin 1 start
    context.font = "30px hyperspace";
    context.textAlign = "center";
    let oneCoin = "1 coin 1 start";
    context.strokeText(oneCoin, canvas.width / 2, 5 * canvas.height / 6);
}

function drawGameText() {
    context.strokeStyle = "white";
    context.shadowBlur = BLUR_AMOUNT;

    drawScores();

    // Print player one text if first 3 seconds
    if (startTime + introTime > Date.now()) {
        context.font = "30px hyperspace";
        context.textAlign = "center";
        let playerText = "player 1";
        context.strokeText(playerText, canvas.width / 2, canvas.height / 4);
    }

    // Print lives left
    for (let i = 0; i < lives.length; i++) {
        lives[i].draw();
    }
}

function drawEndText() {
    context.strokeStyle = "white";
    context.shadowBlur = BLUR_AMOUNT;

    drawScores();
    drawCoins();

    let gameOverInterval = 3000;
    if (endTime + gameOverInterval > Date.now()) {
        context.font = "30px hyperspace";
        context.textAlign = "center";
        let gameOver = "game over";
        context.strokeText(gameOver, canvas.width / 2, canvas.height / 4);
    } else if (isHighScore()) {
        asteroids = [];
        bullets = [];
        saucer.alive = false;

        context.font = "30px hyperspace";
        context.textAlign = "left";
        let leftAlign = -canvas.width / 4;
        let lineHeight = 30;
        let tenBest = "your score is one of the ten best\n";
        let enterInitials = "please enter your initials\n";
        let pushRotate = "push rotate to select letter";
        let pushHyperspace = "push hyperspace when letter is correct"
        context.strokeText(tenBest, canvas.width / 2 + leftAlign, canvas.height / 4);
        context.strokeText(enterInitials, canvas.width / 2 + leftAlign, canvas.height / 4 + lineHeight);
        context.strokeText(pushRotate, canvas.width / 2 + leftAlign, canvas.height / 4 + 2 * lineHeight);
        context.strokeText(pushHyperspace, canvas.width / 2 + leftAlign, canvas.height / 4 + 3 * lineHeight);

        context.font = "50px hyperspace";
        context.textAlign = "center";
        let underlines = "";
        for (let i = 0; i < initials.length; i++) {
            if (initials[i] != null) {
                underlines += initials[i];
            } else {
                underlines += "_";
            }
        }
        context.strokeText(underlines, canvas.width / 2, 2 * canvas.height / 3);
    } else {
        introHighScores = true;
        gameMode = "intro";
    }
}

function endScreenLeft() {
    if (initials[currentInitial] == null) {
        initials[currentInitial] = "a";
    }
    let char = initials[currentInitial].charCodeAt(0) % 97 - 1;
    if (char < 0) {
        char = String.fromCharCode(97 + 25);
    } else {
        char = String.fromCharCode(97 + char);
    }
    initials[currentInitial] = char;
}

function endScreenRight() {
    if (initials[currentInitial] == null) {
        initials[currentInitial] = "a";
    }
    initials[currentInitial] = String.fromCharCode((initials[currentInitial].charCodeAt(0) % 97 + 1) % 26 + 97);
}

function endScreenSpace() {
    if (initials[currentInitial] != null) {
        currentInitial++;
        if (currentInitial === 3) {
            addHighScore()
            introHighScores = true;
            gameMode = "intro";
        }
    }
}

function drawScores() {
    // Print score
    context.font = "30px hyperspace";
    context.textAlign = "left";
    context.strokeText(padInteger(score), 10, 30);

    // Print high-score
    context.font = "20px hyperspace";
    context.textAlign = "center";
    context.strokeText(padInteger(highScore), canvas.width / 2, 20);
}

/**
 * Print right upper number, possibly coins. Always 0 in our case.
 */
function drawCoins() {
    context.font = "30px hyperspace";
    context.textAlign = "right";
    context.strokeText("00", canvas.width - 10, 30);
}

function loadHighScores() {
    highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
    if (highScores[0] != null) highScore = highScores[0].score;
}

function saveHighScores() {
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function isHighScore() {
    if (highScores.length < 10) return true;
    for (let i = 0; i < highScores.length; i++) {
        if (highScores[i].score < score) return true;
    }
    return false;
}

/**
 * Loop through highScore list until proper place found, then
 * replace value there and push it back. The highScore list holds
 * only 10 elements and the initials is reset with this function.
 */
function addHighScore() {
    highScores.push({
        score:score,
        name:"hej"
    });
    highScores.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
    if (highScores.length > 10) highScores.pop();
    saveHighScores();
    initials = [null, null, null];
    currentInitial = 0;
}

/**
 * 'Make 0 into "00"'.
 */
function padInteger(i) {
    if (i.toString().length === 1) {
        return "0" + i.toString();
    }
    return i.toString();
}

/**
 * Output is random double x where min <= x < max.
 */
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Output is random integer x where min <= x <= max.
 */
function randomIntInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convert degrees to radians.
 */
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

/**
 * Translate size so that objects can be drawn in a
 * similar size across monitors with different resolutions.
 */
function toWindowSize(n) {
    return canvas.width / n;
}

/**
 * Set window size. Also set drawing variables
 * that are shared across the game.
 */
function configureWindow() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    context.shadowColor = "white";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.lineWidth = 2;
}