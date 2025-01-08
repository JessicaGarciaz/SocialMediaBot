const db = require('../database/db');

class Account {
    static create(platform, username, token) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO accounts (platform, username, token) VALUES (?, ?, ?)';
            db.getDB().run(sql, [platform, username, token], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, platform, username });
                }
            });
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM accounts WHERE is_active = 1';
            db.getDB().all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM accounts WHERE id = ?';
            db.getDB().get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

module.exports = Account;