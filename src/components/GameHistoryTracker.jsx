import { forwardRef, useImperativeHandle, useRef } from "react";

const GameHistoryTracker = forwardRef((props, ref) => {
  const lastGameRef = useRef(null);
  
  const addGame = (winner, scoreX, scoreO, gameData = {}) => {
    // Créer une clé unique pour ce match
    const gameKey = `${winner}-${scoreX}-${scoreO}-${Date.now()}`;
    
    // Éviter les doublons
    if (lastGameRef.current === gameKey) {
      return;
    }
    lastGameRef.current = gameKey;
    
    // Utiliser setTimeout pour éviter les setState pendant le rendu
    setTimeout(() => {
      try {
        const currentSeries = localStorage.getItem('currentSeries') || '1';
        
        const newGame = {
          id: crypto?.randomUUID?.() || Date.now() + Math.random(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          winner: winner || "Match nul",
          scoreX: scoreX || 0,
          scoreO: scoreO || 0,
          level: gameData.level || "Normal",
          duration: gameData.duration || 0,
          totalMoves: gameData.totalMoves || 0,
          boardSize: gameData.boardSize || 3,
          gameMode: gameData.gameMode || 'human',
          winningMoves: gameData.winningMoves || [],
          seriesId: currentSeries
        };

        // Récupérer l'historique existant
        const savedHistory = localStorage.getItem("gameHistory");
        const gameHistory = savedHistory ? JSON.parse(savedHistory) : [];
        
        // Vérifier si ce match existe déjà (protection supplémentaire)
        const exists = gameHistory.some(game => 
          game.winner === newGame.winner && 
          game.scoreX === newGame.scoreX && 
          game.scoreO === newGame.scoreO &&
          game.date === newGame.date
        );
        
        if (!exists) {
          const updatedHistory = [newGame, ...gameHistory];
          localStorage.setItem("gameHistory", JSON.stringify(updatedHistory));
        }
      } catch (error) {
        console.warn('Failed to add game:', error);
      }
    }, 0);
  };

  useImperativeHandle(ref, () => ({
    addGame
  }));

  return null;
});

export default GameHistoryTracker;