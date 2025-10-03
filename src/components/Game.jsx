/**
 * 🎮 COMPOSANT PRINCIPAL DU JEU TIC TAC TOE
 * 
 * Ce composant gère toute la logique du jeu :
 * - Mode solo (2 joueurs) et contre IA (3 niveaux)
 * - Plateaux variables (3x3, 4x4, 5x5)
 * - Chronometers, scores, historique
 * - Authentification et sauvegarde
 */

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

function Game() {
  // ========================================
  // 📊 ÉTATS DU JEU
  // ========================================
  
  /** Taille du plateau (3, 4 ou 5) */
  const [boardSize, setBoardSize] = useState(3);
  
  /** Historique des coups - tableau de plateaux */
  const [history, setHistory] = useState(() => [Array(boardSize * boardSize).fill(null)]);
  
  /** Index du coup actuel dans l'historique */
  const [currentMove, setCurrentMove] = useState(0);
  
  /** Score persistant X vs O */
  const [score, setScore] = useState(() => {
    try {
      const savedScore = localStorage.getItem("score");
      return savedScore ? JSON.parse(savedScore) : { X: 0, O: 0 };
    } catch {
      return { X: 0, O: 0 };
    }
  });

  /** Compteur de parties pour forcer le re-rendu */
  const [newGame, setNewGame] = useState(() => {
    try {
      const savedGames = localStorage.getItem("games");
      return savedGames ? JSON.parse(savedGames) : 0;
    } catch {
      return 0;
    }
  });

  // ========================================
  // ⏱️ CHRONOMETERS
  // ========================================
  
  /** Temps restant pour le joueur X (en secondes) */
  const [timeX, setTimeX] = useState(60);
  
  /** Temps restant pour le joueur O (en secondes) */
  const [timeO, setTimeO] = useState(60);

  // ========================================
  // 🎮 CONFIGURATION DE PARTIE
  // ========================================
  
  /** Joueur qui commence (X ou O) */
  const [firstPlayer, setFirstPlayer] = useState("X");
  
  /** Joueur actuellement actif */
  const [activePlayer, setActivePlayer] = useState(null);
  
  /** État du jeu (démarré ou non) */
  const [gameStarted, setGameStarted] = useState(false);
  
  /** Mode de jeu : 'human' (2 joueurs) ou 'ai' (contre IA) */
  const [gameMode, setGameMode] = useState('human');
  
  /** Difficulté IA : 'easy', 'medium', 'hard' */
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  
  /** Timestamp de début de partie */
  const [gameStartTime, setGameStartTime] = useState(null);

  // ========================================
  // 🎬 ANIMATIONS
  // ========================================
  
  /** Affichage animation de victoire */
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);
  
  /** Affichage animation de timeout */
  const [showTimeoutAnimation, setShowTimeoutAnimation] = useState(false);
  
  /** Joueur qui a fait timeout */
  const [timeoutPlayer, setTimeoutPlayer] = useState(null);

  // ========================================
  // 📝 RÉFÉRENCES
  // ========================================
  
  /** Référence vers le tracker d'historique */
  const gameHistoryRef = useRef(null);

  // ========================================
  // 🧮 VALEURS CALCULÉES (useMemo)
  // ========================================
  
  /** Plateau actuel basé sur l'historique */
  const currentSquares = history[currentMove];
  
  /** Détermine si c'est le tour de X (coups pairs) */
  const xIsNext = currentMove % 2 === 0;
  
  /** Calcul du gagnant et ligne gagnante */
  const winnerInfo = useMemo(() => calculateWinner(currentSquares, boardSize), [currentSquares, boardSize]);
  const winner = winnerInfo?.winner;
  const winningLine = useMemo(() => winnerInfo?.winningSquares || [], [winnerInfo]);

  /** Vérifie si le plateau est plein */
  const isBoardFull = useMemo(() => !currentSquares.includes(null), [currentSquares]);
  
  /** Détermine si la partie est terminée */
  const isGameOver = useMemo(() => winner || isBoardFull || timeX === 0 || timeO === 0, [winner, isBoardFull, timeX, timeO]);

  /** Joueur actuel (X ou O) */
  const currentPlayer = useMemo(() => xIsNext ? "X" : "O", [xIsNext]);
  
  /** Détermine si c'est le tour du joueur humain (en mode IA) */
  const isPlayerTurn = useMemo(() => {
    if (gameMode === 'human') return true;
    return currentPlayer === firstPlayer;
  }, [gameMode, currentPlayer, firstPlayer]);

  /** Message de statut affiché à l'utilisateur */
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

  // ========================================
  // 🎯 LOGIQUE DE JEU PRINCIPALE
  // ========================================

  /**
   * Gère un coup joué (par joueur humain ou IA)
   * Met à jour l'historique et change de joueur actif
   */
  const handlePlay = useCallback((nextSquares) => {
    // Vérifications de base
    if (!gameStarted || isGameOver) return;
    
    // Mise à jour de l'historique
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    // Changement de joueur actif
    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setActivePlayer(nextPlayer);
  }, [gameStarted, isGameOver, history, currentMove, currentPlayer]);

  /**
   * Navigation dans l'historique des coups
   * Permet de revenir à un coup précédent
   */
  function jumpTo(nextMove) {
    if (nextMove < 0 || nextMove >= history.length || isGameOver) return;
    setCurrentMove(nextMove);
  }

  /**
   * Change la taille du plateau
   * Remet à zéro l'historique avec la nouvelle taille
   */
  function handleSizeChange(size) {
    setBoardSize(size);
    const newBoard = Array(size * size).fill(null);
    setHistory([newBoard]);
    setCurrentMove(0);
  }

  // ========================================
  // 🔄 GESTION DES PARTIES
  // ========================================

  /**
   * Remet à zéro l'état du jeu
   * Utilisé pour commencer une nouvelle partie
   */
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

  /**
   * Redémarre une partie avec les mêmes paramètres
   * Garde le score et les configurations
   */
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

  /**
   * Démarre une nouvelle partie
   * Initialise le plateau et les chronometers
   */
  function startGame() {
    const emptyBoard = Array(boardSize * boardSize).fill(null);
    setHistory([emptyBoard]);
    setCurrentMove(0);
    setGameStarted(true);
    setActivePlayer('X');
    setGameStartTime(Date.now());
  }

  /**
   * Gère l'abandon de partie (forfait)
   * Donne la victoire à l'adversaire
   */
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

  /**
   * Reset complet : score, parties, état
   * Remet tout à zéro
   */
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

  /**
   * Redémarre avec nouveau compteur de partie
   * Force le re-rendu des composants
   */
  function handleRestart() {
    resetGameState();
    setNewGame((prev) => prev + 1);
  }

  // ========================================
  // 💾 SAUVEGARDE/CHARGEMENT
  // ========================================

  /**
   * Charge une partie sauvegardée depuis localStorage
   * Restaure tous les états de jeu
   */
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

  /**
   * Vérifie s'il existe une partie sauvegardée
   */
  const hasSavedGame = useMemo(() => {
    try {
      const saved = localStorage.getItem('currentGame');
      return saved !== null;
    } catch {
      return false;
    }
  }, []);

  // ========================================
  // 🤖 INTELLIGENCE ARTIFICIELLE
  // ========================================

  /**
   * Fait jouer l'IA selon la difficulté choisie
   * - Easy: Coups aléatoires
   * - Medium: 70% Minimax + 30% aléatoire
   * - Hard: Minimax complet avec profondeur limitée
   */
  const makeAIMove = useCallback(() => {
    const aiSymbol = firstPlayer === 'X' ? 'O' : 'X';
    const playerSymbol = firstPlayer;
    let aiMove;
    
    switch(aiDifficulty) {
      case 'easy':
        // Coup complètement aléatoire
        aiMove = makeRandomMove(currentSquares);
        break;
      case 'medium':
        // Mélange stratégie et hasard
        aiMove = makeMediumMove(currentSquares, aiSymbol, playerSymbol, boardSize);
        break;
      case 'hard': {
        // Algorithme Minimax avec profondeur adaptée
        const maxDepth = boardSize <= 3 ? 9 : (boardSize === 4 ? 5 : 4);
        const result = minimax(currentSquares, 0, true, aiSymbol, playerSymbol, boardSize, maxDepth);
        aiMove = result.move;
        break;
      }
      default:
        aiMove = makeRandomMove(currentSquares);
    }
    
    // Exécute le coup de l'IA
    if (aiMove !== null) {
      const newSquares = [...currentSquares];
      newSquares[aiMove] = aiSymbol;
      handlePlay(newSquares);
    }
  }, [firstPlayer, aiDifficulty, currentSquares, boardSize, handlePlay]);

  // ========================================
  // ⚡ EFFETS (useEffect)
  // ========================================

  /**
   * EFFET: Sauvegarde automatique de l'état de jeu
   * Sauvegarde en continu pendant la partie
   */
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

  /**
   * EFFET: Sauvegarde du score
   * Persiste le score à chaque changement
   */
  useEffect(() => {
    try {
      localStorage.setItem("score", JSON.stringify(score));
    } catch {
      console.warn('Failed to save score to localStorage');
    }
  }, [score]);

  /**
   * EFFET: Sauvegarde du compteur de parties
   */
  useEffect(() => {
    try {
      localStorage.setItem("games", JSON.stringify(newGame));
    } catch {
      console.warn('Failed to save games to localStorage');
    }
  }, [newGame]);

  /**
   * EFFET: Gestion de fin de partie
   * Détecte victoire/match nul et met à jour les scores
   */
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

  /**
   * EFFET: Chronometers automatiques
   * Décompte le temps et gère les timeouts
   */
  useEffect(() => {
    let timer;
    if (activePlayer && !isGameOver) {
      timer = setInterval(() => {
        if (activePlayer === "X") {
          setTimeX((prev) => {
            if (prev <= 1) {
              // Timeout du joueur X
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
              // Timeout du joueur O
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

  /**
   * EFFET: Déclenchement automatique de l'IA
   * L'IA joue automatiquement quand c'est son tour
   */
  useEffect(() => {
    if (gameMode === 'ai' && !isPlayerTurn && !isGameOver && gameStarted) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500); // Délai de 500ms pour l'expérience utilisateur
      return () => clearTimeout(timer);
    }
  }, [gameMode, isPlayerTurn, isGameOver, gameStarted, currentMove, makeAIMove]);

  // ========================================
  // 🎨 RENDU JSX
  // ========================================

  return (
    <main>
      <div className="game-container flex flex-col items-center min-h-screen px-4">
        {/* En-tête avec titre et bouton déconnexion */}
        <h1 className="text-4xl uppercase font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          TIC TAC TOE
        </h1>

        {/* Configuration de partie OU Interface de jeu */}
        {!gameStarted ? (
          // 🎛️ ÉCRAN DE CONFIGURATION
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
          // 🎮 INTERFACE DE JEU PRINCIPALE
          <div className="flex gap-12 w-full max-w-7xl justify-center">
            {/* Colonne gauche - Jeu principal */}
            <div className="flex flex-col items-center space-y-6">
              {/* Panneau de score */}
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

              {/* Chronometers des joueurs */}
              <div className="flex gap-8">
                <Chronometer player="X" time={timeX} activePlayer={activePlayer} firstPlayer={firstPlayer} />
                <Chronometer player="O" time={timeO} activePlayer={activePlayer} firstPlayer={firstPlayer} />
              </div>

              {/* Plateau de jeu */}
              <Board
                key={newGame} 
                xIsNext={xIsNext}
                squares={currentSquares}
                onPlay={handlePlay}
                winningSquares={winningLine}
                boardSize={boardSize}
              />

              {/* Boutons de contrôle */}
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

            {/* Colonne droite - Historique des coups */}
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
        
        {/* Composants invisibles mais nécessaires */}
        <GameHistoryTracker ref={gameHistoryRef} />
        
        {/* Animations de fin de partie */}
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