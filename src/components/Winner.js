/**
 * Returns the winner of the game, if any.
 * @param {Array<String>} squares
 * @param {number} boardSize
 * @returns {Object|null} The winner object with winner and winningSquares, or null if there is no winner.
 */
function calculateWinner(squares, boardSize = 3) {
  const lines = [];

  // Lignes horizontales
  for (let row = 0; row < boardSize; row++) {
    const line = [];
    for (let col = 0; col < boardSize; col++) {
      line.push(row * boardSize + col);
    }
    lines.push(line);
  }

  // Lignes verticales
  for (let col = 0; col < boardSize; col++) {
    const line = [];
    for (let row = 0; row < boardSize; row++) {
      line.push(row * boardSize + col);
    }
    lines.push(line);
  }

  // Diagonale principale (haut-gauche vers bas-droite)
  const mainDiagonal = [];
  for (let i = 0; i < boardSize; i++) {
    mainDiagonal.push(i * boardSize + i);
  }
  lines.push(mainDiagonal);

  // Diagonale secondaire (haut-droite vers bas-gauche)
  const antiDiagonal = [];
  for (let i = 0; i < boardSize; i++) {
    antiDiagonal.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push(antiDiagonal);

  // Vérifier chaque ligne
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstSquare = squares[line[0]];
    
    if (firstSquare && line.every(index => squares[index] === firstSquare)) {
      return { winner: firstSquare, winningSquares: line };
    }
  }
}

export default calculateWinner;
