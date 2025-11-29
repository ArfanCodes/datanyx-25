import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import transactionRoutes from './routes/transactions.routes';
import leakRoutes from './routes/leaks.routes';
import stabilityRoutes from './routes/stability.routes';

const app: Application = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DataNyx API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/leaks', leakRoutes);
app.use('/api/stability', stabilityRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
