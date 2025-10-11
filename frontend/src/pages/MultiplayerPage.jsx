import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import MultiplayerLobby from '../components/Multiplayer/MultiplayerLobby';

function MultiplayerPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();

  const handleGameStart = (roomId, game) => {
    console.log('Game started:', roomId, game);
    // TODO: Navigate to game or update UI
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">⏳ Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggle={() => setIsLogin(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <MultiplayerLobby onGameStart={handleGameStart} />
    </div>
  );
}

export default MultiplayerPage;