require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Add CORS support for frontend integration


// Import routes
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// -------------- LOGGING MIDDLEWARE --------------
// Optional: You can keep or remove this later
app.use((req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    cookies: req.headers.cookie
  };

  console.log(JSON.stringify(logData, null, 2));
  next();
});

// Body parsing middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Restaurant Reservation Backend API' });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
  res.status(status).json({ message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on ${process.env.HOST || 'http://localhost'}:${PORT}`);
});