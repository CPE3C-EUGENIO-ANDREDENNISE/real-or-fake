/* INDEX.JS: CONNECTION FROM CONFIGS AND ROUTES */

import express from 'express';
import cors from 'cors';
import config from './config.js';
import pool from './dbconfig.js';
import authRoutes from './routes/auth.js';
import sentimentRoutes from './routes/sentiment.js';
import newsRoutes from './routes/news.js';
import analyzeRoutes from './routes/analyze.js';

const app = express();

app.use(cors({ origin: config.FRONTEND_URL }));
app.use(express.json());

// Mount auth routes at /api/auth
app.use('/api/auth', authRoutes);

// Mount sentiment routes at /api/sentiment
app.use('/api/sentiment', sentimentRoutes);

// Mount news routes at /api/news
app.use('/api/news', newsRoutes);

// Mount analysis routes at /api/news/analyze
app.use('/api/news/analyze', analyzeRoutes);

console.log('Guardian API Key loaded:', !!config.GUARDIAN_API_KEY);
console.log('First few chars:', config.GUARDIAN_API_KEY?.substring(0, 5));

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        console.error('Health check failed:', err.message);
        res.status(500).json({ status: 'error', error: 'database connection failed' });
    }
});

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'internal server error' });
});