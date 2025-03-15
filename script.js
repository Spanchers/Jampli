const tower = document.querySelector(".tower");
const ball = document.querySelector(".ball");
const scoreDisplay = document.getElementById("score");

let angle = 0;
let ballY = 10;
let gravity = 2;
let fastGravity = 5; // Ускоренная гравитация
let isFalling = true;
let score = 0;
let startX = 0;
let isHolding = false; // Флаг для ускоренного падения

// Обработчик свайпов (влево/вправо)
document.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
    isHolding = true; // Ускоряем падение
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

document.addEventListener("touchend", () => {
    isHolding = false; // Обычная скорость падения
});

// Проверка, провалился ли мяч через дырку
function checkCollision() {
    const platforms = document.querySelectorAll(".platform");
    for (let platform of platforms) {
        let rect = platform.getBoundingClientRect();
        let ballRect = ball.getBoundingClientRect();

        // Если мяч на уровне платформы
        if (
            ballRect.bottom >= rect.top &&
            ballRect.bottom <= rect.bottom &&
            Math.abs(rect.left + rect.width / 2 - ballRect.left - ballRect.width / 2) < 40
        ) {
            if (platform.classList.contains("hole")) {
                // Мяч проваливается
                return false;
            } else {
                // Разрушение платформы
                platform.style.opacity = "0"; // Исчезновение
                platform.style.transform = "scale(0)"; // Сжатие
                setTimeout(() => platform.remove(), 300); // Удаление из DOM
                return true;
            }
        }
    }
    return false;
}

// Анимация падения
function updateGame() {
    if (isFalling) {
        ballY += isHolding ? fastGravity : gravity; // Ускоренное падение при удержании
        ball.style.top = `${ballY}px`;
        ball.style.transition = isHolding ? "top 0.05s linear" : "top 0.1s ease-out"; // Плавная анимация

        // Проверка столкновения
        if (checkCollision()) {
            isFalling = false;
            setTimeout(() => {
                isFalling = true;
            }, 200);
        } else {
            score++;
            scoreDisplay.textContent = score;
        }

        // Перезапуск игры при выходе за границы
        if (ballY > 370) {
            ballY = 10;
            score = 0;
            scoreDisplay.textContent = score;
        }
    }

    requestAnimationFrame(updateGame);
}

updateGame();
