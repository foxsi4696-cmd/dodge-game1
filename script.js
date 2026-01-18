let playerX = 130;
let score = 0;
let level = 1;
let speed = 4;
let spawnRate = 1000;
let gameOver = true;
let interval;

const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const highscoreEl = document.getElementById("highscore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let highScore = localStorage.getItem("highScore") || 0;
highscoreEl.textContent = highScore;

// ===== УПРАВЛЕНИЕ =====
function moveLeft() {
if (!gameOver) {
playerX = Math.max(0, playerX - 40);
player.style.left = playerX + "px";
}
}

function moveRight() {
if (!gameOver) {
playerX = Math.min(260, playerX + 40);
player.style.left = playerX + "px";
}
}

// ===== СТАРТ =====
startBtn.onclick = () => {
startBtn.style.display = "none";
restartBtn.style.display = "none";
startGame();
};

function startGame() {
score = 0;
level = 1;
speed = 4;
spawnRate = 1000;
gameOver = false;

scoreEl.textContent = score;
levelEl.textContent = level;

interval = setInterval(createAsteroid, spawnRate);
}

// ===== АСТЕРОИДЫ =====
function createAsteroid() {
if (gameOver) return;

const lanes = [20, 130, 240];
let count = level >= 3 ? 2 : 1;

let used = [];

for (let i = 0; i < count; i++) {
let lane;
do {
lane = lanes[Math.floor(Math.random() * lanes.length)];
} while (used.includes(lane));
used.push(lane);

let asteroid = document.createElement("div");
asteroid.classList.add("block");

let type = "red";
if (level >= 3) {
  type = ["red", "blue", "yellow"][Math.floor(Math.random() * 3)];
}

asteroid.style.background = `url("asteroid_${type}.png") no-repeat center / contain`;
asteroid.style.left = lane + "px";
asteroid.style.top = "-40px";
game.appendChild(asteroid);

let y = -40;
let zigzag = type === "blue" ? 1 : 0;
let localSpeed = type === "yellow" ? speed + 2 : speed;

let fall = setInterval(() => {
  if (gameOver) {
    clearInterval(fall);
    asteroid.remove();
    return;
  }

  y += localSpeed;
  asteroid.style.top = y + "px";

  if (type === "blue") {
    let x = parseInt(asteroid.style.left) + zigzag;
    if (x < 0 || x > 260) zigzag *= -1;
    asteroid.style.left = x + "px";
  }

  if (y > 340 && Math.abs(parseInt(asteroid.style.left) - playerX) < 35) {
    endGame();
  }

  if (y > 420) {
    clearInterval(fall);
    asteroid.remove();
    score++;
    scoreEl.textContent = score;
    updateLevel();
  }
}, 20);

}
}

// ===== УРОВНИ =====
function updateLevel() {
let newLevel = Math.floor(score / 10) + 1;
if (newLevel !== level) {
level = newLevel;
levelEl.textContent = level;
speed += 1;
}
}

// ===== КОНЕЦ ИГРЫ =====
function endGame() {
gameOver = true;
clearInterval(interval);

if (score > highScore) {
highScore = score;
localStorage.setItem("highScore", highScore);
highscoreEl.textContent = highScore;
}

restartBtn.style.display = "inline-block";
}

// ===== RESTART =====
function restartGame() {
document.querySelectorAll(".block").forEach(b => b.remove());
playerX = 130;
player.style.left = playerX + "px";
startGame();
}
