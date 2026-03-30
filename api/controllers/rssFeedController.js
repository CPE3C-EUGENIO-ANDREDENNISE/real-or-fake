/* CONTROLLERS/RSSFEEDCONTROLLER.JS - RSS FEED HTTP HANDLERS */

import * as rssFeedService from '../services/rssFeedService.js';

// GET /api/news/rss/search?q=keyword - Search across all RSS feeds
export async function searchRssFeeds(req, res) {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'query parameter (q) is required' });
        }

        const articles = await rssFeedService.searchRssFeeds(q);

        res.json({
            success: true,
            count: articles.length,
            sources: rssFeedService.getAvailableSources(),
            data: articles
        });

    } catch (err) {
        console.error('RSS feed search error:', err.message);
        res.status(500).json({ error: 'failed to search RSS feeds' });
    }
}

// GET /api/news/rss/feeds - Get all RSS feeds from selected sources
export async function getRssFeeds(req, res) {
    try {
        const { sources } = req.query;
        const sourceKeys = sources ? sources.split(',') : [];

        const articles = await rssFeedService.getFeedsFromSources(sourceKeys);

        res.json({
            success: true,
            count: articles.length,
            sources: rssFeedService.getAvailableSources(),
            data: articles
        });

    } catch (err) {
        console.error('RSS feeds error:', err.message);
        res.status(500).json({ error: 'failed to fetch RSS feeds' });
    }
}

// GET /api/news/rss/sources - Get available RSS sources
export async function getRssSources(req, res) {
    try {
        const sources = rssFeedService.getAvailableSources();

        res.json({
            success: true,
            count: sources.length,
            data: sources
        });

    } catch (err) {
        console.error('RSS sources error:', err.message);
        res.status(500).json({ error: 'failed to fetch RSS sources' });
    }
}

// GET /api/news/rss/article/:id - Get single RSS article
export async function getRssArticle(req, res) {
    try {
        const { id } = req.params;

        const article = await rssFeedService.getRssArticleById(id);

        if (!article) {
            return res.status(404).json({ error: 'article not found' });
        }

        res.json({
            success: true,
            data: article
        });

    } catch (err) {
        console.error('RSS article error:', err.message);
        res.status(500).json({ error: 'failed to fetch article' });
    }
}
