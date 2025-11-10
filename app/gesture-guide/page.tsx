"use client"

import Navbar from "@/components/Navbar"
import { useRef, useState } from "react"
import Webcam from "react-webcam"

const GESTURES = [
  { number: 0, description: "Palm open, fingers spread" },
  { number: 1, description: "Index finger pointing up" },
  { number: 2, description: "Index and middle finger up" },
  { number: 3, description: "Three fingers up" },
  { number: 4, description: "Four fingers up" },
  { number: 5, description: "All five fingers spread" },
  { number: 6, description: "Thumb and pinky extended" },
  { number: 7, description: "Seven hand shape" },
  { number: 8, description: "Eight hand shape" },
  { number: 9, description: "Nine hand shape" },
]

export default function GestureGuidePage() {
  const [selectedNumber, setSelectedNumber] = useState(0)
  const [showWebcam, setShowWebcam] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  return (
    <main className="bg-background min-h-screen pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#ff6b9d] mb-2">Learn Sign Language Gestures</h1>
        <p className="text-gray-600 mb-8">Click on a number to see the gesture description</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {GESTURES.map((gesture) => (
            <button
              key={gesture.number}
              onClick={() => setSelectedNumber(gesture.number)}
              className={`gesture-number-card transition-all ${
                selectedNumber === gesture.number ? "ring-4 ring-[#ffd93d]" : ""
              }`}
            >
              {gesture.number}
            </button>
          ))}
        </div>

        <div className="card bg-white mb-8">
          <h2 className="text-3xl font-bold text-[#ff6b9d] mb-4">Number {selectedNumber}</h2>
          <p className="text-lg text-gray-700 mb-6">{GESTURES[selectedNumber].description}</p>

          {showWebcam ? (
            <div className="bg-black rounded-lg overflow-hidden">
              <Webcam ref={webcamRef} mirrored={true} className="w-full" />
            </div>
          ) : (
            <div className="bg-gray-300 rounded-lg h-80 flex items-center justify-center">
              <p className="text-gray-600">Webcam preview will appear here</p>
            </div>
          )}

          <button
            onClick={() => setShowWebcam(!showWebcam)}
            className="btn-primary bg-[#ff6b9d] hover:bg-[#ff5588] mt-4"
          >
            {showWebcam ? "🎥 Stop Webcam" : "🎥 Start Webcam Practice"}
          </button>
        </div>

        <div className="card bg-white">
          <h3 className="font-bold text-lg mb-4">How to Practice</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Select a number from the cards above</li>
            <li>Read the gesture description</li>
            <li>Click "Start Webcam" to see yourself</li>
            <li>Practice making the gesture shown</li>
            <li>Repeat until you feel comfortable</li>
            <li>Try the next number when you're ready!</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
