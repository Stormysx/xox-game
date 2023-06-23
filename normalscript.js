document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');
  const playAgainButton = document.querySelector('.play-again-button');

  let currentPlayer = 'X';
  let gameOver = false;
  let isCooldown = false;
  const cooldownDuration = 1000;

  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  playAgainButton.addEventListener('click', resetGame);

  function handleCellClick(event) {
    const cell = event.target;
    if (cell.textContent !== '' || gameOver || isCooldown) return;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
      message.textContent = `${currentPlayer} oyuncusu kazandı!`;
      message.style.display = 'block';
      playAgainButton.style.display = 'block';
      gameOver = true;
      return;
    }

    if (checkDraw()) {
      message.textContent = 'Berabere!';
      message.style.display = 'block';
      playAgainButton.style.display = 'block';
      gameOver = true;
      return;
    }

    isCooldown = true;

    setTimeout(() => {
      isCooldown = false;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

      if (currentPlayer === 'O') {
        makeAIMove();
      }
    }, cooldownDuration);
  }

  function makeAIMove() {
    const availableCells = [...cells].filter(cell => cell.textContent === '');

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cellToPlay = availableCells[randomIndex];
    cellToPlay.click();
  }

  function checkWin(player) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
      return combination.every(index => cells[index].classList.contains(player));
    });
  }

  function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
  }

  function resetGame() {
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('X', 'O');
    });

    message.style.display = 'none';
    playAgainButton.style.display = 'none';

    currentPlayer = 'X';
    gameOver = false;
    isCooldown = false;
  }
});
