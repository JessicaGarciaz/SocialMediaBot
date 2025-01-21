const express = require('express');
const path = require('path');
const scheduler = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Start scheduler automatically
    scheduler.start();
});