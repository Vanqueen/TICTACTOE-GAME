# 🎮 Tic Tac Toe - React + Node.js + Socket.IO

Un jeu de **Tic Tac Toe** moderne avec mode solo et multijoueur en temps réel, développé avec **React**, **Node.js**, **Socket.IO** et **MongoDB**.

---

## 🚀 Fonctionnalités

### 🎯 **Mode Solo (Complet)**

- ✅ **Plateaux variables** : 3x3, 4x4, 5x5, 6x6, 7x7
- ✅ **Chronometers intelligents** : 60s par joueur avec alerte temps faible
- ✅ **Détection automatique** : Gagnant, match nul, cases gagnantes
- ✅ **Historique des coups** : Navigation précédent/suivant avec positions
- ✅ **Score persistant** : Sauvegarde automatique localStorage
- ✅ **Interface glassmorphism** : Design moderne et responsive

### 🔐 **Authentification (Complet)**

- ✅ **Inscription/Connexion** : Formulaires sécurisés avec validation
- ✅ **JWT Tokens** : Authentification stateless sécurisée
- ✅ **Gestion d'erreurs** : Feedback utilisateur en temps réel
- ✅ **Protection** : XSS, CSRF, injection de code

### 🌐 **Mode Multijoueur (Backend Prêt)**

- ✅ **Serveur Socket.IO** : Communication temps réel
- ✅ **Salles de jeu** : Création/rejoindre parties privées
- ✅ **Chat en temps réel** : Messages entre joueurs
- ✅ **Statistiques** : Victoires/défaites/matchs nuls persistantes
- ⚠️ **Interface client** : En cours de finalisation

### 📊 **Fonctionnalités Avancées**

- ✅ **Base de données MongoDB** : Persistance complète
- ✅ **Optimisations React** : useMemo, useCallback, performance
- ✅ **Sécurité renforcée** : Toutes vulnérabilités corrigées
- ✅ **Gestion d'erreurs robuste** : Try-catch partout

---

## 📂 Structure du Projet

```uml
tictactoe/
├── src/                          # Frontend React
│   ├── components/               # Composants réutilisables
│   │   ├── Auth/                # Authentification
│   │   ├── Multiplayer/         # Mode multijoueur
│   │   ├── Game.jsx             # Logique principale
│   │   ├── Board.jsx            # Plateau de jeu
│   │   ├── Square.jsx           # Case individuelle
│   │   ├── Chronometer.jsx      # Timer joueur
│   │   └── GameHistory.jsx      # Historique parties
│   ├── contexts/                # État global
│   │   ├── AuthContext.jsx      # Authentification
│   │   └── SocketContext.jsx    # Socket.IO
│   ├── hooks/                   # Hooks personnalisés
│   ├── pages/                   # Pages navigation
│   └── main.jsx                 # Point d'entrée
├── server/                      # Backend Node.js
│   ├── models/                  # Modèles MongoDB
│   │   ├── User.js              # Utilisateurs
│   │   └── Game.js              # Parties
│   ├── routes/                  # API REST
│   │   ├── auth.js              # Authentification
│   │   └── games.js             # Gestion parties
│   └── server.js                # Serveur Socket.IO
└── package.json                 # Dépendances
```

---

## ⚡ Installation & Utilisation

### 1. **Cloner le projet**

```bash
git clone <repository-url>
cd tictactoe
```

### 2. **Frontend (React)**

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

