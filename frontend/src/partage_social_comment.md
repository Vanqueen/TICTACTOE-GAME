# Fonctionnalité Social

---

## 1️⃣ Partage de score / résultat

### Objectif

Permettre à un joueur de partager le résultat de sa partie sur les réseaux sociaux ou via un lien.

Exemple simple avec un **bouton de partage sur Twitter** :

```jsx
function ShareButton({ winner, score, gameNumber }) {
  const shareText = `Je viens de jouer à Tic Tac Toe ! Partie #${gameNumber} : ${winner} a gagné, score X:${score.X} - O:${score.O}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <a
      href={twitterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Partager sur Twitter
    </a>
  );
}
```

Tu peux intégrer ce bouton dans la **carte d’historique de chaque partie**.

---

## 2️⃣ Classement global / leaderboard

### Objectif Classement

Si tu sauvegardes les parties en ligne (ou même localement), tu peux créer un **classement des meilleurs joueurs**.

Exemple de structure pour un leaderboard local :

```js
const leaderboard = [
  { player: 'Alice', wins: 5 },
  { player: 'Bob', wins: 3 },
  { player: 'Charlie', wins: 2 },
];
```

Et affichage :

```jsx
<div className="leaderboard p-3 border rounded shadow mt-5">
  <h2 className="text-xl font-bold mb-2">Classement des meilleurs joueurs</h2>
  <ul className="list-decimal pl-5">
    {leaderboard.map((p, idx) => (
      <li key={idx}>
        {p.player} - {p.wins} victoires
      </li>
    ))}
  </ul>
</div>
```

---

## 3️⃣ Enregistrement en ligne (option avancée)

### Objectif Commentaire

* Sauvegarder **parties et scores sur un serveur** pour les partager avec d’autres joueurs
* Permettre **connexion / pseudo**
* Afficher **classement mondial**

**Technologies possibles :**

* Backend léger avec Node.js + Express
* Base de données : MongoDB ou Firebase
* Authentification via pseudo ou Google/Discord

---

## 4️⃣ Commentaires / réactions (optionnel)

### Idée

* Les joueurs peuvent **laisser des commentaires** ou des **émojis** pour chaque partie partagée
* Intéressant si tu passes à un mode **partage en ligne**

---

Si tu veux, je peux te **proposer un exemple complet** intégrant :

* Historique des parties
* Score cumulatif
* Partage social (Twitter)
* Leaderboard local

Veux‑tu que je fasse ça ?
