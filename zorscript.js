document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const message = document.querySelector('.message');
  const playAgainButton = document.querySelector('.play-again-button');

  let currentPlayer = 'X';
  let gameOver = false;
  let isCooldown = false;
  const cooldownDuration = 250;

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

    let bestScore = -Infinity;
    let bestMove;

    availableCells.forEach(cell => {
      const index = parseInt(cell.dataset.index);
      cell.textContent = currentPlayer;
      cell.classList.add(currentPlayer);

      const score = minimax(cells, 0, false);

      cell.textContent = '';
      cell.classList.remove(currentPlayer);

      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    });

    bestMove.click();
  }

  function minimax(cells, depth, isMaximizing) {
    const scores = {
      X: -10,
      O: 10,
      draw: 0
    };

    if (checkWin('X')) {
      return scores.X - depth;
    }
    if (checkWin('O')) {
      return scores.O - depth;
    }
    if (checkDraw()) {
      return scores.draw;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;

      cells.forEach(cell => {
        if (cell.textContent === '') {
          const index = parseInt(cell.dataset.index);
          cell.textContent = 'O';
          cell.classList.add('O');

          const score = minimax(cells, depth + 1, false);

          cell.textContent = '';
          cell.classList.remove('O');

          bestScore = Math.max(score, bestScore);
        }
      });

      return bestScore;
    } else {
      let bestScore = Infinity;

      cells.forEach(cell => {
        if (cell.textContent === '') {
          const index = parseInt(cell.dataset.index);
          cell.textContent = 'X';
          cell.classList.add('X');

          const score = minimax(cells, depth + 1, true);

          cell.textContent = '';
          cell.classList.remove('X');

          bestScore = Math.min(score, bestScore);
        }
      });

      return bestScore;
    }
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
