const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/auth');
const goalRoutes = require('./routes/goals');
const actionRoutes = require('./routes/actions');
const insightRoutes = require('./routes/insights');
const assistantRoutes = require('./routes/assistant');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!mongoURI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes – must have /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/assistant', assistantRoutes);

// Test route
app.get('/api/test', (req, res) => res.json({ message: 'API works' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));