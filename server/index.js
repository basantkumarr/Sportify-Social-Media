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
app.use(cors({
  origin: ['https://sportify-chi.vercel.app', 'https://sportify-e09enzdaf-basants-projects-54b8f0df.vercel.app'],
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization']
}));

// Static files setup
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
 .then(() => console.log('MongoDB connected...'))
 .catch(err => console.error('MongoDB connection error:', err.message));

// Route handlers
app.use("/user", userRoutes);
app.use("/post", postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
