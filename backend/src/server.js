require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const storiesRoutes = require('./routes/stories');
const modulesRoutes = require('./routes/modules');
const veterinaryRoutes = require('./routes/veterinary');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/veterinary-services', veterinaryRoutes);
app.use('/api/users', userRoutes);

// AI & Chatbot placeholder endpoints
app.post('/api/ai/detect-image', (req, res) => {
  res.json({ 
    status: 'todo',
    message: 'AI image detection endpoint - to be implemented',
    diagnosis: 'Kucing Anda terlihat sehat',
    recommendations: 'Lanjutkan perawatan rutin',
    accuracy: '85'
  });
});

app.post('/api/chatbot/message', (req, res) => {
  res.json({
    status: 'todo',
    message: 'Chatbot endpoint - to be implemented',
    response: 'Maaf, fitur chatbot masih dalam pengembangan.'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});