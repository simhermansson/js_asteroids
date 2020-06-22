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


class Ship extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.heading = 0;
        this.lastFiring = Date.now();
        this.firingDelay = 100;
        this.radius = 15;
    }

    update() {
        this.x = (this.x + this.dx) % canvas.width;
        if (this.x < 0) this.x += canvas.width;
        this.y = (this.y + this.dy) % canvas.height;
        if (this.y < 0) this.y += canvas.height;
    }


    hyperjump() {
        this.x = randomInRange(canvas.width);
        this.y = randomInRange(canvas.height);
    }


    fire() {
        let delta = Date.now() - this.lastFiring;
        if (delta > this.firingDelay) {
            this.lastFiring = Date.now();
            let bx = 10 * Math.cos(toRadians(this.heading)) + this.dx;
            let by = 10 * Math.sin(toRadians(this.heading)) - this.dy;
            let b = new Bullet(this.x + (2 * bx),this.y - (2 * by), bx, by);
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

    }
}


class Bullet extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.radius = 3;
    }

    update() {
        for (let i = 0; i < asteroids.length; i++) {
            let o = asteroids[i];
            if (o.contains(this.x, this.y)) {
                asteroids.splice(i, 1);
                o.kill();
                return true;
            }
        }
        return false;
    }
}


class Asteroid extends gameObject {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.shape = Math.round(randomInRange(3));
        this.points = [];
        this.alive = true;
        this.exploded = false;
        this.maxSpeed = 2;
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
        let rndSpeed = randomInRange(this.maxSpeed);
        let a = new MediumAsteroid(this.x, this.y, randomInRange(rndSpeed), randomInRange(rndSpeed));
        let b = new MediumAsteroid(this.x, this.y, randomInRange(-rndSpeed), randomInRange(-rndSpeed));
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
        score += this.points;
        let rndSpeed = randomInRange(this.maxSpeed);
        let a = new SmallAsteroid(this.x, this.y, randomInRange(rndSpeed), randomInRange(rndSpeed));
        let b = new SmallAsteroid(this.x, this.y, randomInRange(-rndSpeed), randomInRange(-rndSpeed));
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
        score += this.points;
    }
}


// Game constants
const GAME_SPEED = 1000 / 60;
const CANVAS_BORDER_COLOUR = "gray";
const CANVAS_BACKGROUND_COLOUR = "rgba(0, 0, 0, 0.5)";
const BLUR_AMOUNT = 5;

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
context.shadowColor = "white";
context.shadowOffsetX = 0;
context.shadowOffsetY = 0;
context.lineWidth = 2;


// Initialize game variables
let leftKey = false;
let rightKey = false;
let upKey = false;
let spaceKey = false;

let player = new Ship(canvas.width / 2, canvas.height / 2, 0, 0);

let lives = [];
for (let i = 0; i < 3; i++) addLife();
let asteroids = [];
let bullets = [];
let maxAsteroids = 5;
let maxBullets = 4;
let maxBulletSpeed = 2;
let score = 0;


// Start game
main();
document.addEventListener("keydown", function(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const SPACE_KEY = 32;
    const H_KEY = 72;
    if (event.keyCode === LEFT_KEY) leftKey = true;
    if (event.keyCode === RIGHT_KEY) rightKey = true;
    if (event.keyCode === UP_KEY) upKey = true;
    if (event.keyCode === SPACE_KEY) spaceKey = true;
    if (event.keyCode === H_KEY) player.hyperjump();
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
        drawText();

        if (asteroids.length === 0) {
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
    // Update asteroids
    for (let i = 0; i < asteroids.length; i++) {
        let o = asteroids[i];
        if (o.update()) {
            asteroids.splice(i, 1);
            i = Math.max(i-1, 0);
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
    player.update();
    player.draw();
}


function drawText() {
    context.strokeStyle = "white";
    context.shadowBlur = BLUR_AMOUNT;

    context.font = "30px hyperspace";
    context.strokeText(score, 10, 30);

    for (let i = 0; i < lives.length; i++) {
        lives[i].draw();
    }

    context.font = "20px hyperspace";
    context.strokeText(asteroids.length, canvas.width / 2, 20);
}


function spawnAsteroid() {
    let a = new LargeAsteroid(randomInRange(canvas.width),
                              randomInRange(canvas.height),
                              randomInRange(maxBulletSpeed),
                              randomInRange(maxBulletSpeed));
    asteroids.push(a);
}


function addLife() {
    let s = new Ship((1 + lives.length) * 30, 60, 0, 0);
    s.heading = 90;
    lives.push(s);
}


function removeLife() {
    lives.pop();
}


function handleInput() {
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


function randomInRange(n) {
    return Math.random() * n;
}


function toRadians(angle) {
    return angle * (Math.PI / 180);
}
