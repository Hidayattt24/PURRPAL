#!/usr/bin/env python3
"""
Test script to verify preprocessing works correctly
"""

from model_handler import PurrPalTabularModel

def test_preprocessing():
    """Test the preprocessing pipeline"""
    
    print("🧪 Testing PurrPal Model Preprocessing...")
    print("=" * 50)
    
    try:
        # Initialize model
        print("1. Loading model...")
        model = PurrPalTabularModel()
        print("✅ Model loaded successfully!")
        
        # Test data
        print("\n2. Preparing test data...")
        cat_data = {
            "name": "Test Cat",
            "age": 2.0,
            "gender": "male",
            "weight": 4.5,
            "body_temperature": 39.0,
            "duration_days": 5,
            "heart_rate": 130
        }
        
        questionnaire_data = {
            'cough': True,
            'breathingDifficulty': False,
            'fever': True,
            'discomfort': True,
            'appetiteLoss': True,
            'weightLoss': False,
            'vomiting': False,
            'diarrhea': False,
            'skinLesions': False,
            'nasalDischarge': True,
            'eyeDischarge': False,
            'nightSweats': False,
            'phlegmGreen': True,
            'phlegmBlood': False,
            'yellowPhlegm': False,
            'breathingSound': False
        }
        
        print("✅ Test data prepared!")
        
        # Test preprocessing
        print("\n3. Testing preprocessing...")
        X = model.preprocess_input(cat_data, questionnaire_data)
        print(f"✅ Preprocessing successful! Shape: {X.shape}")
        
        # Test model transformation
        print("\n4. Testing model transformation...")
        X_processed = model.preprocessor.transform(X)
        print(f"✅ Model transformation successful! Shape: {X_processed.shape}")
        
        # Test prediction
        print("\n5. Testing full prediction...")
        result = model.predict(cat_data, questionnaire_data)
        print("✅ Prediction successful!")
        print(f"   Predicted disease: {result['predicted_disease']}")
        print(f"   Confidence: {result['confidence']}%")
        print(f"   Active symptoms: {result['feature_summary']}")
        
        print("\n" + "=" * 50)
        print("🎉 ALL TESTS PASSED! Model is working correctly.")
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_preprocessing()
    if not success:
        exit(1)