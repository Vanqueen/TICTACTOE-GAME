import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  players: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    symbol: { type: String, enum: ['X', 'O'] },
    socketId: String
  }],
  board: {
    type: [String],
    default: () => Array(9).fill(null)
  },
  boardSize: {
    type: Number,
    default: 3
  },
  currentPlayer: {
    type: String,
    enum: ['X', 'O'],
    default: 'X'
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  winner: {
    type: String,
    enum: ['X', 'O', 'draw', null],
    default: null
  },
  moves: [{
    player: String,
    position: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  chat: [{
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  timeLimit: {
    type: Number,
    default: 60
  },
  playerTimes: {
    X: { type: Number, default: 60 },
    O: { type: Number, default: 60 }
  }
}, {
  timestamps: true
});

export default mongoose.model('Game', gameSchema);