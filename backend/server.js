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
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        
        // Allow any Vercel URL for your project
        if (origin.includes('agriculture-crop-doctor') && origin.includes('vercel.app')) {
            return callback(null, true);
        }
        
        // Allow your specific backend URL
        if (origin.includes('agriculture-crop-doctor-git-main-vinayaks-projects-adeb1c9e.vercel.app')) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
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
    res.json({ message: 'Backend is running!' });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
