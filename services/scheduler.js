const cron = require('node-cron');
const Post = require('../models/Post');
const db = require('../database/db');

class Scheduler {
    constructor() {
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            console.log('Scheduler is already running');
            return;
        }

        console.log('Starting post scheduler...');
        this.isRunning = true;

        // Check for scheduled posts every minute
        this.task = cron.schedule('* * * * *', async () => {
            await this.checkScheduledPosts();
        }, {
            scheduled: false
        });

        this.task.start();
        console.log('Post scheduler started successfully');
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
            // Simulate posting to social media platform
            console.log(`Processing post ${post.id} for ${post.platform} - @${post.username}`);
            console.log(`Content: ${post.content}`);
            
            // For now, just mark as posted
            // In a real implementation, here you would:
            // 1. Make API calls to the respective social media platforms
            // 2. Handle authentication and tokens
            // 3. Deal with rate limits and errors
            
            const success = await this.simulatePost(post);
            
            if (success) {
                await Post.updateStatus(post.id, 'posted', new Date().toISOString());
                console.log(`Successfully posted to ${post.platform}`);
            } else {
                await Post.updateStatus(post.id, 'failed');
                console.log(`Failed to post to ${post.platform}`);
            }
        } catch (error) {
            console.error(`Error processing post ${post.id}:`, error);
            await Post.updateStatus(post.id, 'failed');
        }
    }

    async simulatePost(post) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate 90% success rate
        return Math.random() > 0.1;
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            nextRun: this.task ? this.task.nextDate() : null
        };
    }
}

module.exports = new Scheduler();