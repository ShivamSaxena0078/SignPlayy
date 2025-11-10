# Complete Setup Guide for SignPlay

## Step-by-Step Installation

### Step 1: Clone/Download the Project

\`\`\`bash
# If using git
git clone <your-repo-url>
cd signplay

# Or extract the downloaded ZIP
unzip signplay.zip
cd signplay
\`\`\`

### Step 2: Backend Setup (Express + MongoDB)

#### 2.1 Navigate to server directory
\`\`\`bash
cd server
\`\`\`

#### 2.2 Install Node dependencies
\`\`\`bash
npm install
\`\`\`

Expected packages to be installed:
- express
- cors
- mongoose
- jsonwebtoken
- bcrypt
- dotenv

#### 2.3 Set up MongoDB

Option A: Local MongoDB
\`\`\`bash
# Download and install MongoDB from https://www.mongodb.com/try/download/community
# On macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# On Windows: Follow the installer
# On Linux: Follow MongoDB docs
\`\`\`

Option B: MongoDB Atlas (Cloud)
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account
- Create a cluster
- Get your connection string

#### 2.4 Create environment file
\`\`\`bash
# Create .env file in server directory
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/signplay
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=5000
EOF
\`\`\`

#### 2.5 Start the backend server
\`\`\`bash
# Development mode with auto-reload (if nodemon installed)
npm run dev

# Or normal mode
npm start
\`\`\`

You should see:
\`\`\`
Server running on port 5000
MongoDB connected
\`\`\`

### Step 3: Frontend Setup (Next.js + React)

#### 3.1 Navigate to client directory (open NEW terminal)
\`\`\`bash
cd client
\`\`\`

#### 3.2 Install Node dependencies
\`\`\`bash
npm install
\`\`\`

Expected packages:
- next
- react
- react-dom
- react-webcam
- recharts
- tailwindcss

#### 3.3 Create environment file
\`\`\`bash
# Create .env.local file in client directory
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_COLAB_API=http://your-colab-ngrok-url/api
EOF
\`\`\`

Note: You'll get the COLAB API URL in Step 4

#### 3.4 Start the frontend
\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
> next dev

▲ Next.js 15.0.0
- Local:        http://localhost:3000
\`\`\`

### Step 4: Set up the Colab Model (CNN for Gesture Recognition)

#### 4.1 Open the Colab Notebook
- Go to Google Colab: https://colab.research.google.com
- Open the provided notebook link or upload `model.ipynb`

#### 4.2 Install Flask and ngrok in Colab
\`\`\`python
!pip install flask flask-ngrok
!pip install -q ngrok
\`\`\`

#### 4.3 Load/Train the Model
Follow the notebook instructions to load your pre-trained CNN model

#### 4.4 Create Flask API Endpoint
In the Colab notebook, add this code:

\`\`\`python
from flask import Flask, request, jsonify
from flask_ngrok import run_with_ngrok
import cv2
import numpy as np
from base64 import b64decode
import json

app = Flask(__name__)
run_with_ngrok(app)

# Load your model here
# model = load_model('path_to_model')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_base64 = data.get('image', '')
        
        # Remove data:image/jpeg;base64, prefix if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        # Decode base64 to image
        image_bytes = b64decode(image_base64)
        image_array = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        
        # Preprocess image (resize, normalize, etc.)
        # processed_image = preprocess(image_array)
        
        # Make prediction with your model
        # prediction = model.predict(processed_image)
        # predicted_number = int(np.argmax(prediction))
        
        # For demo purposes, return a random number (0-9)
        predicted_number = np.random.randint(0, 10)
        
        return jsonify({
            'success': True,
            'predicted_number': predicted_number,
            'confidence': 0.95
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'API running'})

if __name__ == '__main__':
    app.run()
\`\`\`

#### 4.5 Run the Flask API
\`\`\`python
# This will display the ngrok URL
\`\`\`

#### 4.6 Copy the ngrok URL
You'll see something like:
\`\`\`
public url -> http://1234abcd-ab12-cd34-ef56-1234567890ab.ngrok.io
\`\`\`

#### 4.7 Update Frontend Environment
In your `client/.env.local`, update:
\`\`\`env
NEXT_PUBLIC_COLAB_API=http://1234abcd-ab12-cd34-ef56-1234567890ab.ngrok.io
\`\`\`

### Step 5: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

### Step 6: Test the Application

#### 6.1 Create an Account
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter name, email, password
4. Click "Sign Up"

#### 6.2 Visit Dashboard
- You should be redirected to dashboard
- See your stats (0 games, 0% accuracy, etc.)

#### 6.3 Learn Gestures
1. Click "View Gesture Guide"
2. Select different numbers (0-9)
3. Click "Start Webcam" to see yourself
4. Practice the gestures shown

#### 6.4 Play a Game
1. Go back to dashboard
2. Click "Play Game"
3. Solve math problems using hand gestures:
   - Question: "3 + 5"
   - Capture gesture for 8
   - For multi-digit: capture digit-by-digit
4. Check your answer
5. See your score increase

#### 6.5 View Updated Dashboard
- Check updated stats and charts
- View recent game history

## Architecture Overview

\`\`\`
Browser (http://localhost:3000)
    ↓ (React, Next.js)
    ├─→ API calls to Express Backend (http://localhost:5000/api)
    │   ├─→ MongoDB for storing users and game results
    │   └─→ JWT Authentication
    │
    └─→ Webcam captures gestures
        ↓
        POST request with base64 image
        ↓
        Colab Flask API (ngrok URL)
        ↓
        CNN Model predicts number (0-9)
        ↓
        Returns prediction to frontend
        ↓
        Game logic validates answer
\`\`\`

## File Structure After Setup

\`\`\`
signplay/
├── server/
│   ├── node_modules/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── client/
│   ├── node_modules/
│   ├── app/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── dashboard/
│   │   ├── gesture-guide/
│   │   ├── game/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   ├── .env.local
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
\`\`\`

## Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution**: 
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas
- Verify MONGODB_URI in .env is correct
- Check database network permissions if using Atlas

### Issue: "Backend port 5000 already in use"
**Solution**:
\`\`\`bash
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
\`\`\`

### Issue: "Webcam not working"
**Solution**:
- Check browser permissions for camera
- Try different browser
- Ensure webcam is not used by another app

### Issue: "API calls failing"
**Solution**:
- Check NEXT_PUBLIC_API_URL matches backend URL
- Ensure backend is running
- Check browser console for CORS errors

### Issue: "Model predictions not working"
**Solution**:
- Verify Colab notebook is running
- Check ngrok URL is correct and active
- Ensure NEXT_PUBLIC_COLAB_API is set correctly
- Test with: `curl http://your-ngrok-url/api/health`

## Performance Optimization

For production:
- Use MongoDB Atlas instead of local
- Deploy backend to Vercel, Railway, or Heroku
- Deploy frontend to Vercel
- Use environment variables securely
- Add rate limiting to API
- Optimize images and assets
- Enable gzip compression

## Security Notes

- Change JWT_SECRET to a strong random value
- Never commit .env files to git
- Use HTTPS in production
- Validate all user inputs
- Use rate limiting
- Implement CORS properly
- Hash passwords with bcrypt (already done)

## Next Steps

1. Improve the CNN model accuracy
2. Add sound feedback
3. Implement difficulty levels
4. Add leaderboard
5. Create mobile app version
6. Add more games/exercises

---

Happy coding! If you face issues, check the troubleshooting section or ask for help.
