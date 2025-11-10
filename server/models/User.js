const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  totalGamesPlayed: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 },
  dexterityScore: { type: Number, default: 0 },
})

module.exports = mongoose.model("User", userSchema)
