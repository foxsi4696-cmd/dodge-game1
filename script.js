let playerX = 130;
let score = 0;
let level = 1;
let speed = 4;
let gameOver = true;
let spawnInterval = null;

const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// ===== КНОПКИ =====
function moveLeft() {
  if (gameOver) return;
  playerX = Math.max(0, playerX - 40);
  player.style.left = playerX + "px";
}

function moveRight() {
  if (gameOver) return;
  playerX = Math.min(260, playerX + 40);
  player.style.left = playerX + "px";
}

// ===== START =====
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  startGame();
});

function startGame() {
  gameOver = false;
  score = 0;
  level = 1;
  speed = 4;

  scoreEl.textContent = score;
  levelEl.textContent = level;

  clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnAsteroid, 1000);
}

// ===== АСТЕРОИД =====
function spawnAsteroid() {
  if (gameOver) return;

  const lanes = [20, 130, 240];
  const lane = lanes[Math.floor(Math.random() * lanes.length)];

  const asteroid = document.createElement("div");
  asteroid.className = "block";
  asteroid.style.left = lane + "px";
  asteroid.style.top = "-40px";
  asteroid.style.background =
    'url("asteroid_red.png") no-repeat center / contain';

  game.appendChild(asteroid);

  let y = -40;

  const fall = setInterval(() => {
    if (gameOver) {
      clearInterval(fall);
      asteroid.remove();
      return;
    }

    y += speed;
    asteroid.style.top = y + "px";

    // столкновение
    if (
      y > 330 &&
      Math.abs(lane - playerX) < 40
    ) {
      endGame();
      clearInterval(fall);
      asteroid.remove();
    }

    if (y > 420) {
      clearInterval(fall);
      asteroid.remove();
      score++;
      scoreEl.textContent = score;

      if (score % 10 === 0) {
        level++;
        levelEl.textContent = level;
        speed++;
      }
    }
  }, 20);
}

// ===== GAME OVER =====
function endGame() {
  gameOver = true;
  clearInterval(spawnInterval);
  restartBtn.style.display = "inline-block";
}

// ===== RESTART =====
function restartGame() {
  document.querySelectorAll(".block").forEach(b => b.remove());
  playerX = 130;
  player.style.left = playerX + "px";
  startGame();
}
