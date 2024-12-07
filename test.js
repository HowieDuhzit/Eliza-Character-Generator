import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pdf2md from '@opendocsg/pdf2md';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
    console.log('Running installation tests...\n');

    // Test 1: Check required directories
    try {
        await fs.access(path.join(__dirname, 'uploads'));
        console.log('✓ Uploads directory exists');
    } catch (error) {
        console.error('✗ Uploads directory missing');
        process.exit(1);
    }

    // Test 2: Check required files
    const requiredFiles = [
        'app.js',
        'server.js',
        'index.html',
        'styles.css',
        '.env'
    ];

    for (const file of requiredFiles) {
        try {
            await fs.access(path.join(__dirname, file));
            console.log(`✓ ${file} exists`);
        } catch (error) {
            console.error(`✗ ${file} missing`);
            process.exit(1);
        }
    }

    // Test 3: Check PDF processing
    try {
        const testBuffer = Buffer.from('Test PDF content');
        const uint8Array = new Uint8Array(testBuffer);
        await pdf2md(uint8Array);
        console.log('✓ PDF processing library working');
    } catch (error) {
        console.error('✗ PDF processing library error');
        process.exit(1);
    }

    // Test 4: Check environment variables
    const requiredEnvVars = ['PORT', 'HOST', 'APP_URL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length === 0) {
        console.log('✓ Environment variables set');
    } else {
        console.error(`✗ Missing environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }

    console.log('\nAll tests passed! The installation appears to be working correctly.');
}

runTests().catch(console.error);
