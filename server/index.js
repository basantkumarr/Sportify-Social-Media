import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/userRoute.js';
import postRoutes from './Routes/postRoute.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
  origin: ['https://sportify-chi.vercel.app', 'https://sportify-e09enzdaf-basants-projects-54b8f0df.vercel.app'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Credentials']
};

app.use(cors(corsOptions));

// Middleware to handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Static files setup
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

 

mongoose.connect("mongodb+srv://basantkumarweb:mohitubba@app.x7kjcrd.mongodb.net/?retryWrites=true&w=majority&appName=app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Exit process with failure
});

// Route handlers
app.use('/user', userRoutes);
app.use('/post', postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    details: err.message,
  });
});

// Create an HTTP server and set timeout
const server = http.createServer(app);
server.setTimeout(60000); // Set timeout to 60 seconds

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
