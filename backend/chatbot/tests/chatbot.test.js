const { PurrPalChatbot } = require('../src/chatbot');
const { 
  InputValidator, 
  PromptManager, 
  CacheManager, 
  RateLimiter,
  ResponseFormatter,
  MetricsCollector 
} = require('../src/utils');

// Mock console.log for testing
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('PurrPal Chatbot Enhanced Test Suite', () => {
  let chatbot;

  beforeAll(async () => {
    // Suppress console output during tests
    console.log = jest.fn();
    console.error = jest.fn();
    
    chatbot = new PurrPalChatbot();
    // Note: Skip actual initialization in tests to avoid API calls
  });

  afterAll(() => {
    // Restore console output
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('InputValidator', () => {
    test('should sanitize input correctly', () => {
      expect(InputValidator.sanitizeInput('  Hello World  ')).toBe('Hello World');
      expect(InputValidator.sanitizeInput('')).toBe('');
      expect(InputValidator.sanitizeInput(null)).toBe('');
      expect(InputValidator.sanitizeInput('<script>alert("test")</script>')).toBe('scriptalert"test"/script');
      expect(InputValidator.sanitizeInput('Test\n\n\nwith\t\tmultiple\r\nwhitespace')).toBe('Test with multiple whitespace');
    });

    test('should validate input correctly', () => {
      // Valid input
      const validResult = InputValidator.validateInput('Kucing saya sakit');
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);
      expect(validResult.sanitizedInput).toBe('Kucing saya sakit');

      // Invalid input - too short
      const shortResult = InputValidator.validateInput('Hi');
      expect(shortResult.isValid).toBe(false);
      expect(shortResult.errors).toContain('Pertanyaan terlalu pendek, minimal 3 karakter');

      // Invalid input - not string
      const nonStringResult = InputValidator.validateInput(123);
      expect(nonStringResult.isValid).toBe(false);
      expect(nonStringResult.errors).toContain('Input harus berupa teks');

      // Suspicious content
      const suspiciousResult = InputValidator.validateInput('Hello <script>alert("test")</script>');
      expect(suspiciousResult.isValid).toBe(false);
      expect(suspiciousResult.errors).toContain('Input mengandung konten yang tidak diizinkan');
    });

    test('should handle very long input', () => {
      const longInput = 'A'.repeat(3000);
      const result = InputValidator.validateInput(longInput);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('terlalu panjang'));
    });
  });

  describe('PromptManager', () => {
    test('should create proper cat care prompt', () => {
      const prompt = PromptManager.createCatCarePrompt('Kucing saya tidak mau makan');
      expect(prompt).toContain('PurrPal AI');
      expect(prompt).toContain('Kucing saya tidak mau makan');
      expect(prompt).toContain('IDENTITAS & KEPRIBADIAN');
      expect(prompt).toContain('KEAHLIAN UTAMA');
    });

    test('should detect emergency keywords', () => {
      const emergencyPrompt = PromptManager.createCatCarePrompt('Kucing saya tidak bernapas!');
      expect(emergencyPrompt).toContain('DARURAT TERDETEKSI');
      expect(emergencyPrompt).toContain('SEGERA');
    });

    test('should detect serious symptoms', () => {
      const seriousPrompt = PromptManager.createCatCarePrompt('Kucing saya tidak mau makan dan lemas');
      expect(seriousPrompt).toContain('KONDISI SERIUS');
      expect(seriousPrompt).toContain('24-48 jam');
    });

    test('should create follow-up prompt', () => {
      const followUpPrompt = PromptManager.createFollowUpPrompt(
        'Sebelumnya kita membahas tentang kucing yang tidak mau makan',
        'Bagaimana kalau saya berikan vitamin?'
      );
      expect(followUpPrompt).toContain('lanjutan percakapan');
      expect(followUpPrompt).toContain('KONTEKS SEBELUMNYA');
      expect(followUpPrompt).toContain('Bagaimana kalau saya berikan vitamin?');
    });
  });

  describe('CacheManager', () => {
    beforeEach(() => {
      CacheManager.clear();
    });

    test('should generate consistent cache keys', () => {
      const key1 = CacheManager.generateCacheKey('Kucing saya sakit');
      const key2 = CacheManager.generateCacheKey('kucing saya sakit');
      const key3 = CacheManager.generateCacheKey('  Kucing  saya   sakit  ');
      
      expect(key1).toBe(key2);
      expect(key1).toBe(key3);
      expect(key1).toMatch(/^[a-f0-9]{32}$/); // MD5 hash pattern
    });

    test('should store and retrieve cached values', () => {
      const key = 'test-key';
      const value = { message: 'Test response', success: true };
      
      CacheManager.set(key, value);
      const retrieved = CacheManager.get(key);
      
      expect(retrieved).toEqual(value);
    });

    test('should return null for expired cache', (done) => {
      const key = 'expire-test';
      const value = { message: 'Test' };
      
      // Mock short TTL for testing
      const originalTTL = require('../src/config').cache.ttlMinutes;
      require('../src/config').cache.ttlMinutes = 0.001; // Very short TTL
      
      CacheManager.set(key, value);
      
      setTimeout(() => {
        const retrieved = CacheManager.get(key);
        expect(retrieved).toBeNull();
        
        // Restore original TTL
        require('../src/config').cache.ttlMinutes = originalTTL;
        done();
      }, 100);
    });

    test('should clear cache properly', () => {
      CacheManager.set('key1', 'value1');
      CacheManager.set('key2', 'value2');
      
      expect(CacheManager.get('key1')).toBe('value1');
      expect(CacheManager.get('key2')).toBe('value2');
      
      CacheManager.clear();
      
      expect(CacheManager.get('key1')).toBeNull();
      expect(CacheManager.get('key2')).toBeNull();
    });
  });

  describe('RateLimiter', () => {
    test('should allow requests within limit', () => {
      const identifier = 'test-user-1';
      
      const result1 = RateLimiter.checkRateLimit(identifier);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBeGreaterThan(0);
      
      const result2 = RateLimiter.checkRateLimit(identifier);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(result1.remaining - 1);
    });

    test('should block requests when limit exceeded', () => {
      const identifier = 'test-user-2';
      const limit = require('../src/config').rateLimit.requests;
      
      // Make requests up to the limit
      for (let i = 0; i < limit; i++) {
        const result = RateLimiter.checkRateLimit(identifier);
        expect(result.allowed).toBe(true);
      }
      
      // Next request should be blocked
      const blockedResult = RateLimiter.checkRateLimit(identifier);
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.remaining).toBe(0);
    });
  });

  describe('ResponseFormatter', () => {
    test('should format successful response correctly', () => {
      const response = ResponseFormatter.formatResponse('Test response message', {
        urgencyLevel: 'normal',
        responseTime: 1500
      });

      expect(response.success).toBe(true);
      expect(response.message).toBe('Test response message');
      expect(response.source).toBe('purrpal-ai');
      expect(response.urgencyLevel).toBe('normal');
      expect(response.responseTimeMs).toBe(1500);
      expect(response.timestamp).toBeDefined();
    });

    test('should format emergency response with recommendations', () => {
      const response = ResponseFormatter.formatResponse('Emergency response', {
        urgencyLevel: 'emergency'
      });

      expect(response.urgencyLevel).toBe('emergency');
      expect(response.recommendations).toBeDefined();
      expect(response.recommendations).toContain('Segera bawa kucing ke dokter hewan terdekat');
    });

    test('should create proper error response', () => {
      const error = new Error('Test error');
      const errorResponse = ResponseFormatter.createErrorResponse(error, { sessionId: 'test' });

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.message).toContain('gangguan teknis');
      expect(errorResponse.errorId).toBeDefined();
      expect(errorResponse.suggestions).toBeDefined();
      expect(errorResponse.timestamp).toBeDefined();
    });
  });

  describe('MetricsCollector', () => {
    beforeEach(() => {
      MetricsCollector.resetMetrics();
    });

    test('should record successful requests', () => {
      MetricsCollector.recordRequest(true, 1000, false, 'normal');
      
      const metrics = MetricsCollector.getMetrics();
      expect(metrics.totalRequests).toBe(1);
      expect(metrics.successfulRequests).toBe(1);
      expect(metrics.failedRequests).toBe(0);
      expect(metrics.averageResponseTime).toBe(1000);
    });

    test('should record failed requests', () => {
      MetricsCollector.recordRequest(false, 500, false, 'normal');
      
      const metrics = MetricsCollector.getMetrics();
      expect(metrics.totalRequests).toBe(1);
      expect(metrics.successfulRequests).toBe(0);
      expect(metrics.failedRequests).toBe(1);
    });

    test('should track cache hits and misses', () => {
      MetricsCollector.recordRequest(true, 100, true, 'normal');  // Cache hit
      MetricsCollector.recordRequest(true, 1000, false, 'normal'); // Cache miss
      
      const metrics = MetricsCollector.getMetrics();
      expect(metrics.cacheHits).toBe(1);
      expect(metrics.cacheMisses).toBe(1);
    });

    test('should track emergency and serious detections', () => {
      MetricsCollector.recordRequest(true, 1000, false, 'emergency');
      MetricsCollector.recordRequest(true, 1000, false, 'serious');
      MetricsCollector.recordRequest(true, 1000, false, 'normal');
      
      const metrics = MetricsCollector.getMetrics();
      expect(metrics.emergencyDetections).toBe(1);
      expect(metrics.seriousConditionDetections).toBe(1);
    });

    test('should calculate average response time correctly', () => {
      MetricsCollector.recordRequest(true, 1000, false, 'normal');
      MetricsCollector.recordRequest(true, 2000, false, 'normal');
      MetricsCollector.recordRequest(true, 3000, false, 'normal');
      
      const metrics = MetricsCollector.getMetrics();
      expect(metrics.averageResponseTime).toBe(2000);
    });

    test('should reset metrics', () => {
      MetricsCollector.recordRequest(true, 1000, false, 'normal');
      
      let metrics = MetricsCollector.getMetrics();
      expect(metrics.totalRequests).toBe(1);
      
      MetricsCollector.resetMetrics();
      
      metrics = MetricsCollector.getMetrics();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.successfulRequests).toBe(0);
      expect(metrics.averageResponseTime).toBe(0);
    });
  });

  describe('PurrPalChatbot Class', () => {
    test('should initialize with correct default values', () => {
      const newChatbot = new PurrPalChatbot();
      expect(newChatbot.initialized).toBe(false);
      expect(newChatbot.vertexAI).toBeNull();
      expect(newChatbot.model).toBeNull();
    });

    test('should handle uninitialized state gracefully', async () => {
      const uninitializedChatbot = new PurrPalChatbot();
      
      const response = await uninitializedChatbot.generateResponse('Test message');
      expect(response.success).toBe(false);
      expect(response.message).toContain('gangguan teknis');
    });

    test('should manage conversation history', () => {
      const sessionId = 'test-session';
      const testHistory = {
        lastMessage: 'Test message',
        lastResponse: 'Test response',
        timestamp: new Date().toISOString(),
        urgencyLevel: 'normal'
      };

      chatbot.conversationHistory.set(sessionId, testHistory);
      
      const retrieved = chatbot.getConversationHistory(sessionId);
      expect(retrieved).toEqual(testHistory);

      chatbot.clearConversationHistory(sessionId);
      const clearedHistory = chatbot.getConversationHistory(sessionId);
      expect(clearedHistory).toBeNull();
    });

    test('should return metrics correctly', () => {
      const metrics = chatbot.getMetrics();
      expect(metrics).toHaveProperty('totalRequests');
      expect(metrics).toHaveProperty('successfulRequests');
      expect(metrics).toHaveProperty('failedRequests');
      expect(metrics).toHaveProperty('activeConversations');
      expect(metrics).toHaveProperty('initialized');
      expect(metrics).toHaveProperty('timestamp');
    });

    test('should handle shutdown gracefully', async () => {
      // Add some test data
      chatbot.conversationHistory.set('test', { data: 'test' });
      
      await chatbot.shutdown();
      
      expect(chatbot.initialized).toBe(false);
      expect(chatbot.conversationHistory.size).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    test('should validate input before processing', async () => {
      const invalidResponse = await chatbot.generateResponse('');
      expect(invalidResponse.success).toBe(false);
      expect(invalidResponse.message).toContain('Input tidak valid');
    });

    test('should detect emergency scenarios correctly', () => {
      const emergencyMessages = [
        'Kucing saya tidak bernapas!',
        'Ada darah di muntahan kucing',
        'Kucing kejang-kejang',
        'Emergency! Kucing pingsan'
      ];

      emergencyMessages.forEach(message => {
        const prompt = PromptManager.createCatCarePrompt(message);
        expect(prompt).toContain('DARURAT TERDETEKSI');
      });
    });

    test('should handle Indonesian text correctly', () => {
      const indonesianMessages = [
        'Kucing saya tidak mau makan nasi',
        'Bagaimana cara memandikan kucing yang takut air?',
        'Kucing persia saya sering muntah setelah makan',
        'Anak kucing berumur 2 bulan boleh mandi tidak?'
      ];

      indonesianMessages.forEach(message => {
        const validation = InputValidator.validateInput(message);
        expect(validation.isValid).toBe(true);
        
        const prompt = PromptManager.createCatCarePrompt(validation.sanitizedInput);
        expect(prompt).toContain('Bahasa Indonesia');
      });
    });
  });

  describe('Performance Tests', () => {
    test('should handle multiple requests efficiently', async () => {
      const startTime = Date.now();
      const requests = [];

      // Generate multiple validation requests
      for (let i = 0; i < 100; i++) {
        requests.push(InputValidator.validateInput(`Test message ${i} for performance testing`));
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(1000); // Should complete in less than 1 second
      expect(requests).toHaveLength(100);
      requests.forEach(result => {
        expect(result.isValid).toBe(true);
      });
    });

    test('cache should improve response times', () => {
      const key = 'performance-test';
      const largeValue = { data: 'x'.repeat(10000) };

      const startTime1 = Date.now();
      CacheManager.set(key, largeValue);
      const setTime = Date.now() - startTime1;

      const startTime2 = Date.now();
      const retrieved = CacheManager.get(key);
      const getTime = Date.now() - startTime2;

      expect(retrieved).toEqual(largeValue);
      expect(getTime).toBeLessThan(setTime); // Getting should be faster than setting
      expect(getTime).toBeLessThan(10); // Should be very fast
    });
  });
});