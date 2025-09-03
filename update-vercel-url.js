#!/usr/bin/env node

/**
 * Quick script to update your Vercel URL in the API configuration
 * Usage: node update-vercel-url.js https://your-app-name.vercel.app
 */

const fs = require('fs');
const path = require('path');

// Get the Vercel URL from command line arguments
const vercelUrl = process.argv[2];

if (!vercelUrl) {
  console.log('❌ Please provide your Vercel URL');
  console.log('Usage: node update-vercel-url.js https://your-app-name.vercel.app');
  process.exit(1);
}

// Validate URL format
if (!vercelUrl.startsWith('https://') || !vercelUrl.includes('vercel.app')) {
  console.log('❌ Please provide a valid Vercel URL (should start with https:// and contain vercel.app)');
  process.exit(1);
}

const configPath = path.join(__dirname, 'src', 'config', 'api.ts');

try {
  // Read the current config file
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Update the production URLs
  configContent = configContent.replace(
    /baseUrl: 'https:\/\/your-app-name\.vercel\.app\/api'/,
    `baseUrl: '${vercelUrl}/api'`
  );
  
  configContent = configContent.replace(
    /healthUrl: 'https:\/\/your-app-name\.vercel\.app'/,
    `healthUrl: '${vercelUrl}'`
  );
  
  // Write the updated config
  fs.writeFileSync(configPath, configContent);
  
  console.log('✅ Successfully updated API configuration!');
  console.log(`   Production API URL: ${vercelUrl}/api`);
  console.log(`   Health check URL: ${vercelUrl}`);
  console.log('');
  console.log('🚀 Your frontend is now configured to work with your Vercel backend!');
  console.log('   Run "npm run dev" to test locally, or deploy your frontend to test in production.');
  
} catch (error) {
  console.log('❌ Error updating configuration:', error.message);
  process.exit(1);
}
