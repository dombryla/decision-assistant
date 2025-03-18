let sectors = [];

const rand = (m, M) => Math.random() * (M - m) + m;
const marker = document.querySelector(".marker");
const spinButton = document.querySelector(".spinButton");
const addButton = document.querySelector(".addButton");
const decision = document.querySelector(".decision");
const resetButton = document.querySelector(".resetButton");
const ctx = document.querySelector("#wheel").getContext("2d");
const canvaWidth = ctx.canvas.width;
const canvaHeight = ctx.canvas.width;
const radius = canvaWidth / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const friction = 0.995; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians

const getIndex = () =>
  Math.floor(sectors.length - (ang / TAU) * sectors.length) % sectors.length;

function drawSector(sector, i) {
  const arc = TAU / sectors.length;
  const ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(radius, radius);
  ctx.arc(radius, radius, radius, ang, ang + arc);
  ctx.lineTo(radius, radius);
  ctx.fill();
  // TEXT
  ctx.translate(radius, radius);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  ctx.font = "normal 20px sans-serif";
  ctx.fillText(sector.label, 30, 5);
  //
  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  spinButton.textContent = !angVel ? "Zakręć kołem" : sector.label;
  spinButton.style.background = sector.color;
  marker.style.background = sector.color;
}

function frame() {
  if (!angVel) return;
  angVel *= friction; // Decrement velocity by friction
  if (angVel < 0.002) angVel = 0; // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function generateRandomColorHex() {
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

const spin = () => {
  if (!angVel) angVel = rand(0.25, 0.45);
};

function init() {
  ctx.clearRect(0, 0, canvaWidth, canvaHeight);
  sectors.forEach((sector, i) => drawSector(sector, i));
  rotate(); // Initial rotation
  engine(); // Start engine
  spinButton.addEventListener("click", spin);
}

addButton.addEventListener("click", () => {
  if (!decision.value || angVel) return;
  sectors.push({ color: generateRandomColorHex(), label: decision.value });
  decision.value = "";
  init();
});

resetButton.addEventListener("click", () => {
  if (angVel) return;
  ctx.clearRect(0, 0, canvaWidth, canvaHeight);
  sectors = [];
  spinButton.removeEventListener("click", spin);
});
