import express from 'express';
import Game from '../models/Game.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

// Pour avoir __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Résoudre le chemin du fichier .env en fonction de l'environnement
const envFilePath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Charger les variables d'environnement à partir du fichier
const result = dotenv.config({
    path: path.resolve(__dirname, envFilePath)
});

if (result.error) {
    console.error('Erreur lors du chargement du fichier .env :', result.error);
    process.exit(1); // Quittez l'application en cas d'erreur de chargement du fichier .env
}

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get available rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await Game.find({ 
      status: 'waiting',
      'players.1': { $exists: false }
    }).select('roomId players boardSize createdAt');

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get game by room ID
router.get('/room/:roomId', auth, async (req, res) => {
  try {
    const game = await Game.findOne({ roomId: req.params.roomId });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's game history
router.get('/history', auth, async (req, res) => {
  try {
    const games = await Game.find({
      'players.userId': req.user.id,
      status: 'finished'
    }).sort({ createdAt: -1 }).limit(20);

    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;