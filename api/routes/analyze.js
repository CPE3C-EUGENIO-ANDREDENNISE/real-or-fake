/* ROUTES/ANALYZE.JS - FAKE NEWS ANALYSIS ROUTES */

import express from 'express';
import {
    analyzeFakeNewsScore,
    compareArticles,
    batchAnalyze
} from '../controllers/fakeNewsController.js';

const router = express.Router();

// Analyze single article
router.post('/fake-score', analyzeFakeNewsScore);

// Compare multiple articles for verification
router.post('/compare', compareArticles);

// Batch analyze multiple articles
router.post('/batch', batchAnalyze);

export default router;
