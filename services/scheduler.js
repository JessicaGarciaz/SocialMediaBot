const cron = require('node-cron');
const Post = require('../models/Post');
const db = require('../database/db');
const logger = require('../utils/logger');
const config = require('../config/config');
const SocialMediaFactory = require('../integrations/socialMediaFactory');

class Scheduler {
    constructor() {
        this.isRunning = false;
        this.socialMediaFactory = new SocialMediaFactory(config);
    }

    start() {
        if (this.isRunning) {
            logger.warn('Scheduler is already running');
            return;
        }

        logger.info('Starting post scheduler...');
        this.isRunning = true;

        // Check for scheduled posts every minute
        this.task = cron.schedule('* * * * *', async () => {
            await this.checkScheduledPosts();
        }, {
            scheduled: false
        });

        this.task.start();
        logger.info('Post scheduler started successfully');
    }

    stop() {
        if (this.task) {
            this.task.stop();
            this.isRunning = false;
            console.log('Post scheduler stopped');
        }
    }

    async checkScheduledPosts() {
        try {
            const now = new Date().toISOString();
            
            const sql = `
                SELECT p.*, a.platform, a.username, a.token 
                FROM posts p 
                LEFT JOIN accounts a ON p.account_id = a.id 
                WHERE p.scheduled_time <= ? 
                AND p.status = 'pending' 
                AND a.is_active = 1
            `;
            
            db.getDB().all(sql, [now], async (err, rows) => {
                if (err) {
                    console.error('Error fetching scheduled posts:', err);
                    return;
                }

                for (const post of rows) {
                    await this.processPost(post);
                }
            });
        } catch (error) {
            console.error('Error in checkScheduledPosts:', error);
        }
    }

    async processPost(post) {
        try {
            logger.info(`Processing post ${post.id} for ${post.platform} - @${post.username}`);
            logger.debug(`Content: ${post.content.substring(0, 100)}...`);
            
            const account = {
                platform: post.platform,
                username: post.username,
                token: post.token
            };
            
            // Use social media factory to post
            const result = await this.socialMediaFactory.postToSocialMedia(account, post.content);
            
            await Post.updateStatus(post.id, 'posted', new Date().toISOString());
            logger.info(`Successfully posted to ${post.platform} @${post.username}`);
            
        } catch (error) {
            logger.error(`Error processing post ${post.id}`, error);
            await Post.updateStatus(post.id, 'failed');
        }
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            nextRun: this.task ? this.task.nextDate() : null
        };
    }
}

module.exports = new Scheduler();