import Square from "./Square";
import { useState } from "react";

function Board({ xIsNext, squares, onPlay, winningSquares, boardSize = 3 }) {
  const [squareClick, setSquareClick] = useState("");

  /**
   * Handles a click on a square.
   * @param {Number} i The index of the square that was clicked.
   */
  function handleClick(i) {
    if (squares[i] || winningSquares.length > 0) return;

    const nextSquares = squares.slice();
    const playedValue = xIsNext ? "X" : "O";
    nextSquares[i] = playedValue;

    setSquareClick(playedValue);
    onPlay(nextSquares);
  }

  return (
    <div className="border-none shadow-2xl p-5 mt-5">
      {/* Affiche le dernier coup joué */}
      <div className="text-lg font-semibold text-gray-700">
        {squareClick ? `Dernier coup : ${squareClick}` : ''}
      </div>

      {/*  grid-cols-3 grid-rows-3 */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
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
