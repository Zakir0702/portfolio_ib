require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const createVideoRoutes = require('./routes/videoRoutes');
const { createMediaRoutes } = require('./routes/mediaRoutes');
const defaultMediaStore = require('./utils/mediaStore');

function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

function createCorsMiddleware() {
  const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGINS);

  if (allowedOrigins.length === 0) {
    return cors({
      origin: process.env.NODE_ENV === 'production' ? false : true,
    });
  }

  return cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
  });
}

function createApp({ mediaStore = defaultMediaStore, staticDir = path.join(__dirname, '..', 'frontend', 'dist') } = {}) {
  const app = express();

  app.use(createCorsMiddleware());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/media', createMediaRoutes({ mediaStore }));
  app.use('/api/videos', createVideoRoutes({ mediaStore }));

  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      return res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not found.' });
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = status >= 500 ? 'Internal server error' : err.message;
    if (status >= 500) console.error(err);
    res.status(status).json({ success: false, message });
  });

  return app;
}

module.exports = { createApp, parseAllowedOrigins };

