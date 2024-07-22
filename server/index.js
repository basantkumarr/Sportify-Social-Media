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
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS
const corsOptions = {
  origin: [
    'https://sportify-chi.vercel.app',
    'https://sportify-28h3cxa27-basants-projects-54b8f0df.vercel.app'
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware to handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Serve static files from the 'public/images' directory
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Define your routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
