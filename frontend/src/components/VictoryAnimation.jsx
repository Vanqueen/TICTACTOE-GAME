import { useEffect, useState } from 'react';

function VictoryAnimation({ winner, gameMode, firstPlayer, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getWinnerMessage = () => {
    if (winner === "Match nul") return "🤝 Match Nul !";
    if (gameMode === 'ai') {
      return winner === firstPlayer ? "🎉 Victoire !" : "🤖 L'IA Gagne !";
    }
    return `🎉 Joueur ${winner} Gagne !`;
  };

  const getWinnerColor = () => {
    if (winner === "Match nul") return "text-yellow-400";
    if (gameMode === 'ai') {
      return winner === firstPlayer ? "text-green-400" : "text-red-400";
    }
    return winner === "X" ? "text-red-400" : "text-blue-400";
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-500 ${
      show ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center transform transition-all duration-500 ${
        show ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
      }`}>
        {/* Confettis animés */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>

        {/* Contenu principal */}
        <div className="relative z-10">
          <div className="text-8xl mb-4 animate-pulse">
            {winner === "Match nul" ? "🤝" : "🏆"}
          </div>
          
          <h1 className={`text-4xl font-bold mb-4 ${getWinnerColor()} animate-bounce`}>
            {getWinnerMessage()}
          </h1>
          
          {winner !== "Match nul" && (
            <div className="text-6xl mb-4 animate-spin" style={{ animationDuration: '2s' }}>
              ⭐
            </div>
          )}
          
          <p className="text-white/80 text-lg mb-6">
            {winner === "Match nul" ? "Bien joué à tous les deux !" : "Félicitations !"}
          </p>
          
          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 500);
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            ✨ Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

export default VictoryAnimation;