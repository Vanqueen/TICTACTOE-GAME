function GameSetup({ boardSize, setBoardSize, firstPlayer, setFirstPlayer, onStartGame, gameMode, setGameMode, aiDifficulty, setAiDifficulty, onLoadGame, hasSavedGame }) {
  function handleSizeChange(e) {
    const size = parseInt(e.target.value, 10);
    setBoardSize(size);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Configuration de la partie</h2>
      
      <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold text-gray-700">
            Mode de jeu :
          </label>
          <select value={gameMode} onChange={(e) => setGameMode(e.target.value)} className="p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none">
            <option value="human">👥 2 Joueurs</option>
            <option value="ai">🤖 Contre IA</option>
          </select>
        </div>
        
        {gameMode === 'ai' && (
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Difficulté IA :
            </label>
            <select value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)} className="p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none">
              <option value="easy">😊 Facile</option>
              <option value="medium">😐 Moyen</option>
              <option value="hard">😈 Difficile</option>
            </select>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold text-gray-700">
            Taille du plateau :
          </label>
          <select value={boardSize} onChange={handleSizeChange} className="p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none">
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
            <option value={5}>5x5</option>
            <option value={6}>6x6</option>
            <option value={7}>7x7</option>
          </select>
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-lg font-semibold text-gray-700">
            {gameMode === 'ai' ? 'Vous jouez :' : 'Premier joueur :'}
          </label>
          <select value={firstPlayer} onChange={(e) => setFirstPlayer(e.target.value)} className="p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none">
            <option value="X">❌ X</option>
            <option value="O">⭕ O</option>
          </select>
        </div>
        
        <div className="space-y-3">
          {hasSavedGame && (
            <button onClick={onLoadGame} className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              🔄 Reprendre la partie
            </button>
          )}
          <button onClick={onStartGame} className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            🎮 {hasSavedGame ? 'Nouvelle partie' : 'Commencer la partie'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameSetup;