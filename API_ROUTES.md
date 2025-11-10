# SignPlay API Routes Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication Routes

### Signup
\`\`\`
POST /auth/signup
\`\`\`

**Request Body**:
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response (201)**:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

---

### Login
\`\`\`
POST /auth/login
\`\`\`

**Request Body**:
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

---

## Game Routes

All game routes require authentication. Include the token in headers:
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

### Save Game Result
\`\`\`
POST /game/save-result
\`\`\`

**Headers**:
\`\`\`
Authorization: Bearer token
Content-Type: application/json
\`\`\`

**Request Body**:
\`\`\`json
{
  "question": "7 + 8",
  "correctAnswer": 15,
  "predictedAnswer": 15,
  "accuracy": 100,
  "speed": 2500,
  "dexterityScore": 85
}
\`\`\`

**Response (200)**:
\`\`\`json
{
  "success": true,
  "gameRecord": {
    "_id": "record_id_123",
    "userId": "user_id_123",
    "question": "7 + 8",
    "correctAnswer": 15,
    "predictedAnswer": 15,
    "accuracy": 100,
    "speed": 2500,
    "dexterityScore": 85,
    "isCorrect": true,
    "timestamp": "2024-11-05T10:30:00.000Z"
  }
}
\`\`\`

---

### Get User Stats
\`\`\`
GET /game/stats
\`\`\`

**Headers**:
\`\`\`
Authorization: Bearer token
\`\`\`

**Response (200)**:
\`\`\`json
{
  "user": {
    "_id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "totalGamesPlayed": 5,
    "averageAccuracy": 92,
    "dexterityScore": 88
  },
  "recentGames": [
    {
      "_id": "game_id_1",
      "question": "7 + 8",
      "correctAnswer": 15,
      "predictedAnswer": 15,
      "accuracy": 100,
      "isCorrect": true,
      "timestamp": "2024-11-05T10:30:00.000Z"
    }
  ]
}
\`\`\`

---

### Get Full Game History
\`\`\`
GET /game/history
\`\`\`

**Headers**:
\`\`\`
Authorization: Bearer token
\`\`\`

**Response (200)**:
\`\`\`json
[
  {
    "_id": "game_id_1",
    "userId": "user_id_123",
    "question": "7 + 8",
    "correctAnswer": 15,
    "predictedAnswer": 15,
    "accuracy": 100,
    "speed": 2500,
    "dexterityScore": 85,
    "isCorrect": true,
    "timestamp": "2024-11-05T10:30:00.000Z"
  },
  ...
]
\`\`\`

---

## Error Responses

### 400 - Bad Request
\`\`\`json
{
  "error": "User already exists"
}
\`\`\`

### 401 - Unauthorized
\`\`\`json
{
  "error": "No token provided"
}
\`\`\`

\`\`\`json
{
  "error": "Invalid token"
}
\`\`\`

### 500 - Server Error
\`\`\`json
{
  "error": "Internal server error message"
}
\`\`\`

---

## Using the API with JavaScript

### Example: Signup
\`\`\`javascript
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: 'pass123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
\`\`\`

### Example: Save Game Result
\`\`\`javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/game/save-result', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    question: '7 + 8',
    correctAnswer: 15,
    predictedAnswer: 15,
    accuracy: 100,
    speed: 2500,
    dexterityScore: 85
  })
});

const result = await response.json();
console.log(result);
\`\`\`

---

## Using the API with cURL

### Signup
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "pass123"
  }'
\`\`\`

### Get Stats (with token)
\`\`\`bash
curl -X GET http://localhost:5000/api/game/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Missing/invalid token |
| 500 | Server Error - Internal error |

---

## Testing the API

Use tools like:
- Postman: https://www.postman.com
- Thunder Client (VS Code extension)
- cURL (command line)
- REST Client (VS Code extension)

Example flow:
1. POST /auth/signup → Get token
2. POST /game/save-result with token
3. GET /game/stats with token
4. View results on dashboard
