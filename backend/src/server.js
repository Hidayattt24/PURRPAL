const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const storiesRoutes = require('./routes/stories');
const modulesRoutes = require('./routes/modules');
const userRoutes = require('./routes/user');
const locationRoutes = require('./routes/location');
const chatbotRoutes = require('./routes/chatbot');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            // URL frontend yang baru
            'https://fe-purrpal.vercel.app',
            // URL backend lama (backup)
            process.env.FRONTEND_URL || 'https://purrpal-frontend-817826973206.asia-southeast2.run.app',
            // Development
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000'
        ];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Documentation route
app.get('/docs', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PurrPal API Documentation</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                color: #333;
            }
            h1, h2, h3 { 
                color: #2c3e50;
                border-bottom: 2px solid #eee;
                padding-bottom: 10px;
            }
            .endpoint {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
            }
            .method {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                margin-right: 10px;
            }
            .get { background: #61affe; color: white; }
            .post { background: #49cc90; color: white; }
            .put { background: #fca130; color: white; }
            .delete { background: #f93e3e; color: white; }
            .path { 
                font-family: monospace;
                font-size: 1.1em;
            }
            pre {
                background: #272822;
                color: #f8f8f2;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
            }
            .header {
                background: #2c3e50;
                color: white;
                padding: 20px;
                margin-bottom: 20px;
                border-radius: 5px;
            }
            .auth-note {
                background: #fff3cd;
                border: 1px solid #ffeeba;
                color: #856404;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
            }
            .new-badge {
                background: #28a745;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 0.8em;
                margin-left: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🐱 PurrPal API Documentation</h1>
            <p>Base URL: <code>http://localhost:${PORT}</code></p>
        </div>

        <div class="auth-note">
            <strong>Note:</strong> Protected endpoints require Authorization header:<br>
            <code>Authorization: Bearer your_jwt_token</code>
        </div>

        <h2>🔐 Authentication</h2>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/signup</span>
            <p>Register new user</p>
            <pre>
{
    "email": "user@example.com",
    "password": "password123",
    "username": "username123"
}</pre>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/login</span>
            <p>Login user</p>
            <pre>
{
    "email": "user@example.com",
    "password": "password123"
}</pre>
        </div>

        <h2>👤 User Management</h2>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/users/profile</span>
            <p>Get user profile (Protected)</p>
        </div>

        <div class="endpoint">
            <span class="method put">PUT</span>
            <span class="path">/api/users/profile</span>
            <p>Update user profile (Protected)</p>
            <pre>
{
    "full_name": "Full Name",
    "role": "Pet Owner",
    "location": "City",
    "bio": "About me"
}</pre>
        </div>

        <h2>📝 Stories</h2>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/stories</span>
            <p>Get all stories</p>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/stories</span>
            <p>Create new story (Protected)</p>
        </div>

        <h2>📚 Education Modules</h2>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/modules</span>
            <p>Get all modules</p>
        </div>

        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/modules/:id</span>
            <p>Get module details</p>
        </div>

        <h2>🤖 Chatbot</h2>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/chatbot/message</span>
            <p>Send message to PurrPal AI (Protected)</p>
            <pre>
{
    "message": "Kucing saya tidak mau makan, apa yang harus saya lakukan?"
}</pre>
        </div>

        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/chatbot/history</span>
            <p>Get conversation history (Protected)</p>
        </div>

        <div class="endpoint">
            <span class="method delete">DELETE</span>
            <span class="path">/api/chatbot/history</span>
            <p>Clear conversation history (Protected)</p>
        </div>

        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/chatbot/health</span>
            <p>Check chatbot health status</p>
        </div>

        <h2>🧠 AI Detection <span class="new-badge">NEW</span></h2>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/ai/predict-symptoms</span>
            <span class="new-badge">NEW</span>
            <p>Predict cat disease based on symptoms questionnaire (Protected)</p>
            <pre>
{
    "cat_info": {
        "name": "Fluffy",
        "age": "2 tahun",
        "gender": "female",
        "weight": 4.5,
        "body_temperature": 39.0,
        "duration_days": 5,
        "heart_rate": 130
    },
    "questionnaire": {
        "cough": true,
        "breathingDifficulty": false,
        "fever": true,
        "discomfort": true,
        "appetiteLoss": true,
        "weightLoss": false,
        "vomiting": false,
        "diarrhea": false
    }
}</pre>
        </div>

        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/ai/health</span>
            <span class="new-badge">NEW</span>
            <p>Check AI services health status</p>
        </div>

        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/ai/info</span>
            <span class="new-badge">NEW</span>
            <p>Get information about available AI services</p>
        </div>

        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/ai/detect-image</span>
            <p>AI image detection (Coming Soon)</p>
            <pre>
{
    "image_url": "url_to_image"
}</pre>
        </div>

        <footer style="margin-top: 50px; text-align: center; color: #666;">
            <p>PurrPal API v1.0.0 | Made with ❤️ for cats</p>
            <p><strong>New:</strong> AI-powered symptom prediction now available!</p>
        </footer>
    </body>
    </html>
  `;
    res.send(html);
});

// Default JSON response
app.get('/', (req, res) => {
    res.json({
        name: 'PurrPal API',
        version: '1.0.0',
        description: 'Backend API for PurrPal Application',
        documentation_url: '/docs',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            stories: '/api/stories',
            modules: '/api/modules',
            chatbot: '/api/chatbot',
            ai: '/api/ai'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ai', aiRoutes); // Add AI routes

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/docs`);
});