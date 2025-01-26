const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { validatePost } = require('../middleware/validation');
const { postCreationLimiter } = require('../middleware/rateLimiter');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.getAll();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

router.post('/', postCreationLimiter, validatePost, async (req, res, next) => {
    try {
        const { account_id, content, scheduled_time } = req.body;
        const post = await Post.create(account_id, content, scheduled_time);
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const postedAt = status === 'posted' ? new Date().toISOString() : null;
        
        const result = await Post.updateStatus(id, status, postedAt);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post status' });
    }
});

module.exports = router;