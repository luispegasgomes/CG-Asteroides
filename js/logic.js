import { Ship, Asteroid, Game } from "./objects.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 1;

const W = canvas.width,
  H = canvas.height;

let keys = {
  arrowLeft: false,
  arrowRight: false,
  arrowUp: false,
};

// space
ctx.fillStyle = "#131313";
ctx.fillRect(0, 0, W, H);

const ship = new Ship(W, H);
let asteroids = [];
const game = new Game();

createAsteroids();

document.onkeydown = function (e) {
  if (e.key === "ArrowLeft") {
    keys.arrowLeft = true;
    ship.rotateLeft();
  }
  if (e.key === "ArrowRight") {
    keys.arrowRight = true;
    ship.rotateRight();
  }
  if (e.key === "ArrowUp") {
    keys.arrowUp = true;
    ship.thrusting = true;
  }

  ship.handleEdges(W, H);
};

document.onkeyup = function (e) {
  if (e.key === "ArrowLeft") {
    keys.arrowLeft = false;
    ship.stopRotation();
  }
  if (e.key === "ArrowRight") {
    keys.arrowRight = false;
    ship.stopRotation();
  }
  if (e.key === "ArrowUp") {
    keys.arrowUp = false;
    ship.thrusting = false;
  }
};

setInterval(update, 100);

function update() {
  ctx.fillRect(0, 0, W, H);
  // triangular ship
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;

  ctx.beginPath();
  // top
  ctx.moveTo(
    ship.x + ship.r * Math.cos(ship.a),
    ship.y - ship.r * Math.sin(ship.a)
  );
  // move bottom left
  ctx.lineTo(
    ship.x - ship.r * (Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * (Math.sin(ship.a) - Math.cos(ship.a))
  );
  // move bottom right
  ctx.lineTo(
    ship.x - ship.r * (Math.cos(ship.a) - Math.sin(ship.a)),
    ship.y + ship.r * (Math.sin(ship.a) + Math.cos(ship.a))
  );
  ctx.closePath();
  ctx.stroke();

  ship.updateAngle();

  if (ship.thrusting) {
    ship.moveForward();
    ship.x += ship.thrust.x;
    ship.y -= ship.thrust.y;
  }

  // asteroids
  for (const asteroid of asteroids) {
    ctx.beginPath();
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.arc(asteroid.x, asteroid.y, asteroid.r, 0, 2 * Math.PI, false);
    ctx.stroke();

    // move
    asteroid.move();
    // handle edges
    asteroid.handleEdges(W, H);
  }
}

function createAsteroids() {
  for (let index = 0; index < game.numAsteroids; index++) {
    let x, y;
    do {
      x = Math.random() * W;
      y = Math.random() * H;
    } while (distanceBetweenAS(ship.x, ship.y, x, y) < 160 + ship.r * 3);
    asteroids.push(new Asteroid(x, y, 80));
  }
}

/** 
distance between Asteroid & Ship
[48:00 - 49:20]
 */
function distanceBetweenAS(shipX, shipY, astX, astY) {
  return Math.sqrt(Math.pow(astX - shipX, 2) + Math.pow(astY - shipY, 2));
}
