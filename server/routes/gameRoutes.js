const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User")
const GameHistory = require("../models/GameHistory")

const router = express.Router()

router.post("/save-result", authMiddleware, async (req, res) => {
  try {
    const { question, correctAnswer, predictedAnswer, accuracy, speed, dexterityScore } = req.body

    const gameRecord = new GameHistory({
      userId: req.userId,
      question,
      correctAnswer,
      predictedAnswer,
      accuracy,
      speed,
      dexterityScore,
      isCorrect: correctAnswer === predictedAnswer,
    })

    await gameRecord.save()

    const user = await User.findById(req.userId)
    user.totalGamesPlayed += 1

    const allGames = await GameHistory.find({ userId: req.userId })
    const avgAccuracy = allGames.reduce((sum, g) => sum + g.accuracy, 0) / allGames.length
    user.averageAccuracy = Math.round(avgAccuracy)
    user.dexterityScore = Math.max(...allGames.map((g) => g.dexterityScore || 0))

    await user.save()

    res.json({ success: true, gameRecord })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const gameHistory = await GameHistory.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(5)

    res.json({
      user,
      recentGames: gameHistory,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const gameHistory = await GameHistory.find({ userId: req.userId }).sort({ timestamp: -1 })
    res.json(gameHistory)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
