import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Game from './components/Game';
import HistoryPage from './pages/HistoryPage';
import MultiplayerPage from './pages/MultiplayerPage';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <Header />
            <Routes>
              <Route path="/" element={<Game />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/multiplayer" element={<MultiplayerPage />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
