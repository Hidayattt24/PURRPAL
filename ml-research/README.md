# 🔬 PURRPAL ML Research

<div align="center">
  <img src="https://i.imgur.com/fTBDB26.png" alt="PurrPal Logo" width="200"/>
  
  <h3>🧬 Machine Learning Research & Model Development Laboratory</h3>
  
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white)](https://jupyter.org/)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
  [![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
  [![Google Colab](https://img.shields.io/badge/Colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=525252)](https://colab.research.google.com/)
  
  **🔬 Research Lab | 🧠 Model Development | 📊 Data Science Excellence**
</div>

---

## 🎯 **Tentang ML Research Lab**

**PurrPal ML Research** adalah laboratorium riset dan pengembangan yang didedikasikan untuk memajukan teknologi AI dalam bidang kesehatan hewan, khususnya kucing. Lab ini mengembangkan dua pendekatan utama untuk diagnosis penyakit kucing:

1. **📸 Computer Vision**: Deteksi penyakit kulit melalui analisis gambar
2. **📊 Symptom Analytics**: Prediksi penyakit sistemik berdasarkan gejala klinis

### 🌟 **Visi Research Lab**

> *"Democratizing veterinary AI through cutting-edge research and open science principles"*

---

## 🏗️ **Research Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                🔬 ML Research Laboratory                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
  ┌───────────────▼────────────────┐ ┌────────────────▼───────────────┐
  │   📸 Image Recognition         │ │   📊 Tabular Analytics         │
  │   Research Engine              │ │   Research Engine              │
  └───────────────┬────────────────┘ └────────────────┬───────────────┘
                  │                                   │
  ┌───────────────▼────────────────┐ ┌────────────────▼───────────────┐
  │                                │ │                                │
  │  🖼️ Computer Vision           │ │  📈 Statistical ML              │
  │                                │ │                                │
  │ • MobileNetV2 Backbone         │ │ • Random Forest Classifier     │
  │ • Transfer Learning            │ │ • Feature Engineering          │
  │ • Object Detection             │ │ • SMOTE Data Balancing         │
  │ • Multi-format Export          │ │ • Model Interpretability       │
  │                                │ │                                │
  │ 🎯 6 Skin Diseases             │ │ 🎯 6 Systemic Diseases         │
  │                                │ │                                │
  └────────────────────────────────┘ └────────────────────────────────┘
```

---

## 📸 **Image Recognition Research Engine**

### 🎯 **Research Objectives**
Mengembangkan sistem computer vision untuk mendeteksi penyakit kulit pada kucing melalui analisis gambar dengan pendekatan multi-task learning (object detection + classification).

### 🏷️ **Target Diseases (6 Classes)**

| ID | Disease Name | Indonesian | Category | Severity |
|----|--------------|------------|----------|----------|
| **0** | **Demodicosis** | Demodikosis | Parasitic | Moderate |
| **1** | **Dermatitis** | Dermatitis | Inflammatory | Mild-Severe |
| **2** | **Flea Allergy** | Alergi Kutu | Allergic | Mild-Moderate |
| **3** | **Jamur** | Infeksi Jamur | Fungal | Moderate |
| **4** | **Ringworm** | Kurap | Fungal | Moderate-Severe |
| **5** | **Scabies** | Kudis/Skabies | Parasitic | Severe |

### 🧠 **Model Architecture**

```python
# MobileNetV2-based Multi-Task Model
Base Model: MobileNetV2 (ImageNet pretrained)
├── Input: (128, 128, 3) # Optimized for mobile deployment
├── MobileNetV2 Backbone: Frozen weights for feature extraction
├── Flatten Layer: Convert 2D features to 1D vector
├── Dense Layer: 128 units + ReLU + Dropout(0.5)
├── Classification Head: 6 classes (Softmax activation)
└── Bounding Box Head: 4 coordinates (Sigmoid activation)

Model Configuration:
├── Total Parameters: ~2.5M
├── Trainable Parameters: ~300K (only head layers)
├── Model Size: ~15MB (.h5 format)
└── Inference Time: ~47ms per image
```

### 📊 **Training Configuration**

```yaml
Optimizer: Adam (learning_rate=0.001)
Loss Functions:
  - Classification: categorical_crossentropy
  - Bounding Box: mean_squared_error
Batch Size: 32
Epochs: 50 (with EarlyStopping)
Image Size: 128x128 (speed-accuracy balance)
Data Augmentation:
  - Rotation: ±20°
  - Zoom: 0.8-1.2x
  - Horizontal Flip: True
  - Brightness: ±20%
  - Contrast: 0.8-1.2x
Callbacks:
  - ModelCheckpoint: Save best model
  - EarlyStopping: Prevent overfitting
  - ReduceLROnPlateau: Learning rate scheduling
```

---

## 📊 **Tabular Analytics Research Engine**

### 🎯 **Research Objectives**
Mengembangkan sistem prediksi penyakit sistemik pada kucing berdasarkan data klinis dan gejala menggunakan Random Forest dengan interpretability tinggi untuk clinical decision support.

### 🏷️ **Target Diseases (6 Classes)**

| Disease | Indonesian | Clinical Urgency | Prognosis |
|---------|------------|------------------|-----------|
| **Feline Calicivirus** | Kalisivirosis Kucing | Moderate | Good with treatment |
| **Feline Herpesvirus** | Herpes Kucing | Moderate | Chronic, manageable |
| **Feline Infectious Peritonitis** | Peritonitis Infeksius | Critical | Poor |
| **Feline Leukemia Virus** | Leukemia Kucing | Critical | Very Poor |
| **Feline Panleukopenia** | Panleukopenia | Critical | Poor without treatment |
| **Upper Respiratory Infection** | Infeksi Saluran Napas | Low-Moderate | Excellent |

### 🧮 **Feature Engineering Pipeline**

```python
# Advanced Feature Engineering Process
Data Sources:
├── Symptom Columns: Symptom_1, Symptom_2, Symptom_3, Symptom_4
│   └── Converted to binary features for each unique symptom
├── Binary Symptom Columns: Yes/No → 1/0
│   └── ['Appetite_Loss', 'Vomiting', 'Diarrhea', 'Coughing', 
│        'Labored_Breathing', 'Lameness', 'Skin_Lesions', 
│        'Nasal_Discharge', 'Eye_Discharge']
├── Numeric Features: 
│   └── ['Age', 'Weight', 'Body_Temperature', 'Duration_days', 'Heart_Rate']
└── Categorical Features:
    └── ['Gender_Male'] (binary encoding)

Preprocessing Pipeline:
1. Symptom Consolidation: Extract unique symptoms from multiple columns
2. Binary Encoding: Convert Yes/No responses to 1/0
3. Numeric Processing: Extract values from text (e.g., "39.5°C" → 39.5)
4. Duration Standardization: Convert weeks to days
5. ColumnTransformer: StandardScaler for numeric, passthrough for binary
6. SMOTE Balancing: Oversample minority classes
```

### 🌳 **Model Development**

```python
# Random Forest Configuration
RandomForestClassifier(
    n_estimators=100,        # Balance between accuracy and speed
    random_state=42,         # Reproducibility
    class_weight='balanced'  # Handle class imbalance
)

# Data Balancing Strategy
SMOTE Configuration:
├── Dynamic k_neighbors: max(1, min_class_count - 1)
├── Applied only to training data
├── Maintains test data integrity
└── Addresses class imbalance effectively

# Preprocessing Pipeline
ColumnTransformer:
├── Numeric Features: StandardScaler applied
│   └── ['Age', 'Weight', 'Body_Temperature', 'Duration_days', 'Heart_Rate']
├── Binary Features: Passthrough (no scaling needed)
│   └── All symptom binary features (20+ features)
└── Final Feature Count: 25+ engineered features
```

---

## 📊 **Research Results & Performance**

### 📸 **Computer Vision Performance**

```python
# Model Evaluation Results
Validation Accuracy: 85.2%
Classification Metrics:
├── Precision: 0.86 (weighted average)
├── Recall: 0.85 (weighted average)
├── F1-Score: 0.85 (weighted average)
└── Inference Time: ~47ms per image

Export Formats Generated:
├── cat_disease.h5 (Keras format)
├── cat_disease_savedmodel/ (TensorFlow SavedModel)
├── cat_disease_tfjs/ (TensorFlow.js)
└── class_map.json (class mappings)
```

### 📊 **Tabular Analytics Performance**

```python
# Cross-Validation Results
Overall Accuracy: 87.3%
Classification Report:
                        precision  recall  f1-score  support
Feline Calicivirus         0.89     0.85     0.87      234
Feline Herpesvirus         0.91     0.88     0.89      267
Feline Infectious Peritonitis 0.94  0.91     0.92      189
Feline Leukemia Virus      0.92     0.89     0.90      198
Feline Panleukopenia       0.88     0.86     0.87      156
Upper Respiratory Infection 0.85    0.92     0.88      445

Model Artifacts Generated:
├── purrpal_symptoms_rf_model.joblib
├── purrpal_symptoms_rf_preprocessor.joblib
├── purrpal_symptoms_rf_class_names.joblib
└── labels.json
```

---

## 🗂️ **Repository Structure**

```
ml-research/
├── 📸 image-recognition-engine/        # Computer Vision Research
│   ├── 🤖 cat_disease.h5             # Trained model (MobileNetV2)
│   ├── 🏷️ class_map.json             # Disease class mappings
│   ├── 📓 notebook.ipynb             # Complete research notebook
│   └── 📋 Generated Outputs/          # Model exports & artifacts
│       ├── cat_disease_savedmodel/    # TensorFlow SavedModel
│       ├── cat_disease_tfjs/          # TensorFlow.js format
│       └── requirements.txt           # Dependencies
├── 📊 tabular-analytics-engine/        # Statistical ML Research  
│   ├── 📋 cleaned_animal_disease_prediction.csv  # Processed dataset
│   ├── 🏷️ labels.json                # Disease class labels
│   ├── 🌳 purrpal_symptoms_rf_model.joblib       # Random Forest model
│   ├── ⚙️ purrpal_symptoms_rf_preprocessor.joblib # Preprocessing pipeline
│   ├── 📝 purrpal_symptoms_rf_class_names.joblib  # Class mappings
│   └── 📓 symptoms-purrpal.ipynb      # Complete research notebook
└── 📚 README.md                       # This documentation
```

---

## 🚀 **Quick Start Guide**

### 📋 **Prerequisites**
- Google Colab account (recommended for GPU access)
- Python 3.8+ with Jupyter Notebook (for local development)
- Basic understanding of machine learning concepts

### 🔧 **Running the Research Notebooks**

#### 📸 **Computer Vision Research**

```bash
# Google Colab (Recommended)
1. Open image-recognition-engine/notebook.ipynb in Colab
2. Mount Google Drive: from google.colab import drive; drive.mount('/content/drive')
3. Install dependencies: !pip install tensorflowjs
4. Run all cells sequentially
5. Download generated models (.h5, SavedModel, TensorFlow.js)

# Local Jupyter
git clone https://github.com/Hidayattt24/PURRPAL.git
cd PURRPAL/ml-research/image-recognition-engine
pip install tensorflow opencv-python matplotlib seaborn tensorflowjs
jupyter notebook notebook.ipynb
```

#### 📊 **Tabular Analytics Research**

```bash
# Google Colab
1. Upload cleaned_animal_disease_prediction.csv to Colab
2. Open tabular-analytics-engine/symptoms-purrpal.ipynb
3. Run complete pipeline from data loading to model export
4. Download .joblib artifacts for production deployment

# Local Development
cd PURRPAL/ml-research/tabular-analytics-engine
pip install pandas numpy scikit-learn matplotlib seaborn joblib imbalanced-learn
jupyter notebook symptoms-purrpal.ipynb
```

### 🛠️ **Key Dependencies**

```python
# Computer Vision Stack
tensorflow>=2.10.0
opencv-python>=4.5.0
tensorflowjs>=3.18.0
matplotlib>=3.4.0
seaborn>=0.11.0

# Tabular Analytics Stack
scikit-learn>=1.0.0
imbalanced-learn>=0.8.0  # For SMOTE
pandas>=1.3.0
numpy>=1.21.0
joblib>=1.0.0
```

---

## 🔍 **Research Insights & Findings**

### 🎯 **Computer Vision Discoveries**

- **✅ Multi-Task Effectiveness**: Combined object detection + classification improves clinical utility
- **📱 Mobile Optimization**: 128x128 input provides excellent speed-accuracy balance
- **🎯 Transfer Learning Success**: MobileNetV2 backbone captures dermatological patterns effectively
- **🔄 Data Augmentation Impact**: Robust performance across various lighting conditions
- **⚡ Real-time Capability**: ~47ms inference suitable for mobile applications

### 📊 **Tabular Analytics Discoveries**

- **🌡️ Temperature Dominance**: Body temperature emerges as strongest predictor
- **🍽️ Behavioral Indicators**: Appetite loss and lethargy highly informative for diagnosis
- **⏰ Duration Significance**: Symptom duration provides crucial prognostic insights
- **🔄 Symptom Synergy**: Model successfully identifies disease-specific symptom patterns
- **🏥 Clinical Alignment**: Feature importance aligns with veterinary medical knowledge

---

## 🎯 **Model Deployment Integration**

### 🔄 **Production Pipeline**

```python
# Research → Development → Production Flow
Research Artifacts → ML Services → Backend API → Frontend Application

Computer Vision:
├── cat_disease.h5 → vision-service/models/cat_disease.h5
├── class_map.json → vision-service/models/class_map.json
└── Ready for FastAPI deployment

Tabular Analytics:
├── purrpal_symptoms_rf_model.joblib → tabular-services/models/
├── purrpal_symptoms_rf_preprocessor.joblib → tabular-services/models/
├── purrpal_symptoms_rf_class_names.joblib → tabular-services/models/
└── Ready for FastAPI deployment
```

### 🧪 **Model Validation**

Both models include comprehensive evaluation and inference simulation to ensure production readiness and clinical validity.

---

## 🔮 **Future Research Directions**

### 🚀 **Short-term Goals (6-12 months)**

- [ ] **Multi-Modal Fusion**: Combine computer vision + tabular predictions
- [ ] **Model Compression**: TensorFlow Lite optimization for mobile deployment
- [ ] **Active Learning**: Continuous improvement with veterinary feedback
- [ ] **Explainable AI**: Enhanced interpretability for clinical decision support

### 🌟 **Long-term Vision (1-3 years)**

- [ ] **Federated Learning**: Multi-clinic collaborative model training
- [ ] **Real-time Monitoring**: Continuous health tracking capabilities
- [ ] **Genomic Integration**: Breed-specific disease prediction models
- [ ] **Global Deployment**: Multi-language and cross-cultural adaptation

---

## 🤝 **Research Collaboration**

### 🏛️ **Academic Partnerships**
- **DBS Foundation**: Primary research sponsor
- **Local Veterinary Clinics**: Data collection and validation
- **University Collaborations**: Research methodology and publication

### 🌐 **Open Science Commitment**
- **Open Source Models**: Apache 2.0 and MIT licenses
- **Research Reproducibility**: Complete notebook documentation
- **Community Contribution**: Public datasets and benchmarks
- **Knowledge Sharing**: Research publications and conferences

---

## 📞 **Research Contact & Support**

### 🆘 **Getting Help**
- **📧 Email**: <a href="mailto:support@purrpal.id">support@purrpal.id</a>
- **🐙 GitHub Issues**: [Create Issue](https://github.com/Hidayattt24/PURRPAL/issues)
- **💬 Discord**: [Join Community](https://discord.gg/e9PnwwNKRC)
- **📱 WhatsApp**: +62-853-3857-3726

### 📚 **Research Resources**
- **📖 Documentation**: Complete notebook walkthroughs

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](https://choosealicense.com/licenses/mit/) here

---

## 🙏 **Acknowledgments**

- **🏛️ DBS Foundation**: Coding Camp program sponsor and research funding
- **🩺 Veterinary Partners**: Clinical expertise and data validation
- **☁️ Google Colab**: Free GPU access for research development
- **🌐 Open Source Community**: TensorFlow, Scikit-learn, and supporting libraries
- **🐱 Cat Parents**: Data contribution and real-world validation

---

<div align="center">
  
  ### 🔬 **Advancing Veterinary AI Through Open Science** 🐾
  
  **PurrPal Research Team** | 2024
  
  [![Research Status](https://img.shields.io/badge/Research-Active-brightgreen)](https://github.com/Hidayattt24/PURRPAL)
  [![Models](https://img.shields.io/badge/Models-Production%20Ready-blue)](https://github.com/Hidayattt24/PURRPAL/tree/main/ml-services)
  [![Notebooks](https://img.shields.io/badge/Notebooks-Reproducible-orange)](https://github.com/Hidayattt24/PURRPAL/tree/main/ml-research)
  [![Open Science](https://img.shields.io/badge/Open%20Science-MIT%20License-yellow)](LICENSE)

</div>