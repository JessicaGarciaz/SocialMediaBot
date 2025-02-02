const TwitterAPI = require('./twitterApi');
const logger = require('../utils/logger');

class SocialMediaFactory {
    constructor(config) {
        this.config = config;
        this.integrations = {
            twitter: TwitterAPI
        };
    }

    getIntegration(platform) {
        const IntegrationClass = this.integrations[platform.toLowerCase()];
        
        if (!IntegrationClass) {
            logger.warn(`No integration available for platform: ${platform}`);
            return null;
        }
        
        return new IntegrationClass(this.config);
    }

    async postToSocialMedia(account, content) {
        try {
            const integration = this.getIntegration(account.platform);
            
            if (!integration) {
                throw new Error(`Unsupported platform: ${account.platform}`);
            }
            
            // Authenticate first
            const authenticated = await integration.authenticate(account);
            if (!authenticated) {
                throw new Error('Authentication failed');
            }
            
            // Post content
            const result = await integration.post(account, content);
            return result;
        } catch (error) {
            logger.error(`Failed to post to ${account.platform} @${account.username}`, error);
            throw error;
        }
    }

    async validateAccount(account) {
        try {
            const integration = this.getIntegration(account.platform);
            
            if (!integration) {
                return false;
            }
            
            return await integration.validateCredentials(account);
        } catch (error) {
            logger.error(`Failed to validate account ${account.platform} @${account.username}`, error);
            return false;
        }
    }

    getSupportedPlatforms() {
        return Object.keys(this.integrations);
    }
}

module.exports = SocialMediaFactory;