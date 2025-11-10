"use client"

import React, { createContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  const signup = async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${API_BASE}/auth/signup`, {
        name,
        email,
        password,
      })
      setToken(response.data.token)
      setUser(response.data.user)
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Signup failed"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      })
      setToken(response.data.token)
      setUser(response.data.user)
      return response.data
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
