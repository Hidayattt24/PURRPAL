const { VertexAI } = require('@google-cloud/vertexai');
const config = require('./config');
const {
  InputValidator,
  PromptManager,
  CacheManager,
  RateLimiter,
  ResponseFormatter,
  MetricsCollector,
  logger
} = require('./utils');

/**
 * Enhanced PurrPal Chatbot with comprehensive features
 */
class PurrPalChatbot {
  constructor() {
    this.vertexAI = null;
    this.model = null;
    this.initialized = false;
    this.initializationError = null;
    this.conversationHistory = new Map(); // Store conversation context
    
    logger.info('PurrPal Chatbot instance created');
  }

  /**
   * Initialize the Vertex AI client for Gemini with enhanced error handling
   */
  async initialize() {
    try {
      logger.info('Initializing PurrPal Chatbot...');
      
      // Initialize Vertex AI with comprehensive configuration
      this.vertexAI = new VertexAI({
        project: config.googleCloud.projectId,
        location: config.googleCloud.location,
        googleAuthOptions: {
          keyFilename: config.googleCloud.keyFilename
        }
      });

      // Configure Gemini model with optimized settings for cat care
      this.model = this.vertexAI.getGenerativeModel({
        model: config.googleCloud.model,
        generationConfig: {
          maxOutputTokens: config.chatbot.maxTokens,
          temperature: config.chatbot.temperature,
          topP: config.chatbot.topP,
          topK: config.chatbot.topK,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      });

      // Test the connection with a simple query
      await this._testConnection();

      this.initialized = true;
      this.initializationError = null;
      
      logger.info('PurrPal Chatbot initialized successfully', {
        model: config.googleCloud.model,
        project: config.googleCloud.projectId,
        location: config.googleCloud.location
      });

      return true;
    } catch (error) {
      this.initializationError = error;
      this.initialized = false;
      
      logger.error('Failed to initialize PurrPal Chatbot', {
        error: error.message,
        stack: error.stack,
        project: config.googleCloud.projectId,
        model: config.googleCloud.model
      });

      throw new Error(`Chatbot initialization failed: ${error.message}`);
    }
  }

  /**
   * Test connection to Vertex AI
   */
  async _testConnection() {
    try {
      const testResult = await this.model.generateContent('Test connection');
      logger.debug('Connection test successful');
      return testResult;
    } catch (error) {
      logger.error('Connection test failed', { error: error.message });
      throw new Error(`Connection test failed: ${error.message}`);
    }
  }

  /**
   * Generate response with comprehensive processing pipeline
   */
  async generateResponse(userMessage, sessionId = null, options = {}) {
    const startTime = Date.now();
    let urgencyLevel = 'normal';
    let cached = false;

    try {
      // Check if chatbot is initialized
      if (!this.initialized) {
        if (this.initializationError) {
          throw this.initializationError;
        }
        throw new Error('Chatbot not initialized. Call initialize() first.');
      }

      // Rate limiting check
      const rateLimitResult = RateLimiter.checkRateLimit(sessionId || 'anonymous');
      if (!rateLimitResult.allowed) {
        logger.warn('Rate limit exceeded for session', { sessionId });
        return ResponseFormatter.createErrorResponse(
          new Error('Terlalu banyak permintaan. Silakan coba lagi nanti.'),
          { sessionId, rateLimitExceeded: true }
        );
      }

      // Input validation and sanitization
      const validation = InputValidator.validateInput(userMessage);
      if (!validation.isValid) {
        logger.warn('Input validation failed', { 
          sessionId, 
          errors: validation.errors,
          originalInput: userMessage?.substring(0, 100)
        });
        
        return ResponseFormatter.createErrorResponse(
          new Error(`Input tidak valid: ${validation.errors.join(', ')}`),
          { sessionId, validationErrors: validation.errors }
        );
      }

      const sanitizedMessage = validation.sanitizedInput;

      // Check cache first
      const cacheKey = CacheManager.generateCacheKey(sanitizedMessage);
      let cachedResponse = CacheManager.get(cacheKey);
      
      if (cachedResponse && !options.bypassCache) {
        cached = true;
        logger.debug('Returning cached response', { sessionId, cacheKey });
        
        const responseTime = Date.now() - startTime;
        MetricsCollector.recordRequest(true, responseTime, true, cachedResponse.urgencyLevel);
        
        return {
          ...cachedResponse,
          cached: true,
          responseTimeMs: responseTime
        };
      }

      // Generate prompt with context awareness
      let prompt;
      const conversationContext = this.conversationHistory.get(sessionId);
      
      if (conversationContext && options.useContext) {
        prompt = PromptManager.createFollowUpPrompt(
          conversationContext.lastResponse,
          sanitizedMessage
        );
      } else {
        prompt = PromptManager.createCatCarePrompt(sanitizedMessage);
      }

      // Detect urgency level from prompt generation
      const emergencyKeywords = config.catCare.emergencyKeywords;
      const seriousSymptoms = config.catCare.seriousSymptoms;
      
      const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
        sanitizedMessage.toLowerCase().includes(keyword)
      );
      
      const hasSeriousSymptom = seriousSymptoms.some(symptom => 
        sanitizedMessage.toLowerCase().includes(symptom)
      );

      if (hasEmergencyKeyword) urgencyLevel = 'emergency';
      else if (hasSeriousSymptom) urgencyLevel = 'serious';

      // Generate response using Gemini with timeout
      const generatedText = await this._generateWithTimeout(prompt);

      // Format and enhance response
      const responseTime = Date.now() - startTime;
      const formattedResponse = ResponseFormatter.formatResponse(generatedText, {
        urgencyLevel,
        cached,
        responseTime,
        sessionId
      });

      // Cache the response (only cache non-emergency responses)
      if (urgencyLevel !== 'emergency' && config.cache.enabled) {
        CacheManager.set(cacheKey, {
          ...formattedResponse,
          urgencyLevel
        });
      }

      // Update conversation history
      if (sessionId) {
        this.conversationHistory.set(sessionId, {
          lastMessage: sanitizedMessage,
          lastResponse: generatedText,
          timestamp: new Date().toISOString(),
          urgencyLevel
        });
      }

      // Record metrics
      MetricsCollector.recordRequest(true, responseTime, cached, urgencyLevel);

      logger.info('Response generated successfully', {
        sessionId,
        responseTime,
        urgencyLevel,
        cached,
        messageLength: sanitizedMessage.length,
        responseLength: generatedText.length
      });

      return formattedResponse;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      MetricsCollector.recordRequest(false, responseTime, cached);

      logger.error('Error generating response', {
        sessionId,
        error: error.message,
        stack: error.stack,
        userMessage: userMessage?.substring(0, 100),
        responseTime
      });

      return ResponseFormatter.createErrorResponse(error, {
        sessionId,
        originalMessage: userMessage,
        urgencyLevel
      });
    }
  }

