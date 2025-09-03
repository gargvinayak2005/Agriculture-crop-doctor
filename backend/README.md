# Backend API

This is the backend server for the full-stack application.

## Features

- Express.js server
- MongoDB connection with Mongoose
- User authentication (JWT)
- User registration and login
- Protected routes
- CORS enabled

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://gargvinayak2005_db_user:7Y9yCXtBoJgovHAj@cluster0.duq1lrv.mongodb.net/
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Database

The application connects to MongoDB Atlas using the provided connection string. Make sure your MongoDB cluster is accessible and the credentials are correct.
