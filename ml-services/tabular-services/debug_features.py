#!/usr/bin/env python3
"""
Debug script to check what feature names the model actually expects
"""

import joblib
import pandas as pd
from pathlib import Path

def debug_model_features():
    """Debug and print the actual feature names expected by the model"""
    
    models_dir = Path("models")
    
    try:
        # Load preprocessor
        preprocessor_path = models_dir / "purrpal_symptoms_rf_preprocessor.joblib"
        preprocessor = joblib.load(preprocessor_path)
        
        print("🔍 Analyzing model feature requirements...")
        print("=" * 50)
        
        # Check if preprocessor has feature names
        if hasattr(preprocessor, 'get_feature_names_out'):
            try:
                feature_names = preprocessor.get_feature_names_out()
                print(f"✅ Found {len(feature_names)} feature names from preprocessor:")
                for i, name in enumerate(feature_names):
                    print(f"  {i+1:2d}. {name}")
            except Exception as e:
                print(f"❌ Could not get feature names from preprocessor: {e}")
        
        # Try to load the original training data to see column names
        training_data_path = "../../ml-research/tabular-analytics-engine/cleaned_animal_disease_prediction.csv"
        
        if Path(training_data_path).exists():
            print("\n" + "=" * 50)
            print("🔍 Analyzing original training data...")
            
            df = pd.read_csv(training_data_path)
            df_cat = df[df['Animal_Type'] == 'Cat'].copy()
            
            print(f"✅ Training data columns ({len(df_cat.columns)} total):")
            for i, col in enumerate(df_cat.columns):
                print(f"  {i+1:2d}. {col}")
            
            # Check unique symptoms from Symptom columns
            print("\n📊 Unique symptoms from Symptom_1 to Symptom_4:")
            symptoms_cols = ['Symptom_1', 'Symptom_2', 'Symptom_3', 'Symptom_4']
            all_symptoms = set()
            for col in symptoms_cols:
                if col in df_cat.columns:
                    all_symptoms.update(df_cat[col].unique())
            all_symptoms.discard('No')
            
            sorted_symptoms = sorted(list(all_symptoms))
            for i, symptom in enumerate(sorted_symptoms):
                print(f"  {i+1:2d}. '{symptom}'")
                
        else:
            print(f"\n❌ Training data not found at: {training_data_path}")
        
        # Try to create a dummy input and see what happens
        print("\n" + "=" * 50)
        print("🧪 Testing preprocessor with dummy input...")
        
        # Create a dummy dataframe with various possible column names
        dummy_features = {
            'Age': [2.0],
            'Weight': [4.0],
            'Body_Temperature': [38.5],
            'Duration_days': [3],
            'Heart_Rate': [120],
            'Gender_Male': [1],
            'Appetite_Loss': [0],
            'Appetite Loss': [0],
            'Loss of appetite': [0],
            'Loss of Appetite': [0],
            'Vomiting': [0],
            'Diarrhea': [0],
            'Coughing': [0],
            'Labored_Breathing': [0],
            'Labored Breathing': [0],
            'Lameness': [0],
            'Skin_Lesions': [0],
            'Skin Lesions': [0],
            'Nasal_Discharge': [0],
            'Nasal Discharge': [0],
            'Eye_Discharge': [0],
            'Eye Discharge': [0],
            'Weight_loss': [0],
            'Weight loss': [0],
            'Weight Loss': [0],
            'Fever': [0],
            'Lethargy': [0],
        }
        
        dummy_df = pd.DataFrame(dummy_features)
        
        try:
            # Try preprocessing
            processed = preprocessor.transform(dummy_df)
            print(f"✅ Preprocessing successful! Output shape: {processed.shape}")
            
            # Get feature names after preprocessing
            if hasattr(preprocessor, 'get_feature_names_out'):
                feature_names_out = preprocessor.get_feature_names_out()
                print(f"📝 Feature names after preprocessing ({len(feature_names_out)}):")
                for i, name in enumerate(feature_names_out):
                    print(f"  {i+1:2d}. {name}")
            
        except Exception as e:
            print(f"❌ Preprocessing failed: {e}")
            print("💡 This tells us which columns are actually expected!")
            
        print("\n" + "=" * 50)
        print("🎯 Recommendation:")
        print("Update the _get_expected_features() method in model_handler.py")
        print("to use the exact feature names that the model expects.")
        
    except Exception as e:
        print(f"❌ Debug failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_model_features()