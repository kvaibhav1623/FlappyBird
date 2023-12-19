const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image();
birdImage.src = "angry bird.png"; // Replace with your bird image URL

const pipeImage = new Image();
pipeImage.src = "pipes.png"; // Replace with your pipe image URL

const backgroundImage = new Image();
backgroundImage.src = "bg.jpg"; // Replace with your background image URL

const bird = {
    x: 50,
    y: canvas.height / 2 - 10,
    width: 35,
    height: 35,
    color: "#3498db",
    velocity: 0,
    gravity: 0.25,
    jumpStrength: 6
};

const pipes = [];
const pipeWidth = 100;
const pipeGap = 200;
const pipeSpeed = 1.5;
const pipeSpawnRate = 190;
let score = 0;
let isGameOver = false;

const startModal = document.getElementById("startModal");
const gameOverModal = document.getElementById("gameOverModal");
const restartButton = document.getElementById("restartButton");
const startButton = document.getElementById("startButton");
const finalScore = document.getElementById("finalScore");

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(x, height) {
    ctx.drawImage(pipeImage, x, 0, pipeWidth, height);
    ctx.drawImage(pipeImage, x, height + pipeGap, pipeWidth, canvas.height - height - pipeGap);
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = "#000"; /* Changed scoreboard text color to black for better visibility */
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, canvas.width - 120, 30);
}

function drawStartText() {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Start the Game", canvas.width / 2 - 120, canvas.height / 2);
}

function update() {
    if (isGameOver) {
        return;
    }

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    } else if (bird.y > canvas.height - bird.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - pipeSpawnRate) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, height: pipeHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        if (
            bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].height || bird.y + bird.height > pipes[i].height + pipeGap)
        ) {
            gameOver();
            return;
        }

        if (pipes[i].x + pipeWidth < bird.x && !pipes[i].passed) {
            pipes[i].passed = true;
            score++;
        }

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

function draw() {
    drawBackground();
    
    if (!gameLoopStarted) {
        drawBird();
        drawStartText();
    } else {
        drawBird();
        pipes.forEach(pipe => drawPipe(pipe.x, pipe.height));
        drawScore();
    }
}

function resetGame() {
    bird.y = canvas.height / 2 - 10;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    isGameOver = false;
}

function gameOver() {
    isGameOver = true;
    gameOverModal.style.display = "block";
    finalScore.textContent = "Score: " + score; /* Displaying the final score */
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && !isGameOver) {
        bird.velocity = -bird.jumpStrength;
    }
});

canvas.addEventListener("click", function () {
    if (!gameLoopStarted) {
        startModal.style.display = "none";
        gameLoopStarted = true;
        gameLoop();
    }
});

startButton.addEventListener("click", function () {
    startModal.style.display = "none";
    resetGame();
    gameLoopStarted = true;
    gameLoop();
});

restartButton.addEventListener("click", function () {
    gameOverModal.style.display = "none";
    resetGame();
    gameLoopStarted = true;
    gameLoop();
});

let gameLoopStarted = false;

window.onload = function () {
    startModal.style.display = "block";
};
