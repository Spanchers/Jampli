const tower = document.querySelector(".tower");
const ball = document.querySelector(".ball");
const scoreDisplay = document.getElementById("score");

let angle = 0;
let ballY = 10;
let gravity = 2;
let velocity = 0;
let isFalling = true;
let score = 0;
let startX = 0;

// Свайпы для управления
document.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
});

document.addEventListener("touchmove", (event) => {
    let moveX = event.touches[0].clientX;
    let delta = moveX - startX;

    if (delta > 20) {
        angle -= 30;
        startX = moveX;
    } else if (delta < -20) {
        angle += 30;
        startX = moveX;
    }

    tower.style.transform = `rotate(${angle}deg)`;
});

// Проверка столкновений
function checkCollision() {
    const platforms = document.querySelectorAll(".platform");
    for (let platform of platforms) {
        let rect = platform.getBoundingClientRect();
        let ballRect = ball.getBoundingClientRect();

        if (
            ballRect.bottom >= rect.top &&
            ballRect.bottom <= rect.bottom &&
            Math.abs(rect.left + rect.width / 2 - ballRect.left - ballRect.width / 2) < 40
        ) {
            if (platform.classList.contains("hole")) {
                return false; // Мяч проваливается
            } else {
                platform.classList.add("broken"); // Ломаем платформу
                setTimeout(() => platform.remove(), 200);
                return true;
            }
        }
    }
    return false;
}

// Физика игры
function updateGame() {
    if (isFalling) {
        velocity += gravity;
        ballY += velocity;
        ball.style.top = `${ballY}px`;

        if (checkCollision()) {
            velocity = -10; // Отскок
        }

        if (ballY > 370) {
            ballY = 10;
            velocity = 0;
            score = 0;
            scoreDisplay.textContent = score;
        } else {
            score++;
            scoreDisplay.textContent = score;
        }
    }

    requestAnimationFrame(updateGame);
}

updateGame();
