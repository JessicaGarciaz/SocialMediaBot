const express = require('express');
const path = require('path');
const config = require('./config/config');
const scheduler = require('./services/scheduler');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = config.port;

app.use(express.json());
app.use(express.static('public'));

// Request logging middleware
app.use(requestLogger);

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

const accountsRouter = require('./routes/accounts');
const postsRouter = require('./routes/posts');

app.use('/api/accounts', accountsRouter);
app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/scheduler/status', (req, res) => {
    res.json(scheduler.getStatus());
});

app.post('/api/scheduler/start', (req, res) => {
    scheduler.start();
    res.json({ message: 'Scheduler started' });
});

app.post('/api/scheduler/stop', (req, res) => {
    scheduler.stop();
    res.json({ message: 'Scheduler stopped' });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    
    // Start scheduler automatically
    scheduler.start();
});