const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

const app = express();
const PORT = 8000; // Hardcoded for now to get it working

// Debug: Log environment variables
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('Using PORT:', PORT);

// Middleware
// Temporary permissive CORS for debugging
app.use(cors({
    origin: true, // Allow all origins temporarily
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gargvinayak2005_db_user:7Y9yCXtBoJgovHAj@cluster0.duq1lrv.mongodb.net/';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB successfully!');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Basic route
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.json({ message: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Debug route to check CORS
app.get('/api/debug', (req, res) => {
    console.log('Debug route accessed');
    res.json({ 
        message: 'Debug route working', 
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
    // Export the app for Vercel
    module.exports = app;
} else {
    // Start the server locally
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
