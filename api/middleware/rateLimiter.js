/* MIDDLEWARE/RATELIMITER.JS - RATE LIMITING CONFIGURATION */

import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import config from '../config.js';

// Determine if we're in production
const isProduction = config.NODE_ENV === 'production';

// Error handler for when rate limit is exceeded
const handler = (req, res) => {
    res.status(429).json({
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
};

// Default rate limiter for general endpoints
export const defaultLimiter = rateLimit({
    windowMs: isProduction ? 15 * 60 * 1000 : 60 * 1000, // 15 min (prod) / 1 min (dev)
    max: isProduction ? 100 : 500, // 100 requests (prod) / 500 (dev)
    message: {
        error: 'Too many requests, please slow down.',
        retryAfter: isProduction ? '15 minutes' : '1 minute'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: ipKeyGenerator, // Properly handles IPv4 and IPv6
    handler,
    // Skip rate limiting when environment variable is set (useful for debugging)
    skip: () => process.env.DISABLE_RATE_LIMIT === 'true'
});

// Strict rate limiter for authentication endpoints (login, register)
export const authLimiter = rateLimit({
    windowMs: isProduction ? 30 * 60 * 1000 : 5 * 60 * 1000, // 30 min (prod) / 5 min (dev)
    max: isProduction ? 5 : 20, // 5 failed attempts (prod) / 20 (dev)
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: isProduction ? '30 minutes' : '5 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: ipKeyGenerator,
    handler,
    skip: () => process.env.DISABLE_RATE_LIMIT === 'true'
});

// Moderate rate limiter for API analysis endpoints (sentiment, fake news detection)
export const analyzeLimiter = rateLimit({
    windowMs: isProduction ? 60 * 1000 : 60 * 1000, // 1 minute
    max: isProduction ? 15 : 60, // 15 requests/min (prod) / 60 (dev)
    message: {
        error: 'Too many analysis requests, please try again later.',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: ipKeyGenerator,
    handler,
    skip: () => process.env.DISABLE_RATE_LIMIT === 'true'
});

// Rate limiter for news API endpoints (Guardian, RSS feeds)
export const newsLimiter = rateLimit({
    windowMs: isProduction ? 60 * 1000 : 60 * 1000, // 1 minute
    max: isProduction ? 20 : 50, // 20 requests/min (prod) / 50 (dev)
    message: {
        error: 'Too many news requests, please try again later.',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: ipKeyGenerator,
    handler,
    skip: () => process.env.DISABLE_RATE_LIMIT === 'true'
});