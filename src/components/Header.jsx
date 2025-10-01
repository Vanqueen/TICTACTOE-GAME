import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl px-6 mx-auto py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide text-white hover:text-blue-300 transition-colors">
          🎮 TIC TAC TOE
        </Link>
        
        <button 
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
            {!mobileMenuOpen ? (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            )}
          </svg>
        </button>
        
        <nav className={`${
          mobileMenuOpen ? 'flex' : 'hidden'
        } absolute top-full left-0 w-full bg-black/50 backdrop-blur-md border-b border-white/20 flex-col py-4 md:relative md:top-auto md:left-auto md:w-auto md:bg-transparent md:border-none md:flex md:flex-row md:py-0`}>
          <Link 
            className={`px-4 py-2 mx-2 text-white font-medium rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-blue-500/80 hover:bg-blue-600/80' 
                : 'hover:bg-white/20'
            }`}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            🎲 Jeu
          </Link>
          <Link 
            className={`px-4 py-2 mx-2 text-white font-medium rounded-lg transition-all duration-200 ${
              isActive('/history') 
                ? 'bg-blue-500/80 hover:bg-blue-600/80' 
                : 'hover:bg-white/20'
            }`}
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
          >
            📈 Historique
          </Link>
          <Link 
            className={`px-4 py-2 mx-2 text-white font-medium rounded-lg transition-all duration-200 ${
              isActive('/multiplayer') 
                ? 'bg-blue-500/80 hover:bg-blue-600/80' 
                : 'hover:bg-white/20'
            }`}
            to="/multiplayer"
            onClick={() => setMobileMenuOpen(false)}
          >
            🌐 Multijoueur
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;