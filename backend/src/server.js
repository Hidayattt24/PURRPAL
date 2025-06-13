const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced error logging
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://fe-purrpal.vercel.app',
      process.env.FRONTEND_URL || 'https://purrpal-frontend-817826973206.asia-southeast2.run.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      /^https:\/\/.*\.vercel\.app$/
    ];
    
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (!isAllowed) {
      const msg = `CORS policy blocked origin: ${origin}`;
      console.error('CORS Error:', msg);
      return callback(new Error(msg), false);
    }
    
    console.log('CORS: Allowing origin:', origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

// Basic routes first
app.get('/', (req, res) => {
  res.json({
    name: 'PurrPal API',
    version: '1.0.0',
    description: 'Backend API for PurrPal Application',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cors_configured: true,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Load routes with error handling
const loadRoute = (routePath, mountPath) => {
  try {
    console.log(`📁 Loading route: ${routePath} -> ${mountPath}`);
    const route = require(routePath);
    app.use(mountPath, route);
    console.log(`✅ Route loaded successfully: ${mountPath}`);
  } catch (error) {
    console.error(`❌ Failed to load route ${mountPath}:`, error.message);
    console.error('Stack:', error.stack);
    
    // Create a fallback route that returns error info
    app.use(mountPath, (req, res) => {
      res.status(503).json({
        error: `Route ${mountPath} failed to load`,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });
  }
};

// Load routes one by one with error handling
console.log('🚀 Loading API routes...');

loadRoute('./routes/auth', '/api/auth');
loadRoute('./routes/user', '/api/users');
loadRoute('./routes/stories', '/api/stories');
loadRoute('./routes/modules', '/api/modules');
loadRoute('./routes/location', '/api/location');
loadRoute('./routes/ai', '/api/ai');

// Load chatbot route last (this is likely where the error occurs)
console.log('🤖 Loading chatbot route (potential issue source)...');
try {
  const chatbotRoutes = require('./routes/chatbot');
  app.use('/api/chatbot', chatbotRoutes);
  console.log('✅ Chatbot route loaded successfully');
} catch (error) {
  console.error('❌ Chatbot route failed to load:', error.message);
  console.error('Full error:', error);
  
  // Create a fallback chatbot route
  app.use('/api/chatbot', (req, res) => {
    res.status(503).json({
      error: 'Chatbot service unavailable',
      message: 'The chatbot service failed to initialize. Please try again later.',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  });
}

// API Documentation
app.get('/docs', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>PurrPal API - Debug Mode</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
            .success { background: #d4edda; color: #155724; }
            .error { background: #f8d7da; color: #721c24; }
            .warning { background: #fff3cd; color: #856404; }
        </style>
    </head>
    <body>
        <h1>🐱 PurrPal API - Debug Mode</h1>
        <div class="status success">
            <strong>Server Status:</strong> Running on ${req.protocol}://${req.get('host')}
        </div>
        
        <h2>Available Endpoints:</h2>
        <ul>
            <li><strong>GET /</strong> - API info</li>
            <li><strong>GET /health</strong> - Health check</li>
            <li><strong>POST /api/auth/login</strong> - User login</li>
            <li><strong>POST /api/auth/signup</strong> - User registration</li>
            <li><strong>GET /api/stories</strong> - Get stories</li>
            <li><strong>GET /api/modules</strong> - Get education modules</li>
            <li><strong>GET /api/ai/health</strong> - AI services health</li>
            <li><strong>POST /api/chatbot/message</strong> - Chat with AI (may be unavailable)</li>
        </ul>

        <div class="warning">
            <strong>Note:</strong> This is debug mode. Check server logs for detailed error information.
        </div>
    </body>
    </html>
  `;
  res.send(html);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} was not found`,
    available_endpoints: [
      'GET /',
      'GET /health',
      'GET /docs',
      'POST /api/auth/login',
      'POST /api/auth/signup'
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler caught:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: isDevelopment ? err.message : 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/docs`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS configured for: https://fe-purrpal.vercel.app`);
  console.log(`🐱 PurrPal Backend API is ready!`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('🚨 Server error:', error);
  process.exit(1);
});