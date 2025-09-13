import { useState } from "react";
import Board from "./Board";
import calculateWinner from "./Winner";

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [score, setScore] = useState({ X: 0, O: 0 });
  // const [newGame, setNewGame] = useState(0);

  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.winningSquares || [];

  let status;
  if (winner) {
    status = `🎉 Joueur ${winner} a gagné !`;
  } else if (!currentSquares.includes(null)) status = "🤝 Match nul";
  else status = `Tour du joueur : ${xIsNext ? "X" : "O"}`;

  /**
   * ----------- GESTION DU COUP JOUE ----------
   * @param {Array<String>} nextSquares The new state of the squares.
   */
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const result = calculateWinner(nextSquares);
    if (result && result.winner) {
      setScore((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1,
      }));
    }
    console.log("newGame", score);
  }

  /**
   * Jumps to a specific move in the game history.
   * @param {number} nextMove The move to jump to.
   */
  function jumpTo(nextMove) {
    if (nextMove < 0 || nextMove >= history.length) return;
    setCurrentMove(nextMove);
  }

  // ----------- REJOUER UNE PARTIE ----------
  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    // setNewGame((prev) => prev + 1);
  }

  // ----------- HISTORIQUE ----------
  const moves = history.map((squares, move) => {
    if (move === 0) return null;
    const previousSquares = history[move - 1];
    const changedIndex = squares.findIndex(
      (val, idx) => val !== previousSquares[idx]
    );
    const player = squares[changedIndex];

    const row = Math.floor(changedIndex / 3) + 1;
    const col = (changedIndex % 3) + 1;

    return (
      <li key={move}>
        <span>
          #{move}e Coup : Joueur {player} a joué en ligne {row}, colonne {col}
        </span>
      </li>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl uppercase font-bold mb-5">TIC TAC TOE</h1>
      <hr className="w-[800px] border-t-2 font-bold border-gray-300 mb-5" />
      
      {/* Score */}
      <div className="flex flex-col items-center w-[500px] gap-6 mt-4 p-3 border-none rounded shadow">
        <h2 className="text-2xl font-bold uppercase">Score</h2>
        <p className={winner === 'X' ? 'text-blue-400 text-6xl font-bold mb-4' : 'text-blue-400 text-6xl font-bold mb-3'}>{`X : ${score.X} - ${score.O} : O`}</p>
        {/* <p className="text-gray-600">Parties jouées: {newGame}</p> */}
      </div>

      <div className="flex flex-row justify-between items-center w-full">
        {/* Plateau */}
        <div className="min-h-[300px]">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningSquares={winningLine}
          />
        </div>
        <div className="w-[450px] min-h-[300px]">
          {/* Statut */}
          <h2 className="text-2xl font-bold mt-3">Statut</h2>
          <p className="mb-4">{status}</p>

          {/* Historique */}
          {moves.length > 1 && (
            <div className="mt-4 border-none shadow-2xl p-3">
              <h2 className="text-2xl font-bold mb-4">Historique des coups</h2>
              <ul className="list-disc pl-5">{moves}</ul>
              <div className="flex gap-2 mt-3 items-center justify-between">
                <button
                  onClick={() => jumpTo(currentMove - 1)}
                  disabled={currentMove === 0}
                  className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => jumpTo(currentMove + 1)}
                  disabled={currentMove === history.length - 1}
                  className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <button
                onClick={handleRestart}
                className="px-4 py-2 mt-3 border rounded bg-blue-300 hover:bg-blue-400"
              >
                Recommencer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
