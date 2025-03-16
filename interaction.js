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
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = "grey";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    ctx.fillText(this.text, this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
  }

  changeColor(newColor) {
    this.color = newColor;
    this.draw(ctx);
  }

  clickCicle(xMouse, yMouse) {
    const distance = Math.sqrt(
      (xMouse - this.x) * (xMouse - this.x) +
        (yMouse - this.y) * (yMouse - this.y)
    );
    if (distance < this.radius) {
      this.changeColor("blue");
      return true;
    } else {
      this.changeColor("red");
      return false;
    }
  }
}

const circle = new Circle(200, 200, 100, "#f53", "");
circle.draw(ctx);
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  console.log(circle.clickCicle(x, y));
});
