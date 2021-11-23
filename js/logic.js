import { Ship, Asteroid, Game, Shoot } from "./objects.js";

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
let lasers = [];
let game = new Game();

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
  if (e.key === " " && ship && !ship.collided) {
    lasers.push(new Shoot(ship));
  }

  if (ship) ship.handleEdges(W, H);
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
  if (game.lifes === 0) {
    if (confirm("Do you want to play again?")) location.reload();
    else location.href = "./index.html";
  } else {
    // space
    ctx.fillStyle = "#131313";
    ctx.fillRect(0, 0, W, H);

    // texts
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.fillText(`${game.score}`, 15, 40);
    ctx.fillText(`Vidas: ${game.lifes}`, 15, 80);
    ctx.fillText(`${game.level} / ∞`, W - 150, 40);

    if (asteroids.length === 0) {
      game.level++;
      game.numAsteroids++;
      createAsteroids();
    }

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
      if (keys.arrowUp == false) ship.decreaseVelocity();

      ship.moveForward();
      ship.x += ship.thrust.x;
      ship.y -= ship.thrust.y;
    }

    if (ship) {
      ship.handleEdges(W, H);
    }

    for (let i = 0; i < lasers.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(lasers[i].x, lasers[i].y, lasers[i].r, 0, 2 * Math.PI, false);
      ctx.fill();
      lasers[i].move();
      // check out of screen
      if (lasers[i].isGone(W, H)) {
        lasers.splice(i, 1);
      }

      // check collision with asteroid and increase points
      for (let j = 0; j < asteroids.length; j++) {
        if (
          lasers.length !== 0 &&
          distance(lasers[i].x, lasers[i].y, asteroids[j].x, asteroids[j].y) <
            lasers[i].r + asteroids[j].r
        ) {
          game.score += game.getPointsByAsteroidRad(asteroids[j].r);
          lasers.splice(i, 1);
          asteroids.splice(j, 1);
        }
      }
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
        distance(ship.x, ship.y, asteroid.x, asteroid.y) < ship.r + asteroid.r
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
}

function createAsteroids() {
  for (let index = 0; index < game.numAsteroids; index++) {
    let x, y;
    do {
      x = Math.random() * W;
      y = Math.random() * H;
    } while (distance(ship.x, ship.y, x, y) < 160 + ship.r * 3);
    asteroids.push(new Asteroid(x, y, game.pickRadius()));
  }
}

/** 
distance between object & Ship
 */
function distance(objX, objY, astX, astY) {
  let dx = objX - astX;
  let dy = objY - astY;
  let D = Math.sqrt(dx * dx + dy * dy);
  return D;
}
