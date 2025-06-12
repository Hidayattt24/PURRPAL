const crypto = require('crypto');
const winston = require('winston');
const config = require('./config');

// Configure logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
  ),
  defaultMeta: { service: 'purrpal-chatbot' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// In-memory cache (for production, consider Redis)
const cache = new Map();
const cacheTimestamps = new Map();

// Rate limiting store
const rateLimitStore = new Map();

/**
 * Input validation and sanitization
 */
class InputValidator {
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      logger.warn('Invalid input type received', { inputType: typeof input });
      return '';
    }

    if (input.length > config.security.maxInputLength) {
      logger.warn('Input length exceeded maximum', { 
        length: input.length, 
        maxLength: config.security.maxInputLength 
      });
      input = input.substring(0, config.security.maxInputLength);
    }

    // Remove potentially harmful characters but preserve Indonesian characters
    const sanitized = input
      .trim()
      .replace(/[<>\"'%;()&+]/g, '') // Remove potential XSS characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters

    return sanitized;
  }

  static validateInput(input) {
    const errors = [];

    if (!input || typeof input !== 'string') {
      errors.push('Input harus berupa teks');
    }

    if (input && input.length < 3) {
      errors.push('Pertanyaan terlalu pendek, minimal 3 karakter');
    }

    if (input && input.length > config.security.maxInputLength) {
      errors.push(`Pertanyaan terlalu panjang, maksimal ${config.security.maxInputLength} karakter`);
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /vbscript/i,
      /onload/i,
      /onerror/i,
      /alert\(/i,
      /document\./i,
      /window\./i
    ];

    if (config.security.blockSuspiciousContent) {
      const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(input));
      if (hasSuspiciousContent) {
        errors.push('Input mengandung konten yang tidak diizinkan');
        logger.warn('Suspicious content detected', { input: input.substring(0, 100) });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedInput: errors.length === 0 ? this.sanitizeInput(input) : null
    };
  }
}

/**
 * Enhanced prompt engineering for cat care
 */
class PromptManager {
  static createCatCarePrompt(userMessage) {
    const emergencyKeywords = config.catCare.emergencyKeywords;
    const seriousSymptoms = config.catCare.seriousSymptoms;
    
    const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    const hasSeriousSymptom = seriousSymptoms.some(symptom => 
      userMessage.toLowerCase().includes(symptom)
    );

    let urgencyLevel = 'normal';
    if (hasEmergencyKeyword) urgencyLevel = 'emergency';
    else if (hasSeriousSymptom) urgencyLevel = 'serious';

    const baseContext = `
Kamu adalah PurrPal AI, asisten virtual ahli perawatan kucing di Indonesia yang sangat berpengalaman dan empati. 

IDENTITAS & KEPRIBADIAN:
- Nama: PurrPal AI
- Kepribadian: Ramah, peduli, profesional, mudah dipahami
- Bahasa: Bahasa Indonesia yang natural dan mudah dimengerti
- Target: Pemilik kucing di seluruh Indonesia, termasuk daerah terpencil

KEAHLIAN UTAMA:
- Kesehatan dan penyakit kucing
- Nutrisi dan pola makan kucing
- Perilaku dan psikologi kucing  
- Perawatan harian kucing
- Tips pencegahan penyakit
- Pertolongan pertama untuk kucing
- Rekomendasi kapan harus ke dokter hewan

PANDUAN RESPONS:
1. Selalu awali dengan sapaan hangat dan empati
2. Berikan informasi yang akurat dan mudah dipahami
3. Gunakan analogi sederhana jika perlu
4. Selalu prioritaskan keselamatan kucing
5. Jika kondisi serius/darurat, WAJIB sarankan dokter hewan segera
6. Berikan tips praktis yang bisa dilakukan di rumah
7. Akhiri dengan dorongan positif dan tawaran bantuan lanjutan`;

    let urgencyInstruction = '';
    
    if (urgencyLevel === 'emergency') {
      urgencyInstruction = `
⚠️ DARURAT TERDETEKSI ⚠️
Kondisi ini membutuhkan perhatian medis SEGERA. 
- WAJIB sarankan ke dokter hewan/klinik hewan terdekat SEGERA
- Berikan pertolongan pertama yang aman jika ada
- Tekankan urgensi situasi
- Berikan nomor darurat jika memungkinkan`;
    } else if (urgencyLevel === 'serious') {
      urgencyInstruction = `
⚠️ KONDISI SERIUS
Gejala ini perlu perhatian medis profesional.
- Sarankan konsultasi dokter hewan dalam 24-48 jam
- Berikan tips sementara yang aman
- Jelaskan tanda-tanda jika kondisi memburuk`;
    }

    const prompt = `${baseContext}

${urgencyInstruction}

PERTANYAAN PENGGUNA: "${userMessage}"

Berikan respons yang:
- Menunjukkan empati dan pemahaman
- Memberikan informasi yang akurat dan praktis
- Mudah dipahami oleh pemilik kucing awam
- Mencakup langkah-langkah konkret jika ada
- Menyarankan kapan harus ke dokter hewan
- Menggunakan emoticon yang sesuai untuk membuat respons lebih hangat

Respons Anda:`;

    logger.info('Prompt generated', { 
      urgencyLevel, 
      hasEmergencyKeyword, 
      hasSeriousSymptom,
      messageLength: userMessage.length 
    });

    return prompt;
  }

  static createFollowUpPrompt(previousContext, newMessage) {
    return `
Ini adalah lanjutan percakapan tentang perawatan kucing.

KONTEKS SEBELUMNYA: ${previousContext}

PERTANYAAN LANJUTAN: "${newMessage}"

Berikan respons yang konsisten dengan konteks sebelumnya dan tetap fokus pada kesejahteraan kucing:`;
  }
}

/**
 * Caching utility
 */
class CacheManager {
  static generateCacheKey(input) {
    // Create consistent cache key from user input
    const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
    return crypto.createHash('md5').update(normalized).digest('hex');
  }

  static get(key) {
    if (!config.cache.enabled) return null;

    const timestamp = cacheTimestamps.get(key);
    if (!timestamp) return null;

    const now = Date.now();
    const ttlMs = config.cache.ttlMinutes * 60 * 1000;
    
    if (now - timestamp > ttlMs) {
      // Cache expired
      cache.delete(key);
      cacheTimestamps.delete(key);
      logger.debug('Cache entry expired', { key });
      return null;
    }

    const cachedValue = cache.get(key);
    if (cachedValue) {
      logger.debug('Cache hit', { key });
      return cachedValue;
    }

    return null;
  }

  static set(key, value) {
    if (!config.cache.enabled) return;

    cache.set(key, value);
    cacheTimestamps.set(key, Date.now());
    
    logger.debug('Cache set', { key, valueLength: JSON.stringify(value).length });

    // Simple cache size management
    if (cache.size > 1000) {
      this.cleanup();
    }
  }

  static cleanup() {
    const now = Date.now();
    const ttlMs = config.cache.ttlMinutes * 60 * 1000;
    let deletedCount = 0;

    for (const [key, timestamp] of cacheTimestamps.entries()) {
      if (now - timestamp > ttlMs) {
        cache.delete(key);
        cacheTimestamps.delete(key);
        deletedCount++;
      }
    }

    logger.info('Cache cleanup completed', { deletedCount, remainingSize: cache.size });
  }

  static clear() {
    cache.clear();
    cacheTimestamps.clear();
    logger.info('Cache cleared');
  }
}

/**
 * Rate limiting utility
 */
class RateLimiter {
  static checkRateLimit(identifier) {
    const now = Date.now();
    const windowMs = config.rateLimit.windowMinutes * 60 * 1000;
    const maxRequests = config.rateLimit.requests;

    if (!rateLimitStore.has(identifier)) {
      rateLimitStore.set(identifier, []);
    }

    const requests = rateLimitStore.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    rateLimitStore.set(identifier, validRequests);

    if (validRequests.length >= maxRequests) {
      logger.warn('Rate limit exceeded', { 
        identifier, 
        requests: validRequests.length, 
        maxRequests 
      });
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(validRequests[0] + windowMs)
      };
    }

    // Add current request
    validRequests.push(now);
    rateLimitStore.set(identifier, validRequests);

    return {
      allowed: true,
      remaining: maxRequests - validRequests.length,
      resetTime: new Date(now + windowMs)
    };
  }
}

/**
 * Response formatting with enhanced features
 */
class ResponseFormatter {
  static formatResponse(response, metadata = {}) {
    const baseResponse = {
      success: true,
      message: response.trim(),
      timestamp: new Date().toISOString(),
      source: 'purrpal-ai'
    };

    // Add metadata if provided
    if (metadata.urgencyLevel) {
      baseResponse.urgencyLevel = metadata.urgencyLevel;
    }

    if (metadata.cached) {
      baseResponse.cached = true;
    }

    if (metadata.responseTime) {
      baseResponse.responseTimeMs = metadata.responseTime;
    }

    // Add suggestions for serious conditions
    if (metadata.urgencyLevel === 'emergency') {
      baseResponse.recommendations = [
        'Segera bawa kucing ke dokter hewan terdekat',
        'Jangan tunda penanganan medis',
        'Hubungi klinik hewan untuk konsultasi darurat'
      ];
    } else if (metadata.urgencyLevel === 'serious') {
      baseResponse.recommendations = [
        'Konsultasikan dengan dokter hewan dalam 24-48 jam',
        'Monitor kondisi kucing secara berkala',
        'Catat perubahan gejala untuk dilaporkan ke dokter'
      ];
    }

    return baseResponse;
  }

  static createErrorResponse(error, context = {}) {
    const errorId = crypto.randomUUID();
    
    logger.error('Error occurred', { 
      errorId, 
      error: error.message, 
      stack: error.stack,
      context 
    });

    return {
      success: false,
      message: 'Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat atau hubungi dokter hewan jika ini adalah kondisi darurat.',
      errorId,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Coba ulangi pertanyaan Anda',
        'Periksa koneksi internet Anda',
        'Jika darurat, segera hubungi dokter hewan terdekat'
      ]
    };
  }
}

/**
 * Metrics and monitoring
 */
class MetricsCollector {
  static metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    emergencyDetections: 0,
    seriousConditionDetections: 0
  };

  static recordRequest(success = true, responseTime = 0, cached = false, urgencyLevel = 'normal') {
    if (!config.logging.enableMetrics) return;

    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    if (cached) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }

    // Update average response time
    const currentAvg = this.metrics.averageResponseTime;
    const totalSuccessful = this.metrics.successfulRequests;
    this.metrics.averageResponseTime = ((currentAvg * (totalSuccessful - 1)) + responseTime) / totalSuccessful;

    if (urgencyLevel === 'emergency') {
      this.metrics.emergencyDetections++;
    } else if (urgencyLevel === 'serious') {
      this.metrics.seriousConditionDetections++;
    }

    // Log metrics every 100 requests
    if (this.metrics.totalRequests % 100 === 0) {
      logger.info('Metrics update', this.metrics);
    }
  }

  static getMetrics() {
    return { ...this.metrics };
  }

  static resetMetrics() {
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = 0;
    });
    logger.info('Metrics reset');
  }
}

module.exports = {
  InputValidator,
  PromptManager,
  CacheManager,
  RateLimiter,
  ResponseFormatter,
  MetricsCollector,
  logger
};