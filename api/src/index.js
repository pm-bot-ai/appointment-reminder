const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const businessRoutes = require('./routes/businesses');
const customerRoutes = require('./routes/customers');
const appointmentRoutes = require('./routes/appointments');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/businesses', businessRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Health check:', `http://localhost:${PORT}/health`);
});

module.exports = app;
