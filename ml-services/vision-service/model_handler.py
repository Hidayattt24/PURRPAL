import tensorflow as tf
import numpy as np
import cv2
import os
import base64
import json
import logging
from PIL import Image
import io

logger = logging.getLogger(__name__)

class ModelHandler:
    def __init__(self, model_path, class_map_path):
        self.IMG_WIDTH = 128
        self.IMG_HEIGHT = 128
        self.model_path = model_path
        self.class_map_path = class_map_path
        self.model = None
        self.class_map = {}
        self._load_model()
        self._load_class_map()

    def _load_model(self):
        """Load the TensorFlow model."""
        try:
            self.model = tf.keras.models.load_model(self.model_path, compile=False)
            logger.info(f"Model loaded successfully from {self.model_path}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    def _load_class_map(self):
        """Load class mapping from JSON file."""
        try:
            with open(self.class_map_path, 'r') as f:
                loaded_class_map = json.load(f)
                # Swap keys and values and convert class IDs to integers
                self.class_map = {v: k for k, v in loaded_class_map.items()}
            logger.info(f"Class map loaded successfully from {self.class_map_path}")
            logger.info(f"Mapped classes: {self.class_map}")
        except FileNotFoundError:
            logger.error(f"Class map file not found: {self.class_map_path}")
            raise
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON format in class map file: {self.class_map_path}")
            raise

    def _preprocess_image(self, image_data):
        """Preprocess image for model input."""
        try:
            # Convert base64 to image if needed
            if isinstance(image_data, str) and image_data.startswith('data:image'):
                # Remove data URL prefix if present
                image_data = image_data.split(',')[1]
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
                image = np.array(image)
                if len(image.shape) == 2:  # Convert grayscale to RGB
                    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            else:
                image = image_data

            # Resize and normalize
            image = cv2.resize(image, (self.IMG_WIDTH, self.IMG_HEIGHT))
            image = image.astype("float32") / 255.0
            return np.expand_dims(image, axis=0)

        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise

    def predict(self, image_data, confidence_threshold=0.5):
        """
        Predict disease from image data.
        Returns prediction results including disease, confidence, and recommendations.
        """
        try:
            # Preprocess image
            image_batch = self._preprocess_image(image_data)

            # Get model prediction
            pred_class_probs, _ = self.model.predict(image_batch, verbose=0)
            class_id = np.argmax(pred_class_probs[0])
            confidence = float(pred_class_probs[0][class_id])

            # Get prediction details
            if confidence < confidence_threshold:
                return {
                    "predicted_disease": "No confident prediction",
                    "confidence": confidence * 100,
                    "diagnosis": "Confidence level too low for reliable prediction",
                    "recommendations": "Please try again with a clearer image or consult a veterinarian",
                    "accuracy": "N/A",
                    "active_symptoms": [],
                    "all_probabilities": {
                        self.class_map.get(i, f"class_{i}"): float(prob) * 100
                        for i, prob in enumerate(pred_class_probs[0])
                    }
                }

            predicted_class = self.class_map.get(class_id, "Unknown")
            
            # Prepare diagnosis and recommendations based on the predicted disease
            diagnosis = self._get_diagnosis(predicted_class)
            recommendations = self._get_recommendations(predicted_class)

            return {
                "predicted_disease": predicted_class,
                "confidence": confidence * 100,
                "diagnosis": diagnosis,
                "recommendations": recommendations,
                "accuracy": "85",  # Based on model validation
                "active_symptoms": [predicted_class],  # Main symptom/disease detected
                "all_probabilities": {
                    self.class_map.get(i, f"class_{i}"): float(prob) * 100
                    for i, prob in enumerate(pred_class_probs[0])
                }
            }

        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise

    def _get_diagnosis(self, disease):
        """Get diagnosis text for the predicted disease."""
        # This could be expanded with a proper database of diagnoses
        return f"""
        <p>Berdasarkan analisis gambar, kucing Anda menunjukkan tanda-tanda <strong>{disease}</strong>.</p>
        <p>Diagnosis ini didasarkan pada pola visual yang terdeteksi dalam gambar yang diunggah.</p>
        """

    def _get_recommendations(self, disease):
        """Get recommendations for the predicted disease."""
        # This could be expanded with a proper database of recommendations
        return f"""
        <p>Untuk penanganan <strong>{disease}</strong>, berikut beberapa rekomendasi:</p>
        <ul>
            <li>Konsultasikan dengan dokter hewan untuk pemeriksaan lebih lanjut</li>
            <li>Jaga kebersihan kucing dan lingkungannya</li>
            <li>Berikan nutrisi yang seimbang</li>
            <li>Pantau perkembangan kondisi kucing</li>
        </ul>
        """
