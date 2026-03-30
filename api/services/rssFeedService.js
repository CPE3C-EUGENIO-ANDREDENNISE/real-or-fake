/* SERVICES/RSSFEEDSERVICE.JS - RSS FEED PARSER FOR FREE NEWS SOURCES */

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { createHash } from 'crypto';

const xmlParser = new XMLParser({
    ignoreAttributes: true,
    isArray: (tagName, jPath, isLeafNode, isAttribute) => {
        // Always treat these as arrays for consistent parsing
        const arrayTags = ['item', 'entry', 'article'];
        return arrayTags.includes(tagName);
    }
});

// Free RSS feeds from credible news sources
const RSS_FEEDS = {
    bbc: {
        name: 'BBC News',
        url: 'http://feeds.bbci.co.uk/news/rss.xml',
        credibility: 95,
        country: 'UK'
    },
    bbc_world: {
        name: 'BBC World',
        url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
        credibility: 95,
        country: 'UK'
    },
    reuters: {
        name: 'Reuters',
        url: 'https://www.reutersagency.com/feed/?best-topics=news&post_type=best',
        credibility: 98,
        country: 'US'
    },
    ap_news: {
        name: 'AP News',
        url: 'https://apnews.com/feed',
        credibility: 97,
        country: 'US'
    },
    npr: {
        name: 'NPR',
        url: 'https://feeds.npr.org/1001/rss.xml',
        credibility: 90,
        country: 'US'
    },
    dw: {
        name: 'Deutsche Welle',
        url: 'https://rss.dw.com/xml/rss-en-all',
        credibility: 88,
        country: 'DE'
    }
};

/**
 * Fetch and parse RSS feed from a source
 * @param {string} sourceKey - Key from RSS_FEEDS
 * @returns {Promise<Array>} Array of articles
 */
async function fetchRssFeed(sourceKey) {
    const feed = RSS_FEEDS[sourceKey];
    if (!feed) {
        throw new Error(`Unknown RSS feed source: ${sourceKey}`);
    }

    try {
        const response = await axios.get(feed.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (RealOrFake News Analyzer)'
            },
            timeout: 10000
        });

        const parsed = xmlParser.parse(response.data);

        // Handle different RSS formats (RSS 2.0 vs Atom)
        let items = [];
        if (parsed.rss?.channel?.item) {
            items = parsed.rss.channel.item;
        } else if (parsed.feed?.entry) {
            items = parsed.feed.entry;
        }

        return items.map(item => ({
            id: `${sourceKey}-${generateId(item.title, item.link || item.id)}`,
            title: item.title,
            description: item.description || item.summary || '',
            link: item.link || item.id,
            pubDate: item.pubDate || item.published || item.updated,
            source: feed.name,
            sourceKey,
            credibility: feed.credibility,
            country: feed.country,
            category: item.category || 'general',
            imageUrl: item['media:content']?.['$']?.url || item.enclosure?.url || null,
            isRss: true
        }));
    } catch (err) {
        console.error(`RSS feed error for ${feed.name}:`, err.message);
        return []; // Return empty array instead of failing
    }
}

/**
 * Generate a unique ID for an article
 */
function generateId(title, link) {
    const hash = require('crypto').createHash('md5');
    hash.update(link || title);
    return hash.digest('hex').substring(0, 12);
}

/**
 * Search across all RSS feeds for a keyword
 * @param {string} query - Search keyword
 * @returns {Promise<Array>} Array of matching articles
 */
export async function searchRssFeeds(query) {
    const sources = Object.keys(RSS_FEEDS);
    const results = [];

    // Fetch from all sources in parallel
    const promises = sources.map(source => fetchRssFeed(source));
    const allFeeds = await Promise.all(promises);

    // Flatten and filter by query
    for (const feed of allFeeds) {
        for (const article of feed) {
            const searchText = `${article.title} ${article.description}`.toLowerCase();
            if (searchText.includes(query.toLowerCase())) {
                results.push(article);
            }
        }
    }

    // Sort by date (newest first)
    return results.sort((a, b) => {
        const dateA = new Date(a.pubDate);
        const dateB = new Date(b.pubDate);
        return dateB - dateA;
    });
}

/**
 * Get feeds from specific sources
 * @param {Array<string>} sourceKeys - Array of source keys
 * @returns {Promise<Array>} Array of articles
 */
export async function getFeedsFromSources(sourceKeys = []) {
    const sources = sourceKeys.length > 0 ? sourceKeys : Object.keys(RSS_FEEDS);
    const results = [];

    const promises = sources.map(source => fetchRssFeed(source));
    const allFeeds = await Promise.all(promises);

    for (const feed of allFeeds) {
        results.push(...feed);
    }

    return results.sort((a, b) => {
        const dateA = new Date(a.pubDate);
        const dateB = new Date(b.pubDate);
        return dateB - dateA;
    });
}

/**
 * Get available RSS sources
 * @returns {Array<object>} Array of source info
 */
export function getAvailableSources() {
    return Object.entries(RSS_FEEDS).map(([key, feed]) => ({
        key,
        name: feed.name,
        credibility: feed.credibility,
        country: feed.country
    }));
}

/**
 * Get a single RSS article by ID
 * @param {string} articleId - Article ID (format: sourceKey-hash)
 * @returns {Promise<object|null>} Article object
 */
export async function getRssArticleById(articleId) {
    const sourceKey = articleId.split('-')[0];

    if (!RSS_FEEDS[sourceKey]) {
        return null;
    }

    const articles = await fetchRssFeed(sourceKey);
    return articles.find(a => a.id === articleId) || null;
}
