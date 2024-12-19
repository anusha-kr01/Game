const game = document.getElementById('game');
const player = document.getElementById('player');
const aliensContainer = document.getElementById('aliens');

const playerSpeed = 10;
const bulletSpeed = 5;
let bullets = [];
let aliens = [];
let alienDirection = 1; // 1 = right, -1 = left
let gameRunning = true; // Track if the game is active
let alienSpeed = 500; // Delay for alien movement (in ms)

// Create Aliens
function createAliens() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      const alien = document.createElement('div');
      alien.classList.add('alien');
      alien.style.left = `${col * 60}px`;
      alien.style.top = `${row * 50}px`;
      aliensContainer.appendChild(alien);
      aliens.push(alien);
    }
  }
}

// Move Aliens
function moveAliens() {
  if (!gameRunning) return;

  const alienBounds = aliensContainer.getBoundingClientRect();
  if (alienBounds.right >= game.clientWidth || alienBounds.left <= 0) {
    alienDirection *= -1; // Reverse direction
    aliens.forEach(alien => {
      const currentTop = parseInt(alien.style.top);
      alien.style.top = `${currentTop + 20}px`; // Move aliens down when direction changes
    });
  }

  aliens.forEach(alien => {
    const currentLeft = parseInt(alien.style.left);
    alien.style.left = `${currentLeft + 10 * alienDirection}px`; // Move aliens horizontally
  });

  // Check for Game Over (Aliens reaching bottom)
  checkGameOver();

  setTimeout(moveAliens, alienSpeed);
}

// Move Player
function movePlayer(direction) {
  if (!gameRunning) return;

  const currentLeft = parseInt(player.style.left) || 0;
  const newLeft = currentLeft + direction * playerSpeed;

  // Ensure the player stays within bounds
  if (newLeft >= 0 && newLeft <= game.clientWidth - player.offsetWidth) {
    player.style.left = `${newLeft}px`;
  }
}

// Fire Bullet
function fireBullet() {
  if (!gameRunning) return;

  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${player.offsetLeft + player.offsetWidth / 2 - 2.5}px`;
  bullet.style.top = `${player.offsetTop - 20}px`;
  game.appendChild(bullet);
  bullets.push(bullet);

  moveBullets();
}

// Move Bullets
function moveBullets() {
  bullets.forEach((bullet, index) => {
    const currentTop = parseInt(bullet.style.top);
    bullet.style.top = `${currentTop - bulletSpeed}px`; // Move bullet upwards

    // Remove bullets that go out of bounds
    if (currentTop <= 0) {
      bullet.remove();
      bullets.splice(index, 1);
    }

    // Check collision with aliens
    aliens.forEach((alien, alienIndex) => {
      if (isCollision(bullet, alien)) {
        // Remove both the alien and the bullet when a collision happens
        alien.remove();
        aliens.splice(alienIndex, 1);
        bullet.remove();
        bullets.splice(index, 1);
      }
    });
  });

  if (gameRunning) {
    requestAnimationFrame(moveBullets);
  }
}

// Check for collision between bullet and alien
function isCollision(bullet, alien) {
  const bulletRect = bullet.getBoundingClientRect();
  const alienRect = alien.getBoundingClientRect();

  return !(bulletRect.right < alienRect.left || bulletRect.left > alienRect.right || bulletRect.bottom < alienRect.top || bulletRect.top > alienRect.bottom);
}

// Check for Game Over
function checkGameOver() {
  aliens.forEach(alien => {
    if (parseInt(alien.style.top) >= game.clientHeight - 100) {
      endGame('Game Over! The aliens have invaded!');
    }
  });

  if (aliens.length === 0) {
    endGame('You Win! All aliens are destroyed!');
  }
}

// End Game
function endGame(message) {
  gameRunning = false; // Stop the game
  alert(message); // Show the game result

  // Add a restart button
  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart Game';
  restartButton.style.position = 'absolute';
  restartButton.style.top = '50%';
  restartButton.style.left = '50%';
  restartButton.style.transform = 'translate(-50%, -50%)';
  restartButton.style.padding = '10px 20px';
  restartButton.style.fontSize = '16px';
  restartButton.style.cursor = 'pointer';
  game.appendChild(restartButton);

  restartButton.addEventListener('click', () => {
    location.reload(); // Reload the page to restart the game
  });
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') movePlayer(-1);
  if (e.key === 'ArrowRight') movePlayer(1);
  if (e.key === ' ') fireBullet(); // Shoot when spacebar is pressed
});

// Start Game
createAliens();
moveAliens();
