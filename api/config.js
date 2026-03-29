/* CONFIG.JS: MAIN CONFIGURATION*/

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load .env file in development/local environment
// In production, environment variables will already be set by the hosting service
if (process.env.NODE_ENV !== 'production') {
    // Try to load .env from parent directory (your current setup)
    const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
    if (result.error) {
        // If not found in parent, try current directory
        dotenv.config({ path: path.join(__dirname, '.env') });
    }
}

export default {
    //Server
    PORT: process.env.PORT || 3006,
    NODE_ENV: process.env.NODE_ENV || 'development',

    //News API
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    GUARDIAN_API_KEY: process.env.GUARDIAN_API_KEY,

    //JWT
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: '24h',

    //Frontend URL
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};