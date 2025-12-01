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
    // First check environment variable (for Vercel/CI)
    let apiUrl = process.env.API_URL || 'http://localhost:3000';
    
    // If not in env, try to read from .env file (for local development)
    if (!process.env.API_URL) {
        try {
            const envContent = readFileSync(envPath, 'utf-8');
            const envLines = envContent.split('\n');
            
            for (const line of envLines) {
                const match = line.match(/^API_URL=(.+)$/);
                if (match) {
                    apiUrl = match[1].trim();
                    break;
                }
            }
        } catch (fileError) {
            // .env file doesn't exist, use default
            console.log('No .env file found, using default or environment variable');
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

