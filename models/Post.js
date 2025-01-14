const db = require('../database/db');

class Post {
    static create(accountId, content, scheduledTime = null) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO posts (account_id, content, scheduled_time) VALUES (?, ?, ?)';
            db.getDB().run(sql, [accountId, content, scheduledTime], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, accountId, content, scheduledTime });
                }
            });
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*, a.platform, a.username 
                FROM posts p 
                LEFT JOIN accounts a ON p.account_id = a.id 
                ORDER BY p.created_at DESC
            `;
            db.getDB().all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static updateStatus(id, status, postedAt = null) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE posts SET status = ?, posted_at = ? WHERE id = ?';
            db.getDB().run(sql, [status, postedAt, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }
}

module.exports = Post;