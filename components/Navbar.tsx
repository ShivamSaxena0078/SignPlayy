"use client"

import Link from "next/link"
import { useAuth } from "./context/AuthContext"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="bg-gradient-to-r from-[#ff6b9d] to-[#5c9ead] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/" className="font-bold text-2xl hover:opacity-80 transition-opacity">
          ✋ SignPlay
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.name}!</span>
              <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-[#ff6b9d] px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:opacity-80 transition-opacity">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-[#ff6b9d] px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
