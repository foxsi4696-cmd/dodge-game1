document.addEventListener("DOMContentLoaded", () => {

const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const highscoreEl = document.getElementById("highscore");

let asteroids = [];
let score = 0;
let level = 1;
let gameOver = false;

const asteroidImages = [
  "asteroid-red.png",
  "asteroid-blue.png",
  "asteroid-yellow.png"
];

// PLAYER
let playerX = 120;
player.style.left = playerX + "px";
player.style.backgroundImage = "url(rocket.png)";
player.style.backgroundSize = "contain";
player.style.backgroundRepeat = "no-repeat";

// ASTEROID
function createAsteroid() {
  if (gameOver) return;

  const a = document.createElement("div");
  a.className = "block";

  const img = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
  a.style.backgroundImage = `url(${img})`;
  a.style.backgroundSize = "contain";
  a.style.backgroundRepeat = "no-repeat";

  a.style.left = Math.floor(Math.random() * 260) + "px";
  a.style.top = "-40px";

  game.appendChild(a);
  asteroids.push(a);
}

// GAME LOOP
function update() {
  if (gameOver) return;

  asteroids.forEach((a, i) => {
    let top = parseInt(a.style.top);
    a.style.top = top + (2 + level) + "px";

    // collision
    const aRect = a.getBoundingClientRect();
    const pRect = player.getBoundingClientRect();

    if (
      aRect.left < pRect.right &&
      aRect.right > pRect.left &&
      aRect.top < pRect.bottom &&
      aRect.bottom > pRect.top
    ) {
      gameOver = true;
      alert("GAME OVER");
    }

    if (top > 400) {
      a.remove();
      asteroids.splice(i, 1);
      score++;
      scoreEl.textContent = score;

      if (score % 10 === 0) {
        level++;
        levelEl.textContent = level;
      }
    }
  });

  requestAnimationFrame(update);
}

// CONTROLS
window.moveLeft = () => {
  playerX -= 20;
  if (playerX < 0) playerX = 0;
  player.style.left = playerX + "px";
};

window.moveRight = () => {
  playerX += 20;
  if (playerX > 260) playerX = 260;
  player.style.left = playerX + "px";
};

// START
setInterval(createAsteroid, 1000);
update();

});
