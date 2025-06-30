let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;

const statusEl = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

document.getElementById("humanBtn").onclick = () => {
  vsAI = false;
  resetGame();
  setMode("human");
};

document.getElementById("aiBtn").onclick = () => {
  vsAI = true;
  resetGame();
  setMode("ai");
};

function setMode(mode) {
  document.getElementById("humanBtn").classList.toggle("active", mode === "human");
  document.getElementById("aiBtn").classList.toggle("active", mode === "ai");
}

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  if (checkWinner()) {
    statusEl.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    confettiSprinkle();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusEl.textContent = "Game ended in a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].style.color = player === "X" ? "#ff007a" : "#00ffff";
}

function aiMove() {
  const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  const random = empty[Math.floor(Math.random() * empty.length)];
  makeMove(random, "O");

  if (checkWinner()) {
    statusEl.textContent = `Player O Wins!`;
    gameActive = false;
    confettiSprinkle();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusEl.textContent = "Game ended in a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusEl.textContent = `Player X's turn`;
}

function checkWinner() {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombos.some(combo => {
    const [a,b,c] = combo;
    return board[a] && board[a] === board[b] && board[b] === board[c];
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusEl.textContent = `Player X's turn`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.color = "#00ffff";
  });
}

function confettiSprinkle() {
  const duration = 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    }));
  }, 200);
}
