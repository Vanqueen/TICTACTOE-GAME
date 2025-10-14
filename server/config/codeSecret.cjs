const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Générer un code secret
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Chemin vers le fichier .env
const envPath = path.join(__dirname, '../.env.production');

// Lire le contenu actuel du fichier .env
let envConfig = fs.readFileSync(envPath, 'utf8');

// Générer un nouveau JWT_SECRET
const newJWTSecret = generateJWTSecret();
const newSessionSecret = generateJWTSecret();
const newAuthSecret = generateJWTSecret();

// Ajouter ou mettre à jour le JWT_SECRET dans le fichier .env
if (envConfig.includes('JWT_SECRET=')) {
  envConfig = envConfig.replace(/JWT_SECRET=.*/, `JWT_SECRET=${newJWTSecret}`);
} else {
  envConfig += `\nJWT_SECRET=${newJWTSecret}\n`;
}

// Ajouter ou mettre à jour le SESSION_SECRET dans le fichier .env
if (envConfig.includes('SESSION_SECRET=')) {
  envConfig = envConfig.replace(/SESSION_SECRET=.*/, `SESSION_SECRET=${newSessionSecret}`);
} else {
  envConfig += `\nSESSION_SECRET=${newSessionSecret}\n`;
}

// Ajouter ou mettre à jour le SESSION_SECRET dans le fichier .env
if (envConfig.includes('AUTH_SECRET=')) {
  envConfig = envConfig.replace(/AUTH_SECRET=.*/, `AUTH_SECRET=${newAuthSecret}`);
} else {
  envConfig += `\nAUTH_SECRET=${newAuthSecret}\n`;
}

// Écrire le nouveau contenu dans le fichier .env
fs.writeFileSync(envPath, envConfig);

console.log('Nouveau JWT_SECRET et SESSION_SECRET générés et ajoutés au fichier .env');