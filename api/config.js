/* CONFIG.JS: MAIN CONFIGURATION*/

require('dotenv').config();

module.exports = {
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