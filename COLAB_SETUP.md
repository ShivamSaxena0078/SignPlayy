# Colab Model Setup Instructions

## Quick Setup (5 minutes)

### Option 1: Use Your Existing Model

If you have a trained CNN model, follow these steps:

\`\`\`python
# In Colab Cell 1: Install dependencies
!pip install flask flask-ngrok opencv-python numpy

# In Colab Cell 2: Import libraries
from flask import Flask, request, jsonify
from flask_ngrok import run_with_ngrok
import cv2
import numpy as np
from base64 import b64decode
import json

# In Colab Cell 3: Load your model
# Example for TensorFlow/Keras
from tensorflow.keras.models import load_model
model = load_model('your_model.h5')

# In Colab Cell 4: Create Flask API
app = Flask(__name__)
run_with_ngrok(app)

def preprocess_image(image_array):
    """Preprocess image for model"""
    # Resize to your model's expected input size (e.g., 224x224)
    image = cv2.resize(image_array, (224, 224))
    # Normalize
    image = image / 255.0
    # Add batch dimension
    image = np.expand_dims(image, axis=0)
    return image

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_base64 = data.get('image', '')
        
        # Remove data:image/jpeg;base64, prefix
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        # Decode
        image_bytes = b64decode(image_base64)
        image_array = cv2.imdecode(
            np.frombuffer(image_bytes, np.uint8), 
            cv2.IMREAD_COLOR
        )
        
        # Preprocess
        processed = preprocess_image(image_array)
        
        # Predict
        prediction = model.predict(processed, verbose=0)
        predicted_number = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
        
        return jsonify({
            'success': True,
            'predicted_number': predicted_number,
            'confidence': confidence
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'API running'})

# Run the app
app.run()

# This will output something like:
# public url -> http://abc123-ab12-cd34-ef56-1234567890ab.ngrok.io
\`\`\`

### Option 2: Demo Model (for testing)

If you don't have a model yet, use this demo:

\`\`\`python
# In Colab Cell 1: Install
!pip install flask flask-ngrok opencv-python numpy

# In Colab Cell 2: Create demo Flask API
from flask import Flask, request, jsonify
from flask_ngrok import run_with_ngrok
import cv2
import numpy as np
from base64 import b64decode
import random

app = Flask(__name__)
run_with_ngrok(app)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_base64 = data.get('image', '')
        
        # For demo, just return a random number
        # In production, run actual model
        predicted_number = random.randint(0, 9)
        
        return jsonify({
            'success': True,
            'predicted_number': predicted_number,
            'confidence': 0.85
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'API running'})

app.run()
\`\`\`

## Get the Public URL

After running the Flask app, Colab will show:

\`\`\`
public url -> http://abcd1234-ef56-gh78-ij90-klmnopqrstuv.ngrok.io
\`\`\`

Copy this URL!

## Update Frontend

1. In `client/.env.local`, add:
\`\`\`env
NEXT_PUBLIC_COLAB_API=http://your-ngrok-url-here.ngrok.io
\`\`\`

2. Restart frontend: `npm run dev`

## Test the API

\`\`\`bash
# Terminal
curl http://your-ngrok-url/api/health

# Should return:
# {"status":"API running"}
\`\`\`

## Keep Colab Running

- The ngrok URL is temporary and changes each time
- Keep the Colab cell running while testing
- For production, deploy the model to a permanent service

## Common Model Issues

### Model expects different image size
\`\`\`python
# Check your model's expected input
# Then update preprocess_image function:
image = cv2.resize(image_array, (YOUR_SIZE, YOUR_SIZE))
\`\`\`

### Different number of output classes
\`\`\`python
# If your model predicts 26 gestures instead of 10:
predicted_number = int(np.argmax(prediction)) % 10
\`\`\`

### Memory issues in Colab
\`\`\`python
# Add this before loading model
import tensorflow as tf
gpus = tf.config.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)
\`\`\`

---

That's it! Your gesture detection API is ready!
