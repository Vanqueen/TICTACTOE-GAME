import Square from "./Square";
import calculateWinner from './Winner';
import { useState } from "react";

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  const [squareClick, setSquareClick] = useState("");
  const winner = calculateWinner(squares);

  /**
   * Handles a click on a square.
   * @param {Number} i The index of the square that was clicked.
   */
  function handleClick(i) {
    if (squares[i] || winningSquares.length > 0 || winner) return;

    const nextSquares = squares.slice();
    const playedValue = xIsNext ? "X" : "O";
    nextSquares[i] = playedValue;

    setSquareClick(playedValue); // ✅ enregistre le dernier symbole joué
    onPlay(nextSquares);
  }

  return (
    <div className="border-none shadow-2xl p-5 mt-5">
      {/* Affiche le dernier coup joué */}
      <div className="text-lg font-semibold text-gray-700">
        {squareClick ? `Dernier coup : ${squareClick}` : ''}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {squares.map((square, index) => (
          <Square
            key={index}
            value={square}
            isWinning={winningSquares?.includes(index)}
            onSquareClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
