import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, List, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PurrPalTabularModel:
    def __init__(self, models_dir: str = "models"):
        """
        Initialize PurrPal Tabular Model Handler
        
        Args:
            models_dir: Directory containing model files
        """
        self.models_dir = Path(models_dir)
        self.model = None
        self.preprocessor = None
        self.class_names = None
        self.feature_names = None
        
        # Load models on initialization
        self.load_models()
        
    def load_models(self):
        """Load trained model, preprocessor, and class names"""
        try:
            # Load model files
            model_path = self.models_dir / "purrpal_symptoms_rf_model.joblib"
            preprocessor_path = self.models_dir / "purrpal_symptoms_rf_preprocessor.joblib"
            class_names_path = self.models_dir / "purrpal_symptoms_rf_class_names.joblib"
            
            # Verify files exist
            for path in [model_path, preprocessor_path, class_names_path]:
                if not path.exists():
                    raise FileNotFoundError(f"Model file not found: {path}")
            
            # Load models
            self.model = joblib.load(model_path)
            self.preprocessor = joblib.load(preprocessor_path)
            self.class_names = joblib.load(class_names_path)
            
            # Define feature names (based on notebook analysis)
            self.feature_names = self._get_expected_features()
            
            logger.info("Models loaded successfully!")
            logger.info(f"Available classes: {list(self.class_names)}")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise
    
    def _get_expected_features(self) -> List[str]:
        """
        Get list of expected feature names that should exist in input DataFrame
        BEFORE ColumnTransformer processing (without num__ and remainder__ prefixes)
        """
        # These are the exact column names needed in input DataFrame
        # ColumnTransformer will add prefixes automatically
        expected_features = [
            # Numeric features (ColumnTransformer will add num__ prefix)
            'Age', 'Weight', 'Body_Temperature', 'Duration_days', 'Heart_Rate',
            
            # Binary/categorical features (ColumnTransformer will add remainder__ prefix)
            'Gender_Male',
            'Appetite_Loss',  # underscore version
            'Vomiting',
            'Diarrhea', 
            'Coughing',
            'Labored_Breathing',  # underscore version
            'Lameness',
            'Skin_Lesions',  # underscore version
            'Nasal_Discharge',  # underscore version  
            'Eye_Discharge',  # underscore version
            'Eye Discharge',  # space version (duplicate but needed!)
            'Sneezing',  # ADD THIS - was missing!
            'Dehydration',  # ADD THIS - was missing!
            'Lethargy',
            'Weight Loss',  # space version
            'Fever',
            'Appetite Loss',  # space version (duplicate but needed!)
            'Loss of Appetite',  # space version
            'Nasal Discharge',  # space version (duplicate but needed!)
            'Skin Lesions',  # space version (duplicate but needed!)
        ]
        
        return expected_features
    
    def preprocess_input(self, cat_data: Dict[str, Any], questionnaire_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Preprocess input data to match training format
        
        Args:
            cat_data: Dictionary containing cat information (name, age, gender, weight, etc.)
            questionnaire_data: Dictionary containing questionnaire answers
            
        Returns:
            pd.DataFrame: Preprocessed feature vector ready for prediction
        """
        try:
            # Initialize feature vector with zeros for ALL expected features
            features = {feature: 0 for feature in self.feature_names}
            
            # Process numeric features
            features['Age'] = float(cat_data.get('age', 2))  # Default 2 years
            features['Weight'] = float(cat_data.get('weight', 4.0))  # Default 4kg
            features['Body_Temperature'] = float(cat_data.get('body_temperature', 38.5))  # Default normal temp
            features['Duration_days'] = float(cat_data.get('duration_days', 3))  # Default 3 days
            features['Heart_Rate'] = int(cat_data.get('heart_rate', 120))  # Default normal heart rate
            
            # Process gender
            features['Gender_Male'] = 1 if cat_data.get('gender', '').lower() == 'male' else 0
            
            # Process questionnaire answers
            # Map questionnaire IDs to exact feature names that model expects
            questionnaire_mapping = {
                'cough': 'Coughing',
                'breathingDifficulty': 'Labored_Breathing',
                'fever': 'Fever', 
                'discomfort': 'Lethargy',
                'appetiteLoss': 'Appetite_Loss',  # Use underscore version
                'weightLoss': 'Weight Loss',  # Use space version
                'vomiting': 'Vomiting',
                'diarrhea': 'Diarrhea',
                'skinLesions': 'Skin_Lesions',  # Use underscore version
                'nasalDischarge': 'Nasal_Discharge',  # Use underscore version
                'eyeDischarge': 'Eye_Discharge',  # Use underscore version
                'nightSweats': 'Dehydration',  # Map to Dehydration
                'phlegmGreen': 'Sneezing',  # Map to Sneezing
                'phlegmBlood': 'Loss of Appetite',  # Map to existing feature
                'yellowPhlegm': 'Sneezing',  # Map to Sneezing (same as phlegmGreen)
                'breathingSound': 'Labored_Breathing'  # Map to existing feature
            }
            
            # Apply questionnaire answers
            for question_id, answer in questionnaire_data.items():
                if question_id in questionnaire_mapping:
                    feature_name = questionnaire_mapping[question_id]
                    if feature_name in features:
                        features[feature_name] = 1 if answer else 0
                    else:
                        logger.warning(f"Feature {feature_name} not found in expected features")
            
            # Create DataFrame with exact column order
            df = pd.DataFrame([features])
            
            # Reorder columns to match training order
            df = df[self.feature_names]
            
            # Debug: Check for missing columns
            missing_cols = set(self.feature_names) - set(df.columns)
            if missing_cols:
                logger.error(f"Missing columns in DataFrame: {missing_cols}")
                logger.error(f"Available columns: {list(df.columns)}")
                logger.error(f"Expected columns: {self.feature_names}")
                raise ValueError(f"Missing required columns: {missing_cols}")
            
            logger.info(f"Input preprocessed successfully. Shape: {df.shape}")
            logger.info(f"All required columns present: {len(df.columns)} columns")
            logger.debug(f"Feature columns: {list(df.columns)}")
            return df
            
        except Exception as e:
            logger.error(f"Error preprocessing input: {e}")
            raise
    
    def predict(self, cat_data: Dict[str, Any], questionnaire_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make prediction on cat symptoms
        
        Args:
            cat_data: Dictionary containing cat information
            questionnaire_data: Dictionary containing questionnaire answers
            
        Returns:
            Dictionary containing prediction results
        """
        try:
            # Preprocess input
            X = self.preprocess_input(cat_data, questionnaire_data)
            
            # Apply same preprocessing as training (StandardScaler for numeric features)
            X_processed = self.preprocessor.transform(X)
            
            # Make prediction
            prediction = self.model.predict(X_processed)[0]
            prediction_proba = self.model.predict_proba(X_processed)[0]
            
            # Get prediction confidence
            max_proba = float(np.max(prediction_proba))
            
            # Prepare result
            result = {
                'predicted_disease': prediction,
                'confidence': round(max_proba * 100, 1),
                'all_probabilities': {
                    disease: round(float(prob) * 100, 1) 
                    for disease, prob in zip(self.class_names, prediction_proba)
                },
                'cat_info': cat_data,
                'feature_summary': self._get_active_symptoms(cat_data, questionnaire_data)
            }
            
            logger.info(f"Prediction completed: {prediction} ({max_proba:.2%} confidence)")
            return result
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise
    
    def _get_active_symptoms(self, cat_data: Dict[str, Any], questionnaire_data: Dict[str, Any]) -> List[str]:
        """Get list of active symptoms for interpretation"""
        active_symptoms = []
        
        # Map questionnaire to human-readable symptoms
        symptom_labels = {
            'cough': 'Batuk',
            'breathingDifficulty': 'Kesulitan bernapas',
            'fever': 'Demam',
            'discomfort': 'Terlihat tidak nyaman',
            'appetiteLoss': 'Kehilangan nafsu makan',
            'weightLoss': 'Penurunan berat badan',
            'vomiting': 'Muntah',
            'diarrhea': 'Diare',
            'skinLesions': 'Luka pada kulit',
            'nasalDischarge': 'Keluaran hidung',
            'eyeDischarge': 'Keluaran mata',
            'nightSweats': 'Dehidrasi',
            'phlegmGreen': 'Bersin-bersin',
            'phlegmBlood': 'Kehilangan nafsu makan',
            'yellowPhlegm': 'Bersin-bersin',
            'breathingSound': 'Gangguan pernapasan'
        }
        
        for question_id, answer in questionnaire_data.items():
            if answer and question_id in symptom_labels:
                active_symptoms.append(symptom_labels[question_id])
        
        return active_symptoms

    def get_health_info(self) -> Dict[str, Any]:
        """Get model health information"""
        return {
            'model_loaded': self.model is not None,
            'preprocessor_loaded': self.preprocessor is not None,
            'class_names_loaded': self.class_names is not None,
            'available_classes': list(self.class_names) if self.class_names is not None else [],
            'total_features': len(self.feature_names) if self.feature_names else 0
        }