import { useEffect, useState } from 'react';

function TimeoutAnimation({ timeoutPlayer, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500 ${
      show ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-3xl p-8 text-center transform transition-all duration-500 ${
        show ? 'scale-100' : 'scale-75'
      }`}>
        {/* Horloge animée */}
        <div className="text-8xl mb-4 animate-bounce">
          ⏰
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-red-400 animate-pulse">
          Temps Écoulé !
        </h1>
        
        <p className="text-white/80 text-xl mb-2">
          Joueur {timeoutPlayer} a dépassé le temps limite
        </p>
        
        <p className="text-red-300 text-lg mb-6">
          {timeoutPlayer === 'X' ? 'O' : 'X'} remporte la partie !
        </p>
        
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 500);
          }}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
        >
          ⏱️ Continuer
        </button>
      </div>
    </div>
  );
}

export default TimeoutAnimation;