import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from './models/User.js';
import Game from './models/Game.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/games.js';
import path from "path";
import { fileURLToPath } from "url";

// Pour avoir __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://https://tictactoe-game-qvzg.onrender.com:5173", "http://https://tictactoe-game-qvzg.onrender.com:5179"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: ["http://https://tictactoe-game-qvzg.onrender.com:5173", "http://https://tictactoe-game-qvzg.onrender.com:5179"]
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tictactoe')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Socket.IO connection handling
const connectedUsers = new Map();
const activeGames = new Map();

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // User authentication
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      const user = await User.findById(decoded.id);
      
      if (user) {
        connectedUsers.set(socket.id, {
          userId: user._id,
          username: user.username,
          socketId: socket.id
        });
        
        await User.findByIdAndUpdate(user._id, { isOnline: true });
        socket.emit('authenticated', { user: { id: user._id, username: user.username } });
        
        // Send online users list
        const onlineUsers = Array.from(connectedUsers.values());
        io.emit('onlineUsers', onlineUsers);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      socket.emit('authError', 'Invalid token');
    }
  });

  // Create game room
  socket.on('createRoom', async (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const game = new Game({
      roomId,
      players: [{
        userId: user.userId,
        username: user.username,
        symbol: 'X',
        socketId: socket.id
      }],
      boardSize: data.boardSize || 3,
      board: Array(Math.pow(data.boardSize || 3, 2)).fill(null)
    });

    await game.save();
    activeGames.set(roomId, game);
    
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, game });
  });

  // Join game room
  socket.on('joinRoom', async (roomId) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    const game = await Game.findOne({ roomId, status: 'waiting' });
    if (!game || game.players.length >= 2) {
      socket.emit('joinError', 'Room not found or full');
      return;
    }

    game.players.push({
      userId: user.userId,
      username: user.username,
      symbol: 'O',
      socketId: socket.id
    });
    game.status = 'playing';
    await game.save();

    activeGames.set(roomId, game);
    socket.join(roomId);
    
    io.to(roomId).emit('gameStart', game);
  });

  // Make move
  socket.on('makeMove', async (data) => {
    const { roomId, position } = data;
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    const game = activeGames.get(roomId);
    if (!game || game.status !== 'playing') return;

    const player = game.players.find(p => p.socketId === socket.id);
    if (!player || player.symbol !== game.currentPlayer) return;

    if (game.board[position] !== null) return;

    // Update game state
    game.board[position] = player.symbol;
    game.moves.push({
      player: player.symbol,
      position,
      timestamp: new Date()
    });

    // Check for winner
    const winner = checkWinner(game.board, game.boardSize);
    if (winner) {
      game.winner = winner;
      game.status = 'finished';
      
      // Update user stats
      if (winner !== 'draw') {
        const winnerPlayer = game.players.find(p => p.symbol === winner);
        const loserPlayer = game.players.find(p => p.symbol !== winner);
        
        await User.findByIdAndUpdate(winnerPlayer.userId, { 
          $inc: { 'stats.wins': 1, 'stats.gamesPlayed': 1 }
        });
        await User.findByIdAndUpdate(loserPlayer.userId, { 
          $inc: { 'stats.losses': 1, 'stats.gamesPlayed': 1 }
        });
      } else {
        await User.updateMany(
          { _id: { $in: game.players.map(p => p.userId) } },
          { $inc: { 'stats.draws': 1, 'stats.gamesPlayed': 1 } }
        );
      }
    } else {
      game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    }

    await Game.findOneAndUpdate({ roomId }, game);
    activeGames.set(roomId, game);
    
    io.to(roomId).emit('gameUpdate', game);
  });

  // Chat message
  socket.on('chatMessage', async (data) => {
    const { roomId, message } = data;
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    const chatMsg = {
      username: user.username,
      message,
      timestamp: new Date()
    };

    await Game.findOneAndUpdate(
      { roomId },
      { $push: { chat: chatMsg } }
    );

    io.to(roomId).emit('newChatMessage', chatMsg);
  });

  // Disconnect
  socket.on('disconnect', async () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      await User.findByIdAndUpdate(user.userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      });
      connectedUsers.delete(socket.id);
      
      const onlineUsers = Array.from(connectedUsers.values());
      io.emit('onlineUsers', onlineUsers);
    }
    console.log('👤 User disconnected:', socket.id);
  });
});

// Winner calculation function
function checkWinner(board, boardSize) {
  const lines = [];
  
  // Rows
  for (let row = 0; row < boardSize; row++) {
    const line = [];
    for (let col = 0; col < boardSize; col++) {
      line.push(row * boardSize + col);
    }
    lines.push(line);
  }
  
  // Columns
  for (let col = 0; col < boardSize; col++) {
    const line = [];
    for (let row = 0; row < boardSize; row++) {
      line.push(row * boardSize + col);
    }
    lines.push(line);
  }
  
  // Diagonals
  const mainDiagonal = [];
  const antiDiagonal = [];
  for (let i = 0; i < boardSize; i++) {
    mainDiagonal.push(i * boardSize + i);
    antiDiagonal.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push(mainDiagonal, antiDiagonal);
  
  // Check lines
  for (const line of lines) {
    const firstSquare = board[line[0]];
    if (firstSquare && line.every(index => board[index] === firstSquare)) {
      return firstSquare;
    }
  }
  
  // Check for draw
  if (!board.includes(null)) {
    return 'draw';
  }
  
  return null;
}

// Servir React en production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});