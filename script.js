let playerX = 130;        // текущая позиция ракеты
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

// ===== Кнопки управления =====
function moveLeft() {
    if (!gameOver) playerX = Math.max(0, playerX - 40);
    player.style.left = playerX + "px";
}

function moveRight() {
    if (!gameOver) playerX = Math.min(260, playerX + 40);
    player.style.left = playerX + "px";
}

// ===== Создание астероидов с разными типами =====
function createBlock() {
    if (gameOver) return;

    const lanes = [20, 130, 240];
    let selectedLanes = [];

    if (level < 3) {
        // Уровень 1 и 2: по 1 красному астероиду
        selectedLanes.push(lanes[Math.floor(Math.random() * lanes.length)]);
    } else {
        // Уровень 3+: по 2 астероида в разных линиях
        let firstLane = lanes[Math.floor(Math.random() * lanes.length)];
        let secondLane;
        do {
            secondLane = lanes[Math.floor(Math.random() * lanes.length)];
        } while (secondLane === firstLane);
        selectedLanes = [firstLane, secondLane];
    }

    for (let lane of selectedLanes) {
        const block = document.createElement("div");

        // Выбор типа астероида
        let type = "red";
        if (level >= 3) {
            const types = ["red", "blue", "yellow"];
            type = types[Math.floor(Math.random() * types.length)];
        }

        block.className = "block " + type;
        block.style.left = lane + "px";
        block.style.top = "-60px";
        block.style.background = `url('asteroid_${type}.png') no-repeat center / contain`;
        document.getElementById("game").appendChild(block);

        let y = -60;
        let zigzag = 0;
        if (type === "blue") {
            zigzag = Math.random() < 0.5 ? 1 : -1; // направление зигзага
        }

        const fall = setInterval(() => {
            if (gameOver) {
                clearInterval(fall);
                block.remove();
                return;
            }

            y += speed;
            block.style.top = y + "px";

            // Синий астероид двигается зигзагом
            if (type === "blue") {
                let currentX = parseInt(block.style.left);
                currentX += zigzag;
                if (currentX < 0 || currentX > 260) zigzag *= -1;
                block.style.left = currentX + "px";
            }

            // Столкновение с ракетой
            if (y > 340 && Math.abs(parseInt(block.style.left) - playerX) < 35) {
                endGame();
            }

            // Ушел за экран
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

// ===== Обновление уровня =====
function updateLevel() {
    let newLevel = Math.floor(score / 10) + 1;

    if (newLevel !== level) {
        level = newLevel;
        levelEl.textContent = level;

        // Увеличиваем скорость
        speed = 3 + level * 1.2;

        // Частота спавна
        spawnRate = Math.max(400, 1100 - level * 120);

        clearInterval(blocksInterval);
        blocksInterval = setInterval(createBlock, spawnRate);
    }
}

// ===== Конец игры =====
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
    document.getElementById("game").appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highscoreEl.textContent = highScore;
    }

    restartBtn.style.display = "block";
}

// ===== Рестарт игры =====
function restartGame() {
    document.querySelectorAll(".block").forEach(b => b.remove());

    score = 0;
    scoreEl.textContent = 0;
    level = 1;
    levelEl.textContent = level;
    speed = 4;
    spawnRate = 1000;

    playerX = 130;
    player.style.left = playerX + "px";

    gameOver = false;
    restartBtn.style.display = "none";

    blocksInterval = setInterval(createBlock, spawnRate);
}

// ===== Старт игры =====
blocksInterval = setInterval(createBlock, spawnRate);
let blocksInterval;

// === Функция старта игры ===
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
    startBtn.style.display = "none"; // скрываем кнопку
    blocksInterval = setInterval(createBlock, spawnRate); // стартуем игру
});
