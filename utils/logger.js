const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '..', 'logs');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    writeToFile(filename, message) {
        const logFile = path.join(this.logDir, filename);
        fs.appendFileSync(logFile, message + '\n');
    }

    info(message) {
        const formatted = this.formatMessage('info', message);
        console.log(formatted);
        this.writeToFile('app.log', formatted);
    }

    error(message, error = null) {
        const errorMessage = error ? `${message}: ${error.message}` : message;
        const formatted = this.formatMessage('error', errorMessage);
        console.error(formatted);
        
        this.writeToFile('app.log', formatted);
        this.writeToFile('error.log', formatted);
        
        if (error && error.stack) {
            this.writeToFile('error.log', error.stack);
        }
    }

    warn(message) {
        const formatted = this.formatMessage('warn', message);
        console.warn(formatted);
        this.writeToFile('app.log', formatted);
    }

    debug(message) {
        if (process.env.NODE_ENV === 'development') {
            const formatted = this.formatMessage('debug', message);
            console.log(formatted);
            this.writeToFile('debug.log', formatted);
        }
    }

    logApiRequest(req, res, responseTime) {
        const message = `${req.method} ${req.path} - ${res.statusCode} - ${responseTime}ms - ${req.ip}`;
        this.info(message);
        this.writeToFile('access.log', this.formatMessage('access', message));
    }
}

module.exports = new Logger();