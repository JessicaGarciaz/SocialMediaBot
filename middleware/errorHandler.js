const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`Error in ${req.method} ${req.path}`, err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific database errors
    if (err.code === 'SQLITE_CONSTRAINT') {
        statusCode = 400;
        message = 'Database constraint violation';
    } else if (err.code === 'ENOENT') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Something went wrong';
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const notFound = (req, res) => {
    res.status(404).json({
        error: `Route ${req.originalUrl} not found`
    });
};

module.exports = { errorHandler, notFound };