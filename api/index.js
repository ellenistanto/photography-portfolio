const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('../server/routes/auth');
const portfolioRoutes = require('../server/routes/portfolio');
const uploadRoutes = require('../server/routes/upload');

const app = express();

// Cache MongoDB connection across serverless invocations
let isConnected = false;
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB serverless connection error:', err);
    return res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    platform: 'vercel-serverless',
  });
});

module.exports = app;
