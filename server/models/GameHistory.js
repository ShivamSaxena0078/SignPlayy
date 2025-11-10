const mongoose = require("mongoose")

const gameHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: String,
  correctAnswer: Number,
  predictedAnswer: Number,
  accuracy: Number,
  speed: Number,
  dexterityScore: Number,
  timestamp: { type: Date, default: Date.now },
  isCorrect: Boolean,
})

module.exports = mongoose.model("GameHistory", gameHistorySchema)
