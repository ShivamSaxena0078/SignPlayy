"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"
import "./Pages.css"

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/game/stats`)
      setStats(response.data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <>
        <Navbar />{" "}
        <div className="page-container">
          <p>Loading...</p>
        </div>
      </>
    )

  return (
    <>
      <Navbar />
      <div className="page-container dashboard-page">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.user?.totalGamesPlayed || 0}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.user?.averageAccuracy || 0}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.user?.dexterityScore || 0}</div>
            <div className="stat-label">Dexterity Score</div>
          </div>
        </div>

        <div className="recent-games">
          <h2>Recent Games</h2>
          {stats?.recentGames && stats.recentGames.length > 0 ? (
            <div className="games-list">
              {stats.recentGames.map((game, idx) => (
                <div key={idx} className="game-item">
                  <span>{game.question}</span>
                  <span className={game.isCorrect ? "correct" : "incorrect"}>
                    {game.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                  <span>{game.accuracy}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No games yet. Start playing!</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard
