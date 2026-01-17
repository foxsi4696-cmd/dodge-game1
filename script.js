let playerX = 130;        // текущая позиция ракеты
let targetX = playerX;     // куда движется ракета
let speedMove = 8;         // скорость скольжения ракеты

let score = 0;
let level = 1;
let speed = 4;
let spawnRate = 1000;
let gameOver = false;
let blocksInterval;

let highScore = localStorage.getItem("highScore") || 0;

const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const levelEl = document.getElementById("level");
const restartBtn = document.getElementById("restartBtn");

highscoreEl.textContent = highScore;
levelEl.textContent = level;

// Плавное движение ракеты
function animatePlayer() {
    if (Math.abs(playerX - targetX) < 1) {
        playerX = targetX;
    } else if (playerX < targetX) {
        playerX += speedMove;
    } else if (playerX > targetX) {
        playerX -= speedMove;
    }
    player.style.left = playerX + "px";
    requestAnimationFrame(animatePlayer);
}
animatePlayer();

// Кнопки управления
function moveLeft() {
    if (!gameOver) targetX = Math.max(0, targetX - 40);
}
function moveRight() {
    if (!gameOver) targetX = Math.min(260, targetX + 40);
}

// Свайп для телефонов
const gameDiv = document.getElementById("game");

gameDiv.addEventListener("touchstart", (e) => {
    e.preventDefault();
});

gameDiv.addEventListener("touchmove", (e) => {
    e.preventDefault();
    let touchX = e.touches[0].clientX;

    const rect = gameDiv.getBoundingClientRect();
    let relativeX = touchX - rect.left;

    targetX = Math.min(260, Math.max(0, relativeX - 20)); // центр ракеты на пальце
});

gameDiv.addEventListener("touchend", (e) => {
    playerX = targetX;
});

// Создание астероидов
function createBlock() {
    if (gameOver) return;

    const lanes = [20, 130, 240];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const count = Math.random() < 0.4 ? 2 : 1;

    for (let i = 0; i < count; i++) {
        const block = document.createElement("div");
        block.className = "block";
        block.style.left = lane + "px";
        block.style.top = (-i * 60) + "px";
        gameDiv.appendChild(block);

        let y = -i * 60;

        const fall = setInterval(() => {
            if (gameOver) {
                clearInterval(fall);
                block.remove();
                return;
            }

            y += speed;
            block.style.top = y + "px";

            if (y > 340 && Math.abs(block.offsetLeft - playerX) < 35) {
                endGame();
            }

            if (y > 420) {
                clearInterval(fall);
                block.remove();
                score++;
                scoreEl.textContent = score;
                updateLevel();
            }
        }, 20);
    }
}

// Обновление уровня
function updateLevel() {
    let newLevel = Math.floor(score / 10) + 1;
    if (newLevel !== level) {
        level = newLevel;
        levelEl.textContent = level;

        speed = 3 + level * 1.2;
        spawnRate = Math.max(400, 1100 - level * 120);

        clearInterval(blocksInterval);
        blocksInterval = setInterval(createBlock, spawnRate);
    }
}

// Конец игры
function endGame() {
    gameOver = true;
    clearInterval(blocksInterval);

    const explosion = document.createElement("div");
    explosion.style.width = "50px";
    explosion.style.height = "50px";
    explosion.style.position = "absolute";
    explosion.style.left = playerX + "px";
    explosion.style.bottom = "10px";
    explosion.style.background = "url('explosion.png') no-repeat center / contain";
    gameDiv.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highscoreEl.textContent = highScore;
    }

    restartBtn.style.display = "block";
}

// Рестарт игры
function restartGame() {
    document.querySelectorAll(".block").forEach(b => b.remove());

    score = 0;
    scoreEl.textContent = 0;
    level = 1;
    levelEl.textContent = level;
    speed = 4;
    spawnRate = 1000;

    playerX = 130;
    targetX = playerX;
    player.style.left = playerX + "px";

    gameOver = false;
    restartBtn.style.display = "none";

    blocksInterval = setInterval(createBlock, spawnRate);
}

// Старт игры
blocksInterval = setInterval(createBlock, spawnRate);
