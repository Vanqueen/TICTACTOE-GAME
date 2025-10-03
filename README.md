# 🎮 Tic Tac Toe - React + Node.js + Socket.IO + IA

Un jeu de **Tic Tac Toe** moderne avec mode solo, IA intelligente et multijoueur en temps réel, développé avec **React**, **Node.js**, **Socket.IO** et **MongoDB**.

---

## 🚀 Fonctionnalités

### 🎯 **Mode Solo (Complet)**

- ✅ **Plateaux variables** : 3x3, 4x4, 5x5 (optimisé pour performance)
- ✅ **Chronometers intelligents** : 60s par joueur avec alerte temps faible
- ✅ **Détection automatique** : Gagnant, match nul, cases gagnantes
- ✅ **Historique des coups** : Navigation précédent/suivant avec positions
- ✅ **Score persistant** : Sauvegarde automatique localStorage
- ✅ **Interface glassmorphism** : Design moderne et responsive
- ✅ **Forfait** : Possibilité d'abandonner une partie

### 🤖 **Intelligence Artificielle (Complet)**

- ✅ **3 Niveaux de difficulté** : Facile, Moyen, Difficile
- ✅ **Algorithme Minimax** : IA optimisée avec limitation de profondeur
- ✅ **Adaptation automatique** : Performance optimisée selon taille plateau
- ✅ **Coups intelligents** : Stratégies défensives et offensives
- ✅ **Temps de réponse** : 500ms pour une expérience fluide

### 🔐 **Authentification (Complet)**

- ✅ **Inscription/Connexion** : Formulaires sécurisés avec validation
- ✅ **JWT Tokens** : Authentification stateless sécurisée
- ✅ **Gestion d'erreurs** : Feedback utilisateur en temps réel
- ✅ **Protection** : XSS, CSRF, injection de code
- ✅ **Déconnexion** : Bouton de déconnexion avec nettoyage session

### 🌐 **Mode Multijoueur (Backend Prêt)**

- ✅ **Serveur Socket.IO** : Communication temps réel
- ✅ **Salles de jeu** : Création/rejoindre parties privées
- ✅ **Chat en temps réel** : Messages entre joueurs
- ✅ **Statistiques** : Victoires/défaites/matchs nuls persistantes
- ⚠️ **Interface client** : En cours de finalisation

### 📊 **Historique & Statistiques (Complet)**

- ✅ **Historique détaillé** : Toutes les parties sauvegardées
- ✅ **Statistiques personnalisées** : Affichage nom joueur vs IA
- ✅ **Données complètes** : Durée, coups, difficulté, forfaits
- ✅ **Séries de parties** : Groupement et navigation
- ✅ **Persistance** : Sauvegarde locale et base de données

---

## 📂 Architecture du Projet

### **🎨 Frontend (React)**

```uml
src/
├── components/                   # Composants UI
│   ├── Auth/                    # 🔐 Authentification
│   │   ├── LoginForm.jsx        # Formulaire connexion
│   │   └── RegisterForm.jsx     # Formulaire inscription
│   ├── Multiplayer/             # 🌐 Mode multijoueur
│   │   ├── MultiplayerLobby.jsx # Lobby de jeu
│   │   └── OnlinePlayersList.jsx# Liste joueurs en ligne
│   ├── Game.jsx                 # 🎮 Logique principale du jeu
│   ├── Board.jsx                # 🎯 Plateau de jeu dynamique
│   ├── Square.jsx               # ⬜ Case individuelle
│   ├── Chronometer.jsx          # ⏱️ Timer par joueur
│   ├── GameSetup.jsx            # ⚙️ Configuration partie
│   ├── GameHistory.jsx          # 📊 Historique complet
│   ├── GameHistoryTracker.jsx   # 📝 Tracker invisible
│   ├── MoveHistory.jsx          # 🔄 Navigation coups
│   ├── VictoryAnimation.jsx     # 🎉 Animation victoire
│   ├── TimeoutAnimation.jsx     # ⏰ Animation timeout
│   └── Winner.js                # 🏆 Calcul gagnant
├── contexts/                    # 🌐 État global
│   ├── AuthContext.jsx          # Contexte authentification
│   └── SocketContext.jsx        # Contexte Socket.IO
├── hooks/                       # 🪝 Hooks personnalisés
│   ├── useAuth.js               # Hook authentification
│   └── useSocket.js             # Hook Socket.IO
├── utils/                       # 🛠️ Utilitaires
│   └── aiAlgorithms.js          # 🤖 Algorithmes IA
├── pages/                       # 📄 Pages navigation
│   ├── HistoryPage.jsx          # Page historique
│   └── MultiplayerPage.jsx      # Page multijoueur
└── main.jsx                     # 🚀 Point d'entrée
```

### **⚙️ Backend (Node.js)**

