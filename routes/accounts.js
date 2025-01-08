const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

router.get('/', async (req, res) => {
    try {
        const accounts = await Account.getAll();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { platform, username, token } = req.body;
        const account = await Account.create(platform, username, token);
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create account' });
    }
});

module.exports = router;