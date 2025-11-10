from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import json

app = Flask(__name__)
CORS(app)

# Placeholder model - Replace with your trained CNN model
class GestureRecognitionModel:
    def __init__(self):
        pass
    
    def predict(self, image_array):
        # TODO: Load your trained CNN model here
        # For now, returning random predictions for testing
        return np.random.randint(0, 10)

model = GestureRecognitionModel()

def preprocess_image(image_data):
    """Convert base64 image to numpy array"""
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert to numpy array
        image_array = np.array(image)
        
        # Convert to grayscale if needed
        if len(image_array.shape) == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
        
        # Resize to model input size (adjust as needed)
        image_array = cv2.resize(image_array, (224, 224))
        
        # Normalize
        image_array = image_array.astype('float32') / 255.0
        
        return image_array
    except Exception as e:
        raise ValueError(f"Image processing error: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Preprocess image
        image_array = preprocess_image(image_data)
        
        # Make prediction
        prediction = model.predict(image_array)
        
        return jsonify({
            'prediction': int(prediction),
            'confidence': float(np.random.rand())  # Placeholder
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Flask server running'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
