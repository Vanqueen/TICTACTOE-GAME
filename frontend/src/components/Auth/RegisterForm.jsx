import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function RegisterForm({ onToggle }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result && result.success && result.user) {
        localStorage.setItem('currentUser', result.user.username || result.user.email);
      } else {
        setError(result?.message || 'Échec de l\'inscription');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err?.message || 'Une erreur d\'inscription est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">📝 Inscription</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={20}
            className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="VotreNom"
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          {loading ? '⏳ Inscription...' : '✨ S\'inscrire'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/70">
          Déjà un compte ?{' '}
          <button
            onClick={onToggle}
            className="text-blue-300 hover:text-blue-200 font-medium"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;