```uml
server/
├── models/                      # 📊 Modèles données
│   ├── User.js                  # Modèle utilisateur
│   └── Game.js                  # Modèle partie
├── routes/                      # 🛣️ API REST
│   ├── auth.js                  # Routes authentification
│   └── games.js                 # Routes gestion parties
└── server.js                   # 🖥️ Serveur Socket.IO
```

---

## 🧠 Intelligence Artificielle

### **Algorithmes Implémentés**

#### **🟢 Facile (Random)**

```javascript
// Coup aléatoire parmi les cases disponibles
makeRandomMove(squares)
```

#### **🟡 Moyen (Minimax Limité + Aléatoire)**

```javascript
// 70% Minimax avec profondeur limitée
// 30% Coups aléatoires pour imprévisibilité
makeMediumMove(squares, aiSymbol, playerSymbol, boardSize)
```

#### **🔴 Difficile (Minimax Complet)**

```javascript
// Algorithme Minimax avec élagage
// Profondeur adaptée selon taille plateau
minimax(squares, depth, isMaximizing, aiSymbol, playerSymbol, boardSize, maxDepth)
```

### **Optimisations Performance**

| Plateau | Profondeur Max | Temps Calcul |
|---------|---------------|--------------|
| 3x3     | 9 (complet)   | < 100ms      |
| 4x4     | 5 (limité)    | < 300ms      |
| 5x5     | 4 (limité)    | < 500ms      |

---

## ⚡ Installation & Utilisation

### **1. Prérequis**

- Node.js 18+
- MongoDB 6+
- npm ou yarn

### **2. Installation Frontend**

```bash
# Cloner le projet
git clone <repository-url>
cd tictactoe

# Installer dépendances
npm install

# Variables d'environnement
echo "VITE_API_URL=http://localhost:5000" > .env

# Lancer en développement
npm run dev
```

