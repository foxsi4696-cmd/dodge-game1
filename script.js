const asteroidImages = [
  "asteroid-red.png",
  "asteroid-blue.png",
  "asteroid-yellow.png"
];
const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const highscoreEl = document.getElementById("highscore");
const restartBtn = document.getElementById("restartBtn");

let playerX = 130;
let score = 0;
let level = 1;
let gameOver = false;
let asteroids = [];

let highscore = localStorage.getItem("highscore") || 0;
highscoreEl.textContent = highscore;

/* УПРАВЛЕНИЕ */
function moveLeft() {
  if (playerX > 0) {
    playerX -= 20;
    player.style.left = playerX + "px";
  }
}

function moveRight() {
  if (playerX < 260) {
    playerX += 20;
    player.style.left = playerX + "px";
  }
function createAsteroid() {
  if (gameOver) return;

  const a = document.createElement("div");
  a.className = "block";

  const img = asteroidImages[
    Math.floor(Math.random() * asteroidImages.length)
  ];

  a.style.backgroundImage = `url(${img})`;
  a.style.backgroundSize = "contain";
  a.style.backgroundRepeat = "no-repeat";

  a.style.left = Math.floor(Math.random() * 260) + "px";
  a.style.top = "-40px";

  game.appendChild(a);
  asteroids.push(a);
}

/* ВЗРЫВ */
function explosion(x, y) {
  const e = document.createElement("div");
  e.className = "explosion";
  e.style.left = x + "px";
  e.style.top = y + "px";
  game.appendChild(e);
  setTimeout(() => e.remove(), 400);
}

/* ОБНОВЛЕНИЕ */
function update() {
  if (gameOver) return;

  for (let i = asteroids.length - 1; i >= 0; i--) {
    const a = asteroids[i];
    a.style.top = a.offsetTop + (2 + level) + "px";

    if (
      a.offsetTop + 40 >= 350 &&
      a.offsetLeft < playerX + 40 &&
      a.offsetLeft + 40 > playerX
    ) {
      explosion(playerX, 350);
      endGame();
    }

    if (a.offsetTop > 400) {
      a.remove();
      asteroids.splice(i, 1);
      score++;
      scoreEl.textContent = score;

      if (score % 10 === 0) {
        level++;
        levelEl.textContent = level;
      }

      if (score > highscore) {
        highscore = score;
        highscoreEl.textContent = highscore;
        localStorage.setItem("highscore", highscore);
      }
    }
  }
}

/* КОНЕЦ */
function endGame() {
  gameOver = true;
  restartBtn.style.display = "block";
}

/* РЕСТАРТ */
function restartGame() {
  asteroids.forEach(a => a.remove());
  asteroids = [];
  score = 0;
  level = 1;
  scoreEl.textContent = 0;
  levelEl.textContent = 1;
  gameOver = false;
  restartBtn.style.display = "none";
}

setInterval(createAsteroid, 1000);
setInterval(update, 20);
