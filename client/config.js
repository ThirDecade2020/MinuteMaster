// API Configuration
// This file is auto-generated from .env file
// Run 'node generate-config.js' to regenerate

const API_CONFIG = {
    get API_URL() {
        return window.API_URL || 'http://localhost:3000';
    }
};

// Make it globally available
window.API_CONFIG = API_CONFIG;
