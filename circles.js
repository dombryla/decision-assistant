var canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#canvas")
);
let ctx = canvas.getContext("2d");

var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;

canvas.width = windowWidth;
canvas.height = windowHeight;

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.dx = 1 * speed;
    this.dy = 1 * speed;
    this.hitCounter = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    ctx.fillText(this.text, this.x, this.y);

    ctx.lineWidth = 5;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    if (this.x + this.radius > windowWidth) {
      this.dx = -this.dx;
      this.hitCounter++;
    }
    if (this.x - this.radius < 0) {
      this.dx = -this.dx;
      this.hitCounter++;
    }

    if (this.y + this.radius > windowHeight) {
      this.dy = -this.dy;
      this.hitCounter++;
    }
    if (this.y - this.radius < 0) {
      this.dy = -this.dy;
      this.hitCounter++;
    }
    this.draw(ctx);
    this.text = this.hitCounter;
    this.x += this.dx;
    this.y += this.dy;
  }
}

// ctx.clearRect();

const createCircles = (circle) => {
  circle.draw(ctx);
};

const circles = [];

const randomNumber = (max, min) => {
  const result = Math.random() * (max - min) + min;
  return result;
};

for (let i = 0; i < 5; i++) {
  const radius = 100;
  let x = randomNumber(radius, windowWidth - radius);
  let y = randomNumber(radius, windowHeight - radius);
  let speed = Math.random() * 7;
  console.log(speed);
  const circle = new Circle(x, y, 100, "blue", 0, speed);
  circles.push(circle);
  createCircles(circle);
}

const updateCircle = () => {
  requestAnimationFrame(updateCircle);
  ctx.clearRect(0, 0, windowWidth, windowHeight);

  circles.forEach((circle) => {
    circle.update();
  });
};
updateCircle();
