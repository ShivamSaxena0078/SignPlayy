# SignPlay API Documentation

## Base URLs

- Backend: `http://localhost:5000/api`
- Flask: `http://localhost:5001`

## Authentication Routes

### Signup
**Endpoint:** `POST /auth/signup`

**Request:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

### Login
**Endpoint:** `POST /auth/login`

**Request:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

## Game Routes

### Save Game Result
**Endpoint:** `POST /game/save-result`

**Authentication:** Required (Bearer Token)

**Request:**
\`\`\`json
{
  "question": "5 + 3",
  "correctAnswer": 8,
  "predictedAnswer": 8,
  "accuracy": 95,
  "speed": 2500,
  "dexterityScore": 85
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "gameRecord": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "question": "5 + 3",
    "correctAnswer": 8,
    "predictedAnswer": 8,
    "accuracy": 95,
    "speed": 2500,
    "dexterityScore": 85,
    "isCorrect": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
\`\`\`

### Get User Stats
**Endpoint:** `GET /game/stats`

**Authentication:** Required (Bearer Token)

**Response:**
\`\`\`json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "totalGamesPlayed": 15,
    "averageAccuracy": 87,
    "dexterityScore": 92,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "recentGames": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "question": "5 + 3",
      "correctAnswer": 8,
      "predictedAnswer": 8,
      "accuracy": 95,
      "isCorrect": true,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
\`\`\`

### Get Game History
**Endpoint:** `GET /game/history`

**Authentication:** Required (Bearer Token)

**Response:**
\`\`\`json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "question": "5 + 3",
    "correctAnswer": 8,
    "predictedAnswer": 8,
    "accuracy": 95,
    "isCorrect": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
]
\`\`\`

## Flask AI Routes

### Predict Gesture
**Endpoint:** `POST /predict`

**Request:**
\`\`\`json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "prediction": 5,
  "confidence": 0.98
}
\`\`\`

### Health Check
**Endpoint:** `GET /health`

**Response:**
\`\`\`json
{
  "status": "Flask server running"
}
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "User already exists"
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "Invalid token"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error message"
}
\`\`\`

## Notes

- All timestamps are in ISO 8601 format
- Authentication uses JWT Bearer tokens
- Token expires in 7 days
- Images must be base64 encoded for gesture prediction
