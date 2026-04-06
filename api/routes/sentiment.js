/* ROUTES/SENTIMENT.JS - SENTIMENT ANALYSIS ROUTES */

import express from 'express';
import {
    analyze,
    analyzeBatchHandler,
    aggregate
} from '../controllers/sentimentController.js';
import { analyzeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/sentiment/analyze - Analyze single text
router.post('/analyze', analyzeLimiter, analyze);

// POST /api/sentiment/analyze-batch - Analyze multiple texts
router.post('/analyze-batch', analyzeLimiter, analyzeBatchHandler);

// POST /api/sentiment/aggregate - Get aggregate sentiment
router.post('/aggregate', analyzeLimiter, aggregate);

export default router;
