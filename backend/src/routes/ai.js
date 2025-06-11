const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// ML Service Configuration
const ML_TABULAR_SERVICE_URL = process.env.ML_TABULAR_SERVICE_URL || 'http://localhost:8001';

/**
 * @route   POST /api/ai/predict-symptoms
 * @desc    Predict cat disease based on symptoms questionnaire
 * @access  Protected
 */
router.post('/predict-symptoms', auth, async (req, res) => {
  try {
    const { cat_info, questionnaire } = req.body;
    
    // Validate input
    if (!cat_info || !questionnaire) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: cat_info and questionnaire'
      });
    }
    
    // Validate cat_info required fields
    const requiredCatFields = ['name', 'age', 'gender'];
    for (const field of requiredCatFields) {
      if (!cat_info[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required cat_info field: ${field}`
        });
      }
    }
    
    console.log('Making prediction request to ML service...');
    console.log('Cat info:', cat_info);
    console.log('Questionnaire keys:', Object.keys(questionnaire));
    
    // Call ML service
    const mlResponse = await fetch(`${ML_TABULAR_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cat_info,
        questionnaire
      })
    });
    
    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error('ML service error:', errorText);
      throw new Error(`ML service responded with status ${mlResponse.status}: ${errorText}`);
    }
    
    const prediction = await mlResponse.json();
    
    console.log('Prediction received:', {
      disease: prediction.predicted_disease,
      confidence: prediction.confidence
    });
    
    // Return formatted response for frontend
    res.json({
      success: true,
      data: {
        predicted_disease: prediction.predicted_disease,
        confidence: prediction.confidence,
        diagnosis: prediction.diagnosis,
        recommendations: prediction.recommendations,
        accuracy: prediction.accuracy,
        cat_info: prediction.cat_info,
        active_symptoms: prediction.active_symptoms,
        all_probabilities: prediction.all_probabilities
      }
    });
    
  } catch (error) {
    console.error('Error in predict-symptoms:', error);
    
    // Check if it's a network error (ML service not available)
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch')) {
      return res.status(503).json({
        success: false,
        error: 'ML service is currently unavailable. Please try again later.',
        details: 'The machine learning service is not responding. This might be a temporary issue.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to process prediction request',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/ai/health
 * @desc    Check AI services health status
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const services = {
      tabular_service: {
        url: ML_TABULAR_SERVICE_URL,
        status: 'unknown',
        details: null
      }
    };
    
    // Check tabular service health
    try {
      const healthResponse = await fetch(`${ML_TABULAR_SERVICE_URL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        services.tabular_service.status = 'healthy';
        services.tabular_service.details = healthData;
      } else {
        services.tabular_service.status = 'unhealthy';
      }
    } catch (error) {
      services.tabular_service.status = 'offline';
      services.tabular_service.error = error.message;
    }
    
    // Determine overall status
    const allHealthy = Object.values(services).every(service => service.status === 'healthy');
    const anyOnline = Object.values(services).some(service => service.status !== 'offline');
    
    res.json({
      success: true,
      overall_status: allHealthy ? 'healthy' : anyOnline ? 'degraded' : 'offline',
      services,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error checking AI health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check AI services health',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/ai/detect-image
 * @desc    AI image detection (placeholder for future computer vision service)
 * @access  Protected
 */
router.post('/detect-image', auth, async (req, res) => {
  // This is the existing placeholder endpoint
  // Will be updated when computer vision service is ready
  res.json({ 
    success: true,
    status: 'placeholder',
    message: 'Computer vision service - coming soon',
    data: {
      diagnosis: 'Kucing Anda terlihat sehat (placeholder)',
      recommendations: 'Lanjutkan perawatan rutin (placeholder)',
      accuracy: '85'
    }
  });
});

/**
 * @route   GET /api/ai/info
 * @desc    Get information about available AI services
 * @access  Public
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    services: {
      tabular_prediction: {
        name: 'Symptoms-based Disease Prediction',
        description: 'Predicts cat diseases based on observed symptoms and cat information',
        endpoint: '/api/ai/predict-symptoms',
        method: 'POST',
        status: 'available',
        input_format: {
          cat_info: {
            name: 'string (required)',
            age: 'string (required, e.g., "2 tahun")',
            gender: 'string (required, "male" or "female")',
            weight: 'number (optional, default: 4.0)',
            body_temperature: 'number (optional, default: 38.5)',
            duration_days: 'number (optional, default: 3)',
            heart_rate: 'number (optional, default: 120)'
          },
          questionnaire: {
            cough: 'boolean',
            breathingDifficulty: 'boolean',
            fever: 'boolean',
            discomfort: 'boolean',
            appetiteLoss: 'boolean',
            weightLoss: 'boolean',
            vomiting: 'boolean',
            diarrhea: 'boolean',
            // ... other questionnaire fields
          }
        }
      },
      image_detection: {
        name: 'Image-based Detection',
        description: 'Analyzes cat images for breed and health assessment',
        endpoint: '/api/ai/detect-image',
        method: 'POST',
        status: 'coming_soon'
      }
    },
    health_check: '/api/ai/health'
  });
});

module.exports = router;