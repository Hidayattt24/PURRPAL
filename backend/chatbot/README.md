# 🐱 PurrPal Enhanced Chatbot

> **AI-Powered Cat Care Assistant for Indonesia** - Membantu pemilik kucing di seluruh Indonesia dengan dukungan AI yang cerdas dan empati.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Vertex%20AI-blue.svg)](https://cloud.google.com/vertex-ai)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)
[![Test Coverage](https://img.shields.io/badge/Coverage-95%25-brightgreen.svg)](coverage/)

## 🌟 Overview

PurrPal Enhanced Chatbot adalah asisten virtual berbasis AI yang dirancang khusus untuk membantu pemilik kucing di Indonesia. Menggunakan teknologi Google Vertex AI dengan model Gemini, chatbot ini memberikan saran perawatan kucing yang akurat, empati, dan mudah dipahami.

### ✨ Key Features

- 🤖 **AI-Powered Responses** - Menggunakan Google Gemini 2.0 untuk respons yang natural dan akurat
- 🚨 **Emergency Detection** - Deteksi otomatis kondisi darurat dan gejala serius
- 🇮🇩 **Indonesian Language** - Dioptimalkan untuk Bahasa Indonesia
- ⚡ **Response Caching** - Cache untuk respons yang lebih cepat
- 🛡️ **Rate Limiting** - Perlindungan dari penyalahgunaan
- 📊 **Comprehensive Monitoring** - Metrics dan logging yang detail
- 🔒 **Enhanced Security** - Input sanitization dan validation
- 💬 **Conversation Context** - Mempertahankan konteks percakapan
- 🔄 **Streaming Support** - Respons streaming untuk interaksi real-time

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm 8+
- Google Cloud Account dengan Vertex AI enabled
- Service Account Key untuk Google Cloud

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/notsuperganang/purrpal-chatbot-integration.git
   cd purrpal-chatbot-integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # Required
   GOOGLE_CLOUD_PROJECT=your-project-id
   
   # Optional (with defaults)
   GOOGLE_CLOUD_LOCATION=us-central1
   VERTEX_AI_MODEL=gemini-2.0-flash-001
   SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
   
   # Chatbot Configuration
   CHATBOT_MAX_TOKENS=8192
   CHATBOT_TEMPERATURE=0.7
   CHATBOT_TOP_P=0.95
   CHATBOT_TOP_K=40
   
   # Performance & Security
   ENABLE_CACHING=true
   CACHE_TTL_MINUTES=30
   RATE_LIMIT_REQUESTS=100
   RATE_LIMIT_WINDOW_MINUTES=15
   MAX_INPUT_LENGTH=2000
   
   # Monitoring
   LOG_LEVEL=info
   ENABLE_METRICS=true
   ```

4. **Add Google Cloud Service Account Key**
   - Download service account key from Google Cloud Console
   - Save as `service-account-key.json` in project root
   - Ensure the service account has Vertex AI permissions

5. **Validate configuration**
   ```bash
   npm run validate
   ```

6. **Run the chatbot**
   ```bash
   npm start
   ```

## 📖 Usage

### Basic Usage

```javascript
const { PurrPalChatbot } = require('./src/chatbot');

const chatbot = new PurrPalChatbot();

async function example() {
  // Initialize chatbot
  await chatbot.initialize();
  
  // Generate response
  const response = await chatbot.generateResponse(
    'Kucing saya tidak mau makan sejak kemarin, apa yang harus saya lakukan?',
    'user-session-123'
  );
  
  console.log(response);
  /*
  {
    "success": true,
    "message": "Halo! Saya memahami kekhawatiran Anda tentang kucing yang tidak mau makan...",
    "urgencyLevel": "serious",
    "recommendations": [...],
    "timestamp": "2024-06-10T10:30:00.000Z",
    "responseTimeMs": 1500,
    "source": "purrpal-ai"
  }
  */
}
```

### Advanced Usage

```javascript
// Streaming response
const response = await chatbot.generateStreamingResponse(
  'Bagaimana cara merawat anak kucing yang baru lahir?',
  'session-456',
  (chunk) => {
    console.log('Received chunk:', chunk.chunk);
  }
);

// Health check
const health = await chatbot.healthCheck();
console.log('Health status:', health.status);

// Get metrics
const metrics = chatbot.getMetrics();
console.log('Total requests:', metrics.totalRequests);

// Clear conversation history
chatbot.clearConversationHistory('session-123');
```

### Express.js Integration

```javascript
const express = require('express');
const { chatbot } = require('./src/chatbot');

const app = express();
app.use(express.json());

// Initialize chatbot
chatbot.initialize();

app.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const response = await chatbot.generateResponse(message, sessionId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', async (req, res) => {
  const health = await chatbot.healthCheck();
  res.json(health);
});

app.listen(3000, () => {
  console.log('PurrPal API running on port 3000');
});
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLOUD_PROJECT` | ✅ | - | Google Cloud Project ID |
| `GOOGLE_CLOUD_LOCATION` | ❌ | `us-central1` | Vertex AI location |
| `VERTEX_AI_MODEL` | ❌ | `gemini-2.0-flash-001` | Model name |
| `SERVICE_ACCOUNT_KEY_PATH` | ❌ | `./service-account-key.json` | Path to service account key |
| `CHATBOT_MAX_TOKENS` | ❌ | `8192` | Maximum response tokens |
| `CHATBOT_TEMPERATURE` | ❌ | `0.7` | Response creativity (0-1) |
| `ENABLE_CACHING` | ❌ | `true` | Enable response caching |
| `CACHE_TTL_MINUTES` | ❌ | `30` | Cache time-to-live |
| `RATE_LIMIT_REQUESTS` | ❌ | `100` | Requests per window |
| `RATE_LIMIT_WINDOW_MINUTES` | ❌ | `15` | Rate limit window |
| `LOG_LEVEL` | ❌ | `info` | Logging level |

### Cat Care Specific Settings

The chatbot is optimized for Indonesian cat care with:

- **Emergency Keywords**: `tidak bernapas`, `kejang`, `darah`, `keracunan`, etc.
- **Serious Symptoms**: `tidak mau makan`, `demam tinggi`, `muntah terus`, etc.
- **Response Language**: Bahasa Indonesia yang natural dan empati
- **Veterinary Recommendations**: Automatic suggestions for serious conditions

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/chatbot.test.js
```

### Test Categories

- **Unit Tests**: Individual component testing
- **Integration Tests**: Feature interaction testing
- **Performance Tests**: Response time and throughput
- **Security Tests**: Input validation and sanitization

## 📊 Monitoring & Metrics

### Available Metrics

```javascript
const metrics = chatbot.getMetrics();
console.log(metrics);
/*
{
  "totalRequests": 1250,
  "successfulRequests": 1195,
  "failedRequests": 55,
  "averageResponseTime": 1456,
  "cacheHits": 324,
  "cacheMisses": 926,
  "emergencyDetections": 23,
  "seriousConditionDetections": 187,
  "activeConversations": 45,
  "initialized": true,
  "timestamp": "2024-06-10T10:30:00.000Z"
}
*/
```

### Health Check Endpoint

```javascript
const health = await chatbot.healthCheck();
/*
{
  "status": "healthy",
  "message": "PurrPal Chatbot is working properly",
  "model": "gemini-2.0-flash-001",
  "testResponseTime": 1200,
  "cacheEnabled": true,
  "rateLimitEnabled": true,
  "activeConversations": 45,
  "metrics": { ... }
}
*/
```

## 🔒 Security Features

- **Input Sanitization**: XSS protection and content filtering
- **Rate Limiting**: Prevent abuse and DoS attacks
- **Content Validation**: Block suspicious patterns
- **Error Handling**: Secure error messages without sensitive data
- **Logging**: Comprehensive audit trail

## 🚀 Performance Optimization

- **Response Caching**: Intelligent caching for frequently asked questions
- **Connection Pooling**: Efficient Vertex AI connections
- **Streaming Responses**: Real-time response streaming
- **Memory Management**: Automatic cache cleanup
- **Timeout Protection**: Prevent hanging requests

## 📁 Project Structure

```
purrpal-chatbot/
├── src/
│   ├── chatbot.js          # Main chatbot class
│   ├── config.js           # Configuration management
│   └── utils.js            # Utility functions
├── tests/
│   └──chatbot.test.js     # Comprehensive test suite
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🐛 Troubleshooting

### Common Issues

**1. "Service account key file not found"**
```bash
# Ensure the service account key exists
ls -la service-account-key.json
```

**2. "Failed to initialize chatbot"**
- Check Google Cloud project permissions
- Verify Vertex AI is enabled
- Confirm service account has proper roles

**3. "Rate limit exceeded"**
- Increase `RATE_LIMIT_REQUESTS` or `RATE_LIMIT_WINDOW_MINUTES`
- Implement user authentication for higher limits

**4. "Input validation failed"**
- Check input length (max 2000 characters by default)
- Ensure input doesn't contain suspicious content

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm start

# Run with Node.js debug
DEBUG=* npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Install dev dependencies
npm install

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Generate documentation
npm run docs
```

## 📋 API Reference

### PurrPalChatbot Class

#### Methods

- `initialize()` - Initialize the chatbot
- `generateResponse(message, sessionId, options)` - Generate response
- `generateStreamingResponse(message, sessionId, onChunk)` - Stream response
- `healthCheck()` - Get health status
- `getMetrics()` - Get performance metrics
- `clearConversationHistory(sessionId)` - Clear session history
- `shutdown()` - Graceful shutdown

#### Events

The chatbot emits events for monitoring:

```javascript
chatbot.on('response', (data) => {
  console.log('Response generated:', data);
});

chatbot.on('error', (error) => {
  console.error('Error occurred:', error);
});
```

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Cloud Vertex AI** for providing powerful AI capabilities
- **Gemini 2.0** for natural language understanding
- **Coding Camp DBS Foundation** for project inspiration
- **Cat lovers community** for valuable feedback and testing

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/notsuperganang/purrpal-chatbot-integration/issues)
- **Discussions**: [GitHub Discussions](https://github.com/notsuperganang/purrpal-chatbot-integration/discussions)
- **Email**: team@purrpal.id

---

**Made with ❤️ for cat lovers in Indonesia** 🇮🇩