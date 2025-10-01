import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import OnlinePlayersList from './OnlinePlayersList';

function MultiplayerLobby({ onGameStart }) {
  const [roomId, setRoomId] = useState('');
  const [boardSize, setBoardSize] = useState(3);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('roomCreated', ({ roomId, game }) => {
      onGameStart(roomId, game);
    });

    socket.on('gameStart', (game) => {
      onGameStart(game.roomId, game);
    });

    socket.on('joinError', (message) => {
      console.error('Join error:', message);
      setLoading(false);
    });



    return () => {
      socket.off('roomCreated');
      socket.off('gameStart');
      socket.off('joinError');

    };
  }, [socket, onGameStart, user.username]);

  const createRoom = () => {
    if (!socket) return;
    setLoading(true);
    socket.emit('createRoom', { boardSize });
  };

  const joinRoom = (targetRoomId) => {
    if (!socket) return;
    setLoading(true);
    socket.emit('joinRoom', targetRoomId);
  };

  const joinRoomById = () => {
    if (!roomId.trim()) return;
    joinRoom(roomId.toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🌐 Multijoueur</h1>
        <p className="text-white/70">Bienvenue {user.username?.replace(/[<>"'&]/g, '')} !</p>
        <div className="mt-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            connected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connected ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            {connected ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 Créer une partie</h2>
          
          <div className="mb-4">
            <label className="block text-white/90 text-sm font-medium mb-2">
              Taille du plateau
            </label>
            <select 
              value={boardSize} 
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:border-blue-400 focus:outline-none"
            >
              <option value={3} className="bg-gray-800">3x3 (Classique)</option>
              <option value={4} className="bg-gray-800">4x4 (Intermédiaire)</option>
              <option value={5} className="bg-gray-800">5x5 (Avancé)</option>
            </select>
          </div>

          <button
            onClick={createRoom}
            disabled={loading || !connected}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {loading ? '⏳ Création...' : '🚀 Créer une partie'}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🔗 Rejoindre une partie</h2>
          
          <div className="mb-4">
            <label className="block text-white/90 text-sm font-medium mb-2">
              Code de la partie
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Ex: ABC123"
              className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:outline-none"
            />
          </div>

          <button
            onClick={joinRoomById}
            disabled={loading || !connected || !roomId.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {loading ? '⏳ Connexion...' : '🎯 Rejoindre'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <OnlinePlayersList />
      </div>
    </div>
  );
}

export default MultiplayerLobby;