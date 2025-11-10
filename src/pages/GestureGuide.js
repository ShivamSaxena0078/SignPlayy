"use client"

import { useState } from "react"
import Webcam from "react-webcam"
import Navbar from "../components/Navbar"
import "./Pages.css"

const GESTURES = {
  0: "Open hand with all fingers spread",
  1: "Index finger pointing up",
  2: "Index and middle fingers up",
  3: "Index, middle, and ring fingers up",
  4: "All fingers except thumb",
  5: "All five fingers spread",
  6: "Pinky and index finger up (rock gesture)",
  7: "Thumb and index up (like a gun)",
  8: "Hand in OK sign",
  9: "Clenched fist with thumb up",
}

const GestureGuide = () => {
  const [currentGesture, setCurrentGesture] = useState(0)
  const [showWebcam, setShowWebcam] = useState(false)

  const nextGesture = () => {
    setCurrentGesture((prev) => (prev + 1) % 10)
  }

  const prevGesture = () => {
    setCurrentGesture((prev) => (prev - 1 + 10) % 10)
  }

  return (
    <>
      <Navbar />
      <div className="page-container gesture-page">
        <h1>Learn Sign Language Gestures</h1>

        <div className="gesture-container">
          <div className="gesture-display">
            <div className="gesture-number">{currentGesture}</div>
            <p className="gesture-description">{GESTURES[currentGesture]}</p>
          </div>

          {showWebcam && (
            <div className="webcam-container">
              <Webcam audio={false} screenshotFormat="image/jpeg" width={400} height={300} />
              <button onClick={() => setShowWebcam(false)} className="btn btn-secondary">
                Hide Webcam
              </button>
            </div>
          )}

          {!showWebcam && (
            <button onClick={() => setShowWebcam(true)} className="btn btn-primary">
              Show Webcam & Practice
            </button>
          )}
        </div>

        <div className="gesture-controls">
          <button onClick={prevGesture} className="btn btn-outline">
            ← Previous
          </button>
          <button onClick={nextGesture} className="btn btn-outline">
            Next →
          </button>
        </div>

        <div className="all-gestures">
          <h2>All Gestures (0-9)</h2>
          <div className="gestures-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`gesture-tile ${i === currentGesture ? "active" : ""}`}
                onClick={() => setCurrentGesture(i)}
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default GestureGuide
