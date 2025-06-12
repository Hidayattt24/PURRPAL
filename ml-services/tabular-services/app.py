from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import logging
import os
from model_handler import PurrPalTabularModel

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="PurrPal Tabular ML Service",
    description="Machine Learning API for cat disease prediction based on symptoms",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
model_handler: Optional[PurrPalTabularModel] = None

# Pydantic models for request/response
class CatInfo(BaseModel):
    name: str = Field(..., description="Cat's name")
    age: str = Field(..., description="Cat's age (e.g., '2 tahun')")
    gender: str = Field(..., description="Cat's gender ('male' or 'female')")
    weight: Optional[float] = Field(4.0, description="Cat's weight in kg")
    body_temperature: Optional[float] = Field(38.5, description="Body temperature in Celsius")
    duration_days: Optional[int] = Field(3, description="Duration of symptoms in days")
    heart_rate: Optional[int] = Field(120, description="Heart rate in BPM")

class QuestionnaireData(BaseModel):
    # Primary symptoms
    cough: Optional[bool] = Field(False, description="Does the cat have a cough?")
    breathingDifficulty: Optional[bool] = Field(False, description="Breathing difficulties?")
    fever: Optional[bool] = Field(False, description="Does the cat have fever?")
    discomfort: Optional[bool] = Field(False, description="Does the cat appear uncomfortable?")
    appetiteLoss: Optional[bool] = Field(False, description="Loss of appetite?")
    weightLoss: Optional[bool] = Field(False, description="Weight loss?")
    vomiting: Optional[bool] = Field(False, description="Vomiting?")
    diarrhea: Optional[bool] = Field(False, description="Diarrhea?")
    
    # Secondary symptoms
    coughDuration: Optional[bool] = Field(False, description="Cough lasting > 3 weeks?")
    phlegmGreen: Optional[bool] = Field(False, description="Green thick phlegm?")
    phlegmBlood: Optional[bool] = Field(False, description="Blood in phlegm?")
    nightSweats: Optional[bool] = Field(False, description="Night sweats?")
    yellowPhlegm: Optional[bool] = Field(False, description="Yellow watery phlegm?")
    breathingSound: Optional[bool] = Field(False, description="Wheezing or high-pitched breathing?")
    
    # Physical symptoms
    skinLesions: Optional[bool] = Field(False, description="Skin lesions?")
    nasalDischarge: Optional[bool] = Field(False, description="Nasal discharge?")
    eyeDischarge: Optional[bool] = Field(False, description="Eye discharge?")

class PredictionRequest(BaseModel):
    cat_info: CatInfo
    questionnaire: QuestionnaireData

class PredictionResponse(BaseModel):
    success: bool
    predicted_disease: str
    confidence: float
    diagnosis: str
    recommendations: str
    accuracy: str
    cat_info: Dict[str, Any]
    active_symptoms: list
    all_probabilities: Dict[str, float]

class HealthResponse(BaseModel):
    status: str
    model_info: Dict[str, Any]
    service_name: str
    version: str

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    global model_handler
    try:
        logger.info("Loading PurrPal Tabular Model...")
        model_handler = PurrPalTabularModel()
        logger.info("Model loaded successfully!")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    global model_handler
    
    if model_handler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    model_info = model_handler.get_health_info()
    
    return HealthResponse(
        status="healthy" if model_info["model_loaded"] else "unhealthy",
        model_info=model_info,
        service_name="PurrPal Tabular ML Service",
        version="1.0.0"
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "PurrPal Tabular ML Service",
        "version": "1.0.0",
        "description": "Machine Learning API for cat disease prediction based on symptoms",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "docs": "/docs"
        }
    }

