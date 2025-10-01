import { useState, useEffect, useRef, useMemo } from "react";
import Board from "./Board";
import calculateWinner from "./Winner";
import Chronometer from "./Chronometer";
import GameSetup from "./GameSetup";
import GameHistoryTracker from "./GameHistoryTracker";
import MoveHistory from "./MoveHistory";
import VictoryAnimation from "./VictoryAnimation";
import TimeoutAnimation from "./TimeoutAnimation";
import { makeRandomMove, minimax, makeMediumMove } from "../utils/aiAlgorithms";

function Game() {
  const [boardSize, setBoardSize] = useState(3);
  const [history, setHistory] = useState([Array(boardSize * boardSize).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
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
  const [aiIsPlaying, setAiIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);
  const [showTimeoutAnimation, setShowTimeoutAnimation] = useState(false);
  const [timeoutPlayer, setTimeoutPlayer] = useState(null);
  const gameHistoryRef = useRef(null);

  const winnerInfo = useMemo(() => calculateWinner(currentSquares, boardSize), [currentSquares, boardSize]);
  const winner = winnerInfo?.winner;
  const winningLine = useMemo(() => winnerInfo?.winningSquares || [], [winnerInfo]);

  const isBoardFull = useMemo(() => !currentSquares.includes(null), [currentSquares]);
  const isGameOver = useMemo(() => winner || isBoardFull || timeX === 0 || timeO === 0, [winner, isBoardFull, timeX, timeO]);

  // Sauvegarder l'état de la partie en cours
  useEffect(() => {
    if (gameStarted && !isGameOver) {
      const gameState = {
        boardSize,
        history,
        currentMove,
        score,
        timeX,
        timeO,
        firstPlayer,
        activePlayer,
        gameMode,
        aiDifficulty,
        gameStartTime,
        savedAt: Date.now()
      };
      localStorage.setItem('currentGame', JSON.stringify(gameState));
    } else if (isGameOver) {
      localStorage.removeItem('currentGame');
    }
  }, [gameStarted, isGameOver, boardSize, history, currentMove, score, timeX, timeO, firstPlayer, activePlayer, gameMode, aiDifficulty, gameStartTime]);
  
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
      const currentPlayer = xIsNext ? "X" : "O";
      return currentPlayer === firstPlayer ? '👤 Votre tour' : '🤖 Tour de l\'IA';
    }
    
    return `Tour du joueur : ${xIsNext ? "X" : "O"}`;
  }, [winner, timeX, timeO, isBoardFull, xIsNext, gameMode, firstPlayer]);

  function handlePlay(nextSquares) {
    if (!gameStarted || isGameOver) return;
    
    console.log('=== handlePlay DEBUG ===');
    console.log('currentMove:', currentMove);
    console.log('xIsNext:', xIsNext);
    console.log('gameMode:', gameMode);
    console.log('firstPlayer:', firstPlayer);
    console.log('aiIsPlaying:', aiIsPlaying);
    
    // En mode IA, vérifier que c'est le tour du joueur humain
    if (gameMode === 'ai' && !aiIsPlaying && !isPlayerTurn) {
      console.log('Bloqué - pas le tour du joueur humain (isPlayerTurn=false)');
      return;
    }
    
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    const playedValue = gameMode === 'ai' ? firstPlayer : (xIsNext ? "X" : "O");
    const nextPlayer = playedValue === "X" ? "O" : "X";
    setActivePlayer(nextPlayer);
    
    // En mode IA, basculer le tour
    if (gameMode === 'ai') {
      setIsPlayerTurn(false); // C'est maintenant le tour de l'IA
      if (nextPlayer !== firstPlayer && !calculateWinner(nextSquares, boardSize)) {
        setTimeout(() => makeAIMove(nextSquares), 500);
      }
    }
  }
  
  function makeAIMove(currentSquares) {
    if (isGameOver) return;
    
    setAiIsPlaying(true);
    const aiSymbol = firstPlayer === 'X' ? 'O' : 'X';
    const playerSymbol = firstPlayer;
    let aiMove;
    
    switch(aiDifficulty) {
      case 'easy': {
        aiMove = makeRandomMove(currentSquares);
        break;
      }
      case 'medium': {
        aiMove = makeMediumMove(currentSquares, aiSymbol, playerSymbol, boardSize);
        break;
      }
      case 'hard': {
        const result = minimax(currentSquares, 0, true, aiSymbol, playerSymbol, boardSize);
        aiMove = result.move;
        break;
      }
      default: {
        aiMove = makeRandomMove(currentSquares);
      }
    }
    
    if (aiMove !== null) {
      const newSquares = [...currentSquares];
      newSquares[aiMove] = aiSymbol;
      
      const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
      setHistory(nextHistory);
      const newMoveIndex = nextHistory.length - 1;
      setCurrentMove(newMoveIndex);
      setActivePlayer(playerSymbol);
      setIsPlayerTurn(true); // C'est maintenant le tour du joueur
      console.log('IA a joué, nouveau currentMove:', newMoveIndex);
    }
    
    setAiIsPlaying(false);
  }

  function jumpTo(nextMove) {
    if (nextMove < 0 || nextMove >= history.length || isGameOver) return;
    setCurrentMove(nextMove);
  }

  const resetGameState = () => {
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
    setFirstPlayer("X");
    setActivePlayer(null);
    setGameStarted(false);
    setTimeX(60);
    setTimeO(60);
    setGameStartTime(null);
    localStorage.removeItem('currentGame');
  };

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
        setIsPlayerTurn(gameState.activePlayer === gameState.firstPlayer);
        return true;
      }
    } catch {
      localStorage.removeItem('currentGame');
    }
    return false;
  };

  const hasSavedGame = () => {
    try {
      const saved = localStorage.getItem('currentGame');
      return saved !== null;
    } catch {
      return false;
    }
  };

  function handleRestart() {
    resetGameState();
    setNewGame((prev) => prev + 1);
  }

  function startGame() {
    setGameStarted(true);
    setActivePlayer(firstPlayer);
    setIsPlayerTurn(true);
    setGameStartTime(Date.now());
    
    // Si mode IA et l'IA commence
    if (gameMode === 'ai' && firstPlayer === 'O') {
      setIsPlayerTurn(false);
      setTimeout(() => makeAIMove(currentSquares), 1000);
    }
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

  useEffect(() => {
    if (winner) {
      setActivePlayer(null);
      setShowVictoryAnimation(true);
      setScore((prev) => {
        const newScore = {
          ...prev,
          [winner]: prev[winner] + 1,
        };
        const gameData = {
          duration: gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0,
          totalMoves: currentMove,
          boardSize,
          gameMode,
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
          winningMoves: [],
          level: `${boardSize}x${boardSize}`
        };
        gameHistoryRef.current?.addGame(null, prev.X, prev.O, gameData);
        return prev;
      });
    }
  }, [winner, isBoardFull, currentMove, gameStartTime, boardSize, gameMode, winningLine]);

  function handleSizeChange(size) {
    setBoardSize(size);
    setHistory([Array(size * size).fill(null)]);
    setCurrentMove(0);
  }

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
  }, [activePlayer, isGameOver]);

  return (
    <main>
      <div className="game-container flex flex-col items-center min-h-screen px-4">
        <h1 className="text-4xl uppercase font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">TIC TAC TOE</h1>

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
            hasSavedGame={hasSavedGame()}
          />
        ) : (
          <div className="flex gap-12 w-full max-w-7xl justify-center">
            {/* Partie gauche - Jeu principal */}
            <div className="flex flex-col items-center space-y-6">
              {/* Score compact */}
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

              {/* Chronometers */}
              <div className="flex gap-8">
                <Chronometer
                  player="X"
                  time={timeX}
                  activePlayer={activePlayer}
                  firstPlayer={firstPlayer}
                />
                <Chronometer
                  player="O"
                  time={timeO}
                  activePlayer={activePlayer}
                  firstPlayer={firstPlayer}
                />
              </div>

              {/* Plateau */}
              <Board
                key={newGame} 
                xIsNext={gameMode === 'ai' ? (firstPlayer === 'X') : xIsNext}
                squares={currentSquares}
                onPlay={handlePlay}
                winningSquares={winningLine}
                boardSize={boardSize}
              />

              {/* Boutons si jeu terminé */}
              {isGameOver && (
                <div className="flex gap-4">
                  <button 
                    onClick={resetScore}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    ✨ Recommencer à zéro
                  </button>
                  <button 
                    onClick={() => {
                      const seriesId = Date.now();
                      localStorage.setItem('currentSeries', seriesId.toString());
                      resetScore();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🆕 Nouvelle série
                  </button>
                </div>
              )}
            </div>

            {/* Partie droite - Historique */}
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
        
        {/* GameHistoryTracker invisible pour maintenir la référence */}
        <GameHistoryTracker ref={gameHistoryRef} />
        
        {/* Animation de victoire */}
        {showVictoryAnimation && (
          <VictoryAnimation
            winner={winner || "Match nul"}
            gameMode={gameMode}
            firstPlayer={firstPlayer}
            onClose={() => setShowVictoryAnimation(false)}
          />
        )}
        
        {/* Animation de temps écoulé */}
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