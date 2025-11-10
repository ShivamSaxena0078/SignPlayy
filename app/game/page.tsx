"use client"

import { useAuth } from "@/components/context/AuthContext"
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"

interface GameQuestion {
  num1: number
  num2: number
  operator: string
  correctAnswer: number
}

const generateQuestion = (): GameQuestion => {
  const operators = ["+", "-", "*", "/"]
  const operator = operators[Math.floor(Math.random() * operators.length)]
  const num1 = Math.floor(Math.random() * 10)
  let num2 = Math.floor(Math.random() * 10)

  if (operator === "/" && num2 === 0) num2 = 1

  let correctAnswer = 0
  if (operator === "+") correctAnswer = num1 + num2
  else if (operator === "-") correctAnswer = num1 - num2
  else if (operator === "*") correctAnswer = num1 * num2
  else if (operator === "/") correctAnswer = Math.floor(num1 / num2)

  return { num1, num2, operator, correctAnswer }
}

export default function GamePage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [question, setQuestion] = useState<GameQuestion | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentDigit, setCurrentDigit] = useState(0)
  const [predictedAnswer, setPredictedAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [gameStats, setGameStats] = useState({
    correct: 0,
    incorrect: 0,
    score: 0,
  })
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const [webcamActive, setWebcamActive] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const COLAB_API = process.env.NEXT_PUBLIC_COLAB_API || "http://localhost:5000/api"

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const startGame = () => {
    const newQuestion = generateQuestion()
    setQuestion(newQuestion)
    setGameStarted(true)
    setPredictedAnswer("")
    setCurrentDigit(0)
    setFeedback("")
    setWebcamActive(true)
  }

  const captureFrame = async () => {
    if (!webcamRef.current) return

    try {
      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) return

      // Send frame to Colab model
      const response = await fetch(`${COLAB_API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      })

      const data = await response.json()
      const predictedDigit = data.predicted_number

      setPredictedAnswer((prev) => prev + predictedDigit)
      setCurrentDigit((prev) => prev + 1)
      setFeedback(`Detected digit: ${predictedDigit}`)
    } catch (err) {
      console.error("Prediction error:", err)
      setFeedback("Error detecting gesture. Try again.")
    }
  }

  const checkAnswer = async () => {
    if (!question) return

    const isCorrect = Number.parseInt(predictedAnswer) === question.correctAnswer
    setFeedback(
      isCorrect
        ? `✓ Correct! The answer is ${question.correctAnswer}`
        : `✗ Incorrect. Your answer: ${predictedAnswer}, Correct: ${question.correctAnswer}`,
    )

    setGameStats((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      score: isCorrect ? prev.score + 10 : prev.score,
    }))

    // Save result to backend
    if (token) {
      try {
        await fetch(`${API_URL}/game/save-result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: `${question.num1} ${question.operator} ${question.num2}`,
            correctAnswer: question.correctAnswer,
            predictedAnswer: Number.parseInt(predictedAnswer),
            accuracy: isCorrect ? 100 : 0,
            speed: 0,
            dexterityScore: 85,
          }),
        })
      } catch (err) {
        console.error("Failed to save result:", err)
      }
    }

    setWebcamActive(false)
  }

  const nextQuestion = () => {
    const newQuestion = generateQuestion()
    setQuestion(newQuestion)
    setPredictedAnswer("")
    setCurrentDigit(0)
    setFeedback("")
    setWebcamActive(true)
  }

  if (authLoading) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#ff6b9d] mb-8">Math Quiz Game</h1>

        {!gameStarted ? (
          <div className="card bg-white text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-gray-600 mb-8">Solve math problems by showing hand gestures to your camera!</p>
            <button onClick={startGame} className="btn-primary bg-[#ff6b9d] hover:bg-[#ff5588]">
              🎮 Start Game
            </button>
          </div>
        ) : (
          <>
            {/* Question Display */}
            <div className="card bg-gradient-to-r from-[#ff6b9d] to-[#5c9ead] text-white mb-8">
              <p className="text-xl font-semibold mb-2">Question</p>
              <p className="text-5xl font-bold">
                {question?.num1} {question?.operator} {question?.num2}
              </p>
            </div>

            {/* Webcam */}
            <div className="card bg-black rounded-lg overflow-hidden mb-8">
              {webcamActive && <Webcam ref={webcamRef} mirrored={true} className="w-full" />}
              {!webcamActive && (
                <div className="w-full h-80 flex items-center justify-center bg-gray-800 text-white">
                  <p>Webcam will be ready for next question</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="card bg-white mb-8">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">Your Answer</label>
                  <input
                    type="text"
                    value={predictedAnswer}
                    readOnly
                    className="w-full px-4 py-3 text-2xl font-bold border-2 border-[#ff6b9d] rounded-lg bg-[#fff8f0]"
                    placeholder="Gestures detected here"
                  />
                </div>
              </div>

              {feedback && <p className="text-lg font-semibold mb-6 p-3 bg-[#f0f0f0] rounded-lg">{feedback}</p>}

              <div className="flex gap-4 flex-wrap">
                {predictedAnswer.length < String(question?.correctAnswer || 0).length && (
                  <button onClick={captureFrame} className="btn-secondary bg-[#5c9ead] hover:bg-[#4a8099]">
                    📸 Capture Gesture
                  </button>
                )}

                {predictedAnswer.length === String(question?.correctAnswer || 0).length && (
                  <button onClick={checkAnswer} className="btn-primary bg-[#ff6b9d] hover:bg-[#ff5588]">
                    ✓ Check Answer
                  </button>
                )}

                {feedback && (
                  <button onClick={nextQuestion} className="btn-secondary bg-[#5c9ead] hover:bg-[#4a8099]">
                    Next Question →
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card bg-gradient-to-br from-[#6bcf7f] to-[#5bb570]">
                <p className="text-white text-sm font-semibold">Correct</p>
                <p className="text-3xl font-bold text-white">{gameStats.correct}</p>
              </div>
              <div className="card bg-gradient-to-br from-[#ff6b6b] to-[#ff5555]">
                <p className="text-white text-sm font-semibold">Incorrect</p>
                <p className="text-3xl font-bold text-white">{gameStats.incorrect}</p>
              </div>
              <div className="card bg-gradient-to-br from-[#ffd93d] to-[#ffcc00]">
                <p className="text-white text-sm font-semibold">Score</p>
                <p className="text-3xl font-bold text-white">{gameStats.score}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
