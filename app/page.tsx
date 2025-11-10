import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <main className="bg-background">
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-[#ff6b9d] mb-4">Welcome to SignPlay</h1>
          <p className="text-xl text-[#1a1a1a] mb-8">
            Learn sign language for numbers (0-9) and improve your hand gesture dexterity through fun math games!
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login" className="btn-primary bg-[#ff6b9d] hover:bg-[#ff5588]">
              Login
            </Link>
            <Link href="/signup" className="btn-secondary bg-[#5c9ead] hover:bg-[#4a8099]">
              Sign Up
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-white">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="font-bold text-lg mb-2">Play Games</h3>
              <p className="text-sm text-gray-600">Learn while having fun with interactive math quizzes</p>
            </div>
            <div className="card bg-white">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">See your improvement over time with detailed analytics</p>
            </div>
            <div className="card bg-white">
              <div className="text-4xl mb-3">✋</div>
              <h3 className="font-bold text-lg mb-2">Learn Gestures</h3>
              <p className="text-sm text-gray-600">Master all 10 sign language number gestures</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
