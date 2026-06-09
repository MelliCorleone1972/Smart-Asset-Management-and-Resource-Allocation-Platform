const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');

// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// Test Database Connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully to cult_asset_management!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to the database:', err.message);
    });

// Basic Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Cult Asset Management API is running gracefully.' 
    });
});

// --- Route Placeholders ---
// We will create these files and uncomment them in the next steps
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
