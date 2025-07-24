const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Image preloading
const images = {
  lock: new Image(),
  key: new Image(),
  loaded: 0
};

// Load images
images.lock.src = 'home.png'; // Using home.png as lock image
images.key.src = 'key.png';   // Using key.png as key image

images.lock.onload = () => {
  images.loaded++;
  if (images.loaded === 2) {
    console.log('All images loaded successfully');
  }
};

images.key.onload = () => {
  images.loaded++;
  if (images.loaded === 2) {
    console.log('All images loaded successfully');
  }
};

// Game state variables
let gameState = {
  isPlaying: false,
  difficulty: 'medium',
  rows: 12,
  cols: 12,
  cellSize: 0,
  player: { x: 1, y: 1 },
  end: { x: 1, y: 1 },
  moves: 0,
  maze: [],
  colors: {
    wall: '#34495e',
    path: '#ecf0f1',
    player: '#3498db',
    end: '#e74c3c',
    playerGlow: '#5dade2',
    endGlow: '#f1948a'
  }
};

// Difficulty settings
const difficultySettings = {
  easy: { rows: 8, cols: 8, name: 'Easy' },
  medium: { rows: 12, cols: 12, name: 'Medium' },
  hard: { rows: 16, cols: 16, name: 'Hard' }
};

// Initialize the game
function startGame(difficulty) {
  gameState.difficulty = difficulty;
  const settings = difficultySettings[difficulty];
  gameState.rows = settings.rows;
  gameState.cols = settings.cols;
  gameState.cellSize = Math.min(canvas.width / gameState.cols, canvas.height / gameState.rows);
  
  // Adjust canvas size based on difficulty
  canvas.width = gameState.cols * gameState.cellSize;
  canvas.height = gameState.rows * gameState.cellSize;
  
  // Show loading message
  showLoadingMessage();
  
  // Generate a solvable maze with a small delay to show loading
  setTimeout(() => {
    generateMaze();
    
    // Set player and end positions
    gameState.player = { x: 1, y: 1 };
    gameState.end = { x: gameState.cols - 2, y: gameState.rows - 2 };
    gameState.moves = 0;
    gameState.isPlaying = true;
    
    // Update UI
    document.getElementById('current-difficulty').textContent = settings.name;
    updateMoveCounter();
    hideLoadingMessage();
    showGameScreen();
    
    // Draw the maze
    drawMaze();
  }, 300);
}

