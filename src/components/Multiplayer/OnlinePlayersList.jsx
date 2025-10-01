import { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';

function OnlinePlayersList() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { socket, connected } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('onlineUsers');
    };
  }, [socket]);

  const invitePlayer = (targetUser) => {
    console.log('Inviting player:', targetUser.username);
    // TODO: Implement invite logic
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">👥 Joueurs en ligne</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-white/70 text-sm">
            {connected ? `${onlineUsers.length} connectés` : 'Déconnecté'}
          </span>
        </div>
      </div>

      {!connected && (
        <div className="text-center py-8">
          <div className="text-red-400 text-lg mb-2">🔌 Connexion perdue</div>
          <p className="text-white/60">Reconnexion en cours...</p>
        </div>
      )}

      {connected && onlineUsers.length === 0 && (
        <div className="text-center py-8">
          <div className="text-white/60 text-lg mb-2">😴 Aucun joueur en ligne</div>
          <p className="text-white/40">Soyez le premier à jouer !</p>
        </div>
      )}

      {connected && onlineUsers.length > 0 && (
        <div className="space-y-3">
          {onlineUsers.map((player) => (
            <div 
              key={player.socketId} 
              className="flex items-center justify-between bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {player.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {player.username}
                    {player.userId === user?.id && (
                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        Vous
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    En ligne
                  </div>
                </div>
              </div>

              {player.userId !== user?.id && (
                <button
                  onClick={() => invitePlayer(player)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  🎮 Inviter
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="text-center text-white/60 text-sm">
          💡 Créez une partie ou rejoignez-en une avec le code
        </div>
      </div>
    </div>
  );
}

export default OnlinePlayersList;