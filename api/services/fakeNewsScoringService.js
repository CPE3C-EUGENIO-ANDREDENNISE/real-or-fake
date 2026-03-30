/* SERVICES/FAKENEWSSCORINGSERVICE.JS - FAKE NEWS PROBABILITY SCORING */

/**
 * Fake News Probability Scoring System
 *
 * Scoring is based on multiple factors:
 * 1. Sensationalism keywords (higher = more suspicious)
 * 2. Emotional language intensity
 * 3. Clickbait patterns
 * 4. Source credibility (pre-defined ratings)
 * 5. Article completeness (author, date, sources cited)
 * 6. URL/domain analysis
 * 7. Cross-source verification (if same fact reported elsewhere)
 *
 * Final score: 0-100 (0 = most credible, 100 = likely fake)
 */

// === SENSATIONALISM KEYWORDS ===
const SENSATIONAL_WORDS = {
    extreme: ['shocking', 'bombshell', 'exposed', 'scandal', 'miracle', 'unbelievable', 'mind-blowing'],
    high: ['breaking', 'urgent', 'alert', 'warning', 'crisis', 'disaster', 'catastrophe'],
    medium: ['revealed', 'secret', 'hidden', 'controversial', 'explosive', 'stunning']
};

// === EMOTIONAL LANGUAGE ===
const EMOTIONAL_WORDS = [
    'devastating', 'horrific', 'tragic', 'heartbreaking', 'outrageous',
    'incredible', 'amazing', 'shocking', 'disturbing', 'frightening',
    'enraged', 'furious', 'slams', 'destroys', 'obliterates', 'crushes'
];

// === CLICKBAIT PATTERNS ===
const CLICKBAIT_PATTERNS = [
    "you won't believe",
    'what happened next',
    'doctors hate',
    'one weird trick',
    'this is why',
    'number \\d+ will shock you',
    'they tried to hide',
    "mainstream media won't tell you",
    "what they don't want you to know",
    'shocking truth about',
    'the real reason why'
];

// === PSEUDOSCIENCE/CONSPIRACY WORDS ===
const CONSPIRACY_WORDS = [
    'hoax', 'fake news', 'propaganda', 'cover-up', 'deep state',
    'globalist', 'elites', 'wake up', 'sheeple', 'truthers',
    'illuminati', 'new world order', 'false flag', 'inside job'
];

// === UNCERTAINTY WEASEL WORDS ===
const UNCERTAINTY_WORDS = [
    'reportedly', 'allegedly', 'rumored', 'possibly', 'might',
    'could be', 'sources say', 'some claim', 'many believe',
    'experts suggest', 'studies show'  // without citing specific studies
];

// === CREDIBLE SOURCE DOMAINS ===
const CREDIBLE_DOMAINS = [
    'reuters.com', 'apnews.com', 'bbc.com', 'theguardian.com',
    'nytimes.com', 'washingtonpost.com', 'wsj.com', 'npr.org',
    'pbs.org', 'cbsnews.com', 'abcnews.go.com', 'nbcnews.com',
    'dw.com', 'france24.com', 'aljazeera.com', 'scmp.com',
    'nature.com', 'science.org', 'scientificamerican.com'
];

// === SUSPICIOUS DOMAIN PATTERNS ===
const SUSPICIOUS_DOMAIN_PATTERNS = [
    '.com.co', '.lo', '.news.co', '.abc.co',
    'wordpress.com', 'blogspot.com', 'medium.com'  // free hosting
];

/**
 * Calculate sensationalism score (0-25 points)
 */
function calculateSensationalismScore(text) {
    if (!text) return 0;

    const lowerText = text.toLowerCase();
    let score = 0;

    // Extreme words: 5 points each
    for (const word of SENSATIONAL_WORDS.extreme) {
        if (lowerText.includes(word)) score += 5;
    }

    // High words: 3 points each
    for (const word of SENSATIONAL_WORDS.high) {
        if (lowerText.includes(word)) score += 3;
    }

    // Medium words: 1 point each
    for (const word of SENSATIONAL_WORDS.medium) {
        if (lowerText.includes(word)) score += 1;
    }

    return Math.min(score, 25); // Cap at 25
}

/**
 * Calculate emotional language score (0-15 points)
 */