// Show loading message
function showLoadingMessage() {
  const loading = document.createElement('div');
  loading.id = 'loading-message';
  loading.className = 'loading-overlay';
  loading.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p>Generating new maze...</p>
    </div>
  `;
  document.body.appendChild(loading);
}

// Hide loading message
function hideLoadingMessage() {
  const loading = document.getElementById('loading-message');
  if (loading) {
    loading.remove();
  }
}

// Generate a solvable maze using recursive backtracking with enhanced randomization
function generateMaze() {
  // Add random seed for more variety
  const seed = Date.now() + Math.random() * 1000;
  
  // Initialize maze with all walls
  gameState.maze = Array(gameState.rows).fill().map(() => Array(gameState.cols).fill(1));
  
  const visited = Array(gameState.rows).fill().map(() => Array(gameState.cols).fill(false));
  const stack = [];
  
  // Randomly choose starting position (must be odd coordinates for proper maze generation)
  const startPositions = [];
  for (let y = 1; y < gameState.rows - 1; y += 2) {
    for (let x = 1; x < gameState.cols - 1; x += 2) {
      startPositions.push({x, y});
    }
  }
  
  const randomStart = startPositions[Math.floor(Math.random() * startPositions.length)];
  let currentX = randomStart.x;
  let currentY = randomStart.y;
  
  gameState.maze[currentY][currentX] = 0;
  visited[currentY][currentX] = true;
  stack.push({x: currentX, y: currentY});
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    currentX = current.x;
    currentY = current.y;
    
    const neighbors = getUnvisitedNeighbors(currentX, currentY, visited);
    
    if (neighbors.length > 0) {
      // Enhanced randomization: sometimes choose the last neighbor for more winding paths
      let randomNeighbor;
      if (Math.random() < 0.7) {
        // 70% chance: choose random neighbor
        randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      } else {
        // 30% chance: choose first or last neighbor for more structured paths
        randomNeighbor = Math.random() < 0.5 ? neighbors[0] : neighbors[neighbors.length - 1];
      }
      
      const {x: nextX, y: nextY} = randomNeighbor;
      
      // Remove wall between current and next cell
      const wallX = currentX + (nextX - currentX) / 2;
      const wallY = currentY + (nextY - currentY) / 2;
      gameState.maze[wallY][wallX] = 0;
      gameState.maze[nextY][nextX] = 0;
      
      visited[nextY][nextX] = true;
      stack.push({x: nextX, y: nextY});
    } else {
      // Backtrack - remove current position from stack
      stack.pop();
    }
  }
  
  // Ensure start and end positions are clear
  gameState.maze[1][1] = 0;
  gameState.maze[gameState.rows - 2][gameState.cols - 2] = 0;
  
  // Add some random extra paths to make maze more interesting (10-20% chance per valid cell)
  addRandomPaths();
  
  // Ensure there's definitely a path to the end
  ensurePathToEnd();
}

// Add random extra paths to make mazes more varied
function addRandomPaths() {
  const extraPathChance = 0.15; // 15% chance to add extra paths
  
  for (let y = 1; y < gameState.rows - 1; y++) {
    for (let x = 1; x < gameState.cols - 1; x++) {
      if (gameState.maze[y][x] === 1 && Math.random() < extraPathChance) {
        // Check if removing this wall creates interesting connectivity
        const adjacentPaths = countAdjacentPaths(x, y);
        if (adjacentPaths >= 2 && adjacentPaths <= 3) {
          gameState.maze[y][x] = 0;
        }
      }
    }
  }
}

// Count adjacent path cells
function countAdjacentPaths(x, y) {
  let count = 0;
  const directions = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];
  
  for (const dir of directions) {
    const newX = x + dir.x;
    const newY = y + dir.y;
    
    if (newX >= 0 && newX < gameState.cols &&
        newY >= 0 && newY < gameState.rows &&
        gameState.maze[newY][newX] === 0) {
      count++;
    }
  }
  
  return count;
}

// Ensure there's a guaranteed path from start to end
function ensurePathToEnd() {
  const startX = 1, startY = 1;
  const endX = gameState.cols - 2, endY = gameState.rows - 2;
  
  // Use breadth-first search to check if path exists
  if (!hasPath(startX, startY, endX, endY)) {
    // If no path exists, create one by clearing a simple path
    createSimplePath(startX, startY, endX, endY);
  }
}

// Check if path exists using BFS
function hasPath(startX, startY, endX, endY) {
  const visited = Array(gameState.rows).fill().map(() => Array(gameState.cols).fill(false));
  const queue = [{x: startX, y: startY}];
  visited[startY][startX] = true;
  
  const directions = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];
  
  while (queue.length > 0) {
    const {x, y} = queue.shift();
    
    if (x === endX && y === endY) {
      return true;
    }
    
    for (const dir of directions) {
      const newX = x + dir.x;
      const newY = y + dir.y;
      
      if (newX >= 0 && newX < gameState.cols &&
          newY >= 0 && newY < gameState.rows &&
          !visited[newY][newX] &&
          gameState.maze[newY][newX] === 0) {
        visited[newY][newX] = true;
        queue.push({x: newX, y: newY});
      }
    }
  }
  
  return false;
}

// Create a simple guaranteed path
function createSimplePath(startX, startY, endX, endY) {
  let currentX = startX;
  let currentY = startY;
  
  // Clear path horizontally first
  while (currentX !== endX) {
    gameState.maze[currentY][currentX] = 0;
    currentX += (endX > currentX) ? 1 : -1;
  }
  
  // Then clear path vertically
  while (currentY !== endY) {
    gameState.maze[currentY][currentX] = 0;
    currentY += (endY > currentY) ? 1 : -1;
  }
  
  // Ensure end position is clear
  gameState.maze[endY][endX] = 0;
}

// Get unvisited neighbors for maze generation
function getUnvisitedNeighbors(x, y, visited) {
  const neighbors = [];
  const directions = [
    {x: 0, y: -2}, // Up
    {x: 2, y: 0},  // Right
    {x: 0, y: 2},  // Down
    {x: -2, y: 0}  // Left
  ];
  
  for (const dir of directions) {
    const newX = x + dir.x;
    const newY = y + dir.y;
    
    if (newX > 0 && newX < gameState.cols - 1 && 
        newY > 0 && newY < gameState.rows - 1 && 
        !visited[newY][newX]) {
      neighbors.push({x: newX, y: newY});
    }
  }
  
  return neighbors;
}

// Draw the maze
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw maze cells
  for (let y = 0; y < gameState.rows; y++) {
    for (let x = 0; x < gameState.cols; x++) {
      if (gameState.maze[y][x] === 1) {
        // Wall
        ctx.fillStyle = gameState.colors.wall;
        ctx.fillRect(x * gameState.cellSize, y * gameState.cellSize, gameState.cellSize, gameState.cellSize);
      } else {
        // Path
        ctx.fillStyle = gameState.colors.path;
        ctx.fillRect(x * gameState.cellSize, y * gameState.cellSize, gameState.cellSize, gameState.cellSize);
      }
      
      // Add subtle grid lines
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x * gameState.cellSize, y * gameState.cellSize, gameState.cellSize, gameState.cellSize);
    }
  }
  
  drawEnd();
  drawPlayer();
}

// Draw player with key image
function drawPlayer() {
  const x = gameState.player.x * gameState.cellSize;
  const y = gameState.player.y * gameState.cellSize;
  const size = gameState.cellSize;
  
  // Add glow effect
  ctx.shadowColor = gameState.colors.playerGlow;
  ctx.shadowBlur = 10;
  
  // Draw key image if loaded, otherwise fallback to circle
  if (images.loaded >= 2) {
    ctx.drawImage(images.key, x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);
  } else {
    // Fallback: yellow key-like shape
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Reset shadow
  ctx.shadowBlur = 0;
}

// Draw end point with lock image
function drawEnd() {
  const x = gameState.end.x * gameState.cellSize;
  const y = gameState.end.y * gameState.cellSize;
  const size = gameState.cellSize;
  
  // Add glow effect
  ctx.shadowColor = gameState.colors.endGlow;
  ctx.shadowBlur = 15;
  
  // Draw lock image if loaded, otherwise fallback to square
  if (images.loaded >= 2) {
    ctx.drawImage(images.lock, x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);
  } else {
    // Fallback: brown lock-like shape
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6);
  }
  
  // Reset shadow
  ctx.shadowBlur = 0;
}

// Move player
function movePlayer(dx, dy) {
  if (!gameState.isPlaying) return;
  
  const newX = gameState.player.x + dx;
  const newY = gameState.player.y + dy;
  
  // Check bounds and walls
  if (newX >= 0 && newX < gameState.cols &&
      newY >= 0 && newY < gameState.rows &&
      gameState.maze[newY][newX] === 0) {
    
    gameState.player.x = newX;
    gameState.player.y = newY;
    gameState.moves++;
    updateMoveCounter();
    drawMaze();
    
    // Check if player reached the end
    if (gameState.player.x === gameState.end.x && gameState.player.y === gameState.end.y) {
      gameWon();
    }
  }
}

// Handle game win
function gameWon() {
  gameState.isPlaying = false;
  
  const difficultyName = difficultySettings[gameState.difficulty].name;
  document.getElementById('victory-message').textContent = 
    `🗝️ You found the key and unlocked the ${difficultyName} maze in ${gameState.moves} moves! 🔓`;
  
  // Show immediate victory message
  showImmediateVictoryMessage();
  
  // Launch confetti immediately
  launchConfetti();
  
  // Show full victory screen after a brief delay
  setTimeout(() => {
    removeImmediateVictoryMessage();
    showVictoryScreen();
  }, 1500);
}

// Show immediate victory feedback
function showImmediateVictoryMessage() {
  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';
  overlay.id = 'immediate-victory';
  overlay.innerHTML = '🗝️ UNLOCKED! 🔓';
  document.body.appendChild(overlay);
}

// Remove immediate victory message
function removeImmediateVictoryMessage() {
  const overlay = document.getElementById('immediate-victory');
  if (overlay) {
    overlay.remove();
  }
}

// Update move counter
function updateMoveCounter() {
  document.getElementById('move-counter').textContent = gameState.moves;
}

// Screen management functions
function showStartScreen() {
  document.getElementById('start-screen').classList.remove('hidden');
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('victory-screen').classList.add('hidden');
  gameState.isPlaying = false;
}

function showGameScreen() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('victory-screen').classList.add('hidden');
}

function showVictoryScreen() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('victory-screen').classList.remove('hidden');
}

// Reset game
function resetGame() {
  startGame(gameState.difficulty);
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!gameState.isPlaying) return;
  
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      e.preventDefault();
      movePlayer(0, -1);
      break;
    case "ArrowDown":
    case "s":
    case "S":
      e.preventDefault();
      movePlayer(0, 1);
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      e.preventDefault();
      movePlayer(-1, 0);
      break;
    case "ArrowRight":
    case "d":
    case "D":
      e.preventDefault();
      movePlayer(1, 0);
      break;
    case "r":
    case "R":
      e.preventDefault();
      resetGame();
      break;
  }
});

// Confetti animation
function launchConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  
  const colors = ['#ffd700', '#ffed4e', '#f39c12', '#e67e22', '#d35400', '#8b4513'];
  
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// Add roundRect method if not available
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
  };
}

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', function() {
  showStartScreen();
});
