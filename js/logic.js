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
};

let ship = new Ship(W, H);
let asteroids = [];
const game = new Game();

createAsteroids();

document.onkeydown = function (e) {
  if (e.key === "ArrowLeft" && !ship.collided) {
    keys.arrowLeft = true;
    ship.rotateLeft();
  }
  if (e.key === "ArrowRight" && !ship.collided) {
    keys.arrowRight = true;
    ship.rotateRight();
  }
  if (e.key === "ArrowUp" && !ship.collided) {
    ship.thrusting = true;
  }
  if (e.key === "ArrowDown") {
    ship.stop();
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
};

update();

function update() {
  // space
  ctx.fillStyle = "#131313";
  ctx.fillRect(0, 0, W, H);

  // texts
  // TODO: texto da pontuação
  // TODO: texto das vidas
  // dicas: criar um score e lifes na classe game e meter aqui
  // criar texto: power point 4, slide 28

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

  ship.handleEdges(W, H);

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
      distanceBetweenAS(ship.x, ship.y, asteroid.x, asteroid.y) <
      ship.r + asteroid.r
    ) {
      ship.collided = true;
      ship.stop();
      // TODO: explosão (bola laranja dentro da nave)
      setTimeout(() => (ship = new Ship(W, H)), 100); // create new ship after 0.1s
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
    asteroids.push(new Asteroid(x, y, 80));
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
