const validateAccount = (req, res, next) => {
    const { platform, username } = req.body;
    
    if (!platform || !username) {
        return res.status(400).json({
            error: 'Platform and username are required'
        });
    }

    const validPlatforms = ['twitter', 'instagram', 'facebook'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
        return res.status(400).json({
            error: 'Invalid platform. Supported: twitter, instagram, facebook'
        });
    }

    if (username.length < 1 || username.length > 50) {
        return res.status(400).json({
            error: 'Username must be between 1 and 50 characters'
        });
    }

    req.body.platform = platform.toLowerCase();
    next();
};

const validatePost = (req, res, next) => {
    const { account_id, content, scheduled_time } = req.body;
    
    if (!account_id || !content) {
        return res.status(400).json({
            error: 'Account ID and content are required'
        });
    }

    if (typeof account_id !== 'number' || account_id <= 0) {
        return res.status(400).json({
            error: 'Invalid account ID'
        });
    }

    if (content.length > 280) {
        return res.status(400).json({
            error: 'Content cannot exceed 280 characters'
        });
    }

    if (scheduled_time && new Date(scheduled_time) <= new Date()) {
        return res.status(400).json({
            error: 'Scheduled time must be in the future'
        });
    }

    next();
};

module.exports = { validateAccount, validatePost };