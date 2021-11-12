export class Ship {
  constructor(W, H) {
    this.x = W / 2;
    this.y = H / 2;
    this.r = 15;
    this.a = 0.5 * Math.PI; // original: (90 / 180) * Math.PI
    this.rot = 0;
    this.thrusting = false;
    this.thrust = { x: 0, y: 0 };
  }

  rotateLeft() {
    this.rot = (2 * Math.PI) / 20; // original: ((360 / 180) * Math.PI) / 10
  }

  rotateRight() {
    this.rot = (-2 * Math.PI) / 20; // original: ((-360 / 180) * Math.PI) / 10
  }

  moveForward() {
    this.thrust.x = Math.cos(this.a) * 10;
    this.thrust.y = Math.sin(this.a) * 10;
  }

  stopRotation() {
    this.rot = 0;
  }

  updateAngle() {
    this.a += this.rot;
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
    this.dX = Math.cos(Math.random()) * (Math.random() > 0.5 ? 2 : -2) * 2;
    this.dY = Math.sin(Math.random()) * (Math.random() > 0.5 ? 2 : -2) * 2;
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
  }
}
