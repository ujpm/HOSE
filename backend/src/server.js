import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import errorHandler from './middleware/error.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import campaignRoutes from './routes/campaigns.js';
import communityRoutes from './routes/communities.js';
import rewardRoutes from './routes/rewards.js';
import achievementRoutes from './routes/achievements.js';

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Security headers
app.use(helmet());

// Request logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/achievements', achievementRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