  /**
   * Generate content with timeout protection
   */
  async _generateWithTimeout(prompt) {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Response generation timeout'));
      }, config.catCare.responseTimeout);

      try {
        const result = await this.model.generateContent(prompt);
        clearTimeout(timeoutId);

        let generatedText = 'Maaf, saya tidak dapat memberikan jawaban saat ini. Silakan coba lagi atau konsultasikan dengan dokter hewan jika ini adalah kondisi darurat.';
        
        if (result && result.response) {
          const response = result.response;
          if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
              generatedText = candidate.content.parts[0].text || generatedText;
            }
          }
        }

        resolve(generatedText);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Generate streaming response with enhanced features
   */
  async generateStreamingResponse(userMessage, sessionId = null, onChunk = null) {
    const startTime = Date.now();
    let urgencyLevel = 'normal';

    try {
      if (!this.initialized) {
        throw new Error('Chatbot not initialized. Call initialize() first.');
      }

      // Rate limiting and validation (same as regular response)
      const rateLimitResult = RateLimiter.checkRateLimit(sessionId || 'anonymous');
      if (!rateLimitResult.allowed) {
        throw new Error('Terlalu banyak permintaan. Silakan coba lagi nanti.');
      }

      const validation = InputValidator.validateInput(userMessage);
      if (!validation.isValid) {
        throw new Error(`Input tidak valid: ${validation.errors.join(', ')}`);
      }

      const sanitizedMessage = validation.sanitizedInput;
      const prompt = PromptManager.createCatCarePrompt(sanitizedMessage);

      // Detect urgency
      const emergencyKeywords = config.catCare.emergencyKeywords;
      const seriousSymptoms = config.catCare.seriousSymptoms;
      
      if (emergencyKeywords.some(keyword => sanitizedMessage.toLowerCase().includes(keyword))) {
        urgencyLevel = 'emergency';
      } else if (seriousSymptoms.some(symptom => sanitizedMessage.toLowerCase().includes(symptom))) {
        urgencyLevel = 'serious';
      }

      // Generate streaming response
      const streamingResult = this.model.generateContentStream(prompt);
      
      let fullResponse = '';
      let chunkCount = 0;

      for await (const item of streamingResult.stream) {
        if (item.candidates && item.candidates[0] && item.candidates[0].content) {
          const content = item.candidates[0].content;
          if (content.parts && content.parts[0]) {
            const chunk = content.parts[0].text || '';
            fullResponse += chunk;
            chunkCount++;

            // Call onChunk callback if provided
            if (onChunk && typeof onChunk === 'function') {
              onChunk({
                chunk,
                fullResponse,
                chunkNumber: chunkCount,
                urgencyLevel,
                sessionId
              });
            }
          }
        }
      }

      const responseTime = Date.now() - startTime;
      const formattedResponse = ResponseFormatter.formatResponse(
        fullResponse || 'Maaf, saya tidak dapat memberikan jawaban saat ini.',
        { urgencyLevel, responseTime, sessionId, streaming: true }
      );

      // Update conversation history
      if (sessionId) {
        this.conversationHistory.set(sessionId, {
          lastMessage: sanitizedMessage,
          lastResponse: fullResponse,
          timestamp: new Date().toISOString(),
          urgencyLevel
        });
      }

      MetricsCollector.recordRequest(true, responseTime, false, urgencyLevel);

      logger.info('Streaming response completed', {
        sessionId,
        responseTime,
        urgencyLevel,
        chunkCount,
        responseLength: fullResponse.length
      });

      return formattedResponse;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      MetricsCollector.recordRequest(false, responseTime, false);

      logger.error('Error in streaming response', {
        sessionId,
        error: error.message,
        stack: error.stack
      });

      return ResponseFormatter.createErrorResponse(error, { sessionId, streaming: true });
    }
  }

  /**
   * Clear conversation history for a session
   */
  clearConversationHistory(sessionId) {
    if (sessionId) {
      this.conversationHistory.delete(sessionId);
      logger.debug('Conversation history cleared', { sessionId });
    }
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(sessionId) {
    return this.conversationHistory.get(sessionId) || null;
  }

  /**
   * Enhanced health check with detailed diagnostics
   */
  async healthCheck() {
    try {
      const metrics = MetricsCollector.getMetrics();
      
      if (!this.initialized) {
        return {
          status: 'not_initialized',
          message: 'Chatbot not initialized',
          error: this.initializationError?.message,
          metrics
        };
      }

      // Test with a simple health check query
      const testStart = Date.now();
      const testResponse = await this._generateWithTimeout('Test kesehatan sistem');
      const testTime = Date.now() - testStart;

      return {
        status: 'healthy',
        message: 'PurrPal Chatbot is working properly',
        model: config.googleCloud.model,
        project: config.googleCloud.projectId,
        location: config.googleCloud.location,
        testResponseTime: testTime,
        testSuccess: !!testResponse,
        cacheEnabled: config.cache.enabled,
        rateLimitEnabled: config.rateLimit.requests > 0,
        activeConversations: this.conversationHistory.size,
        metrics,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Health check failed', { error: error.message });
      
      return {
        status: 'error',
        message: 'Health check failed',
        error: error.message,
        metrics: MetricsCollector.getMetrics(),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get system metrics and statistics
   */
  getMetrics() {
    return {
      ...MetricsCollector.getMetrics(),
      activeConversations: this.conversationHistory.size,
      cacheSize: CacheManager.cache?.size || 0,
      initialized: this.initialized,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reset metrics (for testing or maintenance)
   */
  resetMetrics() {
    MetricsCollector.resetMetrics();
    logger.info('Metrics reset by user');
  }

  /**
   * Clear all caches
   */
  clearCache() {
    CacheManager.clear();
    logger.info('Cache cleared by user');
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    logger.info('Shutting down PurrPal Chatbot...');
    
    // Clear conversation history
    this.conversationHistory.clear();
    
    // Clear caches
    CacheManager.clear();
    
    // Log final metrics
    const finalMetrics = MetricsCollector.getMetrics();
    logger.info('Final metrics before shutdown', finalMetrics);
    
    this.initialized = false;
    logger.info('PurrPal Chatbot shutdown complete');
  }
}

// Export both class and singleton instance
const chatbotInstance = new PurrPalChatbot();

module.exports = {
  PurrPalChatbot,
  chatbot: chatbotInstance
};

// CLI testing interface (if running directly)
if (require.main === module) {
  async function testChatbot() {
    try {
      console.log('🐱 Testing PurrPal Chatbot...\n');
      
      await chatbotInstance.initialize();
      
      const testQueries = [
        'Halo PurrPal!',
        'Kucing saya tidak mau makan sejak kemarin, apa yang harus saya lakukan?',
        'Kucing saya muntah darah!', // Emergency test
        'Bagaimana cara merawat kucing yang sedang hamil?'
      ];

      for (const query of testQueries) {
        console.log(`\n📝 Test Query: "${query}"`);
        console.log('⏳ Processing...\n');
        
        const response = await chatbotInstance.generateResponse(query, 'test-session');
        
        console.log('✅ Response:', JSON.stringify(response, null, 2));
        console.log('\n' + '='.repeat(80));
      }

      // Show final health check and metrics
      console.log('\n🏥 Health Check:');
      const healthCheck = await chatbotInstance.healthCheck();
      console.log(JSON.stringify(healthCheck, null, 2));

    } catch (error) {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    }
  }
  
  testChatbot();
}