function calculateEmotionalScore(text) {
    if (!text) return 0;

    const lowerText = text.toLowerCase();
    let count = 0;

    for (const word of EMOTIONAL_WORDS) {
        if (lowerText.includes(word)) count++;
    }

    // 2 points per emotional word, max 15
    return Math.min(count * 2, 15);
}

/**
 * Calculate clickbait score (0-20 points)
 */
function calculateClickbaitScore(text) {
    if (!text) return 0;

    const lowerText = text.toLowerCase();
    let matches = 0;

    for (const pattern of CLICKBAIT_PATTERNS) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(lowerText)) matches++;
    }

    // 5 points per pattern match, max 20
    return Math.min(matches * 5, 20);
}

/**
 * Calculate conspiracy score (0-15 points)
 */
function calculateConspiracyScore(text) {
    if (!text) return 0;

    const lowerText = text.toLowerCase();
    let count = 0;

    for (const word of CONSPIRACY_WORDS) {
        if (lowerText.includes(word)) count++;
    }

    // 3 points per conspiracy word, max 15
    return Math.min(count * 3, 15);
}

/**
 * Calculate uncertainty score (0-10 points)
 */
function calculateUncertaintyScore(text) {
    if (!text) return 0;

    const lowerText = text.toLowerCase();
    let count = 0;

    for (const word of UNCERTAINTY_WORDS) {
        if (lowerText.includes(word)) count++;
    }

    // 2 points per uncertainty word, max 10
    return Math.min(count * 2, 10);
}

/**
 * Calculate source credibility score (0-15 points, lower is better)
 * Returns penalty points for suspicious sources
 */
function calculateSourceCredibilityPenalty(url, sourceCredibility) {
    let penalty = 0;

    // If source credibility is provided (from RSS), use it
    if (sourceCredibility !== undefined && sourceCredibility !== null) {
        // Convert credibility (95 = very credible) to penalty (0 = no penalty)
        penalty = Math.max(0, (100 - sourceCredibility) * 0.15);
        return penalty;
    }

    // If URL provided, analyze domain
    if (url) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.toLowerCase();

            // Check for credible domains (no penalty)
            for (const credible of CREDIBLE_DOMAINS) {
                if (domain.includes(credible)) {
                    return 0;
                }
            }

            // Check for suspicious patterns (high penalty)
            for (const pattern of SUSPICIOUS_DOMAIN_PATTERNS) {
                if (domain.includes(pattern)) {
                    return 15;
                }
            }
        } catch (e) {
            // Invalid URL, add small penalty
            penalty += 3;
        }
    }

    // Unknown source = moderate penalty
    return penalty + 5;
}

/**
 * Calculate article completeness score (0-10 points, lower is better)
 * Checks for author, date, sources cited
 */
function calculateCompletenessScore(article) {
    let score = 0;

    // Missing author/byline
    if (!article.byline && !article.author) {
        score += 4;
    }

    // Missing or old date
    if (!article.pubDate && !article.published && !article.publishedAt) {
        score += 3;
    }

    // No description/content
    if (!article.description && !article.bodyText && !article.content) {
        score += 3;
    }

    return Math.min(score, 10);
}

/**
 * Calculate cross-source verification bonus
 * If multiple credible sources report same topic, reduce fake score
 */
function calculateCrossSourceBonus(articles, currentArticleIndex) {
    // This would require comparing multiple articles
    // For now, return 0 (no bonus) - can be enhanced later
    return 0;
}

/**
 * Main scoring function
 * @param {object} article - Article object to analyze
 * @returns {object} Scoring breakdown and final probability
 */
