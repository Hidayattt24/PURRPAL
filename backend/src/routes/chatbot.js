const express = require('express');
const path = require('path');

const router = express.Router();

// Import chatbot from the chatbot submodule
let chatbotInstance = null;
let initializationError = null;

// Initialize chatbot
async function initializeChatbot() {
  try {
    console.log('🤖 Initializing PurrPal Chatbot...');
    
    // Adjust path to point to chatbot submodule
    const chatbotPath = path.resolve(__dirname, '../../../chatbot/src/chatbot.js');
    console.log('📁 Chatbot path:', chatbotPath);
    
    const { chatbot } = require(chatbotPath);
    
    if (!chatbot.initialized) {
      console.log('🔄 Chatbot not initialized, initializing now...');
      await chatbot.initialize();
    }
    
    chatbotInstance = chatbot;
    initializationError = null;
    console.log('✅ PurrPal Chatbot initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize chatbot:', error.message);
    initializationError = error;
    return false;
  }
}

// Initialize chatbot on module load
initializeChatbot().then(success => {
  if (success) {
    console.log('🎉 Chatbot ready to serve requests');
  } else {
    console.log('⚠️ Chatbot initialization failed, will retry on first request');
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    console.log('🏥 Chatbot health check requested');
    
    // If chatbot not initialized, try to initialize
    if (!chatbotInstance) {
      console.log('🔄 Chatbot not found, attempting initialization...');
      const initSuccess = await initializeChatbot();
      if (!initSuccess) {
        return res.status(503).json({
          status: 'unavailable',
          message: 'Chatbot initialization failed',
          error: initializationError?.message || 'Unknown error',
          timestamp: new Date().toISOString(),
          suggestions: [
            'Check Google Cloud configuration',
            'Verify service account key',
            'Ensure Vertex AI API is enabled'
          ]
        });
      }
    }

    // Perform health check
    const healthCheck = await chatbotInstance.healthCheck();
    
    console.log('📊 Health check result:', healthCheck.status);
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json({
      ...healthCheck,
      backend_integration: 'active',
      integration_timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Check server logs for details',
        'Verify chatbot service configuration',
        'Ensure all dependencies are installed'
      ]
    });
  }
});

// Send message to chatbot
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('💬 Chatbot message received:', { 
      messageLength: message?.length,
      preview: message?.substring(0, 50) + '...'
    });
    
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required and must be a non-empty string',
        timestamp: new Date().toISOString()
      });
    }

    // Check if chatbot is available
    if (!chatbotInstance) {
      console.log('🔄 Chatbot not available, attempting initialization...');
      const initSuccess = await initializeChatbot();
      if (!initSuccess) {
        return res.status(503).json({ 
          success: false,
          message: 'Layanan chatbot sedang tidak tersedia. Tim teknis sedang memperbaiki masalah ini.',
          error: 'Chatbot service unavailable',
          timestamp: new Date().toISOString(),
          suggestions: [
            'Silakan coba lagi dalam beberapa menit',
            'Jika urgent, hubungi dokter hewan terdekat',
            'Cek status sistem di halaman utama'
          ]
        });
      }
    }

    // Generate session ID (you can use IP or any identifier since no auth)
    const sessionId = req.ip || req.connection.remoteAddress || 'anonymous_' + Date.now();
    
    console.log('🎯 Generating response for session:', sessionId);
    
    // Generate response using real chatbot
    const startTime = Date.now();
    const response = await chatbotInstance.generateResponse(
      message.trim(), 
      sessionId,
      { useContext: true }
    );
    const responseTime = Date.now() - startTime;

    console.log('✅ Response generated successfully:', {
      sessionId,
      responseTime: responseTime + 'ms',
      urgency: response.urgencyLevel,
      success: response.success
    });

    // Add additional metadata
    response.backend_processed = true;
    response.response_time_ms = responseTime;
    response.session_id = sessionId;

    res.json(response);
    
  } catch (error) {
    console.error('💥 Error in chatbot message processing:', error);
    
    // Determine error type and provide appropriate response
    let errorResponse = {
      success: false,
      message: 'Maaf, terjadi kesalahan pada sistem chatbot. Silakan coba lagi dalam beberapa saat.',
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Coba kirim pesan lagi',
        'Refresh halaman dan coba lagi',
        'Jika darurat, segera hubungi dokter hewan terdekat'
      ]
    };

    // Check specific error types
    if (error.message.includes('timeout')) {
      errorResponse.message = 'Respons chatbot memerlukan waktu terlalu lama. Silakan coba dengan pertanyaan yang lebih singkat.';
      errorResponse.error = 'Response timeout';
    } else if (error.message.includes('rate limit')) {
      errorResponse.message = 'Terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi.';
      errorResponse.error = 'Rate limit exceeded';
    } else if (error.message.includes('authentication') || error.message.includes('permission')) {
      errorResponse.message = 'Terjadi masalah konfigurasi sistem. Tim teknis sedang menangani masalah ini.';
      errorResponse.error = 'Authentication/Permission error';
    }
    
    res.status(500).json(errorResponse);
  }
});

// Get conversation history
router.get('/history', async (req, res) => {
  try {
    if (!chatbotInstance) {
      return res.status(503).json({ 
        success: false,
        error: 'Chatbot service is not available' 
      });
    }

    const sessionId = req.ip || req.connection.remoteAddress || 'anonymous';
    const history = chatbotInstance.getConversationHistory(sessionId);
    
    console.log('📜 Conversation history requested for session:', sessionId);
    
    res.json({
      success: true,
      history: history || null,
      timestamp: new Date().toISOString(),
      session_id: sessionId
    });
    
  } catch (error) {
    console.error('💥 Error getting conversation history:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get conversation history',
      timestamp: new Date().toISOString()
    });
  }
});

// Clear conversation history
router.delete('/history', async (req, res) => {
  try {
    if (!chatbotInstance) {
      return res.status(503).json({ 
        success: false,
        error: 'Chatbot service is not available' 
      });
    }

    const sessionId = req.ip || req.connection.remoteAddress || 'anonymous';
    chatbotInstance.clearConversationHistory(sessionId);
    
    console.log('🗑️ Conversation history cleared for session:', sessionId);
    
    res.json({
      success: true,
      message: 'Riwayat percakapan telah dihapus',
      timestamp: new Date().toISOString(),
      session_id: sessionId
    });
    
  } catch (error) {
    console.error('💥 Error clearing conversation history:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to clear conversation history',
      timestamp: new Date().toISOString()
    });
  }
});

// Get chatbot metrics (for monitoring)
router.get('/metrics', async (req, res) => {
  try {
    if (!chatbotInstance) {
      return res.status(503).json({ 
        error: 'Chatbot service is not available' 
      });
    }

    const metrics = chatbotInstance.getMetrics();
    
    res.json({
      ...metrics,
      backend_integration: 'active',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Error getting chatbot metrics:', error);
    res.status(500).json({ 
      error: 'Failed to get metrics',
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint for troubleshooting
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Running chatbot test...');
    
    if (!chatbotInstance) {
      const initSuccess = await initializeChatbot();
      if (!initSuccess) {
        return res.status(503).json({
          test: 'failed',
          reason: 'Chatbot initialization failed',
          error: initializationError?.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Test with a simple message
    const testMessage = 'Halo PurrPal, ini adalah test';
    const response = await chatbotInstance.generateResponse(testMessage, 'test_session');
    
    res.json({
      test: 'success',
      test_message: testMessage,
      response_received: response.success,
      response_length: response.message?.length || 0,
      chatbot_status: 'working',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    res.status(500).json({
      test: 'failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;