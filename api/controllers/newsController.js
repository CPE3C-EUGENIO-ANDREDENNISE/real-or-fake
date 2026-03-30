/* CONTROLLERS/NEWSCONTROLLER.JS - NEWS API HTTP HANDLERS */

import * as guardianService from '../services/guardianService.js';
import { analyzeSentiment } from '../services/sentimentService.js';
import { calculateFakeNewsProbability } from '../services/fakeNewsScoringService.js';

// GET /api/news/guardian/search?q=keyword - Search Guardian articles
export async function searchGuardian(req, res) {
    try {
        const { q, page, pageSize, fromDate, toDate, section } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'query parameter (q) is required' });
        }

        const articles = await guardianService.searchArticles(q, {
            page: page ? parseInt(page) : 1,
            pageSize: pageSize ? parseInt(pageSize) : 10,
            fromDate,
            toDate,
            section
        });

        res.json({
            success: true,
            count: articles.length,
            data: articles
        });

    } catch (err) {
        console.error('Guardian search error:', err.message);
        res.status(500).json({ error: 'failed to search articles' });
    }
}

// GET /api/news/guardian/latest/:section - Get latest articles by section
export async function getLatestBySection(req, res) {
    try {
        const { section } = req.params;
        const { pageSize } = req.query;

        const articles = await guardianService.getLatestBySection(
            section,
            pageSize ? parseInt(pageSize) : 10
        );

        res.json({
            success: true,
            count: articles.length,
            data: articles
        });

    } catch (err) {
        console.error('Guardian latest error:', err.message);
        res.status(500).json({ error: 'failed to fetch latest articles' });
    }
}

// GET /api/news/guardian/article/:id - Get single article with sentiment
export async function getArticleWithSentiment(req, res) {
    try {
        const { id } = req.params;

        const article = await guardianService.getArticleById(id);

        // Analyze sentiment of the article body
        const sentiment = analyzeSentiment(article.bodyText || article.trailText);

        res.json({
            success: true,
            data: {
                ...article,
                sentiment
            }
        });

    } catch (err) {
        console.error('Guardian article error:', err.message);
        res.status(500).json({ error: 'failed to fetch article' });
    }
}

// GET /api/news/guardian/sections - Get available sections
export async function getSections(req, res) {
    try {
        const sections = await guardianService.getSections();

        res.json({
            success: true,
            count: sections.length,
            data: sections
        });

    } catch (err) {
        console.error('Guardian sections error:', err.message);
        res.status(500).json({ error: 'failed to fetch sections' });
    }
}

// GET /api/news/guardian/search-with-sentiment?q=keyword - Search with sentiment analysis
export async function searchWithSentiment(req, res) {
    try {
        const { q, page, pageSize } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'query parameter (q) is required' });
        }

        const articles = await guardianService.searchArticles(q, {
            page: page ? parseInt(page) : 1,
            pageSize: pageSize ? parseInt(pageSize) : 5 // Limit for performance
        });

        // Add sentiment analysis to each article
        const articlesWithSentiment = articles.map(article => ({
            ...article,
            sentiment: analyzeSentiment(article.bodyText || article.trailText)
        }));

        res.json({
            success: true,
            count: articlesWithSentiment.length,
            data: articlesWithSentiment
        });

    } catch (err) {
        console.error('Guardian search with sentiment error:', err.message);
        res.status(500).json({ error: 'failed to search and analyze articles' });
    }
}

// GET /api/news/guardian/search-with-analysis?q=keyword - Search with sentiment AND fake news scoring
export async function searchWithAnalysis(req, res) {
    try {
        const { q, page, pageSize } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'query parameter (q) is required' });
        }

        const articles = await guardianService.searchArticles(q, {
            page: page ? parseInt(page) : 1,
            pageSize: pageSize ? parseInt(pageSize) : 5
        });

        // Add both sentiment and fake news scoring
        const articlesWithAnalysis = articles.map(article => ({
            ...article,
            sentiment: analyzeSentiment(article.bodyText || article.trailText),
            fakeNewsScore: calculateFakeNewsProbability({
                title: article.webTitle,
                description: article.trailText,
                bodyText: article.bodyText,
                link: article.webUrl,
                source: 'The Guardian',
                byline: article.byline
            })
        }));

        res.json({
            success: true,
            count: articlesWithAnalysis.length,
            data: articlesWithAnalysis
        });

    } catch (err) {
        console.error('Guardian search with analysis error:', err.message);
        res.status(500).json({ error: 'failed to search and analyze articles' });
    }
}
