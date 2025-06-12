const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Environment validation schema
const ENV_SCHEMA = {
  GOOGLE_CLOUD_PROJECT: { required: true, type: 'string' },
  GOOGLE_CLOUD_LOCATION: { required: false, type: 'string', default: 'us-central1' },
  VERTEX_AI_MODEL: { required: false, type: 'string', default: 'gemini-2.0-flash-001' },
  SERVICE_ACCOUNT_KEY_PATH: { required: false, type: 'string', default: './service-account-key.json' },
  CHATBOT_MAX_TOKENS: { required: false, type: 'number', default: 8192 },
  CHATBOT_TEMPERATURE: { required: false, type: 'number', default: 0.7 },
  CHATBOT_TOP_P: { required: false, type: 'number', default: 0.95 },
  CHATBOT_TOP_K: { required: false, type: 'number', default: 40 },
  ENABLE_CACHING: { required: false, type: 'boolean', default: true },
  CACHE_TTL_MINUTES: { required: false, type: 'number', default: 30 },
  RATE_LIMIT_REQUESTS: { required: false, type: 'number', default: 100 },
  RATE_LIMIT_WINDOW_MINUTES: { required: false, type: 'number', default: 15 },
  LOG_LEVEL: { required: false, type: 'string', default: 'info' },
  MAX_INPUT_LENGTH: { required: false, type: 'number', default: 2000 },
  ENABLE_METRICS: { required: false, type: 'boolean', default: true }
};

/**
 * Validate and parse environment variables
 */
function validateAndParseEnv() {
  const config = {};
  const errors = [];

  for (const [key, schema] of Object.entries(ENV_SCHEMA)) {
    const value = process.env[key];

    // Check required fields
    if (schema.required && !value) {
      errors.push(`Missing required environment variable: ${key}`);
      continue;
    }

    // Use default if not provided
    const finalValue = value || schema.default;

    // Type conversion and validation
    try {
      switch (schema.type) {
        case 'string':
          config[key] = String(finalValue);
          break;
        case 'number':
          const numValue = Number(finalValue);
          if (isNaN(numValue)) {
            errors.push(`Invalid number for ${key}: ${finalValue}`);
          } else {
            config[key] = numValue;
          }
          break;
        case 'boolean':
          config[key] = String(finalValue).toLowerCase() === 'true';
          break;
        default:
          config[key] = finalValue;
      }
    } catch (error) {
      errors.push(`Error parsing ${key}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }

  return config;
}

/**
 * Validate service account key file
 */
function validateServiceAccountKey(keyPath) {
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Service account key file not found: ${keyPath}`);
  }

  try {
    const keyContent = fs.readFileSync(keyPath, 'utf8');
    const keyData = JSON.parse(keyContent);
    
    // Validate required fields in service account key
    const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email'];
    const missingFields = requiredFields.filter(field => !keyData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Invalid service account key. Missing fields: ${missingFields.join(', ')}`);
    }

    return keyData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in service account key file: ${keyPath}`);
    }
    throw error;
  }
}

/**
 * Validate configuration values
 */
function validateConfigValues(env) {
  const validations = [
    {
      condition: env.CHATBOT_TEMPERATURE < 0 || env.CHATBOT_TEMPERATURE > 1,
      message: 'CHATBOT_TEMPERATURE must be between 0 and 1'
    },
    {
      condition: env.CHATBOT_TOP_P < 0 || env.CHATBOT_TOP_P > 1,
      message: 'CHATBOT_TOP_P must be between 0 and 1'
    },
    {
      condition: env.CHATBOT_TOP_K < 1 || env.CHATBOT_TOP_K > 100,
      message: 'CHATBOT_TOP_K must be between 1 and 100'
    },
    {
      condition: env.CHATBOT_MAX_TOKENS < 1 || env.CHATBOT_MAX_TOKENS > 32768,
      message: 'CHATBOT_MAX_TOKENS must be between 1 and 32768'
    },
    {
      condition: env.MAX_INPUT_LENGTH < 1 || env.MAX_INPUT_LENGTH > 10000,
      message: 'MAX_INPUT_LENGTH must be between 1 and 10000'
    },
    {
      condition: env.CACHE_TTL_MINUTES < 1 || env.CACHE_TTL_MINUTES > 1440,
      message: 'CACHE_TTL_MINUTES must be between 1 and 1440 (24 hours)'
    },
    {
      condition: env.RATE_LIMIT_REQUESTS < 1 || env.RATE_LIMIT_REQUESTS > 10000,
      message: 'RATE_LIMIT_REQUESTS must be between 1 and 10000'
    }
  ];

  const errors = validations
    .filter(validation => validation.condition)
    .map(validation => validation.message);

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Validate and build configuration
let envConfig;
try {
  envConfig = validateAndParseEnv();
  validateConfigValues(envConfig);
  
  // Validate service account key
  const serviceAccountData = validateServiceAccountKey(envConfig.SERVICE_ACCOUNT_KEY_PATH);
  
  console.log('✓ Configuration validation successful');
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}

// Build final configuration object
const config = {
  googleCloud: {
    projectId: envConfig.GOOGLE_CLOUD_PROJECT,
    location: envConfig.GOOGLE_CLOUD_LOCATION,
    model: envConfig.VERTEX_AI_MODEL,
    keyFilename: envConfig.SERVICE_ACCOUNT_KEY_PATH
  },
  chatbot: {
    maxTokens: envConfig.CHATBOT_MAX_TOKENS,
    temperature: envConfig.CHATBOT_TEMPERATURE,
    topP: envConfig.CHATBOT_TOP_P,
    topK: envConfig.CHATBOT_TOP_K
  },
  cache: {
    enabled: envConfig.ENABLE_CACHING,
    ttlMinutes: envConfig.CACHE_TTL_MINUTES
  },
  rateLimit: {
    requests: envConfig.RATE_LIMIT_REQUESTS,
    windowMinutes: envConfig.RATE_LIMIT_WINDOW_MINUTES
  },
  security: {
    maxInputLength: envConfig.MAX_INPUT_LENGTH,
    enableSanitization: true,
    blockSuspiciousContent: true
  },
  logging: {
    level: envConfig.LOG_LEVEL,
    enableMetrics: envConfig.ENABLE_METRICS
  },
  // Cat care specific configuration
  catCare: {
    emergencyKeywords: [
      'tidak bernapas', 'kejang', 'pingsan', 'darah', 'keracunan', 
      'tidak sadar', 'muntah darah', 'diare berdarah', 'lemas sekali',
      'emergency', 'urgent', 'gawat darurat'
    ],
    seriousSymptoms: [
      'tidak mau makan', 'tidak minum', 'demam tinggi', 'sesak napas',
      'muntah terus', 'diare parah', 'bengkak', 'luka parah'
    ],
    maxConsultationLength: 5000,
    responseTimeout: 30000, // 30 seconds
    defaultLanguage: 'id'
  }
};

// Log configuration (without sensitive data)
console.log('🐱 PurrPal Configuration loaded:', {
  projectId: config.googleCloud.projectId,
  location: config.googleCloud.location,
  model: config.googleCloud.model,
  keyFileExists: fs.existsSync(config.googleCloud.keyFilename),
  cacheEnabled: config.cache.enabled,
  rateLimitEnabled: config.rateLimit.requests > 0,
  environment: process.env.NODE_ENV || 'development'
});

module.exports = config;