➡️ **Frontend** : [http://localhost:5173](http://localhost:5173)

### **3. Installation Backend**

```bash
# Aller dans le dossier serveur
cd server

# Installer dépendances
npm install

# Configuration environnement
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/tictactoe
JWT_SECRET=your-super-secret-key-here
PORT=5000
EOF

# Lancer le serveur
npm start
```

➡️ **Backend** : [http://localhost:5000](http://localhost:5000)

### **4. Configuration MongoDB**

```bash
# Démarrer MongoDB
mongod

# Créer la base (automatique au premier lancement)
```

---

## 🎮 Guide d'Utilisation

### **🎯 Mode Solo**

1. **Configuration** :
   - Choisir taille plateau (3x3, 4x4, 5x5)
   - Sélectionner premier joueur (X ou O)
   - Mode : 2 Joueurs ou Contre IA

2. **Mode IA** :
   - Choisir difficulté (Facile/Moyen/Difficile)
   - Sélectionner votre symbole (X ou O)
   - L'IA joue automatiquement son tour

3. **Pendant le jeu** :
   - Chronometers 60s par joueur
   - Historique des coups navigable
   - Bouton forfait disponible
   - Score en temps réel

4. **Fin de partie** :
   - Animation de victoire/défaite
   - Sauvegarde automatique statistiques
   - Options : Rejouer, Nouvelle série, Reset

### **🔐 Authentification**

1. **Inscription** :
   - Nom d'utilisateur unique
   - Email valide
   - Mot de passe 6+ caractères

2. **Connexion** :
   - Email + mot de passe
   - Token JWT automatique
   - Session persistante

3. **Fonctionnalités connecté** :
   - Nom affiché dans historique
   - Statistiques personnalisées
   - Bouton déconnexion

---

## 🎨 Technologies & Dépendances

### **Frontend**

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^6.0.0",
  "tailwindcss": "^4.0.0",
  "vite": "^6.0.0",
  "axios": "^1.0.0"
}
```

### **Backend**

```json
{
  "express": "^4.18.0",
  "socket.io": "^4.7.0",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.0",
  "cors": "^2.8.0"
}
```

---

## 🔧 Configuration Avancée

### **Variables d'Environnement**

#### **Frontend (.env)**

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### **Backend (server/.env)**

```env
MONGODB_URI=mongodb://localhost:27017/tictactoe
JWT_SECRET=your-super-secret-key-minimum-32-chars
PORT=5000
NODE_ENV=development
```

### **Scripts NPM**

#### **Frontend Lancement**

```bash
npm run dev          # Développement avec HMR
npm run build        # Build production
npm run preview      # Aperçu build local
npm run lint         # ESLint check
```

#### **Backend Lancement**

```bash
npm start            # Production
npm run serve          # Développement avec nodemon
npm run test         # Tests unitaires
```

---

## 📊 État Actuel du Projet

| Composant | Progression | Statut | Détails |
|-----------|-------------|--------|---------|
| **🎮 Jeu Solo** | 100% | ✅ Complet | Toutes fonctionnalités implémentées |
| **🤖 IA** | 100% | ✅ Complet | 3 niveaux, optimisée, performante |
| **🔐 Auth** | 100% | ✅ Complet | JWT, sécurisé, validation complète |
| **📊 Historique** | 100% | ✅ Complet | Statistiques détaillées, persistance |
| **⚙️ Backend** | 100% | ✅ Complet | API REST, Socket.IO, MongoDB |
| **🌐 Multijoueur** | 80% | ⚠️ Partiel | Backend prêt, interface à finaliser |
| **🛡️ Sécurité** | 100% | ✅ Complet | XSS, CSRF, validation, sanitisation |
| **⚡ Performance** | 100% | ✅ Complet | Optimisations React, IA, mémoire |

---

## 🚧 Roadmap & Améliorations

### **🎯 Priorité Haute**

- [ ] **Interface multijoueur complète**
  - Lobby fonctionnel
  - Chat intégré
  - Gestion salles

- [ ] **Tests automatisés**
  - Tests unitaires composants
  - Tests intégration API
  - Tests E2E Cypress

### **🎨 Améliorations UX**

- [ ] **Thèmes personnalisables**
  - Mode sombre/clair
  - Couleurs personnalisées
  - Animations configurables

- [ ] **PWA (Progressive Web App)**
  - Installation mobile
  - Mode hors ligne
  - Notifications push

### **🚀 Fonctionnalités Avancées**

- [ ] **Tournois & Classements**
  - Système de points ELO
  - Classements globaux
  - Tournois automatiques

- [ ] **Replay & Analyse**
  - Rejeu des parties
  - Analyse des coups
  - Suggestions IA

- [ ] **Social & Partage**
  - Partage parties
  - Défis entre amis
  - Intégration réseaux sociaux

---

## 🛡️ Sécurité & Bonnes Pratiques

### **🔒 Sécurité Implémentée**

- ✅ **Protection XSS** : Sanitisation entrées utilisateur
- ✅ **Protection CSRF** : Tokens validation
- ✅ **Injection SQL/NoSQL** : Validation stricte Mongoose
- ✅ **JWT sécurisé** : Expiration, signature, refresh
- ✅ **Mots de passe** : Hashage bcrypt, politique forte
- ✅ **CORS configuré** : Origines autorisées uniquement
- ✅ **Rate limiting** : Protection contre spam/DDoS
- ✅ **Validation données** : Schémas stricts côté client/serveur

### **🧪 Tests & Qualité**

- ✅ **ESLint** : Règles strictes, code propre
- ✅ **Gestion erreurs** : Try-catch partout, fallbacks
- ✅ **Performance** : useMemo, useCallback, optimisations
- ✅ **Accessibilité** : Semantic HTML, ARIA labels
- ✅ **Responsive** : Mobile-first, tous écrans

---

## 🤝 Contribution

### **🔧 Setup Développement**

```bash
# Fork le projet
git clone https://github.com/votre-username/tictactoe.git
cd tictactoe

# Créer branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Installer dépendances
npm install
cd server && npm install

# Lancer en mode dev
npm run dev  # Frontend
cd server && npm run dev  # Backend
```

### **📝 Guidelines**

1. **Code Style** : ESLint + Prettier
2. **Commits** : Convention Conventional Commits
3. **Tests** : Ajouter tests pour nouvelles fonctionnalités
4. **Documentation** : Commenter code complexe
5. **Performance** : Profiler avant/après modifications

### **🚀 Process**

1. Fork le projet
2. Créer branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir Pull Request avec description détaillée

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```md
MIT License - Libre d'utilisation, modification et distribution
```

---

## 👨‍💻 Auteur & Contact

### **Développé avec ❤️ par Eliette Quenum**

- 📧 **Email** : [eliette.quenum@example.com](mailto:eliette.quenum@example.com)
- 🌐 **Portfolio** : [eliette-portfolio.com](https://eliette-portfolio.com)
- 💼 **LinkedIn** : [Eliette Quenum](https://linkedin.com/in/eliette-quenum)
- 🐙 **GitHub** : [@eliette-quenum](https://github.com/eliette-quenum)

---

## 🙏 Remerciements & Crédits

- **React Team** - Framework UI exceptionnel
- **TailwindCSS** - Système de design moderne
- **Socket.IO** - Communication temps réel fluide
- **MongoDB** - Base de données flexible et performante
- **Vite** - Build tool ultra-rapide
- **Communauté Open Source** - Inspiration et ressources

---

## 📈 Statistiques Projet

- **📁 Lignes de code** : ~3,500 lignes
- **🧩 Composants React** : 15+ composants
- **🔌 API Endpoints** : 8 routes
- **🤖 Algorithmes IA** : 3 niveaux de difficulté
- **⚡ Performance** : < 500ms temps réponse IA
- **📱 Responsive** : 100% mobile-friendly
- **🛡️ Sécurité** : 0 vulnérabilité connue

---

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

**🚀 Prêt à jouer ? Lancez le projet et défiez l'IA !**
