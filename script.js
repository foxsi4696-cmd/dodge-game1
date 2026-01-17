let playerX = 130;
let score = 0;
let gameOver = false;
let blocksInterval;

let highScore = localStorage.getItem("highScore") || 0;

const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const restartBtn = document.getElementById("restartBtn");

highscoreEl.textContent = highScore;

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

function createBlock() {
if (gameOver) return;

const block = document.createElement("div");
block.className = "block";
block.style.left = Math.random() * 260 + "px";
game.appendChild(block);

let y = 0;

const fall = setInterval(() => {
    if (gameOver) {
        clearInterval(fall);
        block.remove();
        return;
    }

    y += 4;
    block.style.top = y + "px";

    if (y > 350 && Math.abs(block.offsetLeft - playerX) < 40) {
        endGame();
    }

    if (y > 400) {
        clearInterval(fall);
        block.remove();
        score++;
        scoreEl.textContent = score;
    }
}, 20);

}

function endGame() {
gameOver = true;
clearInterval(blocksInterval);

if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highscoreEl.textContent = highScore;
}

restartBtn.style.display = "block";

}

function restartGame() {
document.querySelectorAll(".block").forEach(b => b.remove());

score = 0;
scoreEl.textContent = 0;
playerX = 130;
player.style.left = playerX + "px";
gameOver = false;

restartBtn.style.display = "none";
blocksInterval = setInterval(createBlock, 1000);

}

blocksInterval = setInterval(createBlock, 1000);

// Service Worker
if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("sw.js");
}
