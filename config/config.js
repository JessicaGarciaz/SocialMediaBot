const path = require('path');

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    database: {
        path: process.env.DB_PATH || path.join(__dirname, '..', 'database', 'socialmedia.db')
    },
    
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    
    socialMedia: {
        twitter: {
            apiKey: process.env.TWITTER_API_KEY,
            apiSecret: process.env.TWITTER_API_SECRET
        },
        instagram: {
            accessToken: process.env.INSTAGRAM_ACCESS_TOKEN
        },
        facebook: {
            accessToken: process.env.FACEBOOK_ACCESS_TOKEN
        }
    },
    
    security: {
        sessionSecret: process.env.SESSION_SECRET || 'default-secret-change-in-production'
    }
};

module.exports = config;