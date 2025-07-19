const board = document.getElementById("gameBoard");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const themeSelector = document.getElementById("themeSelector");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const matchCount = document.getElementById("matchCount");
const countdownDisplay = document.getElementById("countdown");
const gameOverScreen = document.getElementById("gameOverScreen");
const gameOverMessage = document.getElementById("gameOverMessage");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let cells, currentPlayer = "X", gameState, scores = { X: 0, O: 0 }, gameActive = true;
let countdown, countdownTimer, totalMatches = 0;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function initGame() {
  clearInterval(countdownTimer);
  board.innerHTML = "";
  gameState = Array(9).fill("");
  for(let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
  gameOverScreen.style.display = "none";
  currentPlayer = "X";
  gameActive = true;
  updateMessage();
  startCountdown();
}

function handleClick(e) {
  const index = e.target.getAttribute("data-index");
  if (!gameState[index] && gameActive) {
    gameState[index] = currentPlayer;
    e.target.innerText = currentPlayer;
    clickSound.play();
    checkResult();
    if (gameActive) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateMessage();
      startCountdown();
      if (currentPlayer === "O") setTimeout(aiMove, 400);
    }
  }
}

function updateMessage() {
  message.innerText = `Player ${currentPlayer === "X" ? "😸 X" : "😼 O"}'s Turn`;
}

function checkResult() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      gameActive = false;
      winSound.play();
      updateScore(gameState[a]);
      highlightWin(pattern);
      launchConfetti();
      endGame(`🎉 Player ${gameState[a]} Wins!`);
      return;
    }
  }
  if (!gameState.includes("")) {
    gameActive = false;
    drawSound.play();
    endGame("🤝 It's a Draw!");
  }
}

function updateScore(winner) {
  scores[winner]++;
  scoreX.innerText = scores.X;
  scoreO.innerText = scores.O;
}

function highlightWin(pattern) {
  pattern.forEach(index => {
    board.children[index].style.background = "var(--accent)";
    board.children[index].style.color = "white";
  });
}

function aiMove() {
  if (!gameActive) return;
  const emptyIndices = gameState.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const cell = board.children[randomIndex];
  cell.click();
}

function startCountdown() {
  clearInterval(countdownTimer);
  countdown = 15;
  countdownDisplay.innerText = countdown;
  countdownTimer = setInterval(() => {
    countdown--;
    countdownDisplay.innerText = countdown;
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      message.innerText = `⏰ Time's Up! Player ${currentPlayer} missed their move!`;
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateMessage();
      startCountdown();
      if (currentPlayer === "O") setTimeout(aiMove, 400);
    }
  }, 1000);
}

function endGame(finalMessage) {
  clearInterval(countdownTimer);
  gameOverMessage.innerText = finalMessage;
  gameOverScreen.style.display = "flex";
  matchCount.innerText = ++totalMatches;
}

function launchConfetti() {
  const confettiCanvas = document.getElementById('confettiCanvas');
  const myConfetti = confetti.create(confettiCanvas, { resize: true });
  myConfetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

resetBtn.addEventListener("click", initGame);

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

themeSelector.addEventListener("change", (e) => {
  let theme = e.target.value;
  switch(theme) {
    case "neon":
      document.documentElement.style.setProperty('--accent', '#0ff');
      break;
    case "retro":
      document.documentElement.style.setProperty('--accent', '#ff9800');
      break;
    default:
      document.documentElement.style.setProperty('--accent', '#00bcd4');
  }
});

initGame();