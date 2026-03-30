/* CONTROLLERS/FAKENEWSCONTROLLER.JS - FAKE NEWS SCORING HTTP HANDLERS */

import {
    calculateFakeNewsProbability,
    compareArticlesForVerification
} from '../services/fakeNewsScoringService.js';

// POST /api/news/analyze/fake-score - Analyze single article for fake news probability
export async function analyzeFakeNewsScore(req, res) {
    try {
        const article = req.body;

        if (!article.title) {
            return res.status(400).json({ error: 'article title is required' });
        }

        const result = calculateFakeNewsProbability(article);

        res.json({
            success: true,
            data: result
        });

    } catch (err) {
        console.error('Fake news scoring error:', err.message);
        res.status(500).json({ error: 'failed to analyze article' });
    }
}

// POST /api/news/analyze/compare - Compare multiple articles for verification
export async function compareArticles(req, res) {
    try {
        const { articles } = req.body;

        if (!articles || !Array.isArray(articles) || articles.length === 0) {
            return res.status(400).json({ error: 'articles array is required' });
        }

        const result = compareArticlesForVerification(articles);

        res.json({
            success: true,
            data: result
        });

    } catch (err) {
        console.error('Article comparison error:', err.message);
        res.status(500).json({ error: 'failed to compare articles' });
    }
}

// POST /api/news/analyze/batch - Analyze multiple articles individually
export async function batchAnalyze(req, res) {
    try {
        const { articles } = req.body;

        if (!articles || !Array.isArray(articles) || articles.length === 0) {
            return res.status(400).json({ error: 'articles array is required' });
        }

        const results = articles.map(article => ({
            title: article.title,
            source: article.source,
            ...calculateFakeNewsProbability(article)
        }));

        res.json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (err) {
        console.error('Batch analysis error:', err.message);
        res.status(500).json({ error: 'failed to analyze articles' });
    }
}
