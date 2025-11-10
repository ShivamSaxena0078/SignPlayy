# Complete Setup Guide for SignPlay

## Prerequisites

- Node.js (v16+)
- Python 3.8+
- MongoDB (local or Atlas)
- Git

## Step-by-Step Setup

### Step 1: Clone and Navigate

\`\`\`bash
git clone <repo-url>
cd signplay
\`\`\`

### Step 2: Install All Dependencies

\`\`\`bash
# Install root dependencies
npm install

# Install Flask dependencies
pip install -r flask_requirements.txt
\`\`\`

### Step 3: Create Environment Files

**Create `.env` in server directory:**
\`\`\`bash
cd server
touch .env
\`\`\`

Add to `server/.env`:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/signplay
JWT_SECRET=signplay-secret-key-2024
PORT=5000
\`\`\`

**Create `.env.local` in root:**
\`\`\`bash
cd ..
touch .env.local
\`\`\`

Add to `.env.local`:
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FLASK_URL=http://localhost:5001
\`\`\`

### Step 4: Start MongoDB

\`\`\`bash
# On Windows/Mac with Homebrew
brew services start mongodb-community

# Or manually start MongoDB server
mongod
\`\`\`

Verify MongoDB is running:
\`\`\`bash
mongosh
# Should connect to MongoDB shell
\`\`\`

### Step 5: Start Backend Server

\`\`\`bash
cd server
npm start
\`\`\`

Expected output:
\`\`\`
Server running on port 5000
MongoDB connected
\`\`\`

### Step 6: Start Frontend (New Terminal)

\`\`\`bash
npm run dev:client
\`\`\`

React app will open at `http://localhost:3000`

### Step 7: Start Flask (New Terminal)

\`\`\`bash
python flask_app.py
\`\`\`

Expected output:
\`\`\`
Running on http://127.0.0.1:5001
\`\`\`

## Testing the Application

### Test Backend
\`\`\`bash
curl http://localhost:5000/api/health
# Should return: {"status":"Backend running"}
\`\`\`

### Test Frontend
Open `http://localhost:3000` in browser

### Test Flask
\`\`\`bash
curl http://localhost:5001/health
# Should return: {"status":"Flask server running"}
\`\`\`

### Test Signup/Login
1. Go to http://localhost:3000/signup
2. Create account with email and password
3. Redirect to dashboard should happen
4. Check MongoDB to verify user was saved

### Test Game
1. Go to Dashboard → Learn Gestures
2. Show webcam and practice gestures
3. Go to Play Game
4. Answer a math question with a gesture
5. Flask should predict the gesture
6. Result saved to MongoDB

## Integrating Your Colab Model

### Option 1: Download Model Locally

1. Train your model in Colab
2. Download the `.h5` or `.pkl` file
3. Update `flask_app.py`:

\`\`\`python
import tensorflow as tf

class GestureRecognitionModel:
    def __init__(self):
        self.model = tf.keras.models.load_model('path/to/your/model.h5')
    
    def predict(self, image_array):
        prediction = self.model.predict(np.expand_dims(image_array, axis=0))
        return int(np.argmax(prediction))

model = GestureRecognitionModel()
\`\`\`

### Option 2: Use Ngrok Tunneling

1. In Colab, install ngrok:
\`\`\`python
!pip install pyngrok
\`\`\`

2. Create Flask endpoint in Colab:
\`\`\`python
from pyngrok import ngrok

ngrok_tunnel = ngrok.connect(5001)
print(f'Public URL: {ngrok_tunnel.public_url}')
\`\`\`

3. Update `.env.local`:
\`\`\`
REACT_APP_FLASK_URL=https://your-ngrok-url.ngrok.io
\`\`\`

## Common Issues & Solutions

### Port Already in Use

\`\`\`bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
\`\`\`

### MongoDB Connection Failed

\`\`\`bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud):
# Update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/signplay
\`\`\`

### CORS Errors

Update `server/server.js`:
\`\`\`javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001'],
  credentials: true
}));
\`\`\`

### React App Not Connecting to Backend

1. Verify backend is running: `http://localhost:5000/api/health`
2. Check `.env.local` has correct URL
3. Check browser console for errors
4. Restart React dev server

### Flask Not Recognizing Images

1. Verify base64 encoding in React
2. Check image preprocessing in `flask_app.py`
3. Test with curl:
\`\`\`bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'
\`\`\`

## Performance Tips

- Use MongoDB Atlas for production
- Cache predictions on frontend
- Compress images before sending to Flask
- Use CDN for static assets
- Enable gzip compression in Express

## Next Steps

1. Replace placeholder CNN model with trained model
2. Add more game types
3. Implement user leaderboard
4. Add progress analytics charts
5. Deploy to production