# Prediction endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict_disease(request: PredictionRequest):
    """
    Predict cat disease based on symptoms and cat information
    
    Args:
        request: PredictionRequest containing cat info and questionnaire data
        
    Returns:
        PredictionResponse with prediction results
    """
    global model_handler
    
    if model_handler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Extract age as number from string (e.g., "2 tahun" -> 2)
        age_str = request.cat_info.age
        try:
            age_num = float(''.join(filter(str.isdigit, age_str.split()[0])))
        except:
            age_num = 2.0  # Default age
        
        # Prepare cat data
        cat_data = {
            "name": request.cat_info.name,
            "age": age_num,
            "gender": request.cat_info.gender,
            "weight": request.cat_info.weight,
            "body_temperature": request.cat_info.body_temperature,
            "duration_days": request.cat_info.duration_days,
            "heart_rate": request.cat_info.heart_rate
        }
        
        # Convert questionnaire to dict
        questionnaire_data = request.questionnaire.model_dump()
        
        # Make prediction
        result = model_handler.predict(cat_data, questionnaire_data)
        
        # Generate human-readable diagnosis and recommendations
        diagnosis, recommendations = _generate_diagnosis_text(
            result["predicted_disease"], 
            result["confidence"],
            result["feature_summary"]
        )
        
        return PredictionResponse(
            success=True,
            predicted_disease=result["predicted_disease"],
            confidence=result["confidence"],
            diagnosis=diagnosis,
            recommendations=recommendations,
            accuracy=f"{result['confidence']:.1f}",
            cat_info=cat_data,
            active_symptoms=result["feature_summary"],
            all_probabilities=result["all_probabilities"]
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

def _generate_diagnosis_text(disease: str, confidence: float, symptoms: list) -> tuple:
    """
    Generate human-readable diagnosis and recommendations
    
    Args:
        disease: Predicted disease name
        confidence: Prediction confidence (0-100)
        symptoms: List of active symptoms
        
    Returns:
        Tuple of (diagnosis_text, recommendations_text)
    """
    
    # Disease information mapping
    disease_info = {
        "Feline Calicivirus": {
            "name": "Feline Calicivirus (FCV)",
            "description": "Infeksi virus yang menyebabkan masalah pernapasan dan mulut",
            "recommendations": [
                "Berikan makanan yang mudah dicerna dan lembut",
                "Pastikan kucing tetap terhidrasi dengan baik",
                "Isolasi dari kucing lain untuk mencegah penyebaran",
                "Konsultasi dengan dokter hewan untuk pengobatan antiviral",
                "Jaga kebersihan area mata dan hidung"
            ]
        },
        "Feline Herpesvirus": {
            "name": "Feline Herpesvirus (FHV-1)",
            "description": "Infeksi virus yang menyebabkan masalah pernapasan atas",
            "recommendations": [
                "Gunakan humidifier untuk mempermudah pernapasan",
                "Bersihkan mata dan hidung secara teratur",
                "Berikan makanan yang mengandung L-lysine",
                "Isolasi dari kucing lain",
                "Konsultasi dokter hewan untuk pengobatan supportif"
            ]
        },
        "Feline Infectious Peritonitis": {
            "name": "Feline Infectious Peritonitis (FIP)",
            "description": "Penyakit serius yang disebabkan oleh coronavirus",
            "recommendations": [
                "SEGERA bawa ke dokter hewan - ini kondisi darurat",
                "Berikan nutrisi yang baik dan suplemen",
                "Jaga kucing tetap hangat dan nyaman",
                "Monitor kondisi dengan ketat",
                "Diskusikan pilihan pengobatan dengan dokter hewan"
            ]
        },
        "Feline Leukemia Virus": {
            "name": "Feline Leukemia Virus (FeLV)",
            "description": "Virus yang menyerang sistem kekebalan tubuh",
            "recommendations": [
                "Tes darah untuk konfirmasi diagnosis",
                "Isolasi dari kucing lain",
                "Berikan makanan berkualitas tinggi",
                "Pantau kesehatan secara rutin",
                "Diskusikan rencana perawatan jangka panjang dengan dokter hewan"
            ]
        },
        "Feline Panleukopenia": {
            "name": "Feline Panleukopenia (Distemper Kucing)",
            "description": "Infeksi virus yang sangat menular dan berbahaya",
            "recommendations": [
                "SEGERA bawa ke dokter hewan - kondisi darurat",
                "Berikan cairan untuk mencegah dehidrasi",
                "Isolasi total dari kucing lain",
                "Desinfeksi area yang terkontaminasi",
                "Monitor kondisi dengan sangat ketat"
            ]
        },
        "Upper Respiratory Infection": {
            "name": "Infeksi Saluran Pernapasan Atas",
            "description": "Infeksi yang mempengaruhi hidung, tenggorokan, dan sinus",
            "recommendations": [
                "Pastikan kucing tetap hangat dan nyaman",
                "Gunakan humidifier atau steam therapy",
                "Bersihkan mata dan hidung secara teratur",
                "Berikan makanan yang mudah dicium aromanya",
                "Konsultasi dokter hewan jika gejala memburuk"
            ]
        }
    }
    
    # Get disease info
    disease_data = disease_info.get(disease, {
        "name": disease,
        "description": "Kondisi kesehatan yang memerlukan perhatian",
        "recommendations": ["Konsultasi dengan dokter hewan untuk diagnosis dan pengobatan yang tepat"]
    })
    
    # Generate diagnosis text
    confidence_level = "tinggi" if confidence >= 80 else "sedang" if confidence >= 60 else "rendah"
    
    diagnosis = f"""
    Berdasarkan analisis gejala yang diberikan, kucing Anda kemungkinan mengalami <strong>{disease_data['name']}</strong>.
    
    <br><br><strong>Deskripsi:</strong><br>
    {disease_data['description']}
    
    <br><br><strong>Gejala yang terdeteksi:</strong><br>
    {', '.join(symptoms) if symptoms else 'Gejala umum yang tidak spesifik'}
    
    <br><br><strong>Tingkat Keyakinan:</strong> {confidence:.1f}% ({confidence_level})
    """
    
    # Generate recommendations
    recommendations = "<br>".join([f"• {rec}" for rec in disease_data['recommendations']])
    
    # Add general disclaimer
    recommendations += f"""
    
    <br><br><strong>⚠️ Penting:</strong><br>
    • Hasil ini adalah prediksi AI dan bukan diagnosis medis resmi<br>
    • Segera konsultasi dengan dokter hewan untuk pemeriksaan lebih lanjut<br>
    • Jangan tunda jika gejala memburuk atau kucing terlihat sangat lemah
    """
    
    return diagnosis.strip(), recommendations.strip()

# Error handlers
from fastapi.responses import JSONResponse

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "detail": "Please check the API documentation at /docs"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": "Something went wrong. Please try again later."}
    )

if __name__ == "__main__":
    import uvicorn
    import os
    
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(
        "app:app",
        host="0.0.0.0", 
        port=port,
        log_level="info"
    )