export function calculateFakeNewsProbability(article) {
    const text = `${article.title} ${article.description} ${article.bodyText}`;

    // Calculate individual scores
    const sensationalismScore = calculateSensationalismScore(text);
    const emotionalScore = calculateEmotionalScore(text);
    const clickbaitScore = calculateClickbaitScore(article.title);
    const conspiracyScore = calculateConspiracyScore(text);
    const uncertaintyScore = calculateUncertaintyScore(text);
    const sourcePenalty = calculateSourceCredibilityPenalty(
        article.link || article.url,
        article.credibility
    );
    const completenessPenalty = calculateCompletenessScore(article);
    const crossSourceBonus = calculateCrossSourceBonus([article], 0);

    // Total score (0-100)
    const totalScore = Math.min(100,
        sensationalismScore +
        emotionalScore +
        clickbaitScore +
        conspiracyScore +
        uncertaintyScore +
        sourcePenalty +
        completenessPenalty -
        crossSourceBonus
    );

    // Determine risk level
    let riskLevel, riskDescription;
    if (totalScore <= 20) {
        riskLevel = 'LOW';
        riskDescription = 'Article appears credible';
    } else if (totalScore <= 40) {
        riskLevel = 'MODERATE';
        riskDescription = 'Some concerning patterns detected';
    } else if (totalScore <= 60) {
        riskLevel = 'HIGH';
        riskDescription = 'Multiple red flags detected';
    } else {
        riskLevel = 'VERY_HIGH';
        riskDescription = 'High probability of misinformation';
    }

    return {
        fakeProbability: totalScore,
        riskLevel,
        riskDescription,
        breakdown: {
            sensationalism: sensationalismScore,
            emotionalLanguage: emotionalScore,
            clickbaitPatterns: clickbaitScore,
            conspiracyLanguage: conspiracyScore,
            uncertaintyLanguage: uncertaintyScore,
            sourceCredibility: Math.round(sourcePenalty * 100 / 15), // Normalize to percentage
            articleCompleteness: Math.round(completenessPenalty * 10) // Normalize to 0-100
        },
        flags: getDetectedFlags(text, article.title)
    };
}

/**
 * Get list of detected flags for transparency
 */
function getDetectedFlags(text, title) {
    const flags = [];
    const lowerText = text.toLowerCase();
    const lowerTitle = title.toLowerCase();

    // Check sensationalism
    for (const word of [...SENSATIONAL_WORDS.extreme, ...SENSATIONAL_WORDS.high]) {
        if (lowerText.includes(word)) {
            flags.push(`Sensational word: "${word}"`);
        }
    }

    // Check clickbait
    for (const pattern of CLICKBAIT_PATTERNS) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(lowerTitle)) {
            flags.push(`Clickbait pattern: "${pattern}"`);
        }
    }

    // Check conspiracy
    for (const word of CONSPIRACY_WORDS) {
        if (lowerText.includes(word)) {
            flags.push(`Conspiracy term: "${word}"`);
        }
    }

    return flags.slice(0, 10); // Limit to 10 flags
}

/**
 * Compare multiple articles on the same topic
 * @param {Array<object>} articles - Array of articles to compare
 * @returns {object} Comparison analysis
 */
export function compareArticlesForVerification(articles) {
    if (!articles || articles.length === 0) {
        return {
            consensus: 'UNKNOWN',
            verificationScore: 50,
            message: 'No articles to compare'
        };
    }

    // Group by key facts (simplified - check title similarity)
    const scoredArticles = articles.map(article => ({
        ...article,
        score: calculateFakeNewsProbability(article)
    }));

    // Calculate average credibility
    const avgCredibility = scoredArticles.reduce((sum, a) => {
        return sum + (100 - a.score.fakeProbability);
    }, 0) / scoredArticles.length;

    // Check source diversity
    const uniqueSources = new Set(articles.map(a => a.source || new URL(a.link || 'http://unknown').hostname));

    // Determine consensus
    let consensus, verificationScore;

    if (uniqueSources.size >= 3 && avgCredibility >= 70) {
        consensus = 'HIGHLY_VERIFIED';
        verificationScore = 90;
    } else if (uniqueSources.size >= 2 && avgCredibility >= 50) {
        consensus = 'VERIFIED';
        verificationScore = 70;
    } else if (avgCredibility >= 40) {
        consensus = 'PARTIALLY_VERIFIED';
        verificationScore = 50;
    } else {
        consensus = 'UNVERIFIED';
        verificationScore = 30;
    }

    return {
        consensus,
        verificationScore,
        articleCount: articles.length,
        uniqueSources: uniqueSources.size,
        averageCredibility: Math.round(avgCredibility),
        articles: scoredArticles.map(a => ({
            title: a.title,
            source: a.source,
            fakeProbability: a.score.fakeProbability,
            riskLevel: a.score.riskLevel
        }))
    };
}
