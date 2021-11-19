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

let ship = new Ship(W, H);
let asteroids = [];
const game = new Game();

createAsteroids();

document.onkeydown = function (e) {
  if (e.key === "ArrowLeft" && ship && !ship.collided) {
    keys.arrowLeft = true;
    ship.rotateLeft();
  }
  if (e.key === "ArrowRight" && ship && !ship.collided) {
    keys.arrowRight = true;
    ship.rotateRight();
  }
  if (e.key === "ArrowUp" && ship && !ship.collided) {
    keys.arrowUp = true;
    ship.thrusting = true;
    ship.increaseVelocity();
  }

  ship.handleEdges(W, H);
};

document.onkeyup = function (e) {
  if (e.key === "ArrowLeft" && ship) {
    keys.arrowLeft = false;
    ship.stopRotation();
  }
  if (e.key === "ArrowRight" && ship) {
    keys.arrowRight = false;
    ship.stopRotation();
  }
  if (e.key === "ArrowUp" && ship) {
    keys.arrowUp = false;
  }
};

update();

function update() {
  // space
  ctx.fillStyle = "#131313";
  ctx.fillRect(0, 0, W, H);

  // texts
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.fillText(`Pontos: ${game.score}`, 15, 40);
  ctx.fillText(`Vidas: ${game.lifes}`, 180, 40);

  if (ship) {
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
  }

  if (ship && ship.thrusting) {
    if (keys.arrowUp == false) {
      ship.v =
        ship.v == 0
          ? (ship.thrusting = false)
          : Number((ship.v - 0.1).toFixed(1));
    }
    ship.moveForward();
    ship.x += ship.thrust.x;
    ship.y -= ship.thrust.y;
  }

  if (ship) {
    ship.handleEdges(W, H);
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

    // check collision
    if (
      ship &&
      game.decreasePermission &&
      distanceBetweenAS(ship.x, ship.y, asteroid.x, asteroid.y) <
      ship.r + asteroid.r
    ) {
      ship.collided = true;
      ship.stop();
      if (game.decreasePermission) {
        game.lifes--;
        game.decreasePermission = false;

        ctx.fillStyle = "orange";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        setTimeout(() => (ship = undefined), 250);
        setTimeout(() => (ship = new Ship(W, H)), 2000);
        setTimeout(() => (game.decreasePermission = true), 3000);
      }
    }
  }

  requestAnimationFrame(update);
}

function createAsteroids() {
  for (let index = 0; index < game.numAsteroids; index++) {
    let x, y;
    do {
      x = Math.random() * W;
      y = Math.random() * H;
    } while (distanceBetweenAS(ship.x, ship.y, x, y) < 160 + ship.r * 3);
    asteroids.push(new Asteroid(x, y, game.ray[Math.floor(Math.random() * game.ray.length)]));
  }
}

/** 
distance between Asteroid & Ship
 */
function distanceBetweenAS(shipX, shipY, astX, astY) {
  let dx = shipX - astX;
  let dy = shipY - astY;
  let D = Math.sqrt(dx * dx + dy * dy);
  return D;
}
