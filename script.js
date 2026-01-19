window.onload = function () {

let playerX = 130;
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
let level = 1;
let speed = 4;
let gameOver = false;
let spawnInterval = null;

const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const highscoreEl = document.getElementById("highscore");
const restartBtn = document.getElementById("restartBtn");

// Показываем рекорд сразу
highscoreEl.textContent = highscore;

// ===== УПРАВЛЕНИЕ =====
window.moveLeft = function () {
  if (gameOver) return;
  playerX = Math.max(0, playerX - 40);
  player.style.left = playerX + "px";
};

window.moveRight = function () {
  if (gameOver) return;
  playerX = Math.min(260, playerX + 40);
  player.style.left = playerX + "px";
};

// ===== ЗАПУСК ИГРЫ =====
function startGame() {
  gameOver = false;
  score = 0;
  level = 1;
  speed = 4;

  scoreEl.textContent = score;
  levelEl.textContent = level;

  restartBtn.style.display = "none";

  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(createAsteroid, 1000);
}

// ===== СОЗДАНИЕ АСТЕРОИДОВ =====
function createAsteroid() {
  if (gameOver) return;

  const lanes = [20, 130, 240];
  let lane = lanes[Math.floor(Math.random() * lanes.length)];

  const asteroid = document.createElement("div");
  asteroid.className = "block";

  // Тип астероида
  let type = "red";
  if (level >= 3) {
    const types = ["red", "blue", "yellow"];
    type = types[Math.floor(Math.random() * types.length)];
  }

  asteroid.style.background = `url("asteroid_${type}.png") no-repeat center / contain`;
  asteroid.style.left = lane + "px";
  asteroid.style.top = "-40px";

  game.appendChild(asteroid);

  let y = -40;
  let zigzag = type === "blue" ? (Math.random() < 0.5 ? 1 : -1) : 0;
  let localSpeed = type === "yellow" ? speed + 2 : speed;

  const fall = setInterval(() => {
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

    // Столкновение с ракетой
    let asteroidX = parseInt(asteroid.style.left);
    if (y > 330 && Math.abs(asteroidX - playerX) < 35) {
      // Создаем взрыв на месте ракеты
      createExplosion(playerX, 10);
      endGame();
      clearInterval(fall);
      asteroid.remove();
    }

    // Ушел за экран
    if (y > 420) {
      clearInterval(fall);
      asteroid.remove();
      score++;
      scoreEl.textContent = score;
      updateLevel();
    }
  }, 20);
}

// ===== ФУНКЦИЯ ВЗРЫВА =====
function createExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.style.width = "40px";
  explosion.style.height = "40px";
  explosion.style.position = "absolute";
  explosion.style.left = x + "px";
  explosion.style.bottom = y + "px";
  explosion.style.background = 'url("explosion.png") no-repeat center / contain';
  game.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
}

// ===== УРОВНИ =====
function updateLevel() {
  let newLevel = Math.floor(score / 10) + 1;
  if (newLevel !== level) {
    level = newLevel;
    levelEl.textContent = level;
    speed++;
  }
}

// ===== КОНЕЦ ИГРЫ =====
function endGame() {
  gameOver = true;
  clearInterval(spawnInterval);
  restartBtn.style.display = "block";

  // Сохраняем рекорд в localStorage
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("highscore", highscore);
    highscoreEl.textContent = highscore;
  }
}

// ===== RESTART =====
window.restartGame = function () {
  document.querySelectorAll(".block").forEach(b => b.remove());
  playerX = 130;
  player.style.left = playerX + "px";
  startGame();
};

// Автостарт игры
startGame();

};
