import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Board from "./Board";
import calculateWinner from "./Winner";
import Chronometer from "./Chronometer";
import GameSetup from "./GameSetup";
import GameHistoryTracker from "./GameHistoryTracker";
import MoveHistory from "./MoveHistory";
import VictoryAnimation from "./VictoryAnimation";
import TimeoutAnimation from "./TimeoutAnimation";
import { makeRandomMove, minimax, makeMediumMove } from "../utils/aiAlgorithms";
import { useAuth } from "../hooks/useAuth";

function Game() {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('currentUser');
  };
  const [boardSize, setBoardSize] = useState(3);
  const [history, setHistory] = useState(() => [Array(boardSize * boardSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [score, setScore] = useState(() => {
    try {
      const savedScore = localStorage.getItem("score");
      return savedScore ? JSON.parse(savedScore) : { X: 0, O: 0 };
    } catch {
      return { X: 0, O: 0 };
    }
  });

  const [newGame, setNewGame] = useState(() => {
    try {
      const savedGames = localStorage.getItem("games");
      return savedGames ? JSON.parse(savedGames) : 0;
    } catch {
      return 0;
    }
  });

  const [timeX, setTimeX] = useState(60);
  const [timeO, setTimeO] = useState(60);
  const [firstPlayer, setFirstPlayer] = useState("X");
  const [activePlayer, setActivePlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('human');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);
  const [showTimeoutAnimation, setShowTimeoutAnimation] = useState(false);
  const [timeoutPlayer, setTimeoutPlayer] = useState(null);
  const gameHistoryRef = useRef(null);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  
  const winnerInfo = useMemo(() => calculateWinner(currentSquares, boardSize), [currentSquares, boardSize]);
  const winner = winnerInfo?.winner;
  const winningLine = useMemo(() => winnerInfo?.winningSquares || [], [winnerInfo]);

  const isBoardFull = useMemo(() => !currentSquares.includes(null), [currentSquares]);
  const isGameOver = useMemo(() => winner || isBoardFull || timeX === 0 || timeO === 0, [winner, isBoardFull, timeX, timeO]);

  const currentPlayer = useMemo(() => xIsNext ? "X" : "O", [xIsNext]);
  const isPlayerTurn = useMemo(() => {
    if (gameMode === 'human') return true;
    return currentPlayer === firstPlayer;
  }, [gameMode, currentPlayer, firstPlayer]);

  const status = useMemo(() => {
    if (winner) {
      if (gameMode === 'ai') {
        return winner === firstPlayer ? '🎉 Vous avez gagné !' : '🤖 L\'IA a gagné !';
      }
      return `🎉 Joueur ${winner} a gagné !`;
    }
    if (timeX === 0) return "⏰ Temps écoulé - O gagne !";
    if (timeO === 0) return "⏰ Temps écoulé - X gagne !";
    if (isBoardFull) return "🤝 Match nul";
    
    if (gameMode === 'ai') {
      return isPlayerTurn ? '👤 Votre tour' : '🤖 Tour de l\'IA';
    }
    
    return `Tour du joueur : ${currentPlayer}`;
  }, [winner, timeX, timeO, isBoardFull, gameMode, isPlayerTurn, currentPlayer, firstPlayer]);

  const handlePlay = useCallback((nextSquares) => {
    
    if (!gameStarted || isGameOver) {
      console.log('Bloqué: jeu pas démarré ou terminé');
      return;
    }
    // En mode IA, permettre le coup si c'est l'IA qui joue
    const isAIMove = gameMode === 'ai' && !isPlayerTurn;
    const isPlayerMove = gameMode === 'ai' && isPlayerTurn;
    const isHumanGame = gameMode === 'human';
    
    console.log('isAIMove:', isAIMove, 'isPlayerMove:', isPlayerMove, 'isHumanGame:', isHumanGame);
    
    // Pas de blocage supplémentaire - laisser passer tous les coups valides
    
    console.log('Coup accepté, mise à jour du plateau');
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setActivePlayer(nextPlayer);
  }, [gameStarted, isGameOver, gameMode, isPlayerTurn, history, currentMove, currentPlayer]);

  function jumpTo(nextMove) {
    if (nextMove < 0 || nextMove >= history.length || isGameOver) return;
    setCurrentMove(nextMove);
  }

  function handleSizeChange(size) {
    setBoardSize(size);
    const newBoard = Array(size * size).fill(null);
    setHistory([newBoard]);
    setCurrentMove(0);
  }

  const resetGameState = () => {
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
    setActivePlayer(null);
    setGameStarted(false);
    setTimeX(60);
    setTimeO(60);
    setGameStartTime(null);
    localStorage.removeItem('currentGame');
  };

  const restartGame = () => {
    const emptyBoard = Array(boardSize * boardSize).fill(null);
    setHistory([emptyBoard]);
    setCurrentMove(0);
    setActivePlayer('X');
    setGameStarted(true);
    setTimeX(60);
    setTimeO(60);
    setGameStartTime(Date.now());
    setShowVictoryAnimation(false);
    setShowTimeoutAnimation(false);
  };

  function startGame() {
    const emptyBoard = Array(boardSize * boardSize).fill(null);
    setHistory([emptyBoard]);
    setCurrentMove(0);
    setGameStarted(true);
    setActivePlayer('X');
    setGameStartTime(Date.now());
  }

  function handleForfeit() {
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    setActivePlayer(null);
    setShowVictoryAnimation(true);
    setScore(prev => {
      const newScore = { ...prev, [opponent]: prev[opponent] + 1 };
      const gameData = {
        duration: gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0,
        totalMoves: currentMove,
        boardSize,
        gameMode,
        aiDifficulty: gameMode === 'ai' ? aiDifficulty : null,
        firstPlayer,
        playerName: gameMode === 'ai' ? (localStorage.getItem('currentUser') || 'Joueur') : null,
        winningMoves: [],
        level: `${boardSize}x${boardSize}`,
        forfeit: true
      };
      gameHistoryRef.current?.addGame(opponent, newScore.X, newScore.O, gameData);
      return newScore;
    });
  }

  function resetScore() {
    setScore({ X: 0, O: 0 });
    setNewGame(0);
    resetGameState();
    setShowVictoryAnimation(false);
    setShowTimeoutAnimation(false);
    setTimeoutPlayer(null);
    localStorage.removeItem("score");
    localStorage.removeItem("games");
  }

  function handleRestart() {
    resetGameState();
    setNewGame((prev) => prev + 1);
  }

  const loadSavedGame = () => {
    try {
      const saved = localStorage.getItem('currentGame');
      if (saved) {
        const gameState = JSON.parse(saved);
        setBoardSize(gameState.boardSize);
        setHistory(gameState.history);
        setCurrentMove(gameState.currentMove);
        setScore(gameState.score);
        setTimeX(gameState.timeX);
        setTimeO(gameState.timeO);
        setFirstPlayer(gameState.firstPlayer);
        setActivePlayer(gameState.activePlayer);
        setGameMode(gameState.gameMode);
        setAiDifficulty(gameState.aiDifficulty);
        setGameStartTime(gameState.gameStartTime);
        setGameStarted(true);
        return true;
      }
    } catch {
      localStorage.removeItem('currentGame');
    }
    return false;
  };

  const hasSavedGame = useMemo(() => {
    try {
      const saved = localStorage.getItem('currentGame');
      return saved !== null;
    } catch {
      return false;
    }
  }, []);

  // Save game state
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const gameState = {
        boardSize, history, currentMove, score, timeX, timeO,
        firstPlayer, activePlayer, gameMode, aiDifficulty, gameStartTime,
        savedAt: Date.now()
      };
      localStorage.setItem('currentGame', JSON.stringify(gameState));
    } else if (isGameOver) {
      localStorage.removeItem('currentGame');
    }
  }, [gameStarted, isGameOver, boardSize, history, currentMove, score, timeX, timeO, firstPlayer, activePlayer, gameMode, aiDifficulty, gameStartTime]);

  // Save score
  useEffect(() => {
    try {
      localStorage.setItem("score", JSON.stringify(score));
    } catch {
      console.warn('Failed to save score to localStorage');
    }
  }, [score]);

  useEffect(() => {
    try {
      localStorage.setItem("games", JSON.stringify(newGame));
    } catch {
      console.warn('Failed to save games to localStorage');
    }
  }, [newGame]);

  // Game end effects
  useEffect(() => {
    if (winner) {
      setActivePlayer(null);
      setShowVictoryAnimation(true);
      setScore((prev) => {
        const newScore = { ...prev, [winner]: prev[winner] + 1 };
        const gameData = {
          duration: gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0,
          totalMoves: currentMove,
          boardSize,
          gameMode,
          aiDifficulty: gameMode === 'ai' ? aiDifficulty : null,
          firstPlayer,
          playerName: gameMode === 'ai' ? (localStorage.getItem('currentUser') || 'Joueur') : null,
          winningMoves: winningLine,
          level: `${boardSize}x${boardSize}`
        };
        gameHistoryRef.current?.addGame(winner, newScore.X, newScore.O, gameData);
        return newScore;
      });
    } else if (isBoardFull && currentMove > 0) {
      setActivePlayer(null);
      setShowVictoryAnimation(true);
      setScore((prev) => {
        const gameData = {
          duration: gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0,
          totalMoves: currentMove,
          boardSize,
          gameMode,
          aiDifficulty: gameMode === 'ai' ? aiDifficulty : null,
          firstPlayer,
          playerName: gameMode === 'ai' ? (localStorage.getItem('currentUser') || 'Joueur') : null,
          winningMoves: [],
          level: `${boardSize}x${boardSize}`
        };
        gameHistoryRef.current?.addGame(null, prev.X, prev.O, gameData);
        return prev;
      });
    }
  }, [winner, isBoardFull, currentMove, gameStartTime, boardSize, gameMode, winningLine, aiDifficulty, firstPlayer]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (activePlayer && !isGameOver) {
      timer = setInterval(() => {
        if (activePlayer === "X") {
          setTimeX((prev) => {
            if (prev <= 1) {
              setActivePlayer(null);
              setTimeoutPlayer('X');
              setShowTimeoutAnimation(true);
              setScore(prevScore => {
                const newScore = { ...prevScore, O: prevScore.O + 1 };
                const gameData = {
                  duration: gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0,
                  totalMoves: currentMove,
                  boardSize,
                  gameMode,
                  aiDifficulty: gameMode === 'ai' ? aiDifficulty : null,
                  firstPlayer,
                  playerName: gameMode === 'ai' ? (localStorage.getItem('currentUser') || 'Joueur') : null,
                  winningMoves: [],
                  level: `${boardSize}x${boardSize}`
                };
                gameHistoryRef.current?.addGame('O', newScore.X, newScore.O, gameData);
                return newScore;
              });
              return 0;
            }
            return prev - 1;
          });
        } else if (activePlayer === "O") {
          setTimeO((prev) => {
            if (prev <= 1) {
              setActivePlayer(null);
              setTimeoutPlayer('O');
              setShowTimeoutAnimation(true);
              setScore(prevScore => {
                const newScore = { ...prevScore, X: prevScore.X + 1 };
                const gameData = {
                  duration: gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0,
                  totalMoves: currentMove,
                  boardSize,
                  gameMode,
                  aiDifficulty: gameMode === 'ai' ? aiDifficulty : null,
                  firstPlayer,
                  playerName: gameMode === 'ai' ? (localStorage.getItem('currentUser') || 'Joueur') : null,
                  winningMoves: [],
                  level: `${boardSize}x${boardSize}`
                };
                gameHistoryRef.current?.addGame('X', newScore.X, newScore.O, gameData);
                return newScore;
              });
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activePlayer, isGameOver, boardSize, currentMove, gameMode, gameStartTime, aiDifficulty, firstPlayer]);

  const makeAIMove = useCallback(() => {
    
    const aiSymbol = firstPlayer === 'X' ? 'O' : 'X';
    const playerSymbol = firstPlayer;
    let aiMove;
    
    const effectiveDifficulty = aiDifficulty;
    
    switch(effectiveDifficulty) {
      case 'easy':
        aiMove = makeRandomMove(currentSquares);
        break;
      case 'medium':
        aiMove = makeMediumMove(currentSquares, aiSymbol, playerSymbol, boardSize);
        break;
      case 'hard': {
        // Limiter la profondeur selon la taille du plateau
        const maxDepth = boardSize <= 3 ? 9 : (boardSize === 4 ? 5 : 4);
        const result = minimax(currentSquares, 0, true, aiSymbol, playerSymbol, boardSize, maxDepth);
        aiMove = result.move;
        break;
      }
      default:
        aiMove = makeRandomMove(currentSquares);
    }
        
    if (aiMove !== null) {
      const newSquares = [...currentSquares];
      newSquares[aiMove] = aiSymbol;
      handlePlay(newSquares);
    }
  }, [firstPlayer, aiDifficulty, currentSquares, boardSize, handlePlay]);

  // IA Move Effect
  useEffect(() => {
    if (gameMode === 'ai' && !isPlayerTurn && !isGameOver && gameStarted) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameMode, isPlayerTurn, isGameOver, gameStarted, currentMove, makeAIMove]);

  return (
    <main>
      <div className="game-container flex flex-col items-center min-h-screen px-4">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-4xl uppercase font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex-1">TIC TAC TOE</h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-white/80">👤 {user.username || user.email}</span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🚪 Déconnexion
              </button>
            </div>
          )}
        </div>

        {!gameStarted ? (
          <GameSetup 
            boardSize={boardSize}
            setBoardSize={handleSizeChange}
            firstPlayer={firstPlayer}
            setFirstPlayer={setFirstPlayer}
            gameMode={gameMode}
            setGameMode={setGameMode}
            aiDifficulty={aiDifficulty}
            setAiDifficulty={setAiDifficulty}
            onStartGame={startGame}
            onLoadGame={loadSavedGame}
            hasSavedGame={hasSavedGame}
          />
        ) : (
          <div className="flex gap-12 w-full max-w-7xl justify-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-white/90">Score</h2>
                  <div className="flex items-center text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                    Partie en cours
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400 mb-2">{`X: ${score.X} - ${score.O} :O`}</p>
                  <p className="text-sm text-white/80">{status}</p>
                </div>
              </div>

              <div className="flex gap-8">
                <Chronometer player="X" time={timeX} activePlayer={activePlayer} firstPlayer={firstPlayer} />
                <Chronometer player="O" time={timeO} activePlayer={activePlayer} firstPlayer={firstPlayer} />
              </div>

              <Board
                key={newGame} 
                xIsNext={xIsNext}
                squares={currentSquares}
                onPlay={handlePlay}
                winningSquares={winningLine}
                boardSize={boardSize}
              />

              <div className="flex gap-3">
                {!isGameOver && (
                  <button onClick={handleForfeit} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200">
                    🏳️ Forfait
                  </button>
                )}
                {isGameOver && (
                  <>
                    <button onClick={() => { restartGame(); setNewGame((prev) => prev + 1); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200">
                      🔄 Rejouer
                    </button>
                    <button onClick={() => { const seriesId = Date.now(); localStorage.setItem('currentSeries', seriesId.toString()); restartGame(); setNewGame((prev) => prev + 1); }} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200">
                      🆕 Nouvelle série
                    </button>
                    <button onClick={resetScore} className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200">
                      ✨ Reset complet
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="min-w-[300px]">
              <MoveHistory 
                history={history}
                currentMove={currentMove}
                onJumpTo={jumpTo}
                onRestart={handleRestart}
                isGameOver={isGameOver}
                boardSize={boardSize}
              />
            </div>
          </div>
        )}
        
        <GameHistoryTracker ref={gameHistoryRef} />
        
        {showVictoryAnimation && (
          <VictoryAnimation
            winner={winner || "Match nul"}
            gameMode={gameMode}
            firstPlayer={firstPlayer}
            onClose={() => setShowVictoryAnimation(false)}
          />
        )}
        
        {showTimeoutAnimation && (
          <TimeoutAnimation
            timeoutPlayer={timeoutPlayer}
            onClose={() => {
              setShowTimeoutAnimation(false);
              setTimeoutPlayer(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

export default Game;