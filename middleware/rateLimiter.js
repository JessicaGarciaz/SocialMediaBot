const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limit for account creation
const accountCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 account creations per hour
    message: {
        error: 'Too many accounts created from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limit for post creation
const postCreationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 posts per minute
    message: {
        error: 'Too many posts created, please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    accountCreationLimiter,
    postCreationLimiter
};