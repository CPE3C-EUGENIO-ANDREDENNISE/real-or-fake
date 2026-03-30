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

const router = express.Router();

// Guardian routes
router.get('/guardian/search', searchGuardian);
router.get('/guardian/search-with-sentiment', searchWithSentiment);
router.get('/guardian/search-with-analysis', searchWithAnalysis);
router.get('/guardian/latest/:section', getLatestBySection);
router.get('/guardian/article/:id', getArticleWithSentiment);
router.get('/guardian/sections', getSections);

// RSS Feed routes (Free sources: BBC, Reuters, AP, NPR, DW)
router.get('/rss/search', searchRssFeeds);
router.get('/rss/feeds', getRssFeeds);
router.get('/rss/sources', getRssSources);
router.get('/rss/article/:id', getRssArticle);

export default router;
