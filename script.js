document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  const game = document.getElementById("game");
  const scoreEl = document.getElementById("score");
  const levelEl = document.getElementById("level");
  const highscoreEl = document.getElementById("highscore");
  const restartBtn = document.getElementById("restartBtn");

  let playerX = game.clientWidth / 2 - 24; // центр по ширине
  player.style.left = playerX + "px";

  let score = 0;
  let level = 1;
  let highscore = localStorage.getItem("highscore") || 0;
  highscoreEl.textContent = highscore;

  let asteroids = [];
  let gameOver = false;

  // ==== Управление ====
  function moveLeft() {
    playerX -= 20;
    if(playerX < 0) playerX = 0;
    player.style.left = playerX + "px";
  }

  function moveRight() {
    playerX += 20;
    if(playerX > game.clientWidth - 48) playerX = game.clientWidth - 48;
    player.style.left = playerX + "px";
  }

  window.moveLeft = moveLeft;
  window.moveRight = moveRight;

  // ==== Астероиды ====
  function spawnAsteroid() {
    if(gameOver) return;

    const asteroid = document.createElement("div");
    asteroid.className = "block";
    asteroid.style.left = Math.floor(Math.random() * (game.clientWidth - 40)) + "px";
    asteroid.style.top = "-40px";
    asteroid.style.background = 'url("asteroid.png") no-repeat center / contain';
    game.appendChild(asteroid);
    asteroids.push(asteroid);
  }

  function updateAsteroids() {
    for(let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      let y = parseInt(a.style.top);
      y += 4 + level; // скорость
      a.style.top = y + "px";

      const playerRect = player.getBoundingClientRect();
      const aRect = a.getBoundingClientRect();

      // столкновение
      if(!(playerRect.right < aRect.left ||
           playerRect.left > aRect.right ||
           playerRect.bottom < aRect.top ||
           playerRect.top > aRect.bottom)) {
        createExplosion(playerRect.left, playerRect.top);
        endGame();
        return;
      }

      // астероид ушёл вниз
      if(y > game.clientHeight) {
        a.remove();
        asteroids.splice(i,1);
        score++;
        scoreEl.textContent = score;
        if(score % 10 === 0) {
          level++;
          levelEl.textContent = level;
        }
        if(score > highscore) {
          highscore = score;
          highscoreEl.textContent = highscore;
          localStorage.setItem("highscore", highscore);
        }
      }
    }
  }

  // ==== Взрыв ====
  function createExplosion(x, y) {
    const exp = document.createElement("div");
    exp.className = "explosion";
    exp.style.left = x + "px";
    exp.style.top = y + "px";
    game.appendChild(exp);
    setTimeout(() => exp.remove(), 500);
  }

  // ==== Конец игры ====
  function endGame() {
    gameOver = true;
    restartBtn.style.display = "block";
  }

  // ==== Рестарт ====
  function restartGame() {
    asteroids.forEach(a => a.remove());
    asteroids = [];
    score = 0;
    level = 1;
    scoreEl.textContent = score;
    levelEl.textContent = level;
    playerX = game.clientWidth / 2 - 24;
    player.style.left = playerX + "px";
    gameOver = false;
    restartBtn.style.display = "none";
  }
  window.restartGame = restartGame;

  // ==== Цикл игры ====
  setInterval(spawnAsteroid, 1000);
  function gameLoop() {
    updateAsteroids();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
