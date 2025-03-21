let sectors = [];

const rand = (m, M) => Math.random() * (M - m) + m;

const ctx = document.querySelector("#wheel").getContext("2d");
const marker = document.querySelector(".marker");
const decision = document.querySelector(".decision");
const prize = document.querySelector(".prize");

const spinButton = document.querySelector(".spin-button");
const addButton = document.querySelector(".add-button");
const resetButton = document.querySelector(".reset-button");
const buttons = [spinButton, addButton, resetButton];

const canvaWidth = ctx.canvas.width;
const canvaHeight = ctx.canvas.width;
const radius = canvaWidth / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const friction = 0.995; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians
let engineAnimate;

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
  prize.textContent = sector.label;
  prize.style.background = sector.color;
  marker.style.background = sector.color;
  if (angVel > 0) {
    toogleButtonState(false, buttons);
  } else {
    toogleButtonState(true, buttons);
  }
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
  engineAnimate = requestAnimationFrame(engine);
}

const spin = () => {
  if (!angVel) angVel = rand(0.25, 0.45);
};

function init() {
  ctx.clearRect(0, 0, canvaWidth, canvaHeight);
  if (engineAnimate) {
    cancelAnimationFrame(engineAnimate);
  }
  marker.classList.add("marker-styles");
  marker.innerHTML = "";
  sectors.forEach((sector, i) => drawSector(sector, i));
  rotate(); // Initial rotation
  engine(); // Start engine
  spinButton.addEventListener("click", spin);
}

function handleAddElementToWheel() {
  if (!decision.value || angVel) return;
  sectors.push({ color: generateRandomColorHex(), label: decision.value });
  decision.value = "";
  init();
}

addButton.addEventListener("click", () => {
  handleAddElementToWheel();
});

decision.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAddElementToWheel();
  }
});

resetButton.addEventListener("click", () => {
  if (angVel) return;
  ctx.clearRect(0, 0, canvaWidth, canvaHeight);
  sectors = [];
  marker.classList.remove("marker-styles");
  toogleButtonState(false, [spinButton, resetButton]);
  marker.innerHTML = "Dodaj opcje wyboru!";
  spinButton.removeEventListener("click", spin);
});

function toogleButtonState(isEnabled, buttons) {
  buttons.forEach((button) => {
    if (isEnabled) {
      button.classList.remove("disable-button");
    } else {
      button.classList.add("disable-button");
    }
  });
}

function generateRandomColorHex() {
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}
