/* ROUTES/ANALYZE.JS - FAKE NEWS ANALYSIS ROUTES */

import express from 'express';
import {
    analyzeFakeNewsScore,
    compareArticles,
    batchAnalyze
} from '../controllers/fakeNewsController.js';
import { analyzeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Analyze single article
router.post('/fake-score', analyzeLimiter, analyzeFakeNewsScore);

// Compare multiple articles for verification
router.post('/compare', analyzeLimiter, compareArticles);

// Batch analyze multiple articles
router.post('/batch', analyzeLimiter, batchAnalyze);

export default router;
