import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import "./Pages.css"

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="page-container home-page">
        <div className="hero">
          <h1>Welcome to SignPlay</h1>
          <p>Learn sign language for numbers and improve your hand gesture dexterity</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Play Games</h3>
            <p>Learn while having fun with interactive math quizzes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>See your improvement over time with detailed analytics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✋</div>
            <h3>Learn Gestures</h3>
            <p>Master all 10 sign language number gestures</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
