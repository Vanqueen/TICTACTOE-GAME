import { useMemo } from 'react';

function MoveHistory({ history, currentMove, onJumpTo, onRestart, isGameOver, boardSize = 3 }) {
  const moves = useMemo(() => history.map((squares, move) => {
    if (move === 0) return null;
    const previousSquares = history[move - 1];
    const changedIndex = squares.findIndex(
      (val, idx) => val !== previousSquares[idx]
    );
    const player = changedIndex !== -1 ? squares[changedIndex] : null;
    
    if (!player) return null;

    const row = Math.floor(changedIndex / boardSize) + 1;
    const col = (changedIndex % boardSize) + 1;

    const playerIcon = player === "X" ? "❌" : "⭕";

    return (
      <li key={move} className={`p-2 rounded-lg transition-colors ${
        move === currentMove ? 'bg-blue-500/20 border border-blue-400/50' : 'hover:bg-white/10'
      }`}>
        <span className="text-sm text-white/90">
          #{move} {playerIcon} Joueur {player} → L{row}, C{col}
        </span>
      </li>
    );
  }), [history, boardSize, currentMove]);

  return (
    <div className="min-w-[350px] min-h-[300px]">
      {moves.length > 1 && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white/90">Historique des coups</h2>
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🆕 Nouvelle partie
            </button>
          </div>
          
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <ul className="space-y-2">{moves}</ul>
          </div>
          
          {!isGameOver && (
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => onJumpTo(currentMove - 1)}
                disabled={currentMove === 0}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                ⬅️ Précédent
              </button>
              <button
                onClick={() => onJumpTo(currentMove + 1)}
                disabled={currentMove === history.length - 1}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                Suivant ➡️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MoveHistory;