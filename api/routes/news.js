/* ROUTES/NEWS.JS - NEWS API ROUTES */

import express from 'express';
import {
    searchGuardian,
    getLatestBySection,
    getArticleWithSentiment,
    getSections,
    searchWithSentiment,
    searchWithAnalysis
} from '../controllers/newsController.js';
import {
    searchRssFeeds,
    getRssFeeds,
    getRssSources,
    getRssArticle
} from '../controllers/rssFeedController.js';
import { newsLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Guardian routes
router.get('/guardian/search', newsLimiter, searchGuardian);
router.get('/guardian/search-with-sentiment', newsLimiter, searchWithSentiment);
router.get('/guardian/search-with-analysis', newsLimiter, searchWithAnalysis);
router.get('/guardian/latest/:section', newsLimiter, getLatestBySection);
router.get('/guardian/article/:id', newsLimiter, getArticleWithSentiment);
router.get('/guardian/sections', newsLimiter, getSections);

// RSS Feed routes (Free sources: BBC, Reuters, AP, NPR, DW)
router.get('/rss/search', newsLimiter, searchRssFeeds);
router.get('/rss/feeds', newsLimiter, getRssFeeds);
router.get('/rss/sources', newsLimiter, getRssSources);
router.get('/rss/article/:id', newsLimiter, getRssArticle);

export default router;
