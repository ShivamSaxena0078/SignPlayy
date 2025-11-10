# SignPlay - MERN Stack - Learn Sign Language

A full-stack web application designed for UK deaf and mute children to improve hand gesture dexterity and learn sign-based number recognition through interactive math games.

## Features

- **User Authentication**: Signup and login with JWT tokens
- **Gesture Guide**: Learn sign language for numbers 0-9 with webcam
- **Math Quiz Game**: Play interactive math games using hand gestures
- **Progress Tracking**: View analytics and performance metrics
- **Webcam Integration**: Real-time gesture detection using Flask CNN model
- **Dashboard**: Track accuracy, dexterity improvement, and game history
- **Beautiful UI**: Minimal, clean design with responsive layout

## Tech Stack

- **Frontend**: React 18, Context API, Axios, react-webcam
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **AI Model**: Flask + CNN (Gesture Recognition)
- **Styling**: CSS3 with modern design (Pink #ff6b9d, Teal #5c9ead)

## Project Structure

\`\`\`
signplay/
├── src/                       # Frontend (React)
│   ├── pages/
│   │   ├── Home.js           # Home page
│   │   ├── Login.js          # Login page
│   │   ├── Signup.js         # Signup page
│   │   ├── Dashboard.js      # Dashboard with stats
│   │   ├── GestureGuide.js   # Gesture learning page
│   │   ├── Game.js           # Math quiz game
│   │   └── Pages.css         # All page styles
│   ├── components/
│   │   ├── Navbar.js         # Navigation bar
│   │   ├── Navbar.css        # Navbar styles
│   │   └── PrivateRoute.js   # Protected routes
│   ├── context/
│   │   └── AuthContext.js    # Authentication context
│   ├── utils/
│   │   └── api.js            # Axios instance
│   ├── App.js                # Main app component
│   ├── index.js              # React entry point
│   └── index.css             # Global styles
│
├── server/                    # Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── GameHistory.js    # Game history schema
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   └── gameRoutes.js     # Game routes
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── server.js             # Main server file
│   ├── .env.example          # Environment variables
│   └── package.json
│
├── flask_app.py              # Flask API for gesture recognition
├── flask_requirements.txt     # Python dependencies
├── package.json              # Root dependencies
├── public/
│   └── index.html            # HTML entry point
└── README.md                 # This file
\`\`\`

## Quick Start

### Prerequisites

- Node.js (v16+)
- Python 3.8+
- MongoDB (local or Atlas)

### Installation

1. Clone and install dependencies:
\`\`\`bash
npm install
pip install -r flask_requirements.txt
\`\`\`

2. Create environment files:

**server/.env:**
\`\`\`
MONGODB_URI=mongodb://localhost:27017/signplay
JWT_SECRET=your-secret-key-2024
PORT=5000
\`\`\`

**.env.local:**
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FLASK_URL=http://localhost:5001
\`\`\`

3. Start services (in separate terminals):

**Terminal 1 - Backend:**
\`\`\`bash
cd server
npm start
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
npm run dev:client
\`\`\`

**Terminal 3 - Flask:**
\`\`\`bash
python flask_app.py
\`\`\`

Visit `http://localhost:3000`

## How to Use

### For Students:

1. **Sign Up**: Create an account with name, email, and password
2. **Learn Gestures**: Go to "Learn Gestures" to practice sign language for numbers 0-9
3. **Play Games**: Click "Play Game" to answer math questions using hand gestures
4. **Track Progress**: View dashboard to see accuracy trends

### For Developers:

**API Endpoints:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/game/save-result` - Save game result
- `GET /api/game/stats` - Get user statistics
- `GET /api/game/history` - Get game history
- `POST /predict` (Flask) - Predict gesture from image

**Database Models:**
- `User`: Stores credentials, stats, and performance
- `GameHistory`: Stores individual game attempts

## Game Features

- Supports 4 operations: Addition (+), Subtraction (−), Multiplication (×), Division (÷)
- Answers recognized via hand gestures (0-9)
- Accuracy calculated from gesture recognition
- Dexterity score tracks gesture quality
- Real-time feedback on performance

## Integrating Your CNN Model

Replace the `GestureRecognitionModel` class in `flask_app.py`:

\`\`\`python
import tensorflow as tf

class GestureRecognitionModel:
    def __init__(self):
        self.model = tf.keras.models.load_model('your_model.h5')
    
    def predict(self, image_array):
        prediction = self.model.predict(np.expand_dims(image_array, axis=0))
        return int(np.argmax(prediction))
\`\`\`

## Performance Metrics

- **Accuracy**: Percentage of correct gesture predictions
- **Dexterity Score**: Confidence score from gesture detection
- **Speed**: Time taken for gesture recognition

## Troubleshooting

### MongoDB Connection Error
\`\`\`bash
# Ensure MongoDB is running
mongod

# Or use MongoDB Atlas - update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/signplay
\`\`\`

### Port Already in Use
\`\`\`bash
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>
\`\`\`

### CORS Errors
Check that backend CORS is configured for `localhost:3000` in `server/server.js`

### Flask Not Connecting
- Verify Flask running: `http://localhost:5001/health`
- Check `REACT_APP_FLASK_URL` in `.env.local`
- Ensure base64 image encoding works

## Deployment

**Backend to Heroku:**
\`\`\`bash
git push heroku main
\`\`\`

**Frontend to Vercel/Netlify:**
\`\`\`bash
npm run build
\`\`\`

**Flask to Heroku/Railway:**
\`\`\`bash
gunicorn flask_app:app
\`\`\`

## Documentation

- `SETUP_GUIDE.md` - Complete setup instructions
- `API_DOCUMENTATION.md` - Detailed API endpoints
- `flask_requirements.txt` - Python dependencies

## Future Enhancements

- Multiplayer mode
- Difficulty levels
- Leaderboards
- Sound/vibration feedback
- Advanced gesture sequences
- Mobile app (React Native)

## Support

For issues or questions, check `SETUP_GUIDE.md` or create a GitHub issue.

---

**SignPlay** - Making sign language learning fun, interactive, and accessible for UK deaf and mute children!
