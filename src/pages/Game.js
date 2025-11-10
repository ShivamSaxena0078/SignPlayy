"use client"

import { useState, useRef } from "react"
import Webcam from "react-webcam"
import axios from "axios"
import Navbar from "../components/Navbar"
import "./Pages.css"

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
const FLASK_API = process.env.REACT_APP_FLASK_URL || "http://localhost:5001"

const OPERATIONS = [
  { symbol: "+", name: "Add" },
  { symbol: "-", name: "Subtract" },
  { symbol: "×", name: "Multiply" },
  { symbol: "÷", name: "Divide" },
]

const Game = () => {
  const webcamRef = useRef(null)
  const [gameState, setGameState] = useState("start") // start, playing, answered
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operation, setOperation] = useState("+")
  const [userAnswer, setUserAnswer] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState(0)

  const startGame = () => {
    generateQuestion()
    setGameState("playing")
    setScore(0)
  }

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    const op = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)].symbol

    setNum1(num1)
    setNum2(num2)
    setOperation(op)
    setUserAnswer(null)
    setFeedback("")

    let answer
    if (op === "+") answer = num1 + num2
    else if (op === "-") answer = num1 - num2
    else if (op === "×") answer = num1 * num2
    else answer = Math.floor(num1 / num2) || 0

    setCorrectAnswer(answer)
  }

  const captureAndPredict = async () => {
    if (!webcamRef.current) return

    setLoading(true)
    try {
      const imageSrc = webcamRef.current.getScreenshot()

      // Send to Flask for gesture recognition
      const response = await axios.post(
        `${FLASK_API}/predict`,
        { image: imageSrc },
        { headers: { "Content-Type": "application/json" } },
      )

      const predictedDigit = response.data.prediction
      setUserAnswer(predictedDigit)

      // Calculate accuracy and save result
      const isCorrect = predictedDigit === correctAnswer
      const accuracy = isCorrect ? 100 : Math.max(0, 100 - Math.abs(predictedDigit - correctAnswer) * 10)

      if (isCorrect) {
        setFeedback("Correct! 🎉")
        setScore(score + 1)
      } else {
        setFeedback(`Incorrect! Expected ${correctAnswer}, got ${predictedDigit}`)
      }

      // Save to database
      await axios.post(`${API_BASE}/game/save-result`, {
        question: `${num1} ${operation} ${num2}`,
        correctAnswer,
        predictedAnswer: predictedDigit,
        accuracy,
        speed: 0,
        dexterityScore: accuracy,
      })

      setGameState("answered")
    } catch (error) {
      console.error("Prediction error:", error)
      setFeedback("Failed to capture gesture. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    generateQuestion()
    setGameState("playing")
  }

  if (gameState === "start") {
    return (
      <>
        <Navbar />
        <div className="page-container game-page">
          <div className="game-start">
            <h1>Math Quiz Game</h1>
            <p>Answer math questions using sign language gestures!</p>
            <button onClick={startGame} className="btn btn-primary btn-large">
              Start Game
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="page-container game-page">
        <div className="game-header">
          <h2>Score: {score}</h2>
        </div>

        <div className="game-container">
          <div className="question">
            <span className="number">{num1}</span>
            <span className="operation">{operation}</span>
            <span className="number">{num2}</span>
            <span className="equals">=</span>
            <span className="question-mark">?</span>
          </div>

          <div className="webcam-section">
            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" width={400} height={300} />
            <p className="instruction">Show your answer with your hand!</p>
            <button
              onClick={captureAndPredict}
              disabled={loading || gameState === "answered"}
              className="btn btn-primary btn-large"
            >
              {loading ? "Recognizing..." : "Capture & Predict"}
            </button>
          </div>

          {feedback && (
            <div className={`feedback ${feedback.includes("Correct") ? "success" : "error"}`}>
              <p>{feedback}</p>
              {userAnswer !== null && <p>You showed: {userAnswer}</p>}
            </div>
          )}

          {gameState === "answered" && (
            <button onClick={nextQuestion} className="btn btn-secondary btn-large">
              Next Question
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Game
