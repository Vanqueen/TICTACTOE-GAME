import { useState, useEffect, useMemo } from "react";

function GameHistory() {
  const [gameHistory, setGameHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("gameHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [expandedSeries, setExpandedSeries] = useState(null);

  // Grouper par séries
  const seriesData = useMemo(() => {
    const series = {};
    
    gameHistory.forEach(game => {
      const seriesId = game.seriesId || '1';
      if (!series[seriesId]) {
        series[seriesId] = {
          id: seriesId,
          games: [],
          stats: { X: { wins: 0, losses: 0, draws: 0 }, O: { wins: 0, losses: 0, draws: 0 } }
        };
      }
      
      series[seriesId].games.push(game);
      
      // Calculer stats de la série
      if (game.winner === "Match nul") {
        series[seriesId].stats.X.draws++;
        series[seriesId].stats.O.draws++;
      } else if (game.winner === "X") {
        series[seriesId].stats.X.wins++;
        series[seriesId].stats.O.losses++;
      } else if (game.winner === "O") {
        series[seriesId].stats.O.wins++;
        series[seriesId].stats.X.losses++;
      }
    });
    
    return Object.values(series).sort((a, b) => b.id - a.id);
  }, [gameHistory]);

  // Calculer les stats globales
  const globalStats = useMemo(() => {
    const initialStats = { X: { wins: 0, losses: 0, draws: 0 }, O: { wins: 0, losses: 0, draws: 0 } };
    
    gameHistory.forEach(game => {
      if (game.winner === "Match nul") {
        initialStats.X.draws++;
        initialStats.O.draws++;
      } else if (game.winner === "X") {
        initialStats.X.wins++;
        initialStats.O.losses++;
      } else if (game.winner === "O") {
        initialStats.O.wins++;
        initialStats.X.losses++;
      }
    });
    
    return initialStats;
  }, [gameHistory]);

  // Recharger les données au montage et à intervalles réguliers
  useEffect(() => {
    const reloadData = () => {
      try {
        const savedHistory = localStorage.getItem("gameHistory");
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          setGameHistory(prev => JSON.stringify(prev) !== savedHistory ? parsed : prev);
        }
      } catch {
        console.warn('Failed to reload game data');
      }
    };

    reloadData();
    const interval = setInterval(reloadData, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const clearHistory = () => {
    try {
      setGameHistory([]);
      localStorage.removeItem("gameHistory");
    } catch {
      console.warn('Failed to clear game history');
    }
  };

  const totalGames = globalStats.X.wins + globalStats.X.losses + globalStats.X.draws;

  return (
    <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
      {totalGames > 0 && (
        <div className="mb-6 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl">
          <h3 className="font-bold mb-3 text-white/90 text-lg">📊 Statistiques globales</h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalGames}</div>
              <div>Parties totales</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-400">❌ {globalStats.X.wins}V - {globalStats.X.losses}D - {globalStats.X.draws}N</div>
              <div>Joueur X</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-400">⭕ {globalStats.O.wins}V - {globalStats.O.losses}D - {globalStats.O.draws}N</div>
              <div>Joueur O</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white/90">🏆 Séries de parties</h2>
        {gameHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-600/80 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            🗑️ Effacer tout
          </button>
        )}
      </div>
      
      {seriesData.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎲</div>
          <p className="text-white/60 text-lg">Aucune série jouée</p>
          <p className="text-white/40 text-sm mt-2">Commencez une partie pour voir l'historique ici</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cards horizontales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seriesData.map((series, seriesIndex) => {
              const isExpanded = expandedSeries === series.id;
              const seriesStats = series.stats;
              const totalSeriesGames = seriesStats.X.wins + seriesStats.X.losses + seriesStats.X.draws;
              
              return (
                <div 
                  key={series.id}
                  onClick={() => setExpandedSeries(isExpanded ? null : series.id)}
                  className={`bg-white/10 border border-white/20 rounded-xl p-4 cursor-pointer hover:bg-white/15 transition-all duration-200 transform hover:scale-105 ${
                    isExpanded ? 'ring-2 ring-blue-400/50 bg-white/20' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="font-bold text-white text-lg mb-2">
                      Série #{seriesData.length - seriesIndex}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-white/80">{totalSeriesGames} parties</p>
                      <div className="flex justify-center gap-2 text-xs">
                        <span className="text-red-400">❌ {seriesStats.X.wins}</span>
                        <span className="text-blue-400">⭕ {seriesStats.O.wins}</span>
                        <span className="text-yellow-400">🤝 {seriesStats.X.draws}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-2">{series.games[0]?.date}</p>
                    </div>
                    <div className={`mt-2 transform transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}>
                      ▼
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Détails de la série sélectionnée en bas */}
          {expandedSeries && (
            <div className="bg-white/10 border border-white/20 rounded-xl p-6">
              <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                📊 Détails de la série #{seriesData.length - seriesData.findIndex(s => s.id === expandedSeries)}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {seriesData.find(s => s.id === expandedSeries)?.games.map((game, gameIndex) => {
                  const series = seriesData.find(s => s.id === expandedSeries);
                  const getResultIcon = () => {
                    if (game.winner === "Match nul") return "🤝";
                    return game.winner === "X" ? "❌" : "⭕";
                  };
                  
                  const getResultColor = () => {
                    if (game.winner === "Match nul") return "text-yellow-400";
                    return game.winner === "X" ? "text-red-400" : "text-blue-400";
                  };
                  
                  const formatDuration = (seconds) => {
                    if (!seconds) return "--";
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                  };
                  
                  return (
                    <div key={game.id} className="p-3 bg-white/10 rounded-lg border border-white/20">
                      <div className="text-center">
                        <div className="text-lg mb-1">{getResultIcon()}</div>
                        <div className={`text-sm font-medium ${getResultColor()} mb-1`}>
                          Match #{series.games.length - gameIndex}
                        </div>
                        <div className="text-xs text-white/60 mb-1">
                          {game.winner === "Match nul" ? "Match nul" : `${game.winner} gagne`}
                        </div>
                        <div className="text-xs text-white/50 space-y-1">
                          <div>📏 {game.level || `${game.boardSize}x${game.boardSize}`}</div>
                          <div>⏱️ {formatDuration(game.duration)}</div>
                          <div>🎯 {game.totalMoves || 0} coups</div>
                          {game.gameMode === 'ai' && (
                            <div>🤖 vs IA</div>
                          )}
                          {game.winningMoves?.length > 0 && (
                            <div>🏆 Ligne gagnante</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameHistory;