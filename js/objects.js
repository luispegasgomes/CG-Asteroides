export class Ship {
  constructor(W, H) {
    this.x = W / 2;
    this.y = H / 2;
    this.r = 20;
    this.v = 0;
    this.a = 0.5 * Math.PI; // original: (90 / 180) * Math.PI
    this.rot = 0;
    this.collided = false;
    this.thrusting = false;
    this.thrust = { x: 0, y: 0 };
  }

  rotateLeft() {
    this.rot = (2 * Math.PI) / 50; // original: ((360 / 180) * Math.PI) / 10
  }

  rotateRight() {
    this.rot = (-2 * Math.PI) / 50; // original: ((-360 / 180) * Math.PI) / 10
  }

  increaseVelocity() {
    this.v = this.v > 7.5 ? this.v : Number((this.v + 0.2).toFixed(1));
  }

  decreaseVelocity() {
    this.v =
      this.v == 0
        ? (this.thrusting = false)
        : Number((this.v - 0.1).toFixed(1));
  }

  moveForward() {
    this.thrust.x = Math.cos(this.a) * this.v;
    this.thrust.y = Math.sin(this.a) * this.v;
  }

  stopRotation() {
    this.rot = 0;
  }

  updateAngle() {
    this.a += this.rot;
  }

  stop() {
    this.thrusting = false;
  }

  handleEdges(W, H) {
    //up - down
    if (this.y < 0 - this.r) this.y = H;
    // down - up
    if (this.y > H) this.y = 0;
    // left - right
    if (this.x < 0 - this.r) this.x = W;
    // right - left
    if (this.x > W) this.x = 0;
  }
}

export class Asteroid {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dX = Math.cos(Math.random()) * (Math.random() > 0.5 ? 2 : -2);
    this.dY = Math.sin(Math.random()) * (Math.random() > 0.5 ? 2 : -2);
  }

  move() {
    this.x += this.dX;
    this.y += this.dY;
  }

  handleEdges(W, H) {
    //up - down
    if (this.y < 0 - this.r) this.y = H + this.r;
    // down - up
    if (this.y > H + this.r) this.y = 0 - this.r;
    // left - right
    if (this.x < 0 - this.r) this.x = W + this.r;
    // right - left
    if (this.x > W + this.r) this.x = 0 - this.r;
  }
}

export class Game {
  constructor() {
    this.level = 1;
    this.numAsteroids = 3;
    this.score = 0;
    this.lifes = 3;
    this.decreasePermission = true;
    this.rays = [80, 60, 40, 20];
  }

  pickRay() {
    return this.rays[Math.floor(Math.random() * this.rays.length)];
  }
}
