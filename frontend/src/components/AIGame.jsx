import { useState, useEffect } from "react";
import Board from "./Board";
import calculateWinner from "./Winner";

function AIGame() {
  const [gameMode, setGameMode] = useState('human'); // 'human' ou 'ai'
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [playerSymbol, setPlayerSymbol] = useState('X'); // Joueur humain
  const [aiSymbol, setAiSymbol] = useState('O'); // IA
  
  // États du jeu (similaires à Game.jsx)
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // Logique IA à implémenter
  const makeAIMove = () => {
    // Algorithme selon la difficulté
    switch(aiDifficulty) {
      case 'easy': return makeRandomMove();
      case 'medium': return makeMediumMove();
      case 'hard': return makeMinimaxMove();
    }
  };

  return (
    <div>
      {/* Interface de sélection du mode */}
      {/* Plateau de jeu */}
      {/* Logique IA */}
    </div>
  );
}

export default AIGame;