require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const path        = require('path');
const videoRoutes = require('./routes/videoRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ─── Middleware ─── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─── Serve the portfolio frontend (one level up from backend/) ─── */
app.use(express.static(path.join(__dirname, '..')));

/* ─── API routes ─── */
app.use('/api/videos', videoRoutes);

/* ─── Health check ─── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ─── Global error handler ─── */
app.use((err, req, res, next) => {
  console.error(err);
  const status  = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ success: false, message });
});

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
  console.log(`API base:          http://localhost:${PORT}/api/videos`);
});
