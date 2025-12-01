// Script to generate config.js from .env file
// Run this script to update config.js with the API_URL from .env
// Usage: node generate-config.js

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const envPath = join(rootDir, '.env');
const configPath = join(__dirname, 'config.js');

try {
    // Read .env file
    const envContent = readFileSync(envPath, 'utf-8');
    const envLines = envContent.split('\n');
    
    // Extract API_URL from .env
    let apiUrl = 'http://localhost:3000'; // default
    for (const line of envLines) {
        const match = line.match(/^API_URL=(.+)$/);
        if (match) {
            apiUrl = match[1].trim();
            break;
        }
    }
    
    // Generate config.js
    const configContent = `// API Configuration
// This file is auto-generated from .env file
// Run 'node generate-config.js' to regenerate

const API_CONFIG = {
    get API_URL() {
        return window.API_URL || '${apiUrl}';
    }
};

// Make it globally available
window.API_CONFIG = API_CONFIG;
`;
    
    writeFileSync(configPath, configContent, 'utf-8');
    console.log(`✓ Generated config.js with API_URL: ${apiUrl}`);
} catch (error) {
    console.error('Error generating config.js:', error.message);
    process.exit(1);
}

