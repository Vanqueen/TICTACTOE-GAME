import calculateWinner from '../components/Winner.js';

// Coup aléatoire (Facile)
export function makeRandomMove(squares) {
  const availableMoves = squares
    .map((square, index) => square === null ? index : null)
    .filter(val => val !== null);
  
  if (availableMoves.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

// Algorithme Minimax (Difficile)
export function minimax(squares, depth, isMaximizing, aiSymbol, playerSymbol, boardSize = 3) {
  const winner = calculateWinner(squares, boardSize);
  
  // Conditions d'arrêt
  if (winner?.winner === aiSymbol) return { score: 10 - depth };
  if (winner?.winner === playerSymbol) return { score: depth - 10 };
  if (!squares.includes(null)) return { score: 0 };
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = aiSymbol;
        const result = minimax(squares, depth + 1, false, aiSymbol, playerSymbol, boardSize);
        squares[i] = null;
        
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = i;
        }
      }
    }
    
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = playerSymbol;
        const result = minimax(squares, depth + 1, true, aiSymbol, playerSymbol, boardSize);
        squares[i] = null;
        
        if (result.score < bestScore) {
          bestScore = result.score;
        }
      }
    }
    
    return { score: bestScore };
  }
}

// Niveau moyen (Minimax limité + aléatoire)
export function makeMediumMove(squares, aiSymbol, playerSymbol, boardSize = 3) {
  // 70% Minimax, 30% aléatoire
  if (Math.random() < 0.7) {
    const result = minimax(squares, 0, true, aiSymbol, playerSymbol, boardSize);
    return result.move;
  } else {
    return makeRandomMove(squares);
  }
}