➡️ Ouvre [http://localhost:5173](http://localhost:5173)

### 3. **Backend (Node.js)**

```bash
# Aller dans le dossier serveur
cd server

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Lancer le serveur
npm start
```

➡️ Serveur sur [http://localhost:5000](http://localhost:5000)

### 4. **Base de données**

```bash
# MongoDB requis
# Configurer MONGODB_URI dans server/.env
MONGODB_URI=mongodb://localhost:27017/tictactoe
JWT_SECRET=your-secret-key
```

---

## 🎨 Technologies Utilisées

### **Frontend**

- [React 19](https://reactjs.org/) ⚛️ - Framework UI
- [TailwindCSS 4](https://tailwindcss.com/) 🎨 - Styling moderne
- [Vite](https://vitejs.dev/) ⚡ - Build tool rapide
- [React Router](https://reactrouter.com/) 🛣️ - Navigation SPA

### **Backend**

- [Node.js](https://nodejs.org/) 🟢 - Runtime JavaScript
- [Express.js](https://expressjs.com/) 🚀 - Framework web
- [Socket.IO](https://socket.io/) 🔌 - WebSocket temps réel
- [MongoDB](https://mongodb.com/) 🍃 - Base de données NoSQL
- [JWT](https://jwt.io/) 🔐 - Authentification

---

## 🎮 Guide d'Utilisation

### **Mode Solo**

1. **Configuration** : Choisir taille plateau (3x3 à 7x7) et premier joueur
2. **Jeu** : Cliquer sur les cases, chronometers automatiques
3. **Navigation** : Boutons Précédent/Suivant dans l'historique
4. **Score** : Sauvegarde automatique des victoires

### **Mode Multijoueur**

1. **Connexion** : S'inscrire ou se connecter
2. **Lobby** : Voir joueurs en ligne
3. **Partie** : Créer ou rejoindre une salle
4. **Chat** : Communiquer en temps réel

---

## 🔧 Configuration Avancée

### **Variables d'environnement**

```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/tictactoe
JWT_SECRET=your-super-secret-key
PORT=5000

# Frontend (.env)
VITE_API_URL=http://localhost:5000
```

### **Scripts disponibles**

```bash
# Frontend
npm run dev          # Développement
npm run build        # Production
npm run preview      # Aperçu build

# Backend
npm start            # Production
npm run dev          # Développement avec nodemon
```

---

## 📊 État du Projet

| Composant | État | Détails |
|-----------|------|---------|
| **Jeu Solo** | ✅ 100% | Toutes fonctionnalités implémentées |
| **Authentification** | ✅ 100% | JWT, validation, sécurité |
| **Backend Multijoueur** | ✅ 100% | Socket.IO, MongoDB, API |
| **Frontend Multijoueur** | ⚠️ 80% | Interface à finaliser |
| **Sécurité** | ✅ 100% | Toutes vulnérabilités corrigées |
| **Performance** | ✅ 100% | Optimisations React appliquées |

---

## 🚧 Prochaines Étapes

### **À finaliser**

- [ ] Interface multijoueur complète
- [ ] Intégration Socket.IO côté client
- [ ] Tests automatisés
- [ ] Mode IA (solo contre ordinateur)
- [ ] Thèmes personnalisables

### **Améliorations possibles**

- [ ] PWA (Progressive Web App)
- [ ] Notifications push
- [ ] Classements globaux
- [ ] Replay des parties
- [ ] Mode tournoi

---

## 🛡️ Sécurité

Le projet implémente les meilleures pratiques de sécurité :

- ✅ **Protection XSS** : Sanitisation des entrées utilisateur
- ✅ **Protection CSRF** : Tokens de validation
- ✅ **Injection de code** : Validation stricte
- ✅ **localStorage sécurisé** : Gestion d'erreurs robuste
- ✅ **JWT sécurisé** : Expiration et validation

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👨‍💻 Auteur

**Développé avec ❤️ par [Votre Nom]**

- 📧 Email : [votre.email@example.com](mailto:votre.email@example.com)
- 🌐 Portfolio : [votre-site.com](https://votre-site.com)
- 💼 LinkedIn : [Votre Profil](https://linkedin.com/in/votre-profil)

---

## 🙏 Remerciements

- React Team pour l'excellent framework
- TailwindCSS pour le système de design
- Socket.IO pour la communication temps réel
- MongoDB pour la base de données flexible

---

**⭐ N'hésitez pas à donner une étoile si ce projet vous plaît !**
