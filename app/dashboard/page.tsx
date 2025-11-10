"use client"

import { useAuth } from "@/components/context/AuthContext"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface GameStats {
  user: {
    totalGamesPlayed: number
    averageAccuracy: number
    dexterityScore: number
    name: string
  }
  recentGames: Array<{
    _id: string
    question: string
    correctAnswer: number
    predictedAnswer: number
    accuracy: number
    isCorrect: boolean
    timestamp: string
  }>
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<GameStats | null>(null)
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      if (!token) return

      try {
        const response = await fetch(`${API_URL}/game/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchStats()
    }
  }, [user, token, authLoading, router])

  if (authLoading || loading) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading...</p>
        </div>
      </main>
    )
  }

  const chartData =
    stats?.recentGames.map((game, idx) => ({
      name: `Game ${idx + 1}`,
      accuracy: game.accuracy,
      correct: game.isCorrect ? 100 : 0,
    })) || []

  return (
    <main className="bg-background min-h-screen pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#ff6b9d] mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-[#ff6b9d] to-[#ffb3d9]">
            <p className="text-white text-sm font-semibold">Total Games</p>
            <p className="text-4xl font-bold text-white mt-2">{stats?.user.totalGamesPlayed || 0}</p>
          </div>
          <div className="card bg-gradient-to-br from-[#5c9ead] to-[#7bb0c2]">
            <p className="text-white text-sm font-semibold">Average Accuracy</p>
            <p className="text-4xl font-bold text-white mt-2">{stats?.user.averageAccuracy || 0}%</p>
          </div>
          <div className="card bg-gradient-to-br from-[#ffd93d] to-[#ffe066]">
            <p className="text-white text-sm font-semibold">Dexterity Score</p>
            <p className="text-4xl font-bold text-white mt-2">{stats?.user.dexterityScore || 0}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card bg-white">
            <h3 className="font-bold text-lg mb-4">Accuracy Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#ff6b9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card bg-white">
            <h3 className="font-bold text-lg mb-4">Correct Answers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="correct" fill="#6bcf7f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Games */}
        <div className="card bg-white mb-8">
          <h3 className="font-bold text-lg mb-4">Recent Games</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#e0e0e0]">
                  <th className="text-left py-2">Question</th>
                  <th className="text-left py-2">Your Answer</th>
                  <th className="text-left py-2">Correct</th>
                  <th className="text-left py-2">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentGames.map((game, idx) => (
                  <tr key={idx} className="border-b border-[#e0e0e0] hover:bg-[#f9f9f9]">
                    <td className="py-3">{game.question}</td>
                    <td className="py-3">{game.predictedAnswer}</td>
                    <td className="py-3">
                      <span className={`font-bold ${game.isCorrect ? "text-[#6bcf7f]" : "text-[#ff6b6b]"}`}>
                        {game.isCorrect ? "✓" : "✗"}
                      </span>
                    </td>
                    <td className="py-3">{game.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Link href="/gesture-guide" className="btn-secondary bg-[#5c9ead] hover:bg-[#4a8099]">
            📚 View Gesture Guide
          </Link>
          <Link href="/game" className="btn-primary bg-[#ff6b9d] hover:bg-[#ff5588]">
            🎮 Play Game
          </Link>
        </div>
      </div>
    </main>
  )
}
