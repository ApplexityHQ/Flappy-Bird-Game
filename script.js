  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  // ===== GAME STATE =====
  let gameOver = false;
  let score = 0;
  let frame = 0;

  // ===== BIRD =====
  const bird = {
    x: 80,
    y: 200,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -7
  };

  // ===== PIPES =====
  const pipes = [];
  const pipeWidth = 50;
  const pipeGap = 200;
  const pipeSpeed = 2;

  // ===== DRAW =====
  function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }

  function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
      // Bottom pipe
      ctx.fillRect(
        pipe.x,
        pipe.top + pipeGap,
        pipeWidth,
        canvas.height
      );
    });
  }

  function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }

  // ===== UPDATE =====
  function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height) {
      gameOver = true;
    }

    if (bird.y <= 0) {
      bird.y = 0;
      bird.velocity = 0;
    }
  }

  function updatePipes() {
    // Spawn pipes
    if (frame % 100 === 0) {
      const topHeight = Math.random() * 200 + 50;
      pipes.push({
        x: canvas.width,
        top: topHeight,
        passed: false
      });
    }

    pipes.forEach(pipe => {
      pipe.x -= pipeSpeed;

      // Collision
      if (
        bird.x < pipe.x + pipeWidth &&
        bird.x + bird.width > pipe.x &&
        (
          bird.y < pipe.top ||
          bird.y + bird.height > pipe.top + pipeGap
        )
      ) {
        gameOver = true;
      }

      // Score
      if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
        pipe.passed = true;
        score++;
      }
    });

    // Remove off-screen pipes
    while (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }
  }

  // ===== GAME LOOP =====
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    drawScore();

    updateBird();
    updatePipes();

    frame++;

    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    } else {
      showGameOver();
    }
  }

  // ===== GAME OVER =====
  function showGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "28px Arial";
    ctx.fillText("Game Over", 120, 220);

    ctx.font = "16px Arial";
    ctx.fillText("Click or Space to Restart", 95, 260);
  }

  // ===== RESET =====
  function resetGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    gameOver = false;
    gameLoop();
  }

  // ===== CONTROLS =====
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (gameOver) resetGame();
      else bird.velocity = bird.jump;
    }
  });

  canvas.addEventListener("click", () => {
    if (gameOver) resetGame();
    else bird.velocity = bird.jump;
  });

  // START GAME
  gameLoop();