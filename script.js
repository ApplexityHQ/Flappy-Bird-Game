  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  // ===== GAME STATE =====
  let gameOver = false;

  // ===== BIRD =====
  const bird = {
    x: 80,
    y: 200,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.6,
    jump: -10
  };

  // ===== DRAW =====
  function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }

  // ===== UPDATE =====
  function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Ground collision
    if (bird.y + bird.height >= canvas.height) {
      bird.y = canvas.height - bird.height;
      gameOver = true;
    }

    // Ceiling collision
    if (bird.y <= 0) {
      bird.y = 0;
      bird.velocity = 0;
    }
  }

  // ===== GAME LOOP =====
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    updateBird();

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
    gameOver = false;
    gameLoop();
  }

  // ===== CONTROLS =====
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (gameOver) {
        resetGame();
      } else {
        bird.velocity = bird.jump;
      }
    }
  });

  canvas.addEventListener("click", () => {
    if (gameOver) {
      resetGame();
    } else {
      bird.velocity = bird.jump;
    }
  });

  // START GAME
  gameLoop();