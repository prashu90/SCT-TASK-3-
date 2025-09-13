const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const vsComputerBtn = document.getElementById("vsComputerBtn");

let board = Array(9).fill("");
let currentPlayer = "X";
let running = false;
let vsComputer = false;

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function init() {
  cells.forEach(cell => cell.addEventListener("click", onCellClick));
  resetBtn.addEventListener("click", () => startGame(vsComputer));
  twoPlayerBtn.addEventListener("click", () => startGame(false));
  vsComputerBtn.addEventListener("click", () => startGame(true));
  startGame(false); // auto-start 2-player
}

function startGame(vsAI) {
  vsComputer = vsAI;
  board = Array(9).fill("");
  currentPlayer = "X";
  running = true;

  statusText.textContent = Player ${currentPlayer}'s Turn${vsComputer ? " (vs Computer)" : ""};

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
    cell.style.pointerEvents = "auto";
  });
}

function onCellClick(e) {
  if (!running) return;

  const cell = e.target;
  const index = cell.dataset.index;

  if (board[index] !== "") return;

  placeMark(cell, index);
  if (checkWinner()) return;

  if (running && vsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 400);
  }
}

function placeMark(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.style.pointerEvents = "none";
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = Player ${currentPlayer}'s Turn${vsComputer ? " (vs Computer)" : ""};
}

function checkWinner() {
  let winner = null;

  for (const combo of winConditions) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = combo;
      break;
    }
  }

  if (winner) {
    statusText.textContent = Player ${currentPlayer} Wins! 🎉;
    running = false;
    winner.forEach(i => cells[i].classList.add("winner"));
    cells.forEach(c => (c.style.pointerEvents = "none"));
    return true;
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw! 🤝";
    running = false;
    return true;
  }

  switchPlayer();
  return false;
}

function computerMove() {
  const empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  if (empty.length === 0) return;

  let i;
  if (empty.includes(4)) {
    i = 4;
  } else {
    i = empty[Math.floor(Math.random() * empty.length)];
  }
  const cell = cells[i];
  placeMark(cell, i);
  checkWinner();
}

init();