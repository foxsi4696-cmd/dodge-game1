let playerX = 130;
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

// Движение ракеты
function moveLeft() {
    if (playerX > 0 && !gameOver) {
        playerX -= 20;
        player.style.left = playerX + "px";
    }
}

function moveRight() {
    if (playerX < 260 && !gameOver) {
        playerX += 20;
        player.style.left = playerX + "px";
    }
}

// Создание астероидов
function createBlock() {
    if (gameOver) return;

    const lanes = [20, 130, 240];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    const count = Math.random() < 0.4 ? 2 : 1; // шанс двух астероидов

    for (let i = 0; i < count; i++) {
        const block = document.createElement("div");
        block.className = "block";
        block.style.left = lane + "px";
        block.style.top = (-i * 60) + "px";
        document.getElementById("game").appendChild(block);

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

// Повышение уровня
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
    document.getElementById("game").appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highscoreEl.textContent = highScore;
    }

    restartBtn.style.display = "block";
}

// Рестарт
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

// Старт игры
blocksInterval = setInterval(createBlock, spawnRate);

// Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
let type = "red";
if(level >= 3){
    const types = ["red","blue","yellow"];
    type = types[Math.floor(Math.random()*types.length)];
}
block.className = "block " + type;
block.style.background = "url('asteroid_"+type+".png') no-repeat center / contain";

let zigzag = 0;
if(type==="blue"){
    zigzag = Math.random()<0.5 ? 1 : -1; // направление зигзага
}

const fall = setInterval(()=>{
    y += speed;
    block.style.top = y + "px";

    if(type==="blue") block.style.left = parseInt(block.style.left)+zigzag+"px";

    if(y>340 && Math.abs(parseInt(block.style.left)-playerX)<35) endGame();
    if(y>420){ clearInterval(fall); block.remove(); score++; scoreEl.textContent = score; updateLevel(); }
},20);
