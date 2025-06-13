const express = require('express');
const path = require('path');

const router = express.Router();

// Chatbot initialization state
let chatbotInstance = null;
let initializationError = null;
let isInitializing = false;

// Safe chatbot initialization with better error handling
async function initializeChatbot() {
  if (isInitializing) {
    console.log('🔄 Chatbot initialization already in progress...');
    return false;
  }

  try {
    isInitializing = true;
    console.log('🤖 Starting PurrPal Chatbot initialization...');
    
    // Try multiple possible paths for chatbot
    const possiblePaths = [
      path.resolve(__dirname, '../../chatbot/src/chatbot.js'),
      path.resolve(__dirname, '../../../chatbot/src/chatbot.js'),
      path.resolve(__dirname, '../../backend/chatbot/src/chatbot.js')
    ];
    
    let chatbotModule = null;
    let successfulPath = null;
    
    for (const chatbotPath of possiblePaths) {
      try {
        console.log(`📁 Trying chatbot path: ${chatbotPath}`);
        
        // Check if file exists first
        const fs = require('fs');
        if (!fs.existsSync(chatbotPath)) {
          console.log(`❌ File not found: ${chatbotPath}`);
          continue;
        }
        
        // Try to require the module
        chatbotModule = require(chatbotPath);
        successfulPath = chatbotPath;
        console.log(`✅ Successfully loaded chatbot from: ${chatbotPath}`);
        break;
      } catch (pathError) {
        console.log(`❌ Failed to load from ${chatbotPath}: ${pathError.message}`);
        continue;
      }
    }
    
    if (!chatbotModule) {
      throw new Error('Chatbot module not found in any expected location');
    }
    
    // Extract chatbot instance
    const { chatbot } = chatbotModule;
    
    if (!chatbot) {
      throw new Error('Chatbot instance not exported from module');
    }
    
    // Initialize if needed
    if (!chatbot.initialized) {
      console.log('🔄 Initializing chatbot instance...');
      await chatbot.initialize();
    }
    
    chatbotInstance = chatbot;
    initializationError = null;
    
    console.log('✅ PurrPal Chatbot initialized successfully');
    console.log(`📍 Loaded from: ${successfulPath}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize chatbot:', error.message);
    console.error('Full error details:', error);
    initializationError = error;
    chatbotInstance = null;
    return false;
  } finally {
    isInitializing = false;
  }
}

// Health check endpoint (always available)
router.get('/health', async (req, res) => {
  try {
    console.log('🏥 Chatbot health check requested');
    
    if (!chatbotInstance && !isInitializing) {
      console.log('🔄 Chatbot not available, attempting initialization...');
      const initSuccess = await initializeChatbot();
      
      if (!initSuccess) {
        return res.status(503).json({
          status: 'unavailable',
          message: 'Chatbot service is not available',
          error: initializationError?.message || 'Initialization failed',
          timestamp: new Date().toISOString(),
          suggestions: [
            'Check chatbot module configuration',
            'Verify Google Cloud credentials',
            'Ensure chatbot dependencies are installed'
          ]
        });
      }
    }

    if (isInitializing) {
      return res.status(202).json({
        status: 'initializing',
        message: 'Chatbot is currently being initialized',
        timestamp: new Date().toISOString()
      });
    }

    // Perform health check if chatbot is available
    if (chatbotInstance && typeof chatbotInstance.healthCheck === 'function') {
      const healthCheck = await chatbotInstance.healthCheck();
      
      const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
      return res.status(statusCode).json({
        ...healthCheck,
        backend_integration: 'active',
        integration_timestamp: new Date().toISOString()
      });
    }
    
    // Fallback response
    res.json({
      status: 'available',
      message: 'Chatbot instance loaded but health check not implemented',
      backend_integration: 'active',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Message endpoint
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('💬 Chatbot message received');
    
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required and must be a non-empty string',
        timestamp: new Date().toISOString()
      });
    }

    // Check chatbot availability
    if (!chatbotInstance) {
      console.log('🔄 Chatbot not available, attempting initialization...');
      const initSuccess = await initializeChatbot();
      
      if (!initSuccess) {
        return res.status(503).json({ 
          success: false,
          message: 'Layanan chatbot sedang tidak tersedia. Silakan coba lagi nanti.',
          error: 'Chatbot service unavailable',
          timestamp: new Date().toISOString(),
          suggestions: [
            'Coba lagi dalam beberapa menit',
            'Refresh halaman dan coba lagi',
            'Hubungi support jika masalah berlanjut'
          ]
        });
      }
    }

    if (isInitializing) {
      return res.status(202).json({
        success: false,
        message: 'Chatbot sedang dalam proses inisialisasi. Silakan tunggu sebentar.',
        error: 'Service initializing',
        timestamp: new Date().toISOString()
      });
    }

    // Generate session ID
    const sessionId = req.ip || req.connection.remoteAddress || 'anonymous_' + Date.now();
    
    console.log('🎯 Generating response...');
    
    // Generate response
    const startTime = Date.now();
    const response = await chatbotInstance.generateResponse(
      message.trim(), 
      sessionId,
      { useContext: true }
    );
    const responseTime = Date.now() - startTime;

    console.log('✅ Response generated successfully');

    // Add metadata
    response.backend_processed = true;
    response.response_time_ms = responseTime;
    response.session_id = sessionId;

    res.json(response);
    
  } catch (error) {
    console.error('💥 Error in chatbot message processing:', error);
    
    let errorResponse = {
      success: false,
      message: 'Maaf, terjadi kesalahan pada sistem chatbot. Silakan coba lagi.',
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Coba kirim pesan lagi',
        'Refresh halaman dan coba lagi',
        'Hubungi support jika masalah berlanjut'
      ]
    };

    // Handle specific error types
    if (error.message.includes('timeout')) {
      errorResponse.message = 'Respons chatbot memerlukan waktu terlalu lama. Silakan coba dengan pertanyaan yang lebih singkat.';
      errorResponse.error = 'Response timeout';
    } else if (error.message.includes('rate limit')) {
      errorResponse.message = 'Terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi.';
      errorResponse.error = 'Rate limit exceeded';
    }
    
    res.status(500).json(errorResponse);
  }
});

// History endpoints (with fallback)
router.get('/history', async (req, res) => {
  try {
    if (!chatbotInstance) {
      return res.status(503).json({ 
        success: false,
        error: 'Chatbot service is not available',
        message: 'Riwayat chat tidak tersedia saat ini'
      });
    }

    const sessionId = req.ip || req.connection.remoteAddress || 'anonymous';
    
    if (typeof chatbotInstance.getConversationHistory === 'function') {
      const history = chatbotInstance.getConversationHistory(sessionId);
      
      res.json({
        success: true,
        history: history || [],
        timestamp: new Date().toISOString(),
        session_id: sessionId
      });
    } else {
      res.json({
        success: true,
        history: [],
        message: 'History feature not implemented',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('💥 Error getting conversation history:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get conversation history',
      timestamp: new Date().toISOString()
    });
  }
});

router.delete('/history', async (req, res) => {
  try {
    if (!chatbotInstance) {
      return res.status(503).json({ 
        success: false,
        error: 'Chatbot service is not available' 
      });
    }

    const sessionId = req.ip || req.connection.remoteAddress || 'anonymous';
    
    if (typeof chatbotInstance.clearConversationHistory === 'function') {
      chatbotInstance.clearConversationHistory(sessionId);
      
      res.json({
        success: true,
        message: 'Riwayat percakapan telah dihapus',
        timestamp: new Date().toISOString(),
        session_id: sessionId
      });
    } else {
      res.json({
        success: true,
        message: 'History cleared (feature not fully implemented)',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('💥 Error clearing conversation history:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to clear conversation history',
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Running chatbot test...');
    
    const testResult = {
      test: 'chatbot_integration',
      timestamp: new Date().toISOString(),
      chatbot_available: !!chatbotInstance,
      initialization_error: initializationError?.message || null,
      is_initializing: isInitializing
    };

    if (!chatbotInstance) {
      testResult.status = 'chatbot_not_available';
      testResult.message = 'Chatbot instance not loaded';
    } else {
      testResult.status = 'chatbot_available';
      testResult.message = 'Chatbot instance loaded successfully';
      
      // Try a simple test if possible
      try {
        const testMessage = 'Hello PurrPal Test';
        const response = await chatbotInstance.generateResponse(testMessage, 'test_session');
        testResult.test_response = {
          success: response.success,
          message_length: response.message?.length || 0
        };
      } catch (testError) {
        testResult.test_response = {
          error: testError.message
        };
      }
    }
    
    res.json(testResult);
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    res.status(500).json({
      test: 'failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Initialize chatbot when module loads (non-blocking)
console.log('🤖 Chatbot route loaded, starting initialization...');
initializeChatbot().then(success => {
  if (success) {
    console.log('🎉 Chatbot initialized successfully on route load');
  } else {
    console.log('⚠️ Chatbot initialization failed on route load, will retry on first request');
  }
}).catch(error => {
  console.error('❌ Chatbot initialization error on route load:', error);
});

module.exports = router;