from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from model_handler import ModelHandler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
MODEL_PATH = os.getenv('MODEL_PATH', 'models/cat_disease.h5')
CLASS_MAP_PATH = os.getenv('CLASS_MAP_PATH', 'models/class_map.json')
CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', '0.5'))

# Initialize model handler
try:
    model_handler = ModelHandler(MODEL_PATH, CLASS_MAP_PATH)
    logger.info("Model handler initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize model handler: {e}")
    raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": model_handler.model is not None,
        "class_map_loaded": len(model_handler.class_map) > 0
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint for making predictions from images."""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                "success": False,
                "error": "No image data provided"
            }), 400

        # Get image data and cat info
        image_data = data['image']
        cat_info = data.get('cat_info', {})

        # Make prediction
        prediction = model_handler.predict(
            image_data,
            confidence_threshold=CONFIDENCE_THRESHOLD
        )

        # Add cat info to response
        prediction['cat_info'] = cat_info

        return jsonify({
            "success": True,
            "data": prediction
        })

    except Exception as e:
        logger.error(f"Error processing prediction request: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    # Use PORT env variable with fallback to 8080 (GCP Cloud Run default)
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)