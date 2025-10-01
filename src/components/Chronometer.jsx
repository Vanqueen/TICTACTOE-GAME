function Chronometer({ player, time, activePlayer, firstPlayer }) {
  const isActive = player === activePlayer;
  const isLowTime = time <= 10;

  const formatTime = (time) => {
    if (typeof time !== 'number' || time < 0 || !isFinite(time)) {
      return '00:00';
    }
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getPlayerColor = () => {
    if (player === "X") return "from-red-400 to-red-600";
    if (player === "O") return "from-blue-400 to-blue-600";
    return "from-gray-400 to-gray-600";
  };

  const getTimeColor = () => {
    if (isLowTime) return "text-red-500 animate-pulse";
    if (isActive) return "text-white";
    return "text-gray-300";
  };

  return (
    <div className={`
      relative p-6 rounded-2xl w-40 text-center transition-all duration-300 transform
      ${isActive 
        ? 'bg-white/20 backdrop-blur-sm border-2 border-white/40 shadow-xl scale-105' 
        : 'bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg'
      }
      ${isLowTime ? 'animate-pulse' : ''}
    `}>
      {/* Indicateur actif */}
      {isActive && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping" />
      )}
      
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 bg-gradient-to-r ${getPlayerColor()} text-white`}>
        Joueur {player}
      </div>
      
      <div className={`text-3xl font-mono font-bold ${getTimeColor()}`}>
        {formatTime(time)}
      </div>
      
      {firstPlayer === player && (
        <div className="text-xs text-white/70 mt-1">
          Premier joueur
        </div>
      )}
    </div>
  );
}

export default Chronometer;
