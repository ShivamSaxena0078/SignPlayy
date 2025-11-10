import axios from "axios"

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
const FLASK_API = process.env.REACT_APP_FLASK_URL || "http://localhost:5001"

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
})

export const flaskApi = axios.create({
  baseURL: FLASK_